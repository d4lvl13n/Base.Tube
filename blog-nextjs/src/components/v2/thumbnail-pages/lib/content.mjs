// @ts-check
/**
 * Loads content/thumbnails/*.md, runs the schema checks, the checks that need
 * every file at once (duplicate slugs, related pages that exist) and the image
 * file checks, then decides which pages are "live" (indexable + in the sitemap).
 *
 * A page is live only when ALL of these are true:
 *   - status: published
 *   - no error and no blocker: at least MIN_GALLERY_IMAGES images, every image
 *     file present and 16:9, no placeholder images, FAQ long enough, etc.
 * Everything else is still built (so editors can preview it) but is served
 * with "noindex" and left out of the sitemap and the hub.
 *
 * Runs at build time only (all /thumbnails pages are static). The sitemap,
 * which is refreshed on the server every minute, does NOT read these files: it
 * reads live-pages.json, written by scripts/validate-thumbnails.mjs. The build
 * fails if that file is out of date (see assertLiveIndexFresh).
 *
 * Server-only. Never import this from a client component.
 */

import fs from 'node:fs';
import path from 'node:path';

import { BASE_PATH, HUB_MIN_LIVE_PAGES } from './config.mjs';
import { checkGalleryFiles } from './images.mjs';
import { blockLinks } from './markdown-lite.mjs';
import { normalizeHub, normalizePage } from './schema.mjs';
import { parseFrontmatter, YamlError } from './yaml-lite.mjs';

/** @typedef {import('./content.d.mts').LoadedPage} LoadedPage */
/** @typedef {import('./content.d.mts').LoadedHub} LoadedHub */
/** @typedef {import('./content.d.mts').ContentIndex} ContentIndex */
/** @typedef {import('./content.d.mts').LiveIndex} LiveIndex */
/** @typedef {import('./schema.d.mts').Issue} Issue */

/** Files whose name starts with "_" (like _TEMPLATE.md and _hub.md) are not niche pages. */
const HUB_FILE = '_hub.md';

/** Where the sitemap index lives, relative to the app root. */
export const LIVE_INDEX_PATH = path.join('src', 'components', 'v2', 'thumbnail-pages', 'lib', 'live-pages.json');

/** @type {ContentIndex | null} */
let cache = null;

/** @param {string} [rootDir] app root (the folder that contains "content/" and "public/") */
function appRoot(rootDir) {
  return rootDir ?? process.cwd();
}

/**
 * @param {string} dir
 * @param {string} file
 * @returns {{ data: Record<string, unknown>, body: string, bodyStartLine: number } | { error: Issue }}
 */
function readFile(dir, file) {
  let source;
  try {
    source = fs.readFileSync(path.join(dir, file), 'utf8');
  } catch (e) {
    return { error: { level: 'error', field: 'file', message: `cannot be read: ${/** @type {Error} */ (e).message}` } };
  }
  try {
    return parseFrontmatter(source);
  } catch (e) {
    if (e instanceof YamlError) return { error: { level: 'error', field: 'frontmatter', message: e.reason, line: e.line } };
    throw e;
  }
}

/**
 * Read and check every content file.
 * @param {{ rootDir?: string, fresh?: boolean }} [opts]
 * @returns {ContentIndex}
 */
