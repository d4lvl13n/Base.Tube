import Link from 'next/link';
import { getImageProps } from 'next/image';
import { HERO_FEED, SIGN_UP_URL } from './content';

/** A card's width on screen (see .hp-strip in home.css): 54vw on phones, up to 320px on large screens. */
const CARD_SIZES = '(min-width: 1440px) 320px, (min-width: 768px) 23vw, 54vw';

/**
 * The feed that runs between the two lines of the headline: a flat row of thumbnails made with AI
 * Thumbnails that steps one card at a time into a fixed orange frame, where a cursor clicks it.
 * Only CSS moves it (no 3D, so Safari draws it as Chrome does); it stands still under reduced
 * motion. Decorative: hidden from screen readers, the headline says it in words.
 */
function FeedStrip() {
  // The set twice, so the loop is seamless.
  const cards = [...HERO_FEED, ...HERO_FEED];
  return (
    <span className="hp-strip" aria-hidden="true">
      <span className="hp-track">
        {cards.map((thumb, index) => {
          // The card in the frame at first paint loads at once, first (on phones it is the page's
          // largest image). The others load when on screen: the visible ones right after, the rest as
          // they slide in; the second set reuses the same files.
          const framed = index === 1;
          const { props: image } = getImageProps({
            src: thumb.src,
            alt: '',
            width: 640,
            height: 360,
            sizes: CARD_SIZES,
            loading: framed ? 'eager' : 'lazy',
            decoding: 'async',
            fetchPriority: framed ? 'high' : 'low',
          });
          return (
            <span key={index} className="hp-card">
              {/* eslint-disable-next-line @next/next/no-img-element -- next/image's getImageProps: an optimized <img> without a client component */}
              <img {...image} alt="" />
              {/* Drawn by CSS from the attribute, so the durations are not part of the headline's text. */}
              <span className="hp-duration" data-duration={thumb.duration} />
            </span>
          );
        })}
      </span>
      <span className="hp-frame">
        <span className="hp-cursor">
          <svg viewBox="0 0 24 24" width="30" height="30">
            <path d="M5 3.2 19.4 11l-6.1 1.6 3.5 6.6-2.6 1.4-3.5-6.6L6.3 18.4z" fill="#fff" stroke="#070709" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
          <span className="hp-ripple" />
        </span>
      </span>
    </span>
  );
}

/**
 * The hero, the hub's promise: "Grow on the feed." above the feed (the platforms, where viewers find
 * you), "Own your audience." below it (Base.Tube, where they become your buyers). The headline paints
 * at once (no fade: it is the page's largest text); the motion is the feed's.
 */
export default function Hero() {
  return (
    <section className="hp-hero" aria-labelledby="home-title">
      <h1 id="home-title" className="hp-h1 lp-display">
        <span className="hp-h1-line">Grow on the feed. </span>
        <FeedStrip />
        <span className="hp-h1-line">
          Own your <span className="lp-accent lp-accent-live">audience.</span>
        </span>
      </h1>

      <div className="hp-wrap hp-hero-foot">
        <p className="hp-hero-sub">
          Base.Tube is the creator hub: <strong>publish your films, courses and archives</strong>, sell them straight to your fans with a{' '}
          <strong>Content Pass</strong>, keep the relationship with every buyer, and grow with built-in tools.
        </p>
        <div className="hp-actions">
          <a href={SIGN_UP_URL} target="_blank" rel="noopener noreferrer" className="hp-btn hp-btn-primary lp-btn-primary">
            Start creating
          </a>
          <Link href="/tools" className="hp-btn hp-btn-ghost">
            Free tools
          </Link>
        </div>
      </div>
    </section>
  );
}
