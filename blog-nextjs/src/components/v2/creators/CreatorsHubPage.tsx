import Link from 'next/link';

import Footer from '../Footer';
import NavBar from '../NavBar';
import ScrollReveal from '../ScrollReveal';
import Marquee, { ShowcaseHead, splitRows, type MarqueeItem } from '../thumbnail-pages/Marquee';
import { studioGenerateUrl } from '../thumbnail-pages/lib/schema.mjs';
import s from '../thumbnail-pages/thumbnails.module.css';
import { CreatorCard } from './CreatorCards';
import { standoutsOf, type Creator } from './creators';
import c from './creators.module.css';
import { CREATORS_HUB_MIN_LIVE, creatorPath, gamePage } from './links';

const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' } as const;

interface Group {
  game: string;
  name: string;
  href: string | null;
  creators: Creator[];
}

/** Creators grouped by game, biggest groups first. */
function groupByGame(creators: Creator[], hubIsLive: boolean): Group[] {
  const map = new Map<string, Group>();
  for (const cr of creators) {
    let grp = map.get(cr.game);
    if (!grp) {
      const page = gamePage(cr.game);
      grp = {
        game: cr.game,
        name: page?.name ?? cr.game,
        // An indexed hub links to indexed galleries only.
        href: page && (page.live || !hubIsLive) ? page.href : null,
        creators: [],
      };
      map.set(cr.game, grp);
    }
    grp.creators.push(cr);
  }
  return [...map.values()].sort((a, b) => b.creators.length - a.creators.length || a.name.localeCompare(b.name));
}

/** One standout thumbnail per creator, then a second one, so a row never repeats a creator back to back. */
export function hubMarqueeItems(creators: Creator[], perCreator = 2): MarqueeItem[] {
  const lists = creators.map((cr) =>
    standoutsOf(cr)
      .slice(0, perCreator)
      .map((st) => ({
        src: st.video.thumbnail,
        alt: `${st.video.title}: thumbnail by ${cr.name}`,
        href: creatorPath(cr.slug),
        label: cr.name,
      })),
  );
  const out: MarqueeItem[] = [];
  for (let i = 0; i < perCreator; i++) for (const l of lists) if (l[i]) out.push(l[i]);
  return out;
}

/** /creators/youtube: real channels to learn from, grouped by game. */
export default function CreatorsHubPage({ creators, isLive }: { creators: Creator[]; isLive: boolean }) {
  const groups = groupByGame(creators, isLive);
  const marquee = hubMarqueeItems(creators);

  return (
    <div className="v2-root">
      <div className="v2-grain" aria-hidden />
      <NavBar />

      <main style={{ paddingTop: 56 }}>
        {!isLive && process.env.NODE_ENV === 'development' && (
          <aside className={s.draftBanner} aria-label="Draft preview">
            <strong>Preview only: not indexed.</strong> This hub goes live once {CREATORS_HUB_MIN_LIVE} creator pages are
            published. Until then it shows every creator, drafts included.
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
                <li aria-current="page">Creators</li>
              </ol>
            </nav>
            {creators.length > 0 && (
              <span className={`v2-feature-tag orange ${s.heroTag}`}>
                {creators.length} channels · {groups.length} games
              </span>
            )}
            <h1 className={`v2-cp-h1 ${s.hubH1}`}>
              YouTube creators
              <br />
              <em>to learn from.</em>
            </h1>
            <p className={`v2-cp-sub ${s.heroSub}`}>
              Real channels, sorted by game. For each one: how the thumbnails look, which videos beat the channel&apos;s usual
              views, and what you can borrow for your own videos. Built from public YouTube data, with the date on every page.
            </p>
            <div className={s.heroActions}>
              <Link className="v2-btn v2-btn-primary v2-btn-primary--lg" href="/youtube-channel-audit">
                Audit your own channel, free <span aria-hidden>→</span>
              </Link>
            </div>
            {groups.length > 1 && (
              <nav className={s.chips} aria-label="Jump to a game">
                <span className={s.chipsLabel}>Jump to</span>
                <ul>
                  {groups.map((grp) => (
                    <li key={grp.game}>
                      <a className={s.chip} href={`#${grp.game}`}>
                        {grp.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </section>

        {/* ── SHOWCASE: standout thumbnails, drifting rows ─────── */}
        {marquee.length >= 4 && (
          <section className={`v2-cp-section ${s.showcase}`} aria-labelledby="showcase-h">
            <ShowcaseHead
              pill="Standout videos"
              title="The thumbnails that beat their channel's median"
              sub="One or two standout videos from each creator. Open one to see why it may have worked."
            />
            <Marquee rows={splitRows(marquee, 2)} />
          </section>
        )}

        {/* ── CREATORS BY GAME ─────────────────────────────────── */}
        <div className="v2-sep" aria-hidden />
        <section className="v2-cp-section" aria-label="Creators by game">
          <div className="v2-container">
            {groups.map((grp) => (
              <div key={grp.game} className={c.group}>
                <div className={c.groupHead} id={grp.game}>
                  <ScrollReveal>
                    <span className="v2-label">{grp.creators.length} creators</span>
                    <h2 className={`v2-cp-section-h2 ${c.groupTitle}`}>
                      {grp.href ? <Link href={grp.href}>{grp.name}</Link> : grp.name}
                    </h2>
                  </ScrollReveal>
                  {grp.href && (
                    <Link href={grp.href} className={c.allLink}>
                      {grp.name} thumbnail ideas <span aria-hidden>→</span>
                    </Link>
                  )}
                </div>
                <ul className={c.cards}>
                  {grp.creators.map((cr) => {
                    const top = standoutsOf(cr)[0]?.video;
                    return (
                      <li key={cr.slug}>
                        <CreatorCard
                          slug={cr.slug}
                          name={cr.name}
                          avatar={cr.avatar}
                          subscribersText={cr.subscribersText}
                          niche={cr.analysis?.niche}
                          thumb={top ? { src: top.thumbnail, alt: `${top.title}: thumbnail by ${cr.name}` } : null}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className={s.ctaBand} aria-labelledby="cta-h">
          <div className="v2-container">
            <div className={s.ctaInner}>
              <span className="v2-label">Your channel next</span>
              <h2 id="cta-h" className={s.ctaH2}>
                Find your own
                <br />
                <em>standout videos.</em>
              </h2>
              <p className={s.ctaText}>
                The free channel audit runs the same numbers on your channel: your median views, the videos that beat it and
                the thumbnails behind them.
              </p>
              <div className={s.ctaActions}>
                <Link className="v2-btn v2-btn-primary v2-btn-primary--lg" href="/youtube-channel-audit">
                  Audit my channel, free <span aria-hidden>→</span>
                </Link>
                <a className="v2-btn v2-btn-ghost" href={studioGenerateUrl({ ref: 'creators-hub' })} {...NEW_TAB}>
                  Generate a thumbnail
                  <span className={s.srOnly}> (opens the Base.Tube Studio in a new tab)</span>
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
