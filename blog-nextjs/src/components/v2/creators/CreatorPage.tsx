import Link from 'next/link';

import Footer from '../Footer';
import NavBar from '../NavBar';
import ScrollReveal from '../ScrollReveal';
import { studioGenerateUrl } from '../thumbnail-pages/lib/schema.mjs';
import s from '../thumbnail-pages/thumbnails.module.css';
import g from '../thumbnail-pages/games.module.css';
import { Avatar, PersonLink } from './CreatorCards';
import {
  channelNumbers,
  compactNumber,
  formatDay,
  formatMultiple,
  moreCreators,
  publishedLabel,
  standoutsOf,
  viewsLabel,
  type Creator,
} from './creators';
import c from './creators.module.css';
import { CREATORS_PATH, gamePage } from './links';
import { buildCreatorJsonLd, jsonLdString } from './seo';
import YtThumb from './YtThumb';

const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' } as const;
const AUDIT_HREF = '/youtube-channel-audit';

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

function watchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

function DraftBanner({ creator }: { creator: Creator }) {
  if (process.env.NODE_ENV !== 'development' || creator.live) return null;
  return (
    <aside className={s.draftBanner} aria-label="Draft preview">
      <strong>Preview only: not indexed.</strong>{' '}
      {creator.status !== 'published' ? 'Status is draft. ' : ''}
      {creator.analysis ? '' : 'The analysis is not written yet. '}
      Edit <code>content/creators/{creator.slug}.json</code>, then run <code>node scripts/creators-index.mjs</code>.
    </aside>
  );
}

