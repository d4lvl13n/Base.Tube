#!/usr/bin/env node
// @ts-check
/**
 * Bridges the thumbnail pages and the image generator.
 *
 *   node scripts/thumbnail-images.mjs export   list every image still to make (placeholder: true)
 *                                              -> ../docs/thumbnail-images/jobs.json and jobs.csv
 *   node scripts/thumbnail-images.mjs import   take the images the generator saved, convert them to
 *                                              1280x720 WebP under 400 KB, and remove "placeholder: true"
 *
 * The generator saves each image at the job's "dropPath" (PNG, JPG or WebP, any 16:9 size).
 * "import" converts it in place to the final ".webp" name, moves the original out of public/
 * (into ../docs/thumbnail-images/originals/) and marks the entry as real in the content file.
 * Needs ImageMagick ("magick") on the machine. Run both from the blog-nextjs/ folder.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { loadContent } from '../src/components/v2/thumbnail-pages/lib/content.mjs';

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.resolve(APP_ROOT, '..', 'docs', 'thumbnail-images');
const MAX_BYTES = 400 * 1024;
const SOURCE_EXTS = ['.png', '.jpg', '.jpeg', '.webp'];

// Pages built from a TypeScript data file instead of content/thumbnails/*.md.
const BACKGROUNDS_DATA = path.join(APP_ROOT, 'src/components/v2/thumbnail-backgrounds/backgrounds.ts');

/** @typedef {{ page: string, kind: 'gallery' | 'background', file: string, finalPath: string, dropPath: string, prompt: string, alt: string, layout?: string, contentFile: string }} Job */

/** @returns {Promise<Job[]>} */
async function collectJobs() {
  /** @type {Job[]} */
  const jobs = [];
  const index = loadContent({ rootDir: APP_ROOT, fresh: true });
  for (const lp of index.pages) {
    if (!lp.page) continue;
    for (const g of lp.page.gallery) {
      if (!g.placeholder) continue;
      const finalPath = path.join('public', 'thumbnails', lp.slug, g.file);
      jobs.push({
        page: `/thumbnails/${lp.slug}`,
        kind: 'gallery',
        file: g.file,
        finalPath,
        dropPath: finalPath.replace(/\.webp$/, '.png'),
        prompt: g.prompt ?? '',
        alt: g.alt,
        layout: g.layout,
        contentFile: path.join('content', 'thumbnails', `${lp.slug}.md`),
      });
    }
  }
  if (fs.existsSync(BACKGROUNDS_DATA)) {
    const mod = await import(BACKGROUNDS_DATA);
    const list = mod.BACKGROUNDS ?? mod.backgrounds ?? mod.default ?? [];
    for (const b of list) {
      if (!b.placeholder) continue;
      const finalPath = path.join('public', 'thumbnail-backgrounds', b.file);
      jobs.push({
        page: '/youtube-thumbnail-backgrounds',
        kind: 'background',
        file: b.file,
        finalPath,
        dropPath: finalPath.replace(/\.webp$/, '.png'),
        prompt: b.prompt,
        alt: b.alt,
        contentFile: path.relative(APP_ROOT, BACKGROUNDS_DATA),
      });
    }
  }
  return jobs;
}

/** @param {string} s */
const csvCell = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;

async function exportJobs() {
  const jobs = await collectJobs();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, 'jobs.json'), JSON.stringify(jobs, null, 2) + '\n');
  const cols = /** @type {const} */ (['page', 'file', 'dropPath', 'prompt', 'alt', 'layout']);
  const csv = [cols.join(','), ...jobs.map((j) => cols.map((c) => csvCell(j[c] ?? '')).join(','))].join('\n');
  fs.writeFileSync(path.join(OUT_DIR, 'jobs.csv'), csv + '\n');
  const perPage = jobs.reduce((acc, j) => ((acc[j.page] = (acc[j.page] ?? 0) + 1), acc), /** @type {Record<string, number>} */ ({}));
  console.log(`${jobs.length} images to make:`);
  for (const [p, n] of Object.entries(perPage)) console.log(`  ${String(n).padStart(3)}  ${p}`);
  console.log(`\nWritten: ${path.relative(process.cwd(), path.join(OUT_DIR, 'jobs.json'))} and jobs.csv`);
}

