/**
 * Image loading and the simple, defensible measurements used by the
 * thumbnail tester. Everything here runs in the browser on a canvas:
 * no network, no model, no AI. Plain arithmetic on pixels.
 */

export type VariantId = 'A' | 'B' | 'C';
export const VARIANT_IDS: VariantId[] = ['A', 'B', 'C'];

/** Feed background colours the outline check compares against. */
export const FEED_DARK = '#0f0f0f';
export const FEED_LIGHT = '#ffffff';

/** Below this WCAG contrast ratio two tones are barely distinguishable. */
const BLEND_RATIO = 1.5;

/** Analysis copy size (16:9). */
const AW = 320;
const AH = 180;

/** Outer band (in analysis pixels) compared with the feed background. */
const RING = 5;

/** Box-blur radius (analysis pixels) for the "at a glance" measure: about 2% of the width. */
const GLANCE_RADIUS = 7;

/**
 * Patch under a typical desktop duration badge, as fractions of the image.
 * Roughly 13% wide by 11% tall, sitting a few pixels in from the corner.
 */
export const BADGE_ZONE = { x0: 0.853, x1: 0.988, y0: 0.873, y1: 0.979 };

export const ACCEPTED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/bmp',
];
export const MAX_BYTES = 25 * 1024 * 1024;

export interface VariantStats {
  /** Average brightness, 0 (black) to 100 (white). */
  brightness: number;
  /** Light-to-dark spread (5th to 95th percentile of brightness), 0 to 100. */
  tonalRange: number;
  /** The same spread after a blur of about 2% of the width, 0 to 100. */
  glanceRange: number;
  /** Average saturation of non-black pixels, 0 to 100. */
  saturation: number;
  /** Share (0 to 100) of the outer edge within 1.5:1 contrast of a dark feed. */
  edgeDark: number;
  /** Share (0 to 100) of the outer edge within 1.5:1 contrast of a light feed. */
  edgeLight: number;
  /** Edge strength under the badge patch divided by the image average. */
  badgeDetail: number;
}

export interface Variant {
  id: VariantId;
  fileName: string;
  fileBytes: number;
  sourceWidth: number;
  sourceHeight: number;
  /** Object URL of the copy cropped to 16:9 (used by every view). */
  url: string;
  aspectOk: boolean;
  belowHd: boolean;
  stats: VariantStats;
}

export class ImageLoadError extends Error {}

/* ─── Loading ─────────────────────────────────────────────── */

type Decoded = { source: CanvasImageSource; width: number; height: number; release: () => void };

async function decode(file: File): Promise<Decoded> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bmp = await createImageBitmap(file);
      return { source: bmp, width: bmp.width, height: bmp.height, release: () => bmp.close() };
    } catch {
      /* fall through to the <img> path */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return {
      source: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      release: () => URL.revokeObjectURL(url),
    };
  } catch {
    URL.revokeObjectURL(url);
    throw new ImageLoadError('This file could not be read as an image. Try a JPG, PNG or WebP.');
  }
}

function toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new ImageLoadError('Could not prepare the image.'))), 'image/png');
  });
}

