/**
 * Copy and data for /youtube-thumbnail-fonts.
 *
 * Every font below was checked on 22 October 2026:
 * - it exists on fonts.google.com (the specimen URL answers 200; a made-up name answers 404),
 * - its licence, read from the METADATA.pb file of the google/fonts repository
 *   (github.com/google/fonts, folder ofl/ or apache/),
 * - its designer, from the fonts.google.com family metadata.
 */

export const PAGE_URL = 'https://base.tube/youtube-thumbnail-fonts';
export const CHECKED_ON_ISO = '2026-10-22';
export const CHECKED_ON_LABEL = '22 October 2026';

export const STUDIO_GENERATE_URL = '/ai-thumbnails';
export const STUDIO_AUDIT_URL = '/youtube-channel-audit';

export type FontId =
  | 'anton'
  | 'bebas'
  | 'oswald'
  | 'lilita'
  | 'fredoka'
  | 'luckiest'
  | 'bangers'
  | 'montserrat'
  | 'poppins'
  | 'archivo'
  | 'abril'
  | 'marker'
  | 'pressStart'
  | 'blackOps';

export type GroupId = 'condensed' | 'rounded' | 'comic' | 'sans' | 'serif' | 'brush' | 'gaming';

export type Licence = 'OFL' | 'Apache 2.0';

export const LICENCE_NAME: Record<Licence, string> = {
  OFL: 'SIL Open Font License 1.1',
  'Apache 2.0': 'Apache License 2.0',
};

export interface Colorway {
  fill: string;
  outline: string;
  /** Any CSS background value. */
  bg: string;
}

export interface FontEntry {
  id: FontId;
  name: string;
  group: GroupId;
  /** The weight loaded on this page (some families have several; we load only the heaviest one we show). */
  weight: number;
  weightLabel?: string;
  designer: string;
  licence: Licence;
  url: string;
  why: string;
  bestFor: string;
  sample: string;
  colorway: Colorway;
  /**
   * Rough average width of a capital letter, in em. Only used to size the sample text before the
   * real font has loaded in the browser; after that the text is measured with the font itself.
   */
  capWidth: number;
}

export interface FontGroup {
  id: GroupId;
  title: string;
  intro: string;
}

export const GROUPS: FontGroup[] = [
  {
    id: 'condensed',
    title: 'Heavy and condensed',
    intro: 'Tall, narrow, very bold letters. They fit more words across the frame without getting small. This is the look most people mean when they say "Impact style".',
  },
  {
    id: 'rounded',
    title: 'Rounded and friendly',
    intro: 'Soft corners and thick strokes. They feel warm and casual and stay clear at small sizes.',
  },
  {
    id: 'comic',
    title: 'Comic and loud',
    intro: 'Letters that look hand-inked and full of energy. Good when the video is meant to feel fun or chaotic.',
  },
  {
    id: 'sans',
    title: 'Bold modern sans',
    intro: 'Wide, geometric letters at their heaviest weight. Clean and confident, and easy to read in any niche.',
  },
  {
    id: 'serif',
    title: 'Dramatic serif',
    intro: 'High contrast between thick and thin strokes. Use it big and short, for stories, true crime or anything that should feel serious.',
  },
  {
    id: 'brush',
    title: 'Handwritten and marker',
    intro: 'Looks written by a person. Good for one or two words that should feel personal or raw.',
  },
  {
    id: 'gaming',
    title: 'Pixel and gaming',
    intro: 'Blocky or military shapes that say "game" at a glance. Keep the text very short; these fonts are wide.',
  },
];

