'use client';

import Link from 'next/link';
import NavBar from '../NavBar';
import Footer from '../Footer';
import ThumbnailIdeasStrip from '@/components/v2/thumbnail-pages/ThumbnailIdeasStrip';
import ScrollReveal from '../ScrollReveal';
import StudioCta from '../StudioCta';
import s from '../thumbnail-size/thumbnail-size.module.css';
import b from './banner-size.module.css';
import BannerChecker from './BannerChecker';
import DeviceDiagram from './DeviceDiagram';
import {
  DESKTOP_STEPS,
  FAQ,
  MISTAKES,
  PHONE_STEPS,
  QUICK_ANSWERS,
  RELATED,
  STUDIO_GENERATE_URL,
  type Step,
} from './content';
import {
  CHECKED_ON_ISO,
  CHECKED_ON_LABEL,
  DESKTOP_STRIP,
  SAFE_AT_RECOMMENDED,
  SOURCE_NAME,
  SOURCE_URL,
  SPEC,
} from './specs';
import { useBannerUpload } from './useBannerUpload';

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

function Steps({ steps }: { steps: Step[] }) {
  return (
    <div className={`v2-cp-steps ${s.mistakes}`}>
      {steps.map((step, i) => (
        <ScrollReveal key={step.title} delay={i * 50}>
          <div className="v2-cp-step">
            <div className="v2-cp-step-num">{String(i + 1).padStart(2, '0')}</div>
            <div className="v2-cp-step-body">
              <h3 className="v2-cp-step-title">{step.title}</h3>
              <p className="v2-cp-step-detail">{step.detail}</p>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}

function SourceLink({ children = 'YouTube Help' }: { children?: React.ReactNode }) {
  return (
    <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className={s.inlineLink}>
      {children}
    </a>
  );
}

export default function BannerSizePage() {
  const { upload, error, busy, loadFile, loadSample, clear } = useBannerUpload();

  return (
    <div className={`v2-root ${s.root}`}>
      <div className="v2-grain" aria-hidden />
      <NavBar />

      <main style={{ paddingTop: 56 }}>
        {/* ── ANSWER + CHECKER ─────────────────────────────── */}
        <section className={`v2-tool-hero ${s.hero}`}>
          <div className="v2-container">
            <ScrollReveal>
              <div className="v2-tool-eyebrow">
                <Link href="/tools" className="v2-tool-breadcrumb">
                  ← All tools
                </Link>
                <span className="v2-feature-tag orange" style={{ marginBottom: 0 }}>
                  Free · Nothing leaves your device
                </span>
              </div>

              <h1 className={`v2-cp-h1 ${s.h1}`}>
                YouTube banner size:{' '}
                <br />
                <em>2560 × 1440 pixels</em>
              </h1>
            </ScrollReveal>

            <div className={s.heroGrid}>
              <ScrollReveal className={s.gridAnswer}>
                <p className={s.answer}>
                  The YouTube banner size is <strong>2560 × 1440 pixels</strong>, in a <strong>16:9</strong> aspect
                  ratio. The minimum is <strong>2048 × 1152</strong>. Keep the file at <strong>6 MB or smaller</strong>.
                  Put your text and logo in the centred <strong>safe area</strong>: 1235 × 338 pixels on a 2048 × 1152
                  banner. Text outside it can be cut off.
                </p>
                <p className={s.source}>
                  Source: <SourceLink />. Last checked: <time dateTime={CHECKED_ON_ISO}>{CHECKED_ON_LABEL}</time>.
                </p>
              </ScrollReveal>

              <ScrollReveal className={s.gridChecker} delay={120}>
                <BannerChecker
                  upload={upload}
                  error={error}
                  busy={busy}
                  onFile={loadFile}
                  onSample={loadSample}
                  onClear={clear}
                />
              </ScrollReveal>

              <ScrollReveal className={s.gridSpec} delay={60}>
                <dl className={s.specs}>
                  <div className={s.specRow}>
                    <dt>Recommended</dt>
                    <dd>
                      2560 × 1440 px
                      <span className={s.specNote}>&quot;especially for TV&quot;</span>
                    </dd>
                  </div>
                  <div className={s.specRow}>
                    <dt>Minimum</dt>
                    <dd>
                      2048 × 1152 px
                      <span className={s.specNote}>1024 × 576 is too small</span>
                    </dd>
                  </div>
                  <div className={s.specRow}>
                    <dt>Aspect ratio</dt>
                    <dd>16:9</dd>
                  </div>
                  <div className={s.specRow}>
                    <dt>Safe area</dt>
                    <dd>
                      1235 × 338 px
                      <span className={s.specNote}>
                        at minimum size · about {SAFE_AT_RECOMMENDED.w} × {SAFE_AT_RECOMMENDED.h} at 2560 × 1440
                      </span>
                    </dd>
                  </div>
                  <div className={s.specRow}>
                    <dt>Maximum file size</dt>
                    <dd>6 MB</dd>
                  </div>
                </dl>

                <p className={s.jump}>
                  <a href="#quick-answers">Quick answers</a>
                  <a href="#devices">TV, computer, phone</a>
                  <a href="#specs">Spec table</a>
                  <a href="#upload">How to change it</a>
                  <a href="#faq">FAQ</a>
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <Sep />

        {/* ── QUICK ANSWERS ────────────────────────────────── */}
        <section className={`${s.section} ${s.quickSection}`} id="quick-answers">
          <div className="v2-container">
            <SectionHead label="Quick answers" title="YouTube banner size, at a glance." />
            <ScrollReveal>
              <dl className={s.quick}>
                {QUICK_ANSWERS.map((item) => (
                  <div key={item.q} className={s.quickItem}>
                    <dt>{item.q}</dt>
                    <dd>{item.a}</dd>
                  </div>
                ))}
              </dl>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── DEVICES ──────────────────────────────────────── */}
        <section className={s.section} id="devices">
          <div className="v2-container">
            <SectionHead label="Banner size for all devices" title="One image. Each screen shows a different part.">
              <p>
                You upload a single banner and YouTube uses it everywhere. A TV shows all of it. A computer shows a
                wide strip through the middle. Phones and tablets show that strip smaller and can cut its sides. Pick a
                screen to see what it shows{upload ? ' on your image' : ''}. Drawn to scale.
              </p>
            </SectionHead>
            <ScrollReveal>
              <DeviceDiagram image={upload} />
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── SPEC TABLE ───────────────────────────────────── */}
        <section className={s.section} id="specs">
          <div className="v2-container">
            <SectionHead label="The numbers" title="Every banner size and limit in one place.">
              <p>
                Upload rules come from <SourceLink />, checked {CHECKED_ON_LABEL}. The computer strip is our own
                reading of the banner image youtube.com loads on a channel page, on the same day.
              </p>
            </SectionHead>

            <ScrollReveal>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <caption className={s.tableCap}>YouTube banner dimensions</caption>
                  <thead>
                    <tr>
                      <th scope="col">What</th>
                      <th scope="col">Size</th>
                      <th scope="col">Where it comes from</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Recommended upload</th>
                      <td><span className={s.nowrap}>2560 × 1440 px</span></td>
                      <td>YouTube Help, &quot;especially for TV&quot;</td>
                    </tr>
                    <tr>
                      <th scope="row">Minimum upload</th>
                      <td><span className={s.nowrap}>2048 × 1152 px</span></td>
                      <td>YouTube Help</td>
                    </tr>
                    <tr>
                      <th scope="row">Aspect ratio</th>
                      <td>16:9</td>
                      <td>YouTube Help</td>
                    </tr>
                    <tr>
                      <th scope="row">Maximum file size</th>
                      <td>6 MB</td>
                      <td>YouTube Help</td>
                    </tr>
                    <tr>
                      <th scope="row">Safe area for text and logos</th>
                      <td><span className={s.nowrap}>1235 × 338 px</span> on a 2048 × 1152 banner</td>
                      <td>YouTube Help</td>
                    </tr>
                    <tr>
                      <th scope="row">Same safe area at 2560 × 1440</th>
                      <td><span className={s.nowrap}>about {SAFE_AT_RECOMMENDED.w} × {SAFE_AT_RECOMMENDED.h} px</span></td>
                      <td>Our arithmetic: 1235 × 338 times 1.25</td>
                    </tr>
                    <tr>
                      <th scope="row">TV</th>
                      <td>The whole image</td>
                      <td>YouTube Help: fills the screen on larger devices</td>
                    </tr>
                    <tr>
                      <th scope="row">Computer</th>
                      <td>
                        <span className={s.nowrap}>{DESKTOP_STRIP.measuredW} × {DESKTOP_STRIP.measuredH} px</span>{' '}
                        strip from a 2560 × 1440 banner
                      </td>
                      <td>Our reading of youtube.com, {CHECKED_ON_LABEL}</td>
                    </tr>
                    <tr>
                      <th scope="row">Phone and tablet</th>
                      <td>The middle strip, sides can be cut</td>
                      <td>YouTube Help gives no exact size</td>
                    </tr>
                    <tr>
                      <th scope="row">File format</th>
                      <td>Not listed for banners</td>
                      <td>YouTube Help names none</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className={s.tableNote}>
                The safe area sits in the exact centre: 60.3% of the width and 29.3% of the height. The computer strip
                is {DESKTOP_STRIP.heightPct.toFixed(1)}% of the height, so on a computer the safe area&apos;s top and
                bottom are almost exactly the strip&apos;s edges. Anything above or below never shows there.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ── MID-PAGE CTA ─────────────────────────────────── */}
        <StudioCta
          title={
            <>
              New banner done? <em>Now match your thumbnails.</em>
            </>
          }
          text="Your banner greets people who already found you. Thumbnails are how they find you. Base.Tube gives you three thumbnail ideas per video, with your face and your channel's style. Change anything in plain words, then download them for YouTube Test & Compare."
          href={STUDIO_GENERATE_URL}
          images={[
            { src: '/thumbnails/fortnite/01-victory.webp', alt: 'Fortnite victory thumbnail' },
            { src: '/thumbnails/minecraft/03-100-days.webp', alt: 'Minecraft 100 days thumbnail' },
            { src: '/thumbnails/zamn/02-speech-bubble.webp', alt: 'Speech bubble reaction thumbnail' },
          ]}
        />

        <Sep />

        {/* ── 1024 x 576 / 2048 x 1152 ─────────────────────── */}
        <section className={s.section} id="sizes-compared">
          <div className="v2-container">
            <SectionHead label="2048 × 1152 and 1024 × 576" title="Minimum, recommended, and too small.">
              <p>
                <strong>2048 × 1152</strong> is the smallest banner YouTube accepts. It is fine, and the safe area is
                measured at this size. <strong>2560 × 1440</strong> is what YouTube recommends, for sharper banners on
                big screens. <strong>1024 × 576</strong> is half the minimum in each direction, a quarter of the
                pixels. YouTube Help does not mention it. If your design is that size, rebuild it at 2560 × 1440.
              </p>
            </SectionHead>
            <ScrollReveal>
              <div className={b.scale} role="img" aria-label="Three banner sizes drawn to scale: 2560 by 1440, 2048 by 1152, and 1024 by 576">
                <div className={`${b.scaleBox} ${b.scaleRec}`}>
                  <span>
                    {SPEC.recommendedW} × {SPEC.recommendedH}
                    <small>recommended</small>
                  </span>
                </div>
                <div className={`${b.scaleBox} ${b.scaleMin}`}>
                  <span>
                    {SPEC.minW} × {SPEC.minH}
                    <small>minimum</small>
                  </span>
                </div>
                <div className={`${b.scaleBox} ${b.scaleLow}`}>
                  <span>
                    1024 × 576
                    <small>below minimum</small>
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── COMMON MISTAKES ──────────────────────────────── */}
        <section className={s.section} id="mistakes">
          <div className="v2-container">
            <SectionHead label="Common mistakes" title="Six ways a banner goes wrong." />
            <Steps steps={MISTAKES.map((m) => ({ title: m.title, detail: m.fix }))} />
          </div>
        </section>

        <Sep />

        {/* ── HOW TO UPLOAD ────────────────────────────────── */}
        <section className={s.section} id="upload">
          <div className="v2-container">
            <SectionHead label="How to change your banner" title="On a computer, in four steps.">
              <p>
                These are the steps in <SourceLink />. You can also use the phone app, below.
              </p>
            </SectionHead>
            <Steps steps={DESKTOP_STEPS} />

            <div style={{ marginTop: 64 }}>
              <SectionHead label="On a phone" title="In the YouTube app, Android or iPhone." />
              <Steps steps={PHONE_STEPS} />
            </div>
          </div>
        </section>

        <Sep />

        {/* ── RELATED ──────────────────────────────────────── */}
        <section className={s.section} id="related">
          <div className="v2-container">
            <SectionHead label="Related" title="Banner done. Now the thumbnails." />
            <ScrollReveal>
              <ul className={s.nextGrid}>
                {RELATED.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className={s.nextCard}>
                      <span className={s.nextTitle}>{n.title}</span>
                      <span className={s.nextText}>{n.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── CTA BAND ─────────────────────────────────────── */}
        <section className={s.section}>
          <div className="v2-container">
            <ScrollReveal>
              <div className={s.bridge}>
                <h2 className={`v2-cp-section-h2 ${s.h2} ${s.bridgeH}`}>The banner gets a visit. Thumbnails get the click.</h2>
                <p className={s.bridgeText}>
                  People see your banner once they are already on your channel. They find you through thumbnails. The
                  Base.Tube Studio makes YouTube thumbnails from a short description of your video, at the right size.
                </p>
                <div className={s.bridgeLinks}>
                  <a href={STUDIO_GENERATE_URL} className={`v2-btn v2-btn-primary ${s.onAccent}`}>
                    Make a thumbnail in the Studio
                  </a>
                  <Link href="/tools" className="v2-btn v2-btn-ghost">
                    See all free tools
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className={s.section} id="faq">
          <div className="v2-container">
            <SectionHead label="FAQ" title="Questions about banner size." />
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
                <div>
                  <h2 className={s.h3}>Sources</h2>
                  <p>
                    Upload rules: <SourceLink>{SOURCE_NAME}</SourceLink>. Last checked:{' '}
                    <time dateTime={CHECKED_ON_ISO}>{CHECKED_ON_LABEL}</time>.
                  </p>
                  <p>
                    Computer strip: on {CHECKED_ON_LABEL} we read the banner image youtube.com loads on a channel
                    page. It is cropped to the full width and the middle {DESKTOP_STRIP.heightPct.toFixed(1)}% of the
                    height; a 2560 × 1440 banner came back as {DESKTOP_STRIP.measuredW} × {DESKTOP_STRIP.measuredH}{' '}
                    pixels. The mobile site loads the same strip.
                  </p>
                  <p>
                    Your image is read in your browser and is never uploaded. The checker counts 1 MB as 1,000,000
                    bytes, the stricter reading, so a pass on file size is a safe pass.
                  </p>
                </div>
                <div>
                  <h2 className={s.h3}>Changelog</h2>
                  <ul className={s.changelog}>
                    <li>
                      <span className={s.changeDate}>{CHECKED_ON_LABEL}</span>
                      <span>
                        Page published. Every upload rule checked against YouTube Help. The computer strip read from
                        youtube.com.
                      </span>
                    </li>
                  </ul>
                </div>
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
