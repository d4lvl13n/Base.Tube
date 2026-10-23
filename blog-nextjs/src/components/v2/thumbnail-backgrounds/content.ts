import { MEASURED } from '../thumbnail-size/specs';
import { BACKGROUNDS, GROUPS, USAGE_TERMS } from './backgrounds';

export const PAGE_PATH = '/youtube-thumbnail-backgrounds';
export const PAGE_URL = `https://base.tube${PAGE_PATH}`;

/** Search snippet: title at most 60 characters, description at most 155, both with the main keyword. */
export const TITLE = `${BACKGROUNDS.length} Free YouTube Thumbnail Backgrounds to Download`;
export const DESCRIPTION =
  'Free YouTube thumbnail backgrounds with one side left empty for your face and title, readable on a phone. Download one or turn it into a full thumbnail.';

/** Base.Tube Studio (AI Thumbnails). `ref` tells the Studio which card the visitor came from. */
export const STUDIO_URL = 'https://base.tube/ai-thumbnails';

export function studioHref(ref: string): string {
  const u = new URL(STUDIO_URL);
  u.searchParams.set('ref', `backgrounds-${ref}`);
  return u.toString();
}

export interface FaqItem {
  q: string;
  a: string;
}

/** Shown on the page AND emitted as FAQPage JSON-LD, so the two can never drift apart. */
export const FAQ: FaqItem[] = [
  {
    q: 'Where can I get free YouTube thumbnail backgrounds?',
    a: `On this page. There are ${BACKGROUNDS.length} original backgrounds in ${GROUPS.length} groups: gaming, dark, bright, studio, sport and gradients. Each one is a 1280 × 720 file with a Download button. They were made for thumbnails, so one side is left empty for your face and title, and the bottom-right corner stays clear for the video length.`,
  },
  {
    q: 'Can I use these backgrounds on a monetised channel?',
    a: `Here are the terms in full: ${USAGE_TERMS}`,
  },
  {
    q: 'Is there a Minecraft background for thumbnails?',
    a: 'Yes. The blocky voxel landscape in Gaming worlds has cube hills, square trees and a bright sky, with open sky on the left for you and your title.',
  },
  {
    q: 'Is there a Fortnite background for thumbnails?',
    a: 'Yes. The cartoon battle-royale island in Gaming worlds has a bright island, turquoise sea and a purple storm ring, with open sea and sky on the right for you and your title.',
  },
  {
    q: 'What size should a YouTube thumbnail background be?',
    a: 'Use the 16:9 shape. These files are 1280 × 720 pixels, which still meets YouTube’s rules: the minimum width is 640 pixels. YouTube now recommends 3840 × 2160 and accepts up to 2 MB from the phone app or 50 MB on a computer. Our YouTube thumbnail size guide has every number and a free checker.',
  },
  {
    q: 'How do I put my face on a thumbnail background?',
    a: 'Cut yourself out of a photo with a background remover, then place the cut-out on the empty side of the background. Make yourself large: head and shoulders, not a full body. Add a soft shadow or a thin outline so you stand apart from the background. Then add a short title on the same side and check the result at phone size.',
  },
  {
    q: 'What makes a good thumbnail background?',
    a: `One that stays out of the way. It has one clear mood, little detail, and a calm area where your face and text go. Its colours contrast with your text. And it still reads when it is small: in the up-next list on a computer, a thumbnail is only ${MEASURED.desktopSidebar.w} pixels wide.`,
  },
  {
    q: 'What file format are the backgrounds?',
    a: 'They are WebP files, which keep good quality at a small file size. Most current image editors open WebP. Build your thumbnail on top of the background, then export the finished image as JPG or PNG, the formats YouTube Help lists for thumbnails.',
  },
];
