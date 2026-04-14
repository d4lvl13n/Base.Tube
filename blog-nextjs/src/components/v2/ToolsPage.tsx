import Image from 'next/image';
import NavBar from './NavBar';
import Footer from './Footer';
import ScrollReveal from './ScrollReveal';
import Link from 'next/link';
import GeneratorDemo from './GeneratorDemo';
import AuditDemo from './AuditDemo';

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

export default function ToolsPage() {
  return (
    <div className="v2-root">
      <div className="v2-grain" aria-hidden />
      <NavBar />

      <main style={{ paddingTop: 56 }}>

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="v2-tools-hero">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">Creator Toolkit</span>
              <h1 className="v2-cp-h1">
                Your thumbnail is your&nbsp;pitch.<br />
                <em>Make it count.</em>
              </h1>
              <p className="v2-cp-sub" style={{ maxWidth: 540 }}>
                Every video you publish gets one chance to earn a click.
                One image, 1.2 seconds of attention. These tools exist
                so you never waste that moment again.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── CTR OPTIMIZER ────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <div className="v2-tools-showcase">
              <div className="v2-tools-showcase-copy">
                <ScrollReveal>
                  <span className="v2-feature-tag orange" style={{ marginBottom: 12 }}>CTR Optimizer</span>
                  <h2 className="v2-cp-section-h2">
                    Know exactly why<br />they&apos;re not clicking.
                  </h2>
                  <p className="v2-tools-showcase-desc">
                    Upload any thumbnail. In seconds, you&apos;ll know what&apos;s working,
                    what&apos;s not, and exactly what to change — scored against 300k+
                    real thumbnails with real performance data.
                  </p>
                  <p className="v2-tools-showcase-desc" style={{ marginTop: 12 }}>
                    Not a vague score. A specific breakdown: face size, text
                    legibility, contrast, composition. The things that decide
                    whether your video gets watched or scrolled past.
                  </p>
                  <div className="v2-tools-showcase-meta">
                    <span className="v2-tools-showcase-free">Free — no account needed</span>
                  </div>
                  <a
                    href="https://beta.base.tube/ai-thumbnails/audit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="v2-btn v2-btn-primary"
                    style={{ marginTop: 24 }}
                  >
                    Score my thumbnail →
                  </a>
                </ScrollReveal>
              </div>
              <ScrollReveal delay={150}>
                <div className="v2-tools-showcase-visual v2-tools-showcase-visual--anim">
                  <AuditDemo />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <Sep />

        {/* ── THUMBNAIL GENERATOR ──────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <div className="v2-tools-showcase v2-tools-showcase--reverse">
              <div className="v2-tools-showcase-copy">
                <ScrollReveal>
                  <span className="v2-feature-tag blue" style={{ marginBottom: 12 }}>Thumbnail Generator</span>
                  <h2 className="v2-cp-section-h2">
                    Describe your video.<br />Get thumbnails that convert.
                  </h2>
                  <p className="v2-tools-showcase-desc">
                    Type what your video is about. Get 4 AI-generated variants in
                    seconds — each using a different composition strategy, each ranked
                    by projected CTR. Pick the one that&apos;ll actually get watched.
                  </p>
                  <p className="v2-tools-showcase-desc" style={{ marginTop: 12 }}>
                    Not pretty pictures. Click-optimized images trained on what
                    performs on YouTube — not what looks good on a design portfolio.
                  </p>
                  <div className="v2-tools-showcase-meta">
                    <span className="v2-tools-showcase-free">3 free generations per day</span>
                  </div>
                  <a
                    href="https://beta.base.tube/ai-thumbnails/generate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="v2-btn v2-btn-primary"
                    style={{ marginTop: 24, background: '#3b9eff' }}
                  >
                    Generate thumbnails →
                  </a>
                </ScrollReveal>
              </div>
              <ScrollReveal delay={150}>
                <div className="v2-tools-showcase-visual v2-tools-showcase-visual--anim">
                  <GeneratorDemo />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <Sep />

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="v2-cta">
          <div className="v2-cta-glow" aria-hidden />
          <div className="v2-container">
            <ScrollReveal>
              <div className="v2-cta-content">
                <h2>
                  The best creators don&apos;t guess.<br />
                  <em>They test.</em>
                </h2>
                <p>
                  Score a thumbnail in 3 seconds. Generate a better one in 10.
                  Both free, both live right now.
                </p>
                <div className="v2-cta-actions">
                  <a
                    href="https://beta.base.tube/ai-thumbnails/audit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="v2-btn v2-btn-primary"
                  >
                    Score a thumbnail →
                  </a>
                  <a
                    href="https://beta.base.tube/ai-thumbnails/generate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="v2-btn v2-btn-ghost"
                  >
                    Generate thumbnails →
                  </a>
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
