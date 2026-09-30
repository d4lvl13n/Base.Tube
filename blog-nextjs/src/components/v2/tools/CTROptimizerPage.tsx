'use client';

// Route stays /tools/ctr-optimizer (existing URL equity). The positioning is now
// "YouTube thumbnail & channel audit": a written critique plus, once YouTube is
// connected, the creator's real impressions and click-through rate. No CTR score.

import Link from 'next/link';
import NavBar from '../NavBar';
import Footer from '../Footer';
import ScrollReveal from '../ScrollReveal';
import AuditPreview from '../studio-audit/AuditPreview';
import { AUDIT_URL, auditFaqs } from '../studio-audit/content';
import styles from '../studio-audit/visuals.module.css';

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

const howSteps = [
  {
    n: '01',
    title: 'Run the free audit',
    desc: 'Start the audit on Base.Tube. It looks at how your thumbnails and titles work together, the packaging a viewer sees before they click.',
  },
  {
    n: '02',
    title: 'Read the critique',
    desc: 'You get a written review: what is clear, what is confusing, what repeats. Each point is tied to evidence from your own videos, not to a number out of 100.',
  },
  {
    n: '03',
    title: 'Connect YouTube for real numbers',
    desc: 'The audit adds each video’s real impressions and click-through rate, straight from YouTube.',
  },
];

const differentiators = [
  {
    title: 'Evidence, not a score',
    desc: 'Every point in the audit is tied to something you can see in your own thumbnails and titles: a face that is small on a phone, a title that repeats the image. You decide what to change.',
  },
  {
    title: 'Your real numbers, when you connect YouTube',
    desc: 'Connect your channel and Base.Tube shows your real impressions and real click-through rate. That is what lets you measure a change instead of guessing.',
  },
  {
    title: 'No predicted CTR, on purpose',
    desc: 'A predicted click-through rate is a guess, so we do not sell one. Our own model, trained on 500k+ thumbnail assets, is R&D. It is not a promise of results.',
  },
];

export default function CTROptimizerPage() {
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
                <span className="v2-feature-tag orange" style={{ marginBottom: 0 }}>Free · Channel audit</span>
              </div>
              <h1 className="v2-cp-h1" style={{ marginTop: 20 }}>
                Free YouTube thumbnail<br />
                <em>&amp; channel audit.</em>
              </h1>
              <p className="v2-cp-sub">
                See how your thumbnails and titles read to a viewer, with a written
                critique based on evidence from your own videos. Connect YouTube to
                see your real impressions and click-through rate, so you can measure
                every change.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="v2-tool-input-area">
                <div className={styles.startPanel}>
                  <p className={styles.startTitle}>Get your free channel audit</p>
                  <p className={styles.startText}>
                    A written review of your thumbnails and titles. You read it on
                    Base.Tube, in the beta.
                  </p>
                  <div className={styles.startActions}>
                    <a
                      href={AUDIT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="v2-btn v2-btn-primary"
                    >
                      Run the free audit →
                    </a>
                    <a href="#how-it-works" className={styles.startLink}>
                      How the audit works
                    </a>
                  </div>
                  <p className={styles.startNote}>
                    There is no CTR score. A predicted score is a guess. Your real
                    click-through rate, once YouTube is connected, is the only real test.
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
              <h2 className="v2-cp-section-h2">The audit in three steps.</h2>
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
                <AuditPreview />
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
              <h2 className="v2-cp-section-h2">Evidence and real numbers, not a guess.</h2>
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

        {/* ── FAQ ─────────────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">FAQ</span>
              <h2 className="v2-cp-section-h2">Questions about the audit.</h2>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <div className="v2-faq" style={{ maxWidth: 760 }}>
                {auditFaqs.map((item) => (
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

        {/* ── BRIDGE ──────────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <div className="v2-tool-bridge">
                <p className="v2-tool-bridge-text">
                  Audit first. When a thumbnail needs work, the AI Thumbnail Studio
                  makes new ones in your channel&apos;s saved style: your brand kit and
                  your face. Connect YouTube and the audit shows each video&apos;s real numbers.
                </p>
                <div className="v2-tool-bridge-links">
                  <a
                    href={AUDIT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="v2-btn v2-btn-primary"
                  >
                    Run the free audit →
                  </a>
                  <Link href="/ai-thumbnails" className="v2-btn v2-btn-ghost">
                    See AI Thumbnails
                  </Link>
                </div>
              </div>
              <nav className={styles.related} aria-label="Related free tools">
                <span className={styles.relatedLabel}>More free tools</span>
                <Link href="/tools">All creator tools</Link>
                <Link href="/tools/youtube-thumbnail-tester">Thumbnail tester</Link>
                <Link href="/tools/youtube-title-checker">Title checker</Link>
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
