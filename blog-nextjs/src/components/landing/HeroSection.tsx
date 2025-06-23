'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
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
    currentAnimation?: string | null;
    completedAnimations?: string[];
    isAnimationActive: (id: string) => boolean;
    hasAnimationCompleted: (id: string) => boolean;
    playAnimation: (id: string, skipChain?: boolean) => void;
  };
}

export default function HeroSection({ animationChain }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [loaderComplete, setLoaderComplete] = useState(false);

  // Initialize loader
  useEffect(() => {
    const loaderTimer = setTimeout(() => {
      setLoaderComplete(true);
    }, 3500); // Shorter, snappier loader
    
    return () => clearTimeout(loaderTimer);
  }, []);

  // Handle animation chain if provided
  useEffect(() => {
    if (!animationChain) return;
    
    if (animationChain.hasAnimationCompleted && animationChain.hasAnimationCompleted('loader')) {
      setLoaderComplete(true);
    }
  }, [animationChain]);

  return (
    <>
      {/* Simplified Loader */}
      {!loaderComplete && (
        <div className="hero-loader">
          <div className="loader-content">
            <motion.div 
              className="loader-statement"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span 
                className="loader-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Your Content.
              </motion.span>
              <motion.span 
                className="loader-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                Your Terms.
              </motion.span>
              <motion.span 
                className="loader-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.3 }}
              >
                Your Time.
              </motion.span>
            </motion.div>
            <motion.div 
              className="loader-progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2 }}
            >
              <div className="loader-bar"></div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Clean Hero Section */}
      <section ref={heroRef} className={`hero-section ${loaderComplete ? 'loaded' : ''}`}>
        
        {/* Minimal Dark Background */}
        <div className="hero-dark-background">
          <div className="hero-dark-overlay"></div>
        </div>

        {/* Floating dots for subtle movement */}
        <div className="hero-particles">
          {[...Array(15)].map((_, i) => (
            <div key={i} className={`hero-particle hero-particle-${i + 1}`} />
          ))}
        </div>

        <div className="hero-content">
          
          {/* Main Headline */}
          <motion.h1 
            className="hero-headline"
            initial={{ opacity: 0, y: 30 }}
            animate={loaderComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            The Platform That Pays Creators First.
          </motion.h1>

          {/* Three Columns */}
          <motion.div 
            className="hero-features"
            initial={{ opacity: 0 }}
            animate={loaderComplete ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div 
              className="feature-item"
              initial={{ opacity: 0, y: 20 }}
              animate={loaderComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="feature-icon">❌</span>
              <span className="feature-text">No ads</span>
            </motion.div>
            
            <motion.div 
              className="feature-item"
              initial={{ opacity: 0, y: 20 }}
              animate={loaderComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <span className="feature-icon">❌</span>
              <span className="feature-text">No algorithms</span>
            </motion.div>
            
            <motion.div 
              className="feature-item"
              initial={{ opacity: 0, y: 20 }}
              animate={loaderComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <span className="feature-icon">❌</span>
              <span className="feature-text">No subscriptions</span>
            </motion.div>
          </motion.div>

          {/* Explanation */}
          <motion.div 
            className="hero-explanation"
            initial={{ opacity: 0 }}
            animate={loaderComplete ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <p className="explanation-main">
              Just content passes your fans can buy, own, and resell.
            </p>
            <p className="explanation-sub">
              You earn from every transaction.
            </p>
          </motion.div>

          {/* Welcome Message */}
          <motion.p 
            className="hero-welcome"
            initial={{ opacity: 0 }}
            animate={loaderComplete ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            Welcome to the future you&apos;ve been waiting for.
          </motion.p>

          {/* CTA Button */}
          <motion.div 
            className="hero-cta-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={loaderComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <EnhancedButton
              size="large"
              className="hero-cta-button"
              icon={<span className="button-arrow">→</span>}
              onClick={() => window.open('https://beta.base.tube/sign-up', '_blank')}
            >
              Join the Beta
            </EnhancedButton>
          </motion.div>

        </div>
      </section>
    </>
  );
} 