import Image from 'next/image';
import Link from 'next/link';
import NavBar from '../NavBar';
import Footer from '../Footer';
import ThumbnailIdeasStrip from '@/components/v2/thumbnail-pages/ThumbnailIdeasStrip';
import ScrollReveal from '../ScrollReveal';
import StudioCta from '../StudioCta';
import DownloaderTool from './DownloaderTool';
import { DEVICES, FAQS, PREVIEW_URL, RELATED_LINKS, STEPS, STUDIO_GENERATE_URL } from './content';
import { SIZES } from './sizes';
import s from './thumbnail-downloader.module.css';

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

export default function ThumbnailDownloaderPage() {
  return (
    <div className="v2-root">
      <div className="v2-grain" aria-hidden />
      <NavBar />

      <main style={{ paddingTop: 56 }}>
        {/* ── HERO + TOOL ──────────────────────────────────── */}
        <section className={`v2-tool-hero ${s.hero}`}>
          <div className="v2-container">
            <ScrollReveal>
              <div className="v2-tool-eyebrow">
                <Link href="/tools" className="v2-tool-breadcrumb">← All tools</Link>
                <span className="v2-feature-tag orange" style={{ marginBottom: 0 }}>Free · No signup</span>
              </div>
              <h1 className="v2-cp-h1" style={{ marginTop: 20 }}>
                YouTube thumbnail downloader:<br />
                <em>every size, one click.</em>
              </h1>
              <p className={`v2-cp-sub ${s.sub}`}>
                Paste the link of any YouTube video, Short or live stream. Get its thumbnail in all five
                sizes YouTube keeps, from 1280×720 HD down to 120×90, and save the one you need as a JPG.
              </p>
              <p className={s.shortAnswer}>
                <strong>Short answer:</strong> copy the video link, paste it below, press Get
                thumbnails, then Download under the largest size. It works the same on a computer and
                on a phone.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="v2-tool-input-area" style={{ marginTop: 0 }}>
                <DownloaderTool />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── MID-PAGE CTA ─────────────────────────────────── */}
        <StudioCta
          title={
            <>
              Don&apos;t copy it. <em>Make a better one.</em>
            </>
          }
          text="Say what your own video is about. Base.Tube gives you three thumbnail ideas with your face and your channel's style. Change anything in plain words, then download them for YouTube Test & Compare."
          href={STUDIO_GENERATE_URL}
          images={[
            { src: '/thumbnails/fortnite/01-victory.webp', alt: 'Fortnite victory thumbnail' },
            { src: '/thumbnails/minecraft/03-100-days.webp', alt: 'Minecraft 100 days thumbnail' },
            { src: '/thumbnails/zamn/02-speech-bubble.webp', alt: 'Speech bubble reaction thumbnail' },
          ]}
        />

        <Sep />

        {/* ── HOW IT WORKS ─────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">How it works</span>
              <h2 className="v2-cp-section-h2">Download a YouTube thumbnail in three steps.</h2>
            </ScrollReveal>
            <div className="v2-cp-steps" style={{ maxWidth: 860 }}>
              {STEPS.map((step, i) => (
                <ScrollReveal key={step.n} delay={i * 80}>
                  <div className="v2-cp-step">
                    <div className="v2-cp-step-num">{step.n}</div>
                    <div className="v2-cp-step-body">
                      <h3 className="v2-cp-step-title">{step.title}</h3>
                      <p className="v2-cp-step-detail">{step.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <Sep />

        {/* ── SIZES ────────────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">The five sizes</span>
              <h2 className="v2-cp-section-h2">Which thumbnail size should you download?</h2>
              <div className={s.prose} style={{ marginBottom: 32 }}>
                <p>
                  When a video is published, YouTube saves its thumbnail in several sizes, each with a
                  fixed file name. <strong>Take 1280×720 when it exists.</strong> It is the full-quality
                  image, in the same 16:9 shape as the video. If it is missing, 640×480 is the next best,
                  with black bars above and below.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <ul className={s.table}>
                {SIZES.map((z) => (
                  <li key={z.name} className={s.row}>
                    <h3 className={s.rowLabel}>
                      {z.width}×{z.height} · {z.label}
                      <span>{z.name}.jpg</span>
                    </h3>
                    <p className={s.rowText}>{z.note}</p>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── PHONE AND DESKTOP ────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">Phone or computer</span>
              <h2 className="v2-cp-section-h2">Where the downloaded thumbnail ends up.</h2>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <ul className={s.table}>
                {DEVICES.map((d) => (
                  <li key={d.label} className={s.row}>
                    <h3 className={s.rowLabel}>{d.label}</h3>
                    <p className={s.rowText}>{d.text}</p>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── FAIR USE OF A DOWNLOAD ───────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">Using what you download</span>
              <h2 className="v2-cp-section-h2">Study other thumbnails. Then make your own.</h2>
              <div className={s.prose}>
                <p>
                  Saving the thumbnails of videos that did well is one of the fastest ways to learn. Put
                  ten of them in a folder and look for what repeats: how big the face is, how many words
                  there are, which colours stand out, where the eye goes first.
                </p>
                <p>
                  Use them to plan A/B ideas. If the top videos in your niche all show a result rather
                  than a person, try one version of your thumbnail each way. Then let YouTube&apos;s own
                  test tell you which one gets more clicks.
                </p>
                <p>
                  <strong>Keep the downloads as reference, not as your thumbnail.</strong> A thumbnail
                  belongs to the creator who made it. Reposting it as yours is copying, and it does not
                  match your video anyway. Take the idea, not the image.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">FAQ</span>
              <h2 className="v2-cp-section-h2">Questions about downloading thumbnails.</h2>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <div className={s.faqWrap}>
                <div className="v2-faq">
                  {FAQS.map((item) => (
                    <details key={item.q} className="v2-faq-item">
                      <summary className="v2-faq-q">{item.q}</summary>
                      <p className="v2-faq-a">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── RELATED TOOLS ────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">More free tools</span>
              <h2 className="v2-cp-section-h2">Keep going.</h2>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <ul className={s.related}>
                {RELATED_LINKS.map((l) => (
                  <li key={l.href} className={s.relatedItem}>
                    <Link href={l.href}>
                      <span className={s.relatedLabel}>{l.label}</span>
                      <span className={s.relatedDesc}>{l.desc}</span>
                      <span className={s.relatedArrow} aria-hidden>→</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className={s.relatedAll}>
                <Link href="/tools" className={s.inlineLink}>See all free tools</Link>
              </p>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── CTA → STUDIO: their thumbnail next to yours ──── */}
        <section className={s.swap} aria-labelledby="swap-h">
          <div className="v2-container">
            <div className={s.swapCard}>
              <div className={s.swapCopy}>
                <span className="v2-label">Next step</span>
                <h2 id="swap-h" className={s.swapTitle}>
                  You have their thumbnail. Now make yours.
                </h2>
                <p className={s.swapText}>
                  Theirs was made for someone else&apos;s video. Describe yours and Base.Tube gives you three ideas
                  with your face and your channel&apos;s style. Change anything in plain words, get a review, then
                  download them for YouTube Test &amp; Compare.
                </p>
                <div className={s.swapActions}>
                  <Link href={STUDIO_GENERATE_URL} className="v2-btn v2-btn-primary v2-btn-primary--lg">
                    Make your own thumbnail
                  </Link>
                  <Link href={PREVIEW_URL} className="v2-btn v2-btn-ghost">
                    Check it at phone size
                  </Link>
                </div>
              </div>

              <div className={s.swapVisual} aria-hidden>
                <figure className={s.theirs}>
                  <span className={s.swapImg}>
                    <Image src="/thumbnails/mrbeast/05-cheap-vs-expensive.webp" alt="" fill sizes="(max-width: 900px) 60vw, 300px" />
                  </span>
                  <figcaption>Theirs, downloaded</figcaption>
                </figure>
                <figure className={s.yours}>
                  <span className={s.swapImg}>
                    <Image src="/thumbnails/mrbeast/09-giant-object.webp" alt="" fill sizes="(max-width: 900px) 80vw, 400px" />
                  </span>
                  <figcaption>
                    Yours, for your video
                    <span className={s.pips}>
                      <i className={s.pipOn} />
                      <i />
                      <i />
                    </span>
                  </figcaption>
                </figure>
                <div className={s.phone}>
                  <span className={s.phoneImg}>
                    <Image src="/thumbnails/mrbeast/09-giant-object.webp" alt="" fill sizes="120px" />
                  </span>
                  <span className={s.phoneLine} />
                  <span className={`${s.phoneLine} ${s.phoneLineShort}`} />
                  <span className={s.phoneCap}>At phone size</span>
                </div>
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