export async function loadVariant(file: File, id: VariantId): Promise<Variant> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new ImageLoadError('Use a JPG, PNG, WebP, GIF or AVIF image.');
  }
  if (file.size > MAX_BYTES) {
    throw new ImageLoadError('This image is over 25 MB. Export a smaller copy and try again.');
  }

  const decoded = await decode(file);
  try {
    const { width: sw, height: sh } = decoded;
    if (!sw || !sh) throw new ImageLoadError('This image has no readable size.');

    // Centre-crop to 16:9 so every view and every measurement uses the same frame.
    const target = 16 / 9;
    let cw = sw;
    let ch = sh;
    if (sw / sh > target) cw = Math.round(sh * target);
    else ch = Math.round(sw / target);
    const sx = (sw - cw) / 2;
    const sy = (sh - ch) / 2;

    const outW = Math.min(cw, 1920);
    const outH = Math.round((outW * 9) / 16);
    const out = document.createElement('canvas');
    out.width = outW;
    out.height = outH;
    const octx = out.getContext('2d');
    if (!octx) throw new ImageLoadError('Your browser could not create a drawing surface.');
    octx.imageSmoothingQuality = 'high';
    octx.drawImage(decoded.source, sx, sy, cw, ch, 0, 0, outW, outH);

    const small = document.createElement('canvas');
    small.width = AW;
    small.height = AH;
    const sctx = small.getContext('2d', { willReadFrequently: true });
    if (!sctx) throw new ImageLoadError('Your browser could not create a drawing surface.');
    sctx.imageSmoothingQuality = 'high';
    sctx.drawImage(out, 0, 0, AW, AH);
    const { data } = sctx.getImageData(0, 0, AW, AH);

    const blob = await toBlob(out);

    return {
      id,
      fileName: file.name,
      fileBytes: file.size,
      sourceWidth: sw,
      sourceHeight: sh,
      url: URL.createObjectURL(blob),
      aspectOk: Math.abs(sw / sh - target) < 0.02,
      belowHd: sw < 1280 || sh < 720,
      stats: computeStats(data, AW, AH),
    };
  } finally {
    decoded.release();
  }
}

/* ─── Measurements ────────────────────────────────────────── */

