'use client';

import { useState, useEffect, useRef } from 'react';

export default function CTASection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animate numbers when visible
  useEffect(() => {
    if (!isVisible) return;

    const animateNumber = (element: HTMLElement, target: number, isDecimal: boolean = false, prefix: string = '') => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += target / steps;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        
        if (isDecimal) {
          element.textContent = current.toFixed(1);
        } else {
          element.textContent = prefix + Math.floor(current);
        }
      }, stepDuration);
    };

    // Animate all proof numbers
    setTimeout(() => {
      const numbers = document.querySelectorAll('.proof-number');
      numbers.forEach((num) => {
        const target = num.getAttribute('data-value');
        if (target === '50000') {
          animateNumber(num as HTMLElement, 50000);
        } else if (target === '4.9') {
          animateNumber(num as HTMLElement, 4.9, true);
        } else if (target === '5') {
          animateNumber(num as HTMLElement, 5, false, '$');
        }
      });
    }, 600);
  }, [isVisible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsLoading(false);
    setEmail('');
    
    // Create celebration particles
    createCelebrationParticles();
  };

  const createCelebrationParticles = () => {
    const container = sectionRef.current;
    if (!container) return;

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'celebration-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 0.5}s`;
      particle.style.setProperty('--hue', `${Math.random() * 60 + 15}`);
      container.appendChild(particle);
      
      setTimeout(() => particle.remove(), 3000);
    }
  };

  return (
    <>
      {/* Final CTA Section - Enhanced with killer design */}
      <section ref={sectionRef} className="cta-section-enhanced slide slide-7">
        
        {/* Dark Background with scan lines */}
        <div className="cta-dark-background">
          <div className="cta-dark-overlay"></div>
          <div className="cta-scan-lines"></div>
        </div>

        {/* Background particles */}
        <div className="cta-bg-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`cta-particle cta-particle-${i + 1}`} />
          ))}
        </div>

        <div className="section__content slide-7-content">
          <div className={`cta-container-enhanced ${isVisible ? 'visible' : ''}`}>
            
            {/* Enhanced header with glitch effect */}
            <div className={`cta-header-enhanced ${isVisible ? 'visible' : ''}`}>
              <span className="cta-badge">
                <span className="badge-icon">🚀</span>
                LIMITED TIME OFFER
              </span>
              
              <h2 className="cta-title-enhanced">
                <span className="title-line">
                  <span className="cta-gradient-text">Ready to Pioneer</span>
                </span>
                <span className="title-line-2">
                  <span className="cta-outline-text" data-text="the Future?">the Future?</span>
                </span>
              </h2>
              
              <p className="cta-subtitle-enhanced">
                Join <span className="highlight-number">50,000+</span> creators and fans who are already building 
                <br />
                the next generation of <span className="highlight-text">digital content</span>.
              </p>
            </div>

            {/* Enhanced Waitlist Form */}
            <div className={`waitlist-container-enhanced ${isVisible ? 'visible' : ''}`}>
              {isSubmitted ? (
                <div className="success-state">
                  <div className="success-glow"></div>
                  <div className="success-content">
                    <div className="success-icon-animated">
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="success-title">Welcome to the Revolution!</h3>
                    <p className="success-text">
                      You&apos;re now part of an exclusive group pioneering the future of content creation.
                      <br />
                      Check your email for early access details.
                    </p>
                    <div className="success-stats">
                      <div className="stat-item">
                        <span className="stat-icon">🎯</span>
                        <span className="stat-text">Priority Access</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-icon">💎</span>
                        <span className="stat-text">Exclusive Perks</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-icon">🚀</span>
                        <span className="stat-text">Early Bird Benefits</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form className="waitlist-form-enhanced" onSubmit={handleSubmit}>
                  <div className="form-glow"></div>
                  
                  <div className="form-header-enhanced">
                    <h3>Join the Waitlist</h3>
                    <p>Be among the first to experience the future</p>
                  </div>
                  
                  <div className="form-group-enhanced">
                    <div className="input-wrapper">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="email-input-enhanced"
                        required
                        disabled={isLoading}
                      />
                      <div className="input-glow"></div>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="cta-submit-btn"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="loading-spinner">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M12 2v4m0 12v4m10-10h-4M6 12H2" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </span>
                          <span>Securing Your Spot...</span>
                        </>
                      ) : (
                        <>
                          <span>Get Early Access</span>
                          <span className="btn-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                          </span>
                        </>
                      )}
                      <div className="btn-glow"></div>
                    </button>
                  </div>
                  
                  <div className="form-footer">
                    <span className="secure-badge">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                      Secure & Private
                    </span>
                    <span className="spots-left">
                      <span className="pulse-dot"></span>
                      Only 247 spots remaining
                    </span>
                  </div>
                </form>
              )}
            </div>

            {/* Enhanced Social Proof */}
            <div className={`social-proof-enhanced ${isVisible ? 'visible' : ''}`}>
              <div className="proof-item">
                <div className="proof-icon-wrapper">
                  <div className="proof-icon-glow"></div>
                  <div className="proof-icon">🚀</div>
                </div>
                <div className="proof-content">
                  <span className="proof-number" data-value="50000">0</span>
                  <span className="proof-label">Waitlist Members</span>
                </div>
              </div>
              
              <div className="proof-divider"></div>
              
              <div className="proof-item">
                <div className="proof-icon-wrapper">
                  <div className="proof-icon-glow"></div>
                  <div className="proof-icon">⭐</div>
                </div>
                <div className="proof-content">
                  <span className="proof-number" data-value="4.9">0.0</span>
                  <span className="proof-label">Creator Rating</span>
                </div>
              </div>
              
              <div className="proof-divider"></div>
              
              <div className="proof-item">
                <div className="proof-icon-wrapper">
                  <div className="proof-icon-glow"></div>
                  <div className="proof-icon">💎</div>
                </div>
                <div className="proof-content">
                  <span className="proof-number" data-value="5">$0</span>M+
                  <span className="proof-label">Creator Earnings</span>
                </div>
              </div>
            </div>

            {/* Testimonial ticker */}
            <div className={`testimonial-ticker ${isVisible ? 'visible' : ''}`}>
              <div className="ticker-track">
                <div className="ticker-item">
                  <span className="ticker-quote">&ldquo;This is the future of content creation!&rdquo;</span>
                  <span className="ticker-author">- Sarah M., Content Creator</span>
                </div>
                <div className="ticker-item">
                  <span className="ticker-quote">&ldquo;Finally, a platform that values creators&rdquo;</span>
                  <span className="ticker-author">- Mike T., YouTuber</span>
                </div>
                <div className="ticker-item">
                  <span className="ticker-quote">&ldquo;Revolutionary approach to digital content&rdquo;</span>
                  <span className="ticker-author">- Lisa K., Artist</span>
                </div>
                <div className="ticker-item">
                  <span className="ticker-quote">&ldquo;Can&apos;t wait for the full launch!&rdquo;</span>
                  <span className="ticker-author">- James R., Filmmaker</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Floating orbs */}
        <div className="cta-orb cta-orb-1"></div>
        <div className="cta-orb cta-orb-2"></div>
      </section>
    </>
  );
} 