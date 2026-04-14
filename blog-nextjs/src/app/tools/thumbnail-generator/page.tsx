import { Metadata } from 'next';
import ThumbnailGeneratorPage from '@/components/v2/tools/ThumbnailGeneratorPage';

export const metadata: Metadata = {
  title: 'AI YouTube Thumbnail Generator — Free | Base.Tube',
  description:
    'Generate AI-optimized YouTube thumbnails in seconds. Describe your video, get 4 variants ranked by projected CTR. Free tier: 3 generations/day, no signup.',
  keywords:
    'ai thumbnail generator, youtube thumbnail maker, ai thumbnail creator, youtube thumbnail generator free, ai youtube thumbnail, thumbnail generator no signup',
  authors: [{ name: 'Base.Tube' }],
  openGraph: {
    type: 'website',
    url: 'https://base.tube/tools/thumbnail-generator',
    title: 'AI YouTube Thumbnail Generator — Free | Base.Tube',
    description:
      'Describe your video, get 4 AI-generated thumbnail variants ranked by CTR. Free tier: 3/day, no signup required.',
    images: [
      {
        url: 'https://base.tube/images/og-card.webp',
        width: 1200,
        height: 630,
        alt: 'Base.Tube AI Thumbnail Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@base_tube',
    title: 'AI YouTube Thumbnail Generator — Free | Base.Tube',
    description: '4 AI thumbnail variants, ranked by CTR. Free tier: 3/day.',
    images: ['https://base.tube/images/og-card.webp'],
  },
  alternates: {
    canonical: 'https://base.tube/tools/thumbnail-generator',
  },
  other: {
    'application-name': 'Base.Tube AI Thumbnail Generator',
  },
};

export default function ThumbnailGeneratorRoute() {
  return <ThumbnailGeneratorPage />;
}
