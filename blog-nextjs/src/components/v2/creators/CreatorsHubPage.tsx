import Link from 'next/link';

import Footer from '../Footer';
import NavBar from '../NavBar';
import ScrollReveal from '../ScrollReveal';
import { ShowcaseHead } from '../thumbnail-pages/Marquee';
import { studioGenerateUrl } from '../thumbnail-pages/lib/schema.mjs';
import s from '../thumbnail-pages/thumbnails.module.css';
import { Avatar } from './CreatorCards';
import YtThumb from './YtThumb';
import { channelNumbers, compactNumber, formatMultiple, standoutsOf, trustedViews, type Creator } from './creators';
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

/** A small channel's breakout video: the thumbnail in large, its reach against the channel's size. */
function MoonshotRow({ creator: cr, flip }: { creator: Creator; flip: boolean }) {
  const href = creatorPath(cr.slug);
  const nums = channelNumbers(cr);
  const video = cr.videos.find((v) => v.id === cr.moonshotVideoId) ?? standoutsOf(cr)[0]?.video;
  if (!video) return null;
  const views = trustedViews(video);
  const vsSubs = views && cr.subscribers ? Math.round(views / cr.subscribers) : null;
  const vsUsual = views && nums.medianViews ? Math.round((views / nums.medianViews) * 10) / 10 : null;
  return (
    <li className={`${c.row} ${flip ? c.rowFlip : ''}`}>
      <Link href={href} className={c.moonshotMedia} aria-hidden tabIndex={-1}>
        <YtThumb src={video.thumbnailHd || video.thumbnail} fallback={video.thumbnail} alt="" />
      </Link>
      <div className={c.rowBody}>
        <div className={c.rowIdentity}>
          <Avatar src={cr.avatar} size={64} className={c.rowAvatar} />
          <div>
            <h3 className={c.rowName}>
              <Link href={href}>{cr.name}</Link>
            </h3>
            <span className={c.rowHandle}>{cr.subscribersText}</span>
          </div>
        </div>
        <p className={c.rowNiche}>{video.title}</p>
        <dl className={c.rowStats}>
          {views != null && (
            <div>
              <dt>Views</dt>
              <dd>{compactNumber(views)}</dd>
            </div>
          )}
          {vsSubs != null && (
            <div>
              <dt>vs subscribers</dt>
              <dd className={c.rowHot}>×{vsSubs}</dd>
            </div>
          )}
          {vsUsual != null && (
            <div>
              <dt>vs usual video</dt>
              <dd>×{vsUsual}</dd>
            </div>
          )}
        </dl>
        {cr.analysis?.summary && <p className={c.rowSummary}>{cr.analysis.summary}</p>}
        <Link href={href} className={c.rowCta}>
          Read how it happened <span aria-hidden>→</span>
        </Link>
      </div>
    </li>
  );
}

/**
 * One creator, one editorial row: who they are and their numbers on one side, their three standout
 * thumbnails on the other. Everything links to the creator's analysis page.
 */
