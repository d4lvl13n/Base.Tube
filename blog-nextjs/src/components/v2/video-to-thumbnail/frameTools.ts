// Browser-only helpers for the video-to-thumbnail tool.
// Everything here runs on the visitor's device: <video>, <canvas>, File API.

export type AspectMode = '16:9' | '9:16';

export const ASPECTS: Record<AspectMode, { ratio: number; w: number; h: number; short: string }> = {
  '16:9': { ratio: 16 / 9, w: 1280, h: 720, short: '16:9' },
  '9:16': { ratio: 9 / 16, w: 1080, h: 1920, short: '9:16' },
};

export interface Crop {
  /** 1 = the largest crop of this shape that fits; 0.25 = zoomed in 4x. */
  s: number;
  /** Centre of the crop, as a fraction of the frame width / height. */
  cx: number;
  cy: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Crop rectangle in source pixels for a given target shape. */
export function cropRect(fw: number, fh: number, ratio: number, crop: Crop): Rect {
  const maxW = fw / fh >= ratio ? fh * ratio : fw;
  const maxH = maxW / ratio;
  const w = maxW * crop.s;
  const h = maxH * crop.s;
  const x = clamp(crop.cx * fw - w / 2, 0, Math.max(0, fw - w));
  const y = clamp(crop.cy * fh - h / 2, 0, Math.max(0, fh - h));
  return { x, y, w, h };
}

// ─── Formatting ────────────────────────────────────────────

export function formatTime(t: number): string {
  if (!Number.isFinite(t) || t < 0) t = 0;
  const totalMs = Math.round(t * 1000);
  const ms = totalMs % 1000;
  const totalSec = Math.floor(totalMs / 1000);
  const sec = totalSec % 60;
  const min = Math.floor(totalSec / 60) % 60;
  const hr = Math.floor(totalSec / 3600);
  const pad = (n: number, l = 2) => String(n).padStart(l, '0');
  return hr > 0
    ? `${hr}:${pad(min)}:${pad(sec)}.${pad(ms, 3)}`
    : `${min}:${pad(sec)}.${pad(ms, 3)}`;
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function formatFps(fps: number): string {
  return Number.isInteger(fps) ? `${fps}` : fps.toFixed(2);
}

export function fileBaseName(name: string): string {
  const base = name.replace(/\.[^.]+$/, '');
  const clean = base.replace(/[^a-zA-Z0-9-_]+/g, '-').replace(/^-+|-+$/g, '');
  return clean.slice(0, 48) || 'video';
}

export function timeForFilename(t: number): string {
  const totalMs = Math.round(t * 1000);
  const ms = totalMs % 1000;
  const sec = Math.floor(totalMs / 1000);
  return `${Math.floor(sec / 60)}m${String(sec % 60).padStart(2, '0')}s${String(ms).padStart(3, '0')}`;
}

// ─── Video plumbing ────────────────────────────────────────

/** Frame rates we snap a measured rate to. */
const COMMON_FPS = [
  24000 / 1001,
  24,
  25,
  30000 / 1001,
  30,
  48000 / 1001,
  48,
  50,
  60000 / 1001,
  60,
];

export function snapFps(raw: number): number {
  let best = raw;
  let bestErr = Infinity;
  for (const c of COMMON_FPS) {
    const err = Math.abs(raw - c) / c;
    if (err < bestErr) {
      bestErr = err;
      best = c;
    }
  }
  if (bestErr < 0.005) return Math.round(best * 1000) / 1000;
  return Math.round(raw * 100) / 100;
}

function once(target: EventTarget, events: string[], timeoutMs: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const handlers: [string, () => void][] = [];
    const cleanup = () => {
      clearTimeout(timer);
      handlers.forEach(([name, fn]) => target.removeEventListener(name, fn));
    };
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('timeout'));
    }, timeoutMs);
    events.forEach((name) => {
      const fn = () => {
        cleanup();
        if (name === 'error') reject(new Error('error'));
        else resolve(name);
      };
      handlers.push([name, fn]);
      target.addEventListener(name, fn, { once: true });
    });
  });
}

/** Wait until the element has decoded at least its first frame. */
export async function ensureFrameReady(video: HTMLVideoElement, timeoutMs = 15000): Promise<void> {
  if (video.readyState >= 2) return;
  await once(video, ['loadeddata', 'canplay', 'error'], timeoutMs);
}

