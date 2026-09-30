// The facts and words of the channel audit landing page (/youtube-channel-audit).
//
// Every sentence here is based on the app and backend code (checked 30 September 2026):
//   app      base-tube-mockup  src/components/pages/CTREngine/ChannelAuditPage.tsx, ChannelAuditReport.tsx,
//                              ChannelAuditProgress.tsx, AnalyticsSourceCTAs.tsx, VideoMetricCards.tsx
//   backend  base-be           src/routes/channelAuditRoutes.ts, controllers/ChannelAuditController.ts,
//                              services/channelAudit/ChannelAuditService.ts, evidence.ts
// What is true there: free during the beta (no credits used), a free Base.Tube account is needed,
// no score of any kind, no click prediction, the last 20 videos are pulled, a sample is read closely
// (3 in the preview, up to 8 with the creator's own numbers), connecting YouTube is read-only and
// not tied to a plan. The app does not read a channel from its address, so every button opens the
// audit without one filled in.

import { APP_ORIGIN, AUDIT_URL } from '@/components/ai-thumbnails/catalog';

export const PAGE_URL = 'https://base.tube/youtube-channel-audit';

/** The channel audit in the app (sign-in first for a visitor, then the channel field). */
export const CHANNEL_AUDIT_APP_URL = `${APP_ORIGIN}/ai-thumbnails/channel-audit`;
/** The free review of one thumbnail (accepts ?url=). */
export const THUMBNAIL_REVIEW_URL = AUDIT_URL;

const ASSETS = '/images/channel-audit';
export const OG_IMAGE_SRC = `${ASSETS}/og-channel-audit.jpg`;

// ---------------------------------------------------------------------------------------------
// The example report: Sam's Garage is invented. Its three thumbnails were made for this page
// (barn-find-1972 with AI Thumbnails, the other two with an image model). The shape and the rules
// of the words are the app's: countable facts under "Observed", a hedged hypothesis, numbered
// experiments with a variant brief and a way to measure. No view or subscriber numbers.
// ---------------------------------------------------------------------------------------------

export interface ExampleVideo {
  id: string;
  title: string;
  src: string;
  alt: string;
  observed: string[];
  hypothesis: string;
  experiment: number;
}

export interface ExampleExperiment {
  priority: number;
  title: string;
  hypothesis: string;
  thumbnail: string;
  titleBrief?: string;
  method: string;
  videos: string[];
}

export const EXAMPLE = {
  channel: 'Sam’s Garage',
  niche: 'Classic truck restoration',
  videosAnalyzed: 20,
  positioning:
    'A one-man restoration channel: old trucks pulled out of barns and brought back to running order, with Sam doing the work on camera. Every video asks the same question: will this one run again?',
  headline:
    'Each thumbnail uses a different light: warm barn, white workshop, blue night. Two of the three put their title’s words on the image; the third has no text at all.',
  videos: [
    {
      id: 'barn',
      title: 'Barn Find: Will This 1972 Truck Run Again?',
      src: `${ASSETS}/barn-find-1972.webp`,
      alt: 'Example thumbnail: a grey-haired man in a denim shirt leaning on a rusty 1972 pickup in a sunlit barn, no text',
      observed: [
        'No text on the image',
        'Two subjects: Sam in the left third, the truck across the right two-thirds',
        'Sam’s face is about 2% of the frame, looking at the camera',
        'Warm, golden light with sun rays through the barn boards',
        'None of the title’s 8 words appears on the image',
      ],
      hypothesis:
        'With no text and a calm, posed frame, the image may read as a portrait of a man and his truck. The question the video asks (will it run?) could be living in the title alone.',
      experiment: 2,
    },
    {
      id: 'engine',
      title: 'I Rebuilt This Engine in 48 Hours',
      src: `${ASSETS}/engine-48-hours.webp`,
      alt: 'Example thumbnail: the same man holding a wrench next to a stripped V8 engine on a stand, a red arrow and the yellow words 48 HOURS',
      observed: [
        '2 words of text on the image (“48 HOURS”), yellow, top left',
        'The text repeats 2 of the title’s 7 words',
        'Five things to look at: the text, a red arrow, the engine, Sam, a workbench full of parts',
        'Sam’s face is about 5% of the frame, on the right edge',
        'Cool white workshop light; tools and a second truck fill the background',
      ],
      hypothesis:
        'With five things of similar weight, the eye may have no clear first stop at phone size, and “48 HOURS” says again what the title already says instead of adding a second idea.',
      experiment: 1,
    },
    {
      id: 'start',
      title: 'Will It Start After 30 Years in a Barn?',
      src: `${ASSETS}/will-it-start.webp`,
      alt: 'Example thumbnail: the rusty pickup at night with its headlights on, the man at the wheel, the white words WILL IT START? across the top',
      observed: [
        '3 words of text on the image (“WILL IT START?”), white with a black outline',
        'The text repeats the first 3 of the title’s 9 words',
        'The text is the largest element: about the top third of the frame',
        'Sam is at the wheel, seen through the side window; his face is under 1% of the frame',
        'Dark blue night light: the only night scene of the three',
      ],
      hypothesis:
        'The question is impossible to miss, but at phone size the text may crowd the truck, which is what a viewer wants to see. The blue night light may also not look like the same channel as the other two.',
      experiment: 1,
    },
  ] satisfies ExampleVideo[],
  experiments: [
    {
      priority: 1,
      title: 'Let the image add a second idea',
      hypothesis:
        'If the words on the image say something the title doesn’t, the pair may tell a viewer two things in one glance instead of one thing twice.',
      thumbnail:
        'Keep the engine photo but crop in until the engine fills about 40% of the frame. Remove the arrow and most of the workbench. Replace “48 HOURS” with two words the title doesn’t use, such as “SEIZED SOLID”.',
      method: 'YouTube Test & Compare, 2 variants (current and new), run until at least 5,000 impressions per variant.',
      videos: ['engine', 'start'],
    },
    {
      priority: 2,
      title: 'One look across the channel',
      hypothesis:
        'If every thumbnail shares one kind of light and one text style, the videos may be easier to recognise as one channel when they sit next to each other.',
      thumbnail:
        'Redo “Will it start?” in the warm light of the barn-find thumbnail. Set the text in the same yellow as “48 HOURS”, at about half its current width, so the truck and its headlights stay visible.',
      method:
        'YouTube Test & Compare, 2 variants, at least 5,000 impressions per variant. Then look at the channel page as a whole.',
      videos: ['start', 'barn'],
    },
  ] satisfies ExampleExperiment[],
  swipeFile: {
    searchQueries: ['barn find truck restoration', 'will it run after 30 years', 'classic truck engine rebuild'],
    size: 'Similar-sized channels',
    examples: [
      {
        title: 'Abandoned for 40 Years: Can We Save It?',
        channel: 'Rust Belt Revival',
        why: 'One subject, the truck, at about half the frame. The title asks the question; the image only shows what is at stake.',
      },
      {
        title: 'First Drive After 25 Years',
        channel: 'Two Guys and a Tow Truck',
        why: 'The same warm light and the same text style on every video, so the channel page reads as one set.',
      },
    ],
  },
};

