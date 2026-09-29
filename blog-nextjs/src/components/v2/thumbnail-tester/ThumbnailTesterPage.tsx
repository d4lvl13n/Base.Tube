import Link from 'next/link';
import NavBar from '../NavBar';
import Footer from '../Footer';
import ScrollReveal from '../ScrollReveal';
import TesterTool from './TesterTool';
import styles from './ThumbnailTester.module.css';
import { FAQ, RELATED, STUDIO_AUDIT_URL, STUDIO_GENERATE_URL, TESTS, YT_AB_HELP_URL, YT_CHECKED } from './content';

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

/** Sections sit inside .v2-container, so drop the section's own side padding. */
const flush = { paddingLeft: 0, paddingRight: 0 } as const;

const YT_FACTS = [
  {
    name: 'What it is called',
    body: 'A/B test titles & thumbnails, in YouTube Studio. It was first released as Test & Compare, and many creators still call it that.',
  },
  {
    name: 'Where you run it',
    body: 'In YouTube Studio on a computer. Advanced features must be turned on for your channel.',
  },
  {
    name: 'What you can compare',
    body: 'Up to three titles, thumbnails, or title-and-thumbnail combinations on one video.',
  },
  {
    name: 'How it decides',
    body: 'By watch time share, not by click-through rate. YouTube says it optimises tests for overall watch time over other metrics, such as click-through rate.',
  },
  {
    name: 'How long it takes',
    body: 'A few days, and up to two weeks.',
  },
  {
    name: 'What you get back',
    body: 'One of three results: Winner, Performed same or Inconclusive.',
  },
  {
    name: 'What it does not cover',
    body: 'Shorts, scheduled live streams and Premieres, among others. YouTube Help has the full list.',
  },
  {
    name: 'Image quality',
    body: 'If any thumbnail in the test is below 1280 × 720, YouTube downscales every option to 480p.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Decide what you are testing.',
    desc: 'Change one thing between variants: the crop on the face, the words, the background colour. If all three are completely different, a win tells you which package worked but not why.',
  },
  {
    n: '02',
    title: 'Screen the variants with the tester above.',
    desc: 'Drop a variant that is unreadable when small, blends into the feed, or hides its point under the duration badge. Do that before you spend a test on it.',
  },
  {
    n: '03',
    title: 'Export at 1280 × 720 or larger.',
    desc: 'Below that, YouTube downscales the whole test to 480p.',
    link: { href: '/youtube-thumbnail-size', label: 'Thumbnail size guide' },
  },
  {
    n: '04',
    title: 'Set the test up in Studio, then leave it alone.',
    desc: 'Stopping early because one option looks ahead is the classic way to fool yourself. Let it finish.',
  },
  {
    n: '05',
    title: 'Read the result for what it is.',
    desc: 'It is based on watch time share. Performed same or Inconclusive means YouTube saw no clear difference, so choosing on taste is fair. Judge click-through rate separately, on real impressions, before and after the change.',
  },
  {
    n: '06',
    title: 'Write down what you learned.',
    desc: 'The lasting value of a test is the rule you carry to the next video, not only the winner of this one.',
  },
];

