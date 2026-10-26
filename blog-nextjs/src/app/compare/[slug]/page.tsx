import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ComparePage from '@/components/v2/compare/ComparePage';
import { getComparePage, getComparePages } from '@/components/v2/compare/content';
import { buildCompareMetadata } from '@/components/v2/compare/seo';

// One static page per file in content/compare/ (drafts are built with noindex). Unknown slugs return 404.
export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getComparePages().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getComparePage(slug);
  return page ? buildCompareMetadata(page) : {};
}

export default async function CompareRoute({ params }: Params) {
  const { slug } = await params;
  const page = getComparePage(slug);
  if (!page) notFound();
  return <ComparePage page={page} />;
}
