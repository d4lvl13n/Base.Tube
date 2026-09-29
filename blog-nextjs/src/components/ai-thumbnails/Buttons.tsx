import { ArrowRight, ScanSearch } from 'lucide-react';
import {
  AUDIT_URL,
  PRICING_URL,
  signUpUrl,
  startPlanLabel,
  trialButtonLabel,
  type StartOffer,
} from './catalog';

/** The main call to action (the free trial or plan button): warm gradient with a light sweeping across. */
export const primaryButton =
  'lp-btn-primary inline-flex h-14 items-center justify-center gap-2 whitespace-nowrap rounded-full px-8 text-base font-semibold text-white';

/**
 * The start button for a visitor (the app's StartOfferButton, visitor branches only):
 * "Start 7-day free trial" (the header's short form: "Start free trial") goes to the app's sign-up
 * page with the entry plan; the plan with its price when there is no trial; "See plans" when the
 * catalog did not load (and in the header when there is no trial).
 */
export function StartOfferButton({ offer, short = false, className }: { offer: StartOffer; short?: boolean; className: string }) {
  if (offer.kind === 'unavailable' || (short && offer.kind === 'plan'))
    return (
      <a href={PRICING_URL} className={className}>
        See plans
      </a>
    );
  const trial = offer.kind === 'trial' ? offer.trial : null;
  const label = trial ? (short ? 'Start free trial' : trialButtonLabel(trial)) : startPlanLabel(offer.plan, 'month');
  return (
    <a href={signUpUrl(offer.plan.id, 'month', Boolean(trial))} className={className}>
      {label}
    </a>
  );
}

/**
 * "Review a thumbnail": a rotating orange light along the border, the scan icon, and the FREE tag
 * (a visitor's reviews are free).
 */
export function ReviewButton({ className = '' }: { className?: string }) {
  return (
    <a
      href={AUDIT_URL}
      className={`lp-btn-secondary group inline-flex h-14 items-center justify-center gap-3 whitespace-nowrap rounded-full pl-3 pr-6 text-base font-semibold text-white ${className}`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fa7517]/15 text-[#fa7517] transition-colors group-hover:bg-[#fa7517] group-hover:text-white">
        <ScanSearch className="h-4 w-4" aria-hidden="true" />
      </span>
      Review a thumbnail
      <span className="rounded-md bg-white px-1.5 py-0.5 text-[11px] font-extrabold tracking-wide text-black">FREE</span>
      <ArrowRight className="-ml-1 h-4 w-4 opacity-0 transition-all group-hover:ml-0 group-hover:opacity-100" aria-hidden="true" />
    </a>
  );
}