export const FONTS: FontEntry[] = [
  {
    id: 'anton',
    name: 'Anton',
    group: 'condensed',
    weight: 400,
    designer: 'Vernon Adams',
    licence: 'OFL',
    url: 'https://fonts.google.com/specimen/Anton',
    why: 'The closest free match to Impact. The letters are tall and packed tight, so a short phrase can fill the width of the frame and still be huge.',
    bestFor: 'Reaction, commentary, challenge and news videos. Any thumbnail with three or four words.',
    sample: 'I QUIT MY JOB',
    colorway: { fill: '#ffffff', outline: '#000000', bg: 'linear-gradient(135deg, #e5262b 0%, #7a0a0e 100%)' },
    capWidth: 0.5,
  },
  {
    id: 'bebas',
    name: 'Bebas Neue',
    group: 'condensed',
    weight: 400,
    designer: 'Ryoichi Tsunekawa',
    licence: 'OFL',
    url: 'https://fonts.google.com/specimen/Bebas+Neue',
    why: 'Capitals only, clean and narrow. A little lighter than Anton, so it looks calmer and more polished.',
    bestFor: 'Tech, finance, fitness and documentary-style videos.',
    sample: 'NEW IPHONE TESTED',
    colorway: { fill: '#ffe600', outline: '#000000', bg: 'linear-gradient(135deg, #1f2937 0%, #000000 100%)' },
    capWidth: 0.42,
  },
  {
    id: 'oswald',
    name: 'Oswald',
    group: 'condensed',
    weight: 700,
    weightLabel: 'Bold',
    designer: 'Vernon Adams, Kalapi Gajjar, Cyreal',
    licence: 'OFL',
    url: 'https://fonts.google.com/specimen/Oswald',
    why: 'A condensed family with several weights. At Bold it reads like a newspaper headline, so it suits text that should look factual.',
    bestFor: 'News, history, explainers and sports.',
    sample: 'WHAT REALLY HAPPENED',
    colorway: { fill: '#ffffff', outline: '#0b1a4a', bg: 'linear-gradient(135deg, #1f6fff 0%, #0a1f66 100%)' },
    capWidth: 0.5,
  },
  {
    id: 'lilita',
    name: 'Lilita One',
    group: 'rounded',
    weight: 400,
    designer: 'Juan Montoreano',
    licence: 'OFL',
    url: 'https://fonts.google.com/specimen/Lilita+One',
    why: 'Heavy, slightly rounded and a bit condensed. It has the punch of a condensed font with a friendlier face.',
    bestFor: 'Family, kids, food and challenge videos.',
    sample: 'BIGGEST PIZZA EVER',
    colorway: { fill: '#ffe600', outline: '#000000', bg: 'linear-gradient(135deg, #ff8a00 0%, #d9480f 100%)' },
    capWidth: 0.55,
  },
  {
    id: 'fredoka',
    name: 'Fredoka',
    group: 'rounded',
    weight: 700,
    weightLabel: 'Bold',
    designer: 'Milena Brandão, Hafontia',
    licence: 'OFL',
    url: 'https://fonts.google.com/specimen/Fredoka',
    why: 'Round letters with soft ends. It looks gentle and approachable without losing weight.',
    bestFor: 'Crafts, cooking, lifestyle and channels for younger viewers.',
    sample: 'EASY SLIME',
    colorway: { fill: '#ffffff', outline: '#6d28d9', bg: 'linear-gradient(135deg, #f472b6 0%, #a21caf 100%)' },
    capWidth: 0.64,
  },
  {
    id: 'luckiest',
    name: 'Luckiest Guy',
    group: 'comic',
    weight: 400,
    designer: 'Astigmatic',
    licence: 'Apache 2.0',
    url: 'https://fonts.google.com/specimen/Luckiest+Guy',
    why: 'Fat, bouncy cartoon letters. Even a single word looks loud, and numbers stay very clear.',
    bestFor: 'Challenges, money and prize videos, and big-number thumbnails like "$10,000".',
    sample: '$10,000 PRIZE',
    colorway: { fill: '#ffe600', outline: '#000000', bg: 'linear-gradient(135deg, #16a34a 0%, #064e3b 100%)' },
    capWidth: 0.7,
  },
  {
    id: 'bangers',
    name: 'Bangers',
    group: 'comic',
    weight: 400,
    designer: 'Vernon Adams',
    licence: 'OFL',
    url: 'https://fonts.google.com/specimen/Bangers',
    why: 'Slanted comic-book capitals. They look like action, and they stay narrow enough for three or four words.',
    bestFor: 'Gaming highlights, pranks, reactions and anime.',
    sample: 'EPIC FAIL',
    colorway: { fill: '#ffffff', outline: '#000000', bg: 'linear-gradient(135deg, #7c3aed 0%, #2e1065 100%)' },
    capWidth: 0.5,
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    group: 'sans',
    weight: 900,
    weightLabel: 'Black',
    designer: 'Julieta Ulanovsky, Sol Matas, Juan Pablo del Peral, Jacques Le Bailly',
    licence: 'OFL',
    url: 'https://fonts.google.com/specimen/Montserrat',
    why: 'Wide, geometric and very even. At its Black weight it is one of the clearest fonts you can use, and it has nine weights for a second line.',
    bestFor: 'Education, business, how-to and tutorials.',
    sample: 'LEARN EXCEL',
    colorway: { fill: '#ffffff', outline: '#000000', bg: 'linear-gradient(135deg, #0ea5e9 0%, #075985 100%)' },
    capWidth: 0.8,
  },
  {
    id: 'poppins',
    name: 'Poppins',
    group: 'sans',
    weight: 900,
    weightLabel: 'Black',
    designer: 'Indian Type Foundry, Jonny Pinhorn, Ninad Kale',
    licence: 'OFL',
    url: 'https://fonts.google.com/specimen/Poppins',
    why: 'Built from near-perfect circles and straight lines. It looks modern and tidy, and the heavy weights hold up well with an outline.',
    bestFor: 'Vlogs, productivity, apps and personal brand channels.',
    sample: 'MY MORNING',
    colorway: { fill: '#111111', outline: '#ffffff', bg: 'linear-gradient(135deg, #ffd400 0%, #ff8a00 100%)' },
    capWidth: 0.74,
  },
  {
    id: 'archivo',
    name: 'Archivo Black',
    group: 'sans',
    weight: 400,
    designer: 'Omnibus-Type',
    licence: 'OFL',
    url: 'https://fonts.google.com/specimen/Archivo+Black',
    why: 'A single, very heavy grotesque weight. It feels solid and direct, a little like a sports headline.',
    bestFor: 'Sports, cars, reviews and "vs" comparisons.',
    sample: 'TESLA VS BMW',
    colorway: { fill: '#ffffff', outline: '#000000', bg: 'linear-gradient(135deg, #374151 0%, #030712 100%)' },
    capWidth: 0.76,
  },
  {
    id: 'abril',
    name: 'Abril Fatface',
    group: 'serif',
    weight: 400,
    designer: 'TypeTogether',
    licence: 'OFL',
    url: 'https://fonts.google.com/specimen/Abril+Fatface',
    why: 'Very thick main strokes and hairline thin ones. Big and short, it looks like a magazine cover. The thin parts disappear when it is small, so use few letters.',
    bestFor: 'True crime, storytelling, fashion and beauty.',
    sample: 'THE CASE',
    colorway: { fill: '#ffffff', outline: '#000000', bg: 'linear-gradient(135deg, #7f1d1d 0%, #0c0a09 100%)' },
    capWidth: 0.7,
  },
  {
    id: 'marker',
    name: 'Permanent Marker',
    group: 'brush',
    weight: 400,
    designer: 'Font Diner',
    licence: 'Apache 2.0',
    url: 'https://fonts.google.com/specimen/Permanent+Marker',
    why: 'Looks written with a thick marker. It feels personal and unpolished, which suits honest or emotional videos.',
    bestFor: 'Vlogs, travel, "I tried" videos and labels drawn onto a photo.',
    sample: 'I TRIED IT',
    colorway: { fill: '#ffffff', outline: '#000000', bg: 'linear-gradient(135deg, #0d9488 0%, #134e4a 100%)' },
    capWidth: 0.66,
  },
  {
    id: 'pressStart',
    name: 'Press Start 2P',
    group: 'gaming',
    weight: 400,
    designer: 'CodeMan38',
    licence: 'OFL',
    url: 'https://fonts.google.com/specimen/Press+Start+2P',
    why: 'A pixel font inspired by the lettering of 1980s arcade games. Instantly reads as "retro game". Every letter is very wide, so keep it to one or two short words.',
    bestFor: 'Retro gaming, speedruns, Minecraft and pixel-art games.',
    sample: 'GAME OVER',
    colorway: { fill: '#39ff6a', outline: '#000000', bg: 'linear-gradient(135deg, #1e1b4b 0%, #000000 100%)' },
    capWidth: 1.0,
  },
  {
    id: 'blackOps',
    name: 'Black Ops One',
    group: 'gaming',
    weight: 400,
    designer: 'James Grieshaber, Eben Sorkin',
    licence: 'OFL',
    url: 'https://fonts.google.com/specimen/Black+Ops+One',
    why: 'Heavy stencil letters with a military feel. It says "shooter" or "action" before anyone reads the words.',
    bestFor: 'Shooters, battle royale, survival and military history.',
    sample: 'LAST ONE ALIVE',
    colorway: { fill: '#ffffff', outline: '#000000', bg: 'linear-gradient(135deg, #4d7c0f 0%, #1a2e05 100%)' },
    capWidth: 0.74,
  },
];

