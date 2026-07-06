import { Metadata } from 'next';
import ContentPassPage from '@/components/v2/ContentPassPage';

export const metadata: Metadata = {
  title: 'Content Pass — The Patreon Alternative Creators & Fans Own | Base.Tube',
  description:
    'Content Pass is a one-time pass that unlocks a creator\'s content for life — the Patreon alternative where creators keep 90% and fans truly own their access (buy once, transfer anytime). No subscriptions.',
  keywords:
    'content pass, patreon alternative, one-time creator pass, youtuber audience pass, creator monetization platform, 90% revenue share, fan ownership',
  authors: [{ name: 'Base.Tube' }],
  openGraph: {
    type: 'website',
    url: 'https://base.tube/content-pass',
    title: 'Content Pass — The Patreon Alternative Creators & Fans Own | Base.Tube',
    description:
      'A one-time pass that unlocks a creator\'s content for life — the Patreon alternative where creators keep 90% and fans own their access. Buy once, transfer anytime, no subscriptions.',
    images: [
      {
        url: 'https://base.tube/images/og-card.webp',
        width: 1200,
        height: 630,
        alt: 'Base.Tube Content Pass',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@base_tube',
    title: 'Content Pass — The Patreon Alternative Creators & Fans Own | Base.Tube',
    description:
      'A one-time pass that unlocks a creator\'s content for life — the Patreon alternative where creators keep 90% and fans own their access. Buy once, transfer anytime, no subscriptions.',
    images: ['https://base.tube/images/og-card.webp'],
  },
  alternates: {
    canonical: 'https://base.tube/content-pass',
  },
};

export default function ContentPassRoute() {
  return <ContentPassPage />;
}
