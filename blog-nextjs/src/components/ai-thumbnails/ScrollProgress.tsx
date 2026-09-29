'use client';

import { m, useScroll, useSpring } from 'framer-motion';

/** A thin orange line at the very top that fills as the page is read. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-linear-to-r from-[#fa7517] via-[#ff9a3c] to-[#ffd2a6]"
    />
  );
}
