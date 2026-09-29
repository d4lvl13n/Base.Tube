/**
 * Canvas engine for the thumbnail resizer. Everything runs in the browser:
 * decode, crop / fit, background, resize and JPG / PNG encoding.
 * Nothing here talks to a server.
 */

export type FitMode = 'crop' | 'fit';
export type BackgroundKind = 'blur' | 'solid';
export type OutputFormat = 'jpeg' | 'png';

/** YouTube thumbnails are 16:9. */
export const ASPECT = 16 / 9;

/** Refuse files that would exhaust memory in most browsers. */
export const MAX_FILE_BYTES = 80 * 1024 * 1024;
export const MAX_PIXELS = 150_000_000;

/** Lowest JPG quality the size limiter is allowed to fall back to. */
export const MIN_AUTO_QUALITY = 0.3;

export interface LoadedImage {
  id: number;
  el: HTMLImageElement;
  url: string;
  name: string;
  width: number;
  height: number;
  /** Half-size copies of the source, level k is width / 2^k. Level 0 is the image itself. */
  mips: Map<number, CanvasImageSource>;
  /** Blurred background renders, one slot for the on-screen stage and one for export. */
  blurCache: Map<string, HTMLCanvasElement>;
  averageColor: string | null;
}

export interface Placement {
  /** 1 = base scale (fill for crop mode, contain for fit mode). */
  zoom: number;
  /** Point of the image (0..1) that sits at the centre of the frame. */
  cx: number;
  cy: number;
}

export interface RenderState {
  mode: FitMode;
  background: BackgroundKind;
  solid: string;
  placement: Placement;
}

let imageCounter = 0;

/* ── Loading ─────────────────────────────────────────────── */

export class LoadError extends Error {}

/**
 * Decode a file with an <img>. Browsers apply the EXIF orientation to <img>
 * elements by default, and drawImage() honours it, so naturalWidth/Height are
 * already the "as the photographer saw it" size.
 */
export async function loadImageFile(file: File): Promise<LoadedImage> {
  if (file.type && !file.type.startsWith('image/')) {
    throw new LoadError('That file is not an image. Choose a JPG, PNG or WebP.');
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new LoadError(
      `That file is ${(file.size / 1024 / 1024).toFixed(0)} MB. Choose an image under ${MAX_FILE_BYTES / 1024 / 1024} MB.`,
    );
  }
  const url = URL.createObjectURL(file);
  const el = new Image();
  el.decoding = 'async';
  el.src = url;
  try {
    await el.decode();
  } catch {
    URL.revokeObjectURL(url);
    throw new LoadError(
      'Your browser could not open that file. Try a JPG, PNG or WebP. HEIC photos need to be exported as JPG first.',
    );
  }
  const width = el.naturalWidth;
  const height = el.naturalHeight;
  if (!width || !height) {
    URL.revokeObjectURL(url);
    throw new LoadError('That image has no readable size. Try another file.');
  }
  if (width * height > MAX_PIXELS) {
    URL.revokeObjectURL(url);
    throw new LoadError(
      `That image is ${(width * height / 1e6).toFixed(0)} megapixels, which is too large to process in a browser. Try a smaller copy.`,
    );
  }
  return {
    id: ++imageCounter,
    el,
    url,
    name: file.name || 'image',
    width,
    height,
    mips: new Map(),
    blurCache: new Map(),
    averageColor: null,
  };
}

export function releaseImage(img: LoadedImage | null) {
  if (!img) return;
  URL.revokeObjectURL(img.url);
  img.mips.clear();
  img.blurCache.clear();
}

function createCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

/* ── Down-scaling ────────────────────────────────────────── */

/**
 * Browsers alias when a big photo is shrunk in one drawImage() call. We keep a
 * chain of half-size copies and always draw from the one that is less than 2x
 * larger than the target, which gives clean results for any source size.
 */
function getMip(img: LoadedImage, level: number): CanvasImageSource {
  if (level <= 0) return img.el;
  const cached = img.mips.get(level);
  if (cached) return cached;
  const prev = getMip(img, level - 1);
  const w = Math.max(1, Math.round(img.width / 2 ** level));
  const h = Math.max(1, Math.round(img.height / 2 ** level));
  const c = createCanvas(w, h);
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(prev, 0, 0, w, h);
  img.mips.set(level, c);
  return c;
}

