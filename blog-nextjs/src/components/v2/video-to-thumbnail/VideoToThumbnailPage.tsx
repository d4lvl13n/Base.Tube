'use client';

import Link from 'next/link';
import NavBar from '../NavBar';
import Footer from '../Footer';
import ScrollReveal from '../ScrollReveal';
import FrameGrabber from './FrameGrabber';
import s from './video-to-thumbnail.module.css';
import {
  CRITERIA,
  DESIGN_WHEN,
  FAQS,
  REAL_FRAME_WHEN,
  RELATED_LINKS,
  STEPS,
  STUDIO_AUDIT_URL,
  STUDIO_GENERATE_URL,
} from './content';

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

export default function VideoToThumbnailPage() {
  return (
    <div className="v2-root">
      <div className="v2-grain" aria-hidden />
      <NavBar />

      <main style={{ paddingTop: 56 }}>
        {/* ── HERO + TOOL ──────────────────────────────────── */}
        <section className={`v2-tool-hero ${s.hero}`}>
          <div className="v2-container">
            <ScrollReveal>
              <div className="v2-tool-eyebrow">
                <Link href="/tools" className="v2-tool-breadcrumb">← All tools</Link>
                <span className="v2-feature-tag orange" style={{ marginBottom: 0 }}>Free · No signup · Nothing uploaded</span>
              </div>
              <h1 className="v2-cp-h1" style={{ marginTop: 20 }}>
                Video to thumbnail:<br />
                <em>pick the perfect frame.</em>
              </h1>
              <p className={`v2-cp-sub ${s.sub}`}>
                Open a video from your computer, step to the moment that works, and export it as a
                1280×720 thumbnail. The file never leaves your device.
              </p>
              <p className={s.shortAnswer}>
                <strong>Short answer:</strong> open the file, pause on the frame you want, press
                Capture, then download it as a JPG or PNG. That is how you extract a frame from a
                video in a few seconds.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="v2-tool-input-area" style={{ marginTop: 0 }}>
                <FrameGrabber />
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── HOW IT WORKS ─────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">How it works</span>
              <h2 className="v2-cp-section-h2">From video to thumbnail in three steps.</h2>
            </ScrollReveal>
            <div className="v2-cp-steps" style={{ maxWidth: 860 }}>
              {STEPS.map((step, i) => (
                <ScrollReveal key={step.n} delay={i * 80}>
                  <div className="v2-cp-step">
                    <div className="v2-cp-step-num">{step.n}</div>
                    <div className="v2-cp-step-body">
                      <h3 className="v2-cp-step-title">{step.title}</h3>
                      <p className="v2-cp-step-detail">{step.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <Sep />

        {/* ── REAL FRAME VS STOCK ──────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">Real frame or stock image</span>
              <h2 className="v2-cp-section-h2">Why a real frame usually beats a stock image.</h2>
              <div className="v2-cp-prose" style={{ marginBottom: 40 }}>
                <p>
                  A frame from your own video shows what viewers will actually get. The face, the room,
                  the colours and the light all match the video, so the thumbnail makes a promise the
                  video keeps. It is also free, there is no licence to check, and it takes a minute.
                </p>
                <p>
                  A stock photo cannot do that. It shows a generic person in a generic room, not your
                  video. And you already own the best candidates: every frame of the footage you shot.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <div className={s.compare}>
                <div className={s.compareCol}>
                  <h3 className={s.compareTitle}>A real frame works when</h3>
                  <ul className={s.compareList}>
                    {REAL_FRAME_WHEN.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div className={s.compareCol}>
                  <h3 className={`${s.compareTitle} ${s.compareTitleAlt}`}>Build a designed thumbnail when</h3>
                  <ul className={s.compareList}>
                    {DESIGN_WHEN.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className={s.honest}>
                <strong>One honest limit.</strong> No tool, this one included, can tell you which frame
                will get more clicks. Only a real test on YouTube can. Base.Tube measures that for you
                when you connect your channel.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── HOW TO PICK ──────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">Choosing the frame</span>
              <h2 className="v2-cp-section-h2">How to pick a frame that works as a thumbnail.</h2>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <ul className={s.criteria}>
                {CRITERIA.map((c) => (
                  <li key={c.label} className={s.criteriaRow}>
                    <h3 className={s.criteriaLabel}>{c.label}</h3>
                    <p className={s.criteriaText}>{c.text}</p>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── BEFORE YOU UPLOAD ────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">Before you upload</span>
              <h2 className="v2-cp-section-h2">Check the frame before it goes live.</h2>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <ul className={s.related}>
                {RELATED_LINKS.map((l) => (
                  <li key={l.href} className={s.relatedItem}>
                    <Link href={l.href}>
                      <span className={s.relatedLabel}>{l.label}</span>
                      <span className={s.relatedDesc}>{l.desc}</span>
                      <span className={s.relatedArrow} aria-hidden>→</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className={s.relatedAll}>
                <Link href="/tools" className={s.inlineLink}>See all free tools</Link>
              </p>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">FAQ</span>
              <h2 className="v2-cp-section-h2">Questions about video to thumbnail.</h2>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <div className={s.faqWrap}>
                <div className="v2-faq">
                  {FAQS.map((item) => (
                    <details key={item.q} className="v2-faq-item">
                      <summary className="v2-faq-q">{item.q}</summary>
                      <p className="v2-faq-a">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── CTA → STUDIO ─────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">Next step</span>
              <h2 className="v2-cp-section-h2">Turn the frame into a finished thumbnail.</h2>
              <div className="v2-tool-bridge">
                <p className={s.ctaLead}>
                  A raw frame is a starting point. In the Base.Tube Studio you add the text, try
                  variations, and keep the ones you like. Download your frame here, then bring it there.
                </p>
                <p className={s.ctaLead}>
                  Connect your YouTube channel and Base.Tube also shows your real impressions and
                  click-through rate (CTR), the share of people who click after they see a thumbnail.
                  <strong> That is how you find out what works on your own audience.</strong>
                </p>
                <div className={s.ctaLinks}>
                  <a href={STUDIO_GENERATE_URL} className="v2-btn v2-btn-primary">
                    Make it in the Studio →
                  </a>
                  <a href={STUDIO_AUDIT_URL} className="v2-btn v2-btn-ghost">
                    Free channel audit
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