/** Shown on the page AND emitted as FAQPage JSON-LD, so the two can never drift apart. */
export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: FaqItem[] = [
  {
    q: 'What is the best font for YouTube thumbnails?',
    a: 'There is no single best font. The ones that work share three things: very heavy strokes, simple letter shapes and capitals that stay clear when the thumbnail is small. Anton and Bebas Neue are safe defaults. Luckiest Guy and Lilita One suit fun videos. Type your own words in the preview above and pick the one that still reads at phone size.',
  },
  {
    q: 'What font does MrBeast use in his thumbnails?',
    a: 'It is not publicly confirmed. We found no statement from MrBeast or his team naming the font, and online guides disagree with each other. If you want a similar heavy, cartoon-like look for free, try Luckiest Guy, Lilita One or Bangers with a thick black outline.',
  },
  {
    q: 'Are Google Fonts free to use on a monetized YouTube channel?',
    a: 'Yes. Every font on this page is published under the SIL Open Font License or the Apache License 2.0. Both allow commercial use, so you can use them on thumbnails for a monetized channel or for clients. What you cannot do is sell the font file itself.',
  },
  {
    q: 'Can I use Impact in my YouTube thumbnails?',
    a: "Yes, if it is already on your computer. Impact ships with Windows and macOS. Microsoft's font FAQ treats images made with Windows fonts like printed output and does not restrict how you use them, unless your editing app is licensed for non-commercial use only. Do not download Impact from free-font sites: Microsoft does not allow the font file to be shared.",
  },
  {
    q: 'How big should text be on a YouTube thumbnail?',
    a: 'YouTube sets no text size. Check it at the smallest size people see. In our measurements the up-next list on a computer shows thumbnails 248 pixels wide. If your words are hard to read at that size, make them bigger or use fewer of them. The 248 px setting in the preview shows that size.',
  },
  {
    q: 'How do I add an outline to thumbnail text?',
    a: 'Most editors call it "stroke" or "outline". In Photoshop it is the Stroke layer style. Pick a colour that contrasts with the text, often black around white or yellow, and make it thick enough to see at phone size. Add a soft drop shadow under it to lift the text off busy backgrounds.',
  },
  {
    q: 'How many fonts should a thumbnail use?',
    a: 'One, sometimes two. A second font can set off one word, such as a number or a name. More than two makes the thumbnail look messy and slows down reading. If you pair two, make them clearly different: a condensed font with a rounded one, or a heavy sans with a marker font.',
  },
  {
    q: 'What is a good font for gaming thumbnails?',
    a: 'Black Ops One for shooters and action games, Press Start 2P for retro and pixel games, and Bangers for highlights and funny moments. For long titles, a condensed font like Anton fits more words. Keep gaming thumbnails to two or three words, because the game footage behind them is usually busy.',
  },
];

