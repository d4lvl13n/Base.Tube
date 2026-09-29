import Link from 'next/link';
import NavBar from '../NavBar';
import Footer from '../Footer';
import ScrollReveal from '../ScrollReveal';
import TitleCheckerTool from './TitleCheckerTool';
import styles from './TitleChecker.module.css';
import { CAPACITY_ROWS, FAQS, PAIRS, SOURCES } from './content';

const STUDIO_GENERATE = 'https://beta.base.tube/ai-thumbnails/generate';
const STUDIO_AUDIT = 'https://beta.base.tube/ai-thumbnails/audit';

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

const POINTS = [
  {
    head: 'Subject first.',
    body: 'Type your main keyword in the checker to see where it sits, and whether it survives the cut.',
  },
  {
    head: 'Extras last.',
    body: 'Text in brackets, such as (Full Course), is often the first thing to be cut. Leading tags and emoji use up characters before the topic starts.',
  },
  {
    head: 'Spend characters on words.',
    body: 'Repeated punctuation like !!! and long stretches of capitals take room without adding meaning.',
  },
];

export default function TitleCheckerPage() {
  return (
    <div className="v2-root">
      <div className="v2-grain" aria-hidden />
      <NavBar />

      <main style={{ paddingTop: 56 }}>
        {/* Hero + tool */}
        <section className="v2-tool-hero" style={{ paddingTop: 64, paddingBottom: 96 }}>
          <div className={styles.wide}>
            <ScrollReveal>
              <div className="v2-tool-eyebrow">
                <Link href="/tools" className="v2-tool-breadcrumb">
                  ← All tools
                </Link>
                <span className="v2-feature-tag orange" style={{ marginBottom: 0 }}>
                  Free · No signup · Runs in your browser
                </span>
              </div>
              <h1 className="v2-cp-h1" style={{ marginTop: 20 }}>
                YouTube title checker:
                <br />
                <em>see where your title gets cut.</em>
              </h1>
              <p className="v2-cp-sub" style={{ marginBottom: 0, maxWidth: 640 }}>
                A YouTube title can be up to 100 characters. Screens show fewer than that, so a long title loses its
                ending. Paste yours to see exactly where it is cut on the home feed, on a phone, in the sidebar and in
                search.
              </p>
            </ScrollReveal>
          </div>
          <div className={styles.wide}>
            <TitleCheckerTool />
          </div>
        </section>

        <Sep />

        {/* Length */}
        <section className="v2-cp-section">
          <div className={`${styles.wide} ${styles.split}`}>
            <ScrollReveal>
              <span className="v2-label">Title length</span>
              <h2 className="v2-cp-section-h2" style={{ marginBottom: 28 }}>
                How long can a YouTube title be?
              </h2>
              <div className={styles.prose}>
                <p>
                  <strong>100 characters.</strong> That is YouTube&apos;s own limit. Its Help Center says video titles
                  have a limit of 100 characters and cannot include invalid characters, and its developer documentation
                  names the invalid ones: the angle brackets &lt; and &gt;.
                </p>
                <p>
                  The limit is a ceiling, not a target. YouTube cuts long titles with an ellipsis, and where it cuts
                  depends on the screen. We measured YouTube&apos;s layouts on 29 September 2026. The table shows where a
                  100-character title is cut.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className={styles.tableWrap}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th scope="col">Where</th>
                      <th scope="col">Title width</th>
                      <th scope="col">Lines</th>
                      <th scope="col">Cut after (characters)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CAPACITY_ROWS.map((r) => (
                      <tr key={r.surface}>
                        <th scope="row">{r.surface}</th>
                        <td>{r.width}</td>
                        <td>{r.lines}</td>
                        <td>{r.cut}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className={styles.tableNote} style={{ marginTop: 16 }}>
                Measured on youtube.com in a 1440 px window and on a 390 px wide phone, using 183 real video titles from
                YouTube search extended to 100 characters. Capital letters and wide characters fit fewer, narrow letters
                fit more. YouTube changes its layouts, so treat these as a guide and use the checker above for your own
                title.
              </p>
              <p className={styles.sources} style={{ marginTop: 12 }}>
                Sources:{' '}
                <a href={SOURCES.helpUpload} target="_blank" rel="noopener noreferrer">
                  YouTube Help, Upload videos
                </a>
                ,{' '}
                <a href={SOURCES.helpEdit} target="_blank" rel="noopener noreferrer">
                  YouTube Help, Edit video settings
                </a>
                ,{' '}
                <a href={SOURCES.api} target="_blank" rel="noopener noreferrer">
                  YouTube Data API, Videos
                </a>
                .
              </p>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* Front-loading */}
        <section className="v2-cp-section">
          <div className={`${styles.wide} ${styles.split}`}>
            <ScrollReveal>
              <span className="v2-label">What to put first</span>
              <h2 className="v2-cp-section-h2" style={{ marginBottom: 28 }}>
                Put the words that matter first.
              </h2>
              <div className={styles.prose}>
                <p>
                  Because the end of a title is what gets cut, the start does the most work. Say what the video is about
                  in the first 40 to 50 characters, and it stays visible on every screen in the checker.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <ul className={styles.points}>
                {POINTS.map((p) => (
                  <li key={p.head} className={styles.point}>
                    <strong>{p.head}</strong> {p.body}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* Title + thumbnail */}
        <section className="v2-cp-section">
          <div className={`${styles.wide} ${styles.split}`}>
            <ScrollReveal>
              <span className="v2-label">Title and thumbnail</span>
              <h2 className="v2-cp-section-h2" style={{ marginBottom: 28 }}>
                The title and the thumbnail should say different things.
              </h2>
              <div className={styles.prose}>
                <p>
                  Viewers see them together, in one glance. If both carry the same words, the second one is wasted space.
                  A useful split: the title says what the video is. The thumbnail shows the payoff, a feeling, or a
                  detail the title leaves out.
                </p>
                <p>
                  Type the words on your thumbnail into the checker and it tells you how many repeat the title. To see
                  your thumbnail on more screens, use the{' '}
                  <Link href="/tools/youtube-thumbnail-preview">YouTube thumbnail preview</Link>.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <ul className={styles.pairs}>
                {PAIRS.map((p) => (
                  <li key={p.title} className={styles.pair}>
                    <div>
                      <span className={styles.pairLabel}>Title</span>
                      <p className={styles.pairText}>{p.title}</p>
                    </div>
                    <div>
                      <span className={styles.pairLabel}>Thumbnail</span>
                      <p className={styles.pairText}>{p.thumb}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className={styles.tableNote} style={{ marginTop: 14 }}>
                Examples of the idea, not real videos.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* Honesty + CTA */}
        <section className="v2-cp-section">
          <div className={`${styles.wide} ${styles.split}`}>
            <ScrollReveal>
              <span className="v2-label">What this checker cannot tell you</span>
              <h2 className="v2-cp-section-h2" style={{ marginBottom: 0 }}>
                It shows how a title reads. YouTube decides if it gets clicked.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="v2-tool-bridge" style={{ maxWidth: 'none' }}>
                <p className="v2-tool-bridge-text">
                  This tool does not score your title and cannot predict clicks. Nothing can, from text alone. The only
                  real test is how a title and thumbnail perform on YouTube, in your own impressions and click-through
                  rate. Base.Tube measures that for you when you connect your channel.
                </p>
                <div className="v2-tool-bridge-links">
                  <a className="v2-btn v2-btn-primary" href={STUDIO_GENERATE} target="_blank" rel="noopener noreferrer">
                    Generate a thumbnail that fits this title →
                  </a>
                  <a className="v2-btn v2-btn-ghost" href={STUDIO_AUDIT} target="_blank" rel="noopener noreferrer">
                    Free channel audit
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* FAQ */}
        <section className="v2-cp-section">
          <div className={`${styles.wide} ${styles.split}`}>
            <ScrollReveal>
              <span className="v2-label">FAQ</span>
              <h2 className="v2-cp-section-h2" style={{ marginBottom: 0 }}>
                Questions about YouTube titles.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="v2-faq">
                {FAQS.map((f) => (
                  <details key={f.q} className="v2-faq-item">
                    <summary className="v2-faq-q">{f.q}</summary>
                    <p className="v2-faq-a">{f.a}</p>
                  </details>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* Related */}
        <section className="v2-cp-section" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <div className={styles.wide}>
            <ScrollReveal>
              <span className="v2-label">More free tools</span>
              <ul className={styles.relatedList}>
                <li>
                  <Link href="/tools">All tools</Link>
                </li>
                <li>
                  <Link href="/youtube-thumbnail-size">YouTube thumbnail size</Link>
                </li>
                <li>
                  <Link href="/tools/youtube-thumbnail-resizer">Thumbnail resizer</Link>
                </li>
                <li>
                  <Link href="/tools/youtube-thumbnail-preview">Thumbnail preview</Link>
                </li>
                <li>
                  <Link href="/tools/youtube-thumbnail-tester">Thumbnail tester</Link>
                </li>
                <li>
                  <Link href="/tools/video-to-thumbnail">Video to thumbnail</Link>
                </li>
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
