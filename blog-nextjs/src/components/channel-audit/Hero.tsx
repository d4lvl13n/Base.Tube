import type { CSSProperties } from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { RevealHeading } from '@/components/ai-thumbnails/motion';
import { AuditButton, AuditTerms } from './Buttons';
import { AUDIT_STAGES, EXAMPLE } from './content';

type CSSVars = CSSProperties & Record<`--${string}`, string>;
const delay = (seconds: number): CSSVars => ({ '--ca-d': `${seconds.toFixed(2)}s` });

const HERO_VIDEO = EXAMPLE.videos[2];

/**
 * The hero: the promise on the left; on the right, the report writing itself. The app's five real
 * steps tick one after the other while the observed facts of one example thumbnail arrive, then the
 * hedged hypothesis. Pure CSS (plays without script, still under reduced motion). The thumbnail is
 * visible from the first paint. Decorative: the example section below carries the same report.
 */
export default function Hero() {
  return (
    <section aria-labelledby="ca-hero-title" className="relative isolate overflow-hidden pb-20 pt-28 sm:pt-36 lg:pb-28">
      {/* Faint ruled lines, like a report pad, fading out toward the edges. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.035)_0,rgba(255,255,255,0.035)_1px,transparent_1px,transparent_44px)] [mask-image:radial-gradient(ellipse_75%_70%_at_60%_40%,#000_30%,transparent_100%)]"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <RevealHeading
            as="h1"
            id="ca-hero-title"
            immediate
            delay={0.05}
            className="lp-display text-[2.7rem] text-white sm:text-[4.1rem] md:text-7xl lg:text-[3.9rem] xl:text-[4.75rem]"
            parts={['Free YouTube ', { accent: 'channel audit.' }]}
          />
          <div className="lp-hero-rise">
            <p className="mt-8 max-w-xl text-2xl font-semibold leading-snug text-white sm:text-[1.7rem] sm:leading-tight">
              See what is really on your thumbnails, and what to test next.
            </p>
            <p className="mt-5 max-w-xl text-lg text-zinc-400">
              Add your channel. Base.Tube pulls your latest videos, reads their thumbnails and titles closely and writes them up in
              plain words: the facts on each, what might be holding it back, and the experiments to run. No score, no click prediction.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
              <AuditButton />
              <a href="#example" className="text-base font-semibold text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline">
                See an example report
              </a>
            </div>
            <AuditTerms className="mt-6" />
          </div>
        </div>

        <div aria-hidden="true" className="relative mx-auto w-full max-w-[34rem] lg:col-span-5 lg:mr-0">
          {/* The app's progress panel (from 640px up; phones get the report card alone). */}
          <div className="hidden w-[80%] rounded-2xl border border-white/10 bg-[#101014] p-5 pb-8 shadow-2xl shadow-black/50 sm:block">
            <div className="flex items-center justify-between gap-3">
              <p className="relative text-sm font-semibold text-white">
                <span className="ca-status-running">Auditing your channel…</span>
                <span className="ca-status-done absolute left-0 top-0 whitespace-nowrap text-[#ff9a3c]">Report ready</span>
              </p>
              <p className="ca-label text-zinc-400">{EXAMPLE.channel}</p>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="ca-bar h-full rounded-full bg-[#fa7517]" />
            </div>
            <ol className="mt-4 space-y-2">
              {AUDIT_STAGES.map((stage, index) => {
                const at = 0.35 + index * 0.5;
                return (
                  <li key={stage} className="flex items-center gap-3 text-[13px]">
                    <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                      <span className="ca-dot absolute h-1.5 w-1.5 rounded-full bg-zinc-600" style={delay(at)} />
                      <span className="ca-tick flex h-5 w-5 items-center justify-center rounded-full bg-[#fa7517]/15 text-[#ff9a3c]" style={delay(at)}>
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                    </span>
                    <span className="ca-stage-text font-medium" style={delay(at)}>
                      {stage}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* One card of the evidence board, as the report shows it. */}
          <div className="ca-sheet relative z-10 ml-auto w-full overflow-hidden rounded-2xl sm:-mt-5 sm:w-[86%] lg:rotate-[1.2deg]">
            <Image
              src={HERO_VIDEO.src}
              alt={HERO_VIDEO.alt}
              width={1280}
              height={720}
              priority
              sizes="(min-width: 1280px) 460px, (min-width: 1024px) 36vw, (min-width: 640px) 470px, 88vw"
              className="aspect-video w-full object-cover"
            />
            <div className="p-5">
              <p className="text-sm font-semibold leading-snug">{HERO_VIDEO.title}</p>
              <p className="ca-label ca-ink-soft mt-4">Observed</p>
              <ul className="mt-2 space-y-1.5">
                {HERO_VIDEO.observed.slice(0, 3).map((fact, index) => (
                  <li key={fact} className="ca-seq flex gap-2 text-[13px] leading-snug" style={delay(0.9 + index * 0.45)}>
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-zinc-500" />
                    {fact}
                  </li>
                ))}
              </ul>
              <div className="ca-seq ca-hypothesis mt-4 rounded-xl p-3" style={delay(2.4)}>
                <p className="ca-label ca-ink-soft">Hypothesis, unproven until tested</p>
                <p className="ca-ink-soft mt-1 text-[13px] italic leading-snug">{HERO_VIDEO.hypothesis}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
