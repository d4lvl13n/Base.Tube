'use client';

import { useId, useState, type CSSProperties } from 'react';
import b from './banner-size.module.css';
import { DESKTOP_STRIP, SAFE_AT_RECOMMENDED, SAFE_PCT, SPEC } from './specs';
import type { Upload } from './useBannerUpload';

type View = 'tv' | 'computer' | 'phone';

const VIEWS: Array<{ id: View; label: string; size: string; text: string }> = [
  {
    id: 'tv',
    label: 'TV',
    size: `${SPEC.recommendedW} × ${SPEC.recommendedH}, the whole image`,
    text: 'On a TV the banner fills the screen, so the full 16:9 image shows. This is why YouTube recommends 2560 × 1440 "especially for TV". Put the background here, not your text.',
  },
  {
    id: 'computer',
    label: 'Computer',
    size: `${DESKTOP_STRIP.measuredW} × ${DESKTOP_STRIP.measuredH} strip, full width`,
    text: `On youtube.com in a browser, only a strip through the middle shows: the full width and the middle ${DESKTOP_STRIP.heightPct.toFixed(1)}% of the height. Everything above and below it is never seen on a computer.`,
  },
  {
    id: 'phone',
    label: 'Phone & tablet',
    size: `safe area, ${SPEC.safeW} × ${SPEC.safeH} at minimum size`,
    text: 'Phones and tablets show the same middle strip, smaller, and YouTube says banners "will get cropped on certain views and devices". It does not say how much. The safe area is the part YouTube tells you to use for text and logos, so keep both inside it.',
  },
];

/** Shows a 16:9 banner inside a box of another shape, centred, like YouTube's own crops. */
function Crop({ image, aspect, widthPct, label }: { image: Upload | null; aspect: string; widthPct: number; label: string }) {
  const style = { aspectRatio: aspect } as CSSProperties;
  const inner = { width: `${(100 / widthPct) * 100}%` } as CSSProperties;
  return (
    <div className={b.crop} style={style} role="img" aria-label={label}>
      <div className={b.cropInner} style={inner}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.url} alt="" />
        ) : (
          <div className={b.placeholder} aria-hidden>
            <span>Your channel</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DeviceDiagram({ image }: { image: Upload | null }) {
  const [view, setView] = useState<View>('computer');
  const groupName = useId();
  const current = VIEWS.find((v) => v.id === view) ?? VIEWS[0];

  const stripStyle = { top: `${DESKTOP_STRIP.topPct}%`, height: `${DESKTOP_STRIP.heightPct}%` } as CSSProperties;
  const safeStyle = {
    width: `${SAFE_PCT.w}%`,
    height: `${SAFE_PCT.h}%`,
    left: `${(100 - SAFE_PCT.w) / 2}%`,
    top: `${(100 - SAFE_PCT.h) / 2}%`,
  } as CSSProperties;
  const sideW = `${(100 - SAFE_PCT.w) / 2}%`;

  return (
    <div className={b.diagram}>
      <fieldset className={b.tabs}>
        <legend className={b.srOnly}>Device</legend>
        {VIEWS.map((v) => (
          <label key={v.id} className={b.tab}>
            <input
              type="radio"
              name={groupName}
              value={v.id}
              checked={view === v.id}
              onChange={() => setView(v.id)}
              className={b.tabInput}
            />
            <span className={b.tabLabel}>{v.label}</span>
          </label>
        ))}
      </fieldset>

      <div className={b.diagramGrid}>
        <figure className={b.canvasFig}>
          <div className={b.canvas} data-view={view}>
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image.url} alt={`${image.isSample ? 'Sample banner' : 'Your banner'} with the visible areas marked`} />
            ) : (
              <div className={b.placeholder} aria-hidden>
                <span>Your channel</span>
              </div>
            )}

            {view !== 'tv' && (
              <>
                <div className={b.shadeTop} style={{ height: `${DESKTOP_STRIP.topPct}%` }} aria-hidden />
                <div className={b.shadeBottom} style={{ height: `${DESKTOP_STRIP.topPct}%` }} aria-hidden />
              </>
            )}
            {view === 'phone' && (
              <>
                <div className={b.sideHatch} style={{ ...stripStyle, left: 0, width: sideW }} aria-hidden />
                <div className={b.sideHatch} style={{ ...stripStyle, right: 0, width: sideW }} aria-hidden />
              </>
            )}
            {view === 'computer' && <div className={b.stripLine} style={stripStyle} aria-hidden />}
            {view === 'tv' && <div className={b.tvLine} aria-hidden />}
            <div className={b.safeBox} style={safeStyle} aria-hidden>
              <span className={b.safeTag}>Safe area</span>
            </div>
          </div>
          <figcaption className={b.canvasCap}>
            <strong>{current.label}:</strong> {current.size}
          </figcaption>
        </figure>

        <div className={b.viewText}>
          <p>{current.text}</p>
          <ul className={b.keyList}>
            <li>
              <span className={`${b.key} ${b.keySafe}`} aria-hidden /> Safe area: {SPEC.safeW} × {SPEC.safeH} px on a{' '}
              {SPEC.minW} × {SPEC.minH} banner, about {SAFE_AT_RECOMMENDED.w} × {SAFE_AT_RECOMMENDED.h} px on a{' '}
              {SPEC.recommendedW} × {SPEC.recommendedH} one. Centred.
            </li>
            <li>
              <span className={`${b.key} ${b.keyStrip}`} aria-hidden /> Computer strip: full width,{' '}
              {DESKTOP_STRIP.heightPct.toFixed(1)}% of the height, centred.
            </li>
            <li>
              <span className={`${b.key} ${b.keyShade}`} aria-hidden /> Only seen on TV.
            </li>
            <li>
              <span className={`${b.key} ${b.keyHatch}`} aria-hidden /> Can be cut on phones and tablets.
            </li>
          </ul>
        </div>
      </div>

      <div className={b.devices}>
        <figure className={b.device}>
          <figcaption className={b.deviceCap}>
            <span>TV</span>
            <small>16:9, whole image</small>
          </figcaption>
          <Crop image={image} aspect="16 / 9" widthPct={100} label="What a TV shows: the whole banner" />
        </figure>
        <figure className={b.device}>
          <figcaption className={b.deviceCap}>
            <span>Computer</span>
            <small>about 6:1 strip</small>
          </figcaption>
          <Crop
            image={image}
            aspect={`${DESKTOP_STRIP.measuredW} / ${DESKTOP_STRIP.measuredH}`}
            widthPct={100}
            label="What a computer shows: a full-width strip through the middle"
          />
        </figure>
        <figure className={b.device}>
          <figcaption className={b.deviceCap}>
            <span>Safe area</span>
            <small>for text and logos</small>
          </figcaption>
          <Crop
            image={image}
            aspect={`${SPEC.safeW} / ${SPEC.safeH}`}
            widthPct={SAFE_PCT.w}
            label="The safe area: the middle of the banner, kept for text and logos"
          />
        </figure>
      </div>
    </div>
  );
}
