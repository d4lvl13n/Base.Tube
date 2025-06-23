import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RoadmapSection from '@/components/roadmap/RoadmapSection';

export const metadata: Metadata = {
  title: 'Base.Tube Product Roadmap - Web3 Video Platform Evolution',
  description: 'Explore Base.Tube\'s ambitious roadmap from beta launch to global Web3 video platform. Track our milestones in decentralized content creation, NFT integration, and creator rewards.',
  keywords: 'Base.Tube roadmap, Web3 video platform, decentralized content, NFT marketplace, creator economy, blockchain video sharing',
  openGraph: {
    title: 'Base.Tube Product Roadmap - Building the Future of Video',
    description: 'Follow our journey from foundation to global Web3 video platform. Discover upcoming features, token launches, and creator opportunities.',
    images: [
      {
        url: '/images/og-card.webp',
        width: 1200,
        height: 630,
        alt: 'Base.Tube Roadmap',
      },
    ],
  },
};

export default function RoadmapPage() {
  return (
    <>
      <Header />
      <main className="roadmap-page">
        <RoadmapSection />
      </main>
      <Footer />
    </>
  );
} 