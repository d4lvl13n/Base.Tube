import Image from 'next/image';
import Link from 'next/link';

import Footer from '../Footer';
import NavBar from '../NavBar';
import ScrollReveal from '../ScrollReveal';
import StudioCta from '../StudioCta';
import { STUDIO_AUDIT_URL } from '../thumbnail-pages/lib/config.mjs';
import { studioGenerateUrl } from '../thumbnail-pages/lib/schema.mjs';
import { InlineText, MarkdownBlocks } from '../thumbnail-pages/Markdown';
import { jsonLdString } from '../thumbnail-pages/seo';
import s from '../thumbnail-pages/thumbnails.module.css';
import c from './compare.module.css';
import type { ComparePage, Shootout } from './content';
import { buildCompareJsonLd } from './seo';
import ShootoutVote, { type VoteRound } from './ShootoutVote';

const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' } as const;

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

/** FNV-1a: a small fixed hash, the same on every build. */
function hash(text: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * The images of a test in their blind order: shuffled, and the same on every visit. The word "shuffle"
 * in the key is what spreads our own image evenly: in the 5 tests of the shootout it lands on places
 * 4, 3, 6, 1 and 2, so it is not first more often than any other tool.
 */
function blindOrder(round: Shootout['rounds'][number]) {
  const key = (img: Shootout['rounds'][number]['images'][number]) => hash(`shuffle/${round.slug}/${img.tool.slug}`);
  return [...round.images].sort((a, b) => key(a) - key(b));
}

/**
 * A comparison page built around a shootout: the same prompts pasted into several
 * AI thumbnail makers, every first result shown blind (no tool names until the visitor
 * picks one) with the exact prompt and the test date. Same look and sections as
 * ComparePage, without the two-column table.
 */
export default function ShootoutPage({ page: p, shootout: sh }: { page: ComparePage; shootout: Shootout }) {
  const ref = (where: string) => `compare-${p.slug}-${where}`;
  const studio = (where: string, prompt?: string) => studioGenerateUrl({ prompt, ref: ref(where) });
  const first = sh.rounds[0];
  const ours = (round: Shootout['rounds'][number]) => round.images.find((img) => img.tool.us)!;
  const tested = formatDate(sh.tested);
  const voteRounds: VoteRound[] = sh.rounds.map((round) => ({
    slug: round.slug,
    niche: round.niche,
    video: round.video,
    prompt: round.prompt,
    tryHref: studio(round.slug, round.prompt),
    images: blindOrder(round).map((img) => ({ src: img.src, alt: img.alt, toolName: img.tool.name, toolSlug: img.tool.slug, us: img.tool.us })),
  }));

  return (
    <div className="v2-root">
      <div className="v2-grain" aria-hidden />
      <NavBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(buildCompareJsonLd(p)) }} />

      <main style={{ paddingTop: 56 }}>
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
                    <li aria-current="page">{p.crumb}</li>
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
                  <a className="v2-btn v2-btn-ghost" href="#results">
                    Vote on the {sh.rounds.length} tests
                  </a>
                </div>
                <p className={c.updated}>
                  Tested <time dateTime={sh.tested}>{tested}</time> · Updated <time dateTime={p.updated}>{formatDate(p.updated)}</time>
                </p>
              </div>

              {/* The first test at a glance: one prompt, every tool, no names (the test below is blind). */}
              <div className={c.shotHero} aria-hidden>
                <span className={c.vsPrompt}>“{first.video}”</span>
                <div className={c.shotHeroGrid}>
                  {blindOrder(first).map((img, i) => (
                    <span key={img.src} className={c.shotHeroItem}>
                      <span className={c.shotHeroMedia}>
                        <Image src={img.src} alt="" fill sizes="200px" priority={i < 2} />
                      </span>
                    </span>
                  ))}
                </div>
                <span className={c.shotHeroName}>Which one would you click?</span>
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
                Which AI thumbnail maker should you use?
              </h2>
              <p className={c.verdictText}>
                <InlineText text={p.verdict} />
              </p>
            </div>
          </div>
        </section>

        <Sep />

        {/* ── METHOD ───────────────────────────────────────────── */}
        <section className="v2-cp-section" id="method" aria-labelledby="method-h">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">How we tested</span>
              <h2 id="method-h" className="v2-cp-section-h2">
                {sh.title}
              </h2>
              <p className={c.sectionIntro}>
                <InlineText text={sh.text} />
              </p>
            </ScrollReveal>
            <ol className={c.steps}>
              {sh.method.map((m, i) => (
                <li key={m} className={c.step}>
                  <span className={c.stepNum} aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className={c.stepText}>
                    <InlineText text={m} />
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Sep />

        {/* ── RESULTS: one block per video ─────────────────────── */}
        <section className="v2-cp-section" id="results" aria-labelledby="results-h">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">The blind test</span>
              <h2 id="results-h" className="v2-cp-section-h2">
                {sh.rounds.length} videos, {sh.tools.length} tools, no edits
              </h2>
              <p className={c.sectionIntro}>
                The names are hidden. In each test, click the thumbnail you would click on YouTube. The names appear as soon as you pick.
              </p>
            </ScrollReveal>

            <ShootoutVote rounds={voteRounds} tested={tested} />
          </div>
        </section>

        {/* ── MID-PAGE CTA ─────────────────────────────────────── */}
        <StudioCta
          title={
            <>
              Run the same test <em>on your next video.</em>
            </>
          }
          text="Describe the video or paste the link. Base.Tube gives you three thumbnail ideas with your face and your channel's style. Change anything in plain words, get a review, then download all three for YouTube Test & Compare."
          href={studio('mid')}
          images={sh.rounds.slice(0, 3).map((r) => ({ src: ours(r).src, alt: ours(r).alt }))}
        />

        <Sep />

        {/* ── THE TOOLS ────────────────────────────────────────── */}
        <section className="v2-cp-section" id="tools" aria-labelledby="tools-h">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">The tools</span>
              <h2 id="tools-h" className="v2-cp-section-h2">
                The {sh.tools.length} AI thumbnail makers at a glance
              </h2>
            </ScrollReveal>
            <div className={c.toolsWrap}>
              <table className={c.tools}>
                <caption className={s.srOnly}>The AI thumbnail makers in this test, as of {tested}</caption>
                <thead>
                  <tr>
                    <th scope="col">Tool</th>
                    <th scope="col">You start from</th>
                    <th scope="col">Your face</th>
                    <th scope="col">Price</th>
                    <th scope="col">To try it</th>
                    <th scope="col">Plan in this test</th>
                  </tr>
                </thead>
                <tbody>
                  {sh.tools.map((t) => (
                    <tr key={t.slug} className={t.us ? c.toolsUs : undefined}>
                      <th scope="row">{t.name}</th>
                      <td>
                        <InlineText text={t.start} />
                      </td>
                      <td>
                        <InlineText text={t.face} />
                      </td>
                      <td>
                        <InlineText text={t.price} />
                      </td>
                      <td>
                        <InlineText text={t.free} />
                      </td>
                      <td>
                        <InlineText text={t.plan} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={c.tableNote}>
              Features and prices as listed on each tool&apos;s site on {tested}. They change, so check before you pay for a plan.
            </p>
          </div>
        </section>

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
                AI thumbnail makers: questions
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
                Judge it on your own video,
                <br />
                <em>not on our examples.</em>
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
      <Footer />
    </div>
  );
}
