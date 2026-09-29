'use client';

import { useState, type CSSProperties } from 'react';
import s from './thumbnail-size.module.css';
import { CHECKED_ON_LABEL, MEASURED, type Mode } from './specs';

export interface PreviewImage {
  url: string;
  name: string;
  width: number;
  height: number;
  isSample: boolean;
}

interface Props {
  image: PreviewImage;
  mode: Mode;
}

function Skeleton({ lines = 2 }: { lines?: number }) {
  return (
    <div className={s.skel} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <span key={i} className={s.skelBar} style={{ width: i === 0 ? '92%' : i === 1 ? '64%' : '40%' }} />
      ))}
    </div>
  );
}

interface SurfaceProps {
  title: string;
  w: number;
  h: number;
  note: string;
  image: PreviewImage;
  showBadge: boolean;
  /** Distance from the corner to the timestamp badge, in px at true size. */
  inset: number;
  radius?: number;
  aspect?: string;
}

function Surface({ title, w, h, note, image, showBadge, inset, radius = 12, aspect = '16 / 9' }: SurfaceProps) {
  const style = {
    '--w': `${w}px`,
    '--dw': w,
    '--inset': inset,
    '--radius': `${radius}px`,
    '--aspect': aspect,
  } as CSSProperties;
  return (
    <figure className={s.surface} style={style}>
      <figcaption className={s.surfaceCap}>
        <span className={s.surfaceTitle}>{title}</span>
        <span className={s.surfaceSize}>
          {w} × {h} px
        </span>
      </figcaption>
      <div className={s.frame}>
        <div className={s.thumb}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.url} alt={`${image.isSample ? 'Sample thumbnail' : 'Your thumbnail'} shown at ${title.toLowerCase()} size`} width={w} height={h} />
          {showBadge && <span className={s.badge}>12:34</span>}
        </div>
      </div>
      <Skeleton />
      <p className={s.surfaceNote}>{note}</p>
    </figure>
  );
}

export default function RealSizePreview({ image, mode }: Props) {
  const [showBadge, setShowBadge] = useState(true);
  const notSixteenNine = mode === 'video' && Math.abs(image.width / image.height / (16 / 9) - 1) > 0.01;

  return (
    <div>
      <div className={s.previewBar}>
        <p className={s.previewing}>
          Previewing: <strong>{image.isSample ? 'a sample image' : image.name}</strong>
          {image.isSample && (
            <>
              {' '}
              · <a href="#checker" className={s.inlineLink}>use your own image</a>
            </>
          )}
        </p>
        <label className={s.check}>
          <input type="checkbox" checked={showBadge} onChange={(e) => setShowBadge(e.target.checked)} />
          <span>Show the video length</span>
        </label>
      </div>

      {notSixteenNine && (
        <p className={s.previewWarn}>
          This image is not 16:9, so the previews below centre and crop it. YouTube may crop it or add bars instead.
        </p>
      )}

      <div className={s.surfaces}>
        {mode === 'video' ? (
          <>
          <Surface
            title="Desktop search results"
            w={MEASURED.desktopSearch.w}
            h={MEASURED.desktopSearch.h}
            note="In a 1440 px wide window."
            image={image}
            showBadge={showBadge}
            inset={MEASURED.badge.insetSearch}
          />
          <Surface
            title="Phone, search and watch list"
            w={MEASURED.mobileFeed.w}
            h={MEASURED.mobileFeed.h}
            note="Full width on a 390 px wide phone."
            image={image}
            showBadge={showBadge}
            inset={MEASURED.badge.insetSearch}
            radius={0}
          />
          <Surface
            title="Desktop watch page, up next"
            w={MEASURED.desktopSidebar.w}
            h={MEASURED.desktopSidebar.h}
            note="The smallest of the three."
            image={image}
            showBadge={showBadge}
            inset={MEASURED.badge.insetSidebar}
            radius={8}
          />
          </>
        ) : (
          <Surface
            title="Shorts shelf on phone search"
            w={MEASURED.shortsShelf.w}
            h={MEASURED.shortsShelf.h}
            note="Vertical thumbnails sit in a 2:3 box here. Keep faces and text away from the top and bottom edges."
            image={image}
            showBadge={false}
            inset={0}
            radius={12}
            aspect="2 / 3"
          />
        )}

        <aside className={s.aside}>
          <h3 className={s.h3}>The squint test</h3>
          <p>
            Look at the smallest preview. Can you read the words? Can you tell what the picture shows? If not, use fewer
            words, larger type and a simpler picture.
          </p>
          <p className={s.measureNote}>
            Sizes measured on youtube.com on {CHECKED_ON_LABEL} (Chrome, signed out). They are in CSS pixels, so on your
            screen they appear at true scale, or scaled down if your window is narrower. Layouts shift with window width
            and with YouTube&apos;s own tests, so read them as typical, not fixed.
          </p>
        </aside>
      </div>
    </div>
  );
}
