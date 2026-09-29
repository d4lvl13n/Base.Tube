/**
 * YouTube thumbnail specs and the pure checking logic used by the size checker.
 *
 * Every number below comes from YouTube Help, "Add custom thumbnails on YouTube"
 * (https://support.google.com/youtube/answer/72431), read on 29 September 2026.
 * When YouTube changes that page, update this file and CHECKED_ON_* below.
 */

export type Mode = 'video' | 'short';
export type Status = 'pass' | 'warn' | 'fail';
export type CheckId = 'resolution' | 'ratio' | 'size' | 'format';

export const CHECKED_ON_ISO = '2026-09-29';
export const CHECKED_ON_LABEL = '29 September 2026';
export const SOURCE_URL = 'https://support.google.com/youtube/answer/72431';
export const SOURCE_NAME = 'YouTube Help, "Add custom thumbnails on YouTube"';

/** We count 1 MB as 1,000,000 bytes, the stricter reading, so a "pass" is always safe. */
export const MB = 1_000_000;
export const LIMIT_MOBILE_BYTES = 2 * MB;
export const LIMIT_DESKTOP_BYTES = 50 * MB;

export const SPEC = {
  video: {
    recommendedW: 3840,
    recommendedH: 2160,
    /** Below this many pixels of width YouTube rejects the image. */
    minWidth: 640,
    /** The long-standing 1280 x 720 size: still accepted, below the new recommendation. */
    classicW: 1280,
    classicH: 720,
    ratioLabel: '16:9',
    ratio: 16 / 9,
  },
  short: {
    recommendedW: 2160,
    recommendedH: 3840,
    minHeight: 640,
    classicW: 720,
    classicH: 1280,
    ratioLabel: '9:16',
    ratio: 9 / 16,
  },
} as const;

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
  /** What YouTube asks for, shown under the label. */
  requirement: string;
  status: Status;
  /** What we measured on the user's file. */
  value: string;
  /** One or two plain sentences: why it passed or what to do. */
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
  ['3:4', 3 / 4],
  ['2:3', 2 / 3],
  ['4:5', 4 / 5],
  ['5:4', 5 / 4],
  ['2:1', 2],
  ['21:9', 21 / 9],
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

export function formatName(mime: string, fileName: string): { label: string; kind: 'jpg' | 'png' | 'gif' | 'other' } {
  const m = mime.toLowerCase();
  const ext = fileName.toLowerCase().split('.').pop() ?? '';
  if (m === 'image/jpeg' || m === 'image/jpg' || (!m && (ext === 'jpg' || ext === 'jpeg'))) return { label: 'JPG', kind: 'jpg' };
  if (m === 'image/png' || (!m && ext === 'png')) return { label: 'PNG', kind: 'png' };
  if (m === 'image/gif' || (!m && ext === 'gif')) return { label: 'GIF', kind: 'gif' };
  const fromMime = m.startsWith('image/') ? m.slice(6).replace('svg+xml', 'svg').toUpperCase() : '';
  return { label: fromMime || ext.toUpperCase() || 'Unknown', kind: 'other' };
}

function checkResolution(f: ImageFacts, mode: Mode): CheckRow {
  const v = SPEC[mode];
  const isShort = mode === 'short';
  const measured = `${f.width} × ${f.height} px`;
  const requirement = isShort
    ? `${v.recommendedW} × ${v.recommendedH} recommended · ${SPEC.short.minHeight} px tall minimum`
    : `${v.recommendedW} × ${v.recommendedH} recommended · ${SPEC.video.minWidth} px wide minimum`;

  // Video thumbnails are limited by width, Shorts thumbnails by height.
  const measure = isShort ? f.height : f.width;
  const minimum = isShort ? SPEC.short.minHeight : SPEC.video.minWidth;
  const classic = isShort ? SPEC.short.classicH : SPEC.video.classicW;
  const recommended = isShort ? SPEC.short.recommendedH : SPEC.video.recommendedW;
  const dim = isShort ? 'tall' : 'wide';

  if (measure < minimum) {
    return {
      id: 'resolution', label: 'Resolution', requirement, status: 'fail', value: measured,
      detail: `Below YouTube's minimum of ${minimum} px ${dim}. Use a larger original.`,
    };
  }
  if (measure < classic) {
    return {
      id: 'resolution', label: 'Resolution', requirement, status: 'warn', value: measured,
      detail: `Meets the ${minimum} px minimum, but it is below the long-standing ${v.classicW} × ${v.classicH} size, so it will look soft on large screens.`,
    };
  }
  if (measure < recommended) {
    return {
      id: 'resolution', label: 'Resolution', requirement, status: 'pass', value: measured,
      detail: `Accepted. YouTube now recommends ${v.recommendedW} × ${v.recommendedH} for the sharpest result.`,
    };
  }
  return {
    id: 'resolution', label: 'Resolution', requirement, status: 'pass', value: measured,
    detail: `Matches YouTube's recommended ${v.recommendedW} × ${v.recommendedH}, or larger.`,
  };
}

