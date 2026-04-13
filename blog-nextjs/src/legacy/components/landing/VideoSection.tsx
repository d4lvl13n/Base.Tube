'use client';

import { useEffect, useRef, useState } from 'react';
import EnhancedButton from '../ui/EnhancedButton';

export default function VideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
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

  return (
    <section ref={sectionRef} className="slide slide-4 video-section-enhanced">
      <div className="section__content slide-4-content">
        
        {/* Video Background */}
        <div className="video-background">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="background-video"
          >
            <source src="/video/seoul-21116.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Enhanced Video Overlay */}
          <div className="video-overlay-enhanced"></div>
          
          {/* Animated scan lines */}
          <div className="video-scan-lines"></div>
        </div>

        {/* Video Content */}
        <div className={`video-content ${isInView ? 'visible' : ''}`}>
          <div className="video-text">
            
            {/* Animated title */}
            <h2 className={`video-title-enhanced ${isInView ? 'visible' : ''}`}>
              <span className="video-title-line">
                <span className="video-gradient-text">Experience</span>
                <span className="video-text-normal"> the Next Generation</span>
              </span>
              <span className="video-title-line-2">
                of <span className="video-outline-text" data-text="Digital Content">Digital Content</span>
              </span>
            </h2>
            
            {/* Enhanced description */}
            <p className={`video-description-enhanced ${isInView ? 'visible' : ''}`}>
              Join thousands of creators and fans who are already 
              <span className="video-highlight"> building the future </span>
              of content creation. Where innovation meets creativity, and 
              <span className="video-highlight"> every moment creates value</span>.
            </p>
            
            {/* Enhanced CTA */}
            <div className={`video-cta-enhanced ${isInView ? 'visible' : ''}`}>
              <EnhancedButton 
                size="large"
                className="video-btn-primary"
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                }
              >
                Start Creating
              </EnhancedButton>
            </div>
            
          </div>
        </div>

        {/* Floating particles */}
        <div className="video-particles">
          {[...Array(15)].map((_, i) => (
            <div key={i} className={`video-particle video-particle-${i + 1}`} />
          ))}
        </div>

      </div>
    </section>
  );
} 