import { Metadata } from 'next';
import CTROptimizerPage, { ctrFaqs } from '@/components/v2/tools/CTROptimizerPage';

// The URL keeps its old slug (/tools/ctr-optimizer) to preserve existing URL equity.
// The page is an honest "in development" page for Base.Tube's own CTR AI. The free
// channel audit now lives at /youtube-channel-audit.
// Titles must NOT contain the brand: the root layout template appends " | Base.Tube".
const PAGE_URL = 'https://base.tube/tools/ctr-optimizer';
const TITLE = 'YouTube CTR AI: In Development';
const DESCRIPTION =
  'Base.Tube is building its own AI to analyze YouTube thumbnails and click-through rate. It is not released yet. Get notified when it launches.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    'youtube ctr ai, youtube ctr analyzer, thumbnail ctr analysis, click-through rate ai, youtube thumbnail analysis',
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
        alt: 'Base.Tube CTR AI, in development',
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
    'application-name': 'Base.Tube CTR AI',
  },
};

const jsonLd = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') });

// Nothing is available yet, so there is no WebApplication or offer, only the page and its FAQ.
const webPage = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: TITLE,
  url: PAGE_URL,
  description: DESCRIPTION,
};

const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: ctrFaqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function CTROptimizerRoute() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(webPage)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqPage)} />
      <CTROptimizerPage />
    </>
  );
}
