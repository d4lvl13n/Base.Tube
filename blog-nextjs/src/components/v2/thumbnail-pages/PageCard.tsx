import Image from 'next/image';
import Link from 'next/link';

import { BASE_PATH } from './lib/config.mjs';
import type { ThumbnailPage } from './lib/schema.mjs';
import s from './thumbnails.module.css';

/** Card linking to a niche page: its first example, its name and one line on the look. */
export default function PageCard({ page, headingLevel = 3 }: { page: ThumbnailPage; headingLevel?: 2 | 3 }) {
  const cover = page.gallery[0];
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <Link href={`${BASE_PATH}/${page.slug}`} className={s.card}>
      <span className={s.cardMedia}>
        {cover && (
          <Image src={cover.src} alt={cover.alt} fill sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 340px" className={s.cardImg} />
        )}
      </span>
      <span className={s.cardBody}>
        <Heading className={s.cardTitle}>{page.name} thumbnails</Heading>
        <span className={s.cardText}>{page.summary}</span>
        <span className={s.cardMeta}>
          {page.gallery.length} examples <span aria-hidden>→</span>
        </span>
      </span>
    </Link>
  );
}
