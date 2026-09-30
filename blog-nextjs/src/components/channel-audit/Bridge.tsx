import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ScanSearch } from 'lucide-react';
import { DEMO } from '@/components/ai-thumbnails/content';
import { Reveal, RevealHeading } from '@/components/ai-thumbnails/motion';
import { FREE_TOOLS, THUMBNAIL_REVIEW_URL } from './content';

// The three ideas AI Thumbnails made for its demo channel, overlapped (2D turns only: safe in Safari).
const STACK = [
  { place: 'left-0 top-[14%] w-[62%] -rotate-[5deg]', z: 'z-0' },
  { place: 'right-0 top-0 w-[62%] rotate-[4deg]', z: 'z-10' },
  { place: 'left-[18%] bottom-0 w-[66%] -rotate-[1deg]', z: 'z-20' },
];

/** Where to go once the report says what to change: AI Thumbnails, the free tools, the one-thumbnail review. */
export default function Bridge({ freeReviews }: { freeReviews: number | null }) {
  return (
    <section aria-labelledby="ca-bridge-title" className="border-t border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <RevealHeading id="ca-bridge-title" className="lp-heading max-w-3xl text-4xl text-white sm:text-6xl" parts={['Then fix what it finds.']} />

        <div className="mt-16 grid gap-16 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <div className="grid gap-10 rounded-3xl border border-white/10 bg-[#0d0d11] p-6 sm:grid-cols-2 sm:p-8">
              <div className="relative aspect-[5/4] w-full" aria-hidden="true">
                {DEMO.ideas.map((idea, index) => (
                  <div key={idea.src} className={`absolute ${STACK[index].place} ${STACK[index].z} overflow-hidden rounded-xl shadow-2xl shadow-black/70 ring-1 ring-white/10`}>
                    <Image src={idea.src} alt="" width={1280} height={720} sizes="(min-width: 1024px) 220px, 40vw" loading="lazy" className="aspect-video w-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <h3 className="text-2xl font-semibold text-white">AI Thumbnails</h3>
                <p className="mt-3 text-base text-zinc-400">
                  Three thumbnail ideas for a video, with your face and your channel’s style, ready for YouTube’s Test &amp; Compare. In the app,
                  any experiment in your report can be opened as a project in its Studio.
                </p>
                <p className="mt-3 text-sm text-zinc-400">Pictured: three ideas it made for an invented channel.</p>
                <Link
                  href="/ai-thumbnails"
                  className="group mt-auto inline-flex items-center gap-2 pt-6 text-base font-semibold text-[#ff9a3c] transition-colors hover:text-orange-300"
                >
                  See AI Thumbnails
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5">
            <h3 className="text-2xl font-semibold text-white">Free tools, no account</h3>
            <ul className="mt-5">
              <li className="border-t border-white/[0.09]">
                <a href={THUMBNAIL_REVIEW_URL} className="group flex items-start justify-between gap-4 py-4">
                  <span>
                    <span className="flex items-center gap-2 font-semibold text-white transition-colors group-hover:text-[#ff9a3c]">
                      <ScanSearch className="h-4 w-4 text-[#fa7517]" aria-hidden="true" />
                      Thumbnail review
                    </span>
                    <span className="mt-1 block text-sm text-zinc-400">
                      One image rated: an Attention Score from 1 to 10 and what to change. Not a click prediction.
                      {freeReviews !== null && ` ${freeReviews} a day.`}
                    </span>
                  </span>
                  <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-zinc-500 transition-colors group-hover:text-white" aria-hidden="true" />
                </a>
              </li>
              {FREE_TOOLS.map((tool) => (
                <li key={tool.href} className="border-t border-white/[0.09]">
                  <Link href={tool.href} className="group flex items-start justify-between gap-4 py-4">
                    <span>
                      <span className="block font-semibold text-white transition-colors group-hover:text-[#ff9a3c]">{tool.name}</span>
                      <span className="mt-1 block text-sm text-zinc-400">{tool.text}</span>
                    </span>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-zinc-500 transition-colors group-hover:text-white" aria-hidden="true" />
                  </Link>
                </li>
              ))}
              <li className="border-y border-white/[0.09]">
                <Link href="/tools" className="group flex items-center justify-between gap-4 py-4 font-semibold text-[#ff9a3c] hover:text-orange-300">
                  All free tools
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
