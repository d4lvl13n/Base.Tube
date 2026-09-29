'use client';

import { useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import styles from './ThumbnailTester.module.css';
import type { Variant } from './analysis';

type Mode = 'feed' | 'squint' | 'gray' | 'tiny' | 'badge';
type Theme = 'dark' | 'light';

const MODES: { id: Mode; label: string }[] = [
  { id: 'feed', label: 'Feed' },
  { id: 'squint', label: 'Squint' },
  { id: 'gray', label: 'Grayscale' },
  { id: 'tiny', label: 'Tiny' },
  { id: 'badge', label: 'Badge' },
];

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');

/** Plain placeholder tiles: invented titles, abstract mid-tone art, no real channels. */
const NEUTRAL = [
  { title: 'A quiet morning routine that actually lasts', art: ['#52607a', '#232b3d'] },
  { title: 'What I would tell myself before starting', art: ['#7a5c4a', '#34261e'] },
  { title: 'The slow way to learn anything properly', art: ['#4f6b5a', '#1f2e26'] },
  { title: 'Everything in one bag for a whole month', art: ['#6c5678', '#2b2033'] },
  { title: 'A month of small changes, one honest review', art: ['#8a7a4a', '#383016'] },
  { title: 'How the whole thing came together', art: ['#4a6f78', '#1b2f35'] },
];

type FeedItem = { kind: 'variant'; v: Variant } | { kind: 'neutral'; n: number };

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Starting layout: variants spread across rows and columns, never in the last slot. */
const START_SLOTS = [0, 4, 2];

function arrange(variants: Variant[], seed: number | null): FeedItem[] {
  const neutrals = Array.from({ length: 6 - variants.length }, (_, n): FeedItem => ({ kind: 'neutral', n }));
  if (seed === null) {
    const slots: (FeedItem | null)[] = Array(6).fill(null);
    variants.forEach((v, i) => {
      slots[START_SLOTS[i]] = { kind: 'variant', v };
    });
    return slots.map((s) => s ?? neutrals.shift()!);
  }
  const rnd = mulberry32(seed);
  const items: FeedItem[] = [...variants.map((v): FeedItem => ({ kind: 'variant', v })), ...neutrals];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  // The phone column shows five tiles, so keep the last slot neutral.
  if (items[5].kind === 'variant') {
    const j = items.findIndex((it, i) => i < 5 && it.kind === 'neutral');
    if (j >= 0) [items[5], items[j]] = [items[j], items[5]];
  }
  return items;
}

/* ─── Small pieces ────────────────────────────────────────── */

function Thumb({ v, className, style }: { v: Variant; className?: string; style?: CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={v.url} alt={`Variant ${v.id}`} className={className} style={style} draggable={false} />
  );
}

function ColHead({ v }: { v: Variant }) {
  return (
    <div className={styles.colHead}>
      <span className={styles.chip}>{v.id}</span>
      <span className={styles.fname} title={v.fileName}>
        {v.fileName}
      </span>
    </div>
  );
}

function Seg<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const gid = useId();
  return (
    <div className={styles.controlGroup}>
      <span id={gid}>{label}</span>
      <div className={styles.seg} role="group" aria-labelledby={gid}>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={value === o.id}
            className={cx(styles.segBtn, value === o.id && styles.segOn)}
            onClick={() => onChange(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className={styles.check}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function Badge({ text }: { text: string }) {
  return <span className={styles.badge}>{text || '0:00'}</span>;
}

/* ─── Main ────────────────────────────────────────────────── */

export default function CompareViews({ variants, title }: { variants: Variant[]; title: string }) {
  const uid = useId();
  const [mode, setMode] = useState<Mode>('feed');
  const [theme, setTheme] = useState<Theme>('dark');
  const [layout, setLayout] = useState<'grid' | 'phone'>(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches ? 'phone' : 'grid'
  );
  const [seed, setSeed] = useState<number | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [blur, setBlur] = useState(2);
  const [showColour, setShowColour] = useState(false);
  const [duration, setDuration] = useState('12:34');
  const [showBadge, setShowBadge] = useState(true);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const shownTitle = title.trim() || 'Your video title goes here';
  const feed = useMemo(() => arrange(variants, seed), [variants, seed]);
  const cols = { '--n': variants.length } as CSSProperties;
  const surface = theme === 'dark' ? styles.surfaceDark : styles.surfaceLight;

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = MODES.findIndex((m) => m.id === mode);
    let next = -1;
    if (e.key === 'ArrowRight') next = (i + 1) % MODES.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + MODES.length) % MODES.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = MODES.length - 1;
    if (next >= 0) {
      e.preventDefault();
      setMode(MODES[next].id);
      tabRefs.current[MODES[next].id]?.focus();
    }
  };

  const themeSeg = (
    <Seg
      label="Feed colour"
      value={theme}
      options={[
        { id: 'dark', label: 'Dark' },
        { id: 'light', label: 'Light' },
      ]}
      onChange={setTheme}
    />
  );

  let panel: ReactNode = null;

  if (mode === 'feed') {
    const visible = layout === 'phone' ? feed.slice(0, 5) : feed;
    panel = (
      <>
        <p className={styles.prompt}>
          <strong>Look away, then look back.</strong> Which tile does your eye reach first, and why? Your variants sit
          among neutral placeholder tiles. Shuffle to move them around, because position changes what gets noticed.
        </p>
        <div className={styles.controls}>
          <Seg
            label="Layout"
            value={layout}
            options={[
              { id: 'grid', label: 'Desktop grid' },
              { id: 'phone', label: 'Phone column' },
            ]}
            onChange={setLayout}
          />
          {themeSeg}
          <button type="button" className={styles.btn} onClick={() => setSeed(Math.floor(Math.random() * 1e9))}>
            Shuffle
          </button>
          <Check label="Show A / B / C labels" checked={showLabels} onChange={setShowLabels} />
        </div>
        <div className={cx(styles.surface, surface)}>
          <div className={layout === 'grid' ? styles.feedGrid : styles.feedPhone}>
            {visible.map((it, i) => {
              const isVariant = it.kind === 'variant';
              const neutral = !isVariant ? NEUTRAL[it.n % NEUTRAL.length] : null;
              return (
                <div className={styles.tile} key={isVariant ? it.v.id : `n${it.n}-${i}`}>
                  <div
                    className={cx(styles.tileArt, !isVariant && styles.neutralArt)}
                    style={
                      neutral
                        ? { background: `linear-gradient(135deg, ${neutral.art[0]}, ${neutral.art[1]})` }
                        : undefined
                    }
                  >
                    {isVariant && <Thumb v={it.v} />}
                    {isVariant && showLabels && <span className={styles.tag}>{it.v.id}</span>}
                    <Badge text={duration} />
                  </div>
                  <div className={styles.tileMeta}>
                    <span className={styles.avatar} aria-hidden />
                    <div className={styles.tileText}>
                      <div className={styles.tileTitle}>{isVariant ? shownTitle : neutral?.title}</div>
                      <div className={styles.tileSub}>Channel name</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className={styles.surfaceNote}>
            The other tiles are plain placeholders in mid tones, drawn for this page. A real feed is busier, and your
            competitors&apos; thumbnails will be too. Desktop tiles here are about 320 px wide at full window width; the
            phone column is 360 px wide.
          </p>
        </div>
      </>
    );
  }

  if (mode === 'squint') {
    panel = (
      <>
        <p className={styles.prompt}>
          <strong>Raise the blur until the picture is a smear.</strong> Whatever still stands out, whether a shape, a
          face or a block of colour, is what a fast scroller sees. If nothing stands out, or every variant turns into the
          same smudge, the composition is not doing much work.
        </p>
        <div className={styles.controls}>
          <div className={styles.range}>
            <label htmlFor={`${uid}-blur`}>Blur</label>
            <input
              id={`${uid}-blur`}
              type="range"
              min={0}
              max={6}
              step={0.1}
              value={blur}
              aria-valuetext={`${blur.toFixed(1)} percent of the image width`}
              onChange={(e) => setBlur(Number(e.target.value))}
            />
            <span className={styles.rangeVal}>{blur.toFixed(1)}%</span>
          </div>
          <Seg
            label="Presets"
            value={String(blur)}
            options={[
              { id: '0', label: 'Off' },
              { id: '1', label: 'Light' },
              { id: '2.5', label: 'Medium' },
              { id: '5', label: 'Heavy' },
            ]}
            onChange={(v) => setBlur(Number(v))}
          />
        </div>
        <div className={styles.cols} style={cols}>
          {variants.map((v) => (
            <div className={styles.col} key={v.id}>
              <ColHead v={v} />
              <div className={styles.frame}>
                <Thumb v={v} className={blur > 0 ? styles.blurred : undefined} style={{ '--b': blur } as CSSProperties} />
              </div>
              <p className={styles.caption}>
                Light-to-dark difference, measured after a fixed 2% blur: <b>{Math.round(v.stats.glanceRange)}%</b>
              </p>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (mode === 'gray') {
    panel = (
      <>
        <p className={styles.prompt}>
          <strong>Colour can hide weak contrast.</strong> In grayscale, check that the subject separates from the
          background and that any words are still easy to read. Two colours that look different can turn into the same
          grey.
        </p>
        <div className={styles.controls}>
          <Check label="Show the colour version underneath" checked={showColour} onChange={setShowColour} />
        </div>
        <div className={styles.cols} style={cols}>
          {variants.map((v) => (
            <div className={styles.col} key={v.id}>
              <ColHead v={v} />
              <div className={styles.frame}>
                <Thumb v={v} className={styles.gray} />
              </div>
              {showColour && (
                <div className={styles.frame}>
                  <Thumb v={v} />
                </div>
              )}
              <p className={styles.caption}>
                Light-to-dark spread: <b>{Math.round(v.stats.tonalRange)}%</b> · average brightness:{' '}
                <b>{Math.round(v.stats.brightness)}%</b>
              </p>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (mode === 'tiny') {
    const sizes = [
      { px: 168, label: '168 px · suggested videos on desktop', text: true },
      { px: 120, label: '120 px · compact lists on a phone', text: true },
      { px: 84, label: '84 px · stress test', text: false },
    ];
    panel = (
      <>
        <p className={styles.prompt}>
          <strong>Sidebar and small-screen thumbnails are far smaller than in the feed.</strong> Check that the subject
          and the words are still recognisable. If you have to guess what the picture is, it is too detailed for this
          size. The widths are approximate; YouTube&apos;s layouts change by device.
        </p>
        <div className={styles.controls}>{themeSeg}</div>
        <div className={styles.cols} style={cols}>
          {variants.map((v) => (
            <div className={styles.col} key={v.id}>
              <ColHead v={v} />
              <div className={cx(styles.surface, styles.tinyStack, surface)}>
                {sizes.map((s) => (
                  <div className={styles.tinyRow} key={s.px}>
                    <span className={styles.tinyLabel}>{s.label}</span>
                    <div className={styles.tinyLine}>
                      <div className={styles.tinyThumb} style={{ width: s.px }}>
                        <Thumb v={v} />
                      </div>
                      {s.text && (
                        <div className={styles.tileText}>
                          <div className={cx(styles.tinyTitle, s.px <= 120 && styles.tinyTitleSm)}>{shownTitle}</div>
                          <div className={styles.tileSub}>Channel name</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (mode === 'badge') {
    panel = (
      <>
        <p className={styles.prompt}>
          <strong>The duration badge covers the bottom-right corner of every thumbnail.</strong> Anything important there
          is hidden, and a longer time such as 1:02:45 covers more than 3:15. The zoom under each thumbnail shows what
          sits beneath a typical badge.
        </p>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label htmlFor={`${uid}-dur`}>Time on the badge</label>
            <input
              id={`${uid}-dur`}
              type="text"
              inputMode="numeric"
              className={cx(styles.input, styles.durationInput)}
              value={duration}
              maxLength={8}
              onChange={(e) => setDuration(e.target.value)}
            />
            <div className={styles.seg} role="group" aria-label="Badge time presets">
              {['0:45', '12:34', '1:02:45'].map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={duration === d}
                  className={cx(styles.segBtn, duration === d && styles.segOn)}
                  onClick={() => setDuration(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <Check label="Show the badge" checked={showBadge} onChange={setShowBadge} />
        </div>
        <div className={styles.cols} style={cols}>
          {variants.map((v) => (
            <div className={styles.col} key={v.id}>
              <ColHead v={v} />
              <div className={styles.frame}>
                <Thumb v={v} />
                {showBadge && <Badge text={duration} />}
              </div>
              <div
                className={styles.zoom}
                role="img"
                aria-label={`Variant ${v.id}, bottom-right corner enlarged, with the badge area outlined`}
                style={{ backgroundImage: `url(${v.url})` }}
              >
                <span className={styles.zoomZone} aria-hidden />
              </div>
              <p className={styles.caption}>
                Under the outlined area: <b>{v.stats.badgeDetail.toFixed(1)}x</b> the image&apos;s average detail
              </p>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div>
      <div className={styles.tabs} role="tablist" aria-label="Comparison views">
        {MODES.map((m) => (
          <button
            key={m.id}
            ref={(el) => {
              tabRefs.current[m.id] = el;
            }}
            id={`${uid}-tab-${m.id}`}
            type="button"
            role="tab"
            aria-selected={mode === m.id}
            aria-controls={`${uid}-panel`}
            tabIndex={mode === m.id ? 0 : -1}
            className={cx(styles.tab, mode === m.id && styles.tabOn)}
            onClick={() => setMode(m.id)}
            onKeyDown={onTabKey}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div
        className={styles.panel}
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${mode}`}
        tabIndex={0}
      >
        {panel}
      </div>
    </div>
  );
}
