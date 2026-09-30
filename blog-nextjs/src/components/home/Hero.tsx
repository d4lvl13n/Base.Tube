import { getImageProps } from 'next/image';
import { FANS, SIGN_UP_URL } from './content';

/**
 * The hero's picture: one audience, as people. Over it, a pane of frosted glass, the platform: behind
 * it, fans are a blur with no names. On load the glass slides back to the last column, and the fans
 * it uncovers show their name and what they bought from the creator. Rented and owned stay side by
 * side. CSS only (no 3D); under reduced motion the glass is already in place. Decorative: the headline
 * says it in words. The names are an illustration.
 */
function FanWall() {
  return (
    <div className="hp-fans" aria-hidden="true">
      <div className="hp-fans-grid">
        {FANS.map((fan, index) => {
          const image = fan.face
            ? getImageProps({ src: fan.face, alt: '', width: 44, height: 44, unoptimized: true, loading: 'lazy', decoding: 'async' }).props
            : null;
          return (
            <div key={fan.name} className={`hp-fan ${index >= 6 ? 'hp-fan--wide' : ''}`}>
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element -- a 44px avatar, served as is
                <img {...image} alt="" className="hp-fan-face" />
              ) : (
                <span className="hp-fan-face hp-fan-initial" style={{ background: fan.tint }}>
                  {fan.name[0]}
                </span>
              )}
              <span className="hp-fan-text">
                <span className="hp-fan-name">{fan.name}</span>
                <span className="hp-fan-bought">{fan.bought} · paid once</span>
              </span>
            </div>
          );
        })}
      </div>
      <div className="hp-glass">
        <span className="hp-glass-tag">
          Rented
          <span>No names. No emails.</span>
        </span>
      </div>
      <span className="hp-owned-tag">
        Owned
        <span>Your buyers, by name.</span>
      </span>
    </div>
  );
}

/** The hero: the conviction, in the live page's words, with the picture of renting against owning. */
export default function Hero() {
  return (
    <section className="hp-hero" aria-labelledby="home-title">
      <div className="hp-wrap">
        <h1 id="home-title" className="hp-h1 lp-display">
          <span className="hp-line">Stop renting fans.</span>{' '}
          <span className="hp-line lp-accent lp-accent-live">Own your audience.</span>
        </h1>
        <div className="hp-hero-grid">
          <div className="hp-hero-copy">
            <p className="hp-hero-sub">
              On the big platforms, your fans are a number the platform keeps. On Base.Tube they buy your work directly, and{' '}
              <strong>every buyer stays yours.</strong>
            </p>
            <div className="hp-actions">
              <a href={SIGN_UP_URL} target="_blank" rel="noopener noreferrer" className="hp-btn hp-btn-primary lp-btn-primary">
                Start creating
              </a>
              <a href="#how-it-works" className="hp-btn hp-btn-ghost">
                How it works
              </a>
            </div>
          </div>
          <FanWall />
        </div>
      </div>
    </section>
  );
}
