'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

import m from './marquee.module.css';

export interface MarqueeItem {
  src: string;
  alt: string;
  href: string;
  label: string;
}

/**
 * One row of thumbnails that drifts sideways on its own (about 28 px a second) and that
 * visitors can also scroll or swipe by hand. The row holds its items twice: when the drift
 * passes one full set, it jumps back by exactly that width, so the loop is seamless.
 * It pauses while the pointer, a finger or the keyboard focus is on it, and does not move at
 * all for visitors who ask their device to reduce motion.
 */
export default function MarqueeRow({ items, direction = 1, speed = 28 }: { items: MarqueeItem[]; direction?: 1 | -1; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Width of one full set of items = distance between the first item and its copy.
    const setWidth = () => {
      const kids = el.querySelectorAll<HTMLElement>('[data-marquee-item]');
      const copy = kids[items.length];
      return copy ? copy.offsetLeft - kids[0].offsetLeft : 0;
    };

    let pos = direction < 0 ? setWidth() : 0;
    el.scrollLeft = pos;
    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const w = setWidth();
      if (paused.current || document.hidden || w === 0) {
        pos = el.scrollLeft; // follow manual scrolling while paused
      } else {
        pos += direction * speed * dt;
        if (pos >= w) pos -= w;
        if (pos < 0) pos += w;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [direction, speed, items.length]);

  const pause = () => {
    paused.current = true;
  };
  const resume = () => {
    paused.current = false;
  };
  // After a swipe, let the row settle a moment before it drifts again.
  const resumeLater = () => {
    window.setTimeout(resume, 1500);
  };

  return (
    <div
      ref={ref}
      className={m.row}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      onTouchStart={pause}
      onTouchEnd={resumeLater}
    >
      {[...items, ...items].map((it, i) => {
        const copy = i >= items.length;
        return (
          <Link
            key={i}
            href={it.href}
            className={m.card}
            data-marquee-item
            aria-hidden={copy ? true : undefined}
            tabIndex={copy ? -1 : undefined}
            title={it.label}
          >
            <Image src={it.src} alt={copy ? '' : it.alt} fill loading="eager" sizes="(max-width: 640px) 272px, (max-width: 1024px) 328px, 384px" className={m.img} />
          </Link>
        );
      })}
    </div>
  );
}
