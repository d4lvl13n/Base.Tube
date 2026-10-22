import Image from 'next/image';
import Link from 'next/link';

import Footer from '../Footer';
import NavBar from '../NavBar';
import ScrollReveal from '../ScrollReveal';
import { realExamples } from './games';
import g from './games.module.css';
import { BASE_PATH, STUDIO_AUDIT_URL, TOOL_LINKS } from './lib/config.mjs';
import { studioGenerateUrl, type ThumbnailPage } from './lib/schema.mjs';
import s from './thumbnails.module.css';

const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' } as const;

/** Examples shown per game on the hub; the full set lives on the game's own page. */
const PER_GAME = 8;

export const GAMING_FAQ = [
  {
    q: 'What makes a good gaming thumbnail?',
    a: 'One clear moment from the game, one big face or character with a readable emotion, and three words at most. It has to make sense at phone size, where most viewers see it. Each game page below shows the layouts that work for that game, with examples you can open and reuse.',
  },
  {
    q: 'Should a gaming thumbnail show the real game?',
    a: "Yes. Players search for a game because they want that game, so they need to recognise it in a second: its characters, its map, its colours. Keep the game's logo out of the corner where YouTube shows the video length, and check the publisher's fan content rules before you use official art.",
  },
  {
    q: 'What size is a gaming thumbnail?',
    a: 'The same as any YouTube thumbnail: a 16:9 image, at least 1280 × 720 pixels. The YouTube thumbnail size guide on Base.Tube has the current limits and a free checker that tells you if your file will upload.',
  },
  {
    q: 'How do I make a gaming thumbnail fast?',
    a: 'Pick the game below, choose the layout that matches your video (launch day, challenge, fail, guide…), and open it in the Base.Tube Studio. Describe what happens in your video and pick the version you like, then check it at feed size before you upload.',
  },
];

/** /thumbnails/gaming: every game page with a strip of its examples. */
export default function GamingHubPage({ pages, isLive }: { pages: ThumbnailPage[]; isLive: boolean }) {
  const total = pages.reduce((n, p) => n + realExamples(p).length, 0);

  return (
    <div className="v2-root">
      <div className="v2-grain" aria-hidden />
      <NavBar />

      <main style={{ paddingTop: 56 }}>
        {!isLive && process.env.NODE_ENV === 'development' && (
          <aside className={s.draftBanner} aria-label="Draft preview">
            <strong>Preview only: not indexed.</strong> This hub goes live once 3 game pages are published. Until then it shows
            every game page, drafts included.
          </aside>
        )}

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className={`v2-tool-hero ${s.hero}`}>
          <div className="v2-container">
            <nav aria-label="Breadcrumb" className={s.crumbs}>
              <ol>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href={BASE_PATH}>Thumbnail ideas</Link>
                </li>
                <li aria-current="page">Gaming</li>
              </ol>
            </nav>
            {pages.length > 0 && (
              <span className={`v2-feature-tag orange ${s.heroTag}`}>
                {pages.length} games · {total} examples
              </span>
            )}
            <h1 className={`v2-cp-h1 ${s.hubH1}`}>
              Gaming thumbnail ideas
              <br />
              <em>for every game you play.</em>
            </h1>
            <p className={`v2-cp-sub ${s.heroSub}`}>
              Real examples for each game, sorted by the videos creators actually make: launch day, challenges, fails, guides
              and more. Open a game to see every example, the layouts behind them and the rules of the look.
            </p>
            <div className={s.heroActions}>
              <a className="v2-btn v2-btn-primary v2-btn-primary--lg" href={studioGenerateUrl({ ref: 'thumbnails-gaming-hero' })} {...NEW_TAB}>
                Generate a gaming thumbnail <span aria-hidden>→</span>
                <span className={s.srOnly}> (opens the Base.Tube Studio in a new tab)</span>
              </a>
            </div>
            {pages.length > 1 && (
              <nav className={s.chips} aria-label="Jump to a game">
                <span className={s.chipsLabel}>Jump to</span>
                <ul>
                  {pages.map((p) => (
                    <li key={p.slug}>
                      <a className={s.chip} href={`#${p.slug}`}>
                        {p.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </section>

        {/* ── ONE STRIP PER GAME ───────────────────────────────── */}
        {pages.map((p) => {
          const examples = realExamples(p);
          const href = `${BASE_PATH}/${p.slug}`;
          return (
            <div key={p.slug}>
              <div className="v2-sep" aria-hidden />
              <section className={`v2-cp-section ${g.game}`} id={p.slug} aria-labelledby={`${p.slug}-h`}>
                <div className="v2-container">
                  <div className={g.gameHead}>
                    <ScrollReveal>
                      <h2 id={`${p.slug}-h`} className="v2-cp-section-h2">
                        <Link href={href} className={g.gameTitle}>
                          {p.name} thumbnails
                        </Link>
                      </h2>
                      <p className={g.gameSummary}>{p.summary}</p>
                    </ScrollReveal>
                    <Link href={`${href}#examples`} className={g.seeAll}>
                      See all {examples.length} examples <span aria-hidden>→</span>
                    </Link>
                  </div>
                  <ul className={g.grid}>
                    {examples.slice(0, PER_GAME).map((img) => (
                      <li key={img.file}>
                        <Link href={`${href}#examples`} className={g.thumb} aria-label={`${p.name}: ${img.caption}`}>
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            sizes="(max-width: 560px) 50vw, (max-width: 1100px) 33vw, 280px"
                            className={g.thumbImg}
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>
          );
        })}

        <div className="v2-sep" aria-hidden />

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="v2-cp-section" aria-labelledby="faq-h">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">FAQ</span>
              <h2 id="faq-h" className="v2-cp-section-h2">
                Questions about gaming thumbnails
              </h2>
            </ScrollReveal>
            <div className={`v2-faq ${s.faq}`}>
              {GAMING_FAQ.map((f) => (
                <details key={f.q} className="v2-faq-item">
                  <summary className="v2-faq-q">{f.q}</summary>
                  <div className="v2-faq-a">{f.a}</div>
                </details>
              ))}
            </div>
            <div className={s.tools}>
              <span className={s.toolsLabel}>Check your thumbnail before you upload</span>
              <ul>
                {TOOL_LINKS.map((t) => (
                  <li key={t.href}>
                    <Link href={t.href}>
                      {t.label} <span aria-hidden>→</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={BASE_PATH}>
                    All thumbnail ideas <span aria-hidden>→</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className={s.ctaBand} aria-labelledby="cta-h">
          <div className="v2-container">
            <div className={s.ctaInner}>
              <span className="v2-label">Base.Tube Studio</span>
              <h2 id="cta-h" className={s.ctaH2}>
                Make the thumbnail
                <br />
                <em>for your next gaming video.</em>
              </h2>
              <p className={s.ctaText}>
                Describe your video and generate options in the Base.Tube Studio. Once the video is live, connect your
                channel to see its real impressions and click-through rate.
              </p>
              <div className={s.ctaActions}>
                <a className="v2-btn v2-btn-primary v2-btn-primary--lg" href={studioGenerateUrl({ ref: 'thumbnails-gaming-footer' })} {...NEW_TAB}>
                  Generate a thumbnail <span aria-hidden>→</span>
                  <span className={s.srOnly}> (opens the Base.Tube Studio in a new tab)</span>
                </a>
                <a className="v2-btn v2-btn-ghost" href={STUDIO_AUDIT_URL}>
                  Free channel audit
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
