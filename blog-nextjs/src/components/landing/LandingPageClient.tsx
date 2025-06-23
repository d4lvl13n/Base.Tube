'use client'

import { useEffect } from 'react'
import LandingLayout from '@/components/LandingLayout'
import HeroSection from '@/components/landing/HeroSection'
import ManifestoSection from '@/components/landing/ManifestoSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import PerksSection from '@/components/landing/PerksSection'
import USPSection2 from '@/components/landing/USPSection2'
import CTASection from '@/components/landing/CTASection'
import NarrativeParticleSystem from '@/components/shared/NarrativeParticleSystem'
import LazySection from '@/components/shared/LazySection'
import SectionSkeleton from '@/components/shared/SectionSkeleton'
import { useNarrativeScroll } from '@/hooks/useNarrativeScroll'
import { useAnimationChain } from '@/hooks/useAnimationChain'

export default function LandingPageClient() {
  const narrativeScroll = useNarrativeScroll()
  const animationChain = useAnimationChain()

  // Start animation chain when page loads - only once
  useEffect(() => {
    // Use a timeout to ensure it only runs once after initial render
    const timer = setTimeout(() => {
      if (animationChain && 
          !animationChain.isPlaying && 
          animationChain.completedAnimations.length === 0) {
        animationChain.startChain('heroLoader')
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, []) // Empty dependency array - only run once on mount

  // Trigger section animations based on scroll
  useEffect(() => {
    if (!animationChain) return;
    
    const { currentChapter } = narrativeScroll
    
    // Trigger animations when entering new chapters
    switch (currentChapter) {
      case 1: // Manifesto
        if (!animationChain.hasAnimationCompleted('manifestoReveal')) {
          animationChain.playAnimation('manifestoReveal')
        }
        break
      case 2: // How It Works
        if (!animationChain.hasAnimationCompleted('howItWorksFlow')) {
          animationChain.playAnimation('howItWorksFlow')
        }
        break
      case 3: // USP
        if (!animationChain.hasAnimationCompleted('uspFeatureForm')) {
          animationChain.playAnimation('uspFeatureForm')
        }
        break
      case 4: // Perks
        if (!animationChain.hasAnimationCompleted('perksPassReveal')) {
          animationChain.playAnimation('perksPassReveal')
        }
        break
    }
  }, [narrativeScroll.currentChapter, animationChain?.playAnimation, animationChain?.hasAnimationCompleted])

  return (
    <LandingLayout>
      {/* Global Narrative Particle System */}
      <NarrativeParticleSystem narrativeState={narrativeScroll.state} />
      
      {/* Scroll Progress Bar */}
      <div className="narrative-progress">
        <div 
          className="narrative-progress-bar" 
          style={{ width: `${(narrativeScroll.scrollProgress / 4.8) * 100}%` }}
        />
      </div>
      
      {/* Chapter Indicators - Removed per request */}
      
      {/* Pass narrative state and animation chain to sections */}
      <HeroSection 
        narrativeState={narrativeScroll.state}
        animationState={narrativeScroll.getAnimationState('hero')}
        animationChain={animationChain}
      />
      
      <LazySection 
        threshold={0.1}
        rootMargin="100px"
        fallback={<SectionSkeleton height="100vh" />}
        minHeight="100vh"
      >
        <ManifestoSection 
          narrativeState={narrativeScroll.state}
          animationState={narrativeScroll.getAnimationState('problem')}
          animationChain={animationChain}
        />
      </LazySection>

      <LazySection 
        threshold={0.1}
        rootMargin="100px"
        fallback={<SectionSkeleton height="100vh" />}
        minHeight="100vh"
      >
        <HowItWorksSection 
          narrativeState={narrativeScroll.state}
          animationState={narrativeScroll.getAnimationState('solution')}
          animationChain={animationChain}
        />
      </LazySection>

      <LazySection 
        threshold={0.1}
        rootMargin="100px"
        fallback={<SectionSkeleton height="80vh" />}
        minHeight="80vh"
      >
        <USPSection2 />
      </LazySection>

      <LazySection 
        threshold={0.1}
        rootMargin="100px"
        fallback={<SectionSkeleton height="100vh" />}
        minHeight="100vh"
      >
        <PerksSection />
      </LazySection>

      <LazySection 
        threshold={0.1}
        rootMargin="50px"
        fallback={<SectionSkeleton height="100vh" />}
        minHeight="100vh"
      >
        <CTASection />
      </LazySection>
    </LandingLayout>
  )
} 