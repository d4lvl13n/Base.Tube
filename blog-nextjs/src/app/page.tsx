'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LandingLayout from '@/components/LandingLayout'
import HeroSection from '@/components/landing/HeroSection'
import USPSection from '@/components/landing/USPSection'
import VideoSection from '@/components/landing/VideoSection'
import CTASection from '@/components/landing/CTASection'

// Import styles
import './landing.css'
import './hero.css'
import './usp.css'
import './video.css'
import './header.css'
import './buttons.css'

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to landing page
    router.push('/landing');
  }, [router]);

  return (
    <>
      {/* SVG Filters for Liquid Effects */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="liquid-filter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.01" 
              numOctaves="2" 
              result="turbulence" 
            />
            <feColorMatrix in="turbulence" type="saturate" values="30" />
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="0 .5 .5 .5 .5 1" />
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="0.5" />
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
        </defs>
      </svg>
      
      <LandingLayout>
        <HeroSection />
        <USPSection />
        <VideoSection />
        <CTASection />
      </LandingLayout>
    </>
  );
}
