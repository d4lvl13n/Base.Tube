import type { CSSProperties } from 'react';
import { Reveal, RevealHeading } from '@/components/ai-thumbnails/motion';
import { NOT_LIST } from './content';

type CSSVars = CSSProperties & Record<`--${string}`, string>;

/** What people expect from a "channel audit" and this one does not do: struck through once in view, with what it does instead. */
export default function WhatItIsNot() {
  return (
    <section aria-labelledby="ca-not-title" className="border-t border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <RevealHeading id="ca-not-title" className="lp-heading max-w-3xl text-4xl text-white sm:text-6xl" parts={['What it is not.']} />
        <ul className="mt-14">
          {NOT_LIST.map((item, index) => (
            <Reveal
              as="li"
              key={item.not}
              amount={0.6}
              className="grid gap-4 border-t border-white/[0.09] py-8 last:border-b lg:grid-cols-12 lg:items-baseline lg:gap-10"
            >
              <p className="lp-heading text-3xl text-white sm:text-5xl lg:col-span-7">
                <span className="ca-strike" style={{ '--ca-d': `${(0.25 + index * 0.05).toFixed(2)}s` } as CSSVars}>
                  {item.not}
                </span>
              </p>
              <p className="text-base text-zinc-300 sm:text-lg lg:col-span-5">{item.instead}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
