'use client';

import { useState, type CSSProperties } from 'react';
import s from './thumbnail-size.module.css';
import { ZONE_EXAMPLES } from './content';
import { MEASURED, SAFE_ZONE } from './specs';
import type { PreviewImage } from './RealSizePreview';

interface FrameProps {
  image: PreviewImage;
  /** Width in px at which the badge is drawn at its true size. */
  dw: number;
  inset: number;
  label: string;
  size: string;
  hoverControls: boolean;
}

function ZoneFrame({ image, dw, inset, label, size, hoverControls }: FrameProps) {
  const style = { '--w': `${dw}px`, '--dw': dw, '--inset': inset } as CSSProperties;
  return (
    <figure className={s.zoneFigure} style={style}>
      <figcaption className={s.surfaceCap}>
        <span className={s.surfaceTitle}>{label}</span>
        <span className={s.surfaceSize}>{size}</span>
      </figcaption>
      <div className={s.frame}>
        <div className={`${s.thumb} ${s.zoneThumb}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.url} alt={`${image.isSample ? 'Sample thumbnail' : 'Your thumbnail'} with the bottom-right safe zone marked`} />
          <div className={s.zoneBox} style={{ width: `${SAFE_ZONE.widthPct}%`, height: `${SAFE_ZONE.heightPct}%` }} />
          {hoverControls && (
            <>
              <span className={`${s.hoverBtn} ${s.hoverBtn1}`} aria-hidden>
                <svg viewBox="0 0 24 24" width="55%" height="55%" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 9v6h4l5 4V5L8 9H4z" fill="#fff" />
                  <path d="M17 9l5 6M22 9l-5 6" />
                </svg>
              </span>
              <span className={`${s.hoverBtn} ${s.hoverBtn2}`} aria-hidden>
                <svg viewBox="0 0 24 24" width="60%" height="60%" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="6" width="18" height="12" rx="3" />
                  <path d="M10 10.5a2 2 0 1 0 0 3M17 10.5a2 2 0 1 0 0 3" />
                </svg>
              </span>
            </>
          )}
          <span className={s.badge}>1:02:37</span>
        </div>
      </div>
    </figure>
  );
}

export default function SafeZone({ image }: { image: PreviewImage }) {
  const [hoverControls, setHoverControls] = useState(true);
  const searchPct = {
    w: ((MEASURED.badge.wideW + MEASURED.badge.insetSearch) / MEASURED.desktopSearch.w) * 100,
    h: ((MEASURED.badge.h + MEASURED.badge.insetSearch) / MEASURED.desktopSearch.h) * 100,
  };
  const sidebarPct = {
    w: ((MEASURED.badge.wideW + MEASURED.badge.insetSidebar) / MEASURED.desktopSidebar.w) * 100,
    h: ((MEASURED.badge.h + MEASURED.badge.insetSidebar) / MEASURED.desktopSidebar.h) * 100,
  };

  return (
    <div>
      <div className={s.previewBar}>
        <p className={s.previewing}>
          Drawn on: <strong>{image.isSample ? 'a sample image' : image.name}</strong>
        </p>
        <label className={s.check}>
          <input type="checkbox" checked={hoverControls} onChange={(e) => setHoverControls(e.target.checked)} />
          <span>Show desktop hover buttons</span>
        </label>
      </div>

      <p className={s.legend}>
        <span className={s.swatch} aria-hidden /> Keep-clear corner
        <span className={s.legendSep} aria-hidden>
          ·
        </span>
        <span className={s.legendBadge} aria-hidden>
          1:02:37
        </span>{' '}
        Video length, longest format
      </p>

      <div className={s.zoneFrames}>
        <ZoneFrame
          image={image}
          dw={MEASURED.desktopSearch.w}
          inset={MEASURED.badge.insetSearch}
          label="Desktop search results"
          size="500 px wide"
          hoverControls={hoverControls}
        />
        <ZoneFrame
          image={image}
          dw={MEASURED.desktopSidebar.w}
          inset={MEASURED.badge.insetSidebar}
          label="Desktop up next"
          size="248 px wide"
          hoverControls={false}
        />
      </div>

      <div className={s.zoneCols}>
        <div className={s.zoneText}>
          <h3 className={s.h3}>How big is the corner?</h3>
          <p>
            The video length is a black label, 20 px tall. It is 32 px wide for a short video and up to 64 px wide for
            one that runs over an hour. It sits 8 px in from the corner on search results and 4 px on the small up-next
            list.
          </p>
          <p>
            Because the label keeps its size while the thumbnail shrinks, it takes a bigger share of small thumbnails.
            The widest label covers {searchPct.w.toFixed(1)}% by {searchPct.h.toFixed(1)}% of a 500 px thumbnail, and{' '}
            {sidebarPct.w.toFixed(1)}% by {sidebarPct.h.toFixed(1)}% of a 248 px one. We rounded up to{' '}
            <strong>
              {SAFE_ZONE.widthPct}% of the width by {SAFE_ZONE.heightPct}% of the height
            </strong>
            .
          </p>
          <p>
            On desktop, buttons for mute and captions appear in the top-right corner when someone points at the
            thumbnail, and a thin red progress line can run along the bottom edge while a hover preview plays. Keep
            the key parts of your picture and your words in the middle.
          </p>
        </div>

        <div className={`${s.tableWrap} ${s.zoneTableWrap}`}>
          <table className={s.table}>
            <caption className={s.tableCap}>Corner to keep clear, by image size</caption>
            <thead>
              <tr>
                <th scope="col">Your image</th>
                <th scope="col">Bottom-right corner</th>
              </tr>
            </thead>
            <tbody>
              {ZONE_EXAMPLES.map((e) => (
                <tr key={e.label}>
                  <th scope="row">{e.label} px</th>
                  <td>
                    {e.zone.w} × {e.zone.h} px
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
