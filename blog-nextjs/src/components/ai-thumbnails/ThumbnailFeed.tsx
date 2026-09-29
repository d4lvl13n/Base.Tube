'use client';

import { useEffect, useState } from 'react';
import { getImageProps } from 'next/image';
import { EXAMPLE_THUMBNAILS, type ExampleThumbnail } from './content';
import { useReducedMotionSafe } from './motion';

/** 30 cards per screen of feed: full rows at 3, 5 and 6 columns, the only layouts used. */
const SLOTS = 30;
const CARDS: ExampleThumbnail[] = Array.from({ length: SLOTS }, (_, index) => EXAMPLE_THUMBNAILS[(index * 7) % EXAMPLE_THUMBNAILS.length]);
/** The first two rows at the widest layout (6 columns) load at once; the rest when the browser gets to them. */
const EAGER = 12;
/** A card's width on screen: the tilted plane is 144% of the hero wide, scaled 1.3, in 3, 5 or 6 columns. */
const CARD_SIZES = '(min-width: 1280px) 29vw, (min-width: 768px) 37vw, 52vw';

// Decorative: the page's fonts, styles and scripts come first (fetchPriority low).
function FeedCard({ thumb, hot, lazy }: { thumb: ExampleThumbnail; hot: boolean; lazy: boolean }) {
  const loading = lazy ? 'lazy' : 'eager';
  const { props: image } = getImageProps({ src: thumb.src, alt: '', fill: true, sizes: CARD_SIZES, loading, decoding: 'async', fetchPriority: 'low' });
  const avatar = thumb.avatar
    ? getImageProps({ src: thumb.avatar, alt: '', width: 36, height: 36, unoptimized: true, loading, decoding: 'async', fetchPriority: 'low' }).props
    : null;
  return (
    <div className={`lp-feed-card ${hot ? 'lp-feed-hot' : ''}`}>
      <div className="lp-feed-thumb relative aspect-video overflow-hidden rounded-xl bg-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element -- next/image's getImageProps: an optimized <img> without a client component per card */}
        <img {...image} alt="" className="object-cover" />
        <span className="absolute bottom-1.5 right-1.5 rounded-sm bg-black/80 px-1 py-px text-[11px] font-semibold text-white">{thumb.duration}</span>
      </div>
      <div className="mt-3 flex gap-3">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element -- see above
          <img {...avatar} alt="" className="h-9 w-9 shrink-0 rounded-full bg-white object-cover" />
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-sm font-semibold text-white">{thumb.channel[0]}</span>
        )}
        <div className="min-w-0">
          <p className="line-clamp-2 text-[15px] font-semibold leading-snug text-zinc-100">{thumb.title}</p>
          <p className="mt-1 truncate text-[13px] text-zinc-400">{thumb.channel}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * The hero's background: a YouTube home feed made only of AI Thumbnails examples, scrolling up
 * slowly (the set twice, so the loop is seamless). Every few seconds one card lights up, the way
 * one thumbnail catches the eye in a feed. Decorative: hidden from screen readers; still under
 * reduced motion.
 */
export default function ThumbnailFeed({ className = '' }: { className?: string }) {
  const reduceMotion = useReducedMotionSafe();
  const [hot, setHot] = useState(-1);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const timer = window.setInterval(() => {
      setHot((previous) => {
        const next = Math.floor(Math.random() * (SLOTS - 1));
        return next >= previous ? next + 1 : next;
      });
    }, 2400);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* The feed lies on a tilted plane: it recedes behind the headline instead of facing it. */}
      <div className="lp-feed-plane absolute inset-x-[-22%] top-[-18%]">
        <div className="lp-feed px-5">
          {[0, 1].map((copy) => (
            <div key={copy} className="grid grid-cols-3 gap-x-4 gap-y-9 pb-9 md:grid-cols-5 xl:grid-cols-6">
              {CARDS.map((thumb, index) => (
                <FeedCard key={`${copy}-${index}`} thumb={thumb} hot={index === hot} lazy={copy === 1 || index >= EAGER} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
