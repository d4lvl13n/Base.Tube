import { realExamples } from './games';
import { BASE_PATH } from './lib/config.mjs';
import type { ThumbnailPage } from './lib/schema.mjs';
import m from './marquee.module.css';
import MarqueeRow, { type MarqueeItem } from './MarqueeRow';

export type { MarqueeItem };

/**
 * Takes up to `perPage` real examples from each page, interleaved (one per page, then the next
 * one…) so a row never shows the same game twice in a row.
 */
export function marqueeItems(pages: ThumbnailPage[], perPage: number): MarqueeItem[] {
  const lists = pages.map((p) =>
    realExamples(p)
      .slice(0, perPage)
      .map((g) => ({ src: g.src, alt: g.alt, href: `${BASE_PATH}/${p.slug}`, label: p.name })),
  );
  const out: MarqueeItem[] = [];
  for (let i = 0; i < perPage; i++) for (const l of lists) if (l[i]) out.push(l[i]);
  return out;
}

/** Splits items into `n` rows of similar length (item 0 → row 0, item 1 → row 1…). */
export function splitRows(items: MarqueeItem[], n: number): MarqueeItem[][] {
  const rows: MarqueeItem[][] = Array.from({ length: n }, () => []);
  items.forEach((it, i) => rows[i % n].push(it));
  return rows.filter((r) => r.length > 0);
}

/** Rows of drifting thumbnails, alternating direction, edges faded into the background. */
export default function Marquee({ rows, reverse = false }: { rows: MarqueeItem[][]; reverse?: boolean }) {
  return (
    <div className={m.marquee}>
      {rows.map((row, r) => (
        <MarqueeRow key={r} items={row} direction={(r + (reverse ? 1 : 0)) % 2 ? -1 : 1} />
      ))}
    </div>
  );
}

/** Centered heading above a showcase: small pill, big title, one line under it. */
export function ShowcaseHead({ pill, title, sub }: { pill: string; title: string; sub: string }) {
  return (
    <div className={m.head}>
      <span className={m.pill}>
        <span className={m.pillDot} aria-hidden>
          ✦
        </span>
        {pill}
      </span>
      <h2 id="showcase-h" className={m.title}>
        {title}
      </h2>
      <p className={m.sub}>{sub}</p>
    </div>
  );
}
