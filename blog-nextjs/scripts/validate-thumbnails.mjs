#!/usr/bin/env node
// @ts-check
/**
 * Checks every page in content/thumbnails/ and updates the sitemap index.
 * Run it from the blog-nextjs/ folder after any change to a page:
 *
 *   node scripts/validate-thumbnails.mjs            check all pages, update the sitemap index
 *   node scripts/validate-thumbnails.mjs fortnite   show one page (or several); the index still covers all pages
 *   node scripts/validate-thumbnails.mjs --check    check only, do not write the index (for CI)
 *   node scripts/validate-thumbnails.mjs --json     machine-readable report (for content pipelines)
 *
 * It uses exactly the same rules as the site (src/components/v2/thumbnail-pages/lib/):
 * the page schema, the related-page and duplicate checks, and the image checks
 * (file exists in public/thumbnails/<slug>/, 16:9, at least 1280 px wide).
 *
 * The sitemap reads src/components/v2/thumbnail-pages/lib/live-pages.json.
 * This script rewrites that file when the list of live pages changes; commit it
 * with your content. The production build stops if it is out of date.
 *
 * Exit code 1 when a file is broken, when a page marked "published" still has
 * something that blocks indexing, or (with --check) when the index is out of
 * date. Drafts never fail the run: their blockers are listed as "to fix".
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { MIN_GALLERY_IMAGES } from '../src/components/v2/thumbnail-pages/lib/config.mjs';
import {
  computeLiveIndex,
  LIVE_INDEX_PATH,
  loadContent,
  readLiveIndexFile,
  sameLiveIndex,
} from '../src/components/v2/thumbnail-pages/lib/content.mjs';

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const checkOnly = args.includes('--check');
const only = args.filter((a) => !a.startsWith('--')).map((a) => a.replace(/\.md$/, ''));

const index = loadContent({ rootDir: APP_ROOT, fresh: true });
let pages = index.pages;
if (only.length) {
  pages = pages.filter((p) => only.includes(p.slug));
  const missing = only.filter((s) => !pages.some((p) => p.slug === s));
  if (missing.length) {
    console.error(`No content file for: ${missing.join(', ')}`);
    process.exit(1);
  }
}

// ── sitemap index ─────────────────────────────────────────
const expectedIndex = computeLiveIndex(index);
const currentIndex = readLiveIndexFile(APP_ROOT);
const indexFresh = sameLiveIndex(expectedIndex, currentIndex);
let indexWritten = false;
if (!indexFresh && !checkOnly) {
  fs.writeFileSync(path.join(APP_ROOT, LIVE_INDEX_PATH), JSON.stringify(expectedIndex, null, 2) + '\n');
  indexWritten = true;
}

// Image folders that have no content file.
const publicDir = path.join(APP_ROOT, 'public', 'thumbnails');
const orphanFolders = fs.existsSync(publicDir)
  ? fs.readdirSync(publicDir).filter((d) => !d.startsWith('.') && !index.pages.some((p) => p.slug === d))
  : [];

const report = pages.map((lp) => {
  const status = lp.page?.status ?? 'unknown';
  const blocking = lp.issues.filter((i) => i.level === 'error' || i.level === 'blocker');
  return {
    file: lp.file,
    slug: lp.slug,
    status,
    live: lp.live,
    readyToPublish: Boolean(lp.page) && blocking.length === 0,
    fails: lp.issues.some((i) => i.level === 'error') || (status === 'published' && blocking.length > 0),
    stats: lp.page
      ? { images: lp.page.gallery.length, minImages: MIN_GALLERY_IMAGES, faq: lp.page.faq.length, words: lp.page.wordCount }
      : null,
    issues: lp.issues,
  };
});
const hubReport = {
  file: index.hub.file,
  live: index.hub.live,
  issues: index.hub.issues,
  fails: index.hub.issues.some((i) => i.level === 'error'),
};
const failed = report.some((r) => r.fails) || hubReport.fails || (checkOnly && !indexFresh);

if (asJson) {
  console.log(
    JSON.stringify(
      {
        ok: !failed,
        sitemapIndex: { upToDate: indexFresh, written: indexWritten, livePages: expectedIndex.pages.map((p) => p.slug) },
        pages: report,
        hub: hubReport,
        orphanImageFolders: orphanFolders,
      },
      null,
      2,
    ),
  );
  process.exit(failed ? 1 : 0);
}

const tty = process.stdout.isTTY;
/** @param {string} code @param {string} s */
const c = (code, s) => (tty ? `\x1b[${code}m${s}\x1b[0m` : s);
const red = (/** @type {string} */ s) => c('31', s);
const yellow = (/** @type {string} */ s) => c('33', s);
const green = (/** @type {string} */ s) => c('32', s);
const dim = (/** @type {string} */ s) => c('2', s);
const bold = (/** @type {string} */ s) => c('1', s);

