import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { realExamples } from '@/components/v2/thumbnail-pages/games';
import { getBuildablePages, getHub, getLivePages } from '@/components/v2/thumbnail-pages/lib/content.mjs';
import type { ThumbnailPage } from '@/components/v2/thumbnail-pages/lib/schema.mjs';
import { buildHubMetadata } from '@/components/v2/thumbnail-pages/seo';
import ThumbnailHubPage from '@/components/v2/thumbnail-pages/ThumbnailHubPage';

// The hub lists live pages only (published and complete). It is served with
// noindex until HUB_MIN_LIVE_PAGES pages are live (see lib/config.mjs).

// Before the hub is live (noindex), it previews every page that has images, drafts included.
function livePages(): ThumbnailPage[] {
  const source = getHub().live ? getLivePages() : getBuildablePages();
  return source.map((p) => p.page as ThumbnailPage).filter((p) => realExamples(p).length > 0);
}

export function generateMetadata(): Metadata {
  const pages = livePages();
  return buildHubMetadata(getHub(), pages[0]?.gallery[0]);
}

export default function ThumbnailsHubRoute() {
  const hub = getHub();
  if (!hub.hub) notFound();
  return <ThumbnailHubPage loaded={hub} pages={livePages()} />;
}
