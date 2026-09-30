'use client';

// The home page's scroll reveals. They play the AI Thumbnails page's reveal CSS (.lp-words and
// .lp-reveal in ai-thumbnails.css) with a plain IntersectionObserver: that page's motion.tsx also
// loads framer-motion (about 23 kB of script), which nothing on the home page needs. The text is
// always in the server's HTML; under prefers-reduced-motion the CSS shows it at once.
import React, { useEffect, useRef, useState } from 'react';

/** True once the element has scrolled into view. */
function useSeen<T extends Element>(amount: number): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (seen || !element) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: amount },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [amount, seen]);
  return [ref, seen];
}

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * True once, after hydration, when the element should play its entrance: motion is allowed and the
 * element starts below the fold (one already on screen stays as the server drew it, with no flash).
 * Before that, and without scripts, the element shows its final state from the server's HTML.
 */
function useArmed(ref: React.RefObject<Element | null>): boolean {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia(REDUCED_QUERY).matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    setArmed(true);
  }, [ref]);
  return armed;
}

/**
 * A block that plays a CSS entrance once it scrolls into view: it gets `is-armed` (the start state)
 * after hydration, then `is-seen` (the entrance). See the .is-armed rules in home.css.
 */
export function OnSeen({ children, className = '', amount = 0.35 }: { children: React.ReactNode; className?: string; amount?: number }) {
  const [ref, seen] = useSeen<HTMLDivElement>(amount);
  const armed = useArmed(ref);
  return (
    <div ref={ref} className={`${className} ${armed ? 'is-armed' : ''} ${armed && seen ? 'is-seen' : ''}`}>
      {children}
    </div>
  );
}

/**
 * A number that counts up to its value once in view. The server's HTML holds the final value; the
 * count shows 0 only once the page knows it will animate.
 */
export function CountUp({ value, prefix = '', suffix = '', className = '' }: { value: number; prefix?: string; suffix?: string; className?: string }) {
  const [ref, seen] = useSeen<HTMLSpanElement>(0.6);
  const armed = useArmed(ref);
  useEffect(() => {
    // The span's one text node (React's own): only its characters change.
    const node = ref.current?.firstChild;
    if (!node || node.nodeType !== Node.TEXT_NODE || !armed) return undefined;
    if (!seen) {
      node.nodeValue = `${prefix}0${suffix}`;
      return undefined;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 1100);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.nodeValue = `${prefix}${Math.round(value * eased)}${suffix}`;
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [armed, seen, value, prefix, suffix, ref]);
  return (
    <span ref={ref} className={className}>
      {`${prefix}${value}${suffix}`}
    </span>
  );
}

/**
 * Text that types in quickly, like an incoming message, once in view. The real text stays in the
 * page (transparent while the copy on top types), so the layout never moves and screen readers and
 * search engines always get the whole text.
 */
export function TypeIn({ text, delay = 0 }: { text: string; delay?: number }) {
  const [ref, seen] = useSeen<HTMLSpanElement>(0.6);
  const armed = useArmed(ref);
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!armed || !seen) return undefined;
    let frame = 0;
    const duration = Math.min(1500, 18 * text.length);
    const start = performance.now() + delay * 1000;
    const tick = (now: number) => {
      const progress = Math.max(0, Math.min(1, (now - start) / duration));
      setShown(Math.round(text.length * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setDone(true);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [armed, seen, text, delay]);
  const typing = armed && !done;
  return (
    <span ref={ref} className={`hp-type ${typing ? 'is-typing' : ''}`}>
      <span className="hp-type-real">{text}</span>
      {typing && (
        <span className="hp-type-live" aria-hidden="true">
          {text.slice(0, shown)}
          <span className="hp-type-caret" />
        </span>
      )}
    </span>
  );
}

/** A headline part: white, or the orange accent. */
export type HeadingPart = string | { accent: string };

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

const text = (part: HeadingPart) => (typeof part === 'string' ? part : part.accent);

/**
 * A headline set on fixed lines (each line wraps on its own on small screens) whose words rise into
 * place the first time it scrolls into view. Plain text for screen readers.
 */
export function RevealHeading({
  lines,
  as: Tag = 'h2',
  id,
  className = '',
}: {
  lines: HeadingPart[][];
  as?: 'h2' | 'h3';
  id?: string;
  className?: string;
}) {
  const [ref, seen] = useSeen<HTMLHeadingElement>(0.5);
  const label = lines.map((line) => line.map(text).join('').trim()).join(' ');

  let order = 0;
  return (
    <Tag ref={ref} id={id} className={`${className} lp-words ${seen ? 'lp-in' : ''}`} aria-label={label}>
      <span aria-hidden="true">
        {lines.map((line, lineIndex) => (
          <span key={lineIndex} className="hp-line">
            {line.flatMap((part, partIndex) =>
              text(part)
                .split(/(\s+)/)
                .filter(Boolean)
                .map((chunk, chunkIndex) => {
                  const key = `${partIndex}-${chunkIndex}`;
                  if (/^\s+$/.test(chunk)) return <React.Fragment key={key}>{chunk}</React.Fragment>;
                  const delay = (order++ * 0.06).toFixed(2);
                  return (
                    <span
                      key={key}
                      className={`lp-word ${typeof part === 'string' ? '' : 'lp-accent lp-accent-live'}`}
                      style={{ '--lp-d': `${delay}s` } as CSSVars}
                    >
                      {chunk}
                    </span>
                  );
                }),
            )}
          </span>
        ))}
      </span>
    </Tag>
  );
}

/** Fades and rises into place once, when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  className = '',
  y = 24,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const [ref, seen] = useSeen<HTMLDivElement>(0.25);
  return (
    <div
      ref={ref}
      className={`lp-reveal ${seen ? 'lp-in' : ''} ${className}`}
      style={{ '--lp-d': `${delay}s`, '--lp-y': `${y}px` } as CSSVars}
    >
      {children}
    </div>
  );
}
