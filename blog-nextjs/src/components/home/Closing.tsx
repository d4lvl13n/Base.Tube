import Link from 'next/link';
import { SIGN_UP_URL } from './content';
import { Reveal, RevealHeading } from './reveal';

/** Why Base.Tube, in two sentences: no statistics, only the position. */
export function WhyBaseTube() {
  return (
    <section className="hp-section hp-why" aria-labelledby="home-why-title">
      <div className="hp-wrap">
        <RevealHeading
          id="home-why-title"
          className="lp-heading hp-h2 hp-why-title"
          lines={[['Platforms rent you an audience.'], [{ accent: 'Base.Tube helps you keep it.' }]]}
        />
        <Reveal delay={0.15} className="hp-why-text">
          <p>
            On the big platforms, the feed decides who sees your next video, and the people who watch it stay the platform&apos;s customers.
          </p>
          <p>
            Base.Tube gives you a place of your own where fans buy your work directly and you keep the relationship, and the tools to keep
            winning new viewers.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** The last call to action: the platform first, the tools second, as in the hero. */
export function FinalCall() {
  return (
    <section className="hp-section hp-final" aria-labelledby="home-final-title">
      <div className="hp-wrap">
        <RevealHeading id="home-final-title" className="lp-display hp-final-title" lines={[['Bring your audience'], [{ accent: 'home.' }]]} />
        <Reveal delay={0.2}>
          <p className="hp-final-sub">
            Publish your work, sell it straight to your fans and keep every buyer. Grow with the tools while you do.
          </p>
          <div className="hp-actions">
            <a href={SIGN_UP_URL} target="_blank" rel="noopener noreferrer" className="hp-btn hp-btn-primary lp-btn-primary">
              Start creating
            </a>
            <Link href="/tools" className="hp-btn hp-btn-ghost">
              Free tools
            </Link>
            <Link href="/content-pass" className="hp-link hp-final-pass">
              Content Pass
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
