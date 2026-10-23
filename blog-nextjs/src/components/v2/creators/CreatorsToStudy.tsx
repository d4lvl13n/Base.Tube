import Link from 'next/link';

import g from '../thumbnail-pages/games.module.css';
import { PersonLink } from './CreatorCards';
import c from './creators.module.css';
import { CREATORS_PATH, creatorsHubIsLive, creatorsToLink } from './links';

/**
 * "Creators to study" block of a game gallery (/thumbnails/<game>): the real channels of that game
 * that have a creator page. A published gallery links to live creator pages only; a draft gallery
 * also shows drafts. Renders nothing when there is no creator to show.
 */
export default function CreatorsToStudy({ game, gameName, galleryIsLive }: { game: string; gameName: string; galleryIsLive: boolean }) {
  const creators = creatorsToLink(game, !galleryIsLive);
  if (creators.length === 0) return null;
  // Same rule for the hub link: an indexed gallery only points to an indexed hub.
  const showHubLink = creatorsHubIsLive() || !galleryIsLive;
  return (
    <section className="v2-cp-section" aria-labelledby="creators-h">
      <div className="v2-container">
        <div className={g.moreHead}>
          <div>
            <span className="v2-label">Creators to study</span>
            <h2 id="creators-h" className="v2-cp-section-h2">
              {gameName} channels worth a look
            </h2>
          </div>
          {showHubLink && (
            <Link href={CREATORS_PATH} className={g.seeAll}>
              All creators <span aria-hidden>→</span>
            </Link>
          )}
        </div>
        <ul className={c.people}>
          {creators.map((cr) => (
            <li key={cr.slug}>
              <PersonLink slug={cr.slug} name={cr.name} avatar={cr.avatar} subscribersText={cr.subscribersText} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
