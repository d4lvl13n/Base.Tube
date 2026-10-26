import { CHECKED_ON_LABEL, DESKTOP_STRIP, SAFE_AT_RECOMMENDED } from './specs';

export const PAGE_URL = 'https://base.tube/youtube-banner-size';
// The root layout appends " | Base.Tube", so the rendered <title> is 57 characters.
export const TITLE = 'YouTube Banner Size: 2560x1440 + Free Checker';
// 154 characters.
export const DESCRIPTION =
  'YouTube banner size: 2560x1440 recommended, 2048x1152 minimum, 16:9, 6 MB max. Safe area 1235x338. See what shows on TV, desktop and mobile. Free checker.';

export interface FaqItem {
  q: string;
  a: string;
}

/** Shown on the page AND emitted as FAQPage JSON-LD, so the two can never drift apart. */
export const FAQ: FaqItem[] = [
  {
    q: 'What is the YouTube banner size?',
    a: `YouTube recommends 2560 × 1440 pixels, especially for TV. The minimum is 2048 × 1152, in a 16:9 shape. Keep the file at 6 MB or smaller. Put text and logos in the centred safe area: 1235 × 338 pixels on a 2048 × 1152 banner. Source: YouTube Help, checked ${CHECKED_ON_LABEL}.`,
  },
  {
    q: 'What is the YouTube banner size for all devices?',
    a: `You upload one image and YouTube uses it on TV, computer, tablet and phone. Each screen shows a different part. A TV shows the whole 16:9 image. A computer shows a full-width strip through the middle, about ${DESKTOP_STRIP.heightPct.toFixed(0)}% of the height. Phones and tablets can cut the sides as well. Only the safe area in the centre is meant to show everywhere.`,
  },
  {
    q: 'Is 2048 × 1152 the right YouTube banner size?',
    a: '2048 × 1152 is the minimum YouTube accepts, not the recommended size. It works, and the 1235 × 338 safe area is measured at this size. For a sharper banner on large screens and TVs, YouTube recommends 2560 × 1440. Both are 16:9, so the same design scales from one to the other.',
  },
  {
    q: 'Can I use a 1024 × 576 YouTube banner?',
    a: 'No. 1024 × 576 is half of the minimum in each direction, so it has a quarter of the pixels. YouTube Help lists 2048 × 1152 as the minimum for upload and does not mention 1024 × 576. If your design is 1024 × 576, rebuild it at 2560 × 1440. Scaling a small image up adds pixels, not detail, so text turns soft.',
  },
  {
    q: 'What is the YouTube banner size on mobile?',
    a: `There is no separate mobile banner. Phones use the same image as everything else and show a thin strip through the middle, which can also be cut at the sides. YouTube does not publish exact phone sizes. Keep your channel name and any text inside the safe area: 1235 × 338 pixels on a 2048 × 1152 banner, about ${SAFE_AT_RECOMMENDED.w} × ${SAFE_AT_RECOMMENDED.h} on a 2560 × 1440 one.`,
  },
  {
    q: 'What is the maximum file size for a YouTube banner?',
    a: "6 MB. YouTube Help says the banner file should be 6 MB or smaller. A 2560 × 1440 JPG is usually well under that. If a PNG goes over, export it as JPG or lower the quality a little. YouTube Help also asks you not to add borders, frames or shadows to the image.",
  },
];

export const QUICK_ANSWERS: FaqItem[] = [
  { q: 'Recommended size', a: '2560 × 1440 pixels, "especially for TV".' },
  { q: 'Minimum size', a: '2048 × 1152 pixels. Smaller images are below the rule.' },
  { q: 'Aspect ratio', a: '16:9, the same shape as a widescreen video.' },
  { q: 'Safe area', a: `1235 × 338 px at minimum size. About ${SAFE_AT_RECOMMENDED.w} × ${SAFE_AT_RECOMMENDED.h} at 2560 × 1440.` },
  { q: 'Max file size', a: '6 MB or smaller.' },
  { q: 'On a computer', a: `A ${DESKTOP_STRIP.measuredW} × ${DESKTOP_STRIP.measuredH} strip through the middle of a 2560 × 1440 banner.` },
  { q: '1024 × 576?', a: 'Too small. It is half the 2048 × 1152 minimum in each direction.' },
  { q: 'Mobile size', a: 'Same image as desktop. The sides can be cut, so use the safe area.' },
];

