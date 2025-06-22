'use client';

import { useEffect, useRef, useState } from 'react';
import EnhancedButton from '../ui/EnhancedButton';
import { NarrativeState } from '@/hooks/useNarrativeScroll';

interface HeroSectionProps {
  narrativeState?: NarrativeState;
  animationState?: {
    isActive: boolean;
    isCompleted: boolean;
    isVisible: boolean;
    shouldAnimate: boolean;
  };
  animationChain?: {
    isAnimationActive: (id: string) => boolean;
    hasAnimationCompleted: (id: string) => boolean;
    playAnimation: (id: string, skipChain?: boolean) => void;
  };
}

export default function HeroSection({ narrativeState, animationChain }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [revenuePhase, setRevenuePhase] = useState<'escaping' | 'returning'>('escaping');

  // Integrate with animation chain
  useEffect(() => {
    if (!animationChain) {
      // Fallback for when not using narrative system
      const loaderTimer = setTimeout(() => {
        setLoaderComplete(true);
        setIsLoaded(true);
        setTimeout(() => {
          setRevenuePhase('returning');
        }, 3000);
      }, 5000);
      return () => clearTimeout(loaderTimer);
    }

    // Use animation chain states
    if (animationChain.hasAnimationCompleted('heroLoader')) {
      setLoaderComplete(true);
    }
    if (animationChain.hasAnimationCompleted('heroReveal')) {
      setIsLoaded(true);
    }
    if (animationChain.isAnimationActive('heroGlitch')) {
      setIsGlitching(true);
    } else if (animationChain.hasAnimationCompleted('heroGlitch')) {
      setIsGlitching(false);
    }
    if (animationChain.isAnimationActive('revenueEscape')) {
      setRevenuePhase('escaping');
    }
    if (animationChain.isAnimationActive('revenueReturn')) {
      setRevenuePhase('returning');
    }
  }, [animationChain]);

  // Purposeful glitch that reveals the problem
  useEffect(() => {
    if (!loaderComplete) return;
    
    // First glitch happens right after load to grab attention
    const firstGlitch = setTimeout(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 300);
    }, 500);
    
    // Periodic glitches that hint at system breaking
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 12000);

    return () => {
      clearTimeout(firstGlitch);
      clearInterval(glitchInterval);
    };
  }, [loaderComplete]);

  // Create local revenue particles (complement global particle system)
  useEffect(() => {
    if (!isLoaded || !heroRef.current) return;
    
    // Only create local particles if global narrative system isn't active
    if (narrativeState && narrativeState.particlePhase === 'escaping') {
      return; // Let global particle system handle it
    }

    const createRevenueParticle = (phase: 'escaping' | 'returning') => {
      const particle = document.createElement('div');
      particle.className = `hero-revenue-particle ${phase}`;
      particle.innerHTML = '$';
      
      if (phase === 'escaping') {
        // Money escaping from creator (center) to platforms (edges)
        particle.style.left = '50%';
        particle.style.top = '50%';
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 100;
        particle.style.setProperty('--dx', `${Math.cos(angle) * velocity}vw`);
        particle.style.setProperty('--dy', `${Math.sin(angle) * velocity}vh`);
        particle.style.setProperty('--rotation', `${Math.random() * 360}deg`);
      } else {
        // Money returning from edges to creator
        const edge = Math.floor(Math.random() * 4);
        switch(edge) {
          case 0: // top
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = '-20px';
            break;
          case 1: // right
            particle.style.left = 'calc(100% + 20px)';
            particle.style.top = `${Math.random() * 100}%`;
            break;
          case 2: // bottom
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = 'calc(100% + 20px)';
            break;
          case 3: // left
            particle.style.left = '-20px';
            particle.style.top = `${Math.random() * 100}%`;
            break;
        }
        particle.style.setProperty('--return-delay', `${Math.random() * 2}s`);
      }
      
      heroRef.current?.appendChild(particle);
      setTimeout(() => particle.remove(), phase === 'escaping' ? 2000 : 3000);
    };

    // Initial explosion only if not using narrative system
    if (revenuePhase === 'escaping' && !narrativeState) {
      for (let i = 0; i < 30; i++) {
        setTimeout(() => createRevenueParticle('escaping'), i * 50);
      }
    }
    
    // Continuous flow based on phase (reduced when narrative system is active)
    const particleInterval = setInterval(() => {
      if (revenuePhase === 'returning' && !narrativeState) {
        // Create returning particles
        createRevenueParticle('returning');
      }
    }, 300);

    return () => clearInterval(particleInterval);
  }, [isLoaded, revenuePhase, narrativeState]);



  return (
    <>
      {/* Narrative Loader - Sets the tone */}
      {!loaderComplete && (
        <div className="hero-loader">
          <div className="loader-content">
            <div className="loader-statement">
              <div>
                <span className="loader-text fade-1">Your Content.</span>
                <span className="loader-text fade-2">Your Terms.</span>
                <span className="loader-text fade-3">Your Time.</span>
              </div>
              <span className="loader-amount fade-4">Base.Tube</span>
            </div>
            <div className="loader-progress">
              <div className="loader-bar"></div>
            </div>
          </div>
          <div className="loader-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`loader-money money-${i + 1}`}></div>
            ))}
          </div>
        </div>
      )}

      {/* Hero Header Section */}
      <section ref={heroRef} className={`hero-section slide slide-header ${loaderComplete ? 'loaded' : ''}`}>
        
        {/* Dark Background - Matching VideoSection style */}
        <div className="hero-dark-background">
          {/* Enhanced Dark Overlay */}
          <div className="hero-dark-overlay"></div>
          
          {/* Animated scan lines */}
          <div className="hero-scan-lines"></div>
          
          {/* Revenue state indicator */}
          {revenuePhase === 'returning' && (
            <div className="revenue-return-glow"></div>
          )}
        </div>

        <div className="hero-content section__content slide-header-content">
          
          {/* Main title with killer effects */}
          <div className="hero-title-wrapper">
            <h1 
              ref={titleRef}
              className={`hero-title ${isLoaded ? 'visible' : ''} ${isGlitching ? 'glitching' : ''}`}
              data-text="Your Content. Their Pass. Endless Earnings."
              data-alt-text="Your Content. Their Profit. Endless Losses."
            >
              <span className="hero-title-line">
                <span className="hero-gradient-text">Your Content.</span>
                <span className="hero-outline-text" data-text=" Their Pass."> Their Pass.</span>
              </span>
              <span className="hero-title-line">
                <span className={`hero-gradient-text hero-text-emphasis ${revenuePhase === 'returning' ? 'returning' : ''}`}>
                  {isGlitching && revenuePhase === 'escaping' ? 'Endless Losses.' : 'Endless Earnings.'}
                </span>
              </span>
            </h1>
          </div>

          {/* New narrative structure */}
          <div className={`hero-narrative ${isLoaded ? 'visible' : ''}`}>
            <div className="narrative-block">
              <p className="narrative-question">The creator economy&apos;s biggest lie?</p>
              <p className="narrative-answer">That you need millions of followers to make a living.</p>
            </div>
            
            <div className="narrative-block">
              <p className="narrative-question">The truth?</p>
              <p className="narrative-answer">You just need the right fans and the right platform.</p>
            </div>
            
            <div className="narrative-punchline">
              <p className="narrative-welcome">Welcome to the right platform.</p>
            </div>
          </div>

          {/* CTA with magnetic effect - appears when solution is revealed */}
          <div className={`hero-cta-wrapper ${revenuePhase === 'returning' ? 'visible' : ''}`}>
            <EnhancedButton
              size="large"
              className="hero-cta-primary"
              icon={
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 8L14 12L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            >
              Join the Beta, and Build the Future With Us
            </EnhancedButton>
          </div>

        </div>

        {/* Floating particles - purposeful for visual atmosphere */}
        <div className="hero-particles">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`hero-particle hero-particle-${i + 1}`} />
          ))}
        </div>



      </section>
    </>
  );
} 