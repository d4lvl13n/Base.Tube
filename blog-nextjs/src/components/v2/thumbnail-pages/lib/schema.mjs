// @ts-check
/**
 * The content schema for /thumbnails/<slug> pages: reads the frontmatter of a
 * content file, checks every field and returns a clean page object plus a list
 * of issues. No file-system access here (see content.mjs), so the same code
 * runs in Next.js and in the validation script.
 *
 * Issue levels
 *   error    the file is broken (bad YAML, wrong type, bad slug). The page is not built.
 *   blocker  the page is built but can NOT be indexed (noindex + not in the sitemap)
 *            until this is fixed. Examples: too few images, placeholder images,
 *            FAQ too short, title too long, "TODO" left in the text.
 *   warning  a quality suggestion. Never blocks anything.
 *
 * Field documentation for writers: content/thumbnails/_TEMPLATE.md and README.md.
 */

import {
  BASE_PATH,
  CATEGORIES,
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  MAX_FAQ,
  MIN_BODY_WORDS,
  MIN_FAQ,
  MIN_GALLERY_IMAGES,
  PAGE_WORDS_MAX,
  PAGE_WORDS_MIN,
  STUDIO_GENERATE_URL,
  TITLE_MAX,
} from './config.mjs';
import { blockLinks, blocksText, countWords, parseMarkdown, stripInline } from './markdown-lite.mjs';

/** @typedef {import('./schema.d.mts').Issue} Issue */
/** @typedef {import('./schema.d.mts').ThumbnailPage} ThumbnailPage */
/** @typedef {import('./schema.d.mts').HubContent} HubContent */

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FILE_RE = /^[a-z0-9][a-z0-9._-]*\.(webp|jpe?g|png|avif)$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const HEX_RE = /^#[0-9a-fA-F]{6}$/;
const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;
const DURATION_RE = /^PT(?=\d)(\d+H)?(\d+M)?(\d+S)?$/;
const UNFINISHED_RE = /\bTODO\b|\bTBD\b|\[verify\]|\[check\]|lorem ipsum|\bXXX\b|^\s*(?:\.\.\.|…)\s*$/im;

const PAGE_FIELDS = [
  'slug', 'status', 'category', 'name', 'updated', 'published', 'title', 'description', 'h1', 'h1Accent',
  'summary', 'primaryKeyword', 'secondaryKeywords', 'intro', 'styleRecipe', 'layouts', 'gallery', 'dos',
  'donts', 'faq', 'related', 'cta', 'trademark', 'video', 'listing', 'headings',
];
const HUB_FIELDS = [
  'title', 'description', 'h1', 'h1Accent', 'intro', 'primaryKeyword', 'secondaryKeywords', 'faq', 'updated',
];
const HEADING_KEYS = ['gallery', 'recipe', 'layouts', 'guide', 'dos', 'faq', 'related', 'listing'];

/**
 * Small helper that reads fields from a plain object and records issues.
 * Text values may contain "{count}", replaced by the number of gallery images,
 * so titles like "24 examples" stay true when images are added.
 */
class Reader {
  /**
   * @param {Record<string, unknown>} data
   * @param {Issue[]} issues
   */
  constructor(data, issues) {
    this.data = data;
    this.issues = issues;
    this.count = Array.isArray(data.gallery) ? String(data.gallery.length) : '0';
  }

  /**
   * @param {Issue['level']} level
   * @param {string} field
   * @param {string} message
   */
  add(level, field, message) {
    this.issues.push({ level, field, message });
  }

  /**
   * Read a text field.
   * @param {Record<string, unknown>} obj
   * @param {string} key
   * @param {string} field full field name for messages
   * @param {{ required?: Issue['level'] | false, max?: number, maxLevel?: Issue['level'] }} [opts]
   * @returns {string}
   */
  text(obj, key, field, opts = {}) {
    const v = obj[key];
    if (v === undefined || v === null || v === '') {
      if (opts.required) this.add(opts.required, field, 'is missing');
      return '';
    }
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    if (typeof v !== 'string') {
      this.add('error', field, 'must be text');
      return '';
    }
    const s = v.trim().replace(/\{count\}/g, this.count);
    if (opts.max && s.length > opts.max) {
      this.add(opts.maxLevel ?? 'warning', field, `is ${s.length} characters; keep it at ${opts.max} or fewer`);
    }
    return s;
  }

