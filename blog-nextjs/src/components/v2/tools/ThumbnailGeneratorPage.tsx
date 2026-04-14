'use client';

import Link from 'next/link';
import NavBar from '../NavBar';
import Footer from '../Footer';
import ScrollReveal from '../ScrollReveal';
import { GeneratorVisual } from '../ThumbnailSection';

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

const howSteps = [
  {
    n: '01',
    title: 'Describe your video',
    desc: 'Type a prompt: topic, tone, target emotion. Optionally upload a reference image for style matching.',
  },
  {
    n: '02',
    title: 'We generate 4 variants',
    desc: 'Each variant is generated with a different composition strategy — face-forward, text-heavy, drama, curiosity gap — and scored by projected CTR.',
  },
  {
    n: '03',
    title: 'Download the winner',
    desc: 'The highest-projected CTR variant is flagged automatically. Download any or all variants at full resolution.',
  },
];

const differentiators = [
  {
    title: 'CTR-first generation',
    desc: 'Other tools generate pretty images. We optimize for click-through rate — trained on what actually performs on YouTube, not what looks good on a portfolio.',
  },
  {
    title: 'Pattern-trained, not prompt-engineered',
    desc: 'The model learned from 300k+ thumbnails paired with real performance data. It understands face size, text placement, contrast, and composition — not just aesthetics.',
  },
  {
    title: 'Four variants, one decision',
    desc: 'We show you the options so you pick the one that fits your brand. The CTR score tells you which one would likely perform best if you\'re unsure.',
  },
];

export default function ThumbnailGeneratorPage() {
  return (
    <div className="v2-root">
      <div className="v2-grain" aria-hidden />
      <NavBar />

      <main style={{ paddingTop: 56 }}>

        {/* ── HERO + TOOL ──────────────────────────────────── */}
        <section className="v2-tool-hero">
          <div className="v2-container">
            <ScrollReveal>
              <div className="v2-tool-eyebrow">
                <Link href="/tools" className="v2-tool-breadcrumb">← All tools</Link>
                <span className="v2-feature-tag blue" style={{ marginBottom: 0 }}>Free tier: 3/day</span>
              </div>
              <h1 className="v2-cp-h1" style={{ marginTop: 20 }}>
                Generate thumbnails<br />
                <em>optimized for CTR.</em>
              </h1>
              <p className="v2-cp-sub">
                Describe your video. Get 4 AI-generated variants, each ranked by projected
                click-through rate. Trained on what actually performs — not what looks pretty.
              </p>
            </ScrollReveal>

            {/* Tool input area */}
            <ScrollReveal delay={120}>
              <div className="v2-tool-input-area">
                <div className="v2-gen-input-wrap">
                  <textarea
                    className="v2-gen-prompt"
                    placeholder="Describe your video: topic, tone, who's in it, what emotion you want to trigger…"
                    rows={3}
                    disabled
                  />
                  <div className="v2-gen-input-actions">
                    <label className="v2-gen-ref-label">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      Add reference image
                    </label>
                    <button className="v2-btn v2-btn-primary" disabled>
                      Generate thumbnails
                    </button>
                  </div>
                  <div className="v2-tool-coming-bar">
                    <span className="v2-tool-coming-badge">Tool launching soon — join beta to get early access</span>
                    <a
                      href="https://beta.base.tube/sign-up"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="v2-tool-coming-link"
                    >
                      Join waitlist →
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── HOW IT WORKS (with animated visual) ─────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">How it works</span>
              <h2 className="v2-cp-section-h2">From prompt to thumbnail in seconds.</h2>
            </ScrollReveal>

            <div className="v2-tool-demo-layout">
              {/* Steps */}
              <div className="v2-cp-steps" style={{ flex: 1 }}>
                {howSteps.map((s, i) => (
                  <ScrollReveal key={s.n} delay={i * 80}>
                    <div className="v2-cp-step">
                      <div className="v2-cp-step-num">{s.n}</div>
                      <div className="v2-cp-step-body">
                        <div className="v2-cp-step-title">{s.title}</div>
                        <p className="v2-cp-step-detail">{s.desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {/* Animated visual */}
              <div className="v2-tool-demo-visual">
                <GeneratorVisual />
              </div>
            </div>
          </div>
        </section>

        <Sep />

        {/* ── WHAT MAKES IT DIFFERENT ─────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">Why it works</span>
              <h2 className="v2-cp-section-h2">Optimized for click, not for pretty.</h2>
            </ScrollReveal>
            <div className="v2-tool-diff-grid">
              {differentiators.map((d, i) => (
                <ScrollReveal key={d.title} delay={i * 80}>
                  <div className="v2-tool-diff-card">
                    <div className="v2-tool-diff-accent blue" />
                    <h3 className="v2-tool-diff-title">{d.title}</h3>
                    <p className="v2-tool-diff-desc">{d.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <Sep />

        {/* ── BRIDGE ───────────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <div className="v2-tool-bridge">
                <p className="v2-tool-bridge-text">
                  These tools are free because Base.Tube makes money when creators
                  monetize — not when they pay for SaaS. When you&apos;re ready to turn
                  your audience into income, we&apos;re here.
                </p>
                <div className="v2-tool-bridge-links">
                  <Link href="/content-pass" className="v2-btn v2-btn-primary">
                    Learn about Content Pass →
                  </Link>
                  <Link href="/" className="v2-btn v2-btn-ghost">
                    See the platform
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

      </main>

      <Sep />
      <Footer />
    </div>
  );
}
