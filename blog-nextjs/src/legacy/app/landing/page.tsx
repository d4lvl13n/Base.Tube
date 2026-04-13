import { Metadata } from 'next';
import V2LandingPage from '@/components/v2/LandingPage';
import '../v2.css';

export const metadata: Metadata = {
  title: 'Base.Tube — Where Creators Build Their Economy',
  description: 'The creator monetization platform built on ownership. Fans buy once, own forever, and can resell. Creators keep 90% upfront plus earn from every resale.',
  keywords: 'creator monetization, content pass, creator economy, fan ownership, Base.Tube, tradeable access',
  authors: [{ name: 'Base.Tube' }],
  openGraph: {
    type: 'website',
    url: 'https://www.base.tube/',
    title: 'Base.Tube — Where Creators Build Their Economy',
    description: 'Own your audience. Fans buy once, own forever, and resell when they leave. You keep 90% and earn from every resale.',
    images: [
      {
        url: 'https://www.base.tube/img/og-card.webp',
        width: 1200,
        height: 630,
        alt: 'Base.Tube — Creator Monetization Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base.Tube — Where Creators Build Their Economy',
    description: 'Own your audience. Fans buy once, own forever, and resell when they leave. You keep 90% and earn from every resale.',
    images: ['https://www.base.tube/img/og-card.webp'],
  },
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/apple-touch-icon.png',
  },
};

export default function LandingPage() {
  return <V2LandingPage />;
}
