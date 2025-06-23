'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import EnhancedButton from '../ui/EnhancedButton';

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="cta-section-minimal">
      {/* Dark Background - clean, no effects */}
      <div className="cta-dark-background"></div>

      <div className="cta-container-minimal">
        {/* Minimalist CTA Content */}
        <motion.div 
          className="minimal-cta-content"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Main Statement */}
          <motion.h2 
            className="cta-statement"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Every Revolution Started With A Choice.
          </motion.h2>

          {/* Sub Statement */}
          <motion.p 
            className="cta-substatement"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            This is yours.
          </motion.p>

          {/* CTA Button */}
          <motion.div 
            className="cta-button-wrapper"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <EnhancedButton 
              size="large"
              className="minimal-cta-button"
              icon={<span className="button-arrow">→</span>}
              onClick={() => window.open('https://beta.base.tube/sign-up', '_blank')}
            >
              Start Creating
            </EnhancedButton>
          </motion.div>

          {/* Beta Text */}
          <motion.p 
            className="cta-beta-text"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Join our Beta now
          </motion.p>
        </motion.div>
        </div>
      </section>
  );
} 