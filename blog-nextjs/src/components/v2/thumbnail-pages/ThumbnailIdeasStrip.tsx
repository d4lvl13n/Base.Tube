import Image from 'next/image';
import Link from 'next/link';

import { CATEGORIES, CATEGORY_LABELS, HUB_MIN_LIVE_PAGES } from './lib/config.mjs';
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
 * four game covers, then every other page grouped by kind (games, creator styles, video genres).
 * Plain JSON input (lib/pages-index.json), so it also works inside client components.
 * `containerClassName`: the page's own container, so the block lines up with its footer
 * (the AI Thumbnails page has no v2 styles).
 */
export default function ThumbnailIdeasStrip({ containerClassName = 'v2-container' }: { containerClassName?: string } = {}) {
  const pages = linkablePages();
  if (pages.length === 0) return null;
  const games = pages.filter((p) => p.category === 'game');
  const covered = new Set(games.slice(0, 4).map((p) => p.slug));
  const groups = CATEGORIES.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    pages: pages.filter((p) => p.category === category && !covered.has(p.slug)).sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((group) => group.pages.length > 0);

  return (
    <section className={st.strip} aria-labelledby="thumbnail-ideas-strip-h">
      <div className={containerClassName}>
        <div className={st.head}>
          <div>
            <span className={st.eyebrow}>Thumbnail ideas</span>
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

        <div className={st.groups}>
          {groups.map((group) => (
            <div key={group.category} className={st.group}>
              <h3 id={`thumbnail-ideas-${group.category}`} className={st.groupLabel}>
                {group.label}
              </h3>
              <ul className={st.chips} aria-labelledby={`thumbnail-ideas-${group.category}`}>
                {group.pages.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/thumbnails/${p.slug}`} className={st.chip}>
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
