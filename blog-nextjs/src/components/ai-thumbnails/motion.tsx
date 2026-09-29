'use client';

// The page's motion kit (the app's motionKit.tsx). The text is always in the server's HTML: a reveal
// only starts it transparent, and the CSS (ai-thumbnails.css) plays the reveal once the element is in
// view. Under prefers-reduced-motion the CSS shows everything at once, before any script runs.
import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { LazyMotion, MotionConfig, MotionGlobalConfig, domAnimation } from 'framer-motion';

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/**
 * True when the visitor asked for reduced motion. False on the server and during hydration (so the
 * browser's first render matches the server's HTML), then the real value.
 */
export function useReducedMotionSafe(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

/** True once the element has scrolled into view (framer-motion's useInView with `once`). */
export function useSeen<T extends Element>(amount = 0.5, skip = false): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (skip || seen || !element) return undefined;
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
  }, [amount, seen, skip]);
  return [ref, seen];
}

/**
 * framer-motion's small bundle for every `m.*` element of the page. Under reduced motion every
 * framer-motion animation ends at once (the CSS already holds each element at its end state); the
 * setting is put back when the page is left.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotionSafe();
  useEffect(() => {
    if (!reduceMotion) return undefined;
    const previous = MotionGlobalConfig.skipAnimations;
    MotionGlobalConfig.skipAnimations = true;
    return () => {
      MotionGlobalConfig.skipAnimations = previous;
    };
  }, [reduceMotion]);
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

/** A headline part: white, or the orange accent (its gradient drifts slowly). */
export type HeadingPart = string | { accent: string };

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

/**
 * A headline whose words rise into place the first time it scrolls into view, white words and
 * orange accent phrases alternating. Plain text for screen readers (and in the server's HTML);
 * still with reduced motion.
 */
export function RevealHeading({
  parts,
  as: Tag = 'h2',
  id,
  className = '',
  delay = 0,
  immediate = false,
}: {
  parts: HeadingPart[];
  as?: 'h1' | 'h2';
  id?: string;
  className?: string;
  delay?: number;
  /** Play on first paint (the hero) instead of on scroll. */
  immediate?: boolean;
}) {
  const [ref, seen] = useSeen<HTMLHeadingElement>(0.6, immediate);
  const label = parts.map((part) => (typeof part === 'string' ? part : part.accent)).join('');

  let index = 0;
  const words = parts.flatMap((part, partIndex) => {
    const accent = typeof part !== 'string';
    const text = typeof part === 'string' ? part : part.accent;
    return text
      .split(/(\s+)/)
      .filter(Boolean)
      .map((chunk, chunkIndex) => {
        if (/^\s+$/.test(chunk)) return <React.Fragment key={`${partIndex}-${chunkIndex}`}>{chunk}</React.Fragment>;
        const order = index++;
        return (
          <span
            key={`${partIndex}-${chunkIndex}`}
            className={`lp-word ${accent ? 'lp-accent lp-accent-live' : ''}`}
            style={{ '--lp-d': `${(delay + order * 0.06).toFixed(2)}s` } as CSSVars}
          >
            {chunk}
          </span>
        );
      });
  });

  return (
    <Tag ref={ref} id={id} className={`${className} ${immediate ? 'lp-words-now' : `lp-words ${seen ? 'lp-in' : ''}`}`} aria-label={label}>
      <span aria-hidden="true">{words}</span>
    </Tag>
  );
}

/** Fades and rises into place once, when scrolled into view (the app's FadeIn and whileInView items). */
export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className = '',
  y = 24,
  duration = 0.8,
  amount = 0.3,
}: {
  children: React.ReactNode;
  as?: 'div' | 'li';
  delay?: number;
  className?: string;
  y?: number;
  duration?: number;
  amount?: number;
}) {
  const [ref, seen] = useSeen<HTMLDivElement & HTMLLIElement>(amount);
  return (
    <Tag
      ref={ref}
      className={`lp-reveal ${seen ? 'lp-in' : ''} ${className}`}
      style={{ '--lp-d': `${delay}s`, '--lp-y': `${y}px`, '--lp-t': `${duration}s` } as CSSVars}
    >
      {children}
    </Tag>
  );
}

/** Adds `lp-seen` once the block is in view (the quote highlighter runs its pass then). */
export function SeenGroup({ children, className = '', amount = 0.3 }: { children: React.ReactNode; className?: string; amount?: number }) {
  const [ref, seen] = useSeen<HTMLDivElement>(amount);
  return (
    <div ref={ref} className={`${className} ${seen ? 'lp-seen' : ''}`}>
      {children}
    </div>
  );
}
