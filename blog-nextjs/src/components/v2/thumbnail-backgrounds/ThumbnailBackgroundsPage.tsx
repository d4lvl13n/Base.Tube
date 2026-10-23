import Image from 'next/image';
import Link from 'next/link';

import Footer from '../Footer';
import ThumbnailIdeasStrip from '@/components/v2/thumbnail-pages/ThumbnailIdeasStrip';
import NavBar from '../NavBar';
import ScrollReveal from '../ScrollReveal';
import { getLoadedPage } from '../thumbnail-pages/lib/content.mjs';
import { MEASURED } from '../thumbnail-size/specs';
import BackgroundCard from './BackgroundCard';
import { BACKGROUNDS, GROUPS, USAGE_TERMS, backgroundsInGroup, backgroundSrc } from './backgrounds';
import { FAQ, studioHref } from './content';
import s from './thumbnail-backgrounds.module.css';

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

function SectionHead({ label, title, children }: { label: string; title: string; children?: React.ReactNode }) {
  return (
    <ScrollReveal>
      <div className={s.sectionHead}>
        <span className="v2-label">{label}</span>
        <h2 className={`v2-cp-section-h2 ${s.h2}`}>{title}</h2>
        {children && <div className={s.sectionLead}>{children}</div>}
      </div>
    </ScrollReveal>
  );
}

/** Links to a /thumbnails page only when that page exists (its content file is in content/thumbnails/). */
function ThumbnailPageLink({ slug, children }: { slug: string; children: React.ReactNode }) {
  if (!getLoadedPage(slug)) return <>{children}</>;
  return <Link href={`/thumbnails/${slug}`}>{children}</Link>;
}

interface Props {
  /** ids of the backgrounds whose image is ready (see availability.ts) */
  readyIds: string[];
}

