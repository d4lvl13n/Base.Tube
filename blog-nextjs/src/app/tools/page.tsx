import { Metadata } from 'next';
import ToolsPage from '@/components/v2/ToolsPage';

export const metadata: Metadata = {
  title: 'Free Creator Tools — CTR Optimizer & AI Thumbnail Generator | Base.Tube',
  description:
    'Free YouTube thumbnail tools for creators. CTR score your thumbnails instantly, or generate AI-optimized variants. No signup required. Built in-house, not a GPT wrapper.',
  keywords:
    'free creator tools, youtube thumbnail analyzer, ai thumbnail generator, ctr optimizer, thumbnail ctr score, creator tools free',
  authors: [{ name: 'Base.Tube' }],
  openGraph: {
    type: 'website',
    url: 'https://base.tube/tools',
    title: 'Free Creator Tools — CTR Optimizer & AI Thumbnail Generator | Base.Tube',
    description:
      'CTR scoring and AI thumbnail generation. Free, no signup required, trained on 300k+ thumbnails. Not a generic wrapper.',
    images: [
      {
        url: 'https://base.tube/images/og-card.webp',
        width: 1200,
        height: 630,
        alt: 'Base.Tube Creator Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@base_tube',
    title: 'Free Creator Tools — CTR Optimizer & AI Thumbnail Generator | Base.Tube',
    description: 'CTR scoring and AI thumbnail generation. Free, no signup required.',
    images: ['https://base.tube/images/og-card.webp'],
  },
  alternates: {
    canonical: 'https://base.tube/tools',
  },
};

export default function ToolsRoute() {
  return <ToolsPage />;
}
