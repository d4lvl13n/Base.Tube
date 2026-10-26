// Copy shared by the page (visible text) and the route (metadata and JSON-LD).
// FAQ answers stay plain strings so the structured data always matches what people read.

export const PAGE_URL = 'https://base.tube/tools/youtube-thumbnail-downloader';

export const PAGE_TITLE = 'YouTube Thumbnail Downloader (HD, Free)';

export const PAGE_DESCRIPTION =
  'Paste a YouTube link and download its thumbnail in every size, from 1280×720 HD to 120×90. Works for videos, Shorts and live streams. Free, no signup.';

export const STUDIO_GENERATE_URL = '/ai-thumbnails';
export const PREVIEW_URL = '/tools/youtube-thumbnail-preview';

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: 'How do I download a YouTube thumbnail?',
    a: 'Copy the video link, paste it in the box at the top of this page and press Get thumbnails. You see the thumbnail in every size YouTube keeps. Press Download under the size you want, usually the largest one, 1280×720. The image is saved as a JPG file.',
  },
  {
    q: 'How do I download a YouTube thumbnail on my phone?',
    a: 'In the YouTube app, tap Share under the video, then Copy link. Open this page in your phone browser, paste the link and press Get thumbnails, then Download. On iPhone the image opens with a Share button: tap it and choose Save Image to put it in Photos. On Android it goes to your Downloads folder. If nothing happens, press and hold the image and choose Save image.',
  },
  {
    q: 'Why is there no 1280×720 (maxresdefault) version?',
    a: 'YouTube only makes the 1280×720 version when the video was uploaded in HD or the creator added a custom thumbnail at that size. Many older videos and some low-resolution uploads do not have it. When it is missing, the tool tells you and the next best size is 640×480 or 480×360.',
  },
  {
    q: 'Why do some sizes have black bars?',
    a: 'Three of the five sizes (640×480, 480×360 and 120×90) use the old 4:3 shape. A normal widescreen video does not fill that shape, so YouTube adds black bars above and below the picture. The 1280×720 and 320×180 versions are 16:9 and have no bars.',
  },
  {
    q: 'Does it work for Shorts and live streams?',
    a: 'Yes. Paste a Shorts link (youtube.com/shorts/...) or a live link (youtube.com/live/...) like any other video. You get the same five sizes. YouTube stores them in wide shapes even for Shorts, so a vertical video usually shows up with bars on the sides.',
  },
  {
    q: 'Can I use a thumbnail I downloaded on my own channel?',
    a: 'Not as it is. The thumbnail belongs to the creator who made it. Downloading it to study, to compare with your own, or to show a team what you like is a normal part of the work. Reposting it as your thumbnail is copying. Use what you learn, such as the layout, the colours or how big the face is, to make your own.',
  },
];

export interface Step {
  n: string;
  title: string;
  desc: string;
}

export const STEPS: Step[] = [
  {
    n: '01',
    title: 'Copy the video link',
    desc: 'On a computer, copy the address from the browser bar. In the YouTube app, tap Share under the video, then Copy link. Shorts and live links work too.',
  },
  {
    n: '02',
    title: 'Paste it above',
    desc: 'Paste the link (or the 11-character video ID) in the box and press Get thumbnails. You see every size YouTube keeps for that video, largest first.',
  },
  {
    n: '03',
    title: 'Download the size you need',
    desc: 'Press Download under a size. The JPG is saved with the video ID and the size in its name, for example dQw4w9WgXcQ-1280x720.jpg, so files from different videos never mix up.',
  },
];

export const DEVICES: { label: string; text: string }[] = [
  {
    label: 'Computer',
    text: 'Press Download and the JPG goes to your Downloads folder. If your browser opens the image in a tab instead, right-click it and choose Save image as.',
  },
  {
    label: 'iPhone and iPad',
    text: 'Press Download, then tap the Share button on the image and choose Save Image. It goes to Photos. You can also press and hold the image and choose Save to Photos.',
  },
  {
    label: 'Android',
    text: 'Press Download and the file goes to your Downloads folder, where Photos and Gallery apps find it. Or press and hold the image and choose Download image.',
  },
];

export const RELATED_LINKS: { href: string; label: string; desc: string }[] = [
  {
    href: '/tools/youtube-thumbnail-preview',
    label: 'Thumbnail preview',
    desc: 'See a thumbnail in the home feed, search and on a phone.',
  },
  {
    href: '/tools/youtube-thumbnail-tester',
    label: 'Thumbnail tester',
    desc: 'Put two or three thumbnails next to each other.',
  },
  {
    href: '/tools/youtube-thumbnail-resizer',
    label: 'Thumbnail resizer',
    desc: 'Fit any image to 1280×720 and keep the file small.',
  },
  {
    href: '/tools/video-to-thumbnail',
    label: 'Video to thumbnail',
    desc: 'Pick the sharpest frame from your own video.',
  },
  {
    href: '/youtube-thumbnail-size',
    label: 'Thumbnail size guide',
    desc: 'Dimensions, file size and format rules in one place.',
  },
];
