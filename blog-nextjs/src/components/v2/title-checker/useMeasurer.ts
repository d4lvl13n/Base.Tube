'use client';

import { useEffect, useMemo, useState } from 'react';
import { roboto, TITLE_FONT_STACK } from './font';
import { SURFACES, type Surface } from './surfaces';

export type Measure = (text: string) => number;

/**
 * Returns a function that gives a text-width measurer for a surface, or null
 * until Roboto has loaded (measuring earlier would use a fallback font and
 * put the cut in the wrong place).
 */
export function useSurfaceMeasurers(): ((surface: Surface) => Measure) | null {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const fonts = typeof document !== 'undefined' ? document.fonts : undefined;
    if (!fonts || typeof fonts.load !== 'function') {
      setReady(true);
      return;
    }
    const family = roboto.style.fontFamily;
    Promise.all(SURFACES.map((s) => fonts.load(`${s.fontWeight} ${s.fontSize}px ${family}`)))
      .catch(() => undefined)
      .then(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  return useMemo(() => {
    if (!ready) return null;
    const ctx = document.createElement('canvas').getContext('2d');
    // Browsers kern text in the page; canvas only does so when asked. Without this,
    // measured widths run about 1 px too wide per line.
    if (ctx && 'fontKerning' in ctx) ctx.fontKerning = 'normal';
    const caches = new Map<string, Map<string, number>>();
    return (surface: Surface): Measure => {
      const font = `${surface.fontWeight} ${surface.fontSize}px ${TITLE_FONT_STACK}`;
      let cache = caches.get(font);
      if (!cache) {
        cache = new Map();
        caches.set(font, cache);
      }
      const c = cache;
      return (text: string) => {
        const hit = c.get(text);
        if (hit !== undefined) return hit;
        let w: number;
        if (ctx) {
          ctx.font = font;
          w = ctx.measureText(text).width;
        } else {
          w = text.length * surface.fontSize * 0.5;
        }
        c.set(text, w);
        return w;
      };
    };
  }, [ready]);
}
