import { Reveal, RevealHeading } from '@/components/ai-thumbnails/motion';
import { AuditButton, AuditTerms } from './Buttons';

/** The last call to action, on the same ruled pad as the hero. */
export default function FinalCTA() {
  return (
    <section aria-labelledby="ca-final-title" className="relative isolate overflow-hidden border-t border-white/[0.06] py-28 sm:py-40">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.035)_0,rgba(255,255,255,0.035)_1px,transparent_1px,transparent_44px)] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,#000_20%,transparent_100%)]"
      />
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <RevealHeading id="ca-final-title" className="lp-display text-5xl text-white sm:text-7xl" parts={['Know what to ', { accent: 'test next.' }]} />
        <Reveal delay={0.25}>
          <p className="mx-auto mt-8 max-w-xl text-lg text-zinc-300">
            Your thumbnails and titles written up in plain words, with the experiments to run next. Free, and saved to your account.
          </p>
          <div className="mt-10 flex justify-center">
            <AuditButton />
          </div>
          <AuditTerms className="mt-5" />
        </Reveal>
      </div>
    </section>
  );
}
