'use client';

import { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';


const passPerks = [
  'Unlimited content access',
  'Resellable on marketplace',
  '90% revenue share (creators)',
  'Priority placement',
  'Founding member status',
];

export default function GenesisSection() {
  const [passNum, setPassNum] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setPassNum((prev) =>
        prev >= 500 ? 1 : prev + Math.floor(Math.random() * 7) + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="v2-genesis" id="genesis">
      <div className="v2-container">
        <div className="v2-genesis-inner">
          {/* Left: copy */}
          <ScrollReveal>
          <div className="v2-genesis-left">
            <span className="v2-label">Founding 500</span>
            <h2>
              The Genesis Pass.<br />
              <em className="v2-orange">One pass. Every creator. Forever.</em>
            </h2>
            <p>
              The first <span className="v2-orange">500 members</span> — creators and fans alike — receive the
              Genesis Pass. A <span className="v2-orange">master key</span> that unlocks every piece of content
              on Base.Tube, <span className="v2-orange">forever</span>. Limited supply. Never repeated.
            </p>

            <a
              href="https://beta.base.tube/sign-up"
              target="_blank"
              rel="noopener noreferrer"
              className="v2-btn v2-btn-primary"
              style={{ marginTop: 32 }}
            >
              Claim your spot →
            </a>
          </div>
          </ScrollReveal>

          {/* Right: pass card */}
          <ScrollReveal delay={200}>
          <div>
            <div className="v2-pass-card">
              <div className="v2-pass-top">
                <span className="v2-pass-wordmark">BASE.TUBE</span>
                <span className="v2-pass-type-badge">Genesis Pass</span>
              </div>

              <div className="v2-pass-number">
                #{String(passNum).padStart(3, '0')}
                <sub> /500</sub>
              </div>
              <div className="v2-pass-member-label">Founding Member</div>

              <div className="v2-pass-sep" />

              <div className="v2-pass-perks-list">
                {passPerks.map((p) => (
                  <div key={p} className="v2-pass-perk-item">
                    <span className="v2-pass-perk-check">✓</span>
                    {p}
                  </div>
                ))}
              </div>

              <div className="v2-pass-footer">
                <span className="v2-pass-footer-note">Only 500 ever issued</span>
                <span className="v2-pass-limited">Limited</span>
              </div>
            </div>
          </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
