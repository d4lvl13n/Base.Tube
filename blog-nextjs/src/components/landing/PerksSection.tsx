'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PerksSection() {
  const [activeTab, setActiveTab] = useState<'creators' | 'fans'>('creators')
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null)
  const [passNumber, setPassNumber] = useState(1)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [autoRotate, setAutoRotate] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)

  // Simulate pass number animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPassNumber(prev => prev >= 500 ? 1 : prev + Math.floor(Math.random() * 10) + 1)
    }, 3000)
    
    return () => {
      clearInterval(interval)
    }
  }, [])

  // Auto-rotate between tabs
  useEffect(() => {
    if (!autoRotate) return
    
    const rotateInterval = setInterval(() => {
      setActiveTab(prev => prev === 'creators' ? 'fans' : 'creators')
    }, 4000)
    
    return () => clearInterval(rotateInterval)
  }, [autoRotate])

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return
      
      const rect = sectionRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setMousePosition({ x, y })
      
      // Create interactive particles on movement
      if (Math.random() > 0.95) {
        const particle = document.createElement('div')
        particle.className = 'interactive-particle'
        particle.style.left = `${e.clientX - rect.left}px`
        particle.style.top = `${e.clientY - rect.top}px`
        particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 100}px`)
        particle.style.setProperty('--ty', `${(Math.random() - 0.5) * 100}px`)
        sectionRef.current.appendChild(particle)
        
        setTimeout(() => particle.remove(), 2000)
      }
    }

    const section = sectionRef.current
    if (section) {
      section.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      if (section) {
        section.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [])

  const creatorPerks = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: 'Instant Discovery',
      description: 'Your fans can discover you instantly'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2"/>
          <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: '500 Power Users',
      description: '500 power users with unlimited access'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: '90% Revenue Forever',
      description: 'Lock in 90% revenue share forever'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7V12C2 16.5 4.23 20.68 7.62 22.47L12 24L16.38 22.47C19.77 20.68 22 16.5 22 12V7L12 2Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: 'Priority Placement',
      description: 'Priority placement in the marketplace'
    }
  ]

  const fanPerks = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 3L12 7" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 3L8 7" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 3L16 7" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 12L16 12" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: 'Unlimited Access',
      description: 'Watch any gated content, any creator'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69365 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69365 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: 'Support Everyone',
      description: 'Support unlimited creators'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M21 16V8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M3.27 6.96L12 12.01L20.73 6.96" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: 'First Collectible',
      description: 'Own Base.Tube\'s first-ever collectible'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Profit Potential',
      description: 'Resell for potential profit as platform grows'
    }
  ]

  const everyonePerks = [
    { text: 'Base.Tube Genesis Pass NFT (#1-500)' },
    { text: 'Founding member status' },
    { text: 'Direct access to shape the platform' },
    { text: 'A piece of history' }
  ]

  return (
    <section ref={sectionRef} className="perks-section">
      {/* Background Effects */}
      <div className="perks-bg-effects">
        <div className="genesis-glow"></div>
        <div className="particle-field"></div>
      </div>

      <div className="perks-container">
        {/* Header */}
        <motion.div 
          className="perks-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          <h2 className="perks-title">
            Join the <span className="founding-highlight">Founding 500</span>
          </h2>
          <p className="perks-tagline">
            <span className="genesis-text">The Genesis Pass.</span> One pass. Every creator. <span className="forever-text">Forever.</span>
          </p>
        </motion.div>

        {/* Genesis Pass Visual */}
        <motion.div 
          className="genesis-pass-showcase"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="pass-container">
            <div className="pass-card">
              <div className="pass-header">
                <div className="pass-logo">BASE.TUBE</div>
                <div className="pass-type">GENESIS PASS</div>
              </div>
              <div className="pass-number">
                <span className="number-prefix">#</span>
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={passNumber}
                    className="number-value"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {String(passNumber).padStart(3, '0')}
                  </motion.span>
                </AnimatePresence>
                <span className="number-total">/500</span>
              </div>
              <div className="pass-hologram">
                <div className="hologram-ring"></div>
                <div className="hologram-core">∞</div>
              </div>
              <div className="pass-footer">
                <div className="pass-status">FOUNDING MEMBER</div>
                <div className="pass-unlock">YOUR NUMBER: #___</div>
              </div>
              <div className="pass-shine"></div>
            </div>
          </div>
          
          {/* URGENCY scarcity indicator */}
          <motion.div 
            className="pass-scarcity"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <span className="scarcity-highlight">Only 500 Spots</span>
            <span className="scarcity-subtext">Founding Member Access</span>
            <span className="scarcity-warning">Limited time — Don&apos;t miss out</span>
          </motion.div>
        </motion.div>

        {/* Description - Moved below pass */}
        <motion.p 
          className="perks-description"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          The first 500 members—creators and fans—receive the Genesis Pass. 
          A master key that unlocks every piece of content on Base.Tube. Forever.
        </motion.p>

        {/* Benefits Tabs */}
        <motion.div 
          className="benefits-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 80 }}
        >
          {/* Tab Switcher with auto-rotate control */}
          <div className="tab-switcher">
            <button 
              className={`tab-btn ${activeTab === 'creators' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('creators')
                setAutoRotate(false)
              }}
              onMouseEnter={() => setAutoRotate(false)}
            >
              <span className="tab-icon">🎬</span>
              For Creators
            </button>
            <button 
              className={`tab-btn ${activeTab === 'fans' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('fans')
                setAutoRotate(false)
              }}
              onMouseEnter={() => setAutoRotate(false)}
            >
              <span className="tab-icon">👥</span>
              For Fans
            </button>
          </div>
          
          {/* Auto-rotate indicator */}
          {autoRotate && (
            <div className="auto-rotate-indicator">
              <span>Auto-switching</span>
              <div className="rotate-progress"></div>
            </div>
          )}

          {/* Benefits Grid */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              className="benefits-grid"
              initial={{ opacity: 0, x: activeTab === 'creators' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === 'creators' ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              {(activeTab === 'creators' ? creatorPerks : fanPerks).map((perk, index) => (
                <motion.div 
                  key={index}
                  className={`benefit-card ${hoveredBenefit === index ? 'hovered' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredBenefit(index)}
                  onMouseLeave={() => setHoveredBenefit(null)}
                >
                  <div className="benefit-icon">{perk.icon}</div>
                  <h4 className="benefit-title">{perk.title}</h4>
                  <p className="benefit-description">{perk.description}</p>
                  <div className="benefit-glow"></div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Everyone Gets Section */}
        <motion.div 
          className="everyone-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 80 }}
        >
          <h3 className="everyone-title">Everyone Gets:</h3>
          <div className="everyone-grid">
            {everyonePerks.map((perk, index) => (
              <motion.div 
                key={index}
                className="everyone-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <div className="check-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>{perk.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Ambient glow that follows mouse */}
        <div 
          className="ambient-glow"
          style={{
            position: 'absolute',
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            width: '600px',
            height: '600px',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            opacity: 0.15,
            transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(250, 117, 23, 0.3) 0%, transparent 60%)',
            filter: 'blur(100px)',
          }} />
        </div>
      </div>
    </section>
  )
} 