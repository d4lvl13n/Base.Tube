'use client';

// The monthly plans, shown in videos per month with a monthly / yearly switch (the app's PlanChoices,
// "page" variant, visitor branch only): every plan button goes to the app's sign-up page for that
// plan and billing period, with the free trial when the catalog offers one.
import { useState } from 'react';
import { Check } from 'lucide-react';
import {
  bestYearlySaving,
  catalogTrial,
  formatCount,
  formatPlanMoney,
  planPriceText,
  signUpUrl,
  startPlanLabel,
  trialButtonLabel,
  videosPerMonthText,
  type BillingInterval,
  type SubscriptionCatalog,
  type SubscriptionPlan,
} from './catalog';

function IntervalToggle({ value, onChange, plans }: { value: BillingInterval; onChange: (value: BillingInterval) => void; plans: SubscriptionPlan[] }) {
  const saving = bestYearlySaving(plans);
  const savings = new Set(plans.map((plan) => plan.prices.year.savingsPercent));
  const option = (interval: BillingInterval, label: string) => (
    <button
      type="button"
      aria-pressed={value === interval}
      onClick={() => onChange(interval)}
      className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm transition-colors ${
        value === interval ? 'bg-[#fa7517] font-semibold text-white' : 'text-zinc-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
  return (
    <div role="group" aria-label="Billing period" className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
      {option('month', 'Monthly')}
      {option('year', saving > 0 ? `Yearly · save ${savings.size > 1 ? 'up to ' : ''}${saving}%` : 'Yearly')}
    </div>
  );
}

function PriceLines({ plan, interval }: { plan: SubscriptionPlan; interval: BillingInterval }) {
  const { month, year } = plan.prices;
  if (interval === 'month')
    return (
      <p className="mt-3 flex items-baseline gap-1 text-white">
        <span className="text-3xl font-semibold">{formatPlanMoney(month.amountCents, month.currency)}</span>
        <span className="text-sm text-zinc-400">/month</span>
      </p>
    );
  const billed = `Billed ${formatPlanMoney(year.amountCents, year.currency)} once a year${year.savingsPercent > 0 ? ` · save ${year.savingsPercent}%` : ''}`;
  return (
    <>
      <p className="mt-3 flex items-baseline gap-1 text-white">
        <span className="text-3xl font-semibold">{formatPlanMoney(year.monthlyEquivalentCents, year.currency)}</span>
        <span className="text-sm text-zinc-400">/month</span>
      </p>
      <p className="text-xs text-zinc-400">{billed}</p>
    </>
  );
}

const primary =
  'inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#fa7517] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#fa7517]/20 transition-colors hover:bg-[#fb8a3c]';

export default function PlanChoices({ catalog }: { catalog: SubscriptionCatalog }) {
  const [interval, setBillingInterval] = useState<BillingInterval>('month');
  // A visitor: checkout adds the free trial when the catalog has one (the server decides).
  const trial = catalogTrial(catalog);
  const startLabel = (plan: SubscriptionPlan) => (trial ? trialButtonLabel(trial) : startPlanLabel(plan, interval));
  // The trial buttons read the same on every plan: their accessible name says which plan.
  const startName = (plan: SubscriptionPlan) => (trial ? `${trialButtonLabel(trial)} · ${plan.name}` : undefined);

  const action = (plan: SubscriptionPlan) => {
    const button = (
      <a href={signUpUrl(plan.id, interval, Boolean(trial))} aria-label={startName(plan)} className={primary}>
        {startLabel(plan)}
      </a>
    );
    // A trial button says what follows it: "then $24/month".
    return trial ? (
      <span className="block space-y-1.5">
        {button}
        <span className="block text-center text-xs text-zinc-400">then {planPriceText(plan, interval)}</span>
      </span>
    ) : (
      button
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <IntervalToggle value={interval} onChange={setBillingInterval} plans={catalog.plans} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {catalog.plans.map((plan) => (
          <article key={plan.id} aria-label={plan.name} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
            <p className="mt-1 text-sm text-zinc-300">{videosPerMonthText(plan.videosPerMonth)}</p>
            <PriceLines plan={plan} interval={interval} />
            <p className="mt-1 text-xs text-zinc-500">{formatCount(plan.creditsPerMonth)} credits a month</p>
            <ul className="mt-4 flex-1 space-y-2">
              {plan.highlights.map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm text-zinc-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#fa7517]" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-5">{action(plan)}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
