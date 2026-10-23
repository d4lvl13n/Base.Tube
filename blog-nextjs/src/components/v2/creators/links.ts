import type { MetadataRoute } from 'next';

import type { PagesIndexEntry } from '../thumbnail-pages/lib/content.mjs';
import pagesIndexJson from '../thumbnail-pages/lib/pages-index.json';
import indexJson from './creators-index.json';
import type { CreatorsIndexEntry } from './lib/creators-files.mjs';

/**
 * Everything the rest of the site needs to know about the creator pages, read from
 * creators-index.json (bundled with the code). Safe in client components and in the sitemap,
 * which is refreshed on the server where content/creators is not available.
 */

export const CREATORS_PATH = '/creators/youtube';
export const SITE_URL = 'https://base.tube';

/** The hub /creators/youtube is indexed (and linked from the footer) once this many creators are live. */
export const CREATORS_HUB_MIN_LIVE = 3;

const ALL = (indexJson as { creators: CreatorsIndexEntry[] }).creators;

export function creatorPath(slug: string): string {
  return `${CREATORS_PATH}/${slug}`;
}

const GAME_PAGES = (pagesIndexJson as { pages: PagesIndexEntry[] }).pages;

/** The /thumbnails/<game> gallery of a creator's game: its display name and whether it is live. */
export function gamePage(slug: string | null | undefined): { slug: string; name: string; live: boolean; href: string } | null {
  const p = slug ? GAME_PAGES.find((g) => g.slug === slug) : undefined;
  return p ? { slug: p.slug, name: p.name, live: p.live, href: `/thumbnails/${p.slug}` } : null;
}

/** True once enough creator pages are live for the hub to be indexed. */
export function creatorsHubIsLive(): boolean {
  return ALL.filter((c) => c.live).length >= CREATORS_HUB_MIN_LIVE;
}

/**
 * Creators of one game to link from a game gallery. A published (indexed) gallery links to live
 * creator pages only; a draft gallery also links to drafts, so the whole set can be reviewed.
 */
export function creatorsToLink(game: string, includeDrafts: boolean): CreatorsIndexEntry[] {
  return ALL.filter((c) => c.game === game && (includeDrafts || c.live)).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * YouTube avatar URLs end with a size ("=s900-c-k-…"). Asks for a smaller square so a 48 px avatar
 * does not download a 900 px image.
 */
export function avatarAt(url: string | null | undefined, size: number): string | null {
  if (!url) return null;
  return /=s\d+/.test(url) ? url.replace(/=s\d+/, `=s${size}`) : url;
}

/** Sitemap entries: every live creator page, and the hub once CREATORS_HUB_MIN_LIVE are live. */
export function getCreatorSitemapEntries(baseUrl: string = SITE_URL): MetadataRoute.Sitemap {
  const live = ALL.filter((c) => c.live);
  const date = (d: string | null) => (d ? new Date(`${d}T00:00:00Z`) : new Date());
  const out: MetadataRoute.Sitemap = [];
  if (live.length >= CREATORS_HUB_MIN_LIVE) {
    const latest = live.map((c) => c.collectedAt ?? '').sort().pop() || null;
    out.push({ url: `${baseUrl}${CREATORS_PATH}`, lastModified: date(latest), changeFrequency: 'weekly', priority: 0.7 });
  }
  for (const c of live) {
    out.push({ url: `${baseUrl}${creatorPath(c.slug)}`, lastModified: date(c.collectedAt), changeFrequency: 'monthly', priority: 0.6 });
  }
  return out;
}
