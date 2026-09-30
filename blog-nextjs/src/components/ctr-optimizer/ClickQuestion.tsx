import ThumbnailArt from '@/components/ai-thumbnails/ThumbnailArt';
import { PAIR } from './content';
import styles from './ctr.module.css';

/**
 * The question itself: two thumbnail ideas for one video, A and B, and under them the answer
 * marker. It leans toward A, then toward B, and never reaches either one: the AI is not ready to
 * pick. Pure CSS, so it plays without scripts; under reduced motion it rests in the middle.
 */
export default function ClickQuestion() {
  return (
    <figure className={styles.question}>
      <div className={styles.pair}>
        {PAIR.map((idea) => (
          <div key={idea.letter} className={styles.option} data-option={idea.letter}>
            <ThumbnailArt src={idea.src} alt={idea.alt} sizes="(min-width: 1148px) 536px, 47vw" className={styles.thumb} />
          </div>
        ))}
      </div>

      <div className={styles.track} aria-hidden="true">
        <span className={styles.letter}>A</span>
        <span className={styles.line} />
        <span className={styles.rail}>
          <span className={styles.marker}>Not sure yet</span>
        </span>
        <span className={styles.letter}>B</span>
      </div>

      <figcaption className={styles.caption}>Two ideas for one video, both made with AI Thumbnails.</figcaption>
    </figure>
  );
}
