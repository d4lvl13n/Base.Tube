import { Metadata } from 'next';
import LandingPageClient from '@/components/landing/LandingPageClient';
import '../usp2.css';
import '../hero.css';
import '../video.css';
import '../manifesto.css';
import '../howto.css';
import '../perks.css';
import '../transformation.css';
import '../narrative.css';

// SEO metadata
export const metadata: Metadata = {
  title: 'Base.Tube - Web3 Video Sharing App | Decentralized Content Creation',
  description: 'Base.Tube is revolutionizing digital storytelling with decentralized video sharing. Join the future of content creation and earn rewards for your engagement.',
  keywords: 'Base.Tube, Web3, video sharing, decentralized, NFT, content creation, digital storytelling',
  authors: [{ name: 'Base.Tube' }],
  openGraph: {
    type: 'website',
    url: 'https://www.base.tube/',
    title: 'Base.Tube - Web3 Video Sharing App',
    description: 'Revolutionize your video experience with Base.Tube. Decentralized content creation and rewards for all.',
    images: [
      {
        url: 'https://www.base.tube/img/og-card.webp',
        width: 1200,
        height: 630,
        alt: 'Base.Tube Web3 Video Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base.Tube - Web3 Video Sharing App',
    description: 'Revolutionize your video experience with Base.Tube. Decentralized content creation and rewards for all.',
    images: ['https://www.base.tube/img/og-card.webp'],
  },
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/apple-touch-icon.png',
  },
};

export default function LandingPage() {
  return <LandingPageClient />;
} 