import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';

import Footer from '../Footer';
import NavBar from '../NavBar';
import ScrollReveal from '../ScrollReveal';
import StudioCta from '../StudioCta';
import { STUDIO_AUDIT_URL } from '../thumbnail-pages/lib/config.mjs';
import { studioGenerateUrl } from '../thumbnail-pages/lib/schema.mjs';
import { InlineText, MarkdownBlocks } from '../thumbnail-pages/Markdown';
import { jsonLdString } from '../thumbnail-pages/seo';
import s from '../thumbnail-pages/thumbnails.module.css';
import ThumbnailIdeasStrip from '../thumbnail-pages/ThumbnailIdeasStrip';
import c from './compare.module.css';
import type { ComparePage as ComparePageData } from './content';
import { buildCompareJsonLd } from './seo';

const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' } as const;

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

/** The winner mark: a small check in the product's colour. Screen readers hear "stronger here". */
function WinMark() {
  return (
    <span className={c.winMark}>
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden focusable="false">
        <circle cx="8" cy="8" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4.8 8.3l2.1 2.1 4.3-4.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={s.srOnly}>Stronger here: </span>
    </span>
  );
}

export default function ComparePage({ page: p }: { page: ComparePageData }) {
  const ref = (where: string) => `compare-${p.slug}-${where}`;
  const studio = (where: string, prompt?: string) => studioGenerateUrl({ prompt, ref: ref(where) });
  const demo = p.demo;
  const heroIdeas = demo?.images.slice(0, 3) ?? [];
  const winsThem = p.table.filter((r) => r.edge === 'them').length;
  const winsUs = p.table.filter((r) => r.edge === 'us').length;

  return (
    <div className="v2-root">
      <div className="v2-grain" aria-hidden />
      <NavBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(buildCompareJsonLd(p)) }} />

      <main style={{ paddingTop: 56 }}>
        {p.status !== 'published' && process.env.NODE_ENV === 'development' && (
          <aside className={s.draftBanner} aria-label="Draft preview">
            <strong>Preview only: not indexed.</strong> Set <code>status: published</code> in content/compare/{p.slug}.md.
          </aside>
        )}

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className={`v2-tool-hero ${s.hero} ${c.hero}`}>
          <div className="v2-container">
            <div className={c.heroGrid}>
              <div>
                <nav aria-label="Breadcrumb" className={s.crumbs}>
                  <ol>
                    <li>
                      <Link href="/">Home</Link>
                    </li>
                    <li>
                      <Link href="/ai-thumbnails">AI thumbnails</Link>
                    </li>
                    <li aria-current="page">
                      {p.them} vs {p.us}
                    </li>
                  </ol>
                </nav>
                {p.eyebrow && <span className={`v2-feature-tag orange ${s.heroTag}`}>{p.eyebrow}</span>}
                <h1 className={`v2-cp-h1 ${s.heroH1}`}>
                  {p.h1}
                  {p.h1Accent && (
                    <>
                      <br />
                      <em>{p.h1Accent}</em>
                    </>
                  )}
                </h1>
                <p className={`v2-cp-sub ${s.heroSub}`}>
                  <InlineText text={p.intro} />
                </p>
                <div className={s.heroActions}>
                  <a className="v2-btn v2-btn-primary v2-btn-primary--lg" href={studio('hero')} {...NEW_TAB}>
                    Try the AI thumbnail maker <span aria-hidden>→</span>
                    <span className={s.srOnly}> (opens the Base.Tube Studio in a new tab)</span>
                  </a>
                  <a className="v2-btn v2-btn-ghost" href="#how-to">
                    {p.them} step by step
                  </a>
                </div>
                <p className={c.updated}>
                  Updated <time dateTime={p.updated}>{formatDate(p.updated)}</time>
                </p>
              </div>

              {/* Two ways to start: a blank canvas or the video. */}
              <div className={c.versus} aria-hidden>
                <div className={c.vsPanel}>
                  <span className={c.vsName}>{p.them}</span>
                  <div className={c.canvas}>
                    <span className={c.canvasSize}>1280 × 720</span>
                    <span className={c.canvasHint}>Template · photo · text, placed by hand</span>
                  </div>
                </div>
                <span className={c.vsBadge}>vs</span>
                <div className={`${c.vsPanel} ${c.vsPanelUs}`}>
                  <span className={c.vsName}>{p.us}</span>
                  {demo && <span className={c.vsPrompt}>“{demo.video}”</span>}
                  <div className={c.vsIdeas}>
                    {heroIdeas.map((img, i) => (
                      <span key={img.src} className={c.vsIdea}>
                        <Image src={img.src} alt="" fill sizes="160px" priority={i === 0} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Sep />

        {/* ── SHORT ANSWER ─────────────────────────────────────── */}
        <section className="v2-cp-section" aria-labelledby="verdict-h">
          <div className="v2-container">
            <div className={c.verdict}>
              <span className="v2-label">The short answer</span>
              <h2 id="verdict-h" className={c.verdictH2}>
                {p.them} or an AI thumbnail maker?
              </h2>
              <p className={c.verdictText}>
                <InlineText text={p.verdict} />
              </p>
            </div>
          </div>
        </section>

        <Sep />

        {/* ── COMPARISON TABLE ─────────────────────────────────── */}
        <section className="v2-cp-section" id="comparison" aria-labelledby="table-h">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">Side by side</span>
              <h2 id="table-h" className="v2-cp-section-h2">
                {p.them} vs {p.us}, point by point
              </h2>
            </ScrollReveal>
            <div className={c.board}>
              <table className={c.table} role="table">
                <caption className={s.srOnly}>
                  {p.them} compared with {p.us} for making YouTube thumbnails, as of {formatDate(p.updated)}
                </caption>
                <thead role="rowgroup">
                  <tr role="row">
                    <td className={c.corner} role="cell" />
                    {[
                      { who: p.them, sub: 'Design tool', wins: winsThem, us: false },
                      { who: p.us, sub: 'AI thumbnail maker', wins: winsUs, us: true },
                    ].map((h) => (
                      <th key={h.who} scope="col" role="columnheader" className={`${c.head} ${h.us ? c.headUs : c.headThem}`}>
                        <span className={c.headName}>{h.who}</span>
                        <span className={c.headSub}>{h.sub}</span>
                        <span className={c.tally}>
                          <span className={c.tallyDots} aria-hidden>
                            {p.table.map((row, i) => (
                              <i key={i} className={row.edge === (h.us ? 'us' : 'them') ? c.dotOn : undefined} />
                            ))}
                          </span>
                          Stronger on {h.wins} of {p.table.length}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {p.table.map((row) => (
                    <tr key={row.criterion} role="row">
                      <th scope="row" role="rowheader" className={c.crit}>
                        {row.criterion}
                        {row.edge === 'tie' && <span className={c.even}>Even</span>}
                      </th>
                      <td role="cell" data-label={p.them} className={`${c.cell} ${c.cellThem} ${row.edge === 'them' ? c.win : row.edge === 'us' ? c.lose : ''}`}>
                        {row.edge === 'them' && <WinMark />}
                        <span className={c.cellText}>
                          <InlineText text={row.them} />
                        </span>
                      </td>
                      <td role="cell" data-label={p.us} className={`${c.cell} ${c.cellUs} ${row.edge === 'us' ? c.win : row.edge === 'them' ? c.lose : ''}`}>
                        {row.edge === 'us' && <WinMark />}
                        <span className={c.cellText}>
                          <InlineText text={row.us} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {p.pickThem && p.pickUs && (
                  <tfoot role="rowgroup">
                    <tr role="row">
                      <th scope="row" role="rowheader" className={c.crit}>
                        The pick
                      </th>
                      <td role="cell" data-label={p.them} className={`${c.pick} ${c.cellThem}`}>
                        <strong>Pick {p.them} if</strong> <InlineText text={p.pickThem} />
                      </td>
                      <td role="cell" data-label={p.us} className={`${c.pick} ${c.cellUs}`}>
                        <strong>Pick {p.us} if</strong> <InlineText text={p.pickUs} />
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
            <p className={c.tableNote}>
              {p.them} features and plans as of {formatDate(p.updated).replace(/ \d+,/, '')}. They change, so check {p.them}&apos;s site
              before you pay for a plan.
            </p>
          </div>
        </section>

        {/* ── MID-PAGE CTA ─────────────────────────────────────── */}
        <StudioCta
          title={
            <>
              Try the AI way <em>on your next video.</em>
            </>
          }
          text="Describe the video or paste the link. Base.Tube gives you three thumbnail ideas with your face and your channel's style. Change anything in plain words, get a review, then download all three for YouTube Test & Compare."
          href={studio('mid')}
          images={heroIdeas.map((img) => ({ src: img.src, alt: img.alt }))}
        />

        <Sep />

        {/* ── WHEN TO USE WHICH ────────────────────────────────── */}
        <section className="v2-cp-section" aria-labelledby="which-h">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">When to use which</span>
              <h2 id="which-h" className="v2-cp-section-h2">
                Two good tools for two ways of working
              </h2>
            </ScrollReveal>
            <div className={c.which}>
              {[
                { who: p.them, data: p.whenThem, us: false },
                { who: p.us, data: p.whenUs, us: true },
              ].map((w) => (
                <div key={w.who} className={`${c.whichCard} ${w.us ? c.whichUs : ''}`}>
                  <span className={c.whichWho}>{w.who}</span>
                  <h3 className={c.whichTitle}>{w.data.title}</h3>
                  <ul>
                    {w.data.points.map((pt) => (
                      <li key={pt}>
                        <InlineText text={pt} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Sep />

        {/* ── HOW TO (the other tool) ──────────────────────────── */}
        <section className="v2-cp-section" id="how-to" aria-labelledby="howto-h">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">Step by step</span>
              <h2 id="howto-h" className="v2-cp-section-h2">
                {p.steps.title}
              </h2>
              {p.steps.intro && (
                <p className={c.sectionIntro}>
                  <InlineText text={p.steps.intro} />
                </p>
              )}
            </ScrollReveal>
            <ol className={c.steps}>
              {p.steps.items.map((st, i) => (
                <li key={st.name} className={c.step}>
                  <span className={c.stepNum} aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className={c.stepTitle}>{st.name}</h3>
                    <p className={c.stepText}>
                      <InlineText text={st.text} />
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── DEMO STRIP ───────────────────────────────────────── */}
        {demo && demo.images.length > 0 && (
          <>
            <Sep />
            <section className="v2-cp-section" aria-labelledby="demo-h">
              <div className="v2-container">
                <div className={c.demoHead}>
                  <div>
                    <span className="v2-label">The other way</span>
                    <h2 id="demo-h" className="v2-cp-section-h2">
                      {demo.title}
                    </h2>
                  </div>
                  <p className={c.demoText}>
                    <InlineText text={demo.text} />
                  </p>
                </div>
                <p className={c.demoVideo}>
                  <span>The video</span>“{demo.video}”
                </p>
                <ul className={c.demoGrid} style={{ '--n': Math.min(demo.images.length, 4) } as CSSProperties}>
                  {demo.images.map((img) => (
                    <li key={img.src} className={c.demoItem}>
                      <span className={c.demoMedia}>
                        <Image src={img.src} alt={img.alt} fill sizes="(max-width: 560px) 100vw, (max-width: 1100px) 33vw, 360px" />
                      </span>
                      <span className={c.demoLabel}>{img.label}</span>
                    </li>
                  ))}
                </ul>
                <div className={c.demoActions}>
                  <a className="v2-btn v2-btn-primary" href={studio('demo', demo.video)} {...NEW_TAB}>
                    Try it with your video <span aria-hidden>→</span>
                    <span className={s.srOnly}> (opens the Base.Tube Studio in a new tab)</span>
                  </a>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── GUIDE (Markdown body) ────────────────────────────── */}
        {p.bodyBlocks.length > 0 && (
          <>
            <Sep />
            <section className="v2-cp-section" aria-label="Guide">
              <div className="v2-container">
                <article className={`${s.prose} ${c.prose}`}>
                  <MarkdownBlocks blocks={p.bodyBlocks} />
                </article>
              </div>
            </section>
          </>
        )}

        <Sep />

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="v2-cp-section" aria-labelledby="faq-h">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">FAQ</span>
              <h2 id="faq-h" className="v2-cp-section-h2">
                {p.them} thumbnails: questions
              </h2>
            </ScrollReveal>
            <div className={`v2-faq ${s.faq}`}>
              {p.faq.map((f) => (
                <details key={f.q} className="v2-faq-item">
                  <summary className="v2-faq-q">{f.q}</summary>
                  <div className="v2-faq-a">
                    <InlineText text={f.a} />
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED ──────────────────────────────────────────── */}
        {p.related.length > 0 && (
          <>
            <Sep />
            <section className="v2-cp-section" aria-labelledby="related-h">
              <div className="v2-container">
                <span className="v2-label">Keep going</span>
                <h2 id="related-h" className="v2-cp-section-h2">
                  More on YouTube thumbnails
                </h2>
                <ul className={c.related}>
                  {p.related.map((r) => (
                    <li key={r.href}>
                      <Link href={r.href} className={c.relatedLink}>
                        {r.label} <span aria-hidden>→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className={s.ctaBand} aria-labelledby="cta-h">
          <div className="v2-container">
            <div className={s.ctaInner}>
              <span className="v2-label">Base.Tube Studio</span>
              <h2 id="cta-h" className={s.ctaH2}>
                Start from your video,
                <br />
                <em>not from a blank canvas.</em>
              </h2>
              <p className={s.ctaText}>
                Describe the video or paste the link or script. Get three ideas in your channel&apos;s style, change anything in
                plain words, get a review, and download all three for YouTube Test &amp; Compare.
              </p>
              <div className={s.ctaActions}>
                <a className="v2-btn v2-btn-primary v2-btn-primary--lg" href={studio('footer')} {...NEW_TAB}>
                  Make my thumbnail <span aria-hidden>→</span>
                  <span className={s.srOnly}> (opens the Base.Tube Studio in a new tab)</span>
                </a>
                <Link className="v2-btn v2-btn-ghost" href={STUDIO_AUDIT_URL}>
                  Free channel audit
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Sep />
      <ThumbnailIdeasStrip />
      <Footer />
    </div>
  );
}
