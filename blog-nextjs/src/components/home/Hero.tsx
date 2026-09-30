import NameField from './NameField';
import { SIGN_UP_URL } from './content';

/**
 * The hero: the conviction, in the live page's words, over a field of fan names. Grey and blurred,
 * they are an audience rented through a platform; the names that turn orange are buyers you own.
 * The copy is server-rendered text; everything marked data-hp-clear keeps the field dim behind it,
 * and a soft veil does the same, so the headline and buttons read on every screen.
 */
export default function Hero() {
  return (
    <section className="hp-hero" aria-labelledby="home-title">
      <NameField />
      <div className="hp-veil" aria-hidden="true" />
      <div className="hp-wrap hp-hero-inner">
        <h1 id="home-title" className="hp-h1 lp-display">
          <span className="hp-line" data-hp-clear="">
            Stop renting fans.
          </span>{' '}
          <span className="hp-line lp-accent lp-accent-live" data-hp-clear="">
            Own your audience.
          </span>
        </h1>
        <p className="hp-hero-sub" data-hp-clear="">
          On the big platforms, your fans are a number the platform keeps. On Base.Tube they buy your work directly, and{' '}
          <strong>every buyer stays yours.</strong>
        </p>
        <div className="hp-actions" data-hp-clear="">
          <a href={SIGN_UP_URL} target="_blank" rel="noopener noreferrer" className="hp-btn hp-btn-primary lp-btn-primary">
            Start creating
          </a>
          <a href="#how-it-works" className="hp-btn hp-btn-ghost">
            How it works
          </a>
        </div>
        <p className="hp-legend" data-hp-clear="">
          <span className="hp-legend-rented">Grey and blurred</span>: fans you rent through a platform, out of reach.{' '}
          <span className="hp-legend-owned">Orange</span>: buyers who are yours, by name. (Illustration.)
        </p>
      </div>
    </section>
  );
}
