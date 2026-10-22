import { CHECKED_ON_LABEL, MEASURED, MEASURED_ON_LABEL, safeZoneFor } from './specs';

export interface FaqItem {
  q: string;
  a: string;
}

/** Roblox Creator Hub, "Thumbnails". Read on 22 October 2026. */
export const ROBLOX_SOURCE_URL = 'https://create.roblox.com/docs/production/publishing/thumbnails';

/** YouTube Official Blog, 29 October 2025: the 2 MB to 50 MB announcement, made for TV screens. */
export const YT_BLOG_TV_URL = 'https://blog.youtube/news-and-events/new-features-to-help-creators/';

/**
 * Shown on the page AND emitted as FAQPage JSON-LD, so the two can never drift apart.
 * Questions follow real searches (DataForSEO, US, 22 October 2026). Answers stay 30–80 words.
 */
export const FAQ: FaqItem[] = [
  {
    q: 'What is the YouTube thumbnail size?',
    a: `YouTube recommends 3840 × 2160 pixels for video thumbnails, in a 16:9 frame. For Shorts it recommends 2160 × 3840, in 9:16. The minimum is 640 pixels wide for videos and 640 pixels tall for Shorts. The older 1280 × 720 size still meets the rules. Source: YouTube Help, checked ${CHECKED_ON_LABEL}.`,
  },
  {
    q: 'What is the YouTube thumbnail aspect ratio?',
    a: 'Use 16:9 for video thumbnails. That means 16 units wide for every 9 units tall, as in 3840 × 2160, 1920 × 1080 or 1280 × 720. Use 9:16 for Shorts and 1:1 for podcast playlists. Any other shape does not fill the frame, so it can be cropped or shown with bars.',
  },
  {
    q: 'What resolution should a YouTube thumbnail be? Is 1280 × 720 still fine?',
    a: 'YouTube Help recommends 3840 × 2160 and says to make the image as large as possible, because it is also the preview image in the embedded player. You do not need 4K. 1280 × 720 is still accepted, since the minimum width is only 640 pixels. If a 4K file goes over 2 MB and you upload from the phone app, use 1920 × 1080 instead.',
  },
  {
    q: 'How big is a YouTube thumbnail on screen?',
    a: `Much smaller than the file. On ${MEASURED_ON_LABEL} we measured ${MEASURED.desktopSearch.w} × ${MEASURED.desktopSearch.h} pixels in desktop search, ${MEASURED.desktopSidebar.w} × ${MEASURED.desktopSidebar.h} in the desktop up-next list, and ${MEASURED.mobileFeed.w} × ${MEASURED.mobileFeed.h} on a phone. These are CSS pixels; sharp screens draw more real pixels. On a TV the thumbnail fills far more of the screen, which is why YouTube moved to 4K files.`,
  },
  {
    q: 'What is the maximum file size for a YouTube thumbnail?',
    a: 'It depends on where you upload from. In the YouTube phone app the limit is 2 MB for video thumbnails and 10 MB for podcast thumbnails. In YouTube Studio on a computer it is 50 MB for video, Shorts and podcast thumbnails. YouTube announced the move from 2 MB to 50 MB in October 2025, to serve 4K thumbnails on TV screens.',
  },
  {
    q: 'What is the minimum size for a YouTube thumbnail?',
    a: 'A video thumbnail must be at least 640 pixels wide. A Shorts thumbnail must be at least 640 pixels tall. YouTube Help gives no other minimum. An image that small looks soft on large screens, so treat 640 pixels as the floor and 1280 × 720 or more as the target.',
  },
  {
    q: 'Which file formats does YouTube accept for thumbnails?',
    a: 'YouTube Help asks for image formats "such as JPG or PNG", and those are the only two it names. Older versions of the page also listed GIF, but the current one does not, so stick to JPG or PNG. JPG usually gives the smaller file. PNG keeps the edges of text cleaner.',
  },
  {
    q: 'What size is a YouTube Shorts thumbnail?',
    a: 'YouTube recommends 2160 × 3840 pixels at 9:16, with a minimum height of 640 pixels. You can add a custom Shorts thumbnail only in YouTube Studio on a computer, and your account must be verified. If a vertical video has a 16:9 custom thumbnail, YouTube replaces it with an auto-generated 4:5 image on the home, explore and subscription pages.',
  },
  {
    q: 'How do I resize an image to the YouTube thumbnail size?',
    a: 'Crop it to 16:9 first, then scale it. Cropping fixes the shape; scaling fixes the pixel count. Our free thumbnail resizer does both in your browser and exports 1280 × 720, 1920 × 1080 or 3840 × 2160. Start from the largest original you have. Enlarging a small image adds pixels, not detail.',
  },
  {
    q: 'What is the Roblox thumbnail size?',
    a: 'Roblox has its own rules. Its Creator Hub says an experience thumbnail should be 16:9 and ideally 1920 × 1080 pixels, in JPG, GIF, PNG, TGA or BMP. Roblox stretches other shapes to 16:9. You can show up to 10 images or videos per experience. A YouTube video about Roblox still follows the YouTube sizes on this page.',
  },
];

/** Short direct answers right under the hero, one per common search. */
export interface QuickAnswer {
  q: string;
  a: string;
}

