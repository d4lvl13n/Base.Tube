export const PAGE_URL = 'https://base.tube/tools/youtube-thumbnail-tester';
export const STUDIO_AUDIT_URL = '/youtube-channel-audit';
export const STUDIO_GENERATE_URL = '/ai-thumbnails';
/** YouTube Help: "A/B test titles & thumbnails" (first released as Test & Compare). */
export const YT_AB_HELP_URL = 'https://support.google.com/youtube/answer/16391400';
/** Date the YouTube Help page was last read for the facts on this page. */
export const YT_CHECKED = '29 September 2026';

// The site layout appends " | Base.Tube", so the full title stays at 58 characters.
export const PAGE_TITLE = 'YouTube Thumbnail Tester: Compare 2–3 Variants';
export const PAGE_DESCRIPTION =
  'Free YouTube thumbnail test: compare 2–3 variants side by side at feed size, blurred, in grayscale and under the duration badge. Runs in your browser.';

export interface FaqItem {
  q: string;
  a: string;
  link?: { href: string; label: string; external?: boolean };
}

export const FAQ: FaqItem[] = [
  {
    q: 'What is a YouTube thumbnail tester?',
    a: 'A thumbnail tester shows how a thumbnail looks and reads before you publish it. This one puts up to three versions side by side at feed size, blurred, in grayscale, at tiny sizes and under the duration badge, and it measures brightness, contrast and colour. It does not predict how many people will click.',
  },
  {
    q: 'Does this thumbnail test predict my click-through rate?',
    a: 'No. Nothing on this page predicts or scores clicks. Click-through rate (CTR) is the share of people who saw your thumbnail and clicked it. It depends on your audience, your title and what else is in their feed, so only real impressions on YouTube can show it. The measurements here describe the image: how bright, contrasty and colourful it is, and what survives when it is blurred or small.',
    link: { href: STUDIO_AUDIT_URL, label: 'See your real CTR with the free audit', external: false },
  },
  {
    q: 'How do I test a thumbnail on YouTube itself?',
    a: 'In YouTube Studio on a computer, use "A/B test titles & thumbnails" (first released as Test & Compare). You can compare up to three options on a video. YouTube picks the result by watch time share, not click-through rate, and reports Winner, Performed same or Inconclusive. A test can take a few days and should finish within two weeks. Advanced features must be on, and Shorts, scheduled live streams and Premieres are not supported. Check YouTube Help for the current rules.',
    link: { href: YT_AB_HELP_URL, label: 'YouTube Help: A/B test titles & thumbnails', external: true },
  },
  {
    q: 'Is my thumbnail uploaded anywhere?',
    a: 'No. The tester runs in your browser. Your images are read and measured on your own device and are never sent to Base.Tube or anyone else. Close the tab and they are gone.',
  },
  {
    q: 'How is this different from a thumbnail preview tool?',
    a: 'A preview tool shows a thumbnail on mock-ups of YouTube pages. This tester compares two or three versions against each other with the same checks, so you can see which one reads better at a glance, in grayscale, when small and under the duration badge.',
    link: { href: '/tools/youtube-thumbnail-preview', label: 'Open the thumbnail preview tool' },
  },
  {
    q: 'What size should my YouTube thumbnail be?',
    a: 'The standard is 1280 x 720 pixels in a 16:9 shape. YouTube also notes that in its A/B test, if any thumbnail is below 720p, all the options are downscaled to 480p, so export at 1280 x 720 or larger.',
    link: { href: '/youtube-thumbnail-size', label: 'Read the thumbnail size guide' },
  },
];

export const TESTS = [
  {
    name: 'Feed test',
    body: 'Your variants sit among neutral placeholder tiles at desktop and phone width. Look away, look back, and notice which one your eye reaches first. Shuffle the order, because position changes what gets noticed.',
  },
  {
    name: 'Squint test',
    body: 'Raise the blur until the picture is a smear. What still stands out, whether a shape, a face or a block of colour, is what a fast scroller sees. If nothing stands out, the composition is not doing much work.',
  },
  {
    name: 'Grayscale test',
    body: 'Colour can hide weak contrast. In grayscale, check that the subject separates from the background and that any words are still easy to read.',
  },
  {
    name: 'Tiny test',
    body: 'Sidebar and small-screen thumbnails are far smaller than in the feed. Check that the subject and the words are still recognisable at about 168, 120 and 84 pixels wide.',
  },
  {
    name: 'Badge test',
    body: 'The duration badge sits over the bottom-right corner of every thumbnail. Anything important there is hidden, and a longer time such as 1:02:45 covers more than 3:15.',
  },
];

export const METHOD = [
  {
    name: 'Average brightness',
    body: 'Every pixel gets a brightness from 0% (black) to 100% (white), weighted the way the eye sees it, with green counting most. We average them.',
  },
  {
    name: 'Tonal contrast',
    body: 'The gap between the lightest and darkest parts of the image, ignoring the extreme 5% at each end so a stray pixel does not count. 100% means near-black sits next to near-white.',
  },
  {
    name: 'Contrast after blur',
    body: 'The same measure after a blur of about 2% of the image width, which is where the Squint slider starts. It shows how much light-to-dark difference survives when the detail is lost.',
  },
  {
    name: 'Average saturation',
    body: 'How far each colour is from grey, from 0% (grey) to 100% (pure colour), averaged over every pixel that is not near-black.',
  },
  {
    name: 'Outline against the feed',
    body: 'The outer band of the picture is compared with the feed background (#0f0f0f in dark mode, #ffffff in light mode) using the WCAG contrast ratio, the same maths used for text and buttons. A pixel counts as barely distinguishable below 1.5 to 1. We report the share of the outline that does.',
  },
  {
    name: 'Detail under the badge',
    body: 'We measure how sharply neighbouring pixels change, across the whole image and in the bottom-right patch a typical duration badge covers (about 13% wide and 11% tall). The number is the patch average divided by the image average. Above 1x means the corner is busier than the rest of the picture.',
  },
];

export const RELATED = [
  { href: '/tools/youtube-thumbnail-preview', name: 'Thumbnail preview', desc: 'See one thumbnail on mock-ups of YouTube pages.' },
  { href: '/youtube-thumbnail-size', name: 'Thumbnail size guide', desc: 'The right size, shape and file limits for YouTube.' },
  { href: '/tools/youtube-thumbnail-resizer', name: 'Thumbnail resizer', desc: 'Resize or compress an image to fit.' },
  { href: '/tools/youtube-title-checker', name: 'Title checker', desc: 'Check the title you pair with your thumbnail.' },
  { href: '/tools/video-to-thumbnail', name: 'Video to thumbnail', desc: 'Pull a still frame out of your video.' },
  { href: '/tools', name: 'All tools', desc: 'Every free Base.Tube tool in one place.' },
];