export interface Mistake {
  title: string;
  fix: string;
}

export const MISTAKES: Mistake[] = [
  {
    title: 'Text near the top or bottom',
    fix: 'On a computer, everything above and below the middle strip is never shown. A channel name placed high up disappears for every desktop viewer. Keep all text inside the safe area.',
  },
  {
    title: 'Making a thin strip instead of a 16:9 image',
    fix: 'A banner made at 2560 × 423 looks right in a design app but is not the shape YouTube asks for. Upload the full 16:9 image and let YouTube crop it. The TV shows all of it.',
  },
  {
    title: 'Using 1024 × 576 or another small size',
    fix: 'Below 2048 × 1152 you are under the minimum. Start the design at 2560 × 1440 so it stays sharp on large screens.',
  },
  {
    title: 'Key text at the far left or right',
    fix: 'Phones and tablets can cut the sides of the strip. Text that reaches the edges of the computer strip may be cut on a phone. The safe area is about 60% of the width, centred.',
  },
  {
    title: 'Borders, frames and drop shadows',
    fix: 'YouTube Help asks you not to add file embellishments such as shadows, borders and frames. Each screen crops the banner differently, so a frame ends up cut on some sides and not others.',
  },
  {
    title: 'Small text that looks fine in the editor',
    fix: `On a computer the whole ${DESKTOP_STRIP.measuredW}-pixel-wide strip shrinks to the width of the page, and on a phone it is far smaller. Use a few large words, not a sentence.`,
  },
];

export interface Step {
  title: string;
  detail: string;
}

export const DESKTOP_STEPS: Step[] = [
  { title: 'Open YouTube Studio', detail: 'Sign in to YouTube Studio on a computer.' },
  { title: 'Go to Customization, then Profile', detail: 'Both are in the left menu.' },
  {
    title: 'Change the banner image',
    detail: 'Next to Banner image, click Change, pick your file, then adjust the crop in the preview and click Done.',
  },
  { title: 'Publish', detail: 'Click Publish. The same banner is then used on TV, computer, tablet and phone.' },
];

export const PHONE_STEPS: Step[] = [
  { title: 'Open your channel', detail: 'In the YouTube app on Android, iPhone or iPad, tap your profile picture, then go to your channel.' },
  { title: 'Tap Edit', detail: 'Then tap the banner image.' },
  { title: 'Pick or take a photo', detail: 'Choose an image from your phone or take a new one.' },
  { title: 'Save', detail: 'Tap Save. In the YouTube Studio app it works the same way from your profile: edit profile, tap the banner, choose a photo, save.' },
];

export interface NextStep {
  href: string;
  title: string;
  text: string;
}

export const RELATED: NextStep[] = [
  {
    href: '/youtube-thumbnail-size',
    title: 'Thumbnail size',
    text: '3840 × 2160, file limits and a free checker for your video thumbnails.',
  },
  {
    href: '/youtube-thumbnail-fonts',
    title: 'Thumbnail fonts',
    text: 'Bold fonts that stay readable at small sizes. They work for banner text too.',
  },
  {
    href: '/youtube-thumbnail-backgrounds',
    title: 'Thumbnail backgrounds',
    text: 'Free backgrounds you can use behind your text and face.',
  },
  {
    href: '/ai-thumbnails',
    title: 'AI thumbnails',
    text: 'Describe your video and get finished thumbnail options in the Base.Tube Studio.',
  },
  {
    href: '/tools',
    title: 'All free tools',
    text: 'Resizer, preview, tester, title checker and more. All run in your browser.',
  },
];

export const STUDIO_GENERATE_URL = '/ai-thumbnails';
