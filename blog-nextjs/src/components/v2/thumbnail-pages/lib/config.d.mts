// Type declarations for config.mjs (see that file for what each setting does).

export const SITE_URL: string;
export const BASE_PATH: string;
export const MIN_GALLERY_IMAGES: number;
export const HUB_MIN_LIVE_PAGES: number;
export const MIN_FAQ: number;
export const MAX_FAQ: number;
export const MIN_BODY_WORDS: number;
export const PAGE_WORDS_MIN: number;
export const PAGE_WORDS_MAX: number;
export const TITLE_MAX: number;
export const DESCRIPTION_MAX: number;
export const DESCRIPTION_MIN: number;
export const GALLERY_INITIAL: number;
export const STUDIO_GENERATE_URL: string;
export const STUDIO_AUDIT_URL: string;
export const CATEGORIES: readonly ['game', 'style', 'genre'];
export const CATEGORY_LABELS: { game: string; style: string; genre: string };
export const TOOL_LINKS: { href: string; label: string }[];