/** /creators/youtube/<slug>: one real YouTube channel, its numbers and what its thumbnails do. */
export default function CreatorPage({ creator }: { creator: Creator }) {
  const a = creator.analysis;
  const nums = channelNumbers(creator);
  const standouts = standoutsOf(creator);
  const game = gamePage(creator.game);
  // An indexed page links to an indexed gallery only.
  const gameLink = game && (game.live || !creator.live) ? game : null;
  const others = moreCreators(creator);
  const handle = creator.handle ? `@${creator.handle.replace(/^@/, '')}` : null;
  const ref = `creators-${creator.slug}`;
  const unreadable = creator.videos.length - nums.sample;

  const meta = [
    creator.subscribersText,
    typeof creator.videoCount === 'number' ? `${creator.videoCount.toLocaleString('en-US')} videos` : null,
    `data from ${formatDay(creator.collectedAt)}`,
  ].filter(Boolean);

  return (
    <div className="v2-root">
      <div className="v2-grain" aria-hidden />
      <NavBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(buildCreatorJsonLd(creator)) }} />

      <main style={{ paddingTop: 56 }}>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className={`v2-tool-hero ${s.hero}`}>
          <div className="v2-container">
            <nav aria-label="Breadcrumb" className={s.crumbs}>
              <ol>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href={CREATORS_PATH}>Creators</Link>
                </li>
                <li aria-current="page">{creator.name}</li>
              </ol>
            </nav>

            <div className={c.profile}>
              <Avatar src={creator.avatar} size={104} className={c.avatar} />
              <div>
                {game && (
                  <span className={`v2-feature-tag orange ${s.heroTag}`}>
                    {creator.spotlight === 'moonshot' ? `Small channel, big video · ${game.name}` : `${game.name} creator`}
                  </span>
                )}
                <h1 className={`v2-cp-h1 ${s.hubH1} ${c.name}`}>{creator.name}</h1>
                {handle && <span className={c.handle}>{handle}</span>}
              </div>
            </div>

            <p className={c.meta}>{meta.join(' · ')}</p>
            {a?.niche && <p className={c.niche}>{a.niche}</p>}
            {a?.summary && <p className={`v2-cp-sub ${s.heroSub} ${c.summary}`}>{a.summary}</p>}

            <div className={c.links}>
              <a className="v2-btn v2-btn-primary" href={creator.url} {...NEW_TAB}>
                View channel on YouTube <span aria-hidden>↗</span>
                <span className={s.srOnly}> (opens YouTube in a new tab)</span>
              </a>
              {gameLink && (
                <Link className="v2-btn v2-btn-ghost" href={gameLink.href}>
                  {gameLink.name} thumbnail ideas <span aria-hidden>→</span>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* ── STANDOUT VIDEOS ──────────────────────────────────── */}
        {standouts.length > 0 && (
          <>
            <Sep />
            <section className="v2-cp-section" aria-labelledby="standouts-h">
              <div className="v2-container">
                <div className={s.sectionHead}>
                  <ScrollReveal>
                    <span className="v2-label">Standout videos</span>
                    <h2 id="standouts-h" className={`v2-cp-section-h2 ${s.headH2}`}>
                      The videos that beat {creator.name}&apos;s usual views
                    </h2>
                  </ScrollReveal>
                  {nums.medianViews != null && (
                    <p className={s.sectionNote}>
                      Compared with the median of the last {nums.sample} uploads: {compactNumber(nums.medianViews)} views.
                    </p>
                  )}
                </div>
                <ol className={c.standouts}>
                  {standouts.map((st, i) => {
                    const views = viewsLabel(st.video);
                    // The written "why" often opens by repeating the numbers shown above it: drop that sentence.
                    // (A sentence ends at a full stop followed by a capital letter, so "13.8 times" stays intact.)
                    const why = st.why?.replace(/^About\s.*?views.*?\.\s+(?=[A-Z'‘"])/, '') ?? null;
                    // Bar lengths: this video = 100%, a usual video = 1 / multiple (kept visible).
                    const usualPct = st.multiple ? Math.max(3, Math.min(100, 100 / st.multiple)) : null;
                    return (
                      <li key={st.video.id} className={`${c.standout} ${i % 2 ? c.standoutFlip : ''}`}>
                        <a href={watchUrl(st.video.id)} className={c.standoutMedia} {...NEW_TAB} tabIndex={-1} aria-hidden>
                          <YtThumb src={st.video.thumbnailHd || st.video.thumbnail} fallback={st.video.thumbnail} alt="" eager={i === 0} />
                          <span className={c.watchChip}>
                            <span aria-hidden>▶</span> Watch
                          </span>
                        </a>
                        <div className={c.standoutBody}>
                          <span className={c.rank}>{String(i + 1).padStart(2, '0')}</span>
                          {st.multiple != null && (
                            <div className={c.bigStat}>
                              <span className={c.bigNum}>
                                {Number.isInteger(st.multiple) ? st.multiple : st.multiple.toFixed(1)}
                                <span className={c.bigX}>×</span>
                              </span>
                              <span className={c.bigLabel}>the channel&apos;s usual views</span>
                            </div>
                          )}
                          {usualPct != null && nums.medianViews != null && (
                            <div className={c.bars} aria-hidden>
                              <div className={c.barRow}>
                                <span className={c.barName}>This video</span>
                                <span className={c.barTrack}>
                                  <span className={`${c.barFill} ${c.barHot}`} style={{ width: '100%' }} />
                                </span>
                                <span className={c.barValue}>{views ?? '—'}</span>
                              </div>
                              <div className={c.barRow}>
                                <span className={c.barName}>Usual video</span>
                                <span className={c.barTrack}>
                                  <span className={c.barFill} style={{ width: `${usualPct}%` }} />
                                </span>
                                <span className={c.barValue}>{compactNumber(nums.medianViews)} views</span>
                              </div>
                            </div>
                          )}
                          <h3 className={c.standoutTitle}>
                            <a href={watchUrl(st.video.id)} {...NEW_TAB}>
                              {st.video.title}
                              <span className={s.srOnly}> (watch on YouTube, new tab)</span>
                            </a>
                          </h3>
                          {why && <p className={c.why}>{why}</p>}
                          <a href={watchUrl(st.video.id)} className={c.watchLink} {...NEW_TAB}>
                            Watch on YouTube <span aria-hidden>↗</span>
                          </a>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </section>
          </>
        )}

        {/* ── THUMBNAIL STYLE ──────────────────────────────────── */}
        {a && a.styleTraits.length > 0 && (
          <>
            <Sep />
            <section className="v2-cp-section" aria-labelledby="style-h">
              <div className="v2-container">
                <ScrollReveal>
                  <span className="v2-label">Thumbnail style</span>
                  <h2 id="style-h" className="v2-cp-section-h2">
                    What {creator.name}&apos;s thumbnails have in common
                  </h2>
                </ScrollReveal>
                <ul className={c.traits}>
                  {a.styleTraits.map((t, i) => (
                    <li key={t.title} className={c.trait}>
                      <span className={c.traitNum} aria-hidden>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className={c.traitTitle}>{t.title}</h3>
                      <p className={c.traitText}>{t.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}

        {/* ── WHAT YOU CAN BORROW ──────────────────────────────── */}
        {a && (a.lessons.length > 0 || a.experiment) && (
          <>
            <Sep />
            <section className="v2-cp-section" aria-labelledby="borrow-h">
              <div className="v2-container">
                <ScrollReveal>
                  <span className="v2-label">What you can borrow</span>
                  <h2 id="borrow-h" className="v2-cp-section-h2">
                    Ideas to take to your own channel
                  </h2>
                </ScrollReveal>
                <div className={c.borrowGrid}>
                  {a.lessons.length > 0 && (
                    <ol className={c.lessons}>
                      {a.lessons.map((l) => (
                        <li key={l}>{l}</li>
                      ))}
                    </ol>
                  )}
                  <aside className={c.experiment} aria-label="Try this">
                    <span className={c.experimentLabel}>Try this</span>
                    {a.experiment && <p className={c.experimentText}>{a.experiment}</p>}
                    <div className={c.experimentActions}>
                      <a className="v2-btn v2-btn-primary" href={studioGenerateUrl({ ref })} {...NEW_TAB}>
                        Generate a thumbnail <span aria-hidden>→</span>
                        <span className={s.srOnly}> (opens the Base.Tube Studio in a new tab)</span>
                      </a>
                      <Link className="v2-btn v2-btn-ghost" href={AUDIT_HREF}>
                        Audit your own channel, free
                      </Link>
                    </div>
                  </aside>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── LATEST UPLOADS ───────────────────────────────────── */}
        {creator.videos.length > 0 && (
          <>
            <Sep />
            <section className="v2-cp-section" aria-labelledby="uploads-h">
              <div className="v2-container">
                <div className={s.sectionHead}>
                  <ScrollReveal>
                    <span className="v2-label">Latest uploads</span>
                    <h2 id="uploads-h" className={`v2-cp-section-h2 ${s.headH2}`}>
                      {creator.videos.length} recent videos, newest first
                    </h2>
                  </ScrollReveal>
                </div>
                <ul className={c.videos}>
                  {creator.videos.map((v) => {
                    const meta = [viewsLabel(v), publishedLabel(v)].filter(Boolean).join(' · ');
                    return (
                      <li key={v.id}>
                        <a href={watchUrl(v.id)} className={c.video} {...NEW_TAB}>
                          <span className={c.videoMedia}>
                            {/* eslint-disable-next-line @next/next/no-img-element -- external YouTube thumbnail */}
                            <img src={v.thumbnail} alt="" width={480} height={360} loading="lazy" decoding="async" />
                            {v.duration && <span className={c.duration}>{v.duration}</span>}
                          </span>
                          <span className={c.videoTitle}>{v.title}</span>
                          {meta && <span className={c.videoMeta}>{meta}</span>}
                          <span className={s.srOnly}> (watch on YouTube, new tab)</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          </>
        )}

        <Sep />

        {/* ── NUMBERS ──────────────────────────────────────────── */}
        <section className="v2-cp-section" aria-labelledby="numbers-h">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">The numbers</span>
              <h2 id="numbers-h" className="v2-cp-section-h2">
                {creator.name} in three numbers
              </h2>
            </ScrollReveal>
            <dl className={c.numbers}>
              <div className={c.number}>
                <dt>Subscribers</dt>
                <dd>{creator.subscribersText ? creator.subscribersText.replace(/\s*subscribers?$/i, '') : 'n/a'}</dd>
              </div>
              <div className={c.number}>
                <dt>Median views, last {nums.sample} uploads</dt>
                <dd>{nums.medianViews != null ? compactNumber(nums.medianViews) : 'n/a'}</dd>
              </div>
              <div className={c.number}>
                <dt>Best multiple</dt>
                <dd>{nums.bestMultiple != null ? formatMultiple(nums.bestMultiple) : 'n/a'}</dd>
                {nums.bestVideo && <dd className={c.numberNote}>{nums.bestVideo.title}</dd>}
              </div>
            </dl>
            <p className={c.caveat}>
              YouTube rounds public counts (118K, 1.2M…), so every number here is approximate. The multiple is a video&apos;s
              views divided by the median of the channel&apos;s recent uploads: ×3 means three times the usual audience. A high
              multiple is a lead worth studying, not proof that the thumbnail caused it: the topic, the timing and
              YouTube&apos;s recommendations play a part too. Click-through rate and impressions are private; only the channel
              owner can see them.
              {unreadable > 0 && ` ${unreadable} of the ${creator.videos.length} latest uploads had no readable view count and are left out of the median.`}
            </p>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        {a && a.faq.length > 0 && (
          <>
            <Sep />
            <section className="v2-cp-section" aria-labelledby="faq-h">
              <div className="v2-container">
                <ScrollReveal>
                  <span className="v2-label">FAQ</span>
                  <h2 id="faq-h" className="v2-cp-section-h2">
                    Questions about {creator.name}
                  </h2>
                </ScrollReveal>
                <div className={`v2-faq ${s.faq}`}>
                  {a.faq.map((f) => (
                    <details key={f.q} className="v2-faq-item">
                      <summary className="v2-faq-q">{f.q}</summary>
                      <div className="v2-faq-a">{f.a}</div>
                    </details>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        <Sep />

        {/* ── MORE CREATORS ────────────────────────────────────── */}
        <section className="v2-cp-section" aria-labelledby="more-h">
          <div className="v2-container">
            {others.length > 0 ? (
              <>
                <div className={g.moreHead}>
                  <div>
                    <span className="v2-label">Keep studying</span>
                    <h2 id="more-h" className="v2-cp-section-h2">
                      More {game?.name ?? ''} creators
                    </h2>
                  </div>
                  {gameLink && (
                    <Link href={gameLink.href} className={g.seeAll}>
                      {gameLink.name} thumbnail ideas <span aria-hidden>→</span>
                    </Link>
                  )}
                </div>
                <ul className={c.people}>
                  {others.map((o) => (
                    <li key={o.slug}>
                      <PersonLink slug={o.slug} name={o.name} avatar={o.avatar} subscribersText={o.subscribersText} />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <h2 id="more-h" className="v2-cp-section-h2">
                More creators to learn from
              </h2>
            )}
            <Link href={CREATORS_PATH} className={c.allLink}>
              All creators <span aria-hidden>→</span>
            </Link>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className={s.ctaBand} aria-labelledby="cta-h">
          <div className="v2-container">
            <div className={s.ctaInner}>
              <span className="v2-label">Your channel next</span>
              <h2 id="cta-h" className={s.ctaH2}>
                See which of your videos
                <br />
                <em>beat your own median.</em>
              </h2>
              <p className={s.ctaText}>
                The free channel audit runs the same numbers on your channel: your median, your standout videos and the
                thumbnails behind them. Then generate the next one in the Base.Tube Studio.
              </p>
              <div className={s.ctaActions}>
                <Link className="v2-btn v2-btn-primary v2-btn-primary--lg" href={AUDIT_HREF}>
                  Audit my channel, free <span aria-hidden>→</span>
                </Link>
                <a className="v2-btn v2-btn-ghost" href={studioGenerateUrl({ ref: `${ref}-footer` })} {...NEW_TAB}>
                  Generate a thumbnail
                  <span className={s.srOnly}> (opens the Base.Tube Studio in a new tab)</span>
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Sep />
      <Footer />
      <DraftBanner creator={creator} />
    </div>
  );
}
