'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import { m } from 'framer-motion';
import { ReviewButton } from './Buttons';
import { REVIEW_EXAMPLE } from './content';
import { Reveal, RevealHeading, useReducedMotionSafe, useSeen } from './motion';

const EASE = [0.2, 0.7, 0.2, 1] as const;
const { src: EXAMPLE_SRC, alt: EXAMPLE_ALT, score: SCORE, notes: NOTES } = REVIEW_EXAMPLE;

function ScoreRing({ score, play }: { score: number; play: boolean }) {
  const radius = 26;
  const length = 2 * Math.PI * radius;
  const filled = length - (score / 10) * length;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/80 px-4 py-3 shadow-2xl shadow-black/60 backdrop-blur-md">
      <svg viewBox="0 0 64 64" className="h-14 w-14 -rotate-90" aria-hidden="true">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6" />
        <m.circle
          data-lp-ring=""
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#fa7517"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={length}
          style={{ '--lp-ring-final': `${filled}px` } as CSSProperties}
          initial={{ strokeDashoffset: length }}
          animate={{ strokeDashoffset: play ? filled : length }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.3 }}
        />
      </svg>
      <div className="leading-tight">
        <p className="text-2xl font-bold text-white">
          {score}
          <span className="text-sm font-medium text-zinc-400">/10</span>
        </p>
        <p className="text-xs text-[#fa7517]">Attention score</p>
      </div>
    </div>
  );
}

/**
 * The thumbnail review: a score from 1 to 10 and what to change, on an example. Once in view the
 * score fills, the notes pin themselves one by one, then the notes take turns being highlighted.
 * Then the honest line on clicks (measured from YouTube, never predicted). `freeReviews`: the free
 * reviews a day the app gives a visitor (GET /ctr/quota on the server), or null to leave the line out.
 */
export default function ReviewSection({ freeReviews }: { freeReviews: number | null }) {
  const reduceMotion = useReducedMotionSafe();
  const [figure, seen] = useSeen<HTMLDivElement>(0.45);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!seen || reduceMotion) return undefined;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % NOTES.length), 2600);
    return () => window.clearInterval(timer);
  }, [seen, reduceMotion]);

  return (
    <section aria-labelledby="landing-review-title" className="border-t border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-2">
        <div className="max-w-xl lg:order-2">
          <RevealHeading
            id="landing-review-title"
            className="lp-heading text-4xl text-white sm:text-6xl"
            parts={['A second opinion ', { accent: 'before you publish.' }]}
          />
          <Reveal delay={0.15}>
            <p className="mt-6 text-lg leading-relaxed text-zinc-300">
              Upload any thumbnail and get a <span className="font-semibold text-[#ff9a3c]">score from 1 to 10</span>, with{' '}
              <span className="font-semibold text-white">exactly what to change</span>, in plain words.
            </p>
          </Reveal>
          <ol className="mt-8 space-y-2">
            {NOTES.map((note, index) => (
              <li
                key={note.text}
                className={`flex gap-4 rounded-xl px-3 py-2.5 transition-colors duration-500 ${active === index && seen ? 'bg-[#fa7517]/[0.1]' : ''}`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors duration-500 ${
                    active === index && seen ? 'bg-[#fa7517] text-white' : 'bg-white/10 text-zinc-300'
                  }`}
                >
                  {index + 1}
                </span>
                <span className={`pt-0.5 text-base transition-colors duration-500 ${active === index && seen ? 'text-white' : 'text-zinc-400'}`}>
                  {note.text}
                </span>
              </li>
            ))}
          </ol>
          <Reveal delay={0.1}>
            <div className="mt-10 rounded-2xl border border-[#fa7517]/25 bg-linear-to-br from-[#fa7517]/[0.08] to-transparent p-6">
              <p className="text-lg font-semibold text-white">
                Measured, <span className="text-[#ff9a3c]">not predicted.</span>
              </p>
              <p className="mt-2 text-base text-zinc-400">
                No one can predict your click rate from one image, so we don&apos;t. Connect YouTube and see your real numbers before and after
                you change a thumbnail.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ReviewButton />
              {freeReviews !== null && (
                <span className="text-sm text-zinc-500">
                  {freeReviews} free review{freeReviews === 1 ? '' : 's'} a day, no account needed
                </span>
              )}
            </div>
          </Reveal>
        </div>

        <figure className="relative lg:order-1">
          <m.div
            ref={figure}
            data-lp-reveal=""
            initial={{ opacity: 0, scale: 0.96, rotate: -1.5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative overflow-hidden rounded-2xl shadow-[0_40px_120px_-40px_rgba(250,117,23,0.35)] ring-1 ring-white/10"
          >
            <Image
              src={EXAMPLE_SRC}
              alt={EXAMPLE_ALT}
              width={1280}
              height={720}
              sizes="(min-width: 1280px) 600px, (min-width: 1024px) 46vw, 92vw"
              loading="lazy"
              className="aspect-video w-full object-cover"
            />
            {NOTES.map((note, index) => (
              <m.span
                key={note.text}
                aria-hidden="true"
                data-lp-reveal=""
                initial={{ scale: 0, opacity: 0 }}
                animate={seen ? { scale: 1, opacity: 1 } : undefined}
                transition={{ type: 'spring', stiffness: 380, damping: 18, delay: 0.6 + index * 0.35 }}
                className="absolute -ml-4 -mt-4 flex h-8 w-8 items-center justify-center"
                style={{ left: `${note.x}%`, top: `${note.y}%` }}
              >
                {active === index && seen && !reduceMotion && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#fa7517] opacity-60" />
                )}
                <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#fa7517] text-sm font-bold text-white shadow-[0_0_0_6px_rgba(250,117,23,0.25)]">
                  {index + 1}
                </span>
              </m.span>
            ))}
          </m.div>
          <div className="absolute -bottom-7 right-4">
            <ScoreRing score={SCORE} play={seen} />
          </div>
          <figcaption className="sr-only">An example review with three notes and a score of {SCORE} out of 10.</figcaption>
        </figure>
      </div>
    </section>
  );
}