const LIN = new Float32Array(256);
for (let i = 0; i < 256; i++) {
  const c = i / 255;
  LIN[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

const relLum = (r: number, g: number, b: number) => 0.2126 * LIN[r] + 0.7152 * LIN[g] + 0.0722 * LIN[b];
const contrastRatio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const BG_DARK_L = relLum(15, 15, 15);
const BG_LIGHT_L = 1;

function percentile(hist: Uint32Array, total: number, p: number): number {
  const target = total * p;
  let acc = 0;
  for (let i = 0; i < hist.length; i++) {
    acc += hist[i];
    if (acc >= target) return i;
  }
  return hist.length - 1;
}

function blurPass(src: Float32Array, dst: Float32Array, w: number, h: number, r: number, horizontal: boolean) {
  const len = horizontal ? w : h;
  const lines = horizontal ? h : w;
  const norm = 1 / (2 * r + 1);
  for (let line = 0; line < lines; line++) {
    for (let i = 0; i < len; i++) {
      let sum = 0;
      for (let k = -r; k <= r; k++) {
        const j = Math.min(len - 1, Math.max(0, i + k));
        sum += horizontal ? src[line * w + j] : src[j * w + line];
      }
      if (horizontal) dst[line * w + i] = sum * norm;
      else dst[i * w + line] = sum * norm;
    }
  }
}

function boxBlur(src: Float32Array, w: number, h: number, r: number): Float32Array {
  // Two horizontal + vertical passes approximate a Gaussian blur.
  const t1 = new Float32Array(src.length);
  const t2 = new Float32Array(src.length);
  blurPass(src, t1, w, h, r, true);
  blurPass(t1, t2, w, h, r, false);
  blurPass(t2, t1, w, h, r, true);
  blurPass(t1, t2, w, h, r, false);
  return t2;
}

export function computeStats(data: Uint8ClampedArray, w: number, h: number): VariantStats {
  const n = w * h;
  const luma = new Float32Array(n);
  const hist = new Uint32Array(256);

  let sumY = 0;
  let satSum = 0;
  let satCount = 0;
  let ringTotal = 0;
  let ringDark = 0;
  let ringLight = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const o = i * 4;
      const r = data[o];
      const g = data[o + 1];
      const b = data[o + 2];

      // Brightness the way the eye weights the channels (values stay gamma-encoded, 0 to 1).
      const yv = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      luma[i] = yv;
      sumY += yv;
      hist[Math.round(yv * 255)]++;

      const mx = Math.max(r, g, b);
      const mn = Math.min(r, g, b);
      if (mx >= 31) {
        satSum += (mx - mn) / mx;
        satCount++;
      }

      if (x < RING || x >= w - RING || y < RING || y >= h - RING) {
        const l = relLum(r, g, b);
        ringTotal++;
        if (contrastRatio(l, BG_DARK_L) < BLEND_RATIO) ringDark++;
        if (contrastRatio(l, BG_LIGHT_L) < BLEND_RATIO) ringLight++;
      }
    }
  }

  const range = (hst: Uint32Array, total: number) =>
    ((percentile(hst, total, 0.95) - percentile(hst, total, 0.05)) / 255) * 100;

  // Blurred copy for the "at a glance" measure.
  const blurred = boxBlur(luma, w, h, GLANCE_RADIUS);
  const bhist = new Uint32Array(256);
  for (let i = 0; i < n; i++) bhist[Math.min(255, Math.round(blurred[i] * 255))]++;

  // Edge strength (Sobel) across the image and inside the badge patch.
  const zx0 = Math.max(1, Math.floor(BADGE_ZONE.x0 * w));
  const zx1 = Math.min(w - 2, Math.ceil(BADGE_ZONE.x1 * w));
  const zy0 = Math.max(1, Math.floor(BADGE_ZONE.y0 * h));
  const zy1 = Math.min(h - 2, Math.ceil(BADGE_ZONE.y1 * h));
  let gAll = 0;
  let gAllN = 0;
  let gZone = 0;
  let gZoneN = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const gx =
        -luma[i - w - 1] + luma[i - w + 1] - 2 * luma[i - 1] + 2 * luma[i + 1] - luma[i + w - 1] + luma[i + w + 1];
      const gy =
        -luma[i - w - 1] - 2 * luma[i - w] - luma[i - w + 1] + luma[i + w - 1] + 2 * luma[i + w] + luma[i + w + 1];
      const mag = Math.sqrt(gx * gx + gy * gy);
      gAll += mag;
      gAllN++;
      if (x >= zx0 && x <= zx1 && y >= zy0 && y <= zy1) {
        gZone += mag;
        gZoneN++;
      }
    }
  }
  const meanAll = gAllN ? gAll / gAllN : 0;
  const meanZone = gZoneN ? gZone / gZoneN : 0;

  return {
    brightness: (sumY / n) * 100,
    tonalRange: range(hist, n),
    glanceRange: range(bhist, n),
    saturation: satCount ? (satSum / satCount) * 100 : 0,
    edgeDark: (ringDark / ringTotal) * 100,
    edgeLight: (ringLight / ringTotal) * 100,
    badgeDetail: meanAll > 1e-4 ? meanZone / meanAll : 1,
  };
}

/* ─── Observations (never a score, never a winner) ───────── */

const pct = (v: number) => `${Math.round(v)}%`;
const times = (v: number) => `${v.toFixed(1)}x`;

function join(ids: string[]): string {
  if (ids.length <= 1) return ids.join('');
  return `${ids.slice(0, -1).join(', ')} and ${ids[ids.length - 1]}`;
}

interface Rank {
  hi: Variant;
  lo: Variant;
  hiV: number;
  loV: number;
}

function rank(variants: Variant[], pick: (s: VariantStats) => number): Rank {
  const sorted = [...variants].sort((a, b) => pick(b.stats) - pick(a.stats));
  const hi = sorted[0];
  const lo = sorted[sorted.length - 1];
  return { hi, lo, hiV: pick(hi.stats), loV: pick(lo.stats) };
}

