import NavBar from './NavBar';
import Footer from './Footer';
import ScrollReveal from './ScrollReveal';
import AuditPreview from './studio-audit/AuditPreview';
import StudioPreview from './studio-audit/StudioPreview';
import { AUDIT_URL, STUDIO_URL } from './studio-audit/content';

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
                Every video you publish gets one chance to earn a click. These tools
                help you make a stronger thumbnail and title. Connect YouTube, and you
                can see in your own numbers whether a change worked.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── CHANNEL AUDIT ────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <div className="v2-tools-showcase">
              <div className="v2-tools-showcase-copy">
                <ScrollReveal>
                  <span className="v2-feature-tag orange" style={{ marginBottom: 12 }}>Channel Audit</span>
                  <h2 className="v2-cp-section-h2">
                    See how your thumbnails<br />and titles read.
                  </h2>
                  <p className="v2-tools-showcase-desc">
                    Run a free audit of your channel&apos;s packaging: your thumbnails and
                    titles, together. You get a written critique tied to evidence in your
                    own videos, not a number out of 100.
                  </p>
                  <p className="v2-tools-showcase-desc" style={{ marginTop: 12 }}>
                    Connect YouTube and the audit also shows your real impressions and
                    real click-through rate. Change a thumbnail, then check the result
                    in your own data.
                  </p>
                  <div className="v2-tools-showcase-meta">
                    <span className="v2-tools-showcase-free">Free channel audit</span>
                  </div>
                  <a
                    href={AUDIT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="v2-btn v2-btn-primary"
                    style={{ marginTop: 24 }}
                  >
                    Run the free audit →
                  </a>
                </ScrollReveal>
              </div>
              <ScrollReveal delay={150}>
                <div className="v2-tools-showcase-visual v2-tools-showcase-visual--anim">
                  <AuditPreview />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <Sep />

        {/* ── AI THUMBNAIL STUDIO ──────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <div className="v2-tools-showcase v2-tools-showcase--reverse">
              <div className="v2-tools-showcase-copy">
                <ScrollReveal>
                  <span className="v2-feature-tag blue" style={{ marginBottom: 12 }}>AI Thumbnail Studio</span>
                  <h2 className="v2-cp-section-h2">
                    Thumbnails in<br />your channel&apos;s style.
                  </h2>
                  <p className="v2-tools-showcase-desc">
                    Paste a video link or describe the idea. The Studio makes 3
                    thumbnail variants for that video, using your saved brand kit and
                    your own face.
                  </p>
                  <p className="v2-tools-showcase-desc" style={{ marginTop: 12 }}>
                    Not quite right? Change it with one sentence, like &ldquo;warmer
                    light, more steam.&rdquo; You stay in control of the final image.
                  </p>
                  <div className="v2-tools-showcase-meta">
                    <span className="v2-tools-showcase-free">Live on the Base.Tube beta</span>
                  </div>
                  <a
                    href={STUDIO_URL}
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
                  <StudioPreview />
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
                  <em>They measure.</em>
                </h2>
                <p>
                  Audit your thumbnails and titles for free. Make new thumbnails in your
                  own style. Connect YouTube to see your real click-through rate before
                  and after every change.
                </p>
                <div className="v2-cta-actions">
                  <a
                    href={AUDIT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="v2-btn v2-btn-primary"
                  >
                    Run the free audit →
                  </a>
                  <a
                    href={STUDIO_URL}
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
