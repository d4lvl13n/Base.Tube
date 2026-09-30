import { Check, Link2, LogIn, ScanSearch, Wallet } from 'lucide-react';
import { Reveal, RevealHeading } from '@/components/ai-thumbnails/motion';
import { AUDIT_STAGES, STEPS } from './content';

/** Each step with a small, faithful picture of what the app shows at that moment. */
function StepPicture({ index }: { index: number }) {
  if (index === 0)
    return (
      <div className="space-y-2" aria-hidden="true">
        {[
          { Icon: LogIn, label: 'Sign in with email', hint: 'Email, Google or Discord' },
          { Icon: Wallet, label: 'Sign in with wallet', hint: 'Connect your Web3 wallet' },
        ].map(({ Icon, label, hint }) => (
          <div key={label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 p-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fa7517]/15 text-[#ff9a3c]">
              <Icon className="h-4 w-4" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-medium text-white">{label}</span>
              <span className="block text-xs text-zinc-400">{hint}</span>
            </span>
          </div>
        ))}
      </div>
    );
  if (index === 1)
    return (
      <div aria-hidden="true">
        <p className="flex items-center gap-2 text-sm font-semibold text-white">
          <Link2 className="h-4 w-4 text-[#fa7517]" />
          Channel URL or @handle
        </p>
        <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-400">youtube.com/@yourchannel</div>
        <div className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#f97316] px-4 py-3 text-sm font-semibold text-white">
          <ScanSearch className="h-4 w-4" />
          Audit channel
        </div>
      </div>
    );
  return (
    <ol className="space-y-2" aria-label="The steps the app shows while it works">
      {AUDIT_STAGES.map((stage) => (
        <li key={stage} className="flex items-center gap-3 text-sm text-zinc-300">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-green-500/40 bg-green-500/10 text-green-400" aria-hidden="true">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          {stage}
        </li>
      ))}
    </ol>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="ca-how-title" className="scroll-mt-16 border-t border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <RevealHeading id="ca-how-title" className="lp-heading max-w-3xl text-4xl text-white sm:text-6xl" parts={['Three steps, ', 'one report.']} />
        <ol className="mt-16 grid gap-12 lg:grid-cols-3 lg:gap-10">
          {STEPS.map((step, index) => (
            <Reveal as="li" key={step.title} delay={0.12 * index} className="relative border-t border-white/15 pt-8">
              <span className="absolute -top-px left-0 h-px w-16 bg-[#fa7517]" aria-hidden="true" />
              <p className="lp-display text-5xl text-white/90" aria-hidden="true">
                {index + 1}
              </p>
              <h3 className="mt-6 text-2xl font-semibold text-white">{step.title}</h3>
              <p className="mt-3 max-w-sm text-base text-zinc-400">{step.text}</p>
              <div className="mt-8 max-w-sm">
                <StepPicture index={index} />
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
