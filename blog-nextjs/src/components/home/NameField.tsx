'use client';

import { useEffect, useRef } from 'react';
import { PURCHASES, fanName, seeded } from './names';

/**
 * The hero's background: a dense field of fan names, grey and blurred, like an audience seen through
 * a platform's frosted glass. A band of focus sweeps across on load: the names it touches turn sharp
 * and orange, some show what they bought, and a few stay orange (buyers who are now yours). On a
 * desktop the cursor is a lens; on touch screens slow waves pass on their own.
 *
 * Cheap to render: two canvases and no DOM text. The grey field is drawn once per size (the blur is
 * a CSS filter on that canvas); the orange layer redraws only while something moves, and nothing
 * runs off screen, in a hidden tab, or under reduced motion (a still frame with a few named buyers).
 * Names never land on the headline, the copy or the buttons: elements marked data-hp-clear keep
 * the field dim behind them. Decorative: hidden from screen readers.
 */

interface Fan {
  x: number;
  y: number;
  w: number;
  cx: number;
  name: string;
  label: string;
  labelWidth: number;
  heat: number;
  floor: number;
  keeper: boolean;
  labeled: boolean;
  dim: boolean;
  alpha: number;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const REDUCED = '(prefers-reduced-motion: reduce)';
const FINE_POINTER = '(hover: hover) and (pointer: fine)';
/** The seed of the field: the same names in the same places on every visit. */
const SEED = 20260930;
/** How orange a settled buyer stays (below the level that shows a label). */
const SETTLED = 0.72;
/** From this heat a name is drawn as a buyer (orange); from LABEL_FROM it also shows what it bought. */
const BUYER_FROM = 0.62;
const LABEL_FROM = 0.84;

const overlaps = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

export default function NameField() {
  const rootRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLCanvasElement>(null);
  const focusRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const base = baseRef.current;
    const focus = focusRef.current;
    const hero = root?.parentElement;
    const bctx = base?.getContext('2d');
    const fctx = focus?.getContext('2d');
    if (!root || !base || !focus || !hero || !bctx || !fctx) return undefined;

    const reduced = window.matchMedia(REDUCED).matches;
    const finePointer = window.matchMedia(FINE_POINTER).matches;
    const family = getComputedStyle(root).getPropertyValue('--font-lp-archivo').trim() || 'ui-sans-serif, system-ui, sans-serif';

    let fans: Fan[] = [];
    let clear: Box[] = [];
    let width = 0;
    let height = 0;
    let fontSize = 12;
    let band = 120;
    let lens: { x: number; y: number } | null = null;
    let sweep: { start: number; duration: number; dir: 1 | -1; settle: boolean } | null = null;
    let settled = false;
    let nextWave = 0;
    let waveDir: 1 | -1 = -1;
    let visible = true;
    let running = false;
    let frame = 0;
    let last = 0;
    let disposed = false;

    const nameFont = () => `500 ${fontSize}px ${family}`;
    const focusFont = () => `600 ${fontSize}px ${family}`;

    function layout() {
      const rect = root!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const canvas of [base!, focus!]) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }
      bctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      fctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      fontSize = width < 640 ? 11.5 : 12.5;
      band = width < 640 ? 70 : 95;
      const lineHeight = Math.round(fontSize * 1.8);

      clear = Array.from(hero!.querySelectorAll('[data-hp-clear]')).map((element) => {
        const box = element.getBoundingClientRect();
        return { x: box.left - rect.left - 20, y: box.top - rect.top - 14, w: box.width + 40, h: box.height + 28 };
      });
      // The site's top bar sits over the hero: no names in focus under it.
      clear.push({ x: 0, y: 0, w: width, h: 72 });

