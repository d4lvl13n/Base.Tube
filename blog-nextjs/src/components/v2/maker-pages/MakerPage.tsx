import Image from 'next/image';
import Link from 'next/link';

import Footer from '../Footer';
import NavBar from '../NavBar';
import ScrollReveal from '../ScrollReveal';
import { GAMING_HUB_SLUG, realExamples, siblingPages } from '../thumbnail-pages/games';
import g from '../thumbnail-pages/games.module.css';
import { BASE_PATH, TOOL_LINKS } from '../thumbnail-pages/lib/config.mjs';
import type { LoadedPage } from '../thumbnail-pages/lib/content.mjs';
import { studioGenerateUrl, type GalleryImage, type ThumbnailPage } from '../thumbnail-pages/lib/schema.mjs';
import { jsonLdString } from '../thumbnail-pages/seo';
import s from '../thumbnail-pages/thumbnails.module.css';
import m from './maker.module.css';
import MakerDemo, { type DemoIdea } from './MakerDemo';
import { getMakerForGame, makerIsLive, makerPath, makerSlug, type MakerContent } from './makers';
import { buildMakerJsonLd, MAKER_STEPS } from './seo';

const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' } as const;

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

const fileOf = (img: GalleryImage) => img.src.split('/').pop() ?? '';

