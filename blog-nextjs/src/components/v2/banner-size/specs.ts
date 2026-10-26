/**
 * YouTube banner (channel art) specs and the pure checking logic used by the banner checker.
 *
 * Upload rules come from YouTube Help, "Manage your channel branding"
 * (https://support.google.com/youtube/answer/10456525), read on 26 October 2026:
 *   - "Minimum dimension for upload: 2048 x 1152 px with an aspect ratio of 16:9."
 *   - "At the Minimum dimension, the safe area for text and logos: 1235 x 338 px."
 *   - "Recommended dimension (especially for TV): 2560 x 1440 px."
 *   - "File size: 6 MB or smaller."
 * The page does not list banner file formats, so this checker does not judge the format.
 * It does not mention 1024 x 576 anywhere.
 *
 * DESKTOP_STRIP is our own reading of the banner image youtube.com loads on a channel page
 * (same day): the full width and the middle 29.4% of the height. A 2560 x 1440 banner came
 * back as a 2560 x 424 strip.
 */

export type Status = 'pass' | 'warn' | 'fail';
export type CheckId = 'resolution' | 'ratio' | 'size';

export const CHECKED_ON_ISO = '2026-10-26';
export const CHECKED_ON_LABEL = '26 October 2026';
export const SOURCE_URL = 'https://support.google.com/youtube/answer/10456525';
export const SOURCE_NAME = 'YouTube Help, "Manage your channel branding"';

/** We count 1 MB as 1,000,000 bytes, the stricter reading, so a "pass" is always safe. */
export const MB = 1_000_000;
export const LIMIT_BYTES = 6 * MB;

export const SPEC = {
  recommendedW: 2560,
  recommendedH: 1440,
  minW: 2048,
  minH: 1152,
  safeW: 1235,
  safeH: 338,
  ratio: 16 / 9,
} as const;

/** Safe area as a share of the whole banner. Same share at any 16:9 size. */
export const SAFE_PCT = {
  w: (SPEC.safeW / SPEC.minW) * 100,
  h: (SPEC.safeH / SPEC.minH) * 100,
} as const;

/**
 * The strip youtube.com loads on a computer, as a share of the banner height.
 * Read from the crop values in YouTube's own image URL (0x5a57 to 0xa5a8 out of 0xffff).
 */
export const DESKTOP_STRIP = {
  topPct: (0x5a57 / 0xffff) * 100,
  heightPct: ((0xa5a8 - 0x5a57) / 0xffff) * 100,
  measuredW: 2560,
  measuredH: 424,
} as const;

/** Safe area at the recommended size: 1235 x 338 scaled by 2560 / 2048 = 1.25. */
export const SAFE_AT_RECOMMENDED = {
  w: Math.round(SPEC.safeW * (SPEC.recommendedW / SPEC.minW)),
  h: Math.round(SPEC.safeH * (SPEC.recommendedW / SPEC.minW)),
} as const;

export function safeAreaFor(width: number, height: number) {
  return {
    w: Math.round((width * SAFE_PCT.w) / 100),
    h: Math.round((height * SAFE_PCT.h) / 100),
  };
}

export interface ImageFacts {
  name: string;
  width: number;
  height: number;
  bytes: number;
  mime: string;
}

export interface CheckRow {
  id: CheckId;
  label: string;
  status: Status;
  value: string;
  detail: string;
}

export interface CheckResult {
  rows: CheckRow[];
  passCount: number;
  allPass: boolean;
}

export const STATUS_LABEL: Record<Status, string> = {
  pass: 'Pass',
  warn: 'Check',
  fail: 'Fail',
};

const COMMON_RATIOS: Array<[string, number]> = [
  ['16:9', 16 / 9],
  ['4:3', 4 / 3],
  ['3:2', 3 / 2],
  ['1:1', 1],
  ['9:16', 9 / 16],
  ['2:1', 2],
  ['21:9', 21 / 9],
  ['3:1', 3],
  ['4:1', 4],
  ['6:1', 6],
];