export default function ThumbnailTesterPage() {
  return (
    <div className="v2-root">
      <div className="v2-grain" aria-hidden />
      <NavBar />

      <main style={{ paddingTop: 56 }}>
        {/* ── HERO + TOOL ──────────────────────────────────── */}
        <section className="v2-tool-hero" style={{ ...flush, paddingTop: 72, paddingBottom: 88 }}>
          <div className="v2-container">
            <div className="v2-tool-eyebrow">
              <Link href="/tools" className="v2-tool-breadcrumb">
                ← All tools
              </Link>
              <span className="v2-feature-tag orange" style={{ marginBottom: 0 }}>
                Free · No sign-up · Runs in your browser
              </span>
            </div>
            <h1 className="v2-cp-h1" style={{ marginTop: 20, fontSize: 'clamp(36px, 4.8vw, 60px)' }}>
              YouTube thumbnail tester:
              <br />
              <em>compare variants before you publish.</em>
            </h1>
            <p className="v2-cp-sub" style={{ marginBottom: 0, maxWidth: 640 }}>
              Upload two or three versions of a thumbnail and one title. See them side by side at feed size, blurred, in
              grayscale, tiny and under the duration badge, with simple measured checks for each. It shows how each version
              reads. It does not predict clicks.
            </p>

            <TesterTool />
          </div>
        </section>

        <Sep />

        {/* ── THE FIVE TESTS ───────────────────────────────── */}
        <section className="v2-cp-section" style={flush}>
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">What you get</span>
              <h2 className="v2-cp-section-h2">Five ways to look at the same thumbnail.</h2>
              <p className="v2-cp-sub" style={{ marginTop: -20, marginBottom: 40 }}>
                Each view answers one question. None of them tells you which thumbnail will win. They show you where a
                variant is weak before you spend a real test on it.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <dl className={styles.dlList}>
                {TESTS.map((t) => (
                  <div className={styles.dlRow} key={t.name}>
                    <dt className={styles.dlTerm}>{t.name}</dt>
                    <dd className={styles.dlBody}>{t.body}</dd>
                  </div>
                ))}
              </dl>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── HOW TO A/B TEST ON YOUTUBE ───────────────────── */}
        <section className="v2-cp-section" style={flush}>
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">The real test</span>
              <h2 className="v2-cp-section-h2">How to A/B test thumbnails on YouTube properly.</h2>
              <div className={styles.article}>
                <p>
                  The tester above checks how a thumbnail looks and reads. To find out which version people actually
                  click, you need real viewers, and YouTube has a built-in way to get them.
                </p>
                <h3>What YouTube&apos;s own test does</h3>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={60}>
              <dl className={styles.dlList} style={{ marginTop: 24 }}>
                {YT_FACTS.map((f) => (
                  <div className={styles.dlRow} key={f.name}>
                    <dt className={styles.dlTerm}>{f.name}</dt>
                    <dd className={styles.dlBody}>{f.body}</dd>
                  </div>
                ))}
              </dl>
              <p className={styles.stamp} style={{ marginTop: 18, maxWidth: 720, lineHeight: 1.7 }}>
                Checked against YouTube Help on {YT_CHECKED}. YouTube changes this feature, so read the{' '}
                <a className={styles.inlineLink} href={YT_AB_HELP_URL} target="_blank" rel="noopener noreferrer">
                  current Help page
                </a>{' '}
                before you rely on a detail.
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <div className={styles.article} style={{ marginTop: 56 }}>
                <h3 style={{ marginTop: 0 }}>How to run a test that teaches you something</h3>
              </div>
              <div className="v2-cp-steps" style={{ marginTop: 24, maxWidth: 860 }}>
                {STEPS.map((s) => (
                  <div className="v2-cp-step" key={s.n}>
                    <div className="v2-cp-step-num">{s.n}</div>
                    <div className="v2-cp-step-body">
                      <div className="v2-cp-step-title">{s.title}</div>
                      <p className="v2-cp-step-detail">
                        {s.desc}
                        {s.link && (
                          <>
                            {' '}
                            <Link className={styles.inlineLink} href={s.link.href}>
                              {s.link.label}
                            </Link>
                            .
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── HONEST NEXT STEP ─────────────────────────────── */}
        <section className="v2-cp-section" style={flush}>
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">The honest next step</span>
              <h2 className="v2-cp-section-h2">Now let real viewers decide.</h2>
              <div className={styles.next}>
                <p>
                  This page cannot tell you which thumbnail gets clicked. That depends on your audience, your title and
                  what else is in their feed. Two things can: YouTube&apos;s own A/B test, and your real click-through
                  rate (CTR), which is the share of people who saw a thumbnail and clicked it.
                </p>
                <p>
                  Connect your channel and Base.Tube&apos;s free audit shows real impressions and CTR for your videos,
                  including how CTR changed before and after you swapped a thumbnail. Need more versions to test? Generate
                  them in the Studio.
                </p>
                <div className={styles.nextActions}>
                  <a className="v2-btn v2-btn-primary" href={STUDIO_AUDIT_URL} target="_blank" rel="noopener noreferrer">
                    Run the free channel audit →
                  </a>
                  <a className="v2-btn v2-btn-ghost" href={STUDIO_GENERATE_URL}>
                    Generate more variants
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className="v2-cp-section" style={flush}>
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">Questions</span>
              <h2 className="v2-cp-section-h2">YouTube thumbnail testing, answered.</h2>
            </ScrollReveal>
            <ScrollReveal delay={60}>
              <div className="v2-faq" style={{ maxWidth: 860 }}>
                {FAQ.map((f) => (
                  <details className="v2-faq-item" key={f.q}>
                    <summary className="v2-faq-q">{f.q}</summary>
                    <div className="v2-faq-a">
                      {f.a}
                      {f.link &&
                        (f.link.external ? (
                          <a
                            className={`${styles.inlineLink} ${styles.faqLink}`}
                            href={f.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'block' }}
                          >
                            {f.link.label} →
                          </a>
                        ) : (
                          <Link className={`${styles.inlineLink} ${styles.faqLink}`} href={f.link.href} style={{ display: 'block' }}>
                            {f.link.label} →
                          </Link>
                        ))}
                    </div>
                  </details>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── RELATED TOOLS ────────────────────────────────── */}
        <section className="v2-cp-section" style={{ ...flush, paddingBottom: 120 }}>
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">More free tools</span>
              <h2 className="v2-cp-section-h2">Keep going.</h2>
              <ul className={styles.related}>
                {RELATED.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className={styles.relatedLink}>
                      <span className={styles.relatedName}>{r.name}</span>
                      <span className={styles.relatedDesc}>{r.desc}</span>
                      <span className={styles.relatedArrow} aria-hidden>
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Sep />
      <Footer />
    </div>
  );
}
