import type { Metadata } from 'next';
import ThumbnailResizerPage from '@/components/v2/thumbnail-resizer/ThumbnailResizerPage';
import { faqs } from '@/components/v2/thumbnail-resizer/content';

const URL = 'https://base.tube/tools/youtube-thumbnail-resizer';
const TITLE = 'YouTube Thumbnail Resizer: Free 1280x720 Converter';
const DESCRIPTION =
  'Resize any image into a YouTube thumbnail in your browser. Crop or fit to 16:9, export a 1280x720 JPG or PNG under 2 MB. Free, no sign-up.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    'youtube thumbnail resizer, resize image for youtube thumbnail, thumbnail resizer, 1280x720 converter, youtube thumbnail converter, youtube thumbnail compressor',
  authors: [{ name: 'Base.Tube' }],
  openGraph: {
    type: 'website',
    url: URL,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: 'https://base.tube/images/og-card.webp',
        width: 1200,
        height: 630,
        alt: 'Base.Tube YouTube thumbnail resizer',
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
    canonical: URL,
  },
  other: {
    'application-name': 'Base.Tube Thumbnail Resizer',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'YouTube Thumbnail Resizer',
    url: URL,
    description: DESCRIPTION,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any (runs in a web browser)',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: 'Base.Tube', url: 'https://base.tube' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Base.Tube', item: 'https://base.tube' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://base.tube/tools' },
      { '@type': 'ListItem', position: 3, name: 'YouTube Thumbnail Resizer', item: URL },
    ],
  },
];

export default function YouTubeThumbnailResizerRoute() {
  return (
    <>
      {jsonLd.map((d) => (
        <script
          key={d['@type']}
          type="application/ld+json"
          // "<" is escaped so the JSON can never close the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, '\\u003c') }}
        />
      ))}
      <ThumbnailResizerPage />
    </>
  );
}
