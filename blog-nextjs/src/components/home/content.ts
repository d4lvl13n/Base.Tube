// The home page's fixed facts. Numbers and quotes come only from the owner's research in
// business-scout/basetube/research-tenant (stats.md for public statistics with their source, and
// pains.jsonl for creator quotes checked word for word against the Reddit thread). Each one is shown
// on the page with its source. Nothing else on the page states a number, except the 90% creator share.
import { DEMO } from '@/components/ai-thumbnails/content';

export { DEMO };

/** The platform's sign-up page (the product app lives on beta.base.tube). */
export const SIGN_UP_URL = 'https://beta.base.tube/sign-up';

const CHANNELS = '/images/ai-thumbnails/channels';

/**
 * The hero's audience: illustrative fans (invented names), what each one bought, and a face for some.
 * The first 6 show on phones (one column), all 15 from tablet width up (three columns).
 */
export const FANS: { name: string; bought: string; face: string | null; tint: string }[] = [
  { name: 'Ana P.', bought: 'Full course', face: `${CHANNELS}/ana.webp`, tint: '#f2b300' },
  { name: 'Tom K.', bought: 'Director’s cut', face: `${CHANNELS}/tom.webp`, tint: '#3b9eff' },
  { name: 'Lina S.', bought: 'Archive pass', face: null, tint: '#e8590c' },
  { name: 'Kai M.', bought: 'Full course', face: `${CHANNELS}/kai.webp`, tint: '#11c48a' },
  { name: 'Rosa D.', bought: 'Film', face: null, tint: '#c084fc' },
  { name: 'Ben A.', bought: 'Archive pass', face: `${CHANNELS}/ben.webp`, tint: '#f97316' },
  { name: 'Maya R.', bought: 'Workshop', face: `${CHANNELS}/maya.webp`, tint: '#fbbf24' },
  { name: 'Jonas W.', bought: 'Film', face: null, tint: '#60a5fa' },
  { name: 'Leo F.', bought: 'Director’s cut', face: `${CHANNELS}/leo.webp`, tint: '#34d399' },
  { name: 'Ines B.', bought: 'Full course', face: null, tint: '#fb7185' },
  { name: 'Sam O.', bought: 'Archive pass', face: `${CHANNELS}/sam.webp`, tint: '#a3e635' },
  { name: 'Nora L.', bought: 'Workshop', face: null, tint: '#f472b6' },
  { name: 'Theo G.', bought: 'Film', face: null, tint: '#38bdf8' },
  { name: 'Aiko T.', bought: 'Full course', face: null, tint: '#facc15' },
  { name: 'Omar H.', bought: 'Director’s cut', face: null, tint: '#fb923c' },
];

export interface Source {
  label: string;
  url: string;
}

/** What renting means, in public numbers (stats.md, rows 1, 2 and 17). */
export const RENT_STATS: { figure: string; text: string; source: Source }[] = [
  {
    figure: '45%',
    text: 'of the ad revenue from your long-form videos is kept by YouTube. On Shorts, it keeps 55%.',
    source: { label: 'YouTube Help, YouTube Partner Program revenue shares', url: 'https://support.google.com/youtube/answer/72902' },
  },
  {
    figure: '88%',
    text: 'of creators surveyed said changes to an algorithm or a platform feature would significantly affect their business in the coming year.',
    source: { label: 'Influencer Marketing Factory survey, 2024, via BusinessWire', url: 'https://www.businesswire.com/news/home/20240423305250/en/' },
  },
];

/** The Shorts share has its own YouTube Help page. */
export const SHORTS_SOURCE: Source = {
  label: 'YouTube Help, Shorts monetization policies',
  url: 'https://support.google.com/youtube/answer/12504220',
};

/** Creator quotes, word for word, with their community and thread (pains.jsonl). */
export const CREATOR_QUOTES: { text: string; community: string; url: string }[] = [
  {
    text: 'I was making $2,000/month from YouTube Shorts, then overnight, every video dropped to 0 views',
    community: 'r/PartneredYoutube',
    url: 'https://reddit.com/r/PartneredYoutube/comments/1oj6ymj/i_was_making_2000month_from_youtube_shorts_then/',
  },
  {
    text: "I've spent three years building a 300M+ channel dedicated to high-quality Cyberpunk lore. YouTube FLAGGED and DEACTIVATED it.",
    community: 'r/cyberpunkgame',
    url: 'https://reddit.com/r/cyberpunkgame/comments/1sedn21/ive_spent_three_years_building_a_300m_channel/',
  },
  {
    text: "My channel was *I believe* wrongly terminated at 175,000 subscribers and I can't get in contact with a human representative, any advice?",
    community: 'r/YouTubeCreators',
    url: 'https://reddit.com/r/YouTubeCreators/comments/1q4g72n/my_channel_was_i_believe_wrongly_terminated_at/',
  },
];

/** Fans already pay creators directly (stats.md, rows 9 and 11). */
export const DIRECT_STATS: { figure: string; text: string; source: Source }[] = [
  {
    figure: '$10B+',
    text: 'paid by fans to creators on Patreon since 2013.',
    source: { label: 'Patreon, About', url: 'https://www.patreon.com/about' },
  },
  {
    figure: '$25B+',
    text: 'paid to creators on OnlyFans since 2016.',
    source: { label: 'Sacra, OnlyFans profile (company statement, Oct 2025)', url: 'https://sacra.com/c/onlyfans/' },
  },
];

/** Membership and Content Pass, side by side, in plain words (no investment framing). */
export const PASS_VS_MEMBERSHIP = [
  { label: 'How fans pay', membership: 'Every month', pass: 'Once, by card' },
  { label: 'When you are paid', membership: 'Month by month, while they stay', pass: 'Upfront, when they buy' },
  { label: 'How long access lasts', membership: 'Until they stop paying', pass: 'For good' },
  { label: 'Passing it on', membership: 'Not possible', pass: 'Fans can resell their pass, if you allow it' },
];
