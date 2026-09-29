import { ArrowRight } from 'lucide-react';
import { PRICING_URL, type SubscriptionCatalog } from './catalog';
import { RevealHeading } from './motion';
import PlanChoices from './PlanChoices';

/**
 * The three plans from the catalog, with the pricing page's plan cards and buttons (the free trial),
 * then the way to the app's full pricing page with the credit packs. Without the catalog: the
 * heading and that link only.
 */
export default function Pricing({ catalog }: { catalog: SubscriptionCatalog | null }) {
  return (
    <section id="pricing" aria-labelledby="landing-pricing-title" className="scroll-mt-16 border-t border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <RevealHeading
            id="landing-pricing-title"
            className="lp-heading text-4xl text-white sm:text-5xl"
            parts={['The price of ', { accent: 'one designer thumbnail' }, ', for your whole month.']}
          />
          {catalog && (
            <p className="mt-5 text-lg text-zinc-400">
              Plans are counted in videos. Each video is {catalog.videoBreakdown.concepts} ideas, {catalog.videoBreakdown.edits} edits and{' '}
              {catalog.videoBreakdown.audits === 1 ? 'a review' : `${catalog.videoBreakdown.audits} reviews`}.
            </p>
          )}
        </div>
        <div className="mt-10">{catalog && <PlanChoices catalog={catalog} />}</div>
        <p className="mt-8 text-center">
          <a href={PRICING_URL} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#fb923c] hover:text-orange-300">
            See all plans and credit packs
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </p>
      </div>
    </section>
  );
}
