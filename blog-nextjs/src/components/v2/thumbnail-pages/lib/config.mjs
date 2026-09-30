// @ts-check
/**
 * Settings for the /thumbnails page family. Change a number here and every
 * page, the sitemap and the validation script follow.
 */

export const SITE_URL = 'https://base.tube';
export const BASE_PATH = '/thumbnails';

/** A page needs at least this many gallery images to be indexed and listed in the sitemap. */
export const MIN_GALLERY_IMAGES = 12;

/** The /thumbnails hub is only indexed once at least this many pages are live. */
export const HUB_MIN_LIVE_PAGES = 3;

/** FAQ: fewer than MIN blocks publishing; more than MAX is a warning. */
export const MIN_FAQ = 4;
export const MAX_FAQ = 10;

/** The Markdown body (the written guide) must have at least this many words. */
export const MIN_BODY_WORDS = 400;

/** Whole-page word count (intro + recipe + layouts + guide + do/don't + FAQ). Outside this range = warning. */
export const PAGE_WORDS_MIN = 900;
export const PAGE_WORDS_MAX = 1800;

/** Search snippet limits. */
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;
export const DESCRIPTION_MIN = 70;

/** How many gallery images show before the "Show all" button (only used when a gallery is long). */
export const GALLERY_INITIAL = 24;

/** Links into the Base.Tube Studio. Query parameters are added by studioGenerateUrl(). */
export const STUDIO_GENERATE_URL = 'https://base.tube/ai-thumbnails';
export const STUDIO_AUDIT_URL = '/youtube-channel-audit';

/** Page groups, in the order the hub shows them. */
export const CATEGORIES = /** @type {const} */ (['game', 'style', 'genre']);
export const CATEGORY_LABELS = {
  game: 'Games',
  style: 'Creator styles',
  genre: 'Video genres',
};

/** Free tools linked from every page ("check it before you upload"). */
export const TOOL_LINKS = [
  { href: '/tools/youtube-thumbnail-preview', label: 'YouTube thumbnail preview' },
  { href: '/tools/youtube-thumbnail-tester', label: 'YouTube thumbnail tester' },
  { href: '/youtube-thumbnail-size', label: 'YouTube thumbnail size guide' },
  { href: '/tools', label: 'All free tools' },
];
