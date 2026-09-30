import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';

import Footer from '../Footer';
import NavBar from '../NavBar';
import ScrollReveal from '../ScrollReveal';
import { article, defaultHeadings, disclaimerText, examplesNote, formatDate, lookName } from './copy';
import Gallery, { type GalleryItem } from './Gallery';
import { BASE_PATH, GALLERY_INITIAL, STUDIO_AUDIT_URL, TOOL_LINKS } from './lib/config.mjs';
import { getLivePages, getLoadedPage, type LoadedPage } from './lib/content.mjs';
import { studioGenerateUrl, type ThumbnailPage } from './lib/schema.mjs';
import { inlineText, type Block } from './lib/markdown-lite.mjs';
import { InlineText, MarkdownBlocks } from './Markdown';
import PageCard from './PageCard';
import { buildPageJsonLd, jsonLdString } from './seo';
import s from './thumbnails.module.css';
import VideoEmbed from './VideoEmbed';

type HeadingBlock = Extract<Block, { type: 'heading' }>;

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' } as const;

function DraftBanner({ loaded }: { loaded: LoadedPage }) {
  if (process.env.NODE_ENV !== 'development' || loaded.live) return null;
  const reasons = loaded.issues.filter((i) => i.level === 'blocker' || i.level === 'error');
  return (
    <aside className={s.draftBanner} aria-label="Draft preview">
      <strong>Preview only: not indexed.</strong>{' '}
      {loaded.page?.status === 'draft' ? 'Status is draft.' : ''} {reasons.length} item(s) to fix before this page can go live. Run{' '}
      <code>node scripts/validate-thumbnails.mjs {loaded.slug}</code>
    </aside>
  );
}

