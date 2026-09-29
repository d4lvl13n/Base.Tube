'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { m, useMotionValue, useScroll, useTransform } from 'framer-motion';
import { Check } from 'lucide-react';
import ThumbnailArt from './ThumbnailArt';
import { DEMO } from './content';
import { useReducedMotionSafe } from './motion';

const EASE = [0.2, 0.7, 0.2, 1] as const;
const FAN = [
  { place: 'right-0 top-0 w-[68%]', tilt: 4, speed: -40, float: '0s' },
  { place: 'right-[10%] top-[26%] w-[62%]', tilt: -3, speed: -80, float: '1.2s' },
  { place: 'right-[2%] top-[52%] w-[58%]', tilt: 2, speed: -120, float: '2.4s' },
];
/** The largest fanned idea is 68% of the stage (at most 576px wide). */
const FAN_SIZES = '(min-width: 640px) 400px, 62vw';

/**
 * The channel profile card with the three ideas fanned behind it. The thumbnails float and drift
 * apart as the page scrolls (still under reduced motion); the card slides in once. Decorative:
 * the section's text says the same.
 */
export default function ChannelFan() {
  const reduceMotion = useReducedMotionSafe();
  const stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stage, offset: ['start end', 'end start'] });
  const shifts = [
    useTransform(scrollYProgress, [0, 1], [60, FAN[0].speed]),
    useTransform(scrollYProgress, [0, 1], [90, FAN[1].speed]),
    useTransform(scrollYProgress, [0, 1], [120, FAN[2].speed]),
  ];
  const still = useMotionValue(0);

  return (
    <div ref={stage} className="relative mx-auto aspect-[5/4] w-full max-w-xl" aria-hidden="true">
      {DEMO.ideas.map((idea, index) => (
        <m.div key={idea.src} className={`absolute ${FAN[index].place}`} style={{ rotate: FAN[index].tilt, y: reduceMotion ? still : shifts[index] }}>
          <div className="lp-float" style={{ animationDelay: FAN[index].float }}>
            <ThumbnailArt src={idea.src} sizes={FAN_SIZES} lazy className="rounded-xl shadow-2xl shadow-black/70 ring-1 ring-white/10" />
          </div>
        </m.div>
      ))}
      {/* The card rests turned by 2 degrees; it slides in from 4. */}
      <div className="absolute bottom-0 left-0 z-10 w-[58%] -rotate-2">
        <m.div
          data-lp-reveal=""
          initial={{ opacity: 0, x: -30, rotate: -2 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="rounded-2xl border border-white/10 bg-[#101015]/95 p-5 shadow-2xl shadow-black/80 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <Image src={DEMO.face} alt="" width={48} height={48} loading="lazy" className="h-12 w-12 rounded-full object-cover ring-2 ring-[#f2b300]/70" />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">{DEMO.channel}</p>
              <p className="text-xs text-[#fa7517]">Channel profile</p>
            </div>
          </div>
          <div className="mt-4 flex gap-1.5">
            {DEMO.swatches.map((color, index) => (
              <m.span
                key={color}
                data-lp-reveal=""
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.12 }}
                className="h-6 flex-1 origin-left rounded-md ring-1 ring-white/10"
                style={{ background: color }}
              />
            ))}
          </div>
          <ul className="mt-4 space-y-1.5">
            {DEMO.rules.map((rule, index) => (
              <m.li
                key={rule}
                data-lp-reveal=""
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.25 }}
                className="flex items-center gap-2 text-xs text-zinc-300"
              >
                <Check className="h-3.5 w-3.5 shrink-0 text-[#fa7517]" />
                {rule}
              </m.li>
            ))}
          </ul>
        </m.div>
      </div>
    </div>
  );
}
