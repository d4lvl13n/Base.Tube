import Image from 'next/image';
import Link from 'next/link';

import { HUB_MIN_LIVE_PAGES } from './lib/config.mjs';
import type { PagesIndexEntry } from './lib/content.mjs';
import pagesIndexJson from './lib/pages-index.json';
import st from './strip.module.css';

const ALL = (pagesIndexJson as { pages: PagesIndexEntry[] }).pages;

/**
 * The thumbnail-idea pages to link from the rest of the site. Once enough pages are live, only
 * live ones (indexed pages never point to drafts); before that, every page that has images.
 */
export function linkablePages(): PagesIndexEntry[] {
  const live = ALL.filter((p) => p.live);
  return live.length >= HUB_MIN_LIVE_PAGES ? live : ALL;
}

/**
 * "Thumbnail ideas" block shown above the footer of the tools, blog and product pages:
 * four game covers, then a compact index linking every other game, creator style and video genre page.
 * Plain JSON input (lib/pages-index.json), so it also works inside client components.
 */
export default function ThumbnailIdeasStrip() {
  const pages = linkablePages();
  if (pages.length === 0) return null;
  const games = pages.filter((p) => p.category === 'game');
  const others = pages.filter((p) => p.category !== 'game');

  return (
    <section className={st.strip} aria-labelledby="thumbnail-ideas-strip-h">
      <div className="v2-container">
        <div className={st.head}>
          <div>
            <span className="v2-label">Thumbnail ideas</span>
            <h2 id="thumbnail-ideas-strip-h" className={st.title}>
              Ideas for your next thumbnail, by game and style
            </h2>
          </div>
          <div className={st.allLinks}>
            <Link href="/thumbnails/gaming">
              All gaming thumbnails <span aria-hidden>→</span>
            </Link>
            <Link href="/thumbnails">
              All thumbnail ideas <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {games.length > 0 && (
          <ul className={st.covers}>
            {games.slice(0, 4).map((p) => (
              <li key={p.slug}>
                <Link href={`/thumbnails/${p.slug}`} className={st.cover}>
                  <span className={st.coverMedia}>
                    <Image src={p.cover.src} alt={p.cover.alt} fill sizes="(max-width: 640px) 50vw, 280px" className={st.coverImg} />
                  </span>
                  <span className={st.coverName}>{p.name} thumbnails</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <ul className={st.index}>
          {[...games.slice(4), ...others].map((p) => (
            <li key={p.slug}>
              <Link href={`/thumbnails/${p.slug}`}>{p.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
