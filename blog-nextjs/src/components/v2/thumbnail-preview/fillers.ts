// Sample videos that fill the feed around the user's video.
// They are generated here (plain SVG), fictional, and never copied from real channels.

export interface FillerVideo {
  key: string;
  title: string;
  channel: string;
  views: string;
  age: string;
  duration: string;
  img: string;
}

interface Spec {
  bg: [string, string];
  lines: string[];
  ink: string;
  stroke?: string;
  accent: string;
  shape: 'band' | 'circles' | 'rings' | 'bars' | 'face' | 'none';
  serif?: boolean;
  meta: Omit<FillerVideo, 'key' | 'img'>;
}

const SANS = "Impact, 'Arial Black', 'Helvetica Neue', Arial, sans-serif";

function shapeSvg(spec: Spec): string {
  const a = spec.accent;
  switch (spec.shape) {
    case 'band':
      return `<polygon points="0,250 640,150 640,250 0,360" fill="${a}" opacity="0.9"/>`;
    case 'circles':
      return `<circle cx="520" cy="110" r="120" fill="${a}" opacity="0.55"/><circle cx="590" cy="290" r="70" fill="${a}" opacity="0.8"/>`;
    case 'rings':
      return `<circle cx="530" cy="180" r="140" fill="none" stroke="${a}" stroke-width="22" opacity="0.75"/><circle cx="530" cy="180" r="82" fill="none" stroke="${a}" stroke-width="14" opacity="0.55"/>`;
    case 'bars':
      return `<rect x="320" y="0" width="320" height="360" fill="${a}" opacity="0.92"/>`;
    case 'face':
      return `<circle cx="505" cy="176" r="140" fill="${a}" opacity="0.26"/><g opacity="0.74" fill="#0b0b12"><path d="M300 380 C300 300 380 268 505 262 C630 268 710 300 710 380 Z"/><rect x="478" y="222" width="54" height="52"/><ellipse cx="505" cy="176" rx="64" ry="78"/></g>`;
    default:
      return `<circle cx="70" cy="300" r="10" fill="${a}"/>`;
  }
}

function textSvg(spec: Spec): string {
  const lines = spec.lines;
  const face = spec.shape === 'face';
  const x = face ? 40 : 44;
  const size = lines.length > 1 ? 88 : 132;
  const total = lines.length * size * 0.92;
  const startY = (360 - total) / 2 + size * 0.86;
  const family = spec.serif ? "Georgia, 'Times New Roman', serif" : SANS;
  const weight = spec.serif ? 400 : 900;
  const style = spec.serif ? 'italic' : 'normal';
  const stroke = spec.stroke
    ? `stroke="${spec.stroke}" stroke-width="10" paint-order="stroke" stroke-linejoin="round"`
    : '';
  return lines
    .map(
      (line, i) =>
        `<text x="${x}" y="${(startY + i * size * 0.92).toFixed(0)}" font-family="${family}" font-weight="${weight}" font-style="${style}" font-size="${size}" fill="${spec.ink}" ${stroke}>${line}</text>`,
    )
    .join('');
}

