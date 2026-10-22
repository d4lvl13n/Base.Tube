import { HUB_MIN_LIVE_PAGES } from './lib/config.mjs';
import { getBuildablePages, getLivePages, type LoadedPage } from './lib/content.mjs';
import type { GalleryImage, ThumbnailPage } from './lib/schema.mjs';

/** URL part of the gaming hub: /thumbnails/gaming. */
export const GAMING_HUB_SLUG = 'gaming';

/** Gallery images that exist (placeholders never show up outside their own page). */
export function realExamples(p: ThumbnailPage): GalleryImage[] {
  return p.gallery.filter((g) => !g.placeholder);
}

const byExamples = (a: ThumbnailPage, b: ThumbnailPage) =>
  realExamples(b).length - realExamples(a).length || a.name.localeCompare(b.name);

/**
 * The game pages the gaming hub shows. Once HUB_MIN_LIVE_PAGES game pages are live, the hub
 * is indexed and lists live pages only. Before that it is a noindex preview of every game page
 * that has at least one real image, so the whole set can be reviewed.
 */
export function gamingHubState(): { isLive: boolean; pages: ThumbnailPage[] } {
  const live = getLivePages().filter((l) => l.page?.category === 'game');
  const isLive = live.length >= HUB_MIN_LIVE_PAGES;
  const source = isLive ? live : getBuildablePages().filter((l) => l.page?.category === 'game');
  const pages = source
    .map((l) => l.page as ThumbnailPage)
    .filter((p) => realExamples(p).length > 0)
    .sort(byExamples);
  return { isLive, pages };
}

/**
 * The other pages of the same category (games, creator styles or video genres) to link from a page.
 * A live page links to live pages only, so an indexed page never points to a noindex draft;
 * a draft links to every page of its category that has images.
 */
export function siblingPages(current: LoadedPage): ThumbnailPage[] {
  const category = current.page?.category;
  const candidates = current.live ? getLivePages() : getBuildablePages();
  return candidates
    .filter((l) => l.slug !== current.slug && l.page?.category === category)
    .map((l) => l.page as ThumbnailPage)
    .filter((p) => realExamples(p).length > 0)
    .sort(byExamples);
}

/** Heading and "see all" link of the siblings block, per category. */
export const SIBLING_COPY: Record<ThumbnailPage['category'], { label: string; title: string; allLabel: string; allHref: string }> = {
  game: { label: 'More games', title: 'Thumbnail ideas for other games', allLabel: 'All gaming thumbnails', allHref: `/thumbnails/${GAMING_HUB_SLUG}` },
  style: { label: 'More styles', title: 'Other creator styles', allLabel: 'All thumbnail ideas', allHref: '/thumbnails#style' },
  genre: { label: 'More genres', title: 'Other video genres', allLabel: 'All thumbnail ideas', allHref: '/thumbnails#genre' },
};
