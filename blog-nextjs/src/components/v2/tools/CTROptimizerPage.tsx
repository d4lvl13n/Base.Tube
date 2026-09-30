// Route stays /tools/ctr-optimizer (existing URL equity). The page is now an honest
// "in development" page for Base.Tube's own CTR AI, with a "Get notified" form.
// The free channel audit lives at /youtube-channel-audit.
//
// Only state what is true: the model is being built, trained on 500k+ public
// YouTube thumbnail assets, tested on channels it has never seen, and not released
// because it is not accurate enough to trust. No accuracy numbers, no dates, no
// promised CTR lift, and no before/after measurement claim.

import Link from 'next/link';
import NavBar from '../NavBar';
import Footer from '../Footer';
import ScrollReveal from '../ScrollReveal';
import CtrWaitlistForm from './CtrWaitlistForm';
import styles from './ctrWaitlist.module.css';

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

const status = [
  {
    title: 'Trained on 500k+ thumbnail assets',
    desc: 'Our own AI model has learned from 500k+ public YouTube thumbnail assets.',
  },
  {
    title: 'Tested on channels it has never seen',
    desc: 'We test the model against channels it has never seen.',
  },
  {
    title: 'Not released yet',
    desc: 'It is not accurate enough to trust. Base.Tube will not ship a click-rate predictor that guesses. It will be released when it is good enough to be useful.',
  },
];

const today = [
  {
    title: 'Free channel audit',
    desc: "Run a free audit of your YouTube channel's thumbnails and titles.",
    href: '/youtube-channel-audit',
    cta: 'Run the free audit →',
  },
  {
    title: 'AI Thumbnails',
    desc: "Make YouTube thumbnails in your channel's saved style.",
    href: '/ai-thumbnails',
    cta: 'See AI Thumbnails →',
  },
  {
    title: 'Free tools',
    desc: 'Free tools for YouTube creators, like the thumbnail tester and the title checker.',
    href: '/tools',
    cta: 'See all tools →',
  },
];

// Shown in the page and sent as FAQPage structured data (see page.tsx), so keep them identical.
export const ctrFaqs: { q: string; a: string }[] = [
  {
    q: 'What is the Base.Tube CTR AI?',
    a: 'It is an AI model that Base.Tube is building to analyze YouTube thumbnails and click-through rate (CTR), the share of people who click a video after they see its thumbnail. It is in development and not released yet.',
  },
  {
    q: 'Can I use it today?',
    a: 'No. It is not released yet, because it is not accurate enough to trust.',
  },
  {
    q: 'When will it launch?',
    a: 'We are not giving a date. We will release it when it is good enough to be useful. Leave your email on this page and we will tell you when it launches.',
  },
  {
    q: 'What is it trained on?',
    a: 'Our own AI model is trained on 500k+ public YouTube thumbnail assets. We test it against channels it has never seen.',
  },
  {
    q: 'Why not release it now?',
    a: 'It is not accurate enough to trust yet, and Base.Tube will not ship a click-rate predictor that guesses. We will release it when it is good enough to be useful.',
  },
  {
    q: 'What can I use in the meantime?',
    a: 'You can run the free channel audit, make thumbnails with AI Thumbnails, or use the free tools for YouTube creators. They are all linked on this page.',
  },
  {
    q: 'What happens to my email?',
    a: "We'll only email you when it launches.",
  },
];

export default function CTROptimizerPage() {
  return (
    <div className="v2-root">
      <div className="v2-grain" aria-hidden />
      <NavBar />

      <main style={{ paddingTop: 56 }}>

        {/* ── HERO + GET NOTIFIED ──────────────────────────── */}
        <section className="v2-tool-hero">
          <div className="v2-container">
            <ScrollReveal>
              <div className="v2-tool-eyebrow">
                <Link href="/tools" className="v2-tool-breadcrumb">← All tools</Link>
                <span className="v2-feature-tag orange" style={{ marginBottom: 0 }}>In development</span>
              </div>
              <h1 className="v2-cp-h1" style={{ marginTop: 20 }}>
                Our own CTR AI<br />
                <em>is in development.</em>
              </h1>
              <p className="v2-cp-sub">
                Base.Tube is building its own AI model to analyze YouTube thumbnails
                and click-through rate. It is not released yet. Leave your email and
                we will tell you when it launches.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="v2-tool-input-area">
                <CtrWaitlistForm />
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── WHERE IT STANDS ──────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">Where it stands</span>
              <h2 className="v2-cp-section-h2">What exists today, and why it is not out yet.</h2>
            </ScrollReveal>
            <div className={styles.statusGrid}>
              {status.map((d, i) => (
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

        {/* ── WHAT YOU CAN USE TODAY ───────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">In the meantime</span>
              <h2 className="v2-cp-section-h2">What you can use today.</h2>
            </ScrollReveal>
            <div className={styles.todayGrid}>
              {today.map((t, i) => (
                <ScrollReveal key={t.title} delay={i * 80}>
                  <Link href={t.href} className={styles.todayCard}>
                    <h3 className={styles.todayTitle}>{t.title}</h3>
                    <p className={styles.todayDesc}>{t.desc}</p>
                    <span className={styles.todayCta}>{t.cta}</span>
                  </Link>
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
              <h2 className="v2-cp-section-h2">Questions about the CTR AI.</h2>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <div className="v2-faq" style={{ maxWidth: 760 }}>
                {ctrFaqs.map((item) => (
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
                  Want to know when the CTR AI is ready? Leave your email at the top of
                  this page. We&apos;ll only email you when it launches.
                </p>
                <div className="v2-tool-bridge-links">
                  <a href="#get-notified" className="v2-btn v2-btn-primary">
                    Get notified ↑
                  </a>
                  <Link href="/youtube-channel-audit" className="v2-btn v2-btn-ghost">
                    Run the free audit
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