function toDataUri(spec: Spec): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${spec.bg[0]}"/><stop offset="1" stop-color="${spec.bg[1]}"/></linearGradient></defs>` +
    `<rect width="640" height="360" fill="url(#g)"/>${shapeSvg(spec)}${textSvg(spec)}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const SPECS: Spec[] = [
  {
    bg: ['#ffd600', '#ffb300'], lines: ['$1 VS', '$1,000'], ink: '#0d0d0d', accent: '#0d0d0d', shape: 'band',
    meta: { title: "I Bought the Cheapest and the Priciest Camera. Here's the Difference", channel: 'Lensworks Weekly', views: '1.4M views', age: '2 weeks ago', duration: '14:22' },
  },
  {
    bg: ['#0b1f4d', '#153a8a'], lines: ['I QUIT'], ink: '#ffffff', stroke: '#0b1f4d', accent: '#ffb300', shape: 'face',
    meta: { title: 'I Quit My Job Six Months Ago. Here Is What Happened', channel: 'Sam & Lou', views: '480K views', age: '1 month ago', duration: '18:07' },
  },
  {
    bg: ['#d81b1b', '#8f0d0d'], lines: ["DON'T", 'BUY THIS'], ink: '#ffffff', stroke: '#5c0808', accent: '#ffffff', shape: 'rings',
    meta: { title: "Please Don't Buy This Before You Watch", channel: 'Gear Honest', views: '96K views', age: '3 days ago', duration: '9:31' },
  },
  {
    bg: ['#c9f2d8', '#7dd3a8'], lines: ['5 MIN', 'MEALS'], ink: '#0d3b2a', accent: '#ffffff', shape: 'circles',
    meta: { title: 'Five Dinners in Five Minutes, All Under Ten Dollars', channel: 'Kitchen Table', views: '2.3M views', age: '8 months ago', duration: '11:48' },
  },
  {
    bg: ['#1b0f3a', '#4b1d8f'], lines: ['WHY?'], ink: '#ffffff', stroke: '#1b0f3a', accent: '#ffd54a', shape: 'rings',
    meta: { title: 'Why Does Nobody Talk About This Ending?', channel: 'Second Screen', views: '731K views', age: '5 days ago', duration: '22:15' },
  },
  {
    bg: ['#ff7a18', '#ff5c00'], lines: ['100', 'DAYS'], ink: '#ffffff', stroke: '#7a2b00', accent: '#0f766e', shape: 'bars',
    meta: { title: 'I Tried Waking Up at 5 A.M. for 100 Days', channel: 'Field Notes', views: '3.8M views', age: '1 year ago', duration: '16:40' },
  },
  {
    bg: ['#0f172a', '#1e293b'], lines: ['IT', 'WORKED'], ink: '#ffffff', stroke: '#0f172a', accent: '#ffd54a', shape: 'face',
    meta: { title: 'It Actually Worked. Full Results After 90 Days', channel: 'The Daily Build', views: '212K views', age: '1 day ago', duration: '12:03' },
  },
  {
    bg: ['#f4f1ea', '#e7e0d2'], lines: ['Quiet', 'morning'], ink: '#1b1b1b', accent: '#c2410c', shape: 'none', serif: true,
    meta: { title: 'Slow Morning Routine in a Small Apartment', channel: 'Quiet Hours', views: '58K views', age: '6 hours ago', duration: '8:55' },
  },
  {
    bg: ['#ff4f9a', '#c2185b'], lines: ['NEW', 'LOOK'], ink: '#ffffff', stroke: '#7a0c3a', accent: '#ffe066', shape: 'face',
    meta: { title: 'The New Look Nobody Asked For (Honest Review)', channel: 'Pixel & Pine', views: '1.1M views', age: '4 months ago', duration: '13:36' },
  },
  {
    bg: ['#0d3b1e', '#14803c'], lines: ['FREE?!'], ink: '#eaffea', stroke: '#0d3b1e', accent: '#b6ff3b', shape: 'band',
    meta: { title: 'Is Free Software Really Free? A Practical Test', channel: 'Small Business Lab', views: '344K views', age: '2 weeks ago', duration: '19:20' },
  },
  {
    bg: ['#7cc7ff', '#2a7de1'], lines: ['FAST', 'SETUP'], ink: '#ffffff', stroke: '#0b3d80', accent: '#ffffff', shape: 'circles',
    meta: { title: 'Fast Setup Guide for Beginners: Done in 20 Minutes', channel: 'Long Way Round', views: '27K views', age: '11 days ago', duration: '21:02' },
  },
  {
    bg: ['#1f1f1f', '#3a3a3a'], lines: ['THE', 'END'], ink: '#f5c542', accent: '#f5c542', shape: 'rings',
    meta: { title: 'The End of an Era: Final Episode Reaction', channel: 'Overtime Club', views: '5.2M views', age: '3 years ago', duration: '34:17' },
  },
];

export const FILLERS: FillerVideo[] = SPECS.map((spec, i) => ({
  key: `sample-${i + 1}`,
  img: toDataUri(spec),
  ...spec.meta,
}));