function mipFor(img: LoadedImage, destWidth: number): { src: CanvasImageSource } {
  const ratio = img.width / Math.max(1, destWidth);
  const level = ratio > 2 ? Math.min(12, Math.floor(Math.log2(ratio))) : 0;
  return { src: getMip(img, level) };
}

/* ── Placement maths (everything in frame units) ─────────── */

export function baseScale(imgW: number, imgH: number, mode: FitMode): number {
  const r = imgW / imgH / ASPECT;
  return mode === 'crop' ? Math.max(1, r) : Math.min(1, r);
}

/** Size of the image as a fraction of the frame width and height. */
export function imageFractions(imgW: number, imgH: number, mode: FitMode, zoom: number) {
  const s = baseScale(imgW, imgH, mode) * zoom;
  const a = imgW / imgH;
  return { w: s, h: (s * ASPECT) / a };
}

function clampAxis(c: number, dim: number): number {
  // Position of the image origin: 0.5 - c * dim. If the image is bigger than the
  // frame it must keep covering it; if it is smaller it must stay inside it.
  let o = 0.5 - c * dim;
  if (dim >= 1) o = Math.min(0, Math.max(1 - dim, o));
  else o = Math.min(1 - dim, Math.max(0, o));
  return o;
}

export function clampPlacement(imgW: number, imgH: number, mode: FitMode, p: Placement): Placement {
  const zoom = Math.min(5, Math.max(1, p.zoom));
  const f = imageFractions(imgW, imgH, mode, zoom);
  const ox = clampAxis(p.cx, f.w);
  const oy = clampAxis(p.cy, f.h);
  return { zoom, cx: (0.5 - ox) / f.w, cy: (0.5 - oy) / f.h };
}

export function placementRect(imgW: number, imgH: number, mode: FitMode, p: Placement) {
  const c = clampPlacement(imgW, imgH, mode, p);
  const f = imageFractions(imgW, imgH, mode, c.zoom);
  return { ox: 0.5 - c.cx * f.w, oy: 0.5 - c.cy * f.h, w: f.w, h: f.h, placement: c };
}

/** True if the image covers the whole frame (no background needed). */
export function coversFrame(imgW: number, imgH: number, mode: FitMode, p: Placement): boolean {
  const r = placementRect(imgW, imgH, mode, p);
  const e = 0.0005;
  return r.ox <= e && r.oy <= e && r.ox + r.w >= 1 - e && r.oy + r.h >= 1 - e;
}

/* ── Background ──────────────────────────────────────────── */

export function averageColor(img: LoadedImage): string {
  if (img.averageColor) return img.averageColor;
  const c = createCanvas(1, 1);
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  const { src } = mipFor(img, 64);
  ctx.drawImage(src, 0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  const hex = (n: number) => n.toString(16).padStart(2, '0');
  img.averageColor = `#${hex(r)}${hex(g)}${hex(b)}`;
  return img.averageColor;
}

function supportsCanvasFilter(ctx: CanvasRenderingContext2D): boolean {
  return typeof ctx.filter === 'string';
}

function blurredBackground(img: LoadedImage, W: number, H: number, slot: string): HTMLCanvasElement {
  const key = `${slot}|${W}x${H}`;
  const hit = img.blurCache.get(key);
  if (hit) return hit;

  const c = createCanvas(W, H);
  const ctx = c.getContext('2d')!;
  const blur = Math.max(2, Math.round(W * 0.03));

  // Start from the average colour so the faded edge of the blur never shows black.
  ctx.fillStyle = averageColor(img);
  ctx.fillRect(0, 0, W, H);

  // Cover the frame plus a margin, so the blur's soft edge falls outside it.
  const margin = 1 + (blur * 6) / W;
  const a = img.width / img.height;
  let dw: number;
  let dh: number;
  if (a >= ASPECT) {
    dh = H * margin;
    dw = dh * a;
  } else {
    dw = W * margin;
    dh = dw / a;
  }
  const dx = (W - dw) / 2;
  const dy = (H - dh) / 2;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  if (supportsCanvasFilter(ctx)) {
    const { src } = mipFor(img, dw);
    ctx.filter = `blur(${blur}px)`;
    ctx.drawImage(src, dx, dy, dw, dh);
    ctx.filter = 'none';
  } else {
    // Safari fallback: repeated smooth up-scaling from a tiny copy looks like a blur.
    const { src } = mipFor(img, dw);
    const s1 = createCanvas(W / 16, H / 16);
    const s1c = s1.getContext('2d')!;
    s1c.imageSmoothingQuality = 'high';
    s1c.drawImage(src, dx / 16, dy / 16, dw / 16, dh / 16);
    const s2 = createCanvas(W / 4, H / 4);
    const s2c = s2.getContext('2d')!;
    s2c.imageSmoothingQuality = 'high';
    s2c.drawImage(s1, 0, 0, s2.width, s2.height);
    ctx.drawImage(s2, 0, 0, W, H);
  }

  // A light dim keeps the sharp foreground image readable against its own blur.
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fillRect(0, 0, W, H);

  // Keep at most two blurred backgrounds (stage + export).
  if (img.blurCache.size >= 2) {
    const first = img.blurCache.keys().next().value;
    if (first !== undefined) img.blurCache.delete(first);
  }
  img.blurCache.set(key, c);
  return c;
}

/* ── Composite ───────────────────────────────────────────── */

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  img: LoadedImage,
  state: RenderState,
  slot: 'stage' | 'export',
) {
  const rect = placementRect(img.width, img.height, state.mode, state.placement);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);
  const covers = coversFrame(img.width, img.height, state.mode, state.placement);

  // Base layer. Also flattens transparent PNGs onto an opaque colour.
  ctx.fillStyle = state.mode === 'fit' && state.background === 'solid' ? state.solid : '#000000';
  ctx.fillRect(0, 0, W, H);
  if (!covers && state.mode === 'fit' && state.background === 'blur') {
    ctx.drawImage(blurredBackground(img, W, H, slot), 0, 0, W, H);
  }

  const dw = rect.w * W;
  const dh = rect.h * H;
  const { src } = mipFor(img, dw);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(src, rect.ox * W, rect.oy * H, dw, dh);
}

