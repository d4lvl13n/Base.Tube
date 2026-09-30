import Link from 'next/link';
import { getImageProps } from 'next/image';
import { RevealHeading } from './reveal';
import { PROOF_ROWS } from './content';

const CARD_SIZES = '(min-width: 1024px) 340px, (min-width: 640px) 36vw, 56vw';

/**
 * Proof by example: a flat wall of thumbnails, three rows set off from each other and running past
 * both edges of the page. Nothing moves here (the hero's feed does); a thumbnail lights up under the
 * pointer. The one line says what they are.
 */
export default function ProofWall() {
  return (
    <section className="hp-section hp-proof" aria-labelledby="home-proof-title">
      <div className="hp-wrap">
        <RevealHeading
          id="home-proof-title"
          className="lp-heading hp-h2 hp-proof-title"
          lines={[['Every thumbnail on this page'], ['was made with ', { accent: 'AI Thumbnails.' }]]}
        />
      </div>

      <div className="hp-wall" aria-hidden="true">
        {PROOF_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="hp-wall-row">
            {row.map((thumb) => {
              const { props: image } = getImageProps({
                src: thumb.src,
                alt: '',
                width: 640,
                height: 360,
                sizes: CARD_SIZES,
                loading: 'lazy',
                decoding: 'async',
              });
              return (
                <span key={thumb.src} className="hp-wall-card">
                  {/* eslint-disable-next-line @next/next/no-img-element -- next/image's getImageProps: an optimized <img> without a client component */}
                  <img {...image} alt="" />
                  <span className="hp-duration">{thumb.duration}</span>
                </span>
              );
            })}
          </div>
        ))}
      </div>

      <div className="hp-wrap hp-proof-foot">
        <Link href="/ai-thumbnails" className="hp-link">
          See how AI Thumbnails works
        </Link>
      </div>
    </section>
  );
}
