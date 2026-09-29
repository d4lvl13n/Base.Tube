import type { Metadata } from 'next';
import TitleCheckerPage from '@/components/v2/title-checker/TitleCheckerPage';
import { FAQS, PAGE_URL } from '@/components/v2/title-checker/content';

const TITLE = 'YouTube Title Checker: Length, Limit & Preview';
const DESCRIPTION =
  'Free YouTube title checker. Count characters against the 100-character limit and see where your title is cut on desktop, mobile and search.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    'youtube title checker, youtube title length, youtube title character limit, title length checker, youtube title analyzer, youtube title preview',
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
        alt: 'Base.Tube YouTube title checker',
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

const webApplication = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'YouTube Title Checker',
  url: PAGE_URL,
  description: DESCRIPTION,
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any (runs in a web browser)',
  browserRequirements: 'Requires JavaScript',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Character count against the 100-character YouTube title limit',
    'Cut-off previews for desktop home, mobile feed, suggested videos and desktop search',
    'Front-loading, capitals, emoji, punctuation, repeated words, numbers and brackets checks',
    'Compare up to 10 alternative titles',
    'Runs in the browser: titles and thumbnails are never uploaded',
  ],
  publisher: { '@type': 'Organization', name: 'Base.Tube', url: 'https://base.tube' },
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
    { '@type': 'ListItem', position: 3, name: 'YouTube Title Checker', item: PAGE_URL },
  ],
};

/** JSON-LD must not be able to close the script tag early. */
const ld = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

export default function YouTubeTitleCheckerRoute() {
  return (
    <>
      {[webApplication, faqPage, breadcrumbs].map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(data) }} />
      ))}
      <TitleCheckerPage />
    </>
  );
}
