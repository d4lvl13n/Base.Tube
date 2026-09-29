import type { SubscriptionCatalog } from './catalog';
import ChannelFan from './ChannelFan';
import { Reveal, RevealHeading } from './motion';

/** The channel profile: set up once, followed by every idea. Profile counts per plan come from the catalog. */
export default function ChannelMemory({ catalog }: { catalog: SubscriptionCatalog | null }) {
  const quotas = catalog?.plans.map((plan) => `${plan.channelProfiles} on ${plan.name}`).join(', ');

  return (
    <section aria-labelledby="landing-memory-title" className="relative overflow-hidden border-t border-white/[0.06] py-24 sm:py-32">
      <div aria-hidden="true" className="absolute -left-40 top-1/4 -z-10 h-[420px] w-[520px] rounded-full bg-[#f2b300]/[0.06] blur-[130px]" />
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-2">
        <ChannelFan />

        <div className="max-w-xl">
          <RevealHeading id="landing-memory-title" className="lp-heading text-4xl text-white sm:text-6xl" parts={['It learns ', { accent: 'your channel.' }]} />
          <Reveal delay={0.2}>
            <p className="mt-6 text-lg leading-relaxed text-zinc-300">
              Set up your channel once: <span className="font-semibold text-white">your face, your logo, your colors and your rules.</span>{' '}
              Every idea follows them, so your thumbnails look like <span className="font-semibold text-[#ff9a3c]">yours</span>, video after
              video.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-zinc-400">
              Viewers skip what looks machine-made. Ideas start from your video and your real face, not from a stock look.
            </p>
            {quotas && <p className="mt-8 text-sm text-zinc-500">Channel profiles: {quotas}.</p>}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