/* ── Encoding ────────────────────────────────────────────── */

function toBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Your browser could not encode the image.'))),
      type,
      quality,
    );
  });
}

export interface ExportOptions {
  width: number;
  height: number;
  format: OutputFormat;
  /** 0..1, the quality the user asked for (JPG only). */
  quality: number;
  /** Byte limit, or null for none. */
  limitBytes: number | null;
}

export interface ExportResult {
  blob: Blob;
  width: number;
  height: number;
  format: OutputFormat;
  /** Quality actually used (JPG) or null (PNG). */
  quality: number | null;
  requestedQuality: number;
  /** The limiter had to lower the quality. */
  lowered: boolean;
  /** Still larger than the limit after doing everything we can. */
  overLimit: boolean;
  limitBytes: number | null;
}

export async function exportImage(
  img: LoadedImage,
  state: RenderState,
  opts: ExportOptions,
  isStale: () => boolean,
): Promise<ExportResult | null> {
  const canvas = createCanvas(opts.width, opts.height);
  const ctx = canvas.getContext('2d')!;
  renderFrame(ctx, canvas.width, canvas.height, img, state, 'export');

  const base = {
    width: canvas.width,
    height: canvas.height,
    format: opts.format,
    requestedQuality: opts.quality,
    limitBytes: opts.limitBytes,
  };

  if (opts.format === 'png') {
    const blob = await toBlob(canvas, 'image/png');
    return {
      ...base,
      blob,
      quality: null,
      lowered: false,
      overLimit: opts.limitBytes !== null && blob.size > opts.limitBytes,
    };
  }

  let q = opts.quality;
  let blob = await toBlob(canvas, 'image/jpeg', q);
  if (isStale()) return null;
  if (opts.limitBytes === null || blob.size <= opts.limitBytes) {
    return { ...base, blob, quality: q, lowered: false, overLimit: false };
  }

  // Too big: check the floor first, then search for the highest quality that fits.
  const floorBlob = await toBlob(canvas, 'image/jpeg', MIN_AUTO_QUALITY);
  if (isStale()) return null;
  if (floorBlob.size > opts.limitBytes) {
    return { ...base, blob: floorBlob, quality: MIN_AUTO_QUALITY, lowered: true, overLimit: true };
  }
  let lo = MIN_AUTO_QUALITY;
  let hi = q;
  let best = floorBlob;
  let bestQ = lo;
  for (let i = 0; i < 6; i++) {
    const mid = (lo + hi) / 2;
    const b = await toBlob(canvas, 'image/jpeg', mid);
    if (isStale()) return null;
    if (b.size <= opts.limitBytes) {
      best = b;
      bestQ = mid;
      lo = mid;
    } else {
      hi = mid;
    }
  }
  q = bestQ;
  blob = best;
  return { ...base, blob, quality: q, lowered: true, overLimit: false };
}
