'use client';

import Link from 'next/link';
import NavBar from '../NavBar';
import Footer from '../Footer';
import ScrollReveal from '../ScrollReveal';
import { CTROptimizerVisual } from '../ThumbnailSection';

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

const howSteps = [
  {
    n: '01',
    title: 'Upload your thumbnail',
    desc: 'Drop a JPEG or PNG. Any YouTube thumbnail size — we normalize it automatically.',
  },
  {
    n: '02',
    title: 'We scan it in seconds',
    desc: 'Face detection, text legibility, contrast ratio, and composition — all scored against 300k+ real thumbnails.',
  },
  {
    n: '03',
    title: 'Get a score + action list',
    desc: 'Overall CTR score, per-signal breakdown, and specific fixes ranked by expected impact. No fluff.',
  },
];

const differentiators = [
  {
    title: 'Trained on 300k+ real thumbnails',
    desc: 'Not a GPT vision wrapper. Our model was trained on actual YouTube thumbnails across niches, paired with real CTR data.',
  },
  {
    title: 'Signal-level feedback',
    desc: 'We don\'t say "looks good." We tell you the face is too small, the text is unreadable on mobile, and the contrast is 2.1:1 when you need 4.5:1.',
  },
  {
    title: 'Platform-native insight',
    desc: 'Built by a team that studies creator economics for a living. We know what converts viewers into paying fans, not just casual clicks.',
  },
];

export default function CTROptimizerPage() {
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
                <span className="v2-feature-tag orange" style={{ marginBottom: 0 }}>Free · No signup</span>
              </div>
              <h1 className="v2-cp-h1" style={{ marginTop: 20 }}>
                Score your YouTube<br />
                <em>thumbnail in seconds.</em>
              </h1>
              <p className="v2-cp-sub">
                Upload any thumbnail. Get an instant CTR score with face detection,
                text legibility analysis, and contrast scoring — benchmarked against
                300k+ real thumbnails.
              </p>
            </ScrollReveal>

            {/* Tool input area */}
            <ScrollReveal delay={120}>
              <div className="v2-tool-input-area">
                <div className="v2-tool-dropzone">
                  <div className="v2-tool-dropzone-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p className="v2-tool-dropzone-title">Drop your thumbnail here</p>
                  <p className="v2-tool-dropzone-sub">JPEG or PNG · 16:9 recommended · Max 5MB</p>
                  <div className="v2-tool-dropzone-actions">
                    <button className="v2-btn v2-btn-primary" disabled>
                      Choose file
                    </button>
                    <span className="v2-tool-coming-badge">Tool launching soon</span>
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
              <h2 className="v2-cp-section-h2">Analysis in three steps.</h2>
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
                <CTROptimizerVisual />
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
              <h2 className="v2-cp-section-h2">Not a wrapper. An actual model.</h2>
            </ScrollReveal>
            <div className="v2-tool-diff-grid">
              {differentiators.map((d, i) => (
                <ScrollReveal key={d.title} delay={i * 80}>
                  <div className="v2-tool-diff-card">
                    <div className="v2-tool-diff-accent" />
                    <h3 className="v2-tool-diff-title">{d.title}</h3>
                    <p className="v2-tool-diff-desc">{d.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <Sep />

        {/* ── BRIDGE TO BASE.TUBE ─────────────────────────── */}
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
