/**
 * /compare pages: one Markdown file per comparison in content/compare/<slug>.md
 * (YAML frontmatter + a Markdown guide). The file name is the URL slug.
 *
 * Runs at build time only (every /compare page is static). A file with a
 * mistake stops the production build with a message that names the field;
 * in development the page is skipped and the problem is logged.
 *
 * Server-only. Never import this from a client component.
 */

import fs from 'node:fs';
import path from 'node:path';

import { DESCRIPTION_MAX, DESCRIPTION_MIN, TITLE_MAX } from '../thumbnail-pages/lib/config.mjs';
import { parseMarkdown, type Block } from '../thumbnail-pages/lib/markdown-lite.mjs';
import { parseFrontmatter, YamlError } from '../thumbnail-pages/lib/yaml-lite.mjs';

export const COMPARE_PATH = '/compare';
const CONTENT_DIR = path.join(process.cwd(), 'content', 'compare');

export type Edge = 'them' | 'us' | 'tie';

export interface CompareRow {
  criterion: string;
  them: string;
  us: string;
  /** who comes out ahead on this row (shown as a small badge); "tie" shows none */
  edge: Edge;
}

export interface CompareStep {
  name: string;
  text: string;
}

export interface DemoImage {
  src: string;
  alt: string;
  label: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ComparePage {
  slug: string;
  status: 'published' | 'draft';
  updated: string;
  published: string;
  them: string;
  us: string;
  title: string;
  description: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  eyebrow: string;
  h1: string;
  h1Accent: string;
  intro: string;
  verdict: string;
  table: CompareRow[];
  /** One line each, shown under the comparison: "Pick Canva if …" / "Pick Base.Tube if …". */
  pickThem: string;
  pickUs: string;
  whenThem: { title: string; points: string[] };
  whenUs: { title: string; points: string[] };
  steps: { title: string; intro: string; items: CompareStep[] };
  demo: { title: string; video: string; text: string; images: DemoImage[] } | null;
  faq: FaqItem[];
  related: { href: string; label: string }[];
  bodyBlocks: Block[];
}

class ContentError extends Error {}

type Raw = Record<string, unknown>;

function fail(file: string, field: string, message: string): never {
  throw new ContentError(`[compare] content/compare/${file}: "${field}" ${message}`);
}

function str(raw: Raw, key: string, file: string, opts: { optional?: boolean } = {}): string {
  const v = raw[key];
  if (v === undefined || v === null || v === '') {
    if (opts.optional) return '';
    fail(file, key, 'is missing');
  }
  if (typeof v !== 'string' && typeof v !== 'number') fail(file, key, 'must be text');
  return String(v).trim();
}

function list(raw: Raw, key: string, file: string, opts: { optional?: boolean } = {}): unknown[] {
  const v = raw[key];
  if (v === undefined || v === null) {
    if (opts.optional) return [];
    fail(file, key, 'is missing');
  }
  if (!Array.isArray(v)) fail(file, key, 'must be a list');
  return v;
}

function obj(v: unknown, field: string, file: string): Raw {
  if (!v || typeof v !== 'object' || Array.isArray(v)) fail(file, field, 'must be a group of fields');
  return v as Raw;
}

function strings(v: unknown[], field: string, file: string): string[] {
  return v.map((x, i) => {
    if (typeof x !== 'string' || !x.trim()) fail(file, `${field}[${i + 1}]`, 'must be text');
    return x.trim();
  });
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function normalize(raw: Raw, body: string, bodyStartLine: number, file: string): ComparePage {
  const slug = file.replace(/\.md$/, '');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail(file, 'file name', 'must be lowercase words joined by hyphens');

  const status = str(raw, 'status', file);
  if (status !== 'published' && status !== 'draft') fail(file, 'status', 'must be "published" or "draft"');

  const updated = str(raw, 'updated', file);
  const published = str(raw, 'published', file, { optional: true }) || updated;
  if (!DATE_RE.test(updated)) fail(file, 'updated', 'must be a date like 2026-10-26');
  if (!DATE_RE.test(published)) fail(file, 'published', 'must be a date like 2026-10-26');

  const title = str(raw, 'title', file);
  if (title.length > TITLE_MAX) fail(file, 'title', `is ${title.length} characters; keep it to ${TITLE_MAX}`);
  const description = str(raw, 'description', file);
  if (description.length < DESCRIPTION_MIN || description.length > DESCRIPTION_MAX) {
    fail(file, 'description', `is ${description.length} characters; keep it between ${DESCRIPTION_MIN} and ${DESCRIPTION_MAX}`);
  }

  const table = list(raw, 'table', file).map((r, i) => {
    const row = obj(r, `table[${i + 1}]`, file);
    const edge = (str(row, 'edge', file, { optional: true }) || 'tie') as Edge;
    if (!['them', 'us', 'tie'].includes(edge)) fail(file, `table[${i + 1}].edge`, 'must be them, us or tie');
    return { criterion: str(row, 'criterion', file), them: str(row, 'them', file), us: str(row, 'us', file), edge };
  });
  if (table.length < 3) fail(file, 'table', 'needs at least 3 rows');

  const when = (key: 'whenThem' | 'whenUs') => {
    const w = obj(raw[key], key, file);
    return { title: str(w, 'title', file), points: strings(list(w, 'points', file), `${key}.points`, file) };
  };

  const stepsRaw = obj(raw.steps, 'steps', file);
  const steps = {
    title: str(stepsRaw, 'title', file),
    intro: str(stepsRaw, 'intro', file, { optional: true }),
    items: list(stepsRaw, 'items', file).map((s, i) => {
      const st = obj(s, `steps.items[${i + 1}]`, file);
      return { name: str(st, 'name', file), text: str(st, 'text', file) };
    }),
  };

  let demo: ComparePage['demo'] = null;
  if (raw.demo) {
    const d = obj(raw.demo, 'demo', file);
    const images = list(d, 'images', file).map((x, i) => {
      const img = obj(x, `demo.images[${i + 1}]`, file);
      const src = str(img, 'src', file);
      if (!src.startsWith('/') || !fs.existsSync(path.join(process.cwd(), 'public', src))) {
        fail(file, `demo.images[${i + 1}].src`, `points to ${src}, which is not a file in public/`);
      }
      return { src, alt: str(img, 'alt', file), label: str(img, 'label', file) };
    });
    demo = { title: str(d, 'title', file), video: str(d, 'video', file), text: str(d, 'text', file), images };
  }

  const faq = list(raw, 'faq', file).map((f, i) => {
    const item = obj(f, `faq[${i + 1}]`, file);
    return { q: str(item, 'q', file), a: str(item, 'a', file) };
  });
  if (faq.length < 4) fail(file, 'faq', 'needs at least 4 questions');

  const related = list(raw, 'related', file, { optional: true }).map((r, i) => {
    const item = obj(r, `related[${i + 1}]`, file);
    const href = str(item, 'href', file);
    if (!href.startsWith('/')) fail(file, `related[${i + 1}].href`, 'must be a link inside the site, starting with /');
    return { href, label: str(item, 'label', file) };
  });

  const md = parseMarkdown(body, bodyStartLine);
  const mdError = md.problems.find((p) => p.level === 'error');
  if (mdError) fail(file, 'body', `line ${mdError.line}: ${mdError.message}`);

  return {
    slug,
    status,
    updated,
    published,
    them: str(raw, 'them', file),
    us: str(raw, 'us', file),
    title,
    description,
    primaryKeyword: str(raw, 'primaryKeyword', file),
    secondaryKeywords: strings(list(raw, 'secondaryKeywords', file, { optional: true }), 'secondaryKeywords', file),
    eyebrow: str(raw, 'eyebrow', file, { optional: true }),
    h1: str(raw, 'h1', file),
    h1Accent: str(raw, 'h1Accent', file, { optional: true }),
    intro: str(raw, 'intro', file),
    verdict: str(raw, 'verdict', file),
    table,
    pickThem: str(raw, 'pickThem', file, { optional: true }),
    pickUs: str(raw, 'pickUs', file, { optional: true }),
    whenThem: when('whenThem'),
    whenUs: when('whenUs'),
    steps,
    demo,
    faq,
    related,
    bodyBlocks: md.blocks,
  };
}

let cache: ComparePage[] | null = null;

/** Every comparison that can be built (drafts included; they are served with noindex). */
export function getComparePages(): ComparePage[] {
  if (cache && process.env.NODE_ENV === 'production') return cache;
  let files: string[] = [];
  try {
    files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md') && !f.startsWith('_') && f !== 'README.md').sort();
  } catch {
    files = [];
  }
  const pages: ComparePage[] = [];
  for (const file of files) {
    try {
      const { data, body, bodyStartLine } = parseFrontmatter(fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8'));
      pages.push(normalize(data, body, bodyStartLine, file));
    } catch (e) {
      const message = e instanceof YamlError ? `[compare] content/compare/${file}: ${e.message}` : (e as Error).message;
      if (process.env.NODE_ENV === 'production') throw new Error(message);
      console.error(message);
    }
  }
  cache = pages;
  return pages;
}

export function getComparePage(slug: string): ComparePage | undefined {
  return getComparePages().find((p) => p.slug === slug);
}

export function comparePath(slug: string): string {
  return `${COMPARE_PATH}/${slug}`;
}