/** Seek and resolve when the frame at `time` is ready to be drawn. */
export async function seekVideo(video: HTMLVideoElement, time: number, timeoutMs = 8000): Promise<void> {
  const dur = Number.isFinite(video.duration) ? video.duration : time;
  const target = clamp(time, 0, Math.max(0, dur));
  if (Math.abs(video.currentTime - target) < 1e-6 && !video.seeking && video.readyState >= 2) return;
  const wait = once(video, ['seeked', 'error'], timeoutMs);
  video.currentTime = target;
  await wait;
  if (video.readyState < 2) await ensureFrameReady(video, timeoutMs);
}

/**
 * Measure the frame rate by playing the (hidden, muted) video for a moment and
 * reading the presentation timestamps of consecutive frames. Returns null when
 * the browser cannot tell us (no requestVideoFrameCallback).
 */
export function estimateFps(video: HTMLVideoElement, maxMs = 1500): Promise<number | null> {
  if (!('requestVideoFrameCallback' in video)) return Promise.resolve(null);
  return new Promise((resolve) => {
    const deltas: number[] = [];
    let lastPresented = -1;
    let lastMedia = -1;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      video.pause();
      if (deltas.length < 4) {
        resolve(null);
        return;
      }
      // Some containers (WebM) round timestamps to whole milliseconds, so single gaps
      // wobble (33 ms, 34 ms). Average the gaps that are close to the median instead.
      const sorted = [...deltas].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      const steady = deltas.filter((d) => d > median * 0.6 && d < median * 1.6);
      const mean = steady.reduce((sum, d) => sum + d, 0) / Math.max(1, steady.length);
      resolve(mean > 0 ? snapFps(1 / mean) : null);
    };

    const timer = setTimeout(finish, maxMs);

    const onFrame = (_now: number, meta: VideoFrameCallbackMetadata) => {
      if (finished) return;
      if (lastPresented >= 0 && meta.presentedFrames === lastPresented + 1 && meta.mediaTime > lastMedia) {
        deltas.push(meta.mediaTime - lastMedia);
      }
      lastPresented = meta.presentedFrames;
      lastMedia = meta.mediaTime;
      if (deltas.length >= 14) finish();
      else video.requestVideoFrameCallback(onFrame);
    };

    video.muted = true;
    video.playbackRate = 1;
    video.requestVideoFrameCallback(onFrame);
    video.play().catch(finish);
  });
}

// ─── Canvas plumbing ───────────────────────────────────────

export function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not encode image'))),
      type,
      quality,
    );
  });
}

function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

/** A downsized JPEG of what the video is showing right now (for the filmstrip and the crop editor). */
export async function makePreviewUrl(video: HTMLVideoElement, maxW = 960): Promise<string> {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  const w = Math.min(vw, maxW);
  const h = Math.round((w * vh) / vw);
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const blob = await canvasToBlob(canvas, 'image/jpeg', 0.86);
  return URL.createObjectURL(blob);
}

/** The current frame at the video's native resolution. */
export function renderNativeCanvas(video: HTMLVideoElement): HTMLCanvasElement {
  const canvas = makeCanvas(video.videoWidth, video.videoHeight);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/**
 * Crop `rect` out of `src` and scale it to dw x dh. Large reductions are done
 * in halving steps so the result stays smooth instead of aliased.
 */
export function cropAndScale(src: HTMLCanvasElement, rect: Rect, dw: number, dh: number): HTMLCanvasElement {
  let cur: HTMLCanvasElement = src;
  let sx = rect.x;
  let sy = rect.y;
  let sw = rect.w;
  let sh = rect.h;
  while (sw >= dw * 2 && sh >= dh * 2) {
    const tw = Math.floor(sw / 2);
    const th = Math.floor(sh / 2);
    const step = makeCanvas(tw, th);
    const sctx = step.getContext('2d');
    if (!sctx) throw new Error('Canvas is not available');
    sctx.imageSmoothingQuality = 'high';
    sctx.drawImage(cur, sx, sy, sw, sh, 0, 0, tw, th);
    cur = step;
    sx = 0;
    sy = 0;
    sw = tw;
    sh = th;
  }
  const out = makeCanvas(dw, dh);
  const ctx = out.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(cur, sx, sy, sw, sh, 0, 0, dw, dh);
  return out;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// ─── Frame scoring (Auto-pick) ─────────────────────────────

export type FrameFlag = 'dark' | 'bright' | 'flat' | 'cut';

export const FLAG_LABEL: Record<FrameFlag, string> = {
  dark: 'Dark',
  bright: 'Overexposed',
  flat: 'Flat or faded',
  cut: 'Near a cut',
};

export interface ScoredFrame {
  time: number;
  previewUrl: string;
  sharpness: number;
  /** Sharpness as a percentage of the sharpest sampled frame in this video. */
  sharpRel: number;
  brightness: number;
  contrast: number;
  flags: FrameFlag[];
  score: number;
}

const ANALYSIS_W = 320;
const SIG_W = 32;
const SIG_H = 18;

function grayFromCanvas(canvas: HTMLCanvasElement): Float32Array {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas is not available');
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const gray = new Float32Array(canvas.width * canvas.height);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    gray[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  return gray;
}

/** Variance of the Laplacian: high when there are crisp edges, low when the frame is blurred or flat. */
export function laplacianVariance(gray: Float32Array, w: number, h: number): number {
  let sum = 0;
  let sumSq = 0;
  let n = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const v = gray[i - w] + gray[i + w] + gray[i - 1] + gray[i + 1] - 4 * gray[i];
      sum += v;
      sumSq += v * v;
      n++;
    }
  }
  if (n === 0) return 0;
  const mean = sum / n;
  return sumSq / n - mean * mean;
}

function lumaStats(gray: Float32Array): { mean: number; std: number } {
  let sum = 0;
  for (let i = 0; i < gray.length; i++) sum += gray[i];
  const mean = sum / gray.length;
  let sq = 0;
  for (let i = 0; i < gray.length; i++) sq += (gray[i] - mean) * (gray[i] - mean);
  return { mean, std: Math.sqrt(sq / gray.length) };
}

function drawScaled(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas is not available');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
}

function meanAbsDiff(a: Float32Array, b: Float32Array): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]);
  return s / a.length;
}

