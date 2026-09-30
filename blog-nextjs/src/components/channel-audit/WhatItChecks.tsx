import type { CSSProperties } from 'react';
import { Reveal, RevealHeading } from '@/components/ai-thumbnails/motion';
import { CHECKS } from './content';

type CSSVars = CSSProperties & Record<`--${string}`, string>;

// An illustration of 20 videos around their median views (invented shape, no numbers): which ones
// the review queue lists, and which three the preview reads closely (selectSample: the most-viewed,
// the least-viewed, then one from the middle).
const RATIOS = [1.1, 0.8, 2.6, 0.9, 1.3, 0.35, 1.02, 1.6, 0.7, 4.2, 1.2, 0.95, 0.45, 1.05, 2.1, 0.85, 1.4, 0.6, 0.98, 0.26];
const SAMPLED: Record<number, string> = { 9: 'most-viewed', 6: 'middle', 19: 'least-viewed' };
const W = 520;
const H = 270;
const X0 = 14;
// The dots stop short of the right edge, where the three lines carry their labels.
const STEP = (W - X0 - 104) / (RATIOS.length - 1);
const y = (ratio: number) => 135 - (Math.log2(ratio) / 2.2) * 100;

function ViewsStrip() {
  return (
    <figure className="mt-10">
      <Reveal amount={0.4} y={0} duration={0.01}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-labelledby="ca-strip-title">
          <title id="ca-strip-title">
            Illustration: twenty videos around their median views. The review queue lists those at twice the median or more and at half or
            less; the free preview reads three closely: the most-viewed, one from the middle and the least-viewed.
          </title>
          {[
            [2, '2× median'],
            [1, 'median'],
            [0.5, '½ median'],
          ].map(([ratio, label]) => (
            <g key={label as string}>
              <line
                x1={0}
                x2={W}
                y1={y(ratio as number)}
                y2={y(ratio as number)}
                stroke={ratio === 1 ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.18)'}
                strokeDasharray={ratio === 1 ? undefined : '4 6'}
              />
              <text x={W} y={y(ratio as number) - 7} textAnchor="end" fill="#a1a1aa" fontSize="14" fontFamily="var(--font-geist-mono), monospace">
                {label}
              </text>
            </g>
          ))}
          {RATIOS.map((ratio, index) => {
            const cx = X0 + index * STEP;
            const cy = y(ratio);
            const sampled = SAMPLED[index];
            const far = ratio >= 2 || ratio <= 0.5;
            return (
              <g key={index} className="ca-strip-dot" style={{ '--ca-d': `${(index * 0.035).toFixed(3)}s` } as CSSVars}>
                <line x1={cx} x2={cx} y1={y(1)} y2={cy} stroke={far ? 'rgba(250,117,23,0.45)' : 'rgba(255,255,255,0.12)'} />
                <circle
                  cx={cx}
                  cy={cy}
                  r={sampled ? 8 : 5}
                  fill={sampled ? '#fa7517' : far ? '#070709' : 'rgba(255,255,255,0.55)'}
                  stroke={far && !sampled ? '#fa7517' : 'none'}
                  strokeWidth={2}
                />
                {sampled && (
                  <text
                    x={cx}
                    y={ratio >= 1 ? cy - 16 : cy + 30}
                    textAnchor="middle"
                    fill="#ffb067"
                    fontSize="17"
                    fontWeight="600"
                  >
                    {sampled}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </Reveal>
      <figcaption className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-400">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#fa7517]" aria-hidden="true" />
          read closely in the free preview
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-[#fa7517]" aria-hidden="true" />
          listed in the review queue
        </span>
        <span className="text-zinc-400">Illustration, not real data.</span>
      </figcaption>
    </figure>
  );
}

/** Everything the report contains, in its order, next to the picture of how the videos are picked. */
export default function WhatItChecks() {
  return (
    <section aria-labelledby="ca-checks-title" className="border-t border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <RevealHeading id="ca-checks-title" className="lp-heading text-4xl text-white sm:text-6xl" parts={['What the audit looks at.']} />
            <Reveal delay={0.1}>
              <p className="mt-6 text-lg text-zinc-300">
                Only your packaging: the thumbnails and titles people see before they click. Here is everything in the report, in its order.
              </p>
            </Reveal>
            <ViewsStrip />
          </div>
        </div>

        <ol className="lg:col-span-7">
          {CHECKS.map((check, index) => (
            <Reveal as="li" key={check.title} delay={0.04 * index} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-white/[0.09] py-7 last:border-b">
              <span className="ca-mono pt-1 text-sm text-[#ff9a3c]">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="text-xl font-semibold text-white">{check.title}</h3>
                <p className="mt-2 text-base text-zinc-400">{check.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
