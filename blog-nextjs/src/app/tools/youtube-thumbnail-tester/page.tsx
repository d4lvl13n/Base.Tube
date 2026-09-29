import type { Metadata } from 'next';
import ThumbnailTesterPage from '@/components/v2/thumbnail-tester/ThumbnailTesterPage';
import { FAQ, PAGE_DESCRIPTION, PAGE_TITLE, PAGE_URL } from '@/components/v2/thumbnail-tester/content';

const OG_IMAGE = 'https://base.tube/images/og-card.webp';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords:
    'thumbnail tester, youtube thumbnail test, test my thumbnail, test thumbnail, thumbnail test youtube, compare youtube thumbnails',
  authors: [{ name: 'Base.Tube' }],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'website',
    url: PAGE_URL,
    siteName: 'Base.Tube',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Base.Tube YouTube thumbnail tester' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@base_tube',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const webApplication = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'YouTube Thumbnail Tester',
  url: PAGE_URL,
  description: PAGE_DESCRIPTION,
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any (runs in a web browser)',
  browserRequirements: 'Requires JavaScript and a browser with canvas support',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Compare two or three thumbnail variants side by side',
    'Feed, squint, grayscale, tiny-size and duration-badge views',
    'Brightness, contrast and colour measurements computed in the browser',
    'Manual checklist for focal point, text, small-size legibility, face and title fit',
  ],
  publisher: { '@type': 'Organization', name: 'Base.Tube', url: 'https://base.tube' },
};

const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
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
    { '@type': 'ListItem', position: 3, name: 'YouTube Thumbnail Tester', item: PAGE_URL },
  ],
};

const json = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

export default function YouTubeThumbnailTesterRoute() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(webApplication) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(faqPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(breadcrumbs) }} />
      <ThumbnailTesterPage />
    </>
  );
}
