import { Metadata } from 'next';
import ContentPassPage from '@/components/v2/ContentPassPage';

export const metadata: Metadata = {
  title: 'Content Pass — Tradeable memberships for creators | Base.Tube',
  description:
    'The complete guide to Content Passes: tradeable memberships with 90% revenue share, resale royalties, and lifetime fan access. No subscriptions, no algorithms.',
  keywords:
    'content pass, tradeable membership, creator monetization, 90% revenue share, resale royalty, fan ownership, Base.Tube',
  authors: [{ name: 'Base.Tube' }],
  openGraph: {
    type: 'website',
    url: 'https://base.tube/content-pass',
    title: 'Content Pass — Tradeable memberships for creators | Base.Tube',
    description:
      'Fans buy once, own forever, and can resell. Creators keep 90% upfront and earn 5% on every resale — written into the smart contract.',
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
    title: 'Content Pass — Tradeable memberships for creators | Base.Tube',
    description:
      'Fans buy once, own forever, and can resell. Creators keep 90% upfront and earn 5% on every resale.',
    images: ['https://base.tube/images/og-card.webp'],
  },
  alternates: {
    canonical: 'https://base.tube/content-pass',
  },
};

export default function ContentPassRoute() {
  return <ContentPassPage />;
}
