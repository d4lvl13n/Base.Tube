import { Metadata } from 'next';
import CTROptimizerPage from '@/components/v2/tools/CTROptimizerPage';
import { auditAppJsonLd, auditFaqs, faqJsonLd } from '@/components/v2/studio-audit/content';

// The URL keeps its old slug (/tools/ctr-optimizer) to preserve existing URL equity;
// the page is now positioned as a YouTube thumbnail & channel audit. No CTR score.
// Titles must NOT contain the brand: the root layout template appends " | Base.Tube".
export const metadata: Metadata = {
  title: 'Free YouTube Thumbnail & Channel Audit',
  description:
    'Free audit of your YouTube thumbnails and titles with an evidence-based critique. Connect YouTube to see your real impressions and click-through rate.',
  keywords:
    'youtube thumbnail audit, youtube channel audit, thumbnail analyzer, thumbnail checker, youtube title and thumbnail review, free channel audit',
  authors: [{ name: 'Base.Tube' }],
  openGraph: {
    type: 'website',
    url: 'https://base.tube/tools/ctr-optimizer',
    title: 'Free YouTube Thumbnail & Channel Audit | Base.Tube',
    description:
      'A written critique of your thumbnails and titles, based on evidence from your own videos. Connect YouTube to measure your real click-through rate.',
    images: [
      {
        url: 'https://base.tube/images/og-card.webp',
        width: 1200,
        height: 630,
        alt: 'Base.Tube YouTube Thumbnail & Channel Audit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@base_tube',
    title: 'Free YouTube Thumbnail & Channel Audit | Base.Tube',
    description: 'Free audit of your thumbnails and titles. Real CTR when you connect YouTube.',
    images: ['https://base.tube/images/og-card.webp'],
  },
  alternates: {
    canonical: 'https://base.tube/tools/ctr-optimizer',
  },
  other: {
    'application-name': 'Base.Tube Channel Audit',
  },
};

export default function CTROptimizerRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(auditAppJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(auditFaqs)) }}
      />
      <CTROptimizerPage />
    </>
  );
}