export function loadContent(opts = {}) {
  const useCache = !opts.rootDir && !opts.fresh && process.env.NODE_ENV === 'production';
  if (useCache && cache) return cache;

  const root = appRoot(opts.rootDir);
  const dir = path.join(root, 'content', 'thumbnails');
  const publicDir = path.join(root, 'public');
  /** @type {string[]} */
  let files = [];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
  } catch (e) {
    console.error(`[thumbnails] cannot read the content folder ${dir}: ${/** @type {Error} */ (e).message}`);
    files = [];
  }

  /** @type {LoadedPage[]} */
  const pages = [];
  for (const file of files) {
    if (file.startsWith('_') || file === 'README.md') continue;
    const parsed = readFile(dir, file);
    if ('error' in parsed) {
      pages.push({ file, slug: file.replace(/\.md$/, ''), page: null, issues: [parsed.error], live: false });
      continue;
    }
    const { page, issues } = normalizePage(parsed.data, parsed.body, { file, bodyStartLine: parsed.bodyStartLine });
    if (page && fs.existsSync(publicDir)) issues.push(...checkGalleryFiles(page, publicDir));
    pages.push({ file, slug: page?.slug ?? file.replace(/\.md$/, ''), page, issues, live: false });
  }

  // ── checks across files ─────────────────────────────────
  /** @type {Map<string, LoadedPage[]>} */
  const bySlug = new Map();
  for (const p of pages) bySlug.set(p.slug, [...(bySlug.get(p.slug) ?? []), p]);
  for (const [slug, list] of bySlug) {
    if (list.length > 1) {
      for (const p of list) p.issues.push({ level: 'error', field: 'slug', message: `"${slug}" is used by ${list.map((x) => x.file).join(' and ')}` });
    }
  }
  const known = new Set(pages.filter((p) => p.page).map((p) => p.slug));
  const linkRe = new RegExp(`^${BASE_PATH}/([a-z0-9-]+)/?(?:#.*)?$`);
  for (const p of pages) {
    if (!p.page) continue;
    p.page.related.forEach((s, i) => {
      if (s !== p.slug && !known.has(s)) {
        p.issues.push({ level: 'blocker', field: `related[${i + 1}]`, message: `page "${s}" does not exist yet (add content/thumbnails/${s}.md or remove it from the list)` });
      }
    });
    for (const href of blockLinks(p.page.bodyBlocks)) {
      const m = linkRe.exec(href);
      if (m && !known.has(m[1])) p.issues.push({ level: 'blocker', field: 'body', message: `links to ${href}, which does not exist yet` });
    }
  }
  for (const p of pages) {
    const blocked = p.issues.some((i) => i.level === 'error' || i.level === 'blocker');
    if (p.issues.some((i) => i.level === 'error')) p.page = null;
    p.live = Boolean(p.page && p.page.status === 'published' && !blocked);
  }
  // Tell published pages when a related page exists but is not live yet (its link stays hidden).
  const liveSlugs = new Set(pages.filter((p) => p.live).map((p) => p.slug));
  for (const p of pages) {
    if (!p.page || p.page.status !== 'published') continue;
    for (const s of p.page.related) {
      if (known.has(s) && !liveSlugs.has(s)) p.issues.push({ level: 'warning', field: 'related', message: `"${s}" is not live yet, so its link stays hidden until it is` });
    }
  }

  pages.sort((a, b) => (a.page?.name ?? a.slug).localeCompare(b.page?.name ?? b.slug));

  // ── hub ─────────────────────────────────────────────────
  /** @type {LoadedHub} */
  let hub = { file: HUB_FILE, hub: null, issues: [], live: false };
  if (files.includes(HUB_FILE)) {
    const parsed = readFile(dir, HUB_FILE);
    if ('error' in parsed) hub.issues.push(parsed.error);
    else {
      const res = normalizeHub(parsed.data, parsed.body, { file: HUB_FILE, bodyStartLine: parsed.bodyStartLine });
      hub = { file: HUB_FILE, hub: res.hub, issues: res.issues, live: false };
    }
  } else {
    hub.issues.push({ level: 'error', field: 'file', message: `${HUB_FILE} is missing` });
  }
  const liveCount = pages.filter((p) => p.live).length;
  const hubBlocked = hub.issues.some((i) => i.level === 'error' || i.level === 'blocker');
  if (hub.hub && liveCount < HUB_MIN_LIVE_PAGES) {
    hub.issues.push({ level: 'blocker', field: 'hub', message: `only ${liveCount} page(s) are live; the hub is indexed once ${HUB_MIN_LIVE_PAGES} are` });
  }
  hub.live = Boolean(hub.hub && !hubBlocked && liveCount >= HUB_MIN_LIVE_PAGES);

  const index = { pages, hub };
  if (useCache) cache = index;
  return index;
}

/** Pages that can be built (no errors), drafts included. */
export function getBuildablePages() {
  return loadContent().pages.filter((p) => p.page);
}

/**
 * @param {string} slug
 * @returns {LoadedPage | undefined}
 */
export function getLoadedPage(slug) {
  return loadContent().pages.find((p) => p.slug === slug && p.page);
}

/** Live pages only (published and complete). */
export function getLivePages() {
  return loadContent().pages.filter((p) => p.live);
}

export function getHub() {
  return loadContent().hub;
}

// ── sitemap index ─────────────────────────────────────────

/**
 * What the sitemap needs: the live pages and their last-updated dates.
 * @param {ContentIndex} index
 * @returns {LiveIndex}
 */
export function computeLiveIndex(index) {
  const live = index.pages.filter((p) => p.live && p.page);
  return {
    note: 'Generated by scripts/validate-thumbnails.mjs from content/thumbnails. Do not edit by hand.',
    hub: index.hub.live && index.hub.hub ? { updated: [index.hub.hub.updated, ...live.map((p) => p.page?.updated ?? '')].sort().pop() ?? '' } : null,
    pages: live.map((p) => ({ slug: p.slug, updated: p.page?.updated ?? '' })).sort((a, b) => a.slug.localeCompare(b.slug)),
  };
}

/**
 * @param {string} [rootDir]
 * @returns {LiveIndex | null}
 */
export function readLiveIndexFile(rootDir) {
  try {
    return JSON.parse(fs.readFileSync(path.join(appRoot(rootDir), LIVE_INDEX_PATH), 'utf8'));
  } catch {
    return null;
  }
}

/**
 * @param {LiveIndex | null} a
 * @param {LiveIndex | null} b
 */
export function sameLiveIndex(a, b) {
  const strip = (/** @type {LiveIndex | null} */ x) => (x ? JSON.stringify({ hub: x.hub, pages: x.pages }) : '');
  return strip(a) === strip(b);
}

/**
 * The sitemap reads live-pages.json. At build time, make sure that file says
 * the same thing as the content files; if not, stop the production build
 * (in development, only warn).
 */
export function assertLiveIndexFresh() {
  const expected = computeLiveIndex(loadContent());
  const actual = readLiveIndexFile();
  if (sameLiveIndex(expected, actual)) return;
  const message =
    '[thumbnails] The sitemap index is out of date: the live /thumbnails pages changed. ' +
    'Run "node scripts/validate-thumbnails.mjs" in blog-nextjs/ and commit ' +
    `${LIVE_INDEX_PATH.split(path.sep).join('/')}.`;
  if (process.env.NODE_ENV === 'production') throw new Error(message);
  console.warn(message);
}
