'use client';

import { useEffect, useRef, useState } from 'react';
import '../../app/roadmap.css';

interface Milestone {
  date: string;
  items: string[];
}

interface PhaseMarkerStyle extends React.CSSProperties {
  '--phase-color': string;
}

interface Phase {
  id: number;
  title: string;
  period: string;
  milestones: Milestone[];
  color: string;
}

const roadmapData: Phase[] = [
  {
    id: 1,
    title: 'Foundation and Beta Launch',
    period: 'Q4 2024',
    color: '#ff6b00',
    milestones: [
      {
        date: 'October 2024',
        items: [
          'Complete core platform development',
          'Initiate closed beta testing',
          'Community engagement and feedback'
        ]
      },
      {
        date: 'February 2025',
        items: [
          'Launch AI-driven recommendation engine',
          'Launch AI thumbnail generation',
          'Launch AI Creator Studio',
          
        ]
      },
      {
        date: 'April 2025',
        items: [
          'Launch AI-driven Search engine',
          'Launch AI-Creator Studio',
        
        ]
      },
      {
        date: 'September 2025',
        items: [
          'Launch Early Adopter Ambassador Program',
          'Beta Test Content Pass',
          'Open beta to wider audience',
          'Initiate $TUBE token pre-sale'
        ]
      },
       {
        date: 'November 2025',
        items: [
          'Initiate $TUBE token pre-sale',
          'Begin Creator Onboarding'
        ]
      },
      {
        date: 'December 2025',
        items: [
          '$TUBE token public sale',
        
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Growth and Feature Expansion',
    period: 'Q1-Q2 2025',
    color: '#ff8c00',
    milestones: [
      {
        date: 'Q1 2026',
        items: [
          'Full public launch of Base.Tube platform',
          'Implement tiered system for users',
          
          'Release mobile apps (iOS and Android)',
        
        ]
      },
      
    ]
  },
  {
    id: 3,
    title: 'Mobile and International Expansion',
    period: 'Q3-Q4 2025',
    color: '#ffa500',
    milestones: [
      {
        date: 'Q3 2025',
        items: [
          'International expansion (Asia and Europe)',
          'Implement multi-language support',
          'Launch creator education program'
        ]
      },
      {
        date: 'Q4 2025',
        items: [
          'Introduce live streaming capabilities',
          'Expand AI for real-time content moderation',
          'Launch Base.Tube Creator Fund',
          'AR/VR integration'
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Ecosystem Growth and Innovation',
    period: '2026 and Beyond',
    color: '#ffc107',
    milestones: [
      {
        date: '2026 and Beyond',
        items: [
          'Explore partnerships with media companies',
          'Continuous innovation and feature development',
          'Potential expansion into new content formats'
        ]
      }
    ]
  }
];

export default function RoadmapSection() {
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    // Intersection Observer for phase animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('phase-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const phases = document.querySelectorAll('.roadmap-phase');
    phases.forEach((phase) => observer.observe(phase));

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <section className="roadmap-section" ref={containerRef}>
      <div className="roadmap-background">
        <div className="roadmap-grid"></div>
        <div 
          className="roadmap-glow"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`
          }}
        />
      </div>

      <div className="roadmap-container">
        <div className="roadmap-header">
          <h1 className="roadmap-title">
            <span className="title-line">Product</span>
            <span className="title-line gradient">Roadmap</span>
          </h1>
          <p className="roadmap-subtitle">
            Building the future of decentralized video sharing, one milestone at a time
          </p>
        </div>

        <div className="roadmap-timeline" ref={timelineRef}>
          <div className="timeline-line"></div>
          
          {roadmapData.map((phase) => (
            <div
              key={phase.id}
              className={`roadmap-phase phase-${phase.id} ${activePhase === phase.id ? 'active' : ''}`}
              onMouseEnter={() => setActivePhase(phase.id)}
              onMouseLeave={() => setActivePhase(null)}
            >
              <div className="phase-marker" style={{ '--phase-color': phase.color } as PhaseMarkerStyle}>
                <div className="marker-core"></div>
                <div className="marker-ring"></div>
                <div className="marker-pulse"></div>
              </div>

              <div className="phase-content">
                <div className="phase-header">
                  <h2 className="phase-title">{phase.title}</h2>
                  <span className="phase-period">{phase.period}</span>
                </div>

                <div className="milestones-grid">
                  {phase.milestones.map((milestone, mIndex) => (
                    <div key={mIndex} className="milestone-card">
                      <h3 className="milestone-date">{milestone.date}</h3>
                      <ul className="milestone-list">
                        {milestone.items.map((item, iIndex) => (
                          <li key={iIndex} className="milestone-item">
                            <span className="item-marker"></span>
                            <span className="item-text">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="phase-background-number">{`0${phase.id}`}</div>
            </div>
          ))}
        </div>

        <div className="roadmap-footer">
          <div className="footer-content">
            <h3 className="footer-title">Join Our Journey</h3>
            <p className="footer-text">
              Be part of the revolution. Early adopters will shape the future of Base.Tube.
            </p>
            <button className="roadmap-cta-button">
              <span className="button-text">Get Early Access</span>
              <span className="button-glow"></span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 