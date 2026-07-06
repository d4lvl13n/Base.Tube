import { Metadata } from 'next';
import V2LandingPage from '@/components/v2/LandingPage';

export const metadata: Metadata = {
  title: 'Base.Tube — Where Creators Build Their Economy',
  description: 'The creator monetization platform built on ownership. Fans buy once and own their access forever — transferable, never expiring. Creators keep 90%.',
  keywords: 'creator monetization, content pass, creator economy, fan ownership, Base.Tube, transferable access',
  authors: [{ name: 'Base.Tube' }],
  openGraph: {
    type: 'website',
    url: 'https://base.tube/',
    title: 'Base.Tube — Where Creators Build Their Economy',
    description: 'Own your audience. Fans buy once and own their access — yours to keep or transfer, never a monthly reset. Creators keep 90%.',
    images: [
      {
        url: 'https://base.tube/images/og-card.webp',
        width: 1200,
        height: 630,
        alt: 'Base.Tube — Creator Monetization Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base.Tube — Where Creators Build Their Economy',
    description: 'Own your audience. Fans buy once and own their access — yours to keep or transfer, never a monthly reset. Creators keep 90%.',
    images: ['https://base.tube/images/og-card.webp'],
  },
};

export default function HomePage() {
  return <V2LandingPage />;
}
