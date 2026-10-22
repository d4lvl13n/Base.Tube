'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import s from './thumbnail-fonts.module.css';

/** A font as the client needs it: the CSS family comes from next/font on the server. */
export interface ResolvedFont {
  id: string;
  name: string;
  family: string;
  weight: number;
  capWidth: number;
  url: string;
}

export type OutlineWidth = 'none' | 'thin' | 'thick';

/**
 * Stroke widths in em. The stroke is painted under the fill (paint-order: stroke fill), so only
 * the outer half shows: "thick" gives a visible outline of about 0.09em.
 */
const STROKE_EM: Record<OutlineWidth, number> = { none: 0, thin: 0.1, thick: 0.18 };

/** Text may use this share of the tile width, leaving room for the outline and a margin. */
const MAX_WIDTH_CQW = 84;
/** Largest font size, in % of tile width, for one line and for two lines (the tile is 56.25% tall). */
const MAX_SIZE_ONE_LINE = 24;
const MAX_SIZE_TWO_LINES = 19;

let canvasCtx: CanvasRenderingContext2D | null | undefined;
function getCtx(): CanvasRenderingContext2D | null {
  if (canvasCtx === undefined) {
    canvasCtx = typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d');
  }
  return canvasCtx;
}

/** True once the browser has downloaded the font, so canvas can measure it. */
function useFontLoaded(font: string): boolean {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let alive = true;
    if (typeof document === 'undefined' || !('fonts' in document)) return;
    document.fonts
      .load(font)
      .then(() => {
        if (alive) setLoaded(true);
      })
      .catch(() => {
        /* Keep the estimate. */
      });
    return () => {
      alive = false;
    };
  }, [font]);
  return loaded;
}

type Measure = (str: string) => number;

/** Splits the text into one or two lines and picks the font size (in cqw) that fills the tile. */
export function layoutText(text: string, measure: Measure): { lines: string[]; size: number } {
  const oneLineWidth = Math.max(measure(text), 1);
  const best = { lines: [text], size: Math.min(MAX_SIZE_ONE_LINE, (MAX_WIDTH_CQW * 100) / oneLineWidth) };

  const words = text.split(' ').filter(Boolean);
  if (words.length > 1) {
    let split: string[] | null = null;
    let splitWidth = Infinity;
    for (let i = 1; i < words.length; i++) {
      const a = words.slice(0, i).join(' ');
      const b = words.slice(i).join(' ');
      const w = Math.max(measure(a), measure(b));
      if (w < splitWidth) {
        splitWidth = w;
        split = [a, b];
      }
    }
    if (split) {
      const size = Math.min(MAX_SIZE_TWO_LINES, (MAX_WIDTH_CQW * 100) / Math.max(splitWidth, 1));
      if (size > best.size) return { lines: split, size };
    }
  }
  return best;
}

interface ThumbTextProps {
  text: string;
  font: ResolvedFont;
  fill: string;
  outline: string;
  outlineWidth?: OutlineWidth;
  shadow?: boolean;
  background: string;
  /** Pixel width of the tile. Omit to fill the parent. */
  width?: number;
  /** Show a video-length label in the bottom-right corner, as YouTube does. */
  badge?: boolean;
}

/**
 * Thumbnail-style text: capitals, outline, shadow, on a 16:9 coloured tile. The font size is a
 * share of the tile width (cqw), so the same text shrinks with the tile exactly as it would in a
 * real thumbnail.
 */
export default function ThumbText({
  text,
  font,
  fill,
  outline,
  outlineWidth = 'thick',
  shadow = true,
  background,
  width,
  badge = false,
}: ThumbTextProps) {
  const upper = text.trim().replace(/\s+/g, ' ').toUpperCase();
  const fontString = `${font.weight} 100px ${font.family}`;
  const loaded = useFontLoaded(fontString);

  const { lines, size } = useMemo(() => {
    const ctx = loaded ? getCtx() : null;
    const measure: Measure = ctx
      ? (str) => {
          ctx.font = fontString;
          return ctx.measureText(str).width;
        }
      : // Before the font has loaded (and on the server): a rough estimate from the average capital width.
        (str) => [...str].reduce((sum, ch) => sum + (ch === ' ' ? 28 : font.capWidth * 100), 0);
    return layoutText(upper || ' ', measure);
  }, [loaded, fontString, upper, font.capWidth]);

  const stroke = STROKE_EM[outlineWidth];
  const textStyle = {
    fontFamily: font.family,
    fontWeight: font.weight,
    fontSize: `${size.toFixed(2)}cqw`,
    color: fill,
    '--stroke': `${stroke}em`,
    '--outline': outline,
    textShadow: shadow
      ? `0.03em 0.06em 0 ${outlineWidth === 'none' ? 'rgba(0,0,0,0.85)' : outline}, 0 0.08em 0.28em rgba(0, 0, 0, 0.6)`
      : 'none',
  } as CSSProperties;

  return (
    <div
      className={s.tile}
      style={{ background, width: width ? `${width}px` : undefined }}
      role="img"
      aria-label={`"${upper}" set in ${font.name}`}
    >
      <span className={s.tileText} style={textStyle}>
        {lines.map((line, i) => (
          <span key={i} className={s.tileLine}>
            {line}
          </span>
        ))}
      </span>
      {badge && <span className={s.badge}>8:15</span>}
    </div>
  );
}
