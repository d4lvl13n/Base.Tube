// The home page's fixed facts. Every image is an example made with AI Thumbnails (see
// components/ai-thumbnails/content.ts for where each one comes from). No prices, counts or results
// are written here: the home page states none.
import { DEMO, EXAMPLE_THUMBNAILS, type ExampleThumbnail } from '@/components/ai-thumbnails/content';

export { DEMO };
export type { ExampleThumbnail };

const byName = new Map(EXAMPLE_THUMBNAILS.map((thumb) => [thumb.src.split('/').pop()!.replace('.webp', ''), thumb]));
const pick = (names: string[]): ExampleThumbnail[] =>
  names.map((name) => {
    const thumb = byName.get(name);
    if (!thumb) throw new Error(`Unknown example thumbnail: ${name}`);
    return thumb;
  });

/** The feed that runs through the hero's headline, in order (the second one sits in the frame first). */
export const HERO_FEED = pick([
  'saturn-tonight',
  'finalboss-world-record',
  'amazingaerial-norway',
  'before-you-buy',
  'codolie-automation',
  'basetube-30-days',
  'day-trading-live',
  'french-hits-2026',
  'app-50k-month',
  'procyon-silver-gold',
  'reaction-no-way',
  'made-200-books',
]);

/** The wall of the "made with AI Thumbnails" section: three offset rows. */
export const PROOF_ROWS = [
  pick(['amazingaerial-lava', 'finalboss-no-armor', 'basetube-first-1000', 'codolie-dev-tools', 'procyon-gold-phone', 'premier-avis-1h', 'lazy-money-300-day']),
  pick(['barn-find-1972', 'subscription-leaks', 'basetube-30-min-edit', 'amazingaerial-city-night', 'codolie-mini-pc', 'finalboss-200-hours', 'before-you-buy']),
  pick(['procyon-silver-mistakes', 'french-hits-2026', 'app-50k-month', 'finalboss-world-record', 'amazingaerial-norway', 'made-200-books', 'basetube-30-days']),
];

/** The platform's sign-up page (the product app lives on beta.base.tube). */
export const SIGN_UP_URL = 'https://beta.base.tube/sign-up';

/** Membership and Content Pass, side by side, in plain words (no investment framing). */
export const PASS_VS_MEMBERSHIP = [
  { label: 'How fans pay', membership: 'Every month', pass: 'Once, by card' },
  { label: 'When you are paid', membership: 'Month by month, while they stay', pass: 'Upfront, when they buy' },
  { label: 'How long access lasts', membership: 'Until they stop paying', pass: 'For good' },
  { label: 'Passing it on', membership: 'Not possible', pass: 'Fans can resell their pass, if you allow it' },
];
