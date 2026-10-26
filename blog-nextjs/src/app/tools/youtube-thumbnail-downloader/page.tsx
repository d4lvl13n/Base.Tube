import type { Metadata } from 'next';
import ThumbnailDownloaderPage from '@/components/v2/thumbnail-downloader/ThumbnailDownloaderPage';
import { FAQS, PAGE_DESCRIPTION, PAGE_TITLE, PAGE_URL } from '@/components/v2/thumbnail-downloader/content';

const OG_TITLE = `${PAGE_TITLE} | Base.Tube`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords:
    'youtube thumbnail downloader, thumbnail downloader, download youtube thumbnail, thumbnail grabber, yt thumbnail downloader, youtube thumbnail grabber, youtube thumbnail download hd',
  authors: [{ name: 'Base.Tube' }],
  openGraph: {
    type: 'website',
    url: PAGE_URL,
    title: OG_TITLE,
    description: PAGE_DESCRIPTION,
    images: [
      {
        url: 'https://base.tube/images/og-card.webp',
        width: 1200,
        height: 630,
        alt: 'Base.Tube YouTube thumbnail downloader',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@base_tube',
    title: OG_TITLE,
    description: PAGE_DESCRIPTION,
    images: ['https://base.tube/images/og-card.webp'],
  },
  alternates: {
    canonical: PAGE_URL,
  },
  other: {
    'application-name': 'Base.Tube YouTube Thumbnail Downloader',
  },
};

const webApplication = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'YouTube Thumbnail Downloader',
  url: PAGE_URL,
  description: PAGE_DESCRIPTION,
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any (runs in a web browser)',
  browserRequirements: 'Requires JavaScript',
  isAccessibleForFree: true,
  featureList: [
    'Accepts watch, youtu.be, Shorts, live and embed links or a video ID',
    'Shows all five thumbnail sizes, from 1280x720 to 120x90',
    'Flags sizes YouTube does not have for the video',
    'Downloads each size as a JPG named after the video ID',
    'Copies the direct image link',
  ],
  offers: {
    '@type': 'Offer',
    price: 0,
    priceCurrency: 'USD',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Base.Tube',
    url: 'https://base.tube',
  },
};

const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const breadcrumbs = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Base.Tube', item: 'https://base.tube' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://base.tube/tools' },
    { '@type': 'ListItem', position: 3, name: 'YouTube Thumbnail Downloader', item: PAGE_URL },
  ],
};

// Escape "<" so the JSON can never close the script tag early.
const ld = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c');

export default function YouTubeThumbnailDownloaderRoute() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(webApplication) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(faqPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(breadcrumbs) }} />
      <ThumbnailDownloaderPage />
    </>
  );
}