export interface Mistake {
  title: string;
  fix: string;
}

export const MISTAKES: Mistake[] = [
  {
    title: 'A thin or light weight',
    fix: 'Thin strokes vanish at phone size. Use the heaviest weight of the family, such as Black or ExtraBold.',
  },
  {
    title: 'Script or decorative fonts for the main words',
    fix: 'Joined-up script letters blur together when small. Keep them for one short word at most, or leave them out.',
  },
  {
    title: 'Repeating the title',
    fix: 'The title already sits right under the thumbnail. Use the text to add something new: a number, a feeling, a result.',
  },
  {
    title: 'No outline on a busy background',
    fix: 'White text on a bright photo disappears. Add a dark outline, a shadow or a solid band behind the words.',
  },
  {
    title: 'Text in the bottom-right corner',
    fix: 'YouTube puts the video length there and covers it. Keep words away from that corner.',
  },
  {
    title: 'Downloading fonts from random sites',
    fix: 'Many fonts on free-font sites are free for personal use only. A monetized channel is commercial use. Google Fonts avoids the problem.',
  },
];

export interface Niche {
  name: string;
  advice: string;
  fonts: string;
}

export const NICHES: Niche[] = [
  {
    name: 'Gaming',
    advice: 'Short, loud and high contrast, because game footage is busy. Match the font to the game: blocky for retro, stencil for shooters.',
    fonts: 'Black Ops One, Press Start 2P, Bangers, Anton',
  },
  {
    name: 'Podcast and interviews',
    advice: 'Faces do most of the work. Use a clean, heavy font for a short quote or a name, and keep it to one line.',
    fonts: 'Bebas Neue, Oswald, Archivo Black',
  },
  {
    name: 'Education and how-to',
    advice: 'Clarity beats personality. A wide, even sans reads fastest and looks trustworthy.',
    fonts: 'Montserrat Black, Poppins Black, Anton',
  },
  {
    name: 'Vlog and lifestyle',
    advice: 'The text should sound like you. A friendly rounded font or a marker font feels personal.',
    fonts: 'Poppins Black, Fredoka, Permanent Marker, Lilita One',
  },
];

