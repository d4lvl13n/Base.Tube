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
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hoveredTransform, setHoveredTransform] = useState(false);
  const [showStrikes, setShowStrikes] = useState(false);

  // Integrate with animation state
  useEffect(() => {
    if (animationState?.isVisible || !animationState) {
      setIsVisible(true);
    }
    
    // Handle animation chain events
    if (animationChain) {
      if (animationChain.isAnimationActive('cardStrikes')) {
        setShowStrikes(true);
        // Automatically strike through cards in sequence
        const strikeSequence = [
          setTimeout(() => setActiveCard(0), 0),
          setTimeout(() => setActiveCard(1), 500),
          setTimeout(() => setActiveCard(2), 1000),
          setTimeout(() => setActiveCard(null), 1500)
        ];
        return () => strikeSequence.forEach(clearTimeout);
      }
      
      if (animationChain.isAnimationActive('passFlip')) {
        setTimeout(() => setIsFlipped(true), 200);
        setTimeout(() => setIsFlipped(false), 600);
      }
    }
  }, [animationState, animationChain]);

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
        
        {/* Opening Hook - Glitch Typography */}
        <div className={`manifesto-hook ${isVisible ? 'visible' : ''}`}>
          <h2 className="hook-title">
            <span className="hook-small" data-text="Every Creator Knows">Every Creator Knows</span>
            <span className="hook-large glitch" data-text="THIS TRUTH:">THIS TRUTH:</span>
          </h2>
        </div>

        {/* The Problem - Killer Cards with SVG Icons */}
        <div className={`manifesto-problem ${isVisible ? 'visible' : ''}`}>
          <p className="problem-intro">
            You create something <span className="text-glow">special</span>. Something <span className="text-glow">worth paying for</span>. 
            <br />
            <span className="highlight"> But your only options are:</span>
          </p>
          
          <div className="problem-options">
            <div 
              className={`option-card ads ${activeCard === 0 ? 'active' : ''}`}
              onMouseEnter={() => setActiveCard(0)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="card-glow"></div>
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5.5L9.5 5.5M9.5 5.5C9.5 6.88071 10.6193 8 12 8C13.3807 8 14.5 6.88071 14.5 5.5C14.5 4.11929 13.3807 3 12 3C10.6193 3 9.5 4.11929 9.5 5.5ZM14.5 5.5H21M3 12H9.5M9.5 12C9.5 13.3807 10.6193 14.5 12 14.5C13.3807 14.5 14.5 13.3807 14.5 12C14.5 10.6193 13.3807 9.5 12 9.5C10.6193 9.5 9.5 10.6193 9.5 12ZM14.5 12H21M3 18.5H9.5M9.5 18.5C9.5 19.8807 10.6193 21 12 21C13.3807 21 14.5 19.8807 14.5 18.5C14.5 17.1193 13.3807 16 12 16C10.6193 16 9.5 17.1193 9.5 18.5ZM14.5 18.5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Ads</h3>
              <p>That annoy your audience</p>
              <div className={`card-strike ${showStrikes && activeCard === 0 ? 'struck' : ''}`}>
                <svg viewBox="0 0 100 2" className="strike-svg">
                  <line x1="0" y1="1" x2="100" y2="1" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
            
            <div 
              className={`option-card sponsors ${activeCard === 1 ? 'active' : ''}`}
              onMouseEnter={() => setActiveCard(1)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="card-glow"></div>
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L14.09 8.26L20.18 8.27L15.45 11.97L17.45 18.24L12 14.47L6.55 18.24L8.55 11.97L3.82 8.27L9.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M12 14V20M8 20H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Sponsors</h3>
              <p>Who compromise your vision</p>
              <div className={`card-strike ${showStrikes && activeCard === 1 ? 'struck' : ''}`}>
                <svg viewBox="0 0 100 2" className="strike-svg">
                  <line x1="0" y1="1" x2="100" y2="1" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
            
            <div 
              className={`option-card subscriptions ${activeCard === 2 ? 'active' : ''}`}
              onMouseEnter={() => setActiveCard(2)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="card-glow"></div>
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 11V7C12 5.89543 11.1046 5 10 5H9C7.89543 5 7 5.89543 7 7V11M17 11V7C17 5.89543 16.1046 5 15 5H14C12.8954 5 12 5.89543 12 7" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="16" r="1" fill="currentColor"/>
                </svg>
              </div>
              <h3>Subscriptions</h3>
              <p>That lock fans into monthly payments they resent</p>
              <div className={`card-strike ${showStrikes && activeCard === 2 ? 'struck' : ''}`}>
                <svg viewBox="0 0 100 2" className="strike-svg">
                  <line x1="0" y1="1" x2="100" y2="1" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* The Solution - Animated Direct Sales */}
        <div className={`manifesto-solution ${isVisible ? 'visible' : ''}`}>
          <div className="solution-content">
            <h3 className="solution-question">
              What if there was a way to sell access to your premium content 
              <span className="highlight-gradient animated">  directly</span>?
            </h3>
            <div className="solution-benefits">
              <span className="benefit">
                <svg className="benefit-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                No ads
              </span>
              <span className="benefit">
                <svg className="benefit-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                No middlemen
              </span>
              <span className="benefit">
                <svg className="benefit-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Fair pricing
              </span>
            </div>
          </div>
        </div>

        {/* The Revolution - 3D Flippable Pass */}
        <div className={`manifesto-revolution ${isVisible ? 'visible' : ''}`}>
          <h3 className="revolution-intro">
            But here&apos;s where it gets <span className="revolutionary">revolutionary</span>:
          </h3>
          
          <div className="pass-demo">
            <div 
              className={`vip-pass ${isFlipped ? 'flipped' : ''}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="pass-front">
                <div className="pass-texture"></div>
                <div className="pass-hologram"></div>
                <div className="pass-header">CONTENT PASS</div>
                <div className="pass-content">
                  <div className="pass-icon">
                    <svg viewBox="0 0 80 80" fill="none">
                      {/* Hexagon with play button */}
                      <path d="M40 5L65 20V50L40 65L15 50V20L40 5Z" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                      <path d="M40 15L55 25V45L40 55L25 45V25L40 15Z" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                      <path d="M40 25L47 35L40 45L33 35L40 25Z" fill="currentColor"/>
                      {/* Play icon */}
                      <path d="M35 30L45 35L35 40V30Z" fill="black" opacity="0.8"/>
                    </svg>
                  </div>
                  <div className="pass-title">EXCLUSIVE ACCESS</div>
                  <div className="pass-tagline">Beyond the Algorithm</div>
                </div>
                <div className="pass-qr">
                  {/* Decorative QR-like pattern */}
                  <svg viewBox="0 0 40 40" fill="currentColor" opacity="0.2">
                    <rect x="0" y="0" width="8" height="8"/>
                    <rect x="16" y="0" width="8" height="8"/>
                    <rect x="32" y="0" width="8" height="8"/>
                    <rect x="0" y="16" width="8" height="8"/>
                    <rect x="24" y="16" width="8" height="8"/>
                    <rect x="8" y="32" width="8" height="8"/>
                    <rect x="32" y="32" width="8" height="8"/>
                  </svg>
                </div>
                <div className="pass-shine"></div>
                <div className="pass-hint">Click to flip →</div>
              </div>
              
              <div className="pass-back">
                <div className="pass-texture"></div>
                <div className="pass-hologram"></div>
                <div className="pass-header">TRANSFERABLE ASSET</div>
                <div className="pass-content">
                  <div className="resale-icon">
                    <svg viewBox="0 0 80 80" fill="none">
                      <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                      <path d="M25 35C25 35 30 25 40 25C50 25 55 30 55 40C55 50 50 55 40 55C30 55 25 50 25 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                      <path d="M20 30L25 35L30 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M55 45C55 45 50 55 40 55C30 55 25 50 25 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
                      <path d="M50 50L55 45L60 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      {/* Dollar signs */}
                      <text x="40" y="45" textAnchor="middle" fontSize="24" fill="currentColor" fontWeight="bold">$</text>
                    </svg>
                  </div>
                  <div className="resale-text">Resellable • Tradeable • Valuable</div>
                  <div className="resale-tagline">
                    Your support becomes an <span className="value-highlight">asset</span>
                  </div>
                </div>
                <div className="pass-network">
                  <span>Powered by Base.Tube Network</span>
                </div>
                <div className="pass-shine"></div>
                <div className="pass-hint">← Click to flip</div>
              </div>
            </div>
            
            <p className="pass-explanation">
              What if your fans could <span className="highlight">resell that access</span> when they&apos;re done? 
              Like a digital pass they can transfer. Content that <span className="highlight">maintains its value</span>.
            </p>
          </div>
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