export default function ThumbnailStylePage({ loaded }: { loaded: LoadedPage }) {
  const p = loaded.page as ThumbnailPage;
  const h = defaultHeadings(p);
  const look = lookName(p);
  const count = p.gallery.length;
  const ref = (where: string) => `thumbnails-${p.slug}-${where}`;
  const heroHref = studioGenerateUrl({ style: p.cta.style, ref: ref('hero') });
  const cover = p.gallery[0];

  const related = p.related
    .map((slug) => getLoadedPage(slug))
    .filter((r): r is LoadedPage => Boolean(r?.live && r.page))
    .map((r) => r.page as ThumbnailPage);
  const listing = p.listing ? getLivePages().filter((l) => l.page?.category === p.listing && l.slug !== p.slug).map((l) => l.page as ThumbnailPage) : [];

  const galleryItems: GalleryItem[] = p.gallery.map((g, i) => ({
    src: g.src,
    alt: g.alt,
    caption: g.caption,
    prompt: g.prompt,
    notes: g.notes,
    layout: g.layout,
    studioHref: studioGenerateUrl({ style: p.cta.style, prompt: g.prompt, ref: ref(`example-${i + 1}`) }),
  }));

  const guideHeadings = p.bodyBlocks.filter((b): b is HeadingBlock => b.type === 'heading' && b.depth === 2);

  return (
    <div className="v2-root">
      <div className="v2-grain" aria-hidden />
      <NavBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(buildPageJsonLd(p)) }} />

      <main style={{ paddingTop: 56 }}>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className={`v2-tool-hero ${s.hero}`}>
          <div className="v2-container">
            <div className={s.heroGrid}>
              <div className={s.heroCopy}>
                <nav aria-label="Breadcrumb" className={s.crumbs}>
                  <ol>
                    <li>
                      <Link href="/">Home</Link>
                    </li>
                    <li>
                      <Link href={BASE_PATH}>Thumbnail ideas</Link>
                    </li>
                    <li aria-current="page">{p.name}</li>
                  </ol>
                </nav>
                <span className={`v2-feature-tag orange ${s.heroTag}`}>
                  Style guide · {count} examples
                </span>
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
                  <a className="v2-btn v2-btn-primary v2-btn-primary--lg" href={heroHref} {...NEW_TAB}>
                    {p.cta.label} <span aria-hidden>→</span>
                    <span className={s.srOnly}> (opens the Base.Tube Studio in a new tab)</span>
                  </a>
                  <a className="v2-btn v2-btn-ghost" href="#examples">
                    See the examples
                  </a>
                </div>
                {p.layouts.length > 0 && (
                  <div className={s.chips}>
                    <span className={s.chipsLabel} id="layout-chips-label">
                      Start from a layout
                    </span>
                    <ul aria-labelledby="layout-chips-label">
                      {p.layouts.map((l) => (
                        <li key={l.name}>
                          <a
                            className={s.chip}
                            href={studioGenerateUrl({ style: p.cta.style, prompt: l.prompt, ref: ref(`chip-${l.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`) })}
                            {...NEW_TAB}
                          >
                            {l.name}
                            <span className={s.srOnly}> layout, generate in the Base.Tube Studio (new tab)</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {cover && (
                <figure className={s.heroFigure}>
                  <span className={s.heroMedia}>
                    <Image src={cover.src} alt={cover.alt} fill priority sizes="(max-width: 980px) 100vw, 520px" />
                  </span>
                  <figcaption className={s.heroCaption}>
                    <span>{cover.caption}</span>
                    <span className={s.heroCaptionMeta}>Example 01</span>
                  </figcaption>
                </figure>
              )}
            </div>
          </div>
        </section>

        {/* ── LISTING (hub-like pages, e.g. /thumbnails/gaming) ─── */}
        {p.listing && listing.length > 0 && (
          <>
            <Sep />
            <section className="v2-cp-section" aria-labelledby="listing-h">
              <div className="v2-container">
                <ScrollReveal>
                  <span className="v2-label">All pages</span>
                  <h2 id="listing-h" className="v2-cp-section-h2">
                    {h.listing}
                  </h2>
                </ScrollReveal>
                <div className={s.cards}>
                  {listing.map((lp) => (
                    <PageCard key={lp.slug} page={lp} />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        <Sep />

        {/* ── GALLERY ──────────────────────────────────────────── */}
        <section className="v2-cp-section" id="examples" aria-labelledby="examples-h">
          <div className="v2-container">
            <div className={s.sectionHead}>
              <ScrollReveal>
                <span className="v2-label">Examples</span>
                <h2 id="examples-h" className={`v2-cp-section-h2 ${s.headH2}`}>
                  {h.gallery}
                </h2>
              </ScrollReveal>
              <p className={s.sectionNote}>{examplesNote(p)}</p>
            </div>
            <Gallery items={galleryItems} initial={GALLERY_INITIAL} ctaLabel="Generate in this style" />
          </div>
        </section>

        <Sep />

        {/* ── STYLE RECIPE ─────────────────────────────────────── */}
        <section className="v2-cp-section" aria-labelledby="recipe-h">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">Style recipe</span>
              <h2 id="recipe-h" className="v2-cp-section-h2">
                {h.recipe}
              </h2>
            </ScrollReveal>
            <div className={s.recipeGrid}>
              <div className={s.palette}>
                <h3 className={s.miniTitle}>Palette</h3>
                <div className={s.paletteStrip} aria-hidden>
                  {p.styleRecipe.palette.map((c) => (
                    <span key={c.hex + c.name} style={{ background: c.hex }} />
                  ))}
                </div>
                <ul className={s.paletteList}>
                  {p.styleRecipe.palette.map((c) => (
                    <li key={c.hex + c.name}>
                      <span className={s.swatch} style={{ background: c.hex }} aria-hidden />
                      <span className={s.swatchText}>
                        <span className={s.swatchName}>
                          {c.name} <span className={s.swatchHex}>{c.hex}</span>
                        </span>
                        {c.use && <span className={s.swatchUse}>{c.use}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <dl className={s.rules}>
                {[
                  ['Composition', p.styleRecipe.composition],
                  ['Text', p.styleRecipe.text],
                  ['Faces & expressions', p.styleRecipe.expressions],
                  ['Background', p.styleRecipe.background],
                ]
                  .filter(([, v]) => v)
                  .map(([label, value]) => (
                    <div key={label} className={s.rule}>
                      <dt>{label}</dt>
                      <dd>
                        <InlineText text={value} />
                      </dd>
                    </div>
                  ))}
                {p.styleRecipe.props.length > 0 && (
                  <div className={s.rule}>
                    <dt>Props & details</dt>
                    <dd>
                      <ul className={s.propList}>
                        {p.styleRecipe.props.map((prop) => (
                          <li key={prop}>
                            <InlineText text={prop} />
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </section>

        {/* ── LAYOUT RECIPES ───────────────────────────────────── */}
        {p.layouts.length > 0 && (
          <>
            <Sep />
            <section className="v2-cp-section" aria-labelledby="layouts-h">
              <div className="v2-container">
                <ScrollReveal>
                  <span className="v2-label">Layout recipes</span>
                  <h2 id="layouts-h" className="v2-cp-section-h2">
                    {h.layouts}
                  </h2>
                </ScrollReveal>
                <ol className={s.layouts}>
                  {p.layouts.map((l, i) => (
                    <li key={l.name} className={s.layout}>
                      <span className={s.layoutNum} aria-hidden>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className={s.layoutBody}>
                        <h3 className={s.layoutTitle}>{l.name}</h3>
                        <p className={s.layoutDesc}>
                          <InlineText text={l.description} />
                        </p>
                        {l.prompt && (
                          <p className={s.layoutPrompt}>
                            <span>Prompt idea</span>
                            {l.prompt}
                          </p>
                        )}
                      </div>
                      <a
                        className={s.layoutCta}
                        href={studioGenerateUrl({ style: p.cta.style, prompt: l.prompt, ref: ref(`layout-${i + 1}`) })}
                        {...NEW_TAB}
                      >
                        Generate <span aria-hidden>→</span>
                        <span className={s.srOnly}> a {l.name} layout in the Base.Tube Studio (new tab)</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </>
        )}

        <Sep />

        {/* ── GUIDE (Markdown body) ────────────────────────────── */}
        <section className="v2-cp-section" aria-label="Guide">
          <div className="v2-container">
            <div className={s.guideGrid}>
              {guideHeadings.length >= 4 && (
                <nav className={s.toc} aria-label="In this guide">
                  <span className={s.tocLabel}>In this guide</span>
                  <ol>
                    {guideHeadings.map((g) => (
                      <li key={g.id}>
                        <a href={`#${g.id}`}>
                          {inlineText(g.children)}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
              <article className={s.prose}>
                <MarkdownBlocks blocks={p.bodyBlocks} />
              </article>
            </div>
          </div>
        </section>

        {/* ── VIDEO (optional) ─────────────────────────────────── */}
        {p.video && (
          <>
            <Sep />
            <section className="v2-cp-section" aria-labelledby="video-h">
              <div className="v2-container">
                <span className="v2-label">Watch</span>
                <h2 id="video-h" className="v2-cp-section-h2">
                  {p.video.title}
                </h2>
                <div className={s.videoWrap}>
                  <VideoEmbed youtubeId={p.video.youtubeId} title={p.video.title} />
                </div>
              </div>
            </section>
          </>
        )}

        <Sep />

        {/* ── DO / DON'T ───────────────────────────────────────── */}
        <section className="v2-cp-section" aria-labelledby="dos-h">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">Checklist</span>
              <h2 id="dos-h" className="v2-cp-section-h2">
                {h.dos}
              </h2>
            </ScrollReveal>
            <div className={s.dosGrid}>
              <div className={s.dosPanel}>
                <h3 className={s.dosTitle}>
                  <span className={s.dosIconYes} aria-hidden>
                    ✓
                  </span>
                  Do
                </h3>
                <ul>
                  {p.dos.map((d) => (
                    <li key={d}>
                      <InlineText text={d} />
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`${s.dosPanel} ${s.dontPanel}`}>
                <h3 className={s.dosTitle}>
                  <span className={s.dosIconNo} aria-hidden>
                    ✕
                  </span>
                  Don&apos;t
                </h3>
                <ul>
                  {p.donts.map((d) => (
                    <li key={d}>
                      <InlineText text={d} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Sep />

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="v2-cp-section" aria-labelledby="faq-h">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">FAQ</span>
              <h2 id="faq-h" className="v2-cp-section-h2">
                {h.faq}
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

        <Sep />

        {/* ── RELATED + TOOLS ─────────────────────────────────── */}
        <section className="v2-cp-section" aria-labelledby="related-h">
          <div className="v2-container">
            <span className="v2-label">{related.length > 0 ? 'Keep going' : 'Free tools'}</span>
            <h2 id="related-h" className="v2-cp-section-h2">
              {related.length > 0 ? h.related : 'Check your thumbnail before you upload'}
            </h2>
            {related.length > 0 && (
              <div
                className={`${s.cards} ${s.cardsRow}`}
                style={{ '--cols': related.length >= 4 ? 4 : 3 } as CSSProperties}
              >
                {related.map((r) => (
                  <PageCard key={r.slug} page={r} />
                ))}
              </div>
            )}
            <div className={related.length > 0 ? s.tools : `${s.tools} ${s.toolsBare}`}>
              {related.length > 0 && <span className={s.toolsLabel}>Check your thumbnail before you upload</span>}
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
                Make {article(look)} {look} thumbnail
                <br />
                <em>for your next video.</em>
              </h2>
              <p className={s.ctaText}>
                Describe your video, pick a layout, and generate options in the Base.Tube Studio. Once the video is live,
                connect your channel to see its real impressions and click-through rate.
              </p>
              <div className={s.ctaActions}>
                <a
                  className="v2-btn v2-btn-primary v2-btn-primary--lg"
                  href={studioGenerateUrl({ style: p.cta.style, ref: ref('footer') })}
                  {...NEW_TAB}
                >
                  {p.cta.label} <span aria-hidden>→</span>
                  <span className={s.srOnly}> (opens the Base.Tube Studio in a new tab)</span>
                </a>
                <a className="v2-btn v2-btn-ghost" href={STUDIO_AUDIT_URL}>
                  Free channel audit
                  <span className={s.srOnly}> (opens the Base.Tube Studio in a new tab)</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── DISCLAIMER ───────────────────────────────────────── */}
        <div className="v2-container">
          <aside className={s.disclaimer} aria-label="About this page">
            <p>
              Last updated <time dateTime={p.updated}>{formatDate(p.updated)}</time>.
            </p>
            <p>{disclaimerText(p)}</p>
          </aside>
        </div>
      </main>

      <Sep />
      <Footer />
      <DraftBanner loaded={loaded} />
    </div>
  );
}