// ---------------------------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------------------------

/** What the audit reads and writes, in the order of the report. */
export const CHECKS: { title: string; text: string }[] = [
  {
    title: 'Your latest videos, up to 20',
    text: 'Titles, thumbnails and public view counts, read from your channel. Paste a channel link, an @handle or a channel ID.',
  },
  {
    title: 'A close read of a few thumbnails',
    text: 'Your most-viewed and least-viewed videos, plus some from the middle: 3 in the free preview, up to 8 once your own numbers are added. Each is described in countable facts: words of text, how many things compete, how much of the frame a face takes, the light. Those facts are written from the thumbnail and the title alone, without the view counts.',
  },
  {
    title: 'Positioning',
    text: 'One paragraph on what your channel is, before any judgment.',
  },
  {
    title: 'A hypothesis for each video',
    text: 'A careful guess at what might be holding a thumbnail back, worded as something to test, never as a cause.',
  },
  {
    title: 'Experiments to run',
    text: 'Numbered in the order to run them. Each one is a single change, with a brief for the new thumbnail (and the title, when it matters) and how to measure it.',
  },
  {
    title: 'A swipe file',
    text: 'Thumbnails worth studying from channels in your niche, with the searches used to find them, labelled by size: similar-sized, mixed, or larger channels (for inspiration, not comparison).',
  },
  {
    title: 'A review queue',
    text: 'Which of those videos sit far above your median views (twice or more) or far below (half or less). Descriptive only: views are not adjusted for upload age.',
  },
];

/** The steps the app shows while an audit runs (ChannelAuditProgress.tsx). */
export const AUDIT_STAGES = [
  'Resolving the channel',
  'Pulling your last videos',
  'Building your swipe file',
  'Observing your thumbnails',
  'Writing up the experiments',
];

export const STEPS: { title: string; text: string }[] = [
  {
    title: 'Sign in',
    text: 'With a free Base.Tube account: email, Google or Discord. You come straight back to the audit.',
  },
  {
    title: 'Paste your channel',
    text: 'A channel link, an @handle or a channel ID. No access to your YouTube account is needed.',
  },
  {
    title: 'Read your report',
    text: 'The app shows each step while it works. Your reports are saved to your account, and reopening one is free.',
  },
];

/** What connecting YouTube adds to each audited video (ChannelAuditReport / VideoMetricCards). */
export const CONNECT_ADDS: { title: string; text: string }[] = [
  {
    title: 'Impressions and click-through rate',
    text: 'Straight from YouTube. They arrive within 24 to 48 hours of connecting.',
  },
  {
    title: 'How long people watched',
    text: 'Average view duration and the share of the video viewed, right away.',
  },
  {
    title: 'Subscribers gained and the main traffic source',
    text: 'Also right away.',
  },
  {
    title: 'A closer read',
    text: 'Up to 8 thumbnails read closely instead of 3.',
  },
];

