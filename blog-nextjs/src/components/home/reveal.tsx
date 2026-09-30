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
