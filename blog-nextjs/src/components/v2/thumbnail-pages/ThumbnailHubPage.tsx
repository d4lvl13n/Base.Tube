import Link from 'next/link';

import Footer from '../Footer';
import NavBar from '../NavBar';
import ScrollReveal from '../ScrollReveal';
import { formatDate } from './copy';
import { CATEGORIES, STUDIO_AUDIT_URL, TOOL_LINKS } from './lib/config.mjs';
import type { LoadedHub } from './lib/content.mjs';
import { studioGenerateUrl, type PageCategory, type ThumbnailPage } from './lib/schema.mjs';
import { InlineText, MarkdownBlocks } from './Markdown';
import PageCard from './PageCard';
import { buildHubJsonLd, jsonLdString } from './seo';
import s from './thumbnails.module.css';

const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' } as const;

const GROUP_TITLES: Record<PageCategory, { label: string; title: string }> = {
  game: { label: 'Games', title: 'Thumbnail ideas by game' },
  style: { label: 'Creator styles', title: 'Thumbnail ideas by creator style' },
  genre: { label: 'Video genres', title: 'Thumbnail ideas by video genre' },
};

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

/** /thumbnails: every live niche page, grouped by category, plus the hub's own guide and FAQ. */
export default function ThumbnailHubPage({ loaded, pages }: { loaded: LoadedHub; pages: ThumbnailPage[] }) {
  const hub = loaded.hub;
  if (!hub) return null;
  const jsonLd = buildHubJsonLd(loaded, pages);
  const groups = CATEGORIES.map((c) => ({ category: c, pages: pages.filter((p) => p.category === c) })).filter((g) => g.pages.length);
  const totalExamples = pages.reduce((n, p) => n + p.gallery.length, 0);

  return (
    <div className="v2-root">
      <div className="v2-grain" aria-hidden />
      <NavBar />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />}

      <main style={{ paddingTop: 56 }}>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className={`v2-tool-hero ${s.hero}`}>
          <div className="v2-container">
            <nav aria-label="Breadcrumb" className={s.crumbs}>
              <ol>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li aria-current="page">Thumbnail ideas</li>
              </ol>
            </nav>
            {pages.length > 0 && (
              <span className={`v2-feature-tag orange ${s.heroTag}`}>
                {pages.length} {pages.length === 1 ? 'style guide' : 'style guides'} · {totalExamples} examples
              </span>
            )}
            <h1 className={`v2-cp-h1 ${s.hubH1}`}>
              {hub.h1}
              {hub.h1Accent && (
                <>
                  <br />
                  <em>{hub.h1Accent}</em>
                </>
              )}
            </h1>
            <p className={`v2-cp-sub ${s.heroSub}`}>
              <InlineText text={hub.intro} />
            </p>
            <div className={s.heroActions}>
              <a className="v2-btn v2-btn-primary v2-btn-primary--lg" href={studioGenerateUrl({ ref: 'thumbnails-hub-hero' })} {...NEW_TAB}>
                Generate a thumbnail <span aria-hidden>→</span>
                <span className={s.srOnly}> (opens the Base.Tube Studio in a new tab)</span>
              </a>
              {groups.length > 0 && (
                <a className="v2-btn v2-btn-ghost" href={`#${groups[0].category}`}>
                  Browse the ideas
                </a>
              )}
            </div>
            {groups.length > 1 && (
              <nav className={s.chips} aria-label="Jump to a group">
                <span className={s.chipsLabel}>Jump to</span>
                <ul>
                  {groups.map((g) => (
                    <li key={g.category}>
                      <a className={s.chip} href={`#${g.category}`}>
                        {GROUP_TITLES[g.category].label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </section>

        {/* ── GROUPS ───────────────────────────────────────────── */}
        {groups.length === 0 && (
          <>
            <Sep />
            <section className="v2-cp-section">
              <div className="v2-container">
                <div className={s.empty}>
                  <p className={s.emptyTitle}>The first style guides are being made.</p>
                  <p className={s.emptyText}>
                    Each guide will show original examples generated with Base.Tube, the rules of the look and ready-made
                    layouts. Until then, you can generate a thumbnail in any style in the Studio.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
        {groups.map((g) => (
          <div key={g.category}>
            <Sep />
            <section className="v2-cp-section" id={g.category} aria-labelledby={`${g.category}-h`}>
              <div className="v2-container">
                <ScrollReveal>
                  <span className="v2-label">{GROUP_TITLES[g.category].label}</span>
                  <h2 id={`${g.category}-h`} className="v2-cp-section-h2">
                    {GROUP_TITLES[g.category].title}
                  </h2>
                </ScrollReveal>
                <div className={s.cards}>
                  {g.pages.map((p) => (
                    <PageCard key={p.slug} page={p} />
                  ))}
                </div>
              </div>
            </section>
          </div>
        ))}

        <Sep />

        {/* ── GUIDE ────────────────────────────────────────────── */}
        {hub.bodyBlocks.length > 0 && (
          <>
            <section className="v2-cp-section" aria-label="Guide">
              <div className="v2-container">
                <div className={s.guideGrid}>
                  <article className={s.prose}>
                    <MarkdownBlocks blocks={hub.bodyBlocks} />
                  </article>
                </div>
              </div>
            </section>
            <Sep />
          </>
        )}

        {/* ── FAQ ──────────────────────────────────────────────── */}
        {hub.faq.length > 0 && (
          <>
            <section className="v2-cp-section" aria-labelledby="faq-h">
              <div className="v2-container">
                <ScrollReveal>
                  <span className="v2-label">FAQ</span>
                  <h2 id="faq-h" className="v2-cp-section-h2">
                    Questions about thumbnail ideas
                  </h2>
                </ScrollReveal>
                <div className={`v2-faq ${s.faq}`}>
                  {hub.faq.map((f) => (
                    <details key={f.q} className="v2-faq-item">
                      <summary className="v2-faq-q">{f.q}</summary>
                      <div className="v2-faq-a">
                        <InlineText text={f.a} />
                      </div>
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
                  </ul>
                </div>
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
                Turn an idea into a thumbnail
                <br />
                <em>for your next video.</em>
              </h2>
              <p className={s.ctaText}>
                Describe your video and generate options in the Base.Tube Studio. Once the video is live, connect your
                channel to see its real impressions and click-through rate.
              </p>
              <div className={s.ctaActions}>
                <a className="v2-btn v2-btn-primary v2-btn-primary--lg" href={studioGenerateUrl({ ref: 'thumbnails-hub-footer' })} {...NEW_TAB}>
                  Generate a thumbnail <span aria-hidden>→</span>
                  <span className={s.srOnly}> (opens the Base.Tube Studio in a new tab)</span>
                </a>
                <a className="v2-btn v2-btn-ghost" href={STUDIO_AUDIT_URL} {...NEW_TAB}>
                  Free channel audit
                  <span className={s.srOnly}> (opens the Base.Tube Studio in a new tab)</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="v2-container">
          <aside className={s.disclaimer} aria-label="About these pages">
            <p>
              Last updated <time dateTime={hub.updated}>{formatDate(hub.updated)}</time>.
            </p>
            <p>
              Game and creator names are trademarks of their owners and are used only to describe a visual style. Base.Tube
              is not affiliated with, sponsored or endorsed by any of them. Every example is an original image generated by
              Base.Tube: no game art, logos, screenshots, real people or copies of existing thumbnails.
            </p>
          </aside>
        </div>
      </main>

      <Sep />
      <Footer />
    </div>
  );
}
