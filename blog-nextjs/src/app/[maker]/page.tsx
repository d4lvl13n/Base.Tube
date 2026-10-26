import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import MakerPage from '@/components/v2/maker-pages/MakerPage';
import { getMakerBySlug, MAKERS, makerSlug } from '@/components/v2/maker-pages/makers';
import { buildMakerMetadata } from '@/components/v2/maker-pages/seo';
import { getLoadedPage } from '@/components/v2/thumbnail-pages/lib/content.mjs';
import type { ThumbnailPage } from '@/components/v2/thumbnail-pages/lib/schema.mjs';

// One static page per entry in maker-pages/makers.ts: /fortnite-thumbnail-maker…
// Any other root URL is not handled here (404), so the site's other routes are untouched.
export const dynamicParams = false;

type Params = { params: Promise<{ maker: string }> };

export function generateStaticParams() {
  // Only games whose gallery is live (6 real images): the page is built from those images.
  return MAKERS.filter((m) => getLoadedPage(m.game)?.live).map((m) => ({ maker: makerSlug(m.game) }));
}

function load(slug: string) {
  const maker = getMakerBySlug(slug);
  const gallery = maker ? getLoadedPage(maker.game) : undefined;
  return maker && gallery?.page && gallery.live ? { maker, gallery } : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const found = load((await params).maker);
  return found ? buildMakerMetadata(found.maker, found.gallery.page as ThumbnailPage) : {};
}

export default async function MakerRoute({ params }: Params) {
  const found = load((await params).maker);
  if (!found) notFound();
  return <MakerPage maker={found.maker} gallery={found.gallery} />;
}
