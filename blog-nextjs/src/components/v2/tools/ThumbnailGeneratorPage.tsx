'use client';

// Route stays /tools/thumbnail-generator. This page presents the AI Thumbnail Studio
// that is live on the Base.Tube beta: thumbnails in the channel's saved style, 3 variants
// per video, one-sentence edits. No predicted-CTR ranking, no "trained on N thumbnails" claim.

import Link from 'next/link';
import NavBar from '../NavBar';
import Footer from '../Footer';
import ScrollReveal from '../ScrollReveal';
import StudioPreview from '../studio-audit/StudioPreview';
import { AUDIT_URL, STUDIO_URL, studioFaqs } from '../studio-audit/content';
import styles from '../studio-audit/visuals.module.css';

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

const howSteps = [
  {
    n: '01',
    title: 'Give it the video',
    desc: 'Paste a link to your video, or describe the idea in a sentence.',
  },
  {
    n: '02',
    title: 'Get 3 variants in your style',
    desc: 'The Studio uses your saved channel style: your brand kit and your own face. You get 3 thumbnail variants for that video.',
  },
  {
    n: '03',
    title: 'Change anything with one sentence',
    desc: 'Something off? Say what to change, for example "warmer light, more steam", and the Studio edits that thumbnail. Keep the one you like.',
  },
];

const differentiators = [
  {
    title: 'Your style, saved',
    desc: 'Set your brand kit and your face once. Every thumbnail after that starts from your look, so your channel stays recognisable from video to video.',
  },
  {
    title: 'Variants you can steer',
    desc: 'Three variants per video, and a one-sentence edit for anything you would change. You stay the art director.',
  },
  {
    title: 'Measured, not promised',
    desc: 'We do not claim a generated thumbnail will get more clicks. Connect YouTube and Base.Tube shows your real impressions and click-through rate, so you can compare before and after.',
  },
];

export default function ThumbnailGeneratorPage() {
  return (
    <div className="v2-root">
      <div className="v2-grain" aria-hidden />
      <NavBar />

      <main style={{ paddingTop: 56 }}>

        {/* ── HERO + START ─────────────────────────────────── */}
        <section className="v2-tool-hero">
          <div className="v2-container">
            <ScrollReveal>
              <div className="v2-tool-eyebrow">
                <Link href="/tools" className="v2-tool-breadcrumb">← All tools</Link>
                <span className="v2-feature-tag blue" style={{ marginBottom: 0 }}>Live on the beta</span>
              </div>
              <h1 className="v2-cp-h1" style={{ marginTop: 20 }}>
                Generate YouTube thumbnails<br />
                <em>in your channel&apos;s style.</em>
              </h1>
              <p className="v2-cp-sub">
                AI Thumbnail Studio makes 3 thumbnail variants for each video, using your
                saved brand kit and your own face. Change anything with one sentence.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="v2-tool-input-area">
                <div className={styles.startPanel}>
                  <p className={styles.startTitle}>Open the Thumbnail Studio</p>
                  <p className={styles.startText}>
                    Paste a video link or describe the idea. The Studio opens on
                    Base.Tube, in the beta.
                  </p>
                  <div className={styles.startActions}>
                    <a
                      href={STUDIO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="v2-btn v2-btn-primary"
                      style={{ background: '#3b9eff' }}
                    >
                      Generate thumbnails →
                    </a>
                    <a href="#how-it-works" className={styles.startLink}>
                      How it works
                    </a>
                  </div>
                  <p className={styles.startNote}>
                    We do not predict click-through rate, so we do not promise a lift.
                    To see what works for your audience, connect YouTube and measure
                    your real numbers.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── HOW IT WORKS ─────────────────────────────────── */}
        <section className="v2-cp-section" id="how-it-works">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">How it works</span>
              <h2 className="v2-cp-section-h2">From a video to three thumbnails.</h2>
            </ScrollReveal>

            <div className="v2-tool-demo-layout">
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

              <ScrollReveal delay={120}>
                <StudioPreview />
              </ScrollReveal>
            </div>
          </div>
        </section>

        <Sep />

        {/* ── WHAT MAKES IT DIFFERENT ─────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">Our approach</span>
              <h2 className="v2-cp-section-h2">Built around your channel.</h2>
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

        {/* ── FAQ ─────────────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">FAQ</span>
              <h2 className="v2-cp-section-h2">Questions about the Studio.</h2>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <div className="v2-faq" style={{ maxWidth: 760 }}>
                {studioFaqs.map((item) => (
                  <details key={item.q} className="v2-faq-item">
                    <summary className="v2-faq-q">{item.q}</summary>
                    <p className="v2-faq-a">{item.a}</p>
                  </details>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── BRIDGE ───────────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <div className="v2-tool-bridge">
                <p className="v2-tool-bridge-text">
                  Not sure which thumbnails to fix first? Run the free channel audit on
                  your thumbnails and titles, then make new ones in the Studio.
                </p>
                <div className="v2-tool-bridge-links">
                  <a
                    href={STUDIO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="v2-btn v2-btn-primary"
                    style={{ background: '#3b9eff' }}
                  >
                    Generate thumbnails →
                  </a>
                  <a
                    href={AUDIT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="v2-btn v2-btn-ghost"
                  >
                    Run the free audit
                  </a>
                </div>
              </div>
              <nav className={styles.related} aria-label="Related free tools">
                <span className={styles.relatedLabel}>More free tools</span>
                <Link href="/tools">All creator tools</Link>
                <Link href="/tools/video-to-thumbnail">Video to thumbnail</Link>
                <Link href="/tools/youtube-thumbnail-resizer">Thumbnail resizer</Link>
                <Link href="/youtube-thumbnail-size">Thumbnail size guide</Link>
              </nav>
            </ScrollReveal>
          </div>
        </section>

      </main>

      <Sep />
      <Footer />
    </div>
  );
}
