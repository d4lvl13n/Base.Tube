import type { Metadata } from 'next';
import ThumbnailPreviewPage from '@/components/v2/thumbnail-preview/ThumbnailPreviewPage';
import { FAQ } from '@/components/v2/thumbnail-preview/faq';

const PAGE_URL = 'https://base.tube/tools/youtube-thumbnail-preview';
const TITLE = 'Free YouTube Thumbnail Preview: Feed, Search, Mobile';
const DESCRIPTION =
  'Preview your YouTube thumbnail and title in the home feed, search, up-next list and mobile, light or dark, beside other videos. Free, runs in your browser.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    'youtube thumbnail preview, thumbnail preview, youtube thumbnail mockup, thumbnail video preview, yt thumbnail preview, thumbnail preview youtube',
  authors: [{ name: 'Base.Tube' }],
  openGraph: {
    type: 'website',
    url: PAGE_URL,
    title: `${TITLE} | Base.Tube`,
    description: DESCRIPTION,
    images: [
      {
        url: 'https://base.tube/images/og-card.webp',
        width: 1200,
        height: 630,
        alt: 'Base.Tube YouTube thumbnail preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@base_tube',
    title: `${TITLE} | Base.Tube`,
    description: DESCRIPTION,
    images: ['https://base.tube/images/og-card.webp'],
  },
  alternates: {
    canonical: PAGE_URL,
  },
  other: {
    'application-name': 'Base.Tube YouTube Thumbnail Preview',
  },
};

const webApplication = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'YouTube Thumbnail Preview',
  url: PAGE_URL,
  description: DESCRIPTION,
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any (runs in the browser)',
  offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
  publisher: { '@type': 'Organization', name: 'Base.Tube', url: 'https://base.tube' },
};

const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

const breadcrumbs = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Base.Tube', item: 'https://base.tube' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://base.tube/tools' },
    { '@type': 'ListItem', position: 3, name: 'YouTube Thumbnail Preview', item: PAGE_URL },
  ],
};

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export default function YouTubeThumbnailPreviewRoute() {
  return (
    <>
      <JsonLd data={webApplication} />
      <JsonLd data={faqPage} />
      <JsonLd data={breadcrumbs} />
      <ThumbnailPreviewPage />
    </>
  );
}
