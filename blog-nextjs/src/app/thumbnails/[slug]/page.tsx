import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { assertLiveIndexFresh, getBuildablePages, getLoadedPage } from '@/components/v2/thumbnail-pages/lib/content.mjs';
import { buildPageMetadata } from '@/components/v2/thumbnail-pages/seo';
import ThumbnailStylePage from '@/components/v2/thumbnail-pages/ThumbnailStylePage';

// One static page per file in content/thumbnails/ (drafts included, served with noindex).
// Unknown slugs return 404.
export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  // Stops the production build if the sitemap index (live-pages.json) no longer
  // matches the content files. Fix: run `node scripts/validate-thumbnails.mjs`.
  assertLiveIndexFresh();
  return getBuildablePages().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const loaded = getLoadedPage(slug);
  if (!loaded?.page) return {};
  return buildPageMetadata(loaded);
}

export default async function ThumbnailNichePage({ params }: Params) {
  const { slug } = await params;
  const loaded = getLoadedPage(slug);
  if (!loaded?.page) notFound();
  return <ThumbnailStylePage loaded={loaded} />;
}
