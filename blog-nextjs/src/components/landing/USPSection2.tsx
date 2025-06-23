'use client';

import { useEffect, useRef, useState } from 'react';

export default function USPSection2() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [cardStates, setCardStates] = useState([false, false, false]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const features = [
    {
      id: 1,
      title: 'Turn Your Audience Into Your Economy',
      description: 'Your best fans don\'t want to donate—they want to own. Let them buy passes to your exclusive content. Assets they can keep, collect, or resell. You earn from every transaction, forever.',
      icon: (
        <svg viewBox="0 0 120 120" fill="none">
          {/* Central creator node with radiating economic connections */}
          <circle cx="60" cy="60" r="30" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.1"/>
          <circle cx="60" cy="60" r="20" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2"/>
          {/* Creator symbol */}
          <path d="M60 50L65 60L60 70L55 60L60 50Z" fill="currentColor"/>
          
          {/* Fan nodes around creator */}
          <circle cx="30" cy="30" r="8" fill="currentColor" opacity="0.3"/>
          <circle cx="90" cy="30" r="8" fill="currentColor" opacity="0.3"/>
          <circle cx="90" cy="90" r="8" fill="currentColor" opacity="0.3"/>
          <circle cx="30" cy="90" r="8" fill="currentColor" opacity="0.3"/>
          
          {/* Economic flow lines */}
          <path d="M35 35L50 50M70 50L85 35M70 70L85 85M50 70L35 85" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
          
          {/* Circular economy arrows */}
          <path d="M60 30A30 30 0 0 1 90 60" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="5 5">
            <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="2s" repeatCount="indefinite"/>
          </path>
          <path d="M90 60A30 30 0 0 1 60 90" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="5 5">
            <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="2s" begin="0.5s" repeatCount="indefinite"/>
          </path>
          <path d="M60 90A30 30 0 0 1 30 60" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="5 5">
            <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="2s" begin="1s" repeatCount="indefinite"/>
          </path>
          <path d="M30 60A30 30 0 0 1 60 30" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="5 5">
            <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="2s" begin="1.5s" repeatCount="indefinite"/>
          </path>
          
          {/* Dollar symbols flowing */}
          <text x="45" y="45" fontSize="10" fill="currentColor" opacity="0.6">$</text>
          <text x="75" y="45" fontSize="10" fill="currentColor" opacity="0.6">$</text>
          <text x="75" y="75" fontSize="10" fill="currentColor" opacity="0.6">$</text>
          <text x="45" y="75" fontSize="10" fill="currentColor" opacity="0.6">$</text>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
      color: 'orange'
    },
    {
      id: 2,
      title: 'Digital Content Can Have Real Value',
      description: 'When fans buy a Content Pass, they\'re not renting—they\'re owning. When they\'re done, they can keep it or sell it. For the first time, supporting creators becomes sustainable for fans.',
      icon: (
        <svg viewBox="0 0 120 120" fill="none">
          {/* Content Pass as valuable asset */}
          <rect x="30" y="40" width="60" height="40" rx="8" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.1"/>
          <rect x="35" y="45" width="50" height="30" rx="6" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2"/>
          
          {/* Value indicators */}
          <path d="M60 60L65 55L60 50L55 55L60 60Z" fill="currentColor"/>
          <circle cx="60" cy="60" r="15" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="3 3" opacity="0.5">
            <animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur="10s" repeatCount="indefinite"/>
          </circle>
          
          {/* Rising value graph */}
          <path d="M40 35L45 30L50 25L55 20L60 15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
            <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite"/>
          </path>
          <circle cx="60" cy="15" r="3" fill="currentColor">
            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/>
          </circle>
          
          {/* Ownership badge */}
          <circle cx="85" cy="55" r="12" fill="currentColor" opacity="0.2"/>
          <path d="M80 55L83 58L90 51" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          
          {/* Transfer arrows */}
          <path d="M30 90L50 90M45 85L50 90L45 95" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
          <path d="M70 90L90 90M85 85L90 90L85 95" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
          
          {/* Sparkle effects */}
          <circle cx="40" cy="20" r="2" fill="currentColor">
            <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="80" cy="25" r="2" fill="currentColor">
            <animate attributeName="opacity" values="0;1;0" dur="2s" begin="0.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="70" cy="35" r="2" fill="currentColor">
            <animate attributeName="opacity" values="0;1;0" dur="2s" begin="1s" repeatCount="indefinite"/>
          </circle>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #10b981 0%, #0891b2 100%)',
      color: 'green'
    },
    {
      id: 3,
      title: 'Tomorrow\'s Tech, Today\'s Simplicity',
      description: 'Blockchain-powered. Credit card-simple. True digital ownership without the learning curve. The future of content doesn\'t require a manual.',
      icon: (
        <svg viewBox="0 0 120 120" fill="none">
          {/* Credit card morphing to blockchain */}
          <rect x="25" y="50" width="45" height="30" rx="4" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
          <circle cx="35" cy="65" r="4" fill="currentColor" opacity="0.5"/>
          <path d="M45 65L60 65" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
          
          {/* Transformation wave */}
          <path d="M70 65Q80 55,90 65T110 65" stroke="currentColor" strokeWidth="2" fill="none">
            <animate attributeName="d" values="M70 65Q80 55,90 65T110 65;M70 65Q80 75,90 65T110 65;M70 65Q80 55,90 65T110 65" dur="2s" repeatCount="indefinite"/>
          </path>
          
          {/* Blockchain representation */}
          <g transform="translate(75, 50)">
            <rect x="0" y="0" width="15" height="15" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2"/>
            <rect x="20" y="0" width="15" height="15" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2"/>
            <rect x="10" y="15" width="15" height="15" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2"/>
            <path d="M7.5 7.5L12.5 7.5M22.5 7.5L27.5 7.5M17.5 15L17.5 22.5" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
          </g>
          
          {/* Simplicity checkmark */}
          <circle cx="60" cy="25" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
          <path d="M55 25L58 28L65 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          
          {/* Ease indicators */}
          <circle cx="30" cy="35" r="3" fill="currentColor" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite"/>
          </circle>
          <circle cx="90" cy="35" r="3" fill="currentColor" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" begin="1s" repeatCount="indefinite"/>
          </circle>
          <circle cx="60" cy="95" r="3" fill="currentColor" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" begin="2s" repeatCount="indefinite"/>
          </circle>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
      color: 'purple'
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
      cardRefs.current.forEach((card) => {
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
          translateZ(0px)
          scale(0.98)
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
  }, []);

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
  }, [features, isInView]);

  // Create interactive particles on card interaction
  const createParticle = (cardElement: HTMLElement, x: number, y: number) => {
    const particle = document.createElement('div');
    particle.className = 'usp2-particle interactive';
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
      className="usp2-section"
    >
      {/* Section Header */}
      <div className={`usp2-header ${isInView ? 'visible' : ''}`}>
        <h2 className="usp2-title">
          <span className="usp2-gradient-text">We Built What</span>
          <br />
          <span className="usp2-outline-text" data-text="Should Have Existed All Along">Should Have Existed All Along</span>
        </h2>
      </div>

      {/* Cards Container */}
      <div className="usp2-container">
        
        {/* Holo Cards Grid */}
        <div className="usp2-cards-grid">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`
                usp2-card 
                ${cardStates[index] ? 'revealed' : ''}
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
              
              {/* Icon Section */}
              <div className="usp2-card-icon">
                <div className="icon-glow"></div>
                {feature.icon}
              </div>

              {/* Content Section */}
              <div className="usp2-card-content">
                <h3 className="usp2-card-title">{feature.title}</h3>
                <p className="usp2-card-description">{feature.description}</p>
              </div>

              {/* Particles - Enhanced container */}
              <div className="usp2-particles">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`usp2-particle usp2-particle-${i + 1}`}></div>
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