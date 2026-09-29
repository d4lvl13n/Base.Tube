import type { Metadata } from 'next';
import VideoToThumbnailPage from '@/components/v2/video-to-thumbnail/VideoToThumbnailPage';
import { FAQS, PAGE_DESCRIPTION, PAGE_TITLE, PAGE_URL } from '@/components/v2/video-to-thumbnail/content';

const OG_TITLE = `${PAGE_TITLE} | Base.Tube`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords:
    'video to thumbnail, extract frame from video, thumbnail from video, video frame grabber, create thumbnail from video, how to make a thumbnail from a video',
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
        alt: 'Base.Tube video to thumbnail tool',
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
    'application-name': 'Base.Tube Video to Thumbnail',
  },
};

const webApplication = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Video to Thumbnail',
  url: PAGE_URL,
  description: PAGE_DESCRIPTION,
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any (runs in a web browser)',
  browserRequirements: 'Requires JavaScript and a browser that can play the video file',
  isAccessibleForFree: true,
  featureList: [
    'Step through a video frame by frame',
    'Rank 12 sampled frames by sharpness',
    'Export 1280x720 JPG or PNG with a movable crop frame',
    'Export the full frame at native resolution',
    'Runs in the browser, the video is never uploaded',
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
    { '@type': 'ListItem', position: 3, name: 'Video to Thumbnail', item: PAGE_URL },
  ],
};

// Escape "<" so the JSON can never close the script tag early.
const ld = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c');

export default function VideoToThumbnailRoute() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(webApplication) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(faqPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(breadcrumbs) }} />
      <VideoToThumbnailPage />
    </>
  );
}
