'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function USPSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [cardStates, setCardStates] = useState([false, false, false, false]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const features = [
    {
      id: 1,
      title: 'Video NFT',
      subtitle: 'Digital Ownership Revolution',
      description: 'Transform your creative content into unique digital assets. Mint, trade, and monetize your videos in ways never before possible.',
      image: '/images/VideoNFT.webp',
      gradient: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
      color: 'orange'
    },
    {
      id: 2,
      title: 'NFT Content Pass',
      subtitle: 'Exclusive Access Gateway',
      description: 'Create premium experiences for your most dedicated fans. Grant access to behind-the-scenes content and live streams.',
      image: '/images/NFTcontentpass.webp',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #e11d48 100%)',
      color: 'purple'
    },
    {
      id: 3,
      title: 'Reward System',
      subtitle: 'Engagement Economy',
      description: 'Every interaction generates value. Watch, share, comment, and engage to earn tokens in a sustainable ecosystem.',
      image: '/images/reward.webp',
      gradient: 'linear-gradient(135deg, #10b981 0%, #0891b2 100%)',
      color: 'green'
    },
    {
      id: 4,
      title: 'Decentralization',
      subtitle: 'True Content Freedom',
      description: 'Own your content completely. Censorship-resistant storage ensures your creative work remains yours forever.',
      image: '/images/Decentralisation.webp',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #0891b2 100%)',
      color: 'blue'
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
          } else {
            setIsInView(false);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-10% 0px -10% 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
  }, [isInView, currentCard, cardStates]);

  // Create interactive particles on card interaction
  const createParticle = (cardElement: HTMLElement, x: number, y: number) => {
    const particle = document.createElement('div');
    particle.className = 'usp-particle interactive';
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
      className="usp-section"
    >
      {/* Section Header - Outside container for better positioning */}
      <div className={`usp-header ${isInView ? 'visible' : ''}`}>
        <h2 className="usp-title">
          <span className="usp-gradient-text">Revolutionizing</span>
          <br />
          <span className="usp-outline-text" data-text="Digital Content">Digital Content</span>
        </h2>
        <p className="usp-subtitle">
          Four revolutionary pillars transforming creator economy
        </p>
        
        {/* Progress indicator */}
        <div className="usp-progress">
          <div className="usp-progress-bar">
            <div 
              className="usp-progress-fill"
              style={{ width: `${scrollProgress * 100}%` }}
            ></div>
          </div>
         
        </div>
      </div>

      {/* Cards Container */}
      <div className="usp-container">
        
        {/* Holo Cards Grid */}
        <div className="usp-cards-grid">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`
                usp-card 
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
              <div className="usp-card-number">
                {String(index + 1).padStart(2, '0')}
              </div>
              
              {/* Image Section */}
              <div className="usp-card-image">
                <Image 
                  src={feature.image}
                  alt={feature.title}
                  width={400}
                  height={250}
                  className="usp-image"
                  priority={index < 2}
                />
                <div className="usp-image-overlay"></div>
              </div>

              {/* Content Section */}
              <div className="usp-card-content">
                <h3 className="usp-card-title">{feature.title}</h3>
                <p className="usp-card-subtitle">{feature.subtitle}</p>
                <p className="usp-card-description">{feature.description}</p>
                
                {/* Progress bar */}
                <div className="usp-card-progress">
                  <div 
                    className="usp-card-progress-fill"
                    style={{ width: currentCard === index ? '100%' : '0%' }}
                  ></div>
                </div>

                {/* Explore button */}
                <button className="usp-explore-btn">
                  <span>Explore Feature</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>

              {/* Particles - Enhanced container */}
              <div className="usp-particles">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`usp-particle usp-particle-${i + 1}`}></div>
                ))}
              </div>
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
            width: '200px',
            height: '200px',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            opacity: 0.3,
            transition: 'all 0.3s ease-out',
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(255, 107, 53, 0.2) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />
        </div>

      </div>
    </section>
  );
} 