/** @param {{ field: string, line?: number }} i */
const where = (i) => `${i.field}${i.line ? ` (line ${i.line})` : ''}`;

console.log(bold('\nThumbnail pages — content check\n'));
for (const r of report) {
  const head = r.live
    ? green('LIVE')
    : r.status === 'published'
      ? red('PUBLISHED BUT NOT INDEXABLE')
      : r.status === 'draft'
        ? yellow('DRAFT')
        : red('BROKEN');
  const stats = r.stats ? dim(`  ·  ${r.stats.images}/${r.stats.minImages} images · ${r.stats.faq} FAQ · ~${r.stats.words} words`) : '';
  console.log(`${bold(r.file)}  ${head}${stats}`);
  const errors = r.issues.filter((i) => i.level === 'error');
  const blockers = r.issues.filter((i) => i.level === 'blocker');
  const warnings = r.issues.filter((i) => i.level === 'warning');
  for (const i of errors) console.log(`  ${red('✗ error   ')} ${where(i)}: ${i.message}`);
  for (const i of blockers) {
    const label = r.status === 'published' ? red('✗ blocks  ') : yellow('• to fix  ');
    console.log(`  ${label} ${where(i)}: ${i.message}`);
  }
  for (const i of warnings) console.log(`  ${dim('· warning ')} ${where(i)}: ${i.message}`);
  if (!r.issues.length) console.log(`  ${green('✓ no issues')}`);
  if (r.status === 'draft') {
    console.log(
      r.readyToPublish
        ? green('  → ready to publish: set status: published')
        : dim(`  → not ready to publish yet (${blockers.length + errors.length} item(s) to fix)`),
    );
  }
  console.log('');
}

console.log(`${bold(hubReport.file)}  ${hubReport.live ? green('LIVE') : yellow('NOT INDEXED YET')}`);
for (const i of hubReport.issues) {
  const label = i.level === 'error' ? red('✗ error   ') : i.level === 'blocker' ? yellow('• pending ') : dim('· warning ');
  console.log(`  ${label} ${where(i)}: ${i.message}`);
}
if (!hubReport.issues.length) console.log(`  ${green('✓ no issues')}`);
for (const d of orphanFolders) console.log(dim(`\n· public/thumbnails/${d}/ has images but no content/thumbnails/${d}.md`));

const liveCount = index.pages.filter((p) => p.live).length;
console.log(`\n${liveCount} live page(s), ${index.pages.length - liveCount} not live.`);
if (indexWritten) console.log(yellow(`Sitemap index updated: ${LIVE_INDEX_PATH} (commit this file).`));
else if (!indexFresh) console.log(red(`Sitemap index is out of date: run without --check to update ${LIVE_INDEX_PATH}.`));
else console.log(dim('Sitemap index is up to date.'));
console.log(failed ? red('✗ Validation failed (see above).\n') : green('✓ Validation passed.\n'));
process.exit(failed ? 1 : 0);
