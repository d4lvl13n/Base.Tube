import { Metadata } from 'next';
import CTROptimizerPage from '@/components/v2/tools/CTROptimizerPage';

export const metadata: Metadata = {
  title: 'Free YouTube Thumbnail Analyzer & CTR Score | Base.Tube',
  description:
    'Upload your YouTube thumbnail and get an instant CTR score with face detection, text legibility analysis, and contrast scoring. Free, no signup required.',
  keywords:
    'youtube thumbnail analyzer, thumbnail ctr score, thumbnail tester, youtube thumbnail checker, ctr optimizer free, thumbnail analysis tool',
  authors: [{ name: 'Base.Tube' }],
  openGraph: {
    type: 'website',
    url: 'https://base.tube/tools/ctr-optimizer',
    title: 'Free YouTube Thumbnail Analyzer & CTR Score | Base.Tube',
    description:
      'Score your thumbnail in seconds. Face detection, text legibility, contrast analysis — trained on 300k+ real thumbnails.',
    images: [
      {
        url: 'https://base.tube/images/og-card.webp',
        width: 1200,
        height: 630,
        alt: 'Base.Tube CTR Optimizer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@base_tube',
    title: 'Free YouTube Thumbnail Analyzer & CTR Score | Base.Tube',
    description: 'Score your thumbnail in seconds. Free, no signup.',
    images: ['https://base.tube/images/og-card.webp'],
  },
  alternates: {
    canonical: 'https://base.tube/tools/ctr-optimizer',
  },
  other: {
    'application-name': 'Base.Tube CTR Optimizer',
  },
};

export default function CTROptimizerRoute() {
  return <CTROptimizerPage />;
}
