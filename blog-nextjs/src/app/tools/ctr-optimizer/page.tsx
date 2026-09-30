import type { Metadata } from 'next';
import CtrOptimizerPage from '@/components/ctr-optimizer/CtrOptimizerPage';
import { CTR_FAQ } from '@/components/ctr-optimizer/content';
// The AI Thumbnails page's type, buttons, motion and FAQ styles (all scoped to .lp or lp- names).
import '../../ai-thumbnails/ai-thumbnails.css';

// The URL keeps its old slug (/tools/ctr-optimizer) to preserve existing URL equity.
// The page is an honest "in development" page for Base.Tube's own CTR AI, with a waitlist.
// Titles must NOT contain the brand: the root layout template appends " | Base.Tube".
const PAGE_URL = 'https://base.tube/tools/ctr-optimizer';
const TITLE = 'YouTube CTR AI: In Development';
const DESCRIPTION =
  'Which thumbnail gets the click? Base.Tube is teaching its own AI to answer that. It isn’t good enough to trust yet, so it isn’t released. Get notified.';

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

// The same list the page shows (CTR_FAQ), word for word.
const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: CTR_FAQ.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

export default function CTROptimizerRoute() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(webPage)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqPage)} />
      <CtrOptimizerPage />
    </>
  );
}
