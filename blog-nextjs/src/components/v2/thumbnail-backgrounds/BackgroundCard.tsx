import Image from 'next/image';

import { BACKGROUND_HEIGHT, BACKGROUND_WIDTH, backgroundSrc, type ThumbnailBackground } from './backgrounds';
import { studioHref } from './content';
import s from './thumbnail-backgrounds.module.css';

interface Props {
  bg: ThumbnailBackground;
  /** false while the image is a placeholder or its file is missing: show "coming soon", no download. */
  ready: boolean;
}

/** One background: preview (or "coming soon" box), Download button, Studio link and the prompt behind it. */
export default function BackgroundCard({ bg, ready }: Props) {
  const src = backgroundSrc(bg);
  return (
    <li className={s.card}>
      <figure className={s.figure}>
        <div className={s.media}>
          {ready ? (
            <Image
              src={src}
              alt={bg.alt}
              width={BACKGROUND_WIDTH}
              height={BACKGROUND_HEIGHT}
              sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 340px"
              className={s.img}
            />
          ) : (
            <div className={s.placeholder}>
              <span className={s.placeholderLabel}>Coming soon</span>
            </div>
          )}
        </div>
        <figcaption className={s.caption}>
          <h3 className={s.cardTitle}>{bg.title}</h3>
          <p className={s.cardMeta}>
            Space for you on the {bg.space} · {BACKGROUND_WIDTH} × {BACKGROUND_HEIGHT}
          </p>
        </figcaption>
      </figure>

      <div className={s.actions}>
        {ready ? (
          <a href={src} download={`base-tube-${bg.file}`} className={`v2-btn v2-btn-primary ${s.onAccent} ${s.download}`}>
            Download
            <span className={s.srOnly}> {bg.title} (WebP, {BACKGROUND_WIDTH} × {BACKGROUND_HEIGHT})</span>
          </a>
        ) : (
          <span className={`${s.download} ${s.downloadOff}`} aria-disabled="true">
            Download soon
          </span>
        )}
        <a href={studioHref(bg.id)} className={s.generate}>
          Generate a full thumbnail on this background <span aria-hidden>→</span>
        </a>
      </div>

      <details className={s.prompt}>
        <summary>Prompt used</summary>
        <p>{bg.prompt}</p>
      </details>
    </li>
  );
}