/**
 * Sample the video at `times`, measure each frame, and return the frames ranked
 * best first. The ranking is only about image quality (sharp, well exposed, not
 * in a transition). It says nothing about how a thumbnail will perform.
 */
export async function scoreFrames(
  video: HTMLVideoElement,
  times: number[],
  opts: {
    neighbourOffset: number;
    onProgress: (done: number, total: number) => void;
    isCancelled: () => boolean;
  },
): Promise<ScoredFrame[] | null> {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  const aw = Math.min(ANALYSIS_W, vw);
  const ah = Math.max(2, Math.round((aw * vh) / vw));
  const analysis = makeCanvas(aw, ah);
  const sig = makeCanvas(SIG_W, SIG_H);
  const dur = Number.isFinite(video.duration) ? video.duration : Math.max(...times);

  const raw: (Omit<ScoredFrame, 'score' | 'flags' | 'sharpRel'> & { diff: number })[] = [];

  const revokeAll = () => raw.forEach((r) => URL.revokeObjectURL(r.previewUrl));

  try {
    for (let i = 0; i < times.length; i++) {
      if (opts.isCancelled()) {
        revokeAll();
        return null;
      }
      const t = times[i];

      await seekVideo(video, clamp(t - opts.neighbourOffset, 0, dur));
      drawScaled(video, sig);
      const before = grayFromCanvas(sig);

      await seekVideo(video, t);
      drawScaled(video, analysis);
      const gray = grayFromCanvas(analysis);
      const sharpness = laplacianVariance(gray, aw, ah);
      const { mean, std } = lumaStats(gray);
      const previewUrl = await makePreviewUrl(video);

      await seekVideo(video, clamp(t + opts.neighbourOffset, 0, dur));
      drawScaled(video, sig);
      const after = grayFromCanvas(sig);

      raw.push({
        time: t,
        previewUrl,
        sharpness,
        brightness: mean,
        contrast: std,
        diff: meanAbsDiff(before, after),
      });
      opts.onProgress(i + 1, times.length);
    }
  } catch (err) {
    revokeAll();
    throw err;
  }

  const maxSharp = Math.max(...raw.map((r) => r.sharpness), 1e-6);

  const scored: ScoredFrame[] = raw.map((r) => {
    const flags: FrameFlag[] = [];
    let penalty = 1;
    if (r.brightness < 35) flags.push('dark');
    penalty *= clamp((r.brightness - 10) / 50, 0.05, 1);
    if (r.brightness > 235) flags.push('bright');
    if (r.brightness > 215) penalty *= clamp((250 - r.brightness) / 35, 0.2, 1);
    if (r.contrast < 14) flags.push('flat');
    penalty *= clamp(r.contrast / 25, 0.1, 1);
    if (r.diff > 55) flags.push('cut');
    if (r.diff > 30) penalty *= clamp(1 - ((r.diff - 30) / 40) * 0.7, 0.3, 1);
    return {
      time: r.time,
      previewUrl: r.previewUrl,
      sharpness: r.sharpness,
      sharpRel: Math.round((r.sharpness / maxSharp) * 100),
      brightness: r.brightness,
      contrast: r.contrast,
      flags,
      score: (r.sharpness / maxSharp) * penalty,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored;
}
