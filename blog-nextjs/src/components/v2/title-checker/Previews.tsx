'use client';

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import styles from './TitleChecker.module.css';
import { TITLE_FONT_STACK } from './font';
import type { SurfaceLayout } from './compute';
import type { SurfaceId } from './surfaces';

export type Theme = 'dark' | 'light';

/** Natural (unscaled) width of each mock, in CSS pixels. */
const NATURAL_WIDTH: Record<SurfaceId, number> = {
  home: 347,
  mobile: 390,
  suggested: 396,
  search: 1152,
};
const SEARCH_WIDE = 1152;
const SEARCH_TEXT_COL = 636;

/** Content width of an element, kept up to date on resize. */
function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

const MIN_SCALE = 0.5;

/**
 * Draws its children at their real pixel size, then shrinks the whole thing to
 * fit the column. Because text is measured and wrapped at the real size first,
 * scaling never moves the cut.
 */
function ScaledFrame({ naturalWidth, children }: { naturalWidth: number; children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ scale: 1, height: 0, scrolls: false });

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const update = () => {
      const avail = outer.clientWidth;
      const scale = Math.max(MIN_SCALE, Math.min(1, avail / naturalWidth));
      setState({ scale, height: inner.offsetHeight * scale, scrolls: naturalWidth * scale > avail + 1 });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [naturalWidth]);

  return (
    <div
      ref={outerRef}
      className={styles.frameOuter}
      tabIndex={state.scrolls ? 0 : undefined}
      role={state.scrolls ? 'region' : undefined}
      aria-label={state.scrolls ? 'Preview, scrolls sideways' : undefined}
    >
      <div style={{ width: naturalWidth * state.scale, height: state.height || undefined }}>
        <div
          ref={innerRef}
          style={{ width: naturalWidth, transform: `scale(${state.scale})`, transformOrigin: 'top left' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function TitleLines({ item }: { item: SurfaceLayout }) {
  const { surface, layout } = item;
  const style: CSSProperties = {
    fontFamily: TITLE_FONT_STACK,
    fontSize: surface.fontSize,
    fontWeight: surface.fontWeight,
    lineHeight: `${surface.lineHeight}px`,
    width: surface.textWidth,
  };
  return (
    <div className={styles.titleText} style={style}>
      {layout.lines.map((line, i) => (
        <div key={i} className={styles.titleLine} style={{ minHeight: surface.lineHeight }}>
          {line}
        </div>
      ))}
    </div>
  );
}

function Thumb({ url, width, height, radius }: { url: string | null; width: number; height: number; radius: number }) {
  return (
    <div className={styles.thumb} style={{ width, height, borderRadius: radius }}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className={styles.thumbImg} />
      ) : (
        <span className={styles.thumbEmpty}>Your thumbnail</span>
      )}
      <span className={styles.duration}>12:34</span>
    </div>
  );
}

function Dots({ size = 24 }: { size?: number }) {
  return (
    <svg className={styles.dots} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="5.5" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="12" cy="18.5" r="1.7" />
    </svg>
  );
}

function HomeMock({ item, thumbUrl }: { item: SurfaceLayout; thumbUrl: string | null }) {
  return (
    <div className={styles.mock} style={{ width: 347, fontFamily: TITLE_FONT_STACK }} aria-hidden="true">
      <Thumb url={thumbUrl} width={347} height={195} radius={12} />
      <div className={styles.row} style={{ paddingTop: 12, gap: 12 }}>
        <span className={styles.avatar} style={{ width: 36, height: 36 }} />
        <div style={{ flex: '0 0 275px' }}>
          <TitleLines item={item} />
          <div className={styles.meta} style={{ fontSize: 14, lineHeight: '20px' }}>
            Your channel
          </div>
          <div className={styles.meta} style={{ fontSize: 14, lineHeight: '20px' }}>
            12K views · 2 days ago
          </div>
        </div>
        <Dots />
      </div>
    </div>
  );
}

function MobileMock({ item, thumbUrl }: { item: SurfaceLayout; thumbUrl: string | null }) {
  return (
    <div className={styles.mock} style={{ width: 390, fontFamily: TITLE_FONT_STACK }} aria-hidden="true">
      <Thumb url={thumbUrl} width={390} height={219} radius={0} />
      <div className={styles.row} style={{ padding: '12px 0 12px 12px', gap: 12 }}>
        <span className={styles.avatar} style={{ width: 40, height: 40 }} />
        <div style={{ flex: '0 0 278px' }}>
          <TitleLines item={item} />
          <div className={styles.meta} style={{ fontSize: 12, lineHeight: '17px', marginTop: 2 }}>
            Your channel · 12K views · 2 days ago
          </div>
        </div>
        <Dots />
      </div>
    </div>
  );
}

function SuggestedMock({ item, thumbUrl }: { item: SurfaceLayout; thumbUrl: string | null }) {
  return (
    <div className={styles.mock} style={{ width: 396, fontFamily: TITLE_FONT_STACK }} aria-hidden="true">
      <div className={styles.row} style={{ gap: 14 }}>
        <Thumb url={thumbUrl} width={246} height={138} radius={8} />
        <div style={{ flex: '0 0 136px' }}>
          <TitleLines item={item} />
          <div className={styles.meta} style={{ fontSize: 12, lineHeight: '18px', marginTop: 2 }}>
            Your channel
          </div>
          <div className={styles.meta} style={{ fontSize: 12, lineHeight: '18px' }}>
            12K views · 2 days ago
          </div>
        </div>
      </div>
    </div>
  );
}

/** Side by side on a wide screen. Stacked when the column is too narrow to keep the real size readable. */
function SearchMock({ item, thumbUrl, stacked }: { item: SurfaceLayout; thumbUrl: string | null; stacked: boolean }) {
  return (
    <div
      className={styles.mock}
      style={{ width: stacked ? SEARCH_TEXT_COL : SEARCH_WIDE, fontFamily: TITLE_FONT_STACK }}
      aria-hidden="true"
    >
      <div className={styles.row} style={{ gap: stacked ? 12 : 16, flexDirection: stacked ? 'column' : 'row' }}>
        <Thumb url={thumbUrl} width={500} height={281} radius={12} />
        <div style={{ flex: stacked ? '0 0 auto' : `0 0 ${SEARCH_TEXT_COL}px`, width: SEARCH_TEXT_COL }}>
          <div className={styles.row} style={{ justifyContent: 'space-between' }}>
            <TitleLines item={item} />
            <Dots />
          </div>
          <div className={styles.meta} style={{ fontSize: 12, lineHeight: '18px', marginTop: 4 }}>
            12K views · 2 days ago
          </div>
          <div className={styles.row} style={{ alignItems: 'center', gap: 8, margin: '12px 0' }}>
            <span className={styles.avatar} style={{ width: 24, height: 24 }} />
            <span className={styles.meta} style={{ fontSize: 12 }}>
              Your channel
            </span>
          </div>
          <div className={styles.descBar} style={{ width: '82%' }} />
          <div className={styles.descBar} style={{ width: '46%' }} />
        </div>
      </div>
    </div>
  );
}

function Mock({ item, thumbUrl, stacked }: { item: SurfaceLayout; thumbUrl: string | null; stacked: boolean }) {
  switch (item.surface.id) {
    case 'home':
      return <HomeMock item={item} thumbUrl={thumbUrl} />;
    case 'mobile':
      return <MobileMock item={item} thumbUrl={thumbUrl} />;
    case 'suggested':
      return <SuggestedMock item={item} thumbUrl={thumbUrl} />;
    default:
      return <SearchMock item={item} thumbUrl={thumbUrl} stacked={stacked} />;
  }
}

function Cell({ item, thumbUrl, theme }: { item: SurfaceLayout; thumbUrl: string | null; theme: Theme }) {
  const { surface, layout } = item;
  const [panelRef, panelWidth] = useElementWidth<HTMLDivElement>();
  const stacked = surface.id === 'search' && panelWidth > 0 && panelWidth < 800;
  const naturalWidth = surface.id === 'search' ? (stacked ? SEARCH_TEXT_COL : SEARCH_WIDE) : NATURAL_WIDTH[surface.id];
  return (
    <section
      className={`${styles.cell} ${surface.id === 'search' ? styles.cellWide : ''}`}
      aria-label={surface.label}
      data-surface={surface.id}
    >
      <header className={styles.cellHead}>
        <h4 className={styles.cellTitle}>{surface.label}</h4>
        <span className={layout.truncated ? styles.chipCut : styles.chipFull}>{layout.truncated ? 'Cut' : 'Full'}</span>
      </header>
      <p className={styles.cellContext}>
        {surface.context}. {surface.fontSize}px, up to {surface.maxLines} lines.
      </p>
      <div ref={panelRef} className={`${styles.panel} ${theme === 'dark' ? styles.dark : styles.light}`}>
        <ScaledFrame naturalWidth={naturalWidth}>
          <Mock item={item} thumbUrl={thumbUrl} stacked={stacked} />
        </ScaledFrame>
      </div>
      <div className={styles.facts}>
        {layout.truncated ? (
          <>
            <p className={styles.factLine}>
              <strong>Cut after {layout.visibleChars}</strong> of {layout.totalChars} characters.
            </p>
            <p className={styles.hiddenLine}>
              Hidden here: <q>{layout.hiddenText}</q>
            </p>
          </>
        ) : (
          <p className={styles.factLine}>
            <strong>Shown in full</strong>, {layout.naturalLines} {layout.naturalLines === 1 ? 'line' : 'lines'}.
          </p>
        )}
      </div>
    </section>
  );
}

export default function Previews({
  layouts,
  thumbUrl,
  theme,
  onTheme,
}: {
  layouts: SurfaceLayout[];
  thumbUrl: string | null;
  theme: Theme;
  onTheme: (t: Theme) => void;
}) {
  const cutCount = layouts.filter((l) => l.layout.truncated).length;
  const withoutSearch = layouts.filter((l) => l.surface.id !== 'search');
  const search = layouts.find((l) => l.surface.id === 'search');
  return (
    <div className={styles.previews}>
      <div className={styles.previewsHead}>
        <div>
          <h3 className={styles.blockTitle}>Where your title gets cut</h3>
          <p className={styles.blockSub} role="status">
            {cutCount === 0
              ? `Shown in full in all ${layouts.length} places.`
              : `Cut in ${cutCount} of ${layouts.length} places. Everything after the cut is invisible until someone opens the video.`}
          </p>
        </div>
        <div className={styles.seg} role="group" aria-label="Preview theme">
          {(['dark', 'light'] as Theme[]).map((t) => (
            <button
              key={t}
              type="button"
              className={styles.segBtn}
              aria-pressed={theme === t}
              onClick={() => onTheme(t)}
            >
              {t === 'dark' ? 'Dark' : 'Light'}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.cellGrid}>
        {withoutSearch.map((item) => (
          <Cell key={item.surface.id} item={item} thumbUrl={thumbUrl} theme={theme} />
        ))}
        {search && <Cell item={search} thumbUrl={thumbUrl} theme={theme} />}
      </div>
    </div>
  );
}
