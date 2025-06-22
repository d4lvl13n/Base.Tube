'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MegaMenu from './MegaMenu';
import PrimaryButton from './ui/PrimaryButton';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [magneticHover, setMagneticHover] = useState({ x: 0, y: 0 });
  const [isMenuMagnetic, setIsMenuMagnetic] = useState(false);
  const [gradientAngle, setGradientAngle] = useState(0);
  const [liquidMorph, setLiquidMorph] = useState(false);
  const [aiGradient, setAiGradient] = useState('');
  const [particleExplosion, setParticleExplosion] = useState(false);
  
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  // Advanced scroll behavior with smooth hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      
      setScrollProgress(scrolled);
      setScrolled(currentScrollY > 50);

      // Hide header on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Mouse tracking for magnetic effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const angle = Math.atan2(e.clientY - window.innerHeight / 2, e.clientX - window.innerWidth / 2);
      setGradientAngle((angle * 180) / Math.PI + 90);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Magnetic hover effect for menu
  const handleMagneticHover = (e: React.MouseEvent<HTMLDivElement>, isHovering: boolean) => {
    if (!menuRef.current) return;
    
    if (isHovering) {
      const rect = menuRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const magnetX = (e.clientX - centerX) * 0.3;
      const magnetY = (e.clientY - centerY) * 0.3;
      
      setMagneticHover({ x: magnetX, y: magnetY });
      setIsMenuMagnetic(true);
    } else {
      setMagneticHover({ x: 0, y: 0 });
      setIsMenuMagnetic(false);
    }
  };

  // AI-powered gradient generation - throttled
  useEffect(() => {
    const generateAIGradient = () => {
      const time = Date.now() * 0.001;
      const hue1 = (Math.sin(time * 0.1) + 1) * 180;
      const hue2 = (Math.cos(time * 0.15) + 1) * 180;
      const gradient = `linear-gradient(${gradientAngle}deg, 
        hsla(${hue1}, 70%, 50%, 0.3) 0%, 
        hsla(${hue2}, 70%, 50%, 0.2) 50%, 
        transparent 100%)`;
      setAiGradient(gradient);
    };

    // Run once immediately
    generateAIGradient();
    
    // Then update less frequently
    const interval = setInterval(generateAIGradient, 200); // Changed from 50ms to 200ms
    return () => clearInterval(interval);
  }, [gradientAngle]);

  // Create liquid morph effect
  const createLiquidMorph = () => {
    setLiquidMorph(true);
    setTimeout(() => setLiquidMorph(false), 800);
  };

  // Create particle explosion with physics
  const createParticleExplosion = (x: number, y: number, color: string) => {
    if (!headerRef.current) return;
    
    const particleCount = 30;
    const particles: HTMLDivElement[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'explosion-particle';
      
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 50 + Math.random() * 150;
      const size = 2 + Math.random() * 6;
      const hue = Math.random() * 60 - 30; // Color variation
      
      particle.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        filter: hue-rotate(${hue}deg);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
      `;
      
      headerRef.current.appendChild(particle);
      particles.push(particle);
      
      // Animate with physics
      let posX = 0;
      let posY = 0;
      const velX = Math.cos(angle) * velocity;
      let velY = Math.sin(angle) * velocity;
      let opacity = 1;
      
      const animate = () => {
        velY += 200; // Gravity
        posX += velX * 0.016;
        posY += velY * 0.016;
        opacity -= 0.02;
        
        particle.style.transform = `translate(${posX}px, ${posY}px) scale(${opacity})`;
        particle.style.opacity = opacity.toString();
        
        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };
      
      requestAnimationFrame(animate);
    }
  };

  // Enhanced menu toggle with liquid animation
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    createLiquidMorph();
    
    if (!isMenuOpen) {
      const rect = menuRef.current?.getBoundingClientRect();
      if (rect) {
        createParticleExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, '#ff6b35');
      }
    }
  };

  // Logo interaction with particle physics
  const handleLogoInteraction = (e: React.MouseEvent) => {
    setIsLogoHovered(true);
    createLiquidMorph();
    
    const rect = logoRef.current?.getBoundingClientRect();
    if (rect) {
      createParticleExplosion(
        e.clientX,
        e.clientY,
        'linear-gradient(45deg, #ff6b35, #fa7517)'
      );
    }
  };

  // CTA button quantum effects
  const handleCTAClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setParticleExplosion(true);
    
    const rect = ctaRef.current?.getBoundingClientRect();
    if (rect) {
      // Create quantum ripple effect
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          createParticleExplosion(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            `hsl(${20 + i * 10}, 100%, 60%)`
          );
        }, i * 100);
      }
    }
    
    setTimeout(() => setParticleExplosion(false), 1000);
  };

  return (
    <>
      {/* Ultra Progress Bar */}
      <div className="progress-bar-container">
        <div 
          className="progress-bar-enhanced"
          style={{ width: `${scrollProgress}%` }}
        >
          <div className="progress-glow"></div>
          <div className="progress-pulse"></div>
        </div>
        <div className="progress-particles">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="progress-particle"
              style={{ left: `${scrollProgress}%`, animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      <header 
        ref={headerRef} 
        className={`header-enhanced ${scrolled ? 'scrolled' : ''} ${!isVisible ? 'hidden' : ''} ${liquidMorph ? 'liquid-morph' : ''}`}
        style={{
          transform: `translateY(${isVisible ? '0' : '-100%'})`,
        }}
      >
        {/* AI-Powered Dynamic Background */}
        <div className="header-background">
          <div className="header-overlay"></div>
          <div 
            className="ai-gradient-layer"
            style={{ background: aiGradient }}
          ></div>
          <div className="header-scan-lines"></div>
          <div className="holographic-layer"></div>
          <canvas id="neural-network" className="neural-canvas"></canvas>
        </div>

        {/* Floating Particles System */}
        <div className="header-particles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`header-particle header-particle-${i + 1}`}>
              <div className="particle-glow"></div>
            </div>
          ))}
        </div>

        {/* Liquid Morph Blobs */}
        <div className="liquid-blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>

        <div className="header-container-enhanced">
          {/* Magnetic Menu Icon */}
          <div 
            ref={menuRef}
            className="menu-wrapper magnetic-wrapper"
            onMouseMove={(e) => handleMagneticHover(e, true)}
            onMouseLeave={(e) => handleMagneticHover(e, false)}
            style={{
              transform: `translate(${magneticHover.x}px, ${magneticHover.y}px)`,
            }}
          >
            <div 
              className={`menu-icon-enhanced ${isMenuOpen ? 'active' : ''} ${isMenuMagnetic ? 'magnetic-active' : ''}`}
              onClick={toggleMenu}
            >
              <div className="menu-icon-inner">
                <div className="bar bar-1">
                  <span className="bar-inner"></span>
                  <span className="bar-glow"></span>
                </div>
                <div className="bar bar-2">
                  <span className="bar-inner"></span>
                  <span className="bar-glow"></span>
                </div>
                <div className="bar bar-3">
                  <span className="bar-inner"></span>
                  <span className="bar-glow"></span>
                </div>
              </div>
              <div className="menu-icon-aura"></div>
              <div className="menu-ripple"></div>
            </div>
          </div>

          {/* Quantum Logo */}
          <div 
            ref={logoRef}
            className="logo-container-enhanced"
          >
            <Link 
              href="/"
              onMouseEnter={handleLogoInteraction}
              onMouseLeave={() => setIsLogoHovered(false)}
            >
              <div className={`logo-wrapper ${isLogoHovered ? 'hovered' : ''}`}>
                <div className="logo-quantum-field"></div>
                <div className="logo-glow"></div>
                <Image 
                  src="/images/basetube-logo.png" 
                  alt="Base.Tube Logo" 
                  width={180} 
                  height={60}
                  className="logo-enhanced"
                  priority
                />
                <div className="logo-hologram"></div>
                <div className="logo-particles">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`logo-particle-orbit orbit-${i + 1}`} />
                  ))}
                </div>
              </div>
            </Link>
          </div>

          {/* Futuristic CTA */}
          <div className="header-actions">
            <PrimaryButton
              ref={ctaRef}
              size="large"
              hoverText="Be First"
              className={particleExplosion ? 'exploding' : ''}
              onClick={handleCTAClick}
            >
              Join the Beta
            </PrimaryButton>
          </div>
        </div>

        {/* Interaction Indicator */}
        <div className={`interaction-indicator ${scrolled ? 'hidden' : ''}`}>
          <div className="indicator-wave"></div>
        </div>
      </header>

      {/* Mega Menu with Liquid Transitions */}
      <MegaMenu isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />
    </>
  );
} 