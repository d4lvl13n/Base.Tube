import { CHECKED_ON_LABEL, safeZoneFor } from './specs';

export interface FaqItem {
  q: string;
  a: string;
}

/** Shown on the page AND emitted as FAQPage JSON-LD, so the two can never drift apart. */
export const FAQ: FaqItem[] = [
  {
    q: 'What is the YouTube thumbnail size?',
    a: `YouTube recommends 3840 × 2160 pixels for video thumbnails, and 2160 × 3840 for Shorts. The minimum is 640 pixels wide for videos. The older 1280 × 720 size still meets the rules. Source: YouTube Help, last checked ${CHECKED_ON_LABEL}.`,
  },
  {
    q: 'What is the YouTube thumbnail aspect ratio?',
    a: 'Use 16:9 for video thumbnails and 9:16 for Shorts. Podcast playlists use 1:1. Any other shape does not fill the frame, so it can be cropped or shown with bars.',
  },
  {
    q: 'Is 1280 × 720 still fine, or do I need 4K?',
    a: 'You do not need 4K. 1280 × 720 is still accepted, because the minimum width is only 640 pixels. YouTube Help now recommends 3840 × 2160 and says to make the image as large as possible, since it is also used as the preview image in the embedded player. If your 4K file goes over 2 MB and you upload from the phone app, use 1920 × 1080 or 1280 × 720 instead.',
  },
  {
    q: 'What is the maximum thumbnail file size?',
    a: 'It depends on the device you upload from. In the YouTube phone app the limit is 2 MB for video thumbnails. In YouTube Studio on a computer it is 50 MB. Before the March 2026 update the limit was 2 MB everywhere.',
  },
  {
    q: 'What size is a YouTube Shorts thumbnail?',
    a: 'YouTube recommends 2160 × 3840 pixels at 9:16, with a minimum height of 640 pixels. Custom Shorts thumbnails can currently only be added in YouTube Studio on a computer, and your account must be verified. On a vertical video, a 16:9 custom thumbnail is replaced by an auto-generated 4:5 image on the home, explore and subscription pages.',
  },
  {
    q: 'Which file formats does YouTube accept for thumbnails?',
    a: 'YouTube Help names JPG and PNG. Older versions of the page, and early coverage of the 2026 update, also listed GIF, but the current page does not, so stick to JPG or PNG. JPG usually gives the smallest file. PNG keeps the edges of text cleaner.',
  },
];

export interface Mistake {
  title: string;
  fix: string;
}

export const MISTAKES: Mistake[] = [
  {
    title: 'Uploading a square or 4:3 image',
    fix: 'YouTube shows thumbnails in a 16:9 frame. Any other shape is cropped or padded with bars. Design at 16:9 from the start, or crop it with the resizer.',
  },
  {
    title: 'Putting a face or text in the bottom-right corner',
    fix: 'The video length sits on top of that corner. Keep it clear. The safe zone above shows how much room to leave.',
  },
  {
    title: 'Text that only reads at full size',
    fix: 'In the desktop sidebar the thumbnail is 248 pixels wide. Small text turns into noise. Look at the smallest preview before you upload, and cut words until it reads.',
  },
  {
    title: 'Going over 2 MB in the phone app',
    fix: 'The phone app stops at 2 MB for video thumbnails. A computer allows 50 MB. Upload from YouTube Studio on a computer, or compress the file.',
  },
  {
    title: 'Stretching a small image up to 4K',
    fix: 'Enlarging adds pixels, not detail. The file gets heavier and stays soft. Start from the sharpest original you have.',
  },
  {
    title: 'Using a 16:9 thumbnail on a vertical video',
    fix: 'YouTube replaces it with an auto-generated 4:5 image on the home, explore and subscription pages. For Shorts, upload 9:16.',
  },
];

export interface ChangelogEntry {
  date: string;
  text: string;
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: CHECKED_ON_LABEL,
    text: 'First version. Every number checked against YouTube Help. They match the March 2026 update, except that the format line now names JPG and PNG only; GIF is no longer listed. The sizes viewers see were measured on youtube.com.',
  },
  {
    date: 'March 2026',
    text: 'YouTube raised the upload limit on computers from 2 MB to 50 MB and began recommending 3840 × 2160, up from 1280 × 720. The phone app stayed at 2 MB.',
  },
];

export const ZONE_EXAMPLES = [
  { label: '3840 × 2160', w: 3840, h: 2160 },
  { label: '1920 × 1080', w: 1920, h: 1080 },
  { label: '1280 × 720', w: 1280, h: 720 },
].map((e) => ({ ...e, zone: safeZoneFor(e.w, e.h) }));

export const RELATED_TOOLS = [
  { href: '/tools/youtube-thumbnail-resizer', label: 'Thumbnail resizer' },
  { href: '/tools/youtube-thumbnail-preview', label: 'Thumbnail preview' },
  { href: '/tools/youtube-thumbnail-tester', label: 'Thumbnail tester' },
  { href: '/tools/youtube-title-checker', label: 'Title checker' },
  { href: '/tools/video-to-thumbnail', label: 'Video to thumbnail' },
];

export const STUDIO_GENERATE_URL = '/ai-thumbnails';
export const STUDIO_AUDIT_URL = 'https://beta.base.tube/ai-thumbnails/audit';
export const RESIZER_URL = '/tools/youtube-thumbnail-resizer';
