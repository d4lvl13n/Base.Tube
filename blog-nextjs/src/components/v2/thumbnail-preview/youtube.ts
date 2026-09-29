// Helpers for turning pasted YouTube links into a thumbnail URL.
// Nothing here downloads media: the thumbnail is shown with a normal <img>
// that points at YouTube's own image server.

export const MAX_RIVALS = 11;

const ID_RE = /^[A-Za-z0-9_-]{11}$/;

/** Returns the 11-character video ID from a YouTube link (or a bare ID). */
export function parseYouTubeId(raw: string): string | null {
  const input = raw.trim();
  if (!input) return null;
  if (ID_RE.test(input)) return input;

  try {
    const url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
    const host = url.hostname.replace(/^(www|m|music)\./i, '').toLowerCase();
    let id: string | null = null;

    if (host === 'youtu.be') {
      id = url.pathname.split('/')[1] ?? null;
    } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      if (url.pathname === '/watch') {
        id = url.searchParams.get('v');
      } else {
        const match = url.pathname.match(/^\/(?:shorts|embed|live|v)\/([A-Za-z0-9_-]{11})/);
        id = match ? match[1] : null;
      }
    }
    return id && ID_RE.test(id) ? id : null;
  } catch {
    return null;
  }
}

/** Splits a pasted blob of text into video IDs. */
export function extractYouTubeIds(text: string): { ids: string[]; invalid: number } {
  const parts = text.split(/[\s,]+/).filter(Boolean);
  const ids: string[] = [];
  let invalid = 0;
  for (const part of parts) {
    const id = parseYouTubeId(part);
    if (!id) invalid += 1;
    else if (!ids.includes(id)) ids.push(id);
  }
  return { ids, invalid };
}

export function thumbnailUrl(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/** Asks YouTube's public oEmbed endpoint for the real title and channel. Fails soft. */
export async function fetchVideoInfo(
  id: string,
  signal?: AbortSignal,
): Promise<{ title: string; channel: string } | null> {
  try {
    const target = `https://www.youtube.com/watch?v=${id}`;
    const res = await fetch(
      `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(target)}`,
      { signal, referrerPolicy: 'no-referrer' },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { title?: string; author_name?: string };
    if (!data.title) return null;
    return { title: data.title, channel: data.author_name ?? '' };
  } catch {
    return null;
  }
}

// Deterministic fake numbers for added videos, so the feed looks natural.
const VIEWS = ['48K views', '1.2M views', '310K views', '12K views', '5.6M views', '890K views'];
const AGES = ['3 days ago', '2 weeks ago', '1 month ago', '5 months ago', '1 year ago', '6 hours ago'];
const DURATIONS = ['8:42', '12:05', '21:33', '4:17', '15:48', '10:02'];

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function fakeStats(id: string): { views: string; age: string; duration: string } {
  const h = hash(id);
  return {
    views: VIEWS[h % VIEWS.length],
    age: AGES[(h >>> 3) % AGES.length],
    duration: DURATIONS[(h >>> 6) % DURATIONS.length],
  };
}

export function avatarColor(name: string): string {
  const hue = hash(name || 'channel') % 360;
  return `hsl(${hue} 42% 36%)`;
}
