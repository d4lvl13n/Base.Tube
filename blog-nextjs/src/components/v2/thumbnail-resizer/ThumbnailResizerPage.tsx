import Link from 'next/link';
import NavBar from '../NavBar';
import Footer from '../Footer';
import ScrollReveal from '../ScrollReveal';
import ResizerTool from './ResizerTool';
import { SPEC_CHECKED, faqs, steps } from './content';
import styles from './ThumbnailResizer.module.css';

const STUDIO_GENERATE = '/ai-thumbnails';
const STUDIO_AUDIT = '/youtube-channel-audit';

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

export default function ThumbnailResizerPage() {
  return (
    <div className="v2-root">
      <div className="v2-grain" aria-hidden />
      <NavBar />

      <main style={{ paddingTop: 56 }}>
        {/* ── HERO + TOOL ──────────────────────────────────── */}
        <section className={`v2-tool-hero ${styles.hero}`}>
          <div className="v2-container">
            <ScrollReveal>
              <div className="v2-tool-eyebrow">
                <Link href="/tools" className="v2-tool-breadcrumb">← All tools</Link>
                <span className="v2-feature-tag orange" style={{ marginBottom: 0 }}>Free · No signup</span>
              </div>
              <h1 className="v2-cp-h1">
                YouTube thumbnail resizer
                <br />
                <em>Ready to upload.</em>
              </h1>
              <p className="v2-cp-sub">
                Crop or fit any image to 16:9, then download a JPG or PNG that fits YouTube&apos;s upload limit.
              </p>
              <p className={styles.specLine}>
                <span>16:9</span>
                <span>3840 × 2160 recommended, 640 px minimum width</span>
                <span>JPG or PNG</span>
                <span>Up to 2 MB from the mobile app, 50 MB from a computer</span>
                <span>
                  <Link href="/youtube-thumbnail-size">Full size guide</Link>
                </span>
              </p>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <ResizerTool />
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── HOW TO ───────────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">How to</span>
              <h2 className="v2-cp-section-h2">Resize an image for YouTube in three steps.</h2>
            </ScrollReveal>
            <div className="v2-cp-steps" style={{ maxWidth: 760 }}>
              {steps.map((s, i) => (
                <ScrollReveal key={s.n} delay={i * 80}>
                  <div className="v2-cp-step">
                    <div className="v2-cp-step-num">{s.n}</div>
                    <div className="v2-cp-step-body">
                      <h3 className="v2-cp-step-title">{s.title}</h3>
                      <p className="v2-cp-step-detail">{s.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <Sep />

        {/* ── WHY 1280×720 ─────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">Why 1280 × 720</span>
              <h2 className="v2-cp-section-h2">The size most creators still export.</h2>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <div className={styles.prose}>
                <p>
                  A YouTube thumbnail is a <strong>16:9</strong> image. 1280 × 720 pixels is 16:9, it is well
                  above the 640 px minimum width YouTube asks for, and the file stays small.
                </p>
                <p>
                  YouTube&apos;s own help page now recommends the largest size you can make, which is{' '}
                  <strong>3840 × 2160</strong> pixels for videos. Bigger images make bigger files, and there is a
                  cap: thumbnails uploaded from the mobile app can be up to <strong>2 MB</strong>, and from a
                  computer up to <strong>50 MB</strong>. A large photo saved at 3840 × 2160 can pass 2 MB. At 1280 × 720
                  it usually does not. That is why 1280 × 720 is the default here, and why 1920 × 1080 and
                  3840 × 2160 are one click away if you upload from a computer and want the most detail.
                </p>
                <p>
                  Whatever size you pick, viewers see the thumbnail small. The previews under the tool show yours at
                  a few of the sizes YouTube uses, so you can tell whether the text still reads.
                </p>
                <p>
                  For every size, including Shorts, see the{' '}
                  <Link href="/youtube-thumbnail-size">YouTube thumbnail size guide</Link>.
                </p>
                <p className={styles.checked}>Numbers checked against YouTube Help in {SPEC_CHECKED}.</p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">Questions</span>
              <h2 className="v2-cp-section-h2">YouTube thumbnail resizer, answered.</h2>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <div className="v2-faq" style={{ maxWidth: 760 }}>
                {faqs.map((f) => (
                  <details key={f.q} className="v2-faq-item">
                    <summary className="v2-faq-q">{f.q}</summary>
                    <div className="v2-faq-a">
                      {f.a}
                      {f.link && (
                        <>
                          <br />
                          <Link href={f.link.href} className={`${styles.inlineLink} ${styles.faqLink}`}>
                            {f.link.label}
                          </Link>
                        </>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── STUDIO CTA ───────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <div className={styles.cta}>
                <h2 className={styles.ctaH}>Want a better thumbnail, not just a resized one?</h2>
                <p className={styles.ctaText}>
                  Resizing fixes the shape. It does not decide whether people click. The only real test is how a
                  thumbnail performs on YouTube. Base.Tube&apos;s Studio makes new thumbnails in your channel&apos;s
                  style, and the free channel audit shows real impressions and click-through rate once you connect
                  your channel.
                </p>
                <div className={styles.ctaActions}>
                  <a href={STUDIO_GENERATE} className="v2-btn v2-btn-primary">
                    Make thumbnails in Studio →
                  </a>
                  <a href={STUDIO_AUDIT} className="v2-btn v2-btn-ghost">
                    Run the free channel audit
                  </a>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <nav className={styles.related} aria-label="More free thumbnail tools" style={{ marginTop: 36 }}>
                <Link href="/tools">All free tools</Link>
                <Link href="/youtube-thumbnail-size">Thumbnail size guide</Link>
                <Link href="/tools/youtube-thumbnail-preview">Thumbnail preview</Link>
                <Link href="/tools/youtube-thumbnail-tester">Thumbnail tester</Link>
                <Link href="/tools/youtube-title-checker">Title checker</Link>
                <Link href="/tools/video-to-thumbnail">Video to thumbnail</Link>
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
