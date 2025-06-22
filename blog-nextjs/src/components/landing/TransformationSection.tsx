'use client';

import { useEffect, useRef, useState } from 'react';
import EnhancedButton from '../ui/EnhancedButton';

export default function TransformationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTransform, setActiveTransform] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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

  const transformations = [
    {
      id: 1,
      from: 'Ads & Subscriptions',
      to: 'Direct Sales',
      icon: {
        from: (
          <svg viewBox="0 0 100 100" fill="none">
            {/* Ad banner with play button and dollar signs */}
            <rect x="20" y="35" width="60" height="30" stroke="currentColor" strokeWidth="2" opacity="0.5" rx="4"/>
            <path d="M30 50L40 45L40 55L30 50Z" fill="currentColor" opacity="0.3"/>
            <text x="50" y="53" fontSize="12" fill="currentColor" opacity="0.3">ADS</text>
            {/* Subscription recurring symbol */}
            <circle cx="50" cy="75" r="8" stroke="currentColor" strokeWidth="2" opacity="0.5" fill="none"/>
            <path d="M50 67L50 75L55 70" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
            <path d="M58 75A8 8 0 0 1 42 75" stroke="currentColor" strokeWidth="2" opacity="0.5" strokeLinecap="round"/>
            {/* Falling coins (lost revenue) */}
            <circle cx="25" cy="20" r="4" fill="currentColor" opacity="0.2">
              <animate attributeName="cy" values="20;90;20" dur="3s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.2;0;0.2" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="75" cy="25" r="4" fill="currentColor" opacity="0.2">
              <animate attributeName="cy" values="25;95;25" dur="3.5s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.2;0;0.2" dur="3.5s" repeatCount="indefinite"/>
            </circle>
          </svg>
        ),
        to: (
          <svg viewBox="0 0 100 100" fill="none">
            {/* Direct payment/sale icon */}
            <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.1"/>
            <path d="M50 35L50 65M40 45L60 45M40 55L60 55" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            {/* Price tag */}
            <path d="M65 30L75 20L85 30L75 40Z" fill="currentColor" opacity="0.3"/>
            <path d="M65 30L75 20L85 30L75 40Z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="75" cy="30" r="2" fill="currentColor"/>
            {/* Rising value indicators */}
            <path d="M30 70L35 65L40 60" stroke="currentColor" strokeWidth="2" opacity="0.8">
              <animate attributeName="opacity" values="0;0.8;0" dur="2s" repeatCount="indefinite"/>
            </path>
            <path d="M60 60L65 55L70 50" stroke="currentColor" strokeWidth="2" opacity="0.8">
              <animate attributeName="opacity" values="0;0.8;0" dur="2s" begin="0.5s" repeatCount="indefinite"/>
            </path>
            {/* Glow effect */}
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" opacity="0.3" fill="none">
              <animate attributeName="r" values="30;35;30" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite"/>
            </circle>
          </svg>
        )
      },
      points: [
        'Set your own prices for premium content',
        'No more begging for ad revenue or sponsorships',
        'Fans pay once, not monthly forever'
      ]
    },
    {
      id: 2,
      from: 'Renters',
      to: 'Owners',
      icon: {
        from: (
          <svg viewBox="0 0 100 100" fill="none">
            {/* Rental/temporary access - locked box with timer */}
            <rect x="30" y="40" width="40" height="30" stroke="currentColor" strokeWidth="2" opacity="0.5" rx="4"/>
            <path d="M45 40L45 30A5 5 0 0 1 55 30L55 40" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
            <circle cx="50" cy="52" r="4" fill="currentColor" opacity="0.3"/>
            <path d="M50 52L50 56" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
            {/* Clock/timer showing expiration */}
            <circle cx="75" cy="25" r="10" stroke="currentColor" strokeWidth="2" opacity="0.5" fill="none"/>
            <path d="M75 20L75 25L78 28" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
            {/* Fading access indicators */}
            <rect x="35" y="75" width="30" height="3" fill="currentColor" opacity="0.3">
              <animate attributeName="width" values="30;0;30" dur="3s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite"/>
            </rect>
            <text x="50" y="85" fontSize="8" fill="currentColor" opacity="0.3" textAnchor="middle">EXPIRES</text>
          </svg>
        ),
        to: (
          <svg viewBox="0 0 100 100" fill="none">
            {/* Key representing ownership */}
            <circle cx="40" cy="40" r="15" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.1"/>
            <path d="M50 45L65 60L65 65L70 65L70 70L75 70L75 75L80 75L80 80L75 85L70 80" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.2"/>
            <circle cx="40" cy="40" r="5" fill="currentColor" opacity="0.8"/>
            {/* Property deed/certificate */}
            <rect x="20" y="60" width="35" height="25" stroke="currentColor" strokeWidth="2" rx="2" fill="currentColor" fillOpacity="0.1"/>
            <path d="M25 70L50 70M25 75L45 75M25 80L40 80" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
            {/* Transfer arrows showing liquidity */}
            <path d="M60 30L70 30L65 25M70 30L65 35" stroke="currentColor" strokeWidth="2" opacity="0.8">
              <animate attributeName="opacity" values="0;0.8;0" dur="3s" repeatCount="indefinite"/>
            </path>
            {/* Ownership glow */}
            <circle cx="40" cy="40" r="20" stroke="currentColor" strokeWidth="1" opacity="0.3" fill="none">
              <animate attributeName="r" values="20;25;20" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite"/>
            </circle>
          </svg>
        )
      },
      points: [
        'Fans own their access pass, not just rent it',
        'They can resell when they\'re done watching',
        'Supporting creators becomes a potential investment'
      ]
    },
    {
      id: 3,
      from: 'Platform Control',
      to: 'Creator Economy',
      icon: {
        from: (
          <svg viewBox="0 0 100 100" fill="none">
            {/* Platform puppet strings */}
            <rect x="35" y="20" width="30" height="20" stroke="currentColor" strokeWidth="2" opacity="0.5" rx="2"/>
            <text x="50" y="33" fontSize="8" fill="currentColor" opacity="0.3" textAnchor="middle">PLATFORM</text>
            {/* Strings controlling creator */}
            <path d="M40 40L40 60M50 40L50 65M60 40L60 60" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
            {/* Controlled creator figure */}
            <circle cx="50" cy="70" r="8" stroke="currentColor" strokeWidth="2" opacity="0.5" fill="none"/>
            <path d="M42 60L42 75M58 60L58 75M42 75L35 80M58 75L65 80" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
            {/* Percentage taken */}
            <text x="75" y="50" fontSize="16" fill="currentColor" opacity="0.3">45%</text>
            <path d="M70 55L80 55L75 60Z" fill="currentColor" opacity="0.3">
              <animateTransform attributeName="transform" type="translate" values="0,0; 0,10; 0,0" dur="2s" repeatCount="indefinite"/>
            </path>
          </svg>
        ),
        to: (
          <svg viewBox="0 0 100 100" fill="none">
            {/* Creator at center with radiating connections */}
            <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.2"/>
            <text x="50" y="54" fontSize="10" fill="currentColor" textAnchor="middle" fontWeight="bold">YOU</text>
            {/* Direct connections to audience */}
            <circle cx="25" cy="25" r="6" fill="currentColor" opacity="0.3"/>
            <circle cx="75" cy="25" r="6" fill="currentColor" opacity="0.3"/>
            <circle cx="25" cy="75" r="6" fill="currentColor" opacity="0.3"/>
            <circle cx="75" cy="75" r="6" fill="currentColor" opacity="0.3"/>
            <circle cx="50" cy="20" r="6" fill="currentColor" opacity="0.3"/>
            <circle cx="50" cy="80" r="6" fill="currentColor" opacity="0.3"/>
            <circle cx="20" cy="50" r="6" fill="currentColor" opacity="0.3"/>
            <circle cx="80" cy="50" r="6" fill="currentColor" opacity="0.3"/>
            {/* Direct lines */}
            <path d="M40 40L30 30M60 40L70 30M40 60L30 70M60 60L70 70" stroke="currentColor" strokeWidth="2" opacity="0.8"/>
            <path d="M50 35L50 26M50 65L50 74M35 50L26 50M65 50L74 50" stroke="currentColor" strokeWidth="2" opacity="0.8"/>
            {/* 90% indicator */}
            <text x="50" y="95" fontSize="14" fill="currentColor" textAnchor="middle" fontWeight="bold">90%</text>
            {/* Pulse effect */}
            <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="1" opacity="0.3" fill="none">
              <animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite"/>
            </circle>
          </svg>
        )
      },
      points: [
        'You decide what\'s premium and what\'s free',
        'Direct relationship with your paying audience',
        'Keep 90% of sales, earn from every resale'
      ]
    }
  ];

  return (
    <section ref={sectionRef} className="transformation-section">
      {/* Background Effects */}
      <div className="transform-bg-effects">
        <div className="transform-grid"></div>
        <div className="transform-gradient-orb"></div>
        <div className="transform-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`t-particle tp-${i + 1}`}></div>
          ))}
        </div>
      </div>

      <div className="transformation-container">
        
        {/* Section Header */}
        <div className={`transform-header ${isVisible ? 'visible' : ''}`}>
          <div className="header-sparkle">✨</div>
          <h2 className="transform-title">
            The <span className="gradient-text">Transformation</span>
          </h2>
          <p className="transform-subtitle">
            Three fundamental shifts that change everything for creators
          </p>
        </div>

        {/* Transformation Cards */}
        <div className={`transform-cards ${isVisible ? 'visible' : ''}`}>
          {transformations.map((transform, index) => (
            <div
              key={transform.id}
              className={`transform-card ${activeTransform === index ? 'active' : ''} ${hoveredCard === index ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setActiveTransform(activeTransform === index ? null : index)}
            >
              {/* Card Background Effects */}
              <div className="card-glow"></div>
              <div className="card-shimmer"></div>
              
              {/* Transformation Visual */}
              <div className="transform-visual">
                <div className={`visual-from ${hoveredCard === index ? 'fade' : ''}`}>
                  <div className="icon-wrapper from-icon">
                    {transform.icon.from}
                  </div>
                  <span className="label-from">{transform.from}</span>
                </div>
                
                <div className="transform-arrow">
                  <svg viewBox="0 0 100 40" className="arrow-morph">
                    <defs>
                      <linearGradient id={`arrowGrad${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0"/>
                        <stop offset="50%" stopColor="currentColor" stopOpacity="1"/>
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path 
                      d="M10 20 L70 20 M60 12 L70 20 L60 28" 
                      stroke={`url(#arrowGrad${index})`} 
                      strokeWidth="3" 
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Flowing particles */}
                    <circle r="2" fill="currentColor">
                      <animateMotion dur="2s" repeatCount="indefinite" path="M10 20 L70 20"/>
                      <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                </div>
                
                <div className={`visual-to ${hoveredCard === index ? 'glow' : ''}`}>
                  <div className="icon-wrapper to-icon">
                    {transform.icon.to}
                  </div>
                  <span className="label-to">{transform.to}</span>
                </div>
              </div>

              {/* Transformation Details */}
              <div className={`transform-details ${activeTransform === index ? 'expanded' : ''}`}>
                <ul className="detail-points">
                  {transform.points.map((point, pointIndex) => (
                    <li 
                      key={pointIndex} 
                      className="detail-point"
                      style={{ animationDelay: `${pointIndex * 0.1}s` }}
                    >
                      <span className="point-marker"></span>
                      <span className="point-text">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Click Indicator */}
              <div className="click-indicator">
                <span>{activeTransform === index ? 'Click to close' : 'Click to explore'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`transform-cta ${isVisible ? 'visible' : ''}`}>
          <p className="cta-text">
            Ready to be part of the transformation?
          </p>
          <EnhancedButton 
            size="large"
            className="transform-button"
            icon={<span className="enhanced-arrow">→</span>}
          >
            See How It Works
          </EnhancedButton>
        </div>

      </div>
    </section>
  );
} 