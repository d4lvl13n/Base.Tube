'use client';

import { useEffect, useRef, useState } from 'react';
import EnhancedButton from '../ui/EnhancedButton';

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activePanel, setActivePanel] = useState<'creator' | 'fan' | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  useEffect(() => {
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
  }, []);

  return (
    <section ref={sectionRef} className="howto-section">
      {/* Background Effects */}
      <div className="howto-bg-effects">
        <div className="value-grid"></div>
        <div className="flow-particles"></div>
      </div>

      <div className="howto-container">
        
        {/* Section Header with Animated Key */}
        <div className={`howto-header ${isVisible ? 'visible' : ''}`}>
          <div className="key-icon-wrapper">
            <svg className="key-icon" viewBox="0 0 60 60" fill="none">
              <path 
                d="M35 25C35 30.5228 30.5228 35 25 35C19.4772 35 15 30.5228 15 25C15 19.4772 19.4772 15 25 15C30.5228 15 35 19.4772 35 25Z" 
                stroke="currentColor" 
                strokeWidth="2"
              />
              <path 
                d="M31.5 31.5L45 45M45 45V38M45 45H38M40 40L42 38" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="25" cy="25" r="3" fill="currentColor" />
            </svg>
            <div className="key-particles">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`particle particle-${i + 1}`}></div>
              ))}
            </div>
          </div>
          <h2 className="howto-title">
            How It <span className="title-highlight">Really</span> Works
          </h2>
        </div>

        {/* Three-Step Process */}
        <div className={`howto-steps ${isVisible ? 'visible' : ''}`}>
          
          {/* Creator Flow */}
          <div 
            className={`step-panel creator-panel ${activePanel === 'creator' ? 'active' : ''}`}
            onMouseEnter={() => setActivePanel('creator')}
            onMouseLeave={() => setActivePanel(null)}
          >
            <div className="panel-header">
              <h3>You Create. You Gate. You Earn.</h3>
              <div className="panel-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div className="step-list">
              <div 
                className={`step-item ${hoveredStep === 1 ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredStep(1)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className="step-number">01</div>
                <div className="step-content">
                  <h4>Upload Exclusive Content</h4>
                  <p>Behind-the-scenes, tutorials, premium series—anything worth paying for.</p>
                  <div className="step-visual">
                    <div className="upload-animation">
                      <div className="file-icon"></div>
                      <div className="lock-overlay">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className={`step-item ${hoveredStep === 2 ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredStep(2)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className="step-number">02</div>
                <div className="step-content">
                  <h4>Set Your Terms</h4>
                  <p>You decide the value. No algorithms, no guessing games.</p>
                  <div className="step-visual">
                    <div className="terms-animation">
                      <div className="slider-track"></div>
                      <div className="slider-thumb"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className={`step-item ${hoveredStep === 3 ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredStep(3)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className="step-number">03</div>
                <div className="step-content">
                  <h4>Get Paid Immediately</h4>
                  <p>Direct payment. No waiting. No platform taking huge cuts.</p>
                  <div className="step-visual">
                    <div className="payment-flow">
                      <div className="coin coin-1"></div>
                      <div className="coin coin-2"></div>
                      <div className="coin coin-3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Value Flow Connector */}
          <div className="flow-connector">
            <svg viewBox="0 0 100 400" className="flow-svg">
              <path 
                d="M50 50 Q80 100, 50 150 T50 250 Q20 300, 50 350" 
                stroke="url(#flowGradient)" 
                strokeWidth="3" 
                fill="none"
                strokeDasharray="10 5"
              >
                <animate 
                  attributeName="stroke-dashoffset" 
                  from="0" 
                  to="-15" 
                  dur="2s" 
                  repeatCount="indefinite"
                />
              </path>
              <defs>
                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--secondary-color)" stopOpacity="0"/>
                  <stop offset="50%" stopColor="var(--secondary-color)" stopOpacity="1"/>
                  <stop offset="100%" stopColor="var(--secondary-color)" stopOpacity="0"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Fan Flow */}
          <div 
            className={`step-panel fan-panel ${activePanel === 'fan' ? 'active' : ''}`}
            onMouseEnter={() => setActivePanel('fan')}
            onMouseLeave={() => setActivePanel(null)}
          >
            <div className="panel-header">
              <h3>They Buy. They Watch. They Can Sell.</h3>
              <div className="panel-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div className="step-list">
              <div 
                className={`step-item ${hoveredStep === 4 ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredStep(4)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className="step-number">01</div>
                <div className="step-content">
                  <h4>Buy a Content Pass</h4>
                  <p>One-time purchase. No recurring charges haunting their bank account.</p>
                  <div className="step-visual">
                    <div className="pass-purchase">
                      <div className="pass-mini"></div>
                      <div className="purchase-arrow">→</div>
                      <div className="wallet-icon"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className={`step-item ${hoveredStep === 5 ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredStep(5)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className="step-number">02</div>
                <div className="step-content">
                  <h4>Enjoy the Content</h4>
                  <p>Watch anytime. No expiration. It&apos;s theirs to keep.</p>
                  <div className="step-visual">
                    <div className="watch-animation">
                      <div className="play-button">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className={`step-item ${hoveredStep === 6 ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredStep(6)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className="step-number">03</div>
                <div className="step-content">
                  <h4>Keep or Transfer</h4>
                  <p>Finished watching? Keep it as a collectible or sell to another fan.</p>
                  <div className="step-visual">
                    <div className="transfer-animation">
                      <div className="pass-icon"></div>
                      <div className="transfer-arrows">
                        <span>⇄</span>
                      </div>
                      <div className="new-owner"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Perpetual Value Section */}
        <div className={`perpetual-value ${isVisible ? 'visible' : ''}`}>
          <div className="value-header">
            <h3>Everyone Wins. <span className="forever">Forever<span className="infinity-symbol">∞</span></span></h3>
          </div>
          
          <div className="value-wheel-container">
            <div className="value-wheel">
              {/* Creator Node */}
              <div className="wheel-node creator-node">
                <div className="node-icon">
                  <div className="icon-glow"></div>
                  <svg viewBox="0 0 80 80" fill="none">
                    {/* Hexagonal creator badge */}
                    <path d="M40 10L60 22V48L40 60L20 48V22L40 10Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M40 20L50 26V44L40 50L30 44V26L40 20Z" fill="currentColor" opacity="0.3"/>
                    {/* Star in center */}
                    <path d="M40 28L42.5 34H48L43.5 37.5L46 43.5L40 39L34 43.5L36.5 37.5L32 34H37.5L40 28Z" fill="currentColor"/>
                  </svg>
                </div>
                <span>Creator</span>
                <div className="node-benefit">Earns from every sale</div>
              </div>

              {/* Fan Node */}
              <div className="wheel-node fan-node">
                <div className="node-icon">
                  <div className="icon-glow"></div>
                  <svg viewBox="0 0 80 80" fill="none">
                    {/* Circular community symbol */}
                    <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <circle cx="40" cy="40" r="20" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                    {/* Heart with checkmark */}
                    <path d="M40 25C37 20 30 19 26 24C22 29 23 36 40 48C57 36 58 29 54 24C50 19 43 20 40 25Z" fill="currentColor" opacity="0.3"/>
                    <path d="M35 35L38 38L45 31" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Fans</span>
                <div className="node-benefit">Own their support</div>
              </div>

              {/* Content Node */}
              <div className="wheel-node content-node">
                <div className="node-icon">
                  <div className="icon-glow"></div>
                  <svg viewBox="0 0 80 80" fill="none">
                    {/* Cube representing content as asset */}
                    <path d="M40 15L60 25V45L40 55L20 45V25L40 15Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M40 15L60 25L40 35L20 25L40 15Z" fill="currentColor" opacity="0.3"/>
                    <path d="M40 35V55" stroke="currentColor" strokeWidth="2"/>
                    <path d="M20 25L40 35L60 25" stroke="currentColor" strokeWidth="2"/>
                    {/* Play symbol in center */}
                    <path d="M35 42L45 47L35 52V42Z" fill="currentColor"/>
                  </svg>
                </div>
                <span>Content</span>
                <div className="node-benefit">Becomes an asset</div>
              </div>

              {/* Animated Value Flow */}
              <svg className="wheel-flow" viewBox="0 0 300 300">
                {/* Multiple flow paths */}
                <circle 
                  cx="150" 
                  cy="150" 
                  r="100" 
                  fill="none" 
                  stroke="url(#wheelGradient)" 
                  strokeWidth="2"
                  strokeDasharray="5 10"
                  opacity="0.3"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 150 150"
                    to="360 150 150"
                    dur="20s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle 
                  cx="150" 
                  cy="150" 
                  r="85" 
                  fill="none" 
                  stroke="url(#wheelGradient2)" 
                  strokeWidth="1"
                  strokeDasharray="10 15"
                  opacity="0.2"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="360 150 150"
                    to="0 150 150"
                    dur="15s"
                    repeatCount="indefinite"
                  />
                </circle>
                <defs>
                  <linearGradient id="wheelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--secondary-color)" stopOpacity="0"/>
                    <stop offset="50%" stopColor="var(--secondary-color)" stopOpacity="1"/>
                    <stop offset="100%" stopColor="var(--secondary-color)" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="wheelGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0"/>
                    <stop offset="50%" stopColor="var(--primary-color)" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>

              {/* Value Particles */}
              <div className="value-particles">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`value-particle vp-${i + 1}`}></div>
                ))}
              </div>
            </div>

            <p className="value-description">
              Your content generates value that flows between creators, fans, and collectors.
            </p>
            
            {/* Enhanced Ecosystem Message */}
            <div className="ecosystem-message">
              <div className="ecosystem-glow"></div>
              <div className="ecosystem-text">
                <span className="eco-word">A sustainable</span>
                <span className="eco-word ecosystem">ecosystem</span>
                <span className="eco-word">where everyone</span>
                <span className="eco-word benefits">benefits.</span>
              </div>
              <div className="ecosystem-particles">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`eco-particle ep-${i + 1}`}></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA */}
        <div className={`howto-cta ${isVisible ? 'visible' : ''}`}>
          <EnhancedButton
            size="large"
            icon={
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M10 8L14 12L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          >
            See It In Action
          </EnhancedButton>
        </div>

      </div>
    </section>
  );
} 