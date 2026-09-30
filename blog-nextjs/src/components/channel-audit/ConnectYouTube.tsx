import { Clock, Eye, FileSpreadsheet, ScanSearch, UserPlus } from 'lucide-react';
import { Reveal, RevealHeading } from '@/components/ai-thumbnails/motion';
import { CONNECT_ADDS, EVIDENCE_TIERS } from './content';

const ICONS = [Eye, Clock, UserPlus, ScanSearch];

// The impressions axis, not to scale: under 1,000 | 1,000 to 5,000 | over 5,000 (evidence.ts).
const ZONES = [
  { width: '26%', className: 'bg-white/[0.08]' },
  { width: '40%', className: 'bg-[#fa7517]/25' },
  { width: '34%', className: 'bg-[#fa7517]/60' },
];

/** The three evidence labels a click-through rate carries, on one axis of impressions. */
function EvidenceScale() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d0d11] p-6 sm:p-8">
      <p className="text-lg font-semibold text-white">Every click-through rate says how much evidence is behind it.</p>
      <p className="mt-2 text-sm text-zinc-400">The label depends on one thing: how many impressions the video had.</p>

      <Reveal amount={0.6} y={0} duration={0.01} className="mt-10">
        <div className="relative pt-9" aria-hidden="true">
          <div className="ca-scale-marker absolute top-0 left-[3%] -translate-x-1/2 flex flex-col items-center [.lp-in_&]:left-[86%]">
            <span className="ca-mono rounded-md bg-white px-2 py-0.5 text-[11px] font-semibold text-black">impressions</span>
            <span className="h-4 w-px bg-white" />
          </div>
          <div className="flex h-3 overflow-hidden rounded-full">
            {ZONES.map((zone, index) => (
              <span key={index} className={zone.className} style={{ width: zone.width }} />
            ))}
          </div>
          <div className="ca-mono relative mt-2 h-4 text-[11px] text-zinc-400">
            <span className="absolute left-0">0</span>
            <span className="absolute left-[26%] -translate-x-1/2">1,000</span>
            <span className="absolute left-[66%] -translate-x-1/2">5,000</span>
            <span className="absolute right-0">more</span>
          </div>
        </div>
      </Reveal>

      <ul className="mt-8 space-y-4">
        {EVIDENCE_TIERS.map((tier, index) => (
          <li key={tier.label} className="grid items-baseline gap-x-4 gap-y-1.5 sm:grid-cols-[9.5rem_1fr]">
            <span
              className={`ca-label w-fit rounded px-2 py-0.5 ${
                index === 0 ? 'border border-white/15 text-zinc-400' : index === 1 ? 'bg-[#fa7517]/15 text-[#ff9a3c]' : 'bg-[#fa7517] text-white'
              }`}
            >
              {tier.label}
            </span>
            <span className="text-sm text-zinc-300">
              <span className="font-semibold text-white">{tier.range}.</span> {tier.note}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** What connecting YouTube adds, and the other way in (a Studio export). Nothing here measures a change over time. */
export default function ConnectYouTube() {
  return (
    <section aria-labelledby="ca-connect-title" className="border-t border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-start gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <RevealHeading id="ca-connect-title" className="lp-heading text-4xl text-white sm:text-6xl" parts={['Connect YouTube to add ', 'your real numbers.']} />
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg text-zinc-300">
              Optional, and read-only: Base.Tube reads your YouTube Analytics and changes nothing on your channel. Each video in the audit then
              gets:
            </p>
          </Reveal>
          <ul className="mt-8 space-y-5">
            {CONNECT_ADDS.map((item, index) => {
              const Icon = ICONS[index];
              return (
                <Reveal as="li" key={item.title} delay={0.06 * index} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#fa7517]/25 bg-[#fa7517]/10 text-[#ff9a3c]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-lg font-semibold text-white">{item.title}</span>
                    <span className="block text-base text-zinc-400">{item.text}</span>
                  </span>
                </Reveal>
              );
            })}
          </ul>
          <Reveal delay={0.1}>
            <div className="mt-10 flex gap-4 border-t border-white/10 pt-8">
              <FileSpreadsheet className="mt-1 h-5 w-5 shrink-0 text-zinc-400" aria-hidden="true" />
              <p className="text-base text-zinc-400">
                <span className="font-semibold text-white">Rather not connect?</span> Upload a CSV export from YouTube Studio instead. No access to
                your account; those numbers are labelled self-reported and cover only the dates you confirm.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="lg:sticky lg:top-28 lg:col-span-6 lg:pt-4">
          <Reveal delay={0.15}>
            <EvidenceScale />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