export const RELATED_TOOLS = [
  { href: '/youtube-thumbnail-size', label: 'Thumbnail size checker' },
  { href: '/tools/youtube-thumbnail-preview', label: 'Thumbnail preview' },
  { href: '/tools/youtube-thumbnail-tester', label: 'Thumbnail tester' },
  { href: '/youtube-thumbnail-backgrounds', label: 'Thumbnail backgrounds' },
  { href: '/thumbnails', label: 'Thumbnail ideas' },
];

/** Presets for the live preview. */
export const FILL_PRESETS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Yellow', value: '#ffe600' },
  { name: 'Red', value: '#ff2d2d' },
  { name: 'Green', value: '#39ff6a' },
  { name: 'Cyan', value: '#3ff0ff' },
  { name: 'Black', value: '#111111' },
];

export const OUTLINE_PRESETS = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#ffffff' },
  { name: 'Red', value: '#c40000' },
  { name: 'Navy', value: '#0b1a4a' },
];

export const BG_PRESETS = [
  { name: 'Red', value: 'linear-gradient(135deg, #e5262b 0%, #7a0a0e 100%)', swatch: '#c81d22' },
  { name: 'Blue', value: 'linear-gradient(135deg, #1f6fff 0%, #0a1f66 100%)', swatch: '#1a55d6' },
  { name: 'Purple', value: 'linear-gradient(135deg, #7c3aed 0%, #2e1065 100%)', swatch: '#6127c4' },
  { name: 'Green', value: 'linear-gradient(135deg, #16a34a 0%, #064e3b 100%)', swatch: '#12893f' },
  { name: 'Orange', value: 'linear-gradient(135deg, #ffd400 0%, #ff8a00 100%)', swatch: '#ffb000' },
  { name: 'Dark', value: 'linear-gradient(135deg, #2a2a2e 0%, #000000 100%)', swatch: '#1c1c1f' },
];

export const MAX_CHARS = 20;
export const DEFAULT_TEXT = 'BEST FONT EVER';
