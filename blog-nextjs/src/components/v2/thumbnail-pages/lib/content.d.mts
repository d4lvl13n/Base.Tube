// Type declarations for content.mjs (server-only content loader, build time).

import type { HubContent, Issue, ThumbnailPage } from './schema.mjs';

export interface LoadedPage {
  file: string;
  slug: string;
  /** null when the file has errors (the page is not built) */
  page: ThumbnailPage | null;
  issues: Issue[];
  /** published + complete: indexable and listed in the sitemap and on the hub */
  live: boolean;
}

export interface LoadedHub {
  file: string;
  hub: HubContent | null;
  issues: Issue[];
  live: boolean;
}

export interface ContentIndex {
  pages: LoadedPage[];
  hub: LoadedHub;
}

/** Shape of live-pages.json (read by the sitemap). */
export interface LiveIndex {
  note: string;
  hub: { updated: string } | null;
  pages: { slug: string; updated: string }[];
}

export const LIVE_INDEX_PATH: string;
export function loadContent(opts?: { rootDir?: string; fresh?: boolean }): ContentIndex;
export function getBuildablePages(): LoadedPage[];
export function getLoadedPage(slug: string): LoadedPage | undefined;
export function getLivePages(): LoadedPage[];
export function getHub(): LoadedHub;
export function computeLiveIndex(index: ContentIndex): LiveIndex;
export function readLiveIndexFile(rootDir?: string): LiveIndex | null;
export function sameLiveIndex(a: LiveIndex | null, b: LiveIndex | null): boolean;
export function assertLiveIndexFresh(): void;