function CreatorRow({ creator: cr, flip }: { creator: Creator; flip: boolean }) {
  const href = creatorPath(cr.slug);
  const nums = channelNumbers(cr);
  const shots = standoutsOf(cr).slice(0, 3);
  const handle = cr.handle ? `@${cr.handle.replace(/^@/, '')}` : null;
  return (
    <li className={`${c.row} ${flip ? c.rowFlip : ''}`}>
      <Link href={href} className={c.mosaic} aria-hidden tabIndex={-1}>
        {shots.map((st, k) => (
          <span key={st.video.id} className={k === 0 ? c.mosaicMain : c.mosaicSide}>
            <YtThumb src={st.video.thumbnailHd || st.video.thumbnail} fallback={st.video.thumbnail} alt="" />
          </span>
        ))}
      </Link>
      <div className={c.rowBody}>
        <div className={c.rowIdentity}>
          <Avatar src={cr.avatar} size={64} className={c.rowAvatar} />
          <div>
            <h3 className={c.rowName}>
              <Link href={href}>{cr.name}</Link>
            </h3>
            <span className={c.rowHandle}>
              {[handle, cr.subscribersText].filter(Boolean).join(' · ')}
            </span>
          </div>
        </div>
        {cr.analysis?.niche && <p className={c.rowNiche}>{cr.analysis.niche}</p>}
        {cr.analysis?.summary && <p className={c.rowSummary}>{cr.analysis.summary}</p>}
        <dl className={c.rowStats}>
          {nums.medianViews != null && (
            <div>
              <dt>Usual video</dt>
              <dd>{compactNumber(nums.medianViews)} views</dd>
            </div>
          )}
          {nums.bestMultiple != null && (
            <div>
              <dt>Best video</dt>
              <dd className={c.rowHot}>{formatMultiple(nums.bestMultiple)}</dd>
            </div>
          )}
          <div>
            <dt>Analysed</dt>
            <dd>{nums.sample} videos</dd>
          </div>
        </dl>
        <Link href={href} className={c.rowCta}>
          Read the analysis <span aria-hidden>→</span>
        </Link>
      </div>
    </li>
  );
}

/** /creators/youtube: real channels to learn from, grouped by game. */
export default function CreatorsHubPage({ creators, isLive }: { creators: Creator[]; isLive: boolean }) {
  const moonshots = creators.filter((cr) => cr.spotlight === 'moonshot');
  const groups = groupByGame(
    creators.filter((cr) => cr.spotlight !== 'moonshot'),
    isLive,
  );

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
              views, and what you can borrow for your own videos.
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

        {/* ── DIRECTORY: every creator at a glance ─────────────── */}
        {creators.length > 0 && (
          <section className="v2-cp-section" aria-labelledby="showcase-h">
            <div className="v2-container">
              <ShowcaseHead
                pill="The creators"
                title="Who you can learn from"
                sub="Gaming channels from 11K to 850K subscribers. Pick one to read how their thumbnails work."
              />
              <ul className={c.directory}>
                {creators.map((cr) => (
                  <li key={cr.slug}>
                    <Link href={creatorPath(cr.slug)} className={c.dirItem}>
                      <Avatar src={cr.avatar} size={64} className={c.dirAvatar} />
                      <span className={c.dirName}>{cr.name}</span>
                      <span className={c.dirMeta}>
                        {gamePage(cr.game)?.name ?? cr.game}
                        {cr.subscribersText ? ` · ${cr.subscribersText.replace(/ subscribers?/i, '')}` : ''}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── SMALL CHANNELS, BIG VIDEOS ───────────────────────── */}
        {moonshots.length > 0 && (
          <>
            <div className="v2-sep" aria-hidden />
            <section className="v2-cp-section" id="moonshots" aria-labelledby="moonshots-h">
              <div className="v2-container">
                <div className={c.groupHead}>
                  <ScrollReveal>
                    <span className="v2-label">Small channels, big videos</span>
                    <h2 id="moonshots-h" className={`v2-cp-section-h2 ${c.groupTitle}`}>
                      One video that outgrew the channel
                    </h2>
                  </ScrollReveal>
                </div>
                <p className={c.groupLead}>
                  Channels under 35K subscribers with one upload that reached many times their audience. What the
                  thumbnail and title did differently, and what you can copy.
                </p>
                <ol className={c.rows}>
                  {moonshots.map((cr, i) => (
                    <MoonshotRow key={cr.slug} creator={cr} flip={i % 2 === 1} />
                  ))}
                </ol>
              </div>
            </section>
          </>
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
                <ol className={c.rows}>
                  {grp.creators.map((cr, i) => (
                    <CreatorRow key={cr.slug} creator={cr} flip={i % 2 === 1} />
                  ))}
                </ol>
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