function checkRatio(f: ImageFacts, mode: Mode): CheckRow {
  const v = SPEC[mode];
  const actual = f.width / f.height;
  const off = Math.abs(actual / v.ratio - 1);
  const value = describeRatio(f.width, f.height);
  const requirement = mode === 'short' ? '9:16 (vertical)' : '16:9 (widescreen)';

  if (off <= 0.01) {
    return {
      id: 'ratio', label: 'Aspect ratio', requirement, status: 'pass', value,
      detail: `Fits the ${v.ratioLabel} frame exactly, so nothing is cropped.`,
    };
  }
  if (off <= 0.05) {
    return {
      id: 'ratio', label: 'Aspect ratio', requirement, status: 'warn', value,
      detail: `Close to ${v.ratioLabel}, but not exact. A thin strip may be cropped or padded.`,
    };
  }

  const isVertical = f.height > f.width;
  let detail: string;
  if (mode === 'video' && isVertical) {
    detail = 'This image is vertical. If it is for a Short, switch to Short (9:16) above. For a long video, crop it to 16:9.';
  } else if (mode === 'short' && !isVertical) {
    detail =
      'This image is wide. If it is for a long video, switch to Video (16:9). On a vertical video, YouTube replaces a 16:9 thumbnail with an auto-generated 4:5 image on the home, explore and subscription pages.';
  } else {
    detail = `YouTube uses ${v.ratioLabel}. A different shape does not fill the frame, so it can be cropped or shown with bars.`;
  }
  return { id: 'ratio', label: 'Aspect ratio', requirement, status: 'fail', value, detail };
}

function checkSize(f: ImageFacts, mode: Mode): CheckRow {
  const value = formatBytes(f.bytes);
  const requirement =
    mode === 'short' ? '50 MB (uploaded from a computer)' : '2 MB phone app · 50 MB computer';

  if (f.bytes > LIMIT_DESKTOP_BYTES) {
    return {
      id: 'size', label: 'File size', requirement, status: 'fail', value,
      detail: "Over YouTube's 50 MB limit. Compress it or export at a lower quality.",
    };
  }
  if (mode === 'short') {
    return {
      id: 'size', label: 'File size', requirement, status: 'pass', value,
      detail: 'Under 50 MB. Shorts thumbnails are added in YouTube Studio on a computer.',
    };
  }
  if (f.bytes > LIMIT_MOBILE_BYTES) {
    return {
      id: 'size', label: 'File size', requirement, status: 'warn', value,
      detail:
        'Fine on a computer (limit 50 MB). Too big for the phone app, which stops at 2 MB.',
    };
  }
  return {
    id: 'size', label: 'File size', requirement, status: 'pass', value,
    detail: 'Under 2 MB, so it uploads from the phone app and from a computer.',
  };
}

function checkFormat(f: ImageFacts): CheckRow {
  const fmt = formatName(f.mime, f.name);
  const requirement = 'JPG or PNG';
  if (fmt.kind === 'jpg' || fmt.kind === 'png') {
    return {
      id: 'format', label: 'Format', requirement, status: 'pass', value: fmt.label,
      detail: `${fmt.label} is named on YouTube Help.`,
    };
  }
  if (fmt.kind === 'gif') {
    return {
      id: 'format', label: 'Format', requirement, status: 'warn', value: fmt.label,
      detail:
        "The current YouTube Help page names JPG and PNG only. Older guidance also listed GIF, so it may still work, but JPG or PNG is the safe choice.",
    };
  }
  return {
    id: 'format', label: 'Format', requirement, status: 'fail', value: fmt.label,
    detail: 'Not a format YouTube Help lists. Convert it to JPG or PNG.',
  };
}

export function checkImage(facts: ImageFacts, mode: Mode): CheckResult {
  const rows = [checkResolution(facts, mode), checkRatio(facts, mode), checkSize(facts, mode), checkFormat(facts)];
  const passCount = rows.filter((r) => r.status === 'pass').length;
  return { rows, passCount, allPass: passCount === rows.length };
}

/** Measured on youtube.com on 29 September 2026 (Chrome, signed out, en-US). CSS pixels. */
export const MEASURED = {
  date: CHECKED_ON_LABEL,
  desktopSearch: { w: 500, h: 281 },
  desktopSidebar: { w: 248, h: 139 },
  mobileFeed: { w: 390, h: 219 },
  shortsShelf: { w: 175, h: 263 },
  badge: { h: 20, wideW: 64, insetSearch: 8, insetSidebar: 4 },
} as const;

/** Corner kept clear of faces and text, as a share of the thumbnail (see the safe zone section). */
export const SAFE_ZONE = { widthPct: 28, heightPct: 18 } as const;

export function safeZoneFor(width: number, height: number) {
  return {
    w: Math.round((width * SAFE_ZONE.widthPct) / 100),
    h: Math.round((height * SAFE_ZONE.heightPct) / 100),
  };
}
