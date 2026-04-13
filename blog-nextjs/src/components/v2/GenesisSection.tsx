'use client';

import { useState, useEffect } from 'react';
import ScrollReveal from './ScrollReveal';

const creatorPerks = [
  'Instant discovery — fans can find you from day one',
  '90% revenue share locked in forever',
  'Priority placement in the marketplace',
  'Direct access to shape the product roadmap',
];

const fanPerks = [
  'Unlimited access to all gated content, every creator',
  'Founding member status — never repeated',
  'Resell your pass on the marketplace at any time',
  'Direct line to the team to shape the platform',
];

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
              One pass. Every creator. Forever.
            </h2>
            <p>
              The first 500 members — creators and fans alike — receive the
              Genesis Pass. A master key that unlocks every piece of content
              on Base.Tube, forever. Limited supply. Never repeated.
            </p>

            <div style={{ marginBottom: 32 }}>
              <div className="v2-genesis-col-title">For Creators</div>
              <div className="v2-genesis-perks">
                {creatorPerks.map((p) => (
                  <div key={p} className="v2-genesis-perk">
                    <span className="v2-genesis-perk-dot" />
                    {p}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 40 }}>
              <div className="v2-genesis-col-title">For Fans</div>
              <div className="v2-genesis-perks">
                {fanPerks.map((p) => (
                  <div key={p} className="v2-genesis-perk">
                    <span className="v2-genesis-perk-dot" />
                    {p}
                  </div>
                ))}
              </div>
            </div>

            <a
              href="https://beta.base.tube/sign-up"
              target="_blank"
              rel="noopener noreferrer"
              className="v2-btn v2-btn-primary"
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
