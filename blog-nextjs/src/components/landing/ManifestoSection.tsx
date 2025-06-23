'use client';

import { useEffect, useRef, useState } from 'react';
import { NarrativeState } from '@/hooks/useNarrativeScroll';

interface ManifestoSectionProps {
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

export default function ManifestoSection({ narrativeState, animationState, animationChain }: ManifestoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hoveredTransform, setHoveredTransform] = useState(false);

  // Integrate with animation state
  useEffect(() => {
    if (animationState?.isVisible || !animationState) {
      setIsVisible(true);
    }
  }, [animationState]);
  
  // Handle animation chain events - only keep pass flip for potential future use
  useEffect(() => {
    if (!animationChain) return;
    
    const isPassFlipActive = animationChain.isAnimationActive('passFlip');
    
    if (isPassFlipActive && !isFlipped) {
      const flipTimeout = setTimeout(() => {
        setIsFlipped(true);
        setTimeout(() => setIsFlipped(false), 400);
      }, 200);
      return () => clearTimeout(flipTimeout);
    }
  }, [animationChain, isFlipped]);

  // Fallback intersection observer for when not using narrative system
  useEffect(() => {
    if (animationState) return; // Skip if using narrative system
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [animationState]);

  return (
    <section ref={sectionRef} className="manifesto-section">
      {/* Animated Background Elements */}
      <div className={`manifesto-bg-effects ${narrativeState?.particlePhase === 'trapped' ? 'particles-trapped' : ''}`}>
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="grid-overlay"></div>
      </div>

      <div className="manifesto-container">
        
        {/* New Single Screen Design */}
        <div className={`manifesto-new-content ${isVisible ? 'visible' : ''}`}>
          
          {/* Main Headline */}
          <h2 className="manifesto-new-headline">
            Imagine if your fans could <span className="highlight-resell">resell</span> their access.
          </h2>
          
          {/* Flow Diagram */}
          <div className="resell-flow-container">
            <div className="flow-step step-buy">
              <div className="step-icon">
                <svg viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                  <path d="M25 40L35 50L55 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Buy</h3>
              <p>You earn</p>
            </div>
            
            <div className="flow-arrow arrow-1">
              <svg viewBox="0 0 100 40" fill="none">
                <path d="M10 20 L70 20 M60 12 L70 20 L60 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {/* Center Content Pass */}
            <div className="center-pass-container">
              <div className="mini-content-pass">
                <div className="mini-pass-texture"></div>
                <div className="mini-pass-header">CONTENT PASS</div>
                <div className="mini-pass-icon">
                  <svg viewBox="0 0 40 40" fill="none">
                    <path d="M20 5L30 12V28L20 35L10 28V12L20 5Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M15 17L25 20L15 23V17Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="mini-pass-title">EXCLUSIVE</div>
                <div className="mini-pass-shine"></div>
              </div>
            </div>
            
            <div className="flow-arrow arrow-2">
              <svg viewBox="0 0 100 40" fill="none">
                <path d="M10 20 L70 20 M60 12 L70 20 L60 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <div className="flow-step step-watch">
              <div className="step-icon">
                <svg viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                  <polygon points="32,25 32,55 55,40" fill="currentColor"/>
                </svg>
              </div>
              <h3>Watch</h3>
              <p>They enjoy</p>
            </div>
            
            <div className="flow-arrow arrow-3">
              <svg viewBox="0 0 100 40" fill="none">
                <path d="M10 20 L70 20 M60 12 L70 20 L60 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <div className="flow-step step-resell">
              <div className="step-icon">
                <svg viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                  <path d="M25 35C25 35 30 25 40 25C50 25 55 30 55 40C55 50 50 55 40 55C30 55 25 50 25 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M20 30L25 35L30 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <text x="40" y="45" textAnchor="middle" fontSize="20" fill="currentColor" fontWeight="bold">$</text>
                </svg>
              </div>
              <h3>Resell</h3>
              <p>You earn again</p>
            </div>
          </div>
          
          {/* Supporting Text */}
          <p className="manifesto-new-supporting">
            No ads. No sponsors. No subscriptions. Just content that pays you forever.
          </p>
        </div>
        
        {/* The Transformation - Animated Visual */}
        <div className={`manifesto-transformation ${isVisible ? 'visible' : ''}`}>
          <div 
            className="transformation-visual"
            onMouseEnter={() => setHoveredTransform(true)}
            onMouseLeave={() => setHoveredTransform(false)}
          >
            <div className={`transform-from ${hoveredTransform ? 'fade' : ''}`}>
              <span className="transform-label">Supporting creators was a</span>
              <span className="transform-old">COST</span>
              <div className="cost-visual">
                <svg viewBox="0 0 200 60" className="cost-drain">
                  <path d="M10 30 Q50 50, 100 30 T190 30" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
                  <circle r="3" fill="currentColor">
                    <animateMotion dur="2s" repeatCount="indefinite">
                      <mpath href="#drainPath"/>
                    </animateMotion>
                  </circle>
                  <defs>
                    <path id="drainPath" d="M10 30 Q50 50, 100 30 T190 30"/>
                  </defs>
                </svg>
              </div>
            </div>
            
            <div className="transform-arrow">
              <svg viewBox="0 0 120 40" className="arrow-svg">
                <defs>
                  <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--secondary-color)" stopOpacity="0"/>
                    <stop offset="50%" stopColor="var(--secondary-color)" stopOpacity="1"/>
                    <stop offset="100%" stopColor="var(--secondary-color)" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M 10 20 L 90 20 M 80 12 L 90 20 L 80 28" stroke="url(#arrowGradient)" strokeWidth="3" fill="none"/>
                <circle cx="50" cy="20" r="8" fill="var(--secondary-color)" opacity="0.3">
                  <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite"/>
                </circle>
              </svg>
            </div>
            
            <div className={`transform-to ${hoveredTransform ? 'grow' : ''}`}>
              <span className="transform-label">Supporting creators is an</span>
              <span className="transform-new">ASSET</span>
              <div className="asset-visual">
                <svg viewBox="0 0 200 60" className="asset-growth">
                  <path d="M10 50 Q40 40, 70 35 T100 25 T130 15 T160 10 T190 5" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        fill="none" 
                        strokeDasharray="5,5"
                        opacity="0.5">
                    <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite"/>
                  </path>
                  <circle cx="190" cy="5" r="6" fill="currentColor" opacity="0.8">
                    <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite"/>
                  </circle>
                </svg>
              </div>
            </div>
          </div>
          
          <p className="transformation-subtitle">
            Content that appreciates. Ownership that transfers. Value that grows.
          </p>
        </div>

        {/* Final Declaration - Epic Finale */}
        <div className={`manifesto-declaration ${isVisible ? 'visible' : ''}`}>
          <p className="declaration-setup">This isn&apos;t another platform.</p>
          <h3 className="declaration-punchline">
            <span className="punchline-line-1">THIS IS WHERE YOUR BEST WORK</span>
            <span className="living-content">
              <span className="word living">FINALLY PAYS</span>
              <span className="word content">OFF</span>
            </span>
          </h3>
          
          <div className="declaration-effects">
            <div className="energy-ring"></div>
            <div className="energy-ring delay-1"></div>
            <div className="energy-ring delay-2"></div>
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`spark spark-${i + 1}`}></div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
} 