export const QUICK_ANSWERS: QuickAnswer[] = [
  {
    q: 'Dimensions in pixels',
    a: '3840 × 2160 recommended. 1920 × 1080 and 1280 × 720 are also 16:9 and still accepted.',
  },
  {
    q: 'Aspect ratio',
    a: '16:9 for videos. 9:16 for Shorts. 1:1 for podcast playlists.',
  },
  {
    q: 'Minimum size',
    a: '640 px wide for videos, 640 px tall for Shorts. Smaller images are rejected.',
  },
  {
    q: 'File size limit',
    a: '2 MB in the phone app (10 MB for podcasts). 50 MB in YouTube Studio on a computer.',
  },
  {
    q: 'Formats',
    a: 'JPG or PNG. These are the two formats YouTube Help names.',
  },
  {
    q: 'How big it shows',
    a: `About ${MEASURED.desktopSearch.w} px wide in desktop search, ${MEASURED.desktopSidebar.w} px in the up-next list, full width on a phone. Much larger on a TV.`,
  },
  {
    q: 'Safe area',
    a: 'Keep the bottom-right corner clear. The video length label covers it.',
  },
  {
    q: 'Shorts',
    a: '2160 × 3840 at 9:16. Added only in YouTube Studio on a computer, from a verified account.',
  },
];

export interface Step {
  title: string;
  detail: string;
}

/** From YouTube Help, "Add custom thumbnails on YouTube" (computer version). */
export const UPLOAD_STEPS: Step[] = [
  {
    title: 'Open YouTube Studio',
    detail: 'Sign in on a computer and choose Content in the left menu. For a Short, pick the Shorts tab at the top.',
  },
  {
    title: 'Open the video',
    detail: 'Click the pencil icon next to the video or Short you want to change.',
  },
  {
    title: 'Upload your image',
    detail: 'Under Thumbnail, click Upload file and pick your JPG or PNG. Get suggestions makes options for you instead.',
  },
  {
    title: 'Save',
    detail: 'Click Save. YouTube says the new thumbnail can take a while to show everywhere.',
  },
];

/** Reasons YouTube Help gives for a blocked or rejected custom thumbnail. */
export const UPLOAD_BLOCKERS: string[] = [
  'Your account is not verified. Custom thumbnails need a verified account.',
  'You hit the daily limit. YouTube shows "Daily custom thumbnail limit reached". Wait 24 hours.',
  'Your channel has Community Guidelines strikes. They reduce how many custom thumbnails you can upload.',
  'The image breaks YouTube policy, for example nudity, violence or hate speech. It can be removed and earn a strike.',
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
    text: 'Re-read YouTube Help. Every upload rule on this page still matches it: no number changed. Added quick answers, how to upload, Shorts, Roblox and more FAQ. The sizes viewers see were not re-measured.',
  },
  {
    date: MEASURED_ON_LABEL,
    text: 'First version. Every number checked against YouTube Help. The format line names JPG and PNG only; GIF is no longer listed. The sizes viewers see were measured on youtube.com.',
  },
  {
    date: '29 October 2025',
    text: 'YouTube announced on its official blog that the thumbnail file limit would go from 2 MB to 50 MB, to serve 4K thumbnails on TV screens. YouTube Help now lists 50 MB on a computer and 2 MB in the phone app.',
  },
];

export const ZONE_EXAMPLES = [
  { label: '3840 × 2160', w: 3840, h: 2160 },
  { label: '1920 × 1080', w: 1920, h: 1080 },
  { label: '1280 × 720', w: 1280, h: 720 },
].map((e) => ({ ...e, zone: safeZoneFor(e.w, e.h) }));

/** Other free tools, shown in the bridge block. The main next steps are in NEXT_STEPS. */
export const RELATED_TOOLS = [
  { href: '/tools/youtube-title-checker', label: 'Title checker' },
  { href: '/tools/video-to-thumbnail', label: 'Video to thumbnail' },
];

export interface NextStep {
  href: string;
  title: string;
  text: string;
}

export const NEXT_STEPS: NextStep[] = [
  {
    href: '/tools/youtube-thumbnail-resizer',
    title: 'Resize to 16:9',
    text: 'Crop and export at 1280 × 720, 1920 × 1080 or 3840 × 2160. Runs in your browser.',
  },
  {
    href: '/tools/youtube-thumbnail-preview',
    title: 'Preview it on YouTube',
    text: 'See your thumbnail and title in the home feed, search, up-next list and on a phone.',
  },
  {
    href: '/tools/youtube-thumbnail-tester',
    title: 'Compare versions',
    text: 'Put 2 or 3 thumbnails side by side at feed size, blurred, in grayscale and under the length label.',
  },
  {
    href: '/youtube-thumbnail-fonts',
    title: 'Pick a font',
    text: 'Fonts for thumbnail text that has to read at small sizes.',
  },
  {
    href: '/youtube-thumbnail-backgrounds',
    title: 'Find a background',
    text: 'Backgrounds for 16:9 thumbnails.',
  },
  {
    href: '/thumbnails',
    title: 'Get ideas',
    text: 'Thumbnail ideas by game and by style.',
  },
];

export const STUDIO_GENERATE_URL = '/ai-thumbnails';
export const STUDIO_AUDIT_URL = '/youtube-channel-audit';
export const RESIZER_URL = '/tools/youtube-thumbnail-resizer';