      const random = seeded(SEED);
      const widths = new Map<string, number>();
      bctx!.font = nameFont();
      const next: Fan[] = [];
      for (let y = lineHeight * 0.9; y < height + lineHeight; y += lineHeight) {
        let x = -random() * 70;
        while (x < width) {
          const name = fanName(random);
          let w = widths.get(name);
          if (w === undefined) {
            w = bctx!.measureText(name).width;
            widths.set(name, w);
          }
          const purchase = PURCHASES[Math.floor(random() * PURCHASES.length)];
          const box = { x, y: y - fontSize, w, h: fontSize + 4 };
          next.push({
            x,
            y,
            w,
            cx: x + w / 2,
            name,
            label: `${name} · ${purchase} · paid once`,
            labelWidth: 0,
            heat: 0,
            floor: 0,
            keeper: random() < 0.09,
            labeled: random() < 0.28,
            dim: clear.some((c) => overlaps(box, c)),
            alpha: 0.4 + random() * 0.6,
          });
          x += w + 16 + random() * 24;
        }
      }
      fans = next;
      if (settled || reduced) settle();
      drawBase();
      drawFocus();
      root!.classList.add('is-ready');
    }

    /** The field's end state: a scatter of named buyers who stay orange. */
    function settle() {
      settled = true;
      for (const fan of fans) {
        if (fan.keeper && !fan.dim) {
          fan.floor = SETTLED;
          if (reduced) fan.heat = SETTLED;
        }
      }
      if (reduced) {
        // A few buyers show what they bought, spread over the free part of the field.
        let shown = 0;
        const step = Math.max(1, Math.floor(fans.length / 7));
        for (let i = Math.floor(step / 2); i < fans.length && shown < 6; i += step) {
          const fan = fans.slice(i).find((f) => f.labeled && !f.dim);
          if (fan) {
            fan.heat = 1;
            shown++;
          }
        }
      }
    }

    function drawBase() {
      bctx!.clearRect(0, 0, width, height);
      bctx!.font = nameFont();
      bctx!.fillStyle = '#4c4c57';
      for (const fan of fans) {
        bctx!.globalAlpha = fan.dim ? fan.alpha * 0.15 : fan.alpha * 0.7;
        bctx!.fillText(fan.name, fan.x, fan.y);
      }
      bctx!.globalAlpha = 1;
    }

    function drawFocus() {
      fctx!.clearRect(0, 0, width, height);
      fctx!.font = focusFont();
      // In focus, a name first turns sharp and white (seen), then orange (a buyer who is yours).
      for (const fan of fans) {
        if (fan.dim || fan.heat < 0.03) continue;
        const buyer = fan.heat >= BUYER_FROM;
        fctx!.fillStyle = buyer ? '#ff9a3c' : '#d4d4d8';
        fctx!.globalAlpha = buyer ? Math.min(1, 0.55 + fan.heat * 0.45) : fan.heat * 0.9;
        fctx!.fillText(fan.name, fan.x, fan.y);
      }
      // What they bought: a small label over the hottest names, never on top of each other or the copy.
      const pills: Box[] = [];
      for (const fan of fans) {
        if (fan.dim || !fan.labeled || fan.heat < LABEL_FROM) continue;
        if (!fan.labelWidth) fan.labelWidth = fctx!.measureText(fan.label).width;
        const pill = { x: fan.x - 9, y: fan.y - fontSize - 7, w: fan.labelWidth + 18, h: fontSize + 15 };
        if (pill.x + pill.w > width - 4 || pills.some((p) => overlaps(p, pill)) || clear.some((c) => overlaps(c, pill))) continue;
        pills.push(pill);
        const a = Math.min(1, (fan.heat - LABEL_FROM) / 0.06);
        fctx!.globalAlpha = a * 0.97;
        fctx!.fillStyle = '#0d0d12';
        fctx!.beginPath();
        fctx!.roundRect(pill.x, pill.y, pill.w, pill.h, 7);
        fctx!.fill();
        fctx!.globalAlpha = a * 0.6;
        fctx!.strokeStyle = '#fa7517';
        fctx!.lineWidth = 1;
        fctx!.stroke();
        fctx!.globalAlpha = a;
        fctx!.fillStyle = '#e4e4e7';
        fctx!.fillText(fan.label, fan.x, fan.y);
        fctx!.fillStyle = '#ff9a3c';
        fctx!.fillText(fan.name, fan.x, fan.y);
      }
      fctx!.globalAlpha = 1;
    }

    function step(now: number) {
      if (disposed) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      let moving = false;

      if (sweep) {
        const progress = (now - sweep.start) / sweep.duration;
        if (progress >= 1) {
          if (sweep.settle) settle();
          sweep = null;
        } else if (progress >= 0) {
          const travel = width + band * 2;
          const bx = sweep.dir > 0 ? -band + progress * travel : width + band - progress * travel;
          for (const fan of fans) {
            const d = Math.abs(fan.cx - bx);
            if (d < band) {
              const h = 1 - d / band;
              if (h > fan.heat) fan.heat = h;
            }
          }
        }
        moving = true;
      }

      const up = 1 - Math.exp(-dt / 0.1);
      const down = 1 - Math.exp(-dt / 0.45);
      const radius = width < 640 ? 80 : 105;
      for (const fan of fans) {
        let target = fan.floor;
        if (lens) {
          const dx = fan.cx - lens.x;
          const dy = fan.y - fontSize / 2 - lens.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < radius * radius) target = Math.max(target, 1 - d2 / (radius * radius));
        }
        const diff = target - fan.heat;
        if (Math.abs(diff) < 0.004) {
          fan.heat = target;
          continue;
        }
        fan.heat += diff * (diff > 0 ? up : down);
        moving = true;
      }

      // Redraw only when something changed.
      if (moving) drawFocus();

      // Touch screens: slow waves, one after another, while the hero is on screen.
      if (!finePointer && settled && !sweep) {
        if (!nextWave) nextWave = now + 2500;
        if (now >= nextWave) {
          sweep = { start: now, duration: 7000, dir: waveDir, settle: false };
          waveDir = waveDir > 0 ? -1 : 1;
          nextWave = now + 7000 + 3500;
        }
        moving = true;
      }

      if (moving && visible && !document.hidden) {
        frame = requestAnimationFrame(step);
      } else {
        running = false;
      }
    }

    function kick() {
      if (reduced || running || !visible || document.hidden || disposed) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(step);
    }

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = root.getBoundingClientRect();
      lens = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      kick();
    };
    const onLeave = () => {
      lens = null;
      kick();
    };
    const onVisibility = () => {
      if (!document.hidden) kick();
    };

    let resizeTimer = 0;
    const resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        layout();
        kick();
      }, 150);
    });
    const intersection = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) kick();
    });

    // Draw once the headline's typeface is ready (the names use it too), then play the sweep.
    const fontReady = Promise.race([
      document.fonts?.load(nameFont()).catch(() => undefined),
      new Promise((resolve) => window.setTimeout(resolve, 1500)),
    ]);
    fontReady.then(() => {
      if (disposed) return;
      layout();
      resizeObserver.observe(root);
      intersection.observe(root);
      if (reduced) return;
      sweep = { start: performance.now() + 350, duration: width < 640 ? 3400 : 3000, dir: 1, settle: true };
      if (finePointer) {
        hero.addEventListener('pointermove', onPointer, { passive: true });
        hero.addEventListener('pointerleave', onLeave);
      }
      document.addEventListener('visibilitychange', onVisibility);
      kick();
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      resizeObserver.disconnect();
      intersection.disconnect();
      hero.removeEventListener('pointermove', onPointer);
      hero.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div ref={rootRef} className="hp-field" aria-hidden="true">
      <canvas ref={baseRef} className="hp-field-base" />
      <canvas ref={focusRef} className="hp-field-focus" />
    </div>
  );
}