export function formatBytes(bytes: number): string {
  if (bytes < MB) return `${Math.max(1, Math.round(bytes / 1000))} KB`;
  const mb = bytes / MB;
  return `${mb < 10 ? mb.toFixed(2) : mb.toFixed(1)} MB`;
}

export function describeRatio(width: number, height: number): string {
  const r = width / height;
  for (const [label, value] of COMMON_RATIOS) {
    if (Math.abs(r / value - 1) <= 0.015) return label;
  }
  return `${r.toFixed(2)}:1`;
}

export function formatName(mime: string, fileName: string): string {
  const m = mime.toLowerCase();
  if (m === 'image/jpeg' || m === 'image/jpg') return 'JPG';
  if (m.startsWith('image/')) return m.slice(6).replace('svg+xml', 'svg').toUpperCase();
  const ext = fileName.toLowerCase().split('.').pop() ?? '';
  return ext ? ext.toUpperCase() : 'Unknown';
}

function checkResolution(f: ImageFacts): CheckRow {
  const value = `${f.width} × ${f.height} px`;
  if (f.width < SPEC.minW || f.height < SPEC.minH) {
    const half = f.width === 1024 && f.height === 576;
    return {
      id: 'resolution',
      label: 'Resolution',
      status: 'fail',
      value,
      detail: half
        ? '1024 × 576 is half the minimum in each direction. YouTube asks for at least 2048 × 1152. Remake it at 2560 × 1440.'
        : `Below YouTube's minimum of ${SPEC.minW} × ${SPEC.minH}. Remake it at ${SPEC.recommendedW} × ${SPEC.recommendedH}.`,
    };
  }
  if (f.width < SPEC.recommendedW || f.height < SPEC.recommendedH) {
    return {
      id: 'resolution',
      label: 'Resolution',
      status: 'pass',
      value,
      detail: `Meets the ${SPEC.minW} × ${SPEC.minH} minimum. YouTube recommends ${SPEC.recommendedW} × ${SPEC.recommendedH}, especially for TV.`,
    };
  }
  return {
    id: 'resolution',
    label: 'Resolution',
    status: 'pass',
    value,
    detail: `Matches YouTube's recommended ${SPEC.recommendedW} × ${SPEC.recommendedH}, or larger.`,
  };
}

function checkRatio(f: ImageFacts): CheckRow {
  const off = Math.abs(f.width / f.height / SPEC.ratio - 1);
  const value = describeRatio(f.width, f.height);
  if (off <= 0.01) {
    return {
      id: 'ratio',
      label: 'Aspect ratio',
      status: 'pass',
      value,
      detail: 'Exactly 16:9, the shape YouTube asks for.',
    };
  }
  if (off <= 0.05) {
    return {
      id: 'ratio',
      label: 'Aspect ratio',
      status: 'warn',
      value,
      detail: 'Close to 16:9 but not exact. A thin edge will be lost when you set the crop on upload.',
    };
  }
  return {
    id: 'ratio',
    label: 'Aspect ratio',
    status: 'fail',
    value,
    detail:
      f.width / f.height > SPEC.ratio
        ? 'Too wide for 16:9. A thin strip banner is not enough: YouTube wants the full 16:9 image, and shows it whole on TV.'
        : 'Too tall for 16:9. Crop it to 16:9 yourself, so you choose what stays.',
  };
}

function checkSize(f: ImageFacts): CheckRow {
  const value = formatBytes(f.bytes);
  if (f.bytes > LIMIT_BYTES) {
    return {
      id: 'size',
      label: 'File size',
      status: 'fail',
      value,
      detail: 'Over the 6 MB limit. Export as JPG, or at a lower quality.',
    };
  }
  return {
    id: 'size',
    label: 'File size',
    status: 'pass',
    value,
    detail: 'Under the 6 MB limit.',
  };
}

export function checkBanner(facts: ImageFacts): CheckResult {
  const rows = [checkResolution(facts), checkRatio(facts), checkSize(facts)];
  const passCount = rows.filter((r) => r.status === 'pass').length;
  return { rows, passCount, allPass: passCount === rows.length };
}