/** Converts src to a 1280x720 WebP under MAX_BYTES at dest. */
function toWebp(src, dest) {
  for (const quality of [86, 80, 74, 68, 60, 50]) {
    execFileSync('magick', [src, '-resize', '1280x720^', '-gravity', 'center', '-extent', '1280x720', '-strip', '-quality', String(quality), dest]);
    if (fs.statSync(dest).size <= MAX_BYTES) return quality;
  }
  throw new Error(`${dest} is still over 400 KB at quality 50`);
}

/** Removes "placeholder: true" from one gallery entry of a page's Markdown file. */
function clearMarkdownPlaceholder(contentFile, file) {
  const abs = path.join(APP_ROOT, contentFile);
  const lines = fs.readFileSync(abs, 'utf8').split('\n');
  const start = lines.findIndex((l) => new RegExp(`^\\s*- file:\\s*["']?${file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']?\\s*$`).test(l));
  if (start === -1) return false;
  const indent = lines[start].indexOf('-');
  for (let i = start + 1; i < lines.length; i++) {
    const l = lines[i];
    const lead = l.length - l.trimStart().length;
    if (l.trim() && lead <= indent) break; // next entry or next key
    if (/^\s*placeholder:\s*true\s*$/.test(l)) {
      lines.splice(i, 1);
      fs.writeFileSync(abs, lines.join('\n'));
      return true;
    }
  }
  return false;
}

/** Sets "placeholder: false" for one entry of the backgrounds data file. */
function clearBackgroundPlaceholder(contentFile, file) {
  const abs = path.join(APP_ROOT, contentFile);
  const src = fs.readFileSync(abs, 'utf8');
  const at = src.indexOf(`'${file}'`) !== -1 ? src.indexOf(`'${file}'`) : src.indexOf(`"${file}"`);
  if (at === -1) return false;
  const end = src.indexOf('}', at);
  const block = src.slice(at, end);
  if (!/placeholder:\s*true/.test(block)) return false;
  fs.writeFileSync(abs, src.slice(0, at) + block.replace(/placeholder:\s*true/, 'placeholder: false') + src.slice(end));
  return true;
}

async function importImages() {
  const jobs = await collectJobs();
  let done = 0;
  for (const job of jobs) {
    const base = path.join(APP_ROOT, job.finalPath.replace(/\.webp$/, ''));
    const source = SOURCE_EXTS.map((e) => base + e).find((p) => fs.existsSync(p));
    if (!source) continue;
    // The generator may still be writing this file: leave it for the next run.
    if (Date.now() - fs.statSync(source).mtimeMs < 60_000) continue;
    const dest = path.join(APP_ROOT, job.finalPath);
    const keep = path.join(OUT_DIR, 'originals', path.relative(path.join(APP_ROOT, 'public'), source));
    fs.mkdirSync(path.dirname(keep), { recursive: true });
    fs.copyFileSync(source, keep);
    const tmp = dest + '.tmp.webp';
    const quality = toWebp(source, tmp);
    if (source !== dest) fs.rmSync(source);
    fs.renameSync(tmp, dest);
    const cleared = job.kind === 'gallery' ? clearMarkdownPlaceholder(job.contentFile, job.file) : clearBackgroundPlaceholder(job.contentFile, job.file);
    console.log(`  ok  ${job.finalPath}  (q${quality}, ${Math.round(fs.statSync(dest).size / 1024)} KB)${cleared ? '' : '  !! placeholder flag not found, check ' + job.contentFile}`);
    done++;
  }
  console.log(`\n${done} image(s) imported, ${jobs.length - done} still missing.`);
  if (done) console.log('Next: node scripts/validate-thumbnails.mjs');
}

const cmd = process.argv[2];
if (cmd === 'export') await exportJobs();
else if (cmd === 'import') await importImages();
else {
  console.error('Usage: node scripts/thumbnail-images.mjs export | import');
  process.exit(1);
}
