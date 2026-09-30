'use client';

import { useId, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, BookMarked, ClipboardList, Compass, FlaskConical, Search } from 'lucide-react';
import { Reveal, RevealHeading } from '@/components/ai-thumbnails/motion';
import { AuditButton } from './Buttons';
import { EXAMPLE } from './content';

const videoById = new Map(EXAMPLE.videos.map((video) => [video.id, video]));
const observationCount = EXAMPLE.videos.reduce((sum, video) => sum + video.observed.length, 0);

/**
 * The example report, laid out like a printed sheet: the app's sections in the app's order
 * (Positioning, Evidence board, Experiments to run, Swipe file). The evidence board shows one video
 * at a time, picked from the channel's row of thumbnails; every panel is in the server's HTML.
 */
export default function ExampleAudit() {
  const [active, setActive] = useState(0);
  const [panelKey, setPanelKey] = useState(0);
  const board = useRef<HTMLDivElement>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const base = useId();

  const pick = (index: number, focus = false) => {
    setActive(index);
    setPanelKey((value) => value + 1);
    if (focus) tabs.current[index]?.focus();
  };

  const showVideo = (id: string) => {
    const index = EXAMPLE.videos.findIndex((video) => video.id === id);
    if (index < 0) return;
    pick(index);
    board.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const last = EXAMPLE.videos.length - 1;
    if (event.key === 'ArrowRight') pick(active === last ? 0 : active + 1, true);
    else if (event.key === 'ArrowLeft') pick(active === 0 ? last : active - 1, true);
    else if (event.key === 'Home') pick(0, true);
    else if (event.key === 'End') pick(last, true);
    else return;
    event.preventDefault();
  };

  return (
    <section id="example" aria-labelledby="ca-example-title" className="scroll-mt-16 border-t border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <RevealHeading
            id="ca-example-title"
            className="lp-heading text-4xl text-white sm:text-6xl lg:col-span-7"
            parts={['The real report, on an example channel.']}
          />
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="text-lg text-zinc-300">
              <span className="font-semibold text-white">Sam’s Garage is invented</span>, and its three thumbnails were made for this
              example. The rest is the app’s real report: the same sections, in the same order, under the same rules. Facts are counted,
              readings are marked as hypotheses, and nothing is scored.
            </p>
          </Reveal>
        </div>

        <Reveal y={40} duration={1} amount={0.05}>
          <article aria-label="Example channel audit of Sam’s Garage" className="ca-paper mt-14 overflow-hidden rounded-[28px]">
            {/* Sheet header */}
            <header className="ca-rule flex flex-wrap items-center justify-between gap-4 border-b px-5 py-5 sm:px-10">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#141416] text-base font-bold text-[#f3efe7]">S</span>
                <div className="leading-tight">
                  <p className="text-base font-bold">{EXAMPLE.channel}</p>
                  <p className="ca-ink-soft text-sm">
                    {EXAMPLE.niche} · {EXAMPLE.videosAnalyzed} videos analyzed
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="ca-label rounded-md border border-[#141416]/15 px-2 py-1 text-[#141416]/70">Public data</span>
                <span className="ca-label rounded-md bg-[#fa7517] px-2 py-1 text-white">Example</span>
              </div>
            </header>

            {/* 1. Positioning */}
            <div className="ca-rule grid gap-6 border-b px-5 py-8 sm:px-10 sm:py-10 lg:grid-cols-12">
              <h3 className="ca-orange-ink flex items-center gap-2 self-start text-sm font-bold uppercase tracking-[0.08em] lg:col-span-3 lg:pt-1.5">
                <Compass className="h-4 w-4" aria-hidden="true" />
                Positioning
              </h3>
              <div className="lg:col-span-9">
                <p className="text-xl font-semibold leading-snug sm:text-2xl sm:leading-snug">{EXAMPLE.positioning}</p>
                <p className="ca-ink-soft ca-rule mt-6 border-t pt-6 text-base">{EXAMPLE.headline}</p>
              </div>
            </div>

            {/* 2. Evidence board */}
            <div ref={board} className="ca-rule scroll-mt-20 border-b px-5 py-8 sm:px-10 sm:py-10">
              <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-3">
                  <h3 className="ca-orange-ink flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em]">
                    <ClipboardList className="h-4 w-4" aria-hidden="true" />
                    Evidence board
                  </h3>
                  <p className="ca-ink-soft mt-3 text-sm">What is literally on each thumbnail. Facts first; every reading of them is a hypothesis.</p>
                  <dl className="ca-mono mt-6 grid grid-cols-3 gap-3 text-center lg:grid-cols-1 lg:text-left">
                    {[
                      [EXAMPLE.videos.length, 'videos examined'],
                      [observationCount, 'observations recorded'],
                      [EXAMPLE.experiments.length, 'experiments proposed'],
                    ].map(([count, label]) => (
                      <div key={label} className="ca-rule border-t pt-3">
                        <dt className="sr-only">{label}</dt>
                        <dd>
                          <span className="block text-2xl font-bold">{count}</span>
                          <span className="ca-ink-soft block text-xs">{label}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="lg:col-span-9">
                  <div role="tablist" aria-label="Videos in the example audit" onKeyDown={onKey} className="grid grid-cols-3 gap-3 sm:gap-4">
                    {EXAMPLE.videos.map((video, index) => (
                      <button
                        key={video.id}
                        ref={(element) => {
                          tabs.current[index] = element;
                        }}
                        id={`${base}-tab-${index}`}
                        type="button"
                        role="tab"
                        aria-selected={active === index}
                        aria-controls={`${base}-panel-${index}`}
                        tabIndex={active === index ? 0 : -1}
                        onClick={() => pick(index)}
                        className="ca-pick group cursor-pointer rounded-xl text-left"
                      >
                        <Image
                          src={video.src}
                          alt=""
                          width={1280}
                          height={720}
                          sizes="(min-width: 1280px) 290px, (min-width: 1024px) 22vw, 30vw"
                          loading="lazy"
                          className="aspect-video w-full rounded-xl object-cover"
                        />
                        <span className="mt-2 line-clamp-2 block text-xs font-semibold leading-snug sm:text-sm">{video.title}</span>
                      </button>
                    ))}
                  </div>

                  {EXAMPLE.videos.map((video, index) => {
                    const experiment = EXAMPLE.experiments.find((item) => item.priority === video.experiment);
                    return (
                      <div
                        key={video.id}
                        id={`${base}-panel-${index}`}
                        role="tabpanel"
                        aria-labelledby={`${base}-tab-${index}`}
                        hidden={active !== index}
                        className="mt-8"
                      >
                        <div key={active === index ? panelKey : undefined} className={active === index && panelKey > 0 ? 'ca-panel-in' : ''}>
                          <p className="text-lg font-bold leading-snug">{video.title}</p>
                          <div className="mt-5 grid gap-6 md:grid-cols-2">
                            <div>
                              <p className="ca-label ca-ink-soft">Observed</p>
                              <ul className="mt-3 space-y-2">
                                {video.observed.map((fact) => (
                                  <li key={fact} className="flex gap-2.5 text-[15px] leading-snug">
                                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#141416]/45" aria-hidden="true" />
                                    {fact}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="ca-hypothesis rounded-2xl p-4">
                                <p className="ca-label ca-ink-soft">Hypothesis, unproven until tested</p>
                                <p className="ca-ink-soft mt-2 text-[15px] italic leading-relaxed">{video.hypothesis}</p>
                              </div>
                              {experiment && (
                                <a
                                  href={`#ca-experiment-${experiment.priority}`}
                                  className="ca-brief mt-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#b8430b] transition-colors hover:bg-[#fa7517]/15"
                                >
                                  <FlaskConical className="h-4 w-4" aria-hidden="true" />
                                  Experiment {experiment.priority}: {experiment.title}
                                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Experiments to run */}
            <div className="ca-rule grid gap-6 border-b px-5 py-8 sm:px-10 sm:py-10 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <h3 className="ca-orange-ink flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em]">
                  <FlaskConical className="h-4 w-4" aria-hidden="true" />
                  Experiments to run
                </h3>
                <p className="ca-ink-soft mt-3 text-sm">In order. Each one is a single change you can prove or disprove.</p>
              </div>
              <ol className="space-y-10 lg:col-span-9">
                {EXAMPLE.experiments.map((experiment) => (
                  <li key={experiment.priority} id={`ca-experiment-${experiment.priority}`} className="grid scroll-mt-24 gap-5 sm:grid-cols-[4.5rem_1fr]">
                    <span className="lp-display hidden text-7xl leading-none text-[#fa7517] sm:block" aria-hidden="true">
                      {experiment.priority}
                    </span>
                    <div>
                      <h4 className="flex items-baseline gap-3 text-xl font-bold leading-snug">
                        <span className="lp-display text-4xl leading-none text-[#fa7517] sm:hidden" aria-hidden="true">
                          {experiment.priority}
                        </span>
                        <span>
                          <span className="sr-only">Experiment {experiment.priority}: </span>
                          {experiment.title}
                        </span>
                      </h4>
                      <div className="ca-hypothesis mt-4 rounded-2xl p-4">
                        <p className="ca-label ca-ink-soft">Hypothesis</p>
                        <p className="ca-ink-soft mt-2 text-[15px] italic leading-relaxed">{experiment.hypothesis}</p>
                      </div>
                      <div className="ca-brief mt-3 rounded-2xl p-4">
                        <p className="ca-label ca-orange-ink">Variant brief</p>
                        <p className="mt-2 text-[15px] leading-relaxed">
                          <span className="ca-ink-soft">Thumbnail: </span>
                          {experiment.thumbnail}
                        </p>
                      </div>
                      <p className="mt-4 text-[15px] leading-relaxed">
                        <span className="font-semibold">How to measure: </span>
                        {experiment.method}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="ca-label ca-ink-soft mr-1">Affected videos</span>
                        {experiment.videos.map((id) => {
                          const video = videoById.get(id);
                          if (!video) return null;
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => showVideo(id)}
                              className="inline-flex max-w-full cursor-pointer items-center gap-2 rounded-lg border border-[#141416]/15 bg-white/60 py-1 pl-1 pr-3 text-left text-xs font-medium transition-colors hover:border-[#fa7517]/60"
                            >
                              <Image src={video.src} alt="" width={1280} height={720} sizes="48px" loading="lazy" className="aspect-video w-12 shrink-0 rounded object-cover" />
                              <span className="truncate">{video.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* 4. Swipe file */}
            <div className="grid gap-6 px-5 py-8 sm:px-10 sm:py-10 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <h3 className="ca-orange-ink flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em]">
                  <BookMarked className="h-4 w-4" aria-hidden="true" />
                  Swipe file
                </h3>
                <p className="ca-ink-soft mt-3 text-sm">Packaging worth studying in your niche. Reference material, not a scoreboard.</p>
              </div>
              <div className="lg:col-span-9">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg border border-[#141416]/15 px-2.5 py-1 text-xs font-semibold">{EXAMPLE.swipeFile.size}</span>
                  <span className="ca-ink-soft ml-2 inline-flex items-center gap-1.5 text-xs">
                    <Search className="h-3.5 w-3.5" aria-hidden="true" />
                    Found via:
                  </span>
                  {EXAMPLE.swipeFile.searchQueries.map((query) => (
                    <span key={query} className="ca-mono rounded-md bg-[#141416]/[0.06] px-2 py-1 text-xs">
                      {query}
                    </span>
                  ))}
                </div>
                <ul className="mt-6 grid gap-6 md:grid-cols-2">
                  {EXAMPLE.swipeFile.examples.map((item) => (
                    <li key={item.title} className="ca-rule border-t pt-4">
                      <p className="font-semibold leading-snug">{item.title}</p>
                      <p className="ca-ink-soft text-sm">{item.channel}</p>
                      <p className="mt-2 text-[15px] leading-relaxed">{item.why}</p>
                    </li>
                  ))}
                </ul>
                <p className="ca-ink-soft mt-6 text-sm">
                  In a real report these are real videos from your niche, with their thumbnails, links and channel sizes. The report then ends
                  with a review queue: which of your recent videos sit far above or far below your median views.
                </p>
              </div>
            </div>
          </article>
        </Reveal>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
          <AuditButton label="Get this report for my channel" />
          <p className="max-w-md text-sm text-zinc-400">Your reports are saved to your account. Reopening one is free.</p>
        </div>
      </div>
    </section>
  );
}
