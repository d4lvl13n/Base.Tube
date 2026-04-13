'use client';

import { useEffect, useRef, useState } from 'react';

export default function USPSection3() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [cardStates, setCardStates] = useState([false, false, false, false, false]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const features = [
    {
      id: 1,
      title: 'Buy Once, Own Forever',
      subtitle: 'For Fans',
      description: 'No more subscription fatigue. When you buy a Content Pass, it\'s yours. Watch it today, next year, or sell it tomorrow.',
      visual: (
        <div className="usp3-visual-wrapper">
          <div className="infinity-symbol">
            <svg viewBox="0 0 200 100" fill="none">
              <path d="M50 50C50 22.4 27.6 0 0 0s-50 22.4-50 50 22.4 50 50 50c27.6 0 50-22.4 50-50zm100 0c0-27.6 22.4-50 50-50s50 22.4 50 50-22.4 50-50 50-50-22.4-50-50z" 
                stroke="currentColor" 
                strokeWidth="8" 
                fill="none"
                opacity="0.2"
              />
              <path d="M50 50C25 20 0 25 0 50s25 30 50 0c25 30 50 25 50 0s-25-30-50 0z" 
                stroke="url(#infinityGradient)" 
                strokeWidth="4" 
                fill="none"
              />
              <defs>
                <linearGradient id="infinityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="play-icon">
            <svg viewBox="0 0 60 60" fill="currentColor">
              <circle cx="30" cy="30" r="30" fill="currentColor" opacity="0.1"/>
              <path d="M22 18L42 30L22 42V18Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="ownership-sparkles">
            <div className="sparkle s1"></div>
            <div className="sparkle s2"></div>
            <div className="sparkle s3"></div>
            <div className="sparkle s4"></div>
          </div>
        </div>
      ),
      gradient: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
      color: 'orange'
    },
    {
      id: 2,
      title: 'Content That Pays You Back',
      subtitle: 'For Everyone',
      description: 'Revolutionary: content access you can resell. Your entertainment budget becomes an investment portfolio.',
      visual: (
        <div className="usp3-visual-wrapper">
          <div className="money-flow">
            <div className="content-box">
              <svg viewBox="0 0 80 60" fill="none">
                <rect x="10" y="10" width="60" height="40" rx="4" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                <path d="M30 25L50 30L30 35V25Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="flow-arrows">
              <svg viewBox="0 0 100 50" fill="none">
                <path d="M20 25C20 25 50 15 80 25" stroke="url(#flowGradient)" strokeWidth="3" strokeDasharray="5 5">
                  <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="1s" repeatCount="indefinite"/>
                </path>
                <defs>
                  <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#0891b2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="dollar-signs">
              <span className="dollar d1">$</span>
              <span className="dollar d2">$</span>
              <span className="dollar d3">$</span>
            </div>
          </div>
          <div className="growth-chart">
            <svg viewBox="0 0 100 60" fill="none">
              <path d="M10 50L30 40L50 30L70 20L90 10" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
              <path d="M10 50L30 40L50 30L70 20L90 10" stroke="url(#growthGradient)" strokeWidth="3" strokeDasharray="100" strokeDashoffset="100">
                <animate attributeName="stroke-dashoffset" to="0" dur="2s" fill="freeze"/>
              </path>
              <defs>
                <linearGradient id="growthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      ),
      gradient: 'linear-gradient(135deg, #10b981 0%, #0891b2 100%)',
      color: 'green'
    },
    {
      id: 3,
      title: '90% Yours, 100% Direct',
      subtitle: 'For Creators',
      description: 'No algorithm gatekeepers. Set your price, sell directly, keep 90% on every sale. Earn again on every resale.',
      visual: (
        <div className="usp3-visual-wrapper">
          <div className="percentage-display">
            <div className="percentage-circle">
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.2"/>
                <circle cx="60" cy="60" r="50" stroke="url(#percentGradient)" strokeWidth="8" fill="none" 
                  strokeDasharray="283" 
                  strokeDashoffset="28.3"
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                >
                  <animate attributeName="stroke-dashoffset" from="283" to="28.3" dur="2s" fill="freeze"/>
                </circle>
                <text x="60" y="70" textAnchor="middle" fontSize="36" fontWeight="bold" fill="currentColor">90%</text>
                <defs>
                  <linearGradient id="percentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#e11d48" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div className="direct-connections">
            <div className="connection c1"></div>
            <div className="connection c2"></div>
            <div className="connection c3"></div>
            <div className="connection c4"></div>
            <div className="connection c5"></div>
            <div className="connection c6"></div>
          </div>
        </div>
      ),
      gradient: 'linear-gradient(135deg, #a855f7 0%, #e11d48 100%)',
      color: 'purple'
    },
    {
      id: 4,
      title: 'Web3 Power, Web2 Simplicity',
      subtitle: 'For Humans',
      description: 'Pay with your credit card. Watch in your browser. No crypto wallets or technical barriers.',
      visual: (
        <div className="usp3-visual-wrapper">
          <div className="simplicity-flow">
            <div className="credit-card">
              <svg viewBox="0 0 100 60" fill="none">
                <rect x="10" y="10" width="80" height="40" rx="4" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                <rect x="10" y="20" width="80" height="8" fill="currentColor" opacity="0.3"/>
                <circle cx="25" cy="35" r="3" fill="currentColor"/>
                <rect x="35" y="33" width="20" height="4" rx="2" fill="currentColor" opacity="0.5"/>
              </svg>
            </div>
            <div className="magic-arrow">
              <svg viewBox="0 0 60 20" fill="none">
                <path d="M10 10L50 10M40 5L50 10L40 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="30" cy="10" r="2" fill="currentColor">
                  <animate attributeName="cx" from="15" to="45" dur="1.5s" repeatCount="indefinite"/>
                </circle>
              </svg>
            </div>
            <div className="blockchain-simple">
              <svg viewBox="0 0 60 60" fill="none">
                <rect x="20" y="20" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2">
                  <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" repeatCount="indefinite"/>
                </rect>
                <rect x="10" y="10" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                <rect x="30" y="10" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                <rect x="10" y="30" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                <rect x="30" y="30" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
              </svg>
            </div>
          </div>
          <div className="checkmark">
            <svg viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="25" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M20 30L26 36L40 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <animate attributeName="stroke-dasharray" from="0 100" to="100 0" dur="0.5s" begin="1s" fill="freeze"/>
              </path>
            </svg>
          </div>
        </div>
      ),
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #0891b2 100%)',
      color: 'blue'
    },
    {
      id: 5,
      title: 'Content Worth Collecting',
      subtitle: 'For Culture',
      description: 'Exclusive content that doesn\'t exist anywhere else. Limited passes that could become tomorrow\'s digital memorabilia.',
      visual: (
        <div className="usp3-visual-wrapper">
          <div className="museum-frame">
            <svg viewBox="0 0 120 120" fill="none">
              <rect x="20" y="20" width="80" height="80" stroke="currentColor" strokeWidth="6" rx="4" fill="none"/>
              <rect x="25" y="25" width="70" height="70" stroke="currentColor" strokeWidth="2" rx="2" fill="currentColor" fillOpacity="0.05"/>
            </svg>
          </div>
          <div className="diamond-content">
            <svg viewBox="0 0 80 80" fill="none">
              <path d="M40 20L60 35L40 60L20 35L40 20Z" fill="url(#diamondGradient)" opacity="0.3"/>
              <path d="M40 20L60 35L40 60L20 35L40 20Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M20 35L60 35" stroke="currentColor" strokeWidth="2"/>
              <path d="M40 20L40 60" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
              <defs>
                <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="limited-badge">
            <span className="badge-text">LIMITED</span>
            <span className="badge-number">#001</span>
          </div>
          <div className="collection-sparkles">
            <div className="c-sparkle cs1"></div>
            <div className="c-sparkle cs2"></div>
            <div className="c-sparkle cs3"></div>
          </div>
        </div>
      ),
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
      color: 'amber'
    }
  ];

  // Mouse tracking for 3D tilt effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
      
      // Apply 3D tilt to cards
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        
        const cardRect = card.getBoundingClientRect();
        const cardX = e.clientX - cardRect.left - cardRect.width / 2;
        const cardY = e.clientY - cardRect.top - cardRect.height / 2;
        
        const tiltX = (cardY / cardRect.height) * 15;
        const tiltY = (cardX / cardRect.width) * -15;
        
        card.style.transform = `
          perspective(1000px)
          rotateX(${tiltX}deg)
          rotateY(${tiltY}deg)
          translateZ(${index === currentCard ? 50 : 0}px)
          scale(${index === currentCard ? 1.02 : 0.95})
        `;
        
        // Update CSS variables for liquid morph effect
        card.style.setProperty('--mouse-x', `${(cardX / cardRect.width + 0.5) * 100}%`);
        card.style.setProperty('--mouse-y', `${(cardY / cardRect.height + 0.5) * 100}%`);
      });
    };

    const handleMouseLeave = () => {
      cardRefs.current.forEach((card) => {
        if (!card) return;
        card.style.transform = '';
      });
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      section.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (section) {
        section.removeEventListener('mousemove', handleMouseMove);
        section.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [currentCard]);

  // Enhanced intersection observer with staggered reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // Staggered card reveals with dramatic effect
            features.forEach((_, index) => {
              setTimeout(() => {
                setCardStates(prev => {
                  const newStates = [...prev];
                  newStates[index] = true;
                  
                  // Add reveal animation class
                  const card = cardRefs.current[index];
                  if (card) {
                    card.classList.add('reveal-animation');
                  }
                  
                  return newStates;
                });
              }, index * 150 + 300);
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px 0px 100px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Fallback: ensure visibility after 2 seconds
    const fallbackTimer = setTimeout(() => {
      if (!isInView) {
        setIsInView(true);
        features.forEach((_, index) => {
          setTimeout(() => {
            setCardStates(prev => {
              const newStates = [...prev];
              newStates[index] = true;
              return newStates;
            });
          }, index * 150 + 300);
        });
      }
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [features]);

  // Scroll handling with enhanced effects
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !isInView) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      const progress = Math.max(0, Math.min(1, -rect.top / (sectionHeight - viewportHeight)));
      setScrollProgress(progress);
      
      const cardIndex = Math.floor(progress * features.length * 0.9);
      const clampedIndex = Math.max(0, Math.min(features.length - 1, cardIndex));
      
      if (clampedIndex !== currentCard && cardStates[clampedIndex]) {
        setCurrentCard(clampedIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInView, currentCard, cardStates, features.length]);

  // Create interactive particles on card interaction
  const createParticle = (cardElement: HTMLElement, x: number, y: number) => {
    const particle = document.createElement('div');
    particle.className = 'usp3-particle interactive';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty('--mouse-x', `${Math.random() * 100 - 50}px`);
    particle.style.setProperty('--mouse-y', `${Math.random() * 100 - 50}px`);
    particle.style.animation = 'interactiveParticle 1s ease-out forwards';
    
    cardElement.appendChild(particle);
    
    setTimeout(() => particle.remove(), 1000);
  };

  const handleCardHover = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget;
    card.classList.add('magnetic-hover');
    
    // Create multiple particles
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const rect = card.getBoundingClientRect();
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        createParticle(card, x, y);
      }, i * 50);
    }
  };

  const handleCardLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.classList.remove('magnetic-hover');
  };

  return (
    <section 
      ref={sectionRef}
      className="usp3-section"
    >
      {/* Section Header */}
      <div className={`usp3-header ${isInView ? 'visible' : ''}`}>
        <h2 className="usp3-title">
          <span className="usp3-gradient-text">Why Base.Tube</span>
          <br />
          <span className="usp3-outline-text" data-text="Changes Everything">Changes Everything</span>
        </h2>
        <p className="usp3-subtitle">
          Five revolutionary shifts that redefine content ownership
        </p>
        
        {/* Progress indicator */}
        <div className="usp3-progress">
          <div className="usp3-progress-bar">
            <div 
              className="usp3-progress-fill"
              style={{ width: `${scrollProgress * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Cards Container */}
      <div className="usp3-container">
        
        {/* Holo Cards Grid */}
        <div className="usp3-cards-grid">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`
                usp3-card 
                ${cardStates[index] ? 'revealed' : ''}
                ${currentCard === index ? 'active' : ''}
              `}
              style={{
                '--card-gradient': feature.gradient,
                '--card-delay': `${index * 0.1}s`
              } as React.CSSProperties}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              onMouseEnter={(e) => handleCardHover(index, e)}
              onMouseLeave={handleCardLeave}
            >
              {/* Card Number Badge */}
              <div className="usp3-card-number">
                {String(index + 1).padStart(2, '0')}
              </div>
              
              {/* Visual Section */}
              <div className="usp3-card-visual">
                {feature.visual}
                <div className="usp3-visual-overlay"></div>
              </div>

              {/* Content Section */}
              <div className="usp3-card-content">
                <h3 className="usp3-card-title">{feature.title}</h3>
                <p className="usp3-card-subtitle">{feature.subtitle}</p>
                <p className="usp3-card-description">{feature.description}</p>
                
                {/* Progress bar */}
                <div className="usp3-card-progress">
                  <div 
                    className="usp3-card-progress-fill"
                    style={{ width: currentCard === index ? '100%' : '0%' }}
                  ></div>
                </div>

                {/* Explore button */}
                <button className="usp3-explore-btn">
                  <span>Explore Feature</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>

              {/* Particles - Enhanced container */}
              <div className="usp3-particles">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`usp3-particle usp3-particle-${i + 1}`}></div>
                ))}
              </div>

              {/* Card glow effect */}
              <div className="card-glow-effect"></div>
            </div>
          ))}
        </div>

        {/* Ambient particles based on mouse position */}
        <div 
          className="ambient-particles"
          style={{
            position: 'absolute',
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            width: '300px',
            height: '300px',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            opacity: 0.4,
            transition: 'all 0.3s ease-out',
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(250, 117, 23, 0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }} />
        </div>

      </div>
    </section>
  );
} 