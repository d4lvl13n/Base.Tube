'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import NavBar from '../NavBar';
import Footer from '../Footer';
import ScrollReveal from '../ScrollReveal';
import Checker from './Checker';
import RealSizePreview, { type PreviewImage } from './RealSizePreview';
import SafeZone from './SafeZone';
import sample from './sample-thumbnail.jpg';
import s from './thumbnail-size.module.css';
import {
  CHANGELOG,
  FAQ,
  MISTAKES,
  RELATED_TOOLS,
  STUDIO_AUDIT_URL,
  STUDIO_GENERATE_URL,
} from './content';
import { CHECKED_ON_ISO, CHECKED_ON_LABEL, MEASURED, SOURCE_NAME, SOURCE_URL, type Mode } from './specs';
import { useThumbnailUpload } from './useThumbnailUpload';

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

export default function ThumbnailSizePage() {
  const [mode, setMode] = useState<Mode>('video');
  const { upload, error, busy, loadFile, loadSample, clear } = useThumbnailUpload(sample.src);

  const preview: PreviewImage = useMemo(
    () =>
      upload
        ? { url: upload.url, name: upload.name, width: upload.width, height: upload.height, isSample: false }
        : { url: sample.src, name: 'sample-thumbnail.jpg', width: sample.width, height: sample.height, isSample: true },
    [upload],
  );

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
                YouTube thumbnail size:{' '}
                <br />
                <em>3840 × 2160 pixels</em>
              </h1>
            </ScrollReveal>

            <div className={s.heroGrid}>
              <ScrollReveal className={s.gridAnswer}>
                <p className={s.answer}>
                  YouTube recommends <strong>3840 × 2160 pixels</strong> in a <strong>16:9</strong> frame. The older
                  1280 × 720 still works. Keep the file under <strong>2 MB</strong> if you upload from the phone app, or{' '}
                  <strong>50 MB</strong> on a computer. Use <strong>JPG or PNG</strong>.
                </p>
                <p className={s.source}>
                  Source:{' '}
                  <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className={s.inlineLink}>
                    YouTube Help
                  </a>
                  . Last checked: <time dateTime={CHECKED_ON_ISO}>{CHECKED_ON_LABEL}</time>.
                </p>
              </ScrollReveal>

              <ScrollReveal className={s.gridChecker} delay={120}>
                <Checker
                  mode={mode}
                  onModeChange={setMode}
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
                    <dt>Resolution</dt>
                    <dd>
                      3840 × 2160 px
                      <span className={s.specNote}>1280 × 720 still meets the rules</span>
                    </dd>
                  </div>
                  <div className={s.specRow}>
                    <dt>Aspect ratio</dt>
                    <dd>
                      16:9
                      <span className={s.specNote}>9:16 for Shorts</span>
                    </dd>
                  </div>
                  <div className={s.specRow}>
                    <dt>Minimum width</dt>
                    <dd>
                      640 px
                      <span className={s.specNote}>640 px tall for Shorts</span>
                    </dd>
                  </div>
                  <div className={s.specRow}>
                    <dt>Maximum file size</dt>
                    <dd>
                      2 MB in the phone app
                      <span className={s.specNote}>50 MB on a computer</span>
                    </dd>
                  </div>
                  <div className={s.specRow}>
                    <dt>Format</dt>
                    <dd>
                      JPG or PNG
                      <span className={s.specNote}>as named by YouTube Help</span>
                    </dd>
                  </div>
                </dl>

                <p className={s.jump}>
                  <a href="#real-size">Real-size preview</a>
                  <a href="#safe-zone">Safe zone</a>
                  <a href="#specs">Spec tables</a>
                  <a href="#faq">FAQ</a>
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <Sep />

        {/* ── REAL SIZE ────────────────────────────────────── */}
        <section className={s.section} id="real-size">
          <div className="v2-container">
            <SectionHead label="At real size" title="Viewers see it much smaller.">
              {mode === 'video' ? (
                <p>
                  A 3840 × 2160 file is shown at 500 pixels wide in search on a computer and 248 pixels wide in the
                  up-next list. This is your image at those sizes, next to a video length label.
                </p>
              ) : (
                <p>
                  A 2160 × 3840 Shorts thumbnail is shown 175 pixels wide in the Shorts shelf on phone search. This is
                  your image at that size.
                </p>
              )}
            </SectionHead>
            <ScrollReveal>
              <RealSizePreview image={preview} mode={mode} />
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── SAFE ZONE ────────────────────────────────────── */}
        <section className={s.section} id="safe-zone">
          <div className="v2-container">
            <SectionHead label="Safe zone" title="Keep the bottom-right corner clear.">
              <p>
                YouTube lays the video length over the bottom-right corner. Anything important underneath is hidden.
                Here is how much room to leave.
              </p>
            </SectionHead>
            <ScrollReveal>
              <SafeZone image={preview} />
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── SPEC TABLES ──────────────────────────────────── */}
        <section className={s.section} id="specs">
          <div className="v2-container">
            <SectionHead label="The numbers" title="Every size and limit in one place.">
              <p>
                Upload rules come from{' '}
                <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className={s.inlineLink}>
                  YouTube Help
                </a>
                , checked {CHECKED_ON_LABEL}. The sizes viewers see are our own measurements.
              </p>
            </SectionHead>

            <ScrollReveal>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <caption className={s.tableCap}>What to upload</caption>
                  <thead>
                    <tr>
                      <th scope="col"><span className={s.srOnly}>Setting</span></th>
                      <th scope="col">Video</th>
                      <th scope="col">Short</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Recommended resolution</th>
                      <td><span className={s.nowrap}>3840 × 2160 px</span></td>
                      <td><span className={s.nowrap}>2160 × 3840 px</span></td>
                    </tr>
                    <tr>
                      <th scope="row">Aspect ratio</th>
                      <td>16:9</td>
                      <td>9:16</td>
                    </tr>
                    <tr>
                      <th scope="row">Minimum</th>
                      <td>640 px wide</td>
                      <td>640 px tall</td>
                    </tr>
                    <tr>
                      <th scope="row">File size, phone app</th>
                      <td>2 MB</td>
                      <td>Not available. Shorts thumbnails are added in YouTube Studio on a computer.</td>
                    </tr>
                    <tr>
                      <th scope="row">File size, computer</th>
                      <td>50 MB</td>
                      <td>50 MB</td>
                    </tr>
                    <tr>
                      <th scope="row">Format</th>
                      <td>JPG or PNG</td>
                      <td>JPG or PNG</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className={s.tableNote}>
                Podcast playlists use a 1:1 thumbnail instead of 16:9, with a 10 MB limit in the phone app and 50 MB on
                a computer. Custom Shorts thumbnails also need a verified account.
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <div className={`${s.tableWrap} ${s.tableGap}`}>
                <table className={s.table}>
                  <caption className={s.tableCap}>Sizes viewers see</caption>
                  <thead>
                    <tr>
                      <th scope="col">Where</th>
                      <th scope="col">Size we measured</th>
                      <th scope="col">Shape</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Desktop search results</th>
                      <td><span className={s.nowrap}>{MEASURED.desktopSearch.w} × {MEASURED.desktopSearch.h} px</span></td>
                      <td>16:9</td>
                    </tr>
                    <tr>
                      <th scope="row">Desktop watch page, up next</th>
                      <td><span className={s.nowrap}>{MEASURED.desktopSidebar.w} × {MEASURED.desktopSidebar.h} px</span></td>
                      <td>16:9</td>
                    </tr>
                    <tr>
                      <th scope="row">Phone, search and watch list</th>
                      <td><span className={s.nowrap}>{MEASURED.mobileFeed.w} × {MEASURED.mobileFeed.h} px</span>, full width</td>
                      <td>16:9</td>
                    </tr>
                    <tr>
                      <th scope="row">Shorts shelf, phone search</th>
                      <td><span className={s.nowrap}>{MEASURED.shortsShelf.w} × {MEASURED.shortsShelf.h} px</span></td>
                      <td>2:3 box</td>
                    </tr>
                    <tr>
                      <th scope="row">Embedded player preview</th>
                      <td>Your full-size file</td>
                      <td>16:9</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className={s.tableNote}>
                Measured on youtube.com on {CHECKED_ON_LABEL} in Chrome, signed out, in a 1440 px wide window on
                desktop and a 390 px wide window on a phone. YouTube states that the embedded player uses your
                thumbnail as its preview image, which is why it asks for the largest size you can give it.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── COMMON MISTAKES ──────────────────────────────── */}
        <section className={s.section} id="mistakes">
          <div className="v2-container">
            <SectionHead label="Common mistakes" title="Six ways a correct-looking thumbnail goes wrong." />
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
                <h2 className={`v2-cp-section-h2 ${s.h2} ${s.bridgeH}`}>The right size is only step one.</h2>
                <p className={s.bridgeText}>
                  Size is a rule you can check. Whether people click a thumbnail is something no tool can predict.
                  Only the click-through rate YouTube reports on your own videos tells you. Base.Tube&apos;s free
                  channel audit shows real impressions and CTR for each video once you connect your channel.
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
            <SectionHead label="FAQ" title="Questions about thumbnail size." />
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

        {/* ── SOURCES + CHANGELOG ──────────────────────────── */}
        <section className={`${s.section} ${s.sourcesSection}`} id="sources">
          <div className="v2-container">
            <ScrollReveal>
              <div className={s.sources}>
                <div>
                  <h2 className={s.h3}>Sources</h2>
                  <p>
                    Upload rules:{' '}
                    <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className={s.inlineLink}>
                      {SOURCE_NAME}
                    </a>
                    . Last checked: <time dateTime={CHECKED_ON_ISO}>{CHECKED_ON_LABEL}</time>.
                  </p>
                  <p>
                    Sizes viewers see, and the video length label: our own measurements on youtube.com on{' '}
                    {CHECKED_ON_LABEL}. Your image is read in your browser and is never uploaded. The checker counts 1
                    MB as 1,000,000 bytes, the stricter reading, so a pass on file size is a safe pass.
                  </p>
                  <p>
                    Base.Tube is not affiliated with YouTube. YouTube can change these limits at any time, so check
                    the source before a big upload.
                  </p>
                </div>
                <div>
                  <h2 className={s.h3}>Changelog</h2>
                  <ul className={s.changelog}>
                    {CHANGELOG.map((c) => (
                      <li key={c.date}>
                        <span className={s.changeDate}>{c.date}</span>
                        <span>{c.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Sep />
      <Footer />
    </div>
  );
}
