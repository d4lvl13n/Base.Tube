'use client';

import { useEffect, useRef, useState } from 'react';

export default function USPSection4() {
  const [activeCard, setActiveCard] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [stars, setStars] = useState<Array<{ left: number; top: number; size: number; duration: number; delay: number }>>([]);
  const sectionRef = useRef<HTMLElement>(null);

  const features = [
    {
      id: 1,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
      title: "True Ownership",
      description: "Your content becomes a digital asset that you can sell, trade, or hold forever. No platform can take it away."
    },
    {
      id: 2,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      title: "Perpetual Revenue",
      description: "Every resale generates royalties. Your content continues earning long after the initial sale."
    },
    {
      id: 3,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: "Community Value",
      description: "Fans become stakeholders. They can support you and potentially profit from your success."
    },
    {
      id: 4,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      title: "Market Dynamics",
      description: "Content value is determined by real demand, not algorithmic whims or platform policies."
    },
    {
      id: 5,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ),
      title: "Creative Freedom",
      description: "No censorship, no demonetization. You decide what to create and how to price it."
    }
  ];

  // Calculate card transforms for stacking effect
  const getCardTransform = (index: number) => {
    const isActive = index === activeCard;
    const isPrevious = index < activeCard;
    const offset = index - activeCard;
    
    if (isActive) {
      return {
        transform: `translateY(0) scale(1) rotateX(0deg)`,
        opacity: 1,
        zIndex: 50,
        pointerEvents: 'auto' as const
      };
    } else if (isPrevious) {
      return {
        transform: `translateY(-120%) scale(0.9) rotateX(-10deg)`,
        opacity: 0,
        zIndex: index,
        pointerEvents: 'none' as const
      };
    } else {
      // Next cards - stacked behind
      const yOffset = offset * 15;
      const scale = 1 - (offset * 0.05);
      const opacity = offset === 1 ? 0.8 : offset === 2 ? 0.6 : 0.4;
      
      return {
        transform: `translateY(${yOffset}px) scale(${scale}) rotateX(${offset * 2}deg)`,
        opacity: hoveredCard === index ? 1 : opacity,
        zIndex: 50 - offset,
        pointerEvents: (offset === 1 || offset === 2) ? 'auto' as const : 'none' as const
      };
    }
  };

  // Auto-advance cards
  useEffect(() => {
    if (!isInView) return;
    
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isInView, features.length]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Generate star particles only on client side
  useEffect(() => {
    const starCount = 30;
    const generatedStars = [...Array(starCount)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 20
    }));
    setStars(generatedStars);
  }, []);

  const handleCardClick = (index: number) => {
    if (index === activeCard + 1 || (activeCard === features.length - 1 && index === 0)) {
      setActiveCard(index);
    }
  };

  return (
    <section ref={sectionRef} className="usp4-section">
      {/* Minimal Background */}
      <div className="galaxy-background">
        {/* Subtle Stars */}
        {stars.map((particle, index) => (
          <div
            key={index}
            className="star-particle"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      {/* Section Header */}
      <div className={`usp4-header ${isInView ? 'visible' : ''}`}>
        <h2 className="usp4-title">
          <span className="usp4-gradient-text">Why Base.Tube</span>
          <br />
          <span className="usp4-outline-text">Changes Everything</span>
        </h2>
        <p className="usp4-subtitle">
          Five paradigm shifts that redefine content creation
        </p>
      </div>

      {/* Stacked Cards Container */}
      <div className="stacked-cards-container">
        <div className="cards-stack">
          {features.map((feature, index) => {
            const cardStyle = getCardTransform(index);
            return (
              <div
                key={feature.id}
                className={`stacked-card ${index === activeCard ? 'active' : ''}`}
                style={cardStyle}
                onClick={() => handleCardClick(index)}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="card-inner">
                  {/* Progress indicator */}
                  {index === activeCard && (
                    <div className="card-progress">
                      <div className="progress-bar" />
                    </div>
                  )}
                  
                  {/* Card number */}
                  <div className="card-number">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  
                  {/* Icon */}
                  <div className="card-icon">
                    {feature.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="card-title">{feature.title}</h3>
                  <p className="card-description">{feature.description}</p>
                  
                  {/* Action hint */}
                  {index === activeCard + 1 && (
                    <div className="card-hint">Click to explore →</div>
                  )}
                </div>
                
                {/* Glow effect */}
                <div className="card-glow" />
              </div>
            );
          })}
        </div>

        {/* Navigation dots */}
        <div className="card-navigation">
          {features.map((_, index) => (
            <button
              key={index}
              className={`nav-dot ${index === activeCard ? 'active' : ''}`}
              onClick={() => setActiveCard(index)}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Ambient effects */}
      <div className="ambient-glow ambient-glow-1" />
      <div className="ambient-glow ambient-glow-2" />
    </section>
  );
} 