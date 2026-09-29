'use client';

import { useEffect, useRef, useState } from 'react';
import { HERO_POSTER_SRC, HERO_VIDEO_SRC } from './content';
import { useReducedMotionSafe } from './motion';

/**
 * The hero's stage: the dark veil opens where the cursor is (it sets --lp-mx / --lp-my), and the
 * owner's background video plays behind it once `hero-background.mp4` exists and loads (added in the
 * browser only, never under reduced motion; nothing shows until it loads).
 */
export default function HeroStage({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotionSafe();
  const section = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  useEffect(() => setMounted(true), []);

  const follow = (event: React.PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== 'mouse' || !section.current) return;
    const box = section.current.getBoundingClientRect();
    section.current.style.setProperty('--lp-mx', `${event.clientX - box.left}px`);
    section.current.style.setProperty('--lp-my', `${event.clientY - box.top}px`);
  };

  return (
    <section
      ref={section}
      onPointerMove={follow}
      aria-labelledby="landing-hero-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-20"
    >
      {mounted && !reduceMotion && !videoFailed && (
        <video
          aria-hidden="true"
          tabIndex={-1}
          autoPlay
          muted
          loop
          playsInline
          poster={HERO_POSTER_SRC}
          onLoadedData={() => setVideoReady(true)}
          ref={(video) => {
            if (!video) return;
            // React sets `muted` as a property only; some browsers want the attribute to autoplay.
            video.muted = true;
            video.setAttribute('muted', '');
          }}
          className={`absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-1000 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" onError={() => setVideoFailed(true)} />
        </video>
      )}
      {children}
    </section>
  );
}
