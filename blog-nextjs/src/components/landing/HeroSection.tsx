'use client';

import { useEffect, useRef, useState } from 'react';
import EnhancedButton from '../ui/EnhancedButton';

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  // Initialize animations on mount
  useEffect(() => {
    setIsLoaded(true);
    
    // Trigger glitch effect periodically
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 8000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Create explosion particles on load
  useEffect(() => {
    if (!isLoaded || !heroRef.current) return;

    const createExplosionParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'hero-explosion-particle';
      particle.style.left = '50%';
      particle.style.top = '50%';
      const angle = Math.random() * Math.PI * 2;
      const velocity = 50 + Math.random() * 100;
      particle.style.setProperty('--dx', `${Math.cos(angle) * velocity}vw`);
      particle.style.setProperty('--dy', `${Math.sin(angle) * velocity}vh`);
      particle.style.setProperty('--rotation', `${Math.random() * 720}deg`);
      
      heroRef.current?.appendChild(particle);
      setTimeout(() => particle.remove(), 2000);
    };

    // Create initial explosion
    for (let i = 0; i < 30; i++) {
      setTimeout(() => createExplosionParticle(), i * 30);
    }
  }, [isLoaded]);

  // Animate number counters
  useEffect(() => {
    if (!isLoaded) return;

    const animateNumber = (element: HTMLElement, target: string) => {
      const isPrice = target.includes('$');
      let numericTarget = parseFloat(target.replace(/[$KM]/g, ''));
      
      if (target.includes('M')) numericTarget *= 1000000;
      else if (target.includes('K')) numericTarget *= 1000;
      
      let current = 0;
      const increment = numericTarget / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericTarget) {
          current = numericTarget;
          clearInterval(timer);
        }
        
        let display = current;
        let suffix = '';
        
        if (target.includes('M') && current >= 1000000) {
          display = current / 1000000;
          suffix = 'M';
        } else if (target.includes('K') && current >= 1000) {
          display = current / 1000;
          suffix = 'K';
        }
        
        const formatted = isPrice ? `$${display.toFixed(0)}${suffix}` : `${Math.floor(display)}${suffix}`;
        element.textContent = formatted;
      }, 30);
    };

    // Start number animations after a delay
    setTimeout(() => {
      const numbers = document.querySelectorAll('.hero-stat-number');
      numbers.forEach((num) => {
        const target = num.getAttribute('data-value') || '0';
        animateNumber(num as HTMLElement, target);
      });
    }, 1000);
  }, [isLoaded]);

  return (
    <>
      {/* Hero Header Section */}
      <section ref={heroRef} className="hero-section slide slide-header">
        
        {/* Dark Background - Matching VideoSection style */}
        <div className="hero-dark-background">
          {/* Enhanced Dark Overlay */}
          <div className="hero-dark-overlay"></div>
          
          {/* Animated scan lines */}
          <div className="hero-scan-lines"></div>
        </div>

        <div className="hero-content section__content slide-header-content">
          
          {/* Main title with killer effects */}
          <div className="hero-title-wrapper">
            <h1 
              ref={titleRef}
              className={`hero-title ${isLoaded ? 'visible' : ''} ${isGlitching ? 'glitching' : ''}`}
              data-text="Your Content. Their Pass. Endless Earnings."
            >
              <span className="hero-title-line">
                <span className="hero-gradient-text">Your Content.</span>
                <span className="hero-outline-text" data-text=" Their Pass."> Their Pass.</span>
              </span>
              <span className="hero-title-line">
                <span className="hero-gradient-text hero-text-emphasis">Endless Earnings.</span>
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

          {/* CTA with magnetic effect */}
          <div className={`hero-cta-wrapper ${isLoaded ? 'visible' : ''}`}>
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

        {/* Floating particles - matching VideoSection style */}
        <div className="hero-particles">
          {[...Array(15)].map((_, i) => (
            <div key={i} className={`hero-particle hero-particle-${i + 1}`} />
          ))}
        </div>

      </section>
    </>
  );
} 