  /**
   * Read a list of text values.
   * @param {Record<string, unknown>} obj
   * @param {string} key
   * @param {string} field
   * @returns {string[]}
   */
  textList(obj, key, field) {
    const v = obj[key];
    if (v === undefined || v === null) return [];
    if (!Array.isArray(v)) {
      this.add('error', field, 'must be a list ("- item" lines)');
      return [];
    }
    /** @type {string[]} */
    const out = [];
    v.forEach((item, i) => {
      if (typeof item === 'string' || typeof item === 'number') {
        const s = String(item).trim().replace(/\{count\}/g, this.count);
        if (s) out.push(s);
      } else this.add('error', `${field}[${i + 1}]`, 'must be text');
    });
    return out;
  }

  /**
   * @param {Record<string, unknown>} obj
   * @param {string} key
   * @param {string} field
   * @returns {Record<string, unknown>[]}
   */
  objectList(obj, key, field) {
    const v = obj[key];
    if (v === undefined || v === null) return [];
    if (!Array.isArray(v)) {
      this.add('error', field, 'must be a list of entries ("- key: value")');
      return [];
    }
    /** @type {Record<string, unknown>[]} */
    const out = [];
    v.forEach((item, i) => {
      if (item && typeof item === 'object' && !Array.isArray(item)) out.push(/** @type {Record<string, unknown>} */ (item));
      else this.add('error', `${field}[${i + 1}]`, 'must be an entry with "key: value" lines');
    });
    return out;
  }

  /**
   * @param {Record<string, unknown>} obj
   * @param {string} key
   * @param {string} field
   * @returns {Record<string, unknown> | null}
   */
  object(obj, key, field) {
    const v = obj[key];
    if (v === undefined || v === null) return null;
    if (typeof v !== 'object' || Array.isArray(v)) {
      this.add('error', field, 'must be a group of "key: value" lines (indented under it)');
      return null;
    }
    return /** @type {Record<string, unknown>} */ (v);
  }

  /**
   * @param {Record<string, unknown>} obj
   * @param {string} key
   * @param {string} field
   * @param {Issue['level'] | false} required
   * @returns {string}
   */
  date(obj, key, field, required) {
    const s = this.text(obj, key, field, { required });
    if (!s) return '';
    if (!DATE_RE.test(s) || Number.isNaN(Date.parse(s + 'T00:00:00Z'))) {
      this.add('error', field, `must be a date written YYYY-MM-DD (found "${s}")`);
      return '';
    }
    return s;
  }

  /**
   * @param {string[]} allowed
   * @param {string} where
   * @param {Record<string, unknown>} obj
   */
  unknownKeys(allowed, where, obj) {
    for (const k of Object.keys(obj)) {
      if (!allowed.includes(k)) this.add('warning', where ? `${where}.${k}` : k, 'is not a known field (typo?) and is ignored');
    }
  }
}

/**
 * Does `text` contain `keyword`? Case-insensitive, ignores punctuation, accepts
 * plurals ("thumbnails"), joined words ("mrbeast" for "mr beast") and one extra
 * word in between ("mr beast-style thumbnail").
 * @param {string} text
 * @param {string} keyword
 * @returns {boolean}
 */
export function containsKeyword(text, keyword) {
  const tok = (/** @type {string} */ s) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9]+/).filter(Boolean);
  const words = tok(text);
  const kw = tok(keyword);
  if (!kw.length) return true;
  /** @type {string[][]} */
  const variants = [];
  const n = kw.length;
  const combos = n <= 5 ? 1 << (n - 1) : 1;
  for (let mask = 0; mask < combos; mask++) {
    /** @type {string[]} */
    const v = [kw[0]];
    for (let i = 1; i < n; i++) {
      if (mask & (1 << (i - 1))) v[v.length - 1] += kw[i];
      else v.push(kw[i]);
    }
    variants.push(v);
  }
  const matchWord = (/** @type {string} */ w, /** @type {string} */ k) =>
    w === k || w === k + 's' || w === k + 'es' || (k.length >= 5 && w.startsWith(k));
  for (const v of variants) {
    for (let start = 0; start < words.length; start++) {
      if (!matchWord(words[start], v[0])) continue;
      let pos = start;
      let ok = true;
      for (let i = 1; i < v.length; i++) {
        let found = -1;
        for (let j = pos + 1; j <= Math.min(pos + 2, words.length - 1); j++) {
          if (matchWord(words[j], v[i])) {
            found = j;
            break;
          }
        }
        if (found === -1) {
          ok = false;
          break;
        }
        pos = found;
      }
      if (ok) return true;
    }
  }
  return false;
}

/**
 * Flag words that suggest real brand assets or real people in generator prompts.
 * Negated uses ("no logos", "without screenshots") are fine.
 * @param {string} text
 * @returns {string[]}
 */
function riskyPromptTerms(text) {
  /** @type {string[]} */
  const found = [];
  const re = /\b(logos?|screenshots?|real (?:person|people|player|players)|celebrit(?:y|ies)|official (?:art|artwork|skin|skins|character|characters))\b/gi;
  let m;
  while ((m = re.exec(text))) {
    const before = text.slice(Math.max(0, m.index - 14), m.index).toLowerCase();
    if (/\b(no|without|avoid|not|never)\b[\s\w]*$/.test(before)) continue;
    found.push(m[1].toLowerCase());
  }
  return found;
}

/**
 * Find leftover "TODO", "[verify]", "lorem ipsum"... in any text value.
 * @param {unknown} value
 * @param {string} path
 * @param {(path: string, match: string) => void} report
 */
function scanUnfinished(value, path, report) {
  if (typeof value === 'string') {
    const m = UNFINISHED_RE.exec(value);
    if (m) report(path, m[0].trim());
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => scanUnfinished(v, `${path}[${i + 1}]`, report));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) scanUnfinished(v, path ? `${path}.${k}` : k, report);
  }
}

/**
 * @param {Reader} r
 * @param {Record<string, unknown>} data
 * @returns {{ q: string, a: string }[]}
 */
function readFaq(r, data) {
  return r.objectList(data, 'faq', 'faq').map((item, i) => {
    const f = `faq[${i + 1}]`;
    const q = r.text(item, 'q', `${f}.q`, { required: 'error' });
    const a = r.text(item, 'a', `${f}.a`, { required: 'error' });
    r.unknownKeys(['q', 'a'], f, item);
    if (q && !q.endsWith('?')) r.add('warning', `${f}.q`, 'should be written as a question ending with "?"');
    const aw = countWords(stripInline(a));
    if (a && aw < 15) r.add('warning', `${f}.a`, `is only ${aw} words; a useful answer is usually 30 to 100 words`);
    if (aw > 160) r.add('warning', `${f}.a`, `is ${aw} words; keep answers under 160 words`);
    return { q, a };
  });
}

/**
 * @param {Reader} r
 * @param {string} title
 * @param {string} description
 * @param {string} h1
 * @param {string} h1Accent
 * @param {string} primaryKeyword
 */
function checkSnippet(r, title, description, h1, h1Accent, primaryKeyword) {
  if (title) {
    if (title.length > TITLE_MAX) r.add('blocker', 'title', `is ${title.length} characters; Google cuts titles after about ${TITLE_MAX}. Shorten it`);
    if (/base\.?tube/i.test(title)) r.add('blocker', 'title', 'must not contain "Base.Tube": the site adds " | Base.Tube" automatically');
    if (primaryKeyword && !containsKeyword(title, primaryKeyword)) r.add('blocker', 'title', `must contain the primary keyword "${primaryKeyword}"`);
    if (/\bofficial\b/i.test(title)) r.add('blocker', 'title', 'must not say "official": these pages are independent style guides');
  }
  if (description) {
    if (description.length > DESCRIPTION_MAX) r.add('blocker', 'description', `is ${description.length} characters; keep it at ${DESCRIPTION_MAX} or fewer`);
    else if (description.length < DESCRIPTION_MIN) r.add('warning', 'description', `is only ${description.length} characters; aim for ${DESCRIPTION_MIN}-${DESCRIPTION_MAX}`);
  }
  if (h1 && primaryKeyword && !containsKeyword(`${h1} ${h1Accent}`, primaryKeyword)) {
    r.add('blocker', 'h1', `must contain the primary keyword "${primaryKeyword}"`);
  }
  if (/\bofficial\b/i.test(`${h1} ${h1Accent}`)) {
    r.add('blocker', 'h1', 'must not say "official": these pages are independent style guides');
  }
}

