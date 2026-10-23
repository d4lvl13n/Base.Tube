import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import CreatorPage from '@/components/v2/creators/CreatorPage';
import { getCreator, getCreators } from '@/components/v2/creators/creators';
import { assertCreatorsIndexFresh } from '@/components/v2/creators/lib/creators-files.mjs';
import { buildCreatorMetadata } from '@/components/v2/creators/seo';

// One static page per file in content/creators/ (drafts included, served with noindex).
// Unknown slugs return 404.
export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  // Stops the production build if creators-index.json (read by the sitemap) no longer matches
  // the creator files. Fix: run `node scripts/creators-index.mjs`.
  assertCreatorsIndexFresh();
  return getCreators().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const creator = getCreator(slug);
  return creator ? buildCreatorMetadata(creator) : {};
}

export default async function CreatorRoute({ params }: Params) {
  const { slug } = await params;
  const creator = getCreator(slug);
  if (!creator) notFound();
  return <CreatorPage creator={creator} />;
}