export default function ThumbnailBackgroundsPage({ readyIds }: Props) {
  const ready = new Set(readyIds);
  const allReady = ready.size === BACKGROUNDS.length;
  const hero = BACKGROUNDS[0];
  const heroReady = ready.has(hero.id);

  return (
    <div className={`v2-root ${s.root}`}>
      <div className="v2-grain" aria-hidden />
      <NavBar />

      <main style={{ paddingTop: 56 }}>
        {/* ── HERO ─────────────────────────────────────────── */}
        <section className={`v2-tool-hero ${s.hero}`}>
          <div className="v2-container">
            <div className={s.heroGrid}>
              <ScrollReveal>
                <div className="v2-tool-eyebrow">
                  <Link href="/tools" className="v2-tool-breadcrumb">
                    ← All tools
                  </Link>
                  <span className="v2-feature-tag orange" style={{ marginBottom: 0 }}>
                    Free · {BACKGROUNDS.length} originals
                  </span>
                </div>

                <h1 className={`v2-cp-h1 ${s.h1}`}>
                  Free YouTube thumbnail backgrounds <em>with room for you and your title</em>
                </h1>

                <p className={s.answer}>
                  {BACKGROUNDS.length} original backgrounds made for thumbnails, not stock photos. Each one keeps its
                  detail on one side and leaves the other third <strong>calm for your face and title</strong>. The
                  bottom-right corner stays clear for the video length. Download any of them in{' '}
                  <strong>1280 × 720</strong>, or turn one into a full thumbnail in the Base.Tube Studio.
                </p>
                <p className={s.terms} id="terms">
                  <strong>Terms:</strong> {USAGE_TERMS}
                </p>

                <nav aria-label="Background groups" className={s.jump}>
                  {GROUPS.map((g) => (
                    <a key={g.id} href={`#${g.id}`}>
                      {g.title}
                    </a>
                  ))}
                  <a href="#guide">How to use them</a>
                  <a href="#faq">FAQ</a>
                </nav>
              </ScrollReveal>

              <ScrollReveal delay={120}>
                <figure className={s.demo}>
                  <div className={s.demoFrame}>
                    {heroReady ? (
                      // Decorative here: the same image is in the gallery below, with its description.
                      <Image src={backgroundSrc(hero)} alt="" fill priority sizes="(max-width: 960px) 100vw, 500px" className={s.img} />
                    ) : (
                      <div className={s.placeholder} />
                    )}
                    <div className={`${s.zone} ${hero.space === 'left' ? s.zoneLeft : s.zoneRight}`}>
                      <span>Your face and title</span>
                    </div>
                    <div className={s.zoneCorner}>
                      <span>Video length</span>
                    </div>
                  </div>
                  <figcaption className={s.demoCaption}>
                    Every background keeps one third calm (left or right, shown on each card) and the bottom-right
                    corner clear.
                  </figcaption>
                </figure>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <Sep />

        {/* ── GALLERY ──────────────────────────────────────── */}
        <section className={s.section} id="backgrounds" aria-label="Backgrounds">
          <div className="v2-container">
            {!allReady && (
              <p className={s.notice} role="status">
                The images are being made. A card shows &ldquo;Coming soon&rdquo; until its file is ready to download.
              </p>
            )}

            {GROUPS.map((g) => (
              <div key={g.id} className={s.group} id={g.id}>
                <ScrollReveal>
                  <div className={s.groupHead}>
                    <h2 className={`v2-cp-section-h2 ${s.groupTitle}`}>{g.title}</h2>
                    <p className={s.groupIntro}>{g.intro}</p>
                  </div>
                </ScrollReveal>
                <ul className={s.grid}>
                  {backgroundsInGroup(g.id).map((bg) => (
                    <BackgroundCard key={bg.id} bg={bg} ready={ready.has(bg.id)} />
                  ))}
                </ul>
              </div>
            ))}

          </div>
        </section>

        <Sep />

        {/* ── BRIDGE ───────────────────────────────────────── */}
        <section className={s.section}>
          <div className="v2-container">
            <ScrollReveal>
              <div className={s.bridge}>
                <h2 className={`v2-cp-section-h2 ${s.h2}`}>A background is half a thumbnail.</h2>
                <p className={s.bridgeText}>
                  The other half is you, your title and the idea of the video. Put them together by hand with the
                  guide below, or let the Base.Tube Studio generate the full thumbnail for you.
                </p>
                <div className={s.bridgeLinks}>
                  <a href={studioHref('bridge')} className={`v2-btn v2-btn-primary ${s.onAccent}`}>
                    Generate a full thumbnail
                  </a>
                  <Link href="/tools/youtube-thumbnail-preview" className="v2-btn v2-btn-ghost">
                    Preview your thumbnail on YouTube
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── GUIDE ────────────────────────────────────────── */}
        <section className={s.section} id="guide">
          <div className="v2-container">
            <SectionHead label="Guide" title="How to use a thumbnail background." />
            <ScrollReveal>
              <article className={s.prose}>
                <h3>Choose a background that fits your niche</h3>
                <p>
                  The background sets the mood of a thumbnail before anyone reads a word. Pick it for the feeling of the
                  video, not only its topic.
                </p>
                <ul>
                  <li>
                    <strong>Gaming:</strong> a game-like scene tells viewers the genre at a glance. The blocky voxel
                    landscape fits Minecraft builds and survival series. The cartoon island fits Fortnite and other
                    battle royale videos. For finished examples, see our{' '}
                    <ThumbnailPageLink slug="minecraft">Minecraft thumbnail ideas</ThumbnailPageLink> and{' '}
                    <ThumbnailPageLink slug="fortnite">Fortnite thumbnail ideas</ThumbnailPageLink>.
                  </li>
                  <li>
                    <strong>Stories, mysteries and warnings:</strong> a dark background with one strong light.
                  </li>
                  <li>
                    <strong>Challenges, reactions and family videos:</strong> bright colours.
                  </li>
                  <li>
                    <strong>Podcasts, interviews and tutorials:</strong> a quiet studio, desk or wall.
                  </li>
                  <li>
                    <strong>Anything else:</strong> a plain gradient in your channel colours.
                  </li>
                </ul>
                <p>
                  If you post often, reuse one or two backgrounds. Your videos then look like a set in a feed, and
                  regular viewers spot them faster.
                </p>

                <h3>Keep it simple</h3>
                <p>
                  The background is the stage, not the show. Your face or main object and a few words are what people
                  should see first. Every extra detail behind them competes for attention. In the up-next list on a
                  computer, a thumbnail is only {MEASURED.desktopSidebar.w} pixels wide, and small details turn into
                  noise at that size. That is why these backgrounds keep their detail on one side and leave the other
                  side plain.
                </p>
                <p>
                  A quick test: step back from the screen and squint at your thumbnail. If your face and your title are
                  still the first things you notice, the background is doing its job. If your eye goes to the
                  background first, pick a calmer one or blur it.
                </p>

                <h3>Blur or darken what sits behind your subject</h3>
                <p>
                  If the area behind your face is busy, it fights your face. Two quick fixes work in any editor. Blur
                  the background layer a little, so your subject is the only sharp thing. Or darken it, with a dark layer
                  at low opacity or a vignette around the edges. Both make the subject look closer to the viewer. Apply
                  them to the background layer only, never to your face or your text.
                </p>

                <h3>Make the text contrast with the background</h3>
                <p>
                  Text is read through contrast, not colour. Use light text on a dark background and dark text on a
                  light one. On the bright backgrounds here, use dark text, or white text with a thick dark outline. On
                  the dark ones, white or a strong yellow works well. If a word lands on a busy part of the image, put a
                  solid shape or a shadow behind it instead of making the text bigger. Our{' '}
                  <Link href="/youtube-thumbnail-fonts">YouTube thumbnail fonts</Link> guide covers which typefaces stay
                  readable when the thumbnail is small.
                </p>

                <h3>Leave space for the subject, the title and the video length</h3>
                <p>
                  Each background on this page keeps one third of the frame calm, on the left or the right. The card
                  tells you which side. Put your face or main object there, with your title next to it. Keep the
                  bottom-right corner empty: YouTube places the video length on top of it. Our{' '}
                  <Link href="/youtube-thumbnail-size">YouTube thumbnail size</Link> guide shows how much room to leave
                  and which size to export.
                </p>

                <h3>How to swap the background of your own thumbnail</h3>
                <p>If you already have a thumbnail and want a new background behind it:</p>
                <ol>
                  <li>Download a background from this page.</li>
                  <li>
                    Cut out your subject with the background remover in your editor. Work from the original photo, not
                    the finished thumbnail, so the edges stay clean.
                  </li>
                  <li>
                    Open the background (1280 × 720, 16:9) and place the cut-out on the calm side. Make it large: head
                    and shoulders usually read better than a full body.
                  </li>
                  <li>
                    Match the light. If the background is warm, warm the subject a little. Add a soft shadow or a thin
                    light outline so the edges do not look pasted on.
                  </li>
                  <li>Add your title on the calm side, and keep the bottom-right corner clear.</li>
                  <li>
                    Export as JPG or PNG, then check it at real size with the{' '}
                    <Link href="/tools/youtube-thumbnail-preview">YouTube thumbnail preview</Link> tool before you
                    upload.
                  </li>
                </ol>
                <p>
                  Want ideas for the full thumbnail first? Browse our <Link href="/thumbnails">thumbnail ideas</Link> by
                  game and video type.
                </p>
              </article>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className={s.section} id="faq">
          <div className="v2-container">
            <SectionHead label="FAQ" title="Questions about thumbnail backgrounds." />
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
      </main>

      <Sep />
      <ThumbnailIdeasStrip />
      <Footer />
    </div>
  );
}
