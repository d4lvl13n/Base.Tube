'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MegaMenu from './MegaMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const headerRef = useRef<HTMLElement>(null);

  // Scroll behavior
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

  return (
    <>
      {/* Minimal Progress Bar */}
      <div className="header-progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <header 
        ref={headerRef} 
        className={`header-floating ${scrolled ? 'scrolled' : ''} ${!isVisible ? 'hidden' : ''}`}
      >
        {/* Floating Glass Container */}
        <div className="header-morph-container">
          <div className="header-glass-card">
            {/* Morph Background Effects */}
            <div className="header-morph-gradient morph-1"></div>
            <div className="header-morph-gradient morph-2"></div>
            <div className="header-morph-gradient morph-3"></div>
            
            <div className="header-content">
              {/* Menu Button */}
              <button
                className="menu-button-floating"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <div className={`menu-icon-minimal ${isMenuOpen ? 'active' : ''}`}>
                  <span className="menu-line"></span>
                  <span className="menu-line"></span>
                  <span className="menu-line"></span>
                </div>
              </button>

              {/* Logo */}
              <Link href="/" className="logo-floating">
                <Image 
                  src="/images/basetube-logo.png" 
                  alt="Base.Tube Logo" 
                  width={160} 
                  height={48}
                  className="logo-image"
                  priority
                />
              </Link>

              {/* Navigation Links - Desktop */}
              <nav className="nav-links-floating">
                <Link href="/" className="nav-link-item">
                  <span className="nav-text">Home</span>
                  <span className="nav-underline"></span>
                </Link>
                <Link href="/blog" className="nav-link-item">
                  <span className="nav-text">Blog</span>
                  <span className="nav-underline"></span>
                </Link>
                <Link href="https://base-tube.gitbook.io/base.tube-documentation" className="nav-link-item">
                  <span className="nav-text">Docs</span>
                  <span className="nav-underline"></span>
                </Link>
                <a 
                  href="https://beta.base.tube/sign-up" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="nav-link-item nav-link-cta"
                >
                  <span className="nav-text">Join Beta</span>
                  <span className="nav-underline"></span>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Mega Menu */}
      <MegaMenu isMenuOpen={isMenuOpen} onToggleMenu={() => setIsMenuOpen(false)} />
    </>
  );
} 