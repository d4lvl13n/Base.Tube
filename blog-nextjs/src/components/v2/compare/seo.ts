import type { Metadata } from 'next';

import { SITE_URL } from '../thumbnail-pages/lib/config.mjs';
import { stripInline } from '../thumbnail-pages/lib/markdown-lite.mjs';
import { comparePath, type ComparePage } from './content';

const NOINDEX = { index: false, follow: true, googleBot: { index: false, follow: true } } as const;
const absolute = (src: string) => (src.startsWith('http') ? src : `${SITE_URL}${src}`);

export const compareUrl = (slug: string) => `${SITE_URL}${comparePath(slug)}`;

function ogImage(p: ComparePage) {
  const first = p.demo?.images[0];
  return first
    ? { url: absolute(first.src), width: 1280, height: 720, alt: first.alt }
    : { url: `${SITE_URL}/images/og-card.webp`, width: 1200, height: 630, alt: 'Base.Tube' };
}

export function buildCompareMetadata(p: ComparePage): Metadata {
  const url = compareUrl(p.slug);
  const og = ogImage(p);
  return {
    title: { absolute: p.title },
    description: p.description,
    keywords: [p.primaryKeyword, ...p.secondaryKeywords],
    alternates: { canonical: url },
    openGraph: { type: 'article', url, siteName: 'Base.Tube', title: p.title, description: p.description, images: [og] },
    twitter: { card: 'summary_large_image', site: '@base_tube', title: p.title, description: p.description, images: [og.url] },
    ...(p.status === 'published' ? {} : { robots: NOINDEX }),
  };
}

/** One JSON-LD graph: Article + FAQPage + BreadcrumbList. */
export function buildCompareJsonLd(p: ComparePage) {
  const url = compareUrl(p.slug);
  const publisher = { '@type': 'Organization', name: 'Base.Tube', url: SITE_URL };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        mainEntityOfPage: url,
        url,
        headline: p.title,
        description: p.description,
        inLanguage: 'en',
        datePublished: p.published,
        dateModified: p.updated,
        image: ogImage(p).url,
        keywords: [p.primaryKeyword, ...p.secondaryKeywords].join(', '),
        author: publisher,
        publisher,
        about: [
          { '@type': 'SoftwareApplication', name: p.them, applicationCategory: 'DesignApplication' },
          { '@type': 'SoftwareApplication', name: p.us, applicationCategory: 'DesignApplication', url: SITE_URL },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: p.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: stripInline(f.a) },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'AI thumbnails', item: `${SITE_URL}/ai-thumbnails` },
          { '@type': 'ListItem', position: 3, name: `${p.them} vs ${p.us}`, item: url },
        ],
      },
    ],
  };
}
