import Link from 'next/link';
import NavBar from '../NavBar';
import Footer from '../Footer';
import ThumbnailIdeasStrip from '@/components/v2/thumbnail-pages/ThumbnailIdeasStrip';
import ScrollReveal from '../ScrollReveal';
import FontPreview from './FontPreview';
import ThumbText, { type ResolvedFont } from './ThumbText';
import { FONT_FAMILY } from './fonts';
import {
  CHECKED_ON_ISO,
  CHECKED_ON_LABEL,
  FAQ,
  FONTS,
  GROUPS,
  LICENCE_NAME,
  MISTAKES,
  NICHES,
  RELATED_TOOLS,
  STUDIO_AUDIT_URL,
  STUDIO_GENERATE_URL,
} from './content';
import s from './thumbnail-fonts.module.css';

const MS_FONT_FAQ_URL = 'https://learn.microsoft.com/en-us/typography/fonts/font-faq';
const MS_FONT_LIST_URL = 'https://learn.microsoft.com/en-us/typography/fonts/windows_11_font_list';
const GOOGLE_FONTS_FAQ_URL = 'https://fonts.google.com/faq';
const GOOGLE_FONTS_REPO_URL = 'https://github.com/google/fonts';

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

const RESOLVED: ResolvedFont[] = FONTS.map((f) => ({
  id: f.id,
  name: f.name,
  family: FONT_FAMILY[f.id],
  weight: f.weight,
  capWidth: f.capWidth,
  url: f.url,
}));
const RESOLVED_BY_ID = new Map(RESOLVED.map((f) => [f.id, f]));

