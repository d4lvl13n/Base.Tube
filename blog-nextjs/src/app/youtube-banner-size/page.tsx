import type { Metadata } from 'next';
import BannerSizePage from '@/components/v2/banner-size/BannerSizePage';
import { DESCRIPTION, FAQ, PAGE_URL, TITLE } from '@/components/v2/banner-size/content';
import { CHECKED_ON_ISO } from '@/components/v2/banner-size/specs';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    'youtube banner size, youtube banner dimensions, youtube banner size for all devices, youtube banner 2048x1152, youtube banner 2560x1440, youtube banner size mobile, 1024x576 youtube banner, youtube banner safe area, youtube channel art size',
  authors: [{ name: 'Base.Tube' }],
  openGraph: {
    type: 'article',
    url: PAGE_URL,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: 'https://base.tube/images/og-card.webp',
        width: 1200,
        height: 630,
        alt: 'Base.Tube: YouTube banner size guide and checker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@base_tube',
    title: TITLE,
    description: DESCRIPTION,
    images: ['https://base.tube/images/og-card.webp'],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: 'en',
      dateModified: CHECKED_ON_ISO,
      isPartOf: { '@type': 'WebSite', name: 'Base.Tube', url: 'https://base.tube' },
      breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
      mainEntity: { '@id': `${PAGE_URL}#article` },
    },
    {
      '@type': 'Article',
      '@id': `${PAGE_URL}#article`,
      headline: 'YouTube banner size: 2560 × 1440 pixels',
      description: DESCRIPTION,
      inLanguage: 'en',
      datePublished: CHECKED_ON_ISO,
      dateModified: CHECKED_ON_ISO,
      mainEntityOfPage: { '@id': `${PAGE_URL}#webpage` },
      image: 'https://base.tube/images/og-card.webp',
      author: { '@type': 'Organization', name: 'Base.Tube', url: 'https://base.tube' },
      publisher: { '@type': 'Organization', name: 'Base.Tube', url: 'https://base.tube' },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Base.Tube', item: 'https://base.tube' },
        { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://base.tube/tools' },
        { '@type': 'ListItem', position: 3, name: 'YouTube banner size', item: PAGE_URL },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${PAGE_URL}#faq`,
      mainEntity: FAQ.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ],
};

export default function YouTubeBannerSizeRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, first-party data only; "<" is escaped so it can never close the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <BannerSizePage />
    </>
  );
}
