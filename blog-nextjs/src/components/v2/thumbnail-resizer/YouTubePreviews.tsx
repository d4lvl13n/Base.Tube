import styles from './ThumbnailResizer.module.css';

/**
 * Widths measured on youtube.com on 29 September 2026 (logged-out Chrome):
 *  - desktop search results: 500 px wide in a 1440 px window (444 px at 1024)
 *  - desktop watch-page suggestions: 248 px wide in a 1440 px window (330 px at 1920)
 *  - phone search results: 390 px wide, edge to edge, on a 390 px screen
 * YouTube changes these with window size, so they are shown as typical sizes.
 */
const TITLE = 'Your video title goes here';
const CHANNEL = 'Your channel';

function Thumb({ src, width, small }: { src: string; width?: number; small?: boolean }) {
  return (
    <div className={styles.ytThumb} style={width ? { width } : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" />
      <span className={`${styles.ytDur} ${small ? styles.small : ''}`}>12:34</span>
    </div>
  );
}

function Item({ name, size, children }: { name: string; size: string; children: React.ReactNode }) {
  return (
    <div className={styles.previewItem}>
      <div className={styles.previewLabel}>
        <span className={styles.previewName}>{name}</span>
        <span className={styles.previewSize}>{size}</span>
      </div>
      {children}
    </div>
  );
}

export default function YouTubePreviews({ src }: { src: string }) {
  return (
    <section className={styles.previews} aria-labelledby="rz-previews-h">
      <h2 id="rz-previews-h" className={styles.previewsH}>
        How it looks on YouTube
      </h2>
      <p className={styles.previewsSub}>
        Your exported image at three widths YouTube uses. If the text is hard to read here, it is hard to read there.
        These are typical widths: YouTube changes them with the size of the window, and on a narrow screen the
        previews shrink to fit.
      </p>

      <div className={styles.previewRow}>
        <Item name="Search, desktop" size="500 px wide">
          <div className={styles.yt}>
            <div className={styles.ytCard}>
              <Thumb src={src} width={500} />
              <div className={styles.ytText}>
                <div className={styles.ytTitle}>{TITLE}</div>
                <div className={styles.ytMeta}>{CHANNEL}</div>
              </div>
            </div>
          </div>
        </Item>

        <Item name="Phone" size="Full width of a 390 px screen">
          <div className={`${styles.yt} ${styles.ytPhone}`} style={{ width: 390 }}>
            <Thumb src={src} />
            <div className={styles.ytPhoneText}>
              <span className={styles.avatar} aria-hidden />
              <div className={styles.ytText}>
                <div className={styles.ytTitle}>{TITLE}</div>
                <div className={styles.ytMeta}>{CHANNEL}</div>
              </div>
            </div>
          </div>
        </Item>

        <Item name="Suggested videos, desktop" size="248 px wide">
          <div className={styles.yt}>
            <div className={styles.ytCard}>
              <Thumb src={src} width={248} small />
              <div className={styles.ytText} style={{ width: 150 }}>
                <div className={`${styles.ytTitle} ${styles.small}`}>{TITLE}</div>
                <div className={styles.ytMeta}>{CHANNEL}</div>
              </div>
            </div>
          </div>
        </Item>
      </div>
    </section>
  );
}
