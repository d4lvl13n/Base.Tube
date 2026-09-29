/**
 * Copy for the resizer page. Kept in one plain module so the visible FAQ and
 * the FAQPage JSON-LD can never drift apart.
 *
 * Spec facts below were checked on 29 September 2026 against the YouTube Help
 * page "Add custom thumbnails on YouTube" (support.google.com/youtube/answer/72431):
 *  - recommended resolution 3840 x 2160 for videos (2160 x 3840 for Shorts)
 *  - minimum width 640 px for videos
 *  - JPG or PNG
 *  - size limits by upload device: mobile 2 MB for video thumbnails, desktop 50 MB
 *  - 16:9 for videos, 9:16 for Shorts
 * Re-check them before changing any number on this page.
 */

export const SPEC_CHECKED = 'September 2026';

export interface FaqItem {
  q: string;
  a: string;
  /** Optional link shown after the answer on the page (not part of the JSON-LD text). */
  link?: { href: string; label: string };
}

export const faqs: FaqItem[] = [
  {
    q: 'What size should a YouTube thumbnail be?',
    a: 'A YouTube thumbnail should be 16:9. YouTube Help currently recommends 3840 × 2160 pixels for videos, with a minimum width of 640 pixels. 1280 × 720 pixels is the long-standing standard: it is 16:9, sharp on every screen, and produces a small file. This tool exports 1280 × 720, 1920 × 1080 or 3840 × 2160.',
    link: { href: '/youtube-thumbnail-size', label: 'See the full size guide' },
  },
  {
    q: 'How do I resize an image to 1280×720 without stretching it?',
    a: 'Stretching happens when the image is not 16:9 and gets forced into a 16:9 frame. Avoid it in one of two ways. Crop: drag and zoom the frame to choose which 16:9 part of the image to keep. Fit: keep the whole image, and fill the empty space beside or above it with a blurred copy of the image or a solid colour. Both keep your image at its true proportions.',
  },
  {
    q: 'How do I keep my thumbnail under 2 MB?',
    a: 'YouTube Help lists 2 MB as the limit for video thumbnails uploaded from the mobile app, and 50 MB from a computer. Choose the limit you need under Size limit, and export as JPG. If the file is too large, the tool lowers the JPG quality step by step until it fits, and shows you the final size in KB. If a PNG is too large, switch to JPG or pick a smaller size.',
  },
  {
    q: 'Is this tool free, and does it upload my image?',
    a: 'It is free, needs no account and adds no watermark. Your image is never uploaded. The cropping, resizing and compression all run inside your browser on your own device, so the file stays with you.',
  },
  {
    q: 'Should I export a JPG or a PNG?',
    a: 'YouTube Help lists JPG and PNG as accepted formats. JPG makes smaller files and suits photos. PNG is lossless, so it keeps the edges of text and flat graphics perfectly crisp, but the file is larger and is more likely to go over the size limit. If you are unsure, start with JPG at the default quality.',
  },
  {
    q: 'Can I use it for YouTube Shorts thumbnails?',
    a: 'This tool makes 16:9 thumbnails, which is the shape YouTube recommends for regular videos. For Shorts, YouTube Help recommends a 9:16 thumbnail at 2160 × 3840 pixels, so a 16:9 export is not the right shape for a Short. The size guide explains both.',
    link: { href: '/youtube-thumbnail-size', label: 'See the full size guide' },
  },
];

export const steps = [
  {
    n: '01',
    title: 'Add your image',
    desc: 'Drop in a JPG, PNG or WebP, choose a file, or paste one from your clipboard. Any size works. It opens in your browser and is not uploaded anywhere.',
  },
  {
    n: '02',
    title: 'Crop it, or fit it on a background',
    desc: 'Crop lets you drag and zoom to pick the 16:9 part you want. Fit keeps the whole image and fills the rest with a blurred copy or a solid colour.',
  },
  {
    n: '03',
    title: 'Choose size and format, then download',
    desc: 'Pick 1280 × 720 or larger, JPG or PNG. The tool shows the final file size and keeps it under the limit you set. Check the previews, then download.',
  },
];
