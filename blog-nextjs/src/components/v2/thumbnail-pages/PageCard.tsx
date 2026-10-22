import Image from 'next/image';
import Link from 'next/link';

import { realExamples } from './games';
import { BASE_PATH } from './lib/config.mjs';
import type { ThumbnailPage } from './lib/schema.mjs';
import s from './thumbnails.module.css';

/**
 * Tile linking to a niche page: its cover thumbnail, uncropped, with the page name and the
 * number of examples on one line underneath. The one-line summary stays available on hover.
 */
export default function PageCard({ page, headingLevel = 3 }: { page: ThumbnailPage; headingLevel?: 2 | 3 }) {
  const cover = page.gallery.find((g) => !g.placeholder);
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <Link href={`${BASE_PATH}/${page.slug}`} className={s.tile} title={page.summary}>
      <span className={s.tileMedia}>
        {cover && <Image src={cover.src} alt={cover.alt} fill sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 360px" className={s.tileImg} />}
      </span>
      <span className={s.tileFoot}>
        <Heading className={s.tileTitle}>{page.name}</Heading>
        <span className={s.tileMeta}>
          {realExamples(page).length} examples <span className={s.tileArrow} aria-hidden>→</span>
        </span>
      </span>
    </Link>
  );
}

/** Last tile of a group: a link to the page that lists everything in it. */
export function SeeAllTile({ href, label, sub }: { href: string; label: string; sub: string }) {
  return (
    <Link href={href} className={`${s.tile} ${s.tileAll}`}>
      <span className={s.tileAllInner}>
        <span className={s.tileAllLabel}>{label}</span>
        <span className={s.tileMeta}>
          {sub} <span className={s.tileArrow} aria-hidden>→</span>
        </span>
      </span>
    </Link>
  );
}
