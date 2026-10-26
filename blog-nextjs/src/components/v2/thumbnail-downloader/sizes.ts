// The thumbnail sizes YouTube keeps for every video, and a link parser that
// accepts every common way people copy a video link.
import { parseYouTubeId } from '../thumbnail-preview/youtube';

export type SizeName = 'maxresdefault' | 'sddefault' | 'hqdefault' | 'mqdefault' | 'default';

export interface ThumbSize {
  name: SizeName;
  label: string;
  width: number;
  height: number;
  note: string;
}

// Largest first. sd, hq and default are 4:3, so a widescreen video gets black bars.
export const SIZES: ThumbSize[] = [
  {
    name: 'maxresdefault',
    label: 'Max resolution',
    width: 1280,
    height: 720,
    note: 'Full HD thumbnail, no black bars. Missing on some older or low-resolution videos.',
  },
  {
    name: 'sddefault',
    label: 'Standard',
    width: 640,
    height: 480,
    note: '4:3 shape. A widescreen video gets black bars above and below.',
  },
  {
    name: 'hqdefault',
    label: 'High quality',
    width: 480,
    height: 360,
    note: '4:3 shape with black bars. Exists for almost every video.',
  },
  {
    name: 'mqdefault',
    label: 'Medium',
    width: 320,
    height: 180,
    note: '16:9, no black bars. Exists for every video.',
  },
  {
    name: 'default',
    label: 'Small',
    width: 120,
    height: 90,
    note: 'Tiny 4:3 preview, the size of an old list icon.',
  },
];

const ID_RE = /^[A-Za-z0-9_-]{11}$/;

/** Turns any of these into an 11-character video ID, or null:
 *  watch, youtu.be, shorts, embed, live, /v/, mobile and music links (extra
 *  parameters are fine), a link without https://, a bare ID, a thumbnail image
 *  link (i.ytimg.com/vi/ID/...), or a sentence that contains one of those. */
export function parseVideoInput(raw: string): string | null {
  const input = raw.trim();
  if (!input) return null;

  const direct = parseYouTubeId(input) ?? parseExtra(input);
  if (direct) return direct;

  // Shared text often wraps the link in words: try each word on its own.
  for (const word of input.split(/\s+/)) {
    const cleaned = word.replace(/^[<("'[]+|[>)"'\].,;!?]+$/g, '');
    if (cleaned === input) continue;
    const id = parseYouTubeId(cleaned) ?? parseExtra(cleaned);
    if (id) return id;
  }
  return null;
}

function parseExtra(input: string): string | null {
  try {
    const url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
    const host = url.hostname.replace(/^(www|m)\./i, '').toLowerCase();

    // A thumbnail link: i.ytimg.com/vi/ID/hqdefault.jpg or img.youtube.com/vi/ID/0.jpg
    if (/^(i\d?\.ytimg\.com|img\.youtube\.com)$/.test(host)) {
      const match = url.pathname.match(/^\/vi(?:_webp)?\/([A-Za-z0-9_-]{11})\//);
      return match ? match[1] : null;
    }

    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      // youtube.com/watch/ID (no ?v=), youtube.com/e/ID
      const path = url.pathname.match(/^\/(?:watch|e)\/([A-Za-z0-9_-]{11})(?:[/?#]|$)/);
      if (path) return path[1];
      // Share links that wrap the real link: /attribution_link?u=/watch%3Fv%3DID
      const wrapped = url.searchParams.get('u');
      if (wrapped) {
        const inner = new URL(wrapped, 'https://www.youtube.com').searchParams.get('v');
        return inner && ID_RE.test(inner) ? inner : null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function thumbUrl(id: string, size: SizeName): string {
  return `https://i.ytimg.com/vi/${id}/${size}.jpg`;
}

export function fileName(id: string, size: ThumbSize): string {
  return `${id}-${size.width}x${size.height}.jpg`;
}
