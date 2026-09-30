'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SearchCheck, Wand2, Check } from 'lucide-react';
import AuditPreview from './studio-audit/AuditPreview';
import StudioPreview from './studio-audit/StudioPreview';
import { AUDIT_URL } from './studio-audit/content';

/* ─────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────── */
const ORANGE = '#ff801f';
const BLUE   = '#3b9eff';

/* ─────────────────────────────────────────────────────────
   FEATURE BULLET LISTS
───────────────────────────────────────────────────────── */
const auditFeatures = [
  'A written critique of your thumbnails and titles, tied to your own videos',
  'No score out of 100 and no predicted CTR, on purpose',
  'Connect YouTube to see your real impressions and click-through rate',
];

const studioFeatures = [
  '3 thumbnail ideas per video, from a link or a script',
  'Your face, colours and channel style, saved once',
  'Change any idea with one sentence',
];

/* ─────────────────────────────────────────────────────────
   SECTION
───────────────────────────────────────────────────────── */
export default function ThumbnailSection() {
  return (
    <section className="v2-thumb">
      <div className="v2-container">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="v2-thumb-header"
        >
          <span className="v2-label">Creator Tools</span>
          <h2>
            Better thumbnails.<br />
            <span>Measured, not guessed.</span>
          </h2>
          <p>
            See how your thumbnails and titles read, make new ones in your own style,
            and see each video&apos;s real numbers once YouTube is connected. Grow first, monetize
            when you&apos;re ready.
          </p>
        </motion.div>

        {/* Feature rows */}
        <div className="v2-thumb-rows">

          {/* Row 1 — text LEFT, visual RIGHT */}
          <motion.div
            className="v2-thumb-row"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="v2-thumb-row-content">
              <div className="v2-tc-icon-row">
                <div className="v2-tc-icon" style={{ color: ORANGE }}><SearchCheck size={18} /></div>
                <div className="v2-tc-tag" style={{ background: 'rgba(255,89,0,0.12)', color: ORANGE, border: '1px solid rgba(255,89,0,0.2)' }}>
                  <span className="v2-tc-tag-dot" style={{ background: ORANGE }} />
                  FREE
                </div>
              </div>
              <h3 className="v2-thumb-row-title">Channel audit</h3>
              <p className="v2-thumb-row-desc">
                Get a plain-language review of your channel&apos;s packaging: what reads
                well, what gets lost at small size, and what to change first.
              </p>
              <ul className="v2-thumb-row-list">
                {auditFeatures.map((f) => (
                  <li key={f}>
                    <Check size={13} style={{ color: ORANGE, flexShrink: 0, marginTop: 1 }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a href={AUDIT_URL} target="_blank" rel="noopener noreferrer" style={{ color: ORANGE, display: 'inline-block', marginTop: 18, fontWeight: 600, fontSize: 14 }}>
                Run the free audit →
              </a>
            </div>
            <div className="v2-thumb-row-visual">
              <AuditPreview />
            </div>
          </motion.div>

          {/* Row 2 — visual LEFT, text RIGHT */}
          <motion.div
            className="v2-thumb-row reverse"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <div className="v2-thumb-row-content">
              <div className="v2-tc-icon-row">
                <div className="v2-tc-icon" style={{ color: BLUE }}><Wand2 size={18} /></div>
                <div className="v2-tc-tag" style={{ background: 'rgba(0,117,255,0.12)', color: BLUE, border: '1px solid rgba(59,158,255,0.22)' }}>
                  <span className="v2-tc-tag-dot" style={{ background: BLUE }} />
                  GEN AI
                </div>
              </div>
              <h3 className="v2-thumb-row-title">AI Thumbnails</h3>
              <p className="v2-thumb-row-desc">
                Paste a video link or a script. Get thumbnail ideas with your face and
                your channel&apos;s style, ready for YouTube&apos;s own A/B test.
              </p>
              <ul className="v2-thumb-row-list">
                {studioFeatures.map((f) => (
                  <li key={f}>
                    <Check size={13} style={{ color: BLUE, flexShrink: 0, marginTop: 1 }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/ai-thumbnails" style={{ color: BLUE, display: 'inline-block', marginTop: 18, fontWeight: 600, fontSize: 14 }}>
                See AI Thumbnails →
              </Link>
            </div>
            <div className="v2-thumb-row-visual">
              <StudioPreview />
            </div>
          </motion.div>

        </div>

        {/* Funnel bridge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="v2-thumb-bridge"
        >
          <div className="v2-thumb-bridge-steps">
            <span className="v2-thumb-bridge-step active">Creator Tools</span>
            <span className="v2-thumb-bridge-sep">→</span>
            <span className="v2-thumb-bridge-step">Grow Your Audience</span>
            <span className="v2-thumb-bridge-sep">→</span>
            <span className="v2-thumb-bridge-step">Monetize with Content Pass</span>
          </div>
          <div className="v2-thumb-bridge-note">
            <a href="https://beta.base.tube/sign-up" target="_blank" rel="noopener noreferrer">
              Already have an audience? Skip straight to monetizing →
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
