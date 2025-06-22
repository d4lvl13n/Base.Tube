import { Metadata } from 'next';
import LandingLayout from '@/components/LandingLayout';
import HeroSection from '@/components/landing/HeroSection';
import ManifestoSection from '@/components/landing/ManifestoSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import PerksSection from '@/components/landing/PerksSection';
import TransformationSection from '@/components/landing/TransformationSection';
import USPSection2 from '@/components/landing/USPSection2';
import VideoSection from '@/components/landing/VideoSection';
import CTASection from '@/components/landing/CTASection';
import '../usp2.css';
import '../hero.css';
import '../video.css';
import '../manifesto.css';
import '../howto.css';
import '../perks.css';
import '../transformation.css';

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
  return (
    <LandingLayout>
      {/* Progress Bar */}
      <div id="progress-bar"></div>
      
      {/* Three.js Background Container */}
      <div id="three-container" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }}></div>

      <div id="page">
        <main>
          {/* Hero Section with Glitch Effect */}
          <HeroSection />
          
          {/* NEW: Manifesto Section - Visual Storytelling */}
          <ManifestoSection />
          
          {/* NEW: How It Works Section - The Value Flow System */}
          <HowItWorksSection />
          
          {/* NEW: Transformation Section - From Old to New Paradigms */}
          <TransformationSection />
          
          {/* NEW: USP Section 4 - 3D Carousel Galaxy */}
          <USPSection2 />
          
          {/* NEW: Perks Section - Genesis Pass */}
          <PerksSection />
          
          {/* Video Section */}
          <VideoSection />
          
          {/* CTA Section */}
          <CTASection />
        </main>
      </div>
    </LandingLayout>
  );
} 