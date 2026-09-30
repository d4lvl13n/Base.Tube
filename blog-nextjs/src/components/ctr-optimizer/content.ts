// The words of /tools/ctr-optimizer: an honest "in development" page for Base.Tube's own CTR AI.
//
// Only state what is true: the model is being built, it has learned from 500k+ public YouTube
// thumbnail assets, it is tested on channels it has never seen, and it is not released because it
// is not good enough to trust yet. No accuracy numbers, no dates, no promised CTR lift, and no
// before/after measurement claim.

import type { FaqItem } from '@/components/ai-thumbnails/catalog';
import { DEMO } from '@/components/ai-thumbnails/content';

/**
 * The question on screen: two of the three ideas AI Thumbnails made for one video (the Studio demo
 * of the AI Thumbnails page). Same video, same creator, a different hook: a real choice to make.
 */
export const PAIR = [
  { letter: 'A', src: DEMO.ideas[0].src, alt: `Idea A: ${DEMO.ideas[0].alt}` },
  { letter: 'B', src: DEMO.ideas[2].src, alt: `Idea B: ${DEMO.ideas[2].alt}` },
] as const;

/** Where the model stands, in plain sentences. */
export const FACTS = [
  'Trained on 500k+ public YouTube thumbnail assets.',
  'Tested on channels it has never seen.',
  'Not released until it’s good enough to be useful.',
] as const;

// Shown on the page and sent as FAQPage structured data (see app/tools/ctr-optimizer/page.tsx):
// one list, so the two always match.
export const CTR_FAQ: FaqItem[] = [
  {
    question: 'What is the Base.Tube CTR AI?',
    answer:
      'It’s an AI model Base.Tube is building to judge YouTube thumbnails by click-through rate (CTR): the share of people who click a video after they see its thumbnail. It’s in development and not released yet.',
  },
  {
    question: 'Can I use it today?',
    answer: 'No. It isn’t good enough to trust yet, and Base.Tube won’t release a click-rate tool that guesses.',
  },
  {
    question: 'What is it trained on?',
    answer: 'Our own model has learned from 500k+ public YouTube thumbnail assets. We test it on channels it has never seen.',
  },
  {
    question: 'When will it launch?',
    answer:
      'We’re not giving a date. We’ll release it when it’s good enough to be useful. Leave your email on this page and we’ll tell you when it launches.',
  },
  {
    question: 'What happens to my email?',
    answer: 'We’ll only email you when it launches.',
  },
];
