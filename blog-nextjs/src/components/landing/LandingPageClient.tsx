'use client'

import { useEffect } from 'react'
import LandingLayout from '@/components/LandingLayout'
import HeroSection from '@/components/landing/HeroSection'
import ManifestoSection from '@/components/landing/ManifestoSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import PerksSection from '@/components/landing/PerksSection'
import TransformationSection from '@/components/landing/TransformationSection'
import USPSection2 from '@/components/landing/USPSection2'
import CTASection from '@/components/landing/CTASection'
import NarrativeParticleSystem from '@/components/shared/NarrativeParticleSystem'
import { useNarrativeScroll } from '@/hooks/useNarrativeScroll'
import { useAnimationChain } from '@/hooks/useAnimationChain'

export default function LandingPageClient() {
  const narrativeScroll = useNarrativeScroll()
  const animationChain = useAnimationChain()

  // Start animation chain when page loads
  useEffect(() => {
    animationChain.startChain('heroLoader')
  }, [])

  // Trigger section animations based on scroll
  useEffect(() => {
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
  }, [narrativeScroll.currentChapter, animationChain])

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
      
      {/* Chapter Indicators */}
      <div className="chapter-indicators">
        {narrativeScroll.chapters.map((chapter) => (
          <button
            key={chapter.id}
            className={`chapter-dot ${chapter.status === 'active' ? 'active' : ''} ${chapter.status === 'completed' ? 'completed' : ''}`}
            onClick={() => narrativeScroll.scrollToChapter(chapter.id)}
            aria-label={`Go to ${chapter.id} section`}
          />
        ))}
      </div>
      
      {/* Pass narrative state and animation chain to sections */}
      <HeroSection 
        narrativeState={narrativeScroll.state}
        animationState={narrativeScroll.getAnimationState('hero')}
        animationChain={animationChain}
      />
      
      <ManifestoSection 
        narrativeState={narrativeScroll.state}
        animationState={narrativeScroll.getAnimationState('problem')}
        animationChain={animationChain}
      />
      <HowItWorksSection 
        narrativeState={narrativeScroll.state}
        animationState={narrativeScroll.getAnimationState('solution')}
        animationChain={animationChain}
      />
      <USPSection2 />
      <PerksSection />
      <TransformationSection />
      <CTASection />
    </LandingLayout>
  )
} 