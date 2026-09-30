// The plan catalog of AI Thumbnails (GET https://beta.base.tube/api/v1/subscriptions/plans) and the
// wording built from it, ported from the app (types/subscription.ts, hooks/useSubscription.ts,
// billing/PlanChoices.tsx, billing/StartOffer.tsx). Visitor-only: this site has no sign-in, so every
// signed-in branch of the app is left out. No price, video count or trial length is written here.

export type BillingInterval = 'month' | 'year';

export interface PlanMonthPrice {
  amountCents: number;
  currency: string;
}

export interface PlanYearPrice extends PlanMonthPrice {
  /** The yearly price spread over 12 months. */
  monthlyEquivalentCents: number;
  /** The saving against 12 monthly payments, in whole percent (computed by the server). */
  savingsPercent: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  /** Upgrade order: a higher rank is a bigger plan. */
  rank: number;
  videosPerMonth: number;
  creditsPerMonth: number;
  channelProfiles: number;
  /** Ready-to-show English lines: only what the product really does. */
  highlights: string[];
  prices: { month: PlanMonthPrice; year: PlanYearPrice };
}

/** The free trial checkout adds for an account that never had a plan (the same on every plan). */
export interface SubscriptionTrial {
  days: number;
  videos: number;
  credits: number;
}

export interface SubscriptionCatalog {
  /** Credits one video costs (3 concepts, 2 edits, 1 audit, rounded). */
  videoCredits: number;
  videoBreakdown: {
    concepts: number;
    conceptCredits: number;
    edits: number;
    editCredits: number;
    audits: number;
    auditCredits: number;
  };
  rolloverMonths: number;
  free: { channelProfiles: number };
  /** The free trial; null when trials are off (absent on older servers: read as null). */
  trial?: SubscriptionTrial | null;
  plans: SubscriptionPlan[];
}

// ---------------------------------------------------------------------------------------------
// Links to the app (the contract with beta.base.tube, spec section 6)
// ---------------------------------------------------------------------------------------------

export const APP_ORIGIN = 'https://beta.base.tube';
export const AUDIT_URL = `${APP_ORIGIN}/ai-thumbnails/audit`;
export const SIGN_IN_URL = `${APP_ORIGIN}/ai-thumbnails/sign-in`;
export const PRICING_URL = `${APP_ORIGIN}/ai-thumbnails/pricing`;
export const STUDIO_URL = `${APP_ORIGIN}/ai-thumbnails/projects`;
export const REFUND_URL = `${APP_ORIGIN}/refund`;
export const CREATOR_HUB_URL = `${APP_ORIGIN}/creator-hub`;

/** The app's sign-up page, which goes on to checkout for this plan (with the free trial when `trial`). */
export function signUpUrl(planId: string, interval: BillingInterval, trial: boolean): string {
  const query = new URLSearchParams({ plan: planId, interval });
  if (trial) query.set('trial', '1');
  return `${APP_ORIGIN}/ai-thumbnails/sign-up?${query.toString()}`;
}

// ---------------------------------------------------------------------------------------------
// Catalog helpers
// ---------------------------------------------------------------------------------------------

/** The catalog's free trial when it is a real one (whole days and videos), else null (trials off). */
export function catalogTrial(catalog: SubscriptionCatalog | null | undefined): SubscriptionTrial | null {
  const trial = catalog?.trial;
  if (!trial || !Number.isInteger(trial.days) || trial.days <= 0 || !Number.isInteger(trial.videos) || trial.videos <= 0) return null;
  return trial;
}

/** The smallest plan (lowest rank): the one a "Start free trial" button opens. */
export function entryPlan(catalog: SubscriptionCatalog | null | undefined): SubscriptionPlan | null {
  if (!catalog?.plans.length) return null;
  return catalog.plans.reduce((smallest, plan) => (plan.rank < smallest.rank ? plan : smallest));
}

// The page is English only: numbers and prices are written the US way on the server and in every
// browser, so the server's HTML and the browser's first render always agree.
const LOCALE = 'en-US';

/** "$24" for a whole amount, "$16.58" otherwise; the amount and currency come from the catalog only. */
export function formatPlanMoney(priceCents: number, currency: string): string {
  const code = (currency || 'usd').toUpperCase();
  const whole = priceCents % 100 === 0;
  try {
    return new Intl.NumberFormat(LOCALE, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: whole ? 0 : 2,
      maximumFractionDigits: whole ? 0 : 2,
    }).format(priceCents / 100);
  } catch {
    // The currency code is not one Intl knows.
    return `${(priceCents / 100).toFixed(2)} ${code}`;
  }
}

export const formatCount = (value: number) => value.toLocaleString(LOCALE);