export default function MakerPage({ maker, gallery }: { maker: MakerContent; gallery: LoadedPage }) {
  const p = gallery.page as ThumbnailPage;
  const live = makerIsLive(maker);
  const images = new Map(realExamples(p).map((img) => [fileOf(img), img]));
  const ref = (where: string) => `${makerSlug(maker.game)}-${where}`;
  const studio = (where: string, prompt?: string) => studioGenerateUrl({ style: p.cta.style, prompt, ref: ref(where) });

  const ideas: DemoIdea[] = maker.ideas.flatMap((it, i) => {
    const img = images.get(it.file);
    return img ? [{ label: it.label, idea: it.idea, src: img.src, alt: img.alt, href: studio(`demo-${i + 1}`, it.idea) }] : [];
  });
  const types = maker.videoTypes.flatMap((t) => {
    const img = images.get(t.file);
    return img ? [{ ...t, img }] : [];
  });
  // A live page links to live pages only; a draft preview links to everything.
  const galleryHref = gallery.live || !live ? `${BASE_PATH}/${p.slug}` : null;
  const otherGames = siblingPages(gallery).slice(0, 8);
  const strip = realExamples(p).slice(0, 4);

  return (
    <div className="v2-root">
      <div className="v2-grain" aria-hidden />
      <NavBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(buildMakerJsonLd(maker, p)) }} />

      <main style={{ paddingTop: 56 }}>
        {!live && process.env.NODE_ENV === 'development' && (
          <aside className={s.draftBanner} aria-label="Draft preview">
            <strong>Preview only: not indexed.</strong> Set <code>status: &apos;published&apos;</code> in the maker content once the
            design is approved.
          </aside>
        )}

        {/* ── HERO + DEMO ───────────────────────────────────────── */}
        <section className={`v2-tool-hero ${m.hero}`}>
          <div className="v2-container">
            <div className={m.heroCopy}>
              <nav aria-label="Breadcrumb" className={`${s.crumbs} ${m.crumbs}`}>
                <ol>
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/ai-thumbnails">AI thumbnails</Link>
                  </li>
                  <li aria-current="page">{p.name} thumbnail maker</li>
                </ol>
              </nav>
              <span className={`v2-feature-tag orange ${m.tag}`}>AI thumbnail maker · {p.name}</span>
              <h1 className={`v2-cp-h1 ${m.h1}`}>
                {maker.h1}
                <br />
                <em>{maker.h1Accent}</em>
              </h1>
              <p className={`v2-cp-sub ${m.sub}`}>{maker.intro}</p>
              <div className={m.actions}>
                <a className="v2-btn v2-btn-primary v2-btn-primary--lg" href={studio('hero')} {...NEW_TAB}>
                  Make my {p.name} thumbnail <span aria-hidden>→</span>
                  <span className={s.srOnly}> (opens the Base.Tube Studio in a new tab)</span>
                </a>
                {galleryHref && (
                  <Link className="v2-btn v2-btn-ghost" href={galleryHref}>
                    See {p.name} thumbnail ideas
                  </Link>
                )}
              </div>
            </div>

            {ideas.length > 0 && <MakerDemo ideas={ideas} ownRef={ref('demo-own')} gameName={p.name} />}
          </div>
        </section>

        <Sep />

        {/* ── HOW IT WORKS ──────────────────────────────────────── */}
        <section className="v2-cp-section" aria-labelledby="steps-h">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">How it works</span>
              <h2 id="steps-h" className="v2-cp-section-h2">
                Make a {p.name} thumbnail in three steps
              </h2>
            </ScrollReveal>
            <ol className={m.steps}>
              {MAKER_STEPS.map((st, i) => (
                <li key={st.name} className={m.step}>
                  <span className={m.stepNum} aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className={m.stepTitle}>{st.name}</h3>
                  <p className={m.stepText}>{st.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Sep />

        {/* ── VIDEO TYPES ───────────────────────────────────────── */}
        {types.length > 0 && (
          <section className="v2-cp-section" aria-labelledby="types-h">
            <div className="v2-container">
              <ScrollReveal>
                <span className="v2-label">For the way you play</span>
                <h2 id="types-h" className="v2-cp-section-h2">
                  {maker.videoTypesTitle}
                </h2>
              </ScrollReveal>
              <ol className={m.types}>
                {types.map((t, i) => (
                  <li key={t.name} className={`${m.type} ${i % 2 === 1 ? m.typeFlip : ''}`}>
                    <a className={m.typeMedia} href={studio(`type-${i + 1}`, t.idea)} {...NEW_TAB} aria-hidden tabIndex={-1}>
                      <Image src={t.img.src} alt={t.img.alt} fill sizes="(max-width: 900px) 100vw, 600px" className={m.typeImg} />
                    </a>
                    <div className={m.typeBody}>
                      <span className={m.typeNum}>{String(i + 1).padStart(2, '0')}</span>
                      <h3 className={m.typeTitle}>{t.name}</h3>
                      <p className={m.typeText}>{t.text}</p>
                      <p className={m.typeIdea}>
                        <span>Example idea</span>“{t.idea}”
                      </p>
                      <a className={m.typeCta} href={studio(`type-${i + 1}`, t.idea)} {...NEW_TAB}>
                        Try this idea <span aria-hidden>→</span>
                        <span className={s.srOnly}> in the Base.Tube Studio (new tab)</span>
                      </a>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* ── GALLERY LINK ──────────────────────────────────────── */}
        {galleryHref && (
          <>
            <Sep />
            <section className="v2-cp-section" aria-labelledby="ideas-h">
              <div className="v2-container">
                <Link href={galleryHref} className={m.galleryCard}>
                  <span className={m.galleryStrip} aria-hidden>
                    {strip.map((img) => (
                      <span key={img.src} className={m.galleryThumb}>
                        <Image src={img.src} alt="" fill sizes="240px" />
                      </span>
                    ))}
                  </span>
                  <span className={m.galleryText}>
                    <span className="v2-label">Need ideas first?</span>
                    <span id="ideas-h" className={m.galleryTitle}>
                      {p.name} thumbnail ideas: {realExamples(p).length} examples, the colours and {p.layouts.length} layouts
                    </span>
                    <span className={m.galleryGo}>
                      Open the style guide <span aria-hidden>→</span>
                    </span>
                  </span>
                </Link>
              </div>
            </section>
          </>
        )}

        <Sep />

        {/* ── FAQ ───────────────────────────────────────────────── */}
        <section className="v2-cp-section" aria-labelledby="faq-h">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">FAQ</span>
              <h2 id="faq-h" className="v2-cp-section-h2">
                {p.name} thumbnail maker: questions
              </h2>
            </ScrollReveal>
            <div className={`v2-faq ${s.faq}`}>
              {maker.faq.map((f) => (
                <details key={f.q} className="v2-faq-item">
                  <summary className="v2-faq-q">{f.q}</summary>
                  <div className="v2-faq-a">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── OTHER GAMES ───────────────────────────────────────── */}
        {otherGames.length > 0 && (
          <>
            <Sep />
            <section className="v2-cp-section" aria-labelledby="games-h">
              <div className="v2-container">
                <div className={g.moreHead}>
                  <div>
                    <span className="v2-label">More games</span>
                    <h2 id="games-h" className="v2-cp-section-h2">
                      Thumbnails for other games
                    </h2>
                  </div>
                  <Link href={`${BASE_PATH}/${GAMING_HUB_SLUG}`} className={g.seeAll}>
                    All gaming thumbnails <span aria-hidden>→</span>
                  </Link>
                </div>
                <ul className={g.moreGames}>
                  {otherGames.map((og) => {
                    const cover = realExamples(og)[0];
                    const other = getMakerForGame(og.slug);
                    // Prefer the game's maker page when it exists and may be linked.
                    const href = other && (makerIsLive(other) || !live) ? makerPath(og.slug) : `${BASE_PATH}/${og.slug}`;
                    return (
                      <li key={og.slug}>
                        <Link href={href} className={g.moreGame}>
                          <span className={g.thumb}>
                            <Image src={cover.src} alt={cover.alt} fill sizes="(max-width: 900px) 60vw, 280px" className={g.thumbImg} />
                          </span>
                          <span className={g.moreGameName}>
                            {og.name} {other ? 'thumbnail maker' : 'thumbnails'}
                          </span>
                          <span className={g.moreGameMeta}>{realExamples(og).length} examples</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className={`${s.tools} ${m.tools}`}>
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

        {/* ── CTA ───────────────────────────────────────────────── */}
        <section className={s.ctaBand} aria-labelledby="cta-h">
          <div className="v2-container">
            <div className={s.ctaInner}>
              <span className="v2-label">Base.Tube Studio</span>
              <h2 id="cta-h" className={s.ctaH2}>
                Your next {p.name} video
                <br />
                <em>deserves three good ideas.</em>
              </h2>
              <p className={s.ctaText}>
                Describe the video, get three thumbnails in your style, change anything in plain words, and test them with YouTube
                Test &amp; Compare.
              </p>
              <div className={s.ctaActions}>
                <a className="v2-btn v2-btn-primary v2-btn-primary--lg" href={studio('footer')} {...NEW_TAB}>
                  Make my {p.name} thumbnail <span aria-hidden>→</span>
                  <span className={s.srOnly}> (opens the Base.Tube Studio in a new tab)</span>
                </a>
                <Link className="v2-btn v2-btn-ghost" href="/youtube-channel-audit">
                  Free channel audit
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Sep />
      <Footer />
    </div>
  );
}