/** evidence.ts: below 1,000 impressions a CTR is not shown; above 5,000 it is observational. */
export const EVIDENCE_TIERS = [
  { label: 'not enough data', range: 'under 1,000 impressions', note: 'The rate is not shown.' },
  { label: 'directional', range: '1,000 to 5,000', note: 'Points somewhere, proves nothing.' },
  { label: 'observational', range: 'over 5,000', note: 'Describes what happened. Still not a cause.' },
];

/** What the audit is not. Each line pairs the thing people expect with what happens instead. */
export const NOT_LIST: { not: string; instead: string }[] = [
  {
    not: 'A click-through-rate prediction.',
    instead: 'Nobody can predict clicks from an image. A real click-through rate appears only when you connect YouTube, and only from YouTube’s own numbers.',
  },
  {
    not: 'A score out of 100.',
    instead: 'No grade and no points. Each video gets facts, a hypothesis and an experiment.',
  },
  {
    not: 'A verdict on why a video did well.',
    instead: 'Every reading is a hypothesis. Before a report is saved, its wording is checked for claims that a thumbnail caused a result, and a report that makes one is not published.',
  },
  {
    not: 'An A/B test.',
    instead: 'To compare thumbnails on one video, use YouTube’s Test & Compare. The audit tells you what to test and how to measure it.',
  },
];

export const FREE_TOOLS: { href: string; name: string; text: string }[] = [
  { href: '/tools/youtube-thumbnail-preview', name: 'Thumbnail preview', text: 'Your thumbnail and title in the home feed, search and up next.' },
  { href: '/tools/youtube-thumbnail-tester', name: 'Thumbnail tester', text: 'Two or three versions side by side, at feed size and tiny size.' },
  { href: '/tools/youtube-title-checker', name: 'Title checker', text: 'Where your title gets cut on desktop, mobile and search.' },
  { href: '/tools/youtube-thumbnail-resizer', name: 'Thumbnail resizer', text: 'Any image to 16:9, under YouTube’s size limit.' },
];

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Six questions people search for (keyword data, September 2026: "youtube channel audit",
 * "thumbnail checker" / "thumbnail rater" / "thumbnail analyzer", "what is a good click through rate
 * youtube", "youtube a/b test", "free"). `freeReviews`: the free thumbnail reviews a visitor gets a
 * day, from the app (null leaves that sentence out).
 */
export function channelAuditFaq(freeReviews: number | null): FaqItem[] {
  const reviewsLine =
    freeReviews !== null ? ` You get ${freeReviews} free review${freeReviews === 1 ? '' : 's'} a day, no account needed.` : '';
  return [
    {
      question: 'What does a YouTube channel audit check?',
      answer:
        'This one reads your packaging: the thumbnails and titles of your recent videos. It pulls your latest videos (up to 20), reads a few of them closely (3 in the free preview, up to 8 once your own numbers are added) and writes down what is on each thumbnail, what might be holding it back, and the experiments to run next. It also builds a swipe file from channels in your niche.',
    },
    {
      question: 'Is it a thumbnail checker or a thumbnail rater? Do I get a score?',
      answer: `The channel audit gives no score: it tells you what is on each thumbnail and what to test, which a number can’t. To rate a single image, use the free thumbnail review: an Attention Score from 1 to 10 (how hard the thumbnail fights for attention) with what to change. It is not a prediction of clicks.${reviewsLine}`,
    },
    {
      question: 'What is a good click-through rate on YouTube?',
      answer:
        'There is no single good number. Click-through rate changes with where a video is shown (home page, search, suggested videos) and with how many people see it, so compare a video with your own other videos, not with another channel. Connect YouTube and the audit shows each video’s real click-through rate next to the impressions behind it; under 1,000 impressions it says there is not enough data instead of showing a rate.',
    },
    {
      question: 'How do I A/B test a YouTube thumbnail?',
      answer:
        'Use Test & Compare in YouTube Studio: it shows different thumbnails of the same video to real viewers and tells you which one did best. Every experiment in the audit says what to change and how to measure it, for example “YouTube Test & Compare, 2 variants, at least 5,000 impressions per variant”. Base.Tube does not run the test for you.',
    },
    {
      question: 'Is the channel audit free?',
      answer:
        'Yes. The channel audit is free during the Base.Tube beta and uses no credits. You need a free Base.Tube account so your reports are saved (email, Google or Discord). Reopening a saved report is free too.',
    },
    {
      question: 'Do I have to connect my YouTube account?',
      answer:
        'No. The audit works on what anyone can see on YouTube. Connecting (read-only) adds your own numbers to each video: impressions and click-through rate, watch time, subscribers gained and the main traffic source. If you would rather not give access, upload a CSV export from YouTube Studio instead; those numbers are labelled self-reported.',
    },
  ];
}
