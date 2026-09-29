import Image from 'next/image';
import styles from './visuals.module.css';

// Real output of the AI Thumbnail Studio for an invented channel ("Maya's Coffee Lab").
// Assets come from Base.Tube's own demo set; nothing here is a prediction or a score.

const DIR = '/images/studio';

const variants = [
  {
    src: `${DIR}/studio-idea-1.webp`,
    alt: 'Variant 1: the creator pointing at a latte with a heart and a small frother, text "$20 Milk Frother Magic"',
  },
  {
    src: `${DIR}/studio-idea-2.webp`,
    alt: 'Variant 2: the creator holding up a latte with a heart, text "No Machine Needed!"',
  },
  {
    src: `${DIR}/studio-idea-3.webp`,
    alt: 'Variant 3: a latte with a heart close to the camera, the creator smiling behind it, text "Cafe Latte Art at Home"',
  },
];

export default function StudioPreview() {
  return (
    <figure className={styles.frame} aria-label="Example made with AI Thumbnail Studio">
      <div className={styles.bar}>
        <span className={styles.barLabel}>AI Thumbnail Studio</span>
        <span className={styles.chip}>Example</span>
      </div>

      <div className={styles.studioBody}>
        <div className={styles.styleRow}>
          <Image
            className={styles.avatar}
            src={`${DIR}/studio-face.webp`}
            alt="The saved creator face for the example channel"
            width={88}
            height={88}
          />
          <div className={styles.styleText}>
            <div className={styles.styleName}>Maya&rsquo;s Coffee Lab</div>
            <div className={styles.styleSub}>Saved channel style</div>
          </div>
          <div className={styles.swatches} aria-label="Brand colours">
            <span className={styles.swatch} style={{ background: '#f2b300' }} />
            <span className={styles.swatch} style={{ background: '#6b3f1d' }} />
            <span className={styles.swatch} style={{ background: '#f3e7d3' }} />
          </div>
        </div>
        <p className={styles.rules}>
          Warm caf&eacute; light &middot; Yellow apron in frame &middot; Five words of title at most
        </p>

        <p className={styles.kicker}>3 variants for one video</p>
        <div className={styles.variants}>
          {variants.map((v) => (
            <div key={v.src} className={styles.thumb}>
              <Image src={v.src} alt={v.alt} width={480} height={270} sizes="(max-width: 560px) 30vw, 150px" />
            </div>
          ))}
        </div>

        <p className={styles.kicker}>One-sentence edit</p>
        <p className={styles.editLine}>&ldquo;Warmer light, more steam&rdquo;</p>
        <div className={styles.editPair}>
          <div>
            <div className={styles.thumb}>
              <Image
                src={`${DIR}/studio-idea-1.webp`}
                alt="Variant 1 before the edit"
                width={480}
                height={270}
                sizes="(max-width: 560px) 45vw, 220px"
              />
            </div>
            <div className={styles.editCap}>Before</div>
          </div>
          <div>
            <div className={styles.thumb}>
              <Image
                src={`${DIR}/studio-idea-1-edit.webp`}
                alt="Variant 1 after the edit: warmer light and steam rising from the cup"
                width={480}
                height={270}
                sizes="(max-width: 560px) 45vw, 220px"
              />
            </div>
            <div className={styles.editCap}>After</div>
          </div>
        </div>
      </div>

      <figcaption className={styles.caption}>
        Made with AI Thumbnail Studio for an invented channel.
      </figcaption>
    </figure>
  );
}
