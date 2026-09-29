// @ts-check
/**
 * Checks the gallery image files of a page in public/thumbnails/<slug>/.
 * Used at build time (so a page with missing or wrong-size images is never
 * indexed) and by the validation script.
 */

import fs from 'node:fs';
import path from 'node:path';

/** @typedef {import('./schema.d.mts').Issue} Issue */
/** @typedef {import('./schema.d.mts').ThumbnailPage} ThumbnailPage */

const MAX_IMAGE_BYTES = 400 * 1024;

/**
 * Read width and height from the header of a PNG, JPEG, WebP or AVIF file.
 * @param {Buffer} b
 * @returns {{ width: number, height: number } | null}
 */
export function imageSize(b) {
  // PNG
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) {
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  }
  // JPEG
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) {
        i++;
        continue;
      }
      const marker = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
    return null;
  }
  // WebP
  if (b.length > 30 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = b.toString('ascii', 12, 16);
    if (chunk === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') {
      const bits = b.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (chunk === 'VP8X') return { width: b.readUIntLE(24, 3) + 1, height: b.readUIntLE(27, 3) + 1 };
    return null;
  }
  // AVIF / HEIF: the "ispe" box holds the size
  const ispe = b.indexOf('ispe');
  if (ispe > 0 && b.toString('ascii', 4, 8) === 'ftyp') {
    return { width: b.readUInt32BE(ispe + 8), height: b.readUInt32BE(ispe + 12) };
  }
  return null;
}

/**
 * @param {ThumbnailPage} page
 * @param {string} publicDir absolute path of the app's public/ folder
 * @returns {Issue[]}
 */
export function checkGalleryFiles(page, publicDir) {
  /** @type {Issue[]} */
  const issues = [];
  const folder = path.join(publicDir, 'thumbnails', page.slug);
  if (!fs.existsSync(folder)) {
    if (page.gallery.length) issues.push({ level: 'blocker', field: 'gallery', message: `image folder public/thumbnails/${page.slug}/ does not exist` });
    return issues;
  }
  /** @type {Set<string>} */
  const listed = new Set();
  page.gallery.forEach((g, i) => {
    const f = `gallery[${i + 1}].file`;
    listed.add(g.file);
    const p = path.join(folder, g.file);
    if (!fs.existsSync(p)) {
      issues.push({ level: 'blocker', field: f, message: `public/thumbnails/${page.slug}/${g.file} does not exist` });
      return;
    }
    const buf = fs.readFileSync(p);
    const size = imageSize(buf);
    if (!size) {
      issues.push({ level: 'warning', field: f, message: `could not read the size of ${g.file}` });
    } else {
      const ratio = size.width / size.height;
      if (Math.abs(ratio - 16 / 9) > 0.02) {
        issues.push({ level: 'blocker', field: f, message: `${g.file} is ${size.width}×${size.height}; thumbnails must be 16:9 (1280×720)` });
      } else if (size.width < 1280) {
        issues.push({ level: 'warning', field: f, message: `${g.file} is ${size.width}×${size.height}; use 1280×720` });
      }
      if (i === 0 && (size.width !== 1280 || size.height !== 720)) {
        issues.push({ level: 'warning', field: f, message: 'the first image is also the social-media preview; make it exactly 1280×720' });
      }
    }
    if (buf.length > MAX_IMAGE_BYTES) {
      issues.push({ level: 'warning', field: f, message: `${g.file} is ${Math.round(buf.length / 1024)} KB; export WebP under ${MAX_IMAGE_BYTES / 1024} KB` });
    }
  });
  for (const file of fs.readdirSync(folder)) {
    if (file.startsWith('.')) continue;
    if (!listed.has(file)) issues.push({ level: 'warning', field: 'gallery', message: `public/thumbnails/${page.slug}/${file} is not used by any gallery entry` });
  }
  return issues;
}
