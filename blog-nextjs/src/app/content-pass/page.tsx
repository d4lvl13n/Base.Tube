import { Metadata } from 'next';
import ContentPassPage from '@/components/v2/ContentPassPage';

export const metadata: Metadata = {
  title: 'Content Pass — Own your access, don\'t rent it | Base.Tube',
  description:
    'The complete guide to Content Passes: transferable memberships with 90% revenue share and lifetime fan access. Buy once, own forever — no subscriptions, no algorithms.',
  keywords:
    'content pass, transferable membership, creator monetization, 90% revenue share, fan ownership, Base.Tube',
  authors: [{ name: 'Base.Tube' }],
  openGraph: {
    type: 'website',
    url: 'https://base.tube/content-pass',
    title: 'Content Pass — Own your access, don\'t rent it | Base.Tube',
    description:
      'Fans buy once and own their access forever — transferable, never expiring. Creators keep 90% upfront.',
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
    title: 'Content Pass — Own your access, don\'t rent it | Base.Tube',
    description:
      'Fans buy once and own their access forever — transferable, never expiring. Creators keep 90% upfront.',
    images: ['https://base.tube/images/og-card.webp'],
  },
  alternates: {
    canonical: 'https://base.tube/content-pass',
  },
};

export default function ContentPassRoute() {
  return <ContentPassPage />;
}
