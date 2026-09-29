import { Metadata } from 'next';
import ToolsPage from '@/components/v2/ToolsPage';

// Titles must NOT contain the brand: the root layout template appends " | Base.Tube".
// Open Graph / Twitter titles are not templated, so they carry the brand once.
export const metadata: Metadata = {
  title: 'Free Creator Tools: Channel Audit & Thumbnails',
  description:
    'Free tools for YouTube creators: audit your thumbnails and titles, then make new thumbnails in your channel\'s style. Measure results with your real CTR.',
  keywords:
    'free creator tools, youtube thumbnail tools, youtube channel audit, ai thumbnail generator, youtube thumbnail audit, creator tools free',
  authors: [{ name: 'Base.Tube' }],
  openGraph: {
    type: 'website',
    url: 'https://base.tube/tools',
    title: 'Free Creator Tools: Channel Audit & Thumbnails | Base.Tube',
    description:
      'Audit your thumbnails and titles for free, and make new thumbnails in your channel\'s style. Connect YouTube to see your real click-through rate.',
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
    title: 'Free Creator Tools: Channel Audit & Thumbnails | Base.Tube',
    description: 'Free channel audit and AI thumbnails in your own style. Measure with your real CTR.',
    images: ['https://base.tube/images/og-card.webp'],
  },
  alternates: {
    canonical: 'https://base.tube/tools',
  },
};

export default function ToolsRoute() {
  return <ToolsPage />;
}