/** "$24/month", "$199/year". */
export function planPriceText(plan: SubscriptionPlan, interval: BillingInterval): string {
  const price = plan.prices[interval];
  return `${formatPlanMoney(price.amountCents, price.currency)}/${interval}`;
}

/** "Start Creator · $24/month". */
export const startPlanLabel = (plan: SubscriptionPlan, interval: BillingInterval) => `Start ${plan.name} · ${planPriceText(plan, interval)}`;

/** "6 videos a month". */
export const videosPerMonthText = (videos: number) => `${formatCount(videos)} video${videos === 1 ? '' : 's'} a month`;

/** "Start 7-day free trial". */
export const trialButtonLabel = (trial: SubscriptionTrial) => `Start ${trial.days}-day free trial`;

/** "2 videos free for 7 days · Cancel before day 8 and pay nothing". */
export const trialTermsText = (trial: SubscriptionTrial) =>
  `${formatCount(trial.videos)} video${trial.videos === 1 ? '' : 's'} free for ${trial.days} day${trial.days === 1 ? '' : 's'} · Cancel before day ${trial.days + 1} and pay nothing`;

/** The best yearly saving in the catalog, as the server computed it. */
export const bestYearlySaving = (plans: SubscriptionPlan[]) => plans.reduce((best, plan) => Math.max(best, plan.prices.year.savingsPercent || 0), 0);

// ---------------------------------------------------------------------------------------------
// The start offer for a visitor (the app's StartOffer, visitor branches only)
// ---------------------------------------------------------------------------------------------

export type StartOffer =
  /** The plans did not load: the pricing page instead. */
  | { kind: 'unavailable' }
  | { kind: 'trial'; plan: SubscriptionPlan; trial: SubscriptionTrial }
  | { kind: 'plan'; plan: SubscriptionPlan };

/** What the start button offers a visitor. */
export function startOffer(catalog: SubscriptionCatalog | null): StartOffer {
  const plan = entryPlan(catalog);
  if (!plan) return { kind: 'unavailable' };
  const trial = catalogTrial(catalog);
  return trial ? { kind: 'trial', plan, trial } : { kind: 'plan', plan };
}

/** The line under the start button: the trial's terms, or the plan's price. */
export function startOfferTerms(offer: StartOffer): string | null {
  if (offer.kind === 'trial') return trialTermsText(offer.trial);
  if (offer.kind === 'plan') return `${offer.plan.name}: ${videosPerMonthText(offer.plan.videosPerMonth)} for ${planPriceText(offer.plan, 'month')} · Cancel any time`;
  return null;
}

// ---------------------------------------------------------------------------------------------
// FAQ (the app's landingFaq): the video, trial and expiry answers use the catalog's numbers
// ---------------------------------------------------------------------------------------------

export interface FaqItem {
  question: string;
  answer: string;
}

export function landingFaq(catalog: SubscriptionCatalog | null): FaqItem[] {
  const trial = catalogTrial(catalog);
  const video = catalog
    ? (() => {
        const { concepts, edits, audits } = catalog.videoBreakdown;
        const reviews = audits === 1 ? 'a review' : `${audits} reviews`;
        return `One video is ${concepts} ideas, ${edits} edits and ${reviews}: about ${catalog.videoCredits} credits. `;
      })()
    : '';
  const planCredits =
    catalog?.rolloverMonths === 0
      ? 'Plan credits stay usable until the end of the month they are for.'
      : 'Plan credits stay usable until the end of the following month.';
  const items: Array<FaqItem | null> = [
    {
      question: 'Will this increase my views?',
      answer:
        'We can’t promise that, and anyone who does is guessing. Better thumbnails give your video a better chance. Connect YouTube to see each video’s real click rate.',
    },
    {
      question: 'Will it look AI-made?',
      answer: 'It starts from your video and your real face, in your channel’s style. You pick, and change anything in plain words.',
    },
    {
      question: 'Can I use my face?',
      answer: 'Yes. Add a photo to your channel profile once; it’s used in every idea you ask for.',
    },
    {
      question: 'What’s a video, what’s a credit?',
      answer: `${video}Plans are sold in videos; credits are how we count.`,
    },
    trial
      ? {
          question: 'How does the free trial work?',
          answer: `${trial.days} days, ${trial.videos} video${trial.videos === 1 ? '' : 's'} included. Your card is charged on day ${trial.days + 1} unless you cancel, in one click from Settings.`,
        }
      : null,
    {
      question: 'Do credits expire?',
      answer: `${planCredits}${trial ? ' Free trial credits end with the trial.' : ''} Credit packs never expire.`,
    },
    {
      question: 'Why not Canva or Photoshop?',
      answer: 'They’re great if you have the time and the eye. AI Thumbnails gives you three finished ideas per video, in your style.',
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, from Settings › Subscription. Your credits stay usable until they expire.',
    },
  ];
  return items.filter((item): item is FaqItem => item !== null);
}
