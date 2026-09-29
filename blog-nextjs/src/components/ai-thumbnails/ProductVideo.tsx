'use client';

import { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import { PRODUCT_VIDEO_POSTER_SRC, PRODUCT_VIDEO_SRC } from './content';

/**
 * The owner's product video under the hero. The section stays out of the page (zero height, then
 * nothing) until `product-video.mp4` exists and loads. Added in the browser only.
 */
export default function ProductVideo() {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || failed) return null;

  return (
    <section aria-label="AI Thumbnails in action" className={ready ? 'relative py-16 sm:py-24' : 'h-0 overflow-hidden'}>
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 h-[420px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fa7517]/[0.08] blur-[140px]" />
      <m.div
        data-lp-reveal=""
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        animate={ready ? { opacity: 1, y: 0, scale: 1 } : undefined}
        transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
        className="mx-auto max-w-5xl px-5 sm:px-8"
      >
        <div className="overflow-hidden rounded-[24px] shadow-[0_50px_140px_-40px_rgba(250,117,23,0.45)] ring-1 ring-white/10">
          <video controls playsInline preload="metadata" poster={PRODUCT_VIDEO_POSTER_SRC} onLoadedMetadata={() => setReady(true)} className="aspect-video w-full bg-black">
            <source src={PRODUCT_VIDEO_SRC} type="video/mp4" onError={() => setFailed(true)} />
          </video>
        </div>
      </m.div>
    </section>
  );
}
