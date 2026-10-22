import type { Metadata } from 'next';

import { getBackgroundAvailability } from '@/components/v2/thumbnail-backgrounds/availability';
import {
  BACKGROUND_HEIGHT,
  BACKGROUND_WIDTH,
  BACKGROUNDS,
  backgroundSrc,
} from '@/components/v2/thumbnail-backgrounds/backgrounds';
import { DESCRIPTION, FAQ, PAGE_URL, TITLE } from '@/components/v2/thumbnail-backgrounds/content';
import ThumbnailBackgroundsPage from '@/components/v2/thumbnail-backgrounds/ThumbnailBackgroundsPage';

// Built once, at build time: the image check below reads public/ on the build machine.
export const dynamic = 'force-static';

const SITE_URL = 'https://base.tube';

// While any background is a placeholder or its file is missing, the page is built with noindex,
// so it can never be indexed with empty "coming soon" boxes. See availability.ts.
const { ready, allReady } = getBackgroundAvailability();
const READY_IDS = BACKGROUNDS.filter((bg) => ready.has(bg.id)).map((bg) => bg.id);

const NOINDEX = { index: false, follow: true, googleBot: { index: false, follow: true } } as const;

const OG_IMAGE = allReady
  ? {
      url: `${SITE_URL}${backgroundSrc(BACKGROUNDS[0])}`,
      width: BACKGROUND_WIDTH,
      height: BACKGROUND_HEIGHT,
      alt: BACKGROUNDS[0].alt,
    }
  : { url: `${SITE_URL}/images/og-card.webp`, width: 1200, height: 630, alt: 'Base.Tube: free YouTube thumbnail backgrounds' };

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    'youtube thumbnail backgrounds, youtube thumbnail background, thumbnail background, background for thumbnail, bg for thumbnail, minecraft background for thumbnail, fortnite background for thumbnail',
  authors: [{ name: 'Base.Tube' }],
  ...(allReady ? {} : { robots: NOINDEX }),
  openGraph: {
    type: 'website',
    url: PAGE_URL,
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@base_tube',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
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
      isPartOf: { '@type': 'WebSite', name: 'Base.Tube', url: SITE_URL },
      breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
      ...(allReady ? { mainEntity: { '@id': `${PAGE_URL}#gallery` } } : {}),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Base.Tube', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'YouTube thumbnail backgrounds', item: PAGE_URL },
      ],
    },
    // The images (with their usage terms) are only described once they all exist.
    ...(allReady
      ? [
          {
            '@type': 'ImageGallery',
            '@id': `${PAGE_URL}#gallery`,
            name: 'Free YouTube thumbnail backgrounds',
            url: PAGE_URL,
            image: BACKGROUNDS.map((bg) => ({
              '@type': 'ImageObject',
              contentUrl: `${SITE_URL}${backgroundSrc(bg)}`,
              name: bg.title,
              description: bg.alt,
              width: BACKGROUND_WIDTH,
              height: BACKGROUND_HEIGHT,
              encodingFormat: 'image/webp',
              creditText: 'Base.Tube',
              creator: { '@type': 'Organization', name: 'Base.Tube', url: SITE_URL },
              license: `${PAGE_URL}#terms`,
              acquireLicensePage: `${PAGE_URL}#terms`,
            })),
          },
        ]
      : []),
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

export default function YouTubeThumbnailBackgroundsRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, first-party data only; "<" is escaped so it can never close the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <ThumbnailBackgroundsPage readyIds={READY_IDS} />
    </>
  );
}
