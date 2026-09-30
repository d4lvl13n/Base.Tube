import Link from 'next/link';
import { SIGN_UP_URL } from './content';
import { Reveal, RevealHeading } from './reveal';

/** The close: the same conviction as the hero, and the same way in. */
export function FinalCall() {
  return (
    <section className="hp-section hp-final" aria-labelledby="home-final-title">
      <div className="hp-wrap">
        <RevealHeading id="home-final-title" className="lp-display hp-final-title" lines={[['Stop renting.'], [{ accent: 'Start owning.' }]]} />
        <Reveal delay={0.2}>
          <p className="hp-final-sub">
            Your fans already exist. Give them a way to buy from you directly, and keep every one of them.
          </p>
          <div className="hp-actions">
            <a href={SIGN_UP_URL} target="_blank" rel="noopener noreferrer" className="hp-btn hp-btn-primary lp-btn-primary">
              Start creating
            </a>
            <Link href="/content-pass" className="hp-btn hp-btn-ghost">
              How Content Pass works
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