/**
 * Check one niche page. Cross-file checks (duplicate slugs, related pages that
 * do not exist) are done in content.mjs; image files are checked by the
 * validation script.
 *
 * @param {Record<string, unknown>} data parsed frontmatter
 * @param {string} body Markdown body
 * @param {{ file: string, bodyStartLine?: number }} ctx
 * @returns {{ page: ThumbnailPage | null, issues: Issue[] }}
 */
export function normalizePage(data, body, ctx) {
  /** @type {Issue[]} */
  const issues = [];
  const r = new Reader(data, issues);
  const fileSlug = ctx.file.replace(/\.md$/, '');

  r.unknownKeys(PAGE_FIELDS, '', data);

  // ── identity ─────────────────────────────────────────────
  const slug = r.text(data, 'slug', 'slug', { required: 'error' });
  if (slug && !SLUG_RE.test(slug)) r.add('error', 'slug', 'must use lowercase letters, numbers and single hyphens only (e.g. "gorilla-tag")');
  if (slug && slug !== fileSlug) r.add('error', 'slug', `must match the file name: the file is "${ctx.file}" so the slug must be "${fileSlug}"`);

  const status = r.text(data, 'status', 'status', { required: 'error' });
  if (status && status !== 'draft' && status !== 'published') r.add('error', 'status', 'must be "draft" or "published"');

  const category = r.text(data, 'category', 'category', { required: 'error' });
  if (category && !CATEGORIES.includes(/** @type {any} */ (category))) r.add('error', 'category', `must be one of: ${CATEGORIES.join(', ')}`);

  const name = r.text(data, 'name', 'name', { required: 'error', max: 32 });
  const updated = r.date(data, 'updated', 'updated', 'error');
  if (updated && Date.parse(updated + 'T00:00:00Z') > Date.now() + 36 * 3600 * 1000) r.add('warning', 'updated', 'is in the future');
  const published = r.date(data, 'published', 'published', false);

  // ── search snippet & headline ────────────────────────────
  const title = r.text(data, 'title', 'title', { required: 'blocker' });
  const description = r.text(data, 'description', 'description', { required: 'blocker' });
  const h1 = r.text(data, 'h1', 'h1', { required: 'error', max: 70 });
  const h1Accent = r.text(data, 'h1Accent', 'h1Accent', { max: 60 });
  const summary = r.text(data, 'summary', 'summary', { required: 'blocker', max: 140 });
  const primaryKeyword = r.text(data, 'primaryKeyword', 'primaryKeyword', { required: 'blocker' });
  const secondaryKeywords = r.textList(data, 'secondaryKeywords', 'secondaryKeywords');
  checkSnippet(r, title, description, h1, h1Accent, primaryKeyword);

  const intro = r.text(data, 'intro', 'intro', { required: 'blocker' });
  const introWords = countWords(stripInline(intro));
  if (intro && (introWords < 20 || introWords > 90)) r.add('warning', 'intro', `is ${introWords} words; aim for 30-70 words that answer the search directly`);

  // ── style recipe ─────────────────────────────────────────
  const recipeObj = r.object(data, 'styleRecipe', 'styleRecipe');
  if (!recipeObj) r.add('blocker', 'styleRecipe', 'is missing');
  const rec = recipeObj ?? {};
  if (recipeObj) r.unknownKeys(['palette', 'composition', 'text', 'expressions', 'props', 'background'], 'styleRecipe', recipeObj);
  const palette = r.objectList(rec, 'palette', 'styleRecipe.palette').map((c, i) => {
    const f = `styleRecipe.palette[${i + 1}]`;
    r.unknownKeys(['name', 'hex', 'use'], f, c);
    const hex = r.text(c, 'hex', `${f}.hex`, { required: 'error' });
    if (hex && !HEX_RE.test(hex)) r.add('error', `${f}.hex`, `must be a colour code like "#FFB800" (found "${hex}")`);
    return {
      name: r.text(c, 'name', `${f}.name`, { required: 'error', max: 28 }),
      hex: HEX_RE.test(hex) ? hex.toUpperCase() : '#888888',
      use: r.text(c, 'use', `${f}.use`, { required: 'warning', max: 90 }),
    };
  });
  if (recipeObj && palette.length < 2) r.add('blocker', 'styleRecipe.palette', 'needs at least 2 colours');
  if (palette.length > 8) r.add('warning', 'styleRecipe.palette', 'has more than 8 colours; 3 to 6 reads best');
  const styleRecipe = {
    palette,
    composition: r.text(rec, 'composition', 'styleRecipe.composition', { required: recipeObj ? 'blocker' : false }),
    text: r.text(rec, 'text', 'styleRecipe.text', { required: recipeObj ? 'blocker' : false }),
    expressions: r.text(rec, 'expressions', 'styleRecipe.expressions', { required: recipeObj ? 'warning' : false }),
    props: r.textList(rec, 'props', 'styleRecipe.props'),
    background: r.text(rec, 'background', 'styleRecipe.background', { required: recipeObj ? 'blocker' : false }),
  };

  // ── layout recipes ───────────────────────────────────────
  const layouts = r.objectList(data, 'layouts', 'layouts').map((l, i) => {
    const f = `layouts[${i + 1}]`;
    r.unknownKeys(['name', 'description', 'prompt'], f, l);
    return {
      name: r.text(l, 'name', `${f}.name`, { required: 'error', max: 32 }),
      description: r.text(l, 'description', `${f}.description`, { required: 'error' }),
      prompt: r.text(l, 'prompt', `${f}.prompt`, { required: 'warning', max: 300 }),
    };
  });
  if (layouts.length < 3) r.add('warning', 'layouts', `has ${layouts.length} layout recipes; 3 to 6 is the target (the plan asks for 5 on game pages)`);
  if (layouts.length > 8) r.add('warning', 'layouts', 'has more than 8 layout recipes');

  // ── gallery ──────────────────────────────────────────────
  /** @type {Set<string>} */
  const seenFiles = new Set();
  const layoutNames = layouts.map((l) => l.name.toLowerCase());
  const gallery = r.objectList(data, 'gallery', 'gallery').map((g, i) => {
    const f = `gallery[${i + 1}]`;
    r.unknownKeys(['file', 'alt', 'caption', 'prompt', 'notes', 'layout', 'placeholder'], f, g);
    const file = r.text(g, 'file', `${f}.file`, { required: 'error' });
    if (file && !FILE_RE.test(file)) {
      r.add('error', `${f}.file`, 'must be a lowercase file name with no spaces ending in .webp, .jpg, .png or .avif (e.g. "fortnite-victory-01.webp")');
    }
    if (file && seenFiles.has(file)) r.add('error', `${f}.file`, `"${file}" is listed twice`);
    seenFiles.add(file);
    const alt = r.text(g, 'alt', `${f}.alt`, { required: 'blocker' });
    if (alt && alt.length < 15) r.add('warning', `${f}.alt`, 'is very short; describe what is in the image in one sentence');
    if (alt.length > 150) r.add('warning', `${f}.alt`, `is ${alt.length} characters; keep alt text under 150`);
    if (/^(image|picture|photo) of\b/i.test(alt)) r.add('warning', `${f}.alt`, 'do not start with "image of"; describe the content directly');
    const caption = r.text(g, 'caption', `${f}.caption`, { required: 'blocker', max: 110 });
    const prompt = r.text(g, 'prompt', `${f}.prompt`, { required: 'blocker' });
    const layout = r.text(g, 'layout', `${f}.layout`);
    if (layout && layouts.length && !layoutNames.includes(layout.toLowerCase())) {
      r.add('warning', `${f}.layout`, `"${layout}" is not one of the layout names (${layouts.map((l) => l.name).join(', ')})`);
    }
    const placeholder = g.placeholder === true;
    if (g.placeholder !== undefined && typeof g.placeholder !== 'boolean') r.add('error', `${f}.placeholder`, 'must be true or false');
    for (const term of riskyPromptTerms(`${prompt} ${g.notes ?? ''}`)) {
      r.add('warning', `${f}.prompt`, `mentions "${term}": examples must never contain logos, screenshots, official art or real people`);
    }
    return {
      file,
      src: `${BASE_PATH}/${slug || fileSlug}/${file}`,
      alt,
      caption,
      prompt,
      notes: r.text(g, 'notes', `${f}.notes`),
      layout,
      placeholder,
    };
  });
  const placeholders = gallery.filter((g) => g.placeholder).length;
  if (gallery.length < MIN_GALLERY_IMAGES) {
    r.add('blocker', 'gallery', `has ${gallery.length} images; at least ${MIN_GALLERY_IMAGES} are needed before the page can be indexed`);
  }
  if (placeholders) r.add('blocker', 'gallery', `${placeholders} image(s) are marked "placeholder: true"; replace them with real Base.Tube generations`);

  // ── do / don't ───────────────────────────────────────────
  const dos = r.textList(data, 'dos', 'dos');
  const donts = r.textList(data, 'donts', 'donts');
  if (dos.length < 2) r.add('blocker', 'dos', `has ${dos.length} items; add at least 3`);
  else if (dos.length < 3) r.add('warning', 'dos', 'add at least 3 items');
  if (donts.length < 2) r.add('blocker', 'donts', `has ${donts.length} items; add at least 3`);
  else if (donts.length < 3) r.add('warning', 'donts', 'add at least 3 items');

  // ── FAQ ──────────────────────────────────────────────────
  const faq = readFaq(r, data);
  if (faq.length < MIN_FAQ) r.add('blocker', 'faq', `has ${faq.length} questions; at least ${MIN_FAQ} are needed`);
  if (faq.length > MAX_FAQ) r.add('warning', 'faq', `has ${faq.length} questions; keep it to ${MAX_FAQ} or fewer`);

  // ── related pages ────────────────────────────────────────
  const related = r.textList(data, 'related', 'related');
  related.forEach((s, i) => {
    if (!SLUG_RE.test(s)) r.add('error', `related[${i + 1}]`, `"${s}" is not a valid slug (write "roblox", not "/thumbnails/roblox")`);
    if (s === slug) r.add('error', `related[${i + 1}]`, 'a page cannot be related to itself');
  });
  if (new Set(related).size !== related.length) r.add('warning', 'related', 'lists the same page twice');
  if (related.length < 3) r.add('warning', 'related', `lists ${related.length} pages; link 3 to 6 sibling pages`);
  if (related.length > 8) r.add('warning', 'related', 'lists more than 8 pages; 3 to 6 is enough');

  // ── CTA ──────────────────────────────────────────────────
  const ctaObj = r.object(data, 'cta', 'cta') ?? {};
  r.unknownKeys(['style', 'label'], 'cta', ctaObj);
  const ctaStyle = r.text(ctaObj, 'style', 'cta.style') || slug || fileSlug;
  if (!SLUG_RE.test(ctaStyle)) r.add('error', 'cta.style', 'must use lowercase letters, numbers and hyphens (it becomes ?style=... in the Studio link)');
  const cta = {
    style: ctaStyle,
    label: r.text(ctaObj, 'label', 'cta.label', { max: 48 }) || `Generate a ${name || fileSlug}-style thumbnail`,
  };

  // ── trademark & legal ────────────────────────────────────
  const tmObj = r.object(data, 'trademark', 'trademark');
  /** @type {ThumbnailPage['trademark']} */
  let trademark = null;
  if (tmObj) {
    r.unknownKeys(['name', 'owner'], 'trademark', tmObj);
    const tmName = r.text(tmObj, 'name', 'trademark.name', { required: 'error' });
    trademark = tmName ? { name: tmName, owner: r.text(tmObj, 'owner', 'trademark.owner') } : null;
  } else if (category === 'game') {
    r.add('warning', 'trademark', 'game pages should name the trademark and its owner so the page shows the "not affiliated" line');
  }
  if (trademark) {
    const tmLower = trademark.name.toLowerCase();
    gallery.forEach((g, i) => {
      if (g.prompt.toLowerCase().includes(tmLower)) {
        r.add('warning', `gallery[${i + 1}].prompt`, `names "${trademark?.name}": describe the look instead, so the generator never copies protected characters or art`);
      }
    });
    layouts.forEach((l, i) => {
      if (l.prompt.toLowerCase().includes(tmLower)) {
        r.add('warning', `layouts[${i + 1}].prompt`, `names "${trademark?.name}": describe the look instead of naming the game or creator`);
      }
    });
  }

  // ── optional video ───────────────────────────────────────
  const vObj = r.object(data, 'video', 'video');
  /** @type {ThumbnailPage['video']} */
  let video = null;
  if (vObj) {
    r.unknownKeys(['youtubeId', 'title', 'description', 'uploadDate', 'duration'], 'video', vObj);
    const youtubeId = r.text(vObj, 'youtubeId', 'video.youtubeId', { required: 'error' });
    if (youtubeId && !YOUTUBE_ID_RE.test(youtubeId)) r.add('error', 'video.youtubeId', 'must be the 11-character video ID (the part after "v=" in the YouTube URL)');
    const duration = r.text(vObj, 'duration', 'video.duration');
    if (duration && !DURATION_RE.test(duration)) r.add('error', 'video.duration', 'must look like PT1M20S (1 minute 20 seconds)');
    const vTitle = r.text(vObj, 'title', 'video.title', { required: 'error', max: 100 });
    const uploadDate = r.date(vObj, 'uploadDate', 'video.uploadDate', 'error');
    if (youtubeId && YOUTUBE_ID_RE.test(youtubeId) && vTitle && uploadDate) {
      video = {
        youtubeId,
        title: vTitle,
        description: r.text(vObj, 'description', 'video.description') || vTitle,
        uploadDate,
        duration: DURATION_RE.test(duration) ? duration : '',
      };
    }
  }

  // ── optional listing & headings ──────────────────────────
  const listingRaw = r.text(data, 'listing', 'listing');
  /** @type {ThumbnailPage['listing']} */
  let listing = null;
  if (listingRaw) {
    if (CATEGORIES.includes(/** @type {any} */ (listingRaw))) listing = /** @type {any} */ (listingRaw);
    else r.add('error', 'listing', `must be one of: ${CATEGORIES.join(', ')}`);
  }
  const hObj = r.object(data, 'headings', 'headings') ?? {};
  r.unknownKeys(HEADING_KEYS, 'headings', hObj);
  /** @type {Record<string, string>} */
  const headings = {};
  for (const k of HEADING_KEYS) {
    const v = r.text(hObj, k, `headings.${k}`, { max: 90 });
    if (v) headings[k] = v;
  }

  // ── body ─────────────────────────────────────────────────
  const bodyFilled = body.replace(/\{count\}/g, r.count);
  const { blocks: bodyBlocks, problems } = parseMarkdown(bodyFilled, ctx.bodyStartLine ?? 1);
  for (const p of problems) issues.push({ level: p.level === 'error' ? 'blocker' : 'warning', field: 'body', message: p.message, line: p.line });
  const bodyText = blocksText(bodyBlocks);
  const bodyWords = countWords(bodyText);
  if (bodyWords < MIN_BODY_WORDS) r.add('blocker', 'body', `has ${bodyWords} words; the written guide needs at least ${MIN_BODY_WORDS}`);
  const bodyHeadings = bodyBlocks.filter((b) => b.type === 'heading').length;
  if (bodyWords >= MIN_BODY_WORDS && bodyHeadings < 2) r.add('warning', 'body', 'split the guide into sections with "## " headings');
  for (const href of blockLinks(bodyBlocks)) {
    if (/^javascript:/i.test(href)) r.add('error', 'body', `unsafe link "${href}"`);
    else if (!/^(https?:\/\/|\/|#|mailto:)/.test(href)) r.add('warning', 'body', `link "${href}" should start with "/" (this site) or "https://"`);
  }

  // ── whole-page checks ────────────────────────────────────
  const recipeText = [styleRecipe.composition, styleRecipe.text, styleRecipe.expressions, styleRecipe.background, ...styleRecipe.props, ...palette.map((p) => `${p.name} ${p.use}`)].join(' ');
  const pageText = [
    h1, h1Accent, intro, recipeText,
    ...layouts.map((l) => `${l.name} ${l.description}`),
    ...dos, ...donts,
    ...faq.map((q) => `${q.q} ${q.a}`),
    bodyText,
  ].map((t) => stripInline(t)).join('\n');
  const pageWords = countWords(pageText);
  if (pageWords < PAGE_WORDS_MIN) r.add('warning', 'body', `the page has about ${pageWords} words of text; competitors that rank have about 1,100. Aim for ${PAGE_WORDS_MIN}-${PAGE_WORDS_MAX}`);
  if (pageWords > PAGE_WORDS_MAX) r.add('warning', 'body', `the page has about ${pageWords} words; above ${PAGE_WORDS_MAX} it gets long for a gallery page`);
  const searchable = `${title}\n${description}\n${pageText}\n${gallery.map((g) => `${g.alt} ${g.caption}`).join('\n')}`;
  for (const kw of secondaryKeywords) {
    if (!containsKeyword(searchable, kw)) r.add('warning', 'secondaryKeywords', `"${kw}" does not appear anywhere on the page`);
  }
  scanUnfinished({ ...data }, '', (path, match) => r.add('blocker', path || 'frontmatter', `still contains "${match}"`));
  const bodyMatch = UNFINISHED_RE.exec(body);
  if (bodyMatch) r.add('blocker', 'body', `still contains "${bodyMatch[0].trim()}"`);

  const hasError = issues.some((i) => i.level === 'error');
  if (hasError) return { page: null, issues };

  /** @type {ThumbnailPage} */
  const page = {
    slug,
    status: /** @type {'draft' | 'published'} */ (status),
    category: /** @type {ThumbnailPage['category']} */ (category),
    name,
    updated,
    published,
    title,
    description,
    h1,
    h1Accent,
    summary,
    primaryKeyword,
    secondaryKeywords,
    intro,
    styleRecipe,
    layouts,
    gallery,
    dos,
    donts,
    faq,
    related,
    cta,
    trademark,
    video,
    listing,
    headings,
    body: bodyFilled,
    bodyBlocks,
    wordCount: pageWords,
    file: ctx.file,
  };
  return { page, issues };
}

/**
 * Check the hub content file (_hub.md).
 * @param {Record<string, unknown>} data
 * @param {string} body
 * @param {{ file: string, bodyStartLine?: number }} ctx
 * @returns {{ hub: HubContent | null, issues: Issue[] }}
 */
export function normalizeHub(data, body, ctx) {
  /** @type {Issue[]} */
  const issues = [];
  const r = new Reader(data, issues);
  r.unknownKeys(HUB_FIELDS, '', data);
  const title = r.text(data, 'title', 'title', { required: 'error' });
  const description = r.text(data, 'description', 'description', { required: 'error' });
  const h1 = r.text(data, 'h1', 'h1', { required: 'error' });
  const h1Accent = r.text(data, 'h1Accent', 'h1Accent');
  const intro = r.text(data, 'intro', 'intro', { required: 'error' });
  const primaryKeyword = r.text(data, 'primaryKeyword', 'primaryKeyword', { required: 'blocker' });
  const secondaryKeywords = r.textList(data, 'secondaryKeywords', 'secondaryKeywords');
  const updated = r.date(data, 'updated', 'updated', 'error');
  checkSnippet(r, title, description, h1, h1Accent, primaryKeyword);
  const faq = readFaq(r, data);
  if (faq.length < MIN_FAQ) r.add('blocker', 'faq', `has ${faq.length} questions; at least ${MIN_FAQ} are needed`);
  const { blocks: bodyBlocks, problems } = parseMarkdown(body, ctx.bodyStartLine ?? 1);
  for (const p of problems) issues.push({ level: p.level === 'error' ? 'blocker' : 'warning', field: 'body', message: p.message, line: p.line });
  scanUnfinished({ ...data }, '', (path, match) => r.add('blocker', path || 'frontmatter', `still contains "${match}"`));
  if (issues.some((i) => i.level === 'error')) return { hub: null, issues };
  return {
    hub: { title, description, h1, h1Accent, intro, primaryKeyword, secondaryKeywords, faq, updated, body, bodyBlocks, file: ctx.file },
    issues,
  };
}

/**
 * Build a link into the Base.Tube Studio generator.
 * `style` and `prompt` are passed as query parameters; the Studio may or may
 * not use them yet, the link works either way. `ref` tells the Studio which
 * page and which button the visitor came from (no UTM tags on purpose, so
 * analytics keep the visitor's original source).
 *
 * @param {{ style?: string, prompt?: string, ref?: string }} opts
 * @returns {string}
 */
export function studioGenerateUrl(opts) {
  const u = new URL(STUDIO_GENERATE_URL);
  if (opts.style) u.searchParams.set('style', opts.style);
  if (opts.prompt) u.searchParams.set('prompt', opts.prompt);
  if (opts.ref) u.searchParams.set('ref', opts.ref);
  return u.toString();
}
