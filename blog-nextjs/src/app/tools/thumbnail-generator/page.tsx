import { Metadata } from 'next';
import ThumbnailGeneratorPage from '@/components/v2/tools/ThumbnailGeneratorPage';
import { faqJsonLd, studioAppJsonLd, studioFaqs } from '@/components/v2/studio-audit/content';

// Titles must NOT contain the brand: the root layout template appends " | Base.Tube".
export const metadata: Metadata = {
  title: 'AI YouTube Thumbnail Generator in Your Style',
  description:
    'Generate YouTube thumbnails in your channel\'s saved style: your brand kit and face, 3 variants per video, one-sentence edits. Live on the Base.Tube beta.',
  keywords:
    'ai thumbnail generator, youtube thumbnail generator, ai youtube thumbnail maker, thumbnail generator in your style, ai thumbnail studio',
  authors: [{ name: 'Base.Tube' }],
  openGraph: {
    type: 'website',
    url: 'https://base.tube/tools/thumbnail-generator',
    title: 'AI YouTube Thumbnail Generator in Your Style | Base.Tube',
    description:
      'AI Thumbnail Studio makes 3 thumbnail variants per video in your saved brand kit and with your own face. Change anything with one sentence.',
    images: [
      {
        url: 'https://base.tube/images/og-card.webp',
        width: 1200,
        height: 630,
        alt: 'Base.Tube AI Thumbnail Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@base_tube',
    title: 'AI YouTube Thumbnail Generator in Your Style | Base.Tube',
    description: '3 thumbnail variants per video, in your brand kit and with your face. Live on the beta.',
    images: ['https://base.tube/images/og-card.webp'],
  },
  alternates: {
    canonical: 'https://base.tube/tools/thumbnail-generator',
  },
  other: {
    'application-name': 'Base.Tube AI Thumbnail Studio',
  },
};

export default function ThumbnailGeneratorRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(studioAppJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(studioFaqs)) }}
      />
      <ThumbnailGeneratorPage />
    </>
  );
}
