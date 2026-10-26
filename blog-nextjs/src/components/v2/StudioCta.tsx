import Image from 'next/image';
import type { ReactNode } from 'react';

import c from './StudioCta.module.css';

const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' } as const;

/** The three promises shown next to the button: only what the Studio really does. */
const POINTS = ['Three ideas for each video', 'Your face and your channel’s style', 'Change anything in plain words'];

/**
 * A large call to action placed in the middle of a page (the closing CTA band stays at the bottom).
 * `images`: up to 3 example thumbnails from the page, fanned on the right.
 */
export default function StudioCta({
  label = 'Base.Tube Studio',
  title,
  text,
  href,
  button = 'Make my thumbnail',
  images = [],
}: {
  label?: string;
  title: ReactNode;
  text: string;
  href: string;
  button?: string;
  images?: { src: string; alt: string }[];
}) {
  const shots = images.slice(0, 3);
  const external = href.startsWith('http');
  return (
    <section className={c.wrap} aria-label="Make your own thumbnail">
      <div className="v2-container">
        <div className={`${c.card} ${shots.length ? '' : c.noShots}`}>
          <div className={c.copy}>
            <span className={c.label}>{label}</span>
            <h2 className={c.title}>{title}</h2>
            <p className={c.text}>{text}</p>
            <ul className={c.points}>
              {POINTS.map((p) => (
                <li key={p}>
                  <span aria-hidden>✓</span> {p}
                </li>
              ))}
            </ul>
            <a className={`v2-btn v2-btn-primary v2-btn-primary--lg ${c.button}`} href={href} {...(external ? NEW_TAB : {})}>
              {button} <span aria-hidden>→</span>
              {external && <span className={c.srOnly}> (opens in a new tab)</span>}
            </a>
          </div>
          {shots.length > 0 && (
            <div className={c.fan} aria-hidden>
              {shots.map((img, i) => (
                <span key={img.src} className={`${c.shot} ${c[`shot${i}`]}`}>
                  <Image src={img.src} alt="" fill sizes="(max-width: 900px) 70vw, 360px" />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
