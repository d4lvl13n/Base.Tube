import type { Metadata } from 'next';
import ThumbnailSizePage from '@/components/v2/thumbnail-size/ThumbnailSizePage';
import { FAQ } from '@/components/v2/thumbnail-size/content';
import { CHECKED_ON_ISO } from '@/components/v2/thumbnail-size/specs';

const PAGE_URL = 'https://base.tube/youtube-thumbnail-size';
const TITLE = 'YouTube Thumbnail Size (2026): 3840x2160 + Free Checker';
const DESCRIPTION =
  'YouTube recommends 3840x2160 (16:9), min width 640 px, max 2 MB in the phone app or 50 MB on desktop. Drop your image to check it. Checked Sep 2026.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    'youtube thumbnail size, youtube thumbnail dimensions, youtube thumbnail aspect ratio, youtube thumbnail file size, youtube shorts thumbnail size, thumbnail size checker',
  authors: [{ name: 'Base.Tube' }],
  openGraph: {
    type: 'website',
    url: PAGE_URL,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: 'https://base.tube/images/og-card.webp',
        width: 1200,
        height: 630,
        alt: 'Base.Tube: YouTube thumbnail size checker',
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
      mainEntity: { '@id': `${PAGE_URL}#app` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Base.Tube', item: 'https://base.tube' },
        { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://base.tube/tools' },
        { '@type': 'ListItem', position: 3, name: 'YouTube thumbnail size', item: PAGE_URL },
      ],
    },
    {
      '@type': 'WebApplication',
      '@id': `${PAGE_URL}#app`,
      name: 'YouTube Thumbnail Size Checker',
      url: PAGE_URL,
      description:
        'Drop an image to check it against YouTube thumbnail rules: resolution, 16:9 aspect ratio, file size and format. Runs in your browser; the image is never uploaded.',
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Any (web browser)',
      browserRequirements: 'Requires JavaScript',
      dateModified: CHECKED_ON_ISO,
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
      publisher: { '@type': 'Organization', name: 'Base.Tube', url: 'https://base.tube' },
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

export default function YouTubeThumbnailSizeRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, first-party data only; "<" is escaped so it can never close the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <ThumbnailSizePage />
    </>
  );
}