export default function ThumbnailFontsPage() {
  return (
    <div className={`v2-root ${s.root}`}>
      <div className="v2-grain" aria-hidden />
      <NavBar />

      <main style={{ paddingTop: 56 }}>
        {/* ── HERO + PREVIEW ───────────────────────────────── */}
        <section className={`v2-tool-hero ${s.hero}`}>
          <div className="v2-container">
            <ScrollReveal>
              <div className="v2-tool-eyebrow">
                <Link href="/tools" className="v2-tool-breadcrumb">
                  ← All tools
                </Link>
                <span className="v2-feature-tag orange" style={{ marginBottom: 0 }}>
                  Free · All fonts free for commercial use
                </span>
              </div>

              <h1 className={`v2-cp-h1 ${s.h1}`}>
                Best YouTube thumbnail fonts:{' '}
                <br />
                <em>14 free fonts, live preview</em>
              </h1>
              <p className={s.answer}>
                A good thumbnail font is <strong>very heavy</strong>, has <strong>simple capitals</strong> and stays
                clear when the thumbnail is small. These 14 fonts do that. All are free on Google Fonts and allowed on
                monetized channels. Type your words below to see them in every font, at the size people really see.
              </p>
              <p className={s.jump}>
                <a href="#preview">Live preview</a>
                <a href="#fonts">The 14 fonts</a>
                <a href="#impact">Impact and other fonts</a>
                <a href="#guide">How to use them</a>
                <a href="#faq">FAQ</a>
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className={s.toolSection} id="preview">
          <div className="v2-container">
            <ScrollReveal>
              <h2 className={s.toolTitle}>Try your text in every font</h2>
            </ScrollReveal>
            <FontPreview fonts={RESOLVED} />
          </div>
        </section>

        <Sep />

        {/* ── THE FONTS ────────────────────────────────────── */}
        <section className={s.section} id="fonts">
          <div className="v2-container">
            <SectionHead label="The fonts" title="14 free fonts that work in thumbnails.">
              <p>
                Grouped by look. Every font is on Google Fonts under an open licence that allows commercial use. We
                checked each link and licence on <time dateTime={CHECKED_ON_ISO}>{CHECKED_ON_LABEL}</time>.
              </p>
            </SectionHead>

            {GROUPS.map((g) => {
              const fonts = FONTS.filter((f) => f.group === g.id);
              return (
                <div key={g.id} className={s.group}>
                  <ScrollReveal>
                    <div className={s.groupHead}>
                      <h3 className={s.groupTitle}>{g.title}</h3>
                      <p className={s.groupIntro}>{g.intro}</p>
                    </div>
                  </ScrollReveal>
                  <div className={s.cards}>
                    {fonts.map((f, i) => {
                      const resolved = RESOLVED_BY_ID.get(f.id);
                      if (!resolved) return null;
                      return (
                        <ScrollReveal key={f.id} delay={i * 60}>
                          <article className={s.card} id={`font-${f.id}`}>
                            <ThumbText
                              text={f.sample}
                              font={resolved}
                              fill={f.colorway.fill}
                              outline={f.colorway.outline}
                              background={f.colorway.bg}
                            />
                            <div className={s.cardBody}>
                              <h4 className={s.cardName}>
                                {f.name}
                                {f.weightLabel && <span className={s.cardWeight}> {f.weightLabel}</span>}
                              </h4>
                              <p className={s.cardMeta}>
                                By {f.designer} · {LICENCE_NAME[f.licence]}
                              </p>
                              <p className={s.cardText}>{f.why}</p>
                              <p className={s.cardText}>
                                <strong>Best for:</strong> {f.bestFor}
                              </p>
                              <a
                                href={f.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`v2-btn v2-btn-ghost ${s.cardBtn}`}
                              >
                                Get {f.name} on Google Fonts ↗
                              </a>
                            </div>
                          </article>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <Sep />

        {/* ── IMPACT & NON-GOOGLE FONTS ────────────────────── */}
        <section className={s.section} id="impact">
          <div className="v2-container">
            <SectionHead label="Other fonts" title="Impact, Arial Black and fonts from other sites.">
              <p>
                Some well-known thumbnail fonts are not on Google Fonts. You can still use some of them, as long as you
                respect their licence. We do not link to downloads for these.
              </p>
            </SectionHead>
            <ScrollReveal>
              <div className={s.prose}>
                <h3 className={s.h3}>Impact and Arial Black</h3>
                <p>
                  Both come with Windows (they are on{' '}
                  <a href={MS_FONT_LIST_URL} target="_blank" rel="noopener noreferrer" className={s.inlineLink}>
                    Microsoft&apos;s Windows 11 font list
                  </a>
                  ) and with macOS. If they are already on your computer, you can use them in thumbnails.{' '}
                  <a href={MS_FONT_FAQ_URL} target="_blank" rel="noopener noreferrer" className={s.inlineLink}>
                    Microsoft&apos;s font FAQ
                  </a>{' '}
                  treats image files made with Windows fonts like printed output and does not restrict how you use
                  them, unless your editing app is licensed for home, student or non-commercial use. The same FAQ says
                  you may not copy or share the font files, so do not download Impact from free-font sites. On a Mac,
                  Apple&apos;s software licence covers the copy that came with it.
                </p>
                <p>
                  If you want the Impact look without depending on one computer, Anton is the closest free match on
                  this page.
                </p>
                <h3 className={s.h3}>Fonts from free-font download sites</h3>
                <p>
                  Many fonts on sites that collect free fonts are free for personal use only. A monetized channel, or a
                  thumbnail you make for a client, is commercial use. Read the licence file that comes with the font
                  before you use it. If there is no licence, or it says &quot;personal use&quot;, pick a Google Font
                  instead. The{' '}
                  <a href={GOOGLE_FONTS_FAQ_URL} target="_blank" rel="noopener noreferrer" className={s.inlineLink}>
                    Google Fonts FAQ
                  </a>{' '}
                  says its fonts are open source and can be used in commercial work.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── GUIDE ────────────────────────────────────────── */}
        <section className={s.section} id="guide">
          <div className="v2-container">
            <SectionHead label="Guide" title="How to make thumbnail text people can read." />
            <ScrollReveal>
              <div className={s.prose}>
                <h3 className={s.h3}>What makes a font readable at phone size</h3>
                <p>
                  Most people see your thumbnail small. In{' '}
                  <Link href="/youtube-thumbnail-size" className={s.inlineLink}>
                    our measurements
                  </Link>
                  , a phone feed shows it 390 pixels wide and the up-next list on a computer only 248 pixels wide. At
                  that size, three things decide whether a font survives:
                </p>
                <ul className={s.list}>
                  <li>
                    <strong>Weight.</strong> Thick strokes stay visible. Thin strokes turn into grey lines. Always use
                    the heaviest weight you have.
                  </li>
                  <li>
                    <strong>Simple letter shapes.</strong> Open, plain capitals are recognised fastest. Fancy details,
                    joined script and very thin parts get lost.
                  </li>
                  <li>
                    <strong>Spacing.</strong> Letters that touch or overlap merge into one shape. A little space between
                    them keeps each one readable.
                  </li>
                </ul>
                <p>
                  Write in capitals. They are all the same height, so a short word in capitals forms a solid block that
                  is easy to spot. Then check it small: the{' '}
                  <Link href="/tools/youtube-thumbnail-preview" className={s.inlineLink}>
                    thumbnail preview
                  </Link>{' '}
                  shows your full design in a mock YouTube feed.
                </p>

                <h3 className={s.h3}>Outline and shadow</h3>
                <p>
                  An outline separates the letters from whatever is behind them. Without one, white text on a bright
                  photo, or yellow text on a sky, simply disappears. Use a dark outline around light text, or a light
                  one around dark text. Make it thick enough to see at phone size: a thin line that looks fine on your
                  monitor is gone in the feed.
                </p>
                <p>
                  A drop shadow adds depth and lifts the words off the image. A hard shadow, offset down and to the
                  side in the outline colour, gives a bold 3D look. A soft, blurred
                  shadow works better on calm backgrounds. Try both in the preview above with the Drop shadow switch.
                </p>

                <h3 className={s.h3}>How many words</h3>
                <p>
                  As few as you can. Each extra word makes all the words smaller, because they have to share the same
                  width. One to four words is the usual range. Do not repeat the title: it is printed right under the
                  thumbnail. Use the text to add what the title does not say, such as a number, a result or a feeling.
                  Type a long phrase in the preview and watch the letters shrink; that is what happens in the feed.
                </p>

                <h3 className={s.h3}>Pairing two fonts</h3>
                <p>
                  One font is usually enough. If you want to set off one word, a number or a name, add a second font
                  that is clearly different, not just slightly different. Pairs that work:
                </p>
                <ul className={s.list}>
                  <li>A condensed font for the phrase with a rounded or comic font for one key word (Anton with Luckiest Guy).</li>
                  <li>A heavy sans with a marker font for a handwritten-looking note (Montserrat Black with Permanent Marker).</li>
                  <li>The same font in two colours, which often looks cleaner than two fonts.</li>
                </ul>
                <p>Keep the main word in the boldest, biggest style. The second font should support it, not compete.</p>

                <h3 className={s.h3}>Match the font to your niche</h3>
              </div>
            </ScrollReveal>

            <div className={s.niches}>
              {NICHES.map((n, i) => (
                <ScrollReveal key={n.name} delay={i * 50}>
                  <div className={s.niche}>
                    <h4 className={s.nicheName}>{n.name}</h4>
                    <p className={s.nicheText}>{n.advice}</p>
                    <p className={s.nicheFonts}>
                      <span>Try:</span> {n.fonts}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <div className={s.prose}>
                <p>
                  Consistency matters too. Using the same one or two fonts on every video makes your thumbnails
                  recognisable in a crowded feed. For layouts and colours that suit your font, see{' '}
                  <Link href="/youtube-thumbnail-backgrounds" className={s.inlineLink}>
                    thumbnail backgrounds
                  </Link>{' '}
                  and the{' '}
                  <Link href="/thumbnails" className={s.inlineLink}>
                    thumbnail ideas by style
                  </Link>
                  .
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── COMMON MISTAKES ──────────────────────────────── */}
        <section className={s.section} id="mistakes">
          <div className="v2-container">
            <SectionHead label="Common mistakes" title="Six font mistakes that cost you the click." />
            <div className={`v2-cp-steps ${s.mistakes}`}>
              {MISTAKES.map((m, i) => (
                <ScrollReveal key={m.title} delay={i * 50}>
                  <div className="v2-cp-step">
                    <div className="v2-cp-step-num">{String(i + 1).padStart(2, '0')}</div>
                    <div className="v2-cp-step-body">
                      <h3 className="v2-cp-step-title">{m.title}</h3>
                      <p className="v2-cp-step-detail">{m.fix}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <Sep />

        {/* ── BRIDGE ───────────────────────────────────────── */}
        <section className={s.section}>
          <div className="v2-container">
            <ScrollReveal>
              <div className={s.bridge}>
                <h2 className={`v2-cp-section-h2 ${s.h2} ${s.bridgeH}`}>A good font is one part of the thumbnail.</h2>
                <p className={s.bridgeText}>
                  The font makes the words readable. The image, the face and the idea make people click. To compare two
                  versions, put them side by side in the{' '}
                  <Link href="/tools/youtube-thumbnail-tester" className={s.inlineLink}>
                    thumbnail tester
                  </Link>
                  . To start from a draft, paste your video link or script into AI Thumbnails and get three thumbnail
                  ideas with your face and your channel&apos;s style.
                </p>
                <div className={s.bridgeLinks}>
                  <a href={STUDIO_GENERATE_URL} className={`v2-btn v2-btn-primary ${s.onAccent}`}>
                    Make a thumbnail in the Studio
                  </a>
                  <a href={STUDIO_AUDIT_URL} className="v2-btn v2-btn-ghost">
                    Run the free channel audit
                  </a>
                </div>
                <div className={s.related}>
                  <span className={s.relatedLabel}>More free tools</span>
                  <ul>
                    {RELATED_TOOLS.map((t) => (
                      <li key={t.href}>
                        <Link href={t.href}>{t.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className={s.section} id="faq">
          <div className="v2-container">
            <SectionHead label="FAQ" title="Questions about thumbnail fonts." />
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

        <Sep />

        {/* ── SOURCES ──────────────────────────────────────── */}
        <section className={`${s.section} ${s.sourcesSection}`} id="sources">
          <div className="v2-container">
            <ScrollReveal>
              <div className={s.sources}>
                <h2 className={s.h3}>Sources</h2>
                <p>
                  Fonts, designers and links: fonts.google.com. Licences: the METADATA.pb file of each font in the{' '}
                  <a href={GOOGLE_FONTS_REPO_URL} target="_blank" rel="noopener noreferrer" className={s.inlineLink}>
                    google/fonts repository
                  </a>
                  . Impact and Arial Black:{' '}
                  <a href={MS_FONT_LIST_URL} target="_blank" rel="noopener noreferrer" className={s.inlineLink}>
                    Windows 11 font list
                  </a>{' '}
                  and{' '}
                  <a href={MS_FONT_FAQ_URL} target="_blank" rel="noopener noreferrer" className={s.inlineLink}>
                    Microsoft font redistribution FAQ
                  </a>
                  . All checked on <time dateTime={CHECKED_ON_ISO}>{CHECKED_ON_LABEL}</time>.
                </p>
                <p>
                  The fonts on this page are served from base.tube, not from Google, and the preview runs in your
                  browser. Base.Tube is not affiliated with YouTube or Google. Licences can change, so check the
                  font&apos;s page before a big project.
                </p>
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