export function buildObservations(variants: Variant[]): string[] {
  if (variants.length < 2) return [];
  const ids = join(variants.map((v) => v.id));
  const out: string[] = [];

  const bright = rank(variants, (s) => s.brightness);
  out.push(
    bright.hiV - bright.loV < 8
      ? `${ids} have a similar average brightness (${pct(bright.loV)} to ${pct(bright.hiV)}).`
      : `${bright.hi.id} is the brightest (${pct(bright.hiV)}) and ${bright.lo.id} the darkest (${pct(bright.loV)}).`
  );

  const tone = rank(variants, (s) => s.tonalRange);
  out.push(
    tone.hiV - tone.loV < 8
      ? `${ids} have a similar spread between light and dark (${pct(tone.loV)} to ${pct(tone.hiV)}).`
      : `${tone.hi.id} has the widest spread between its lightest and darkest parts (${pct(tone.hiV)}). ${tone.lo.id} has the narrowest (${pct(tone.loV)}).`
  );

  const glance = rank(variants, (s) => s.glanceRange);
  out.push(
    glance.hiV - glance.loV < 8
      ? `After a blur, ${ids} keep a similar light-to-dark difference (${pct(glance.loV)} to ${pct(glance.hiV)}).`
      : `After a blur, ${glance.hi.id} keeps the most light-to-dark difference (${pct(glance.hiV)}). ${glance.lo.id} keeps the least (${pct(glance.loV)}).`
  );

  const sat = rank(variants, (s) => s.saturation);
  out.push(
    sat.hiV - sat.loV < 8
      ? `${ids} are about equally colourful (average saturation ${pct(sat.loV)} to ${pct(sat.hiV)}).`
      : `${sat.hi.id} is the most colourful (average saturation ${pct(sat.hiV)}). ${sat.lo.id} is the least (${pct(sat.loV)}).`
  );

  const dark = rank(variants, (s) => s.edgeDark);
  if (dark.hiV < 10) {
    out.push('The outer edge of every variant stands out from a dark-mode feed background.');
  } else if (dark.hiV - dark.loV < 15) {
    out.push(
      `On a dark-mode feed, ${ids} blend into the background at the edges about equally (${pct(dark.loV)} to ${pct(dark.hiV)} of the outline).`
    );
  } else {
    out.push(
      `On a dark-mode feed, ${pct(dark.hiV)} of ${dark.hi.id}'s outer edge is barely distinguishable from the background, against ${pct(dark.loV)} for ${dark.lo.id}.`
    );
  }

  const light = rank(variants, (s) => s.edgeLight);
  if (light.hiV < 10) {
    out.push('The outer edge of every variant stands out from a light-mode feed background.');
  } else if (light.hiV - light.loV < 15) {
    out.push(
      `On a light-mode feed, ${ids} blend into the background at the edges about equally (${pct(light.loV)} to ${pct(light.hiV)} of the outline).`
    );
  } else {
    out.push(
      `On a light-mode feed, ${pct(light.hiV)} of ${light.hi.id}'s outer edge is barely distinguishable from the background, against ${pct(light.loV)} for ${light.lo.id}.`
    );
  }

  const badge = rank(variants, (s) => s.badgeDetail);
  if (badge.hiV < 1.5) {
    out.push('No variant has notably more detail than average in the corner the duration badge covers.');
  } else if (badge.hiV - badge.loV < 0.5) {
    out.push(`${ids} all have busy detail in the badge corner (${times(badge.loV)} to ${times(badge.hiV)} the image average).`);
  } else {
    out.push(
      `The duration badge covers the most detail on ${badge.hi.id} (${times(badge.hiV)} the image average) and the least on ${badge.lo.id} (${times(badge.loV)}).`
    );
  }

  const low = variants.filter((v) => v.belowHd);
  if (low.length) {
    const dims = low.map((v) => `${v.id} (${v.sourceWidth} x ${v.sourceHeight})`);
    out.push(
      `${join(dims)} ${low.length > 1 ? 'are' : 'is'} below 1280 x 720. YouTube's A/B test downscales every option to 480p if any one is below 720p.`
    );
  }
  const off = variants.filter((v) => !v.aspectOk);
  if (off.length) {
    out.push(
      `${join(off.map((v) => v.id))} ${off.length > 1 ? 'are' : 'is'} not 16:9, so ${off.length > 1 ? 'they are' : 'it is'} cropped to 16:9 here.`
    );
  }

  return out;
}
