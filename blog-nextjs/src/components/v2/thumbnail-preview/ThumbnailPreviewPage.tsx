import Link from 'next/link';
import NavBar from '../NavBar';
import Footer from '../Footer';
import ScrollReveal from '../ScrollReveal';
import PreviewTool from './PreviewTool';
import { FAQ } from './faq';
import s from './thumbnail-preview.module.css';

const STUDIO_AUDIT = '/youtube-channel-audit';
const STUDIO_GENERATE = '/ai-thumbnails';

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

const checks = [
  {
    n: '01',
    title: 'Contrast with the neighbours',
    desc: 'Squint at the feed. If your thumbnail has the same colours and brightness as the videos around it, it is easy to scroll past. Press Shuffle position to try other neighbours, and switch between light and dark mode. A dark thumbnail can disappear on a dark page.',
  },
  {
    n: '02',
    title: 'Text you can read at small size',
    desc: 'Open the Up next view, where thumbnails are smallest. If you cannot read the words there, use fewer of them and make them larger. Short words survive shrinking; long phrases do not.',
  },
  {
    n: '03',
    title: 'A face that still shows emotion',
    desc: 'A clear face gives viewers something to react to. Check that the expression still reads at small size, and on the mobile feed, where the thumbnail is wide but the screen is small.',
  },
  {
    n: '04',
    title: 'The length badge in the bottom-right corner',
    desc: 'YouTube draws the video length over that corner. Keep text, faces and logos out of it. Turn the Length badge switch on and off to see what it hides.',
  },
  {
    n: '05',
    title: 'Title and thumbnail as one message',
    desc: 'The title is cut off after two lines in most views. Put the important words first, and make the title add something the thumbnail does not already say.',
  },
];

const related = [
  { href: '/youtube-thumbnail-size', name: 'YouTube thumbnail size', note: 'Exact dimensions and file limits' },
  { href: '/tools/youtube-thumbnail-resizer', name: 'Thumbnail resizer', note: 'Fit any image to the right size' },
  { href: '/tools/youtube-thumbnail-tester', name: 'Thumbnail tester', note: 'Compare versions side by side' },
  { href: '/tools/youtube-title-checker', name: 'Title checker', note: 'See where a title gets cut off' },
  { href: '/tools/video-to-thumbnail', name: 'Video to thumbnail', note: 'Pick a frame from your video' },
  { href: '/tools', name: 'All Base.Tube tools', note: 'Free, no signup' },
];

export default function ThumbnailPreviewPage() {
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
                <span className="v2-feature-tag orange" style={{ marginBottom: 0 }}>Free · No signup</span>
              </div>
              <h1 className={`v2-cp-h1 ${s.h1}`}>
                YouTube thumbnail preview<br />
                <em>as viewers will see it.</em>
              </h1>
              <p className={`v2-cp-sub ${s.lede}`}>
                Add your thumbnail and title. See them in the YouTube home feed, in search results, in
                the up-next list and on a phone, in light and dark mode, next to other videos. Your
                images never leave your device.
              </p>
            </ScrollReveal>
          </div>
          <PreviewTool />
        </section>

        <Sep />

        {/* ── WHY IN CONTEXT ───────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">Why preview in context</span>
              <h2 className="v2-cp-section-h2">A thumbnail never appears alone.</h2>
              <div className={s.prose}>
                <p>
                  In your editor, the thumbnail fills the screen. On YouTube it is a small rectangle in
                  a grid of other videos, about 168 pixels wide in the up-next list, beside a title
                  that is cut off after two lines.
                </p>
                <p>
                  Viewers compare it with the thumbnails around it. So the useful question is not
                  &ldquo;does it look good?&rdquo; but{' '}
                  <strong>&ldquo;does it stand out from what sits next to it?&rdquo;</strong>
                </p>
                <p>
                  This tool puts your thumbnail and title into recreations of the places viewers meet
                  them. Paste the links of videos you compete with, and they appear around yours.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── WHAT TO LOOK FOR ─────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">What to look for</span>
              <h2 className="v2-cp-section-h2">Five checks to run on your preview.</h2>
            </ScrollReveal>
            <ScrollReveal>
              <div className="v2-cp-steps">
                {checks.map((c) => (
                  <div key={c.n} className="v2-cp-step">
                    <div className="v2-cp-step-num">{c.n}</div>
                    <div className="v2-cp-step-body">
                      <h3 className="v2-cp-step-title">{c.title}</h3>
                      <p className="v2-cp-step-detail">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── HONEST NOTE + CTA ────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <div className={s.cta}>
                <h3>A preview shows how it looks, not how it performs.</h3>
                <p>
                  Two thumbnails can look equally good here and still get different click-through
                  rates (CTR: the share of people who click after seeing your video). This tool does
                  not predict CTR. The only real test is YouTube itself.
                </p>
                <p>
                  Connect your channel to Base.Tube and see your real impressions and CTR for every
                  video, so you know which thumbnails actually worked.
                </p>
                <div className={s.ctaLinks}>
                  <a href={STUDIO_AUDIT} className="v2-btn v2-btn-primary">
                    See your real CTR with the free audit →
                  </a>
                  <a href={STUDIO_GENERATE} className="v2-btn v2-btn-ghost">
                    Make a new thumbnail
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">FAQ</span>
              <h2 className="v2-cp-section-h2">Questions about the preview.</h2>
            </ScrollReveal>
            <ScrollReveal>
              <div className="v2-faq">
                {FAQ.map((item) => (
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

        {/* ── RELATED TOOLS ────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">More free tools</span>
              <h2 className="v2-cp-section-h2">Keep going.</h2>
              <ul className={s.related}>
                {related.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href}>
                      {r.name}
                      <span>{r.note}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className={s.fine}>
                Base.Tube is not affiliated with YouTube. YouTube is a trademark of Google LLC. The
                layouts above are generic recreations and can differ from what you see on YouTube.
              </p>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Sep />
      <Footer />
    </div>
  );
}
