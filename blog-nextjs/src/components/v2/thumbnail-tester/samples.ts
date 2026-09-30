/**
 * Three example thumbnails drawn on a canvas in the visitor's browser.
 * They are abstract layouts made for this page (no photos, no people, no
 * third-party artwork) and each one is deliberately different, so the
 * comparison views have something to show on the first click.
 */

export const SAMPLE_TITLE = '3 mistakes that cost me a year';

const W = 1280;
const H = 720;
const FALLBACK_FONTS = '"Helvetica Neue", Arial, sans-serif';
// Inter comes from next/font under its own family name, which the root layout puts in --font-inter
// on <body>; the canvas asks for that name (read in the browser, just before drawing).
let FONT = `Inter, ${FALLBACK_FONTS}`;

function readInterFamily(): string {
  const inter = getComputedStyle(document.body).getPropertyValue('--font-inter').trim();
  return inter ? `${inter}, ${FALLBACK_FONTS}` : FONT;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function sampleA(ctx: CanvasRenderingContext2D) {
  // One strong shape, two big words, near-black background.
  ctx.fillStyle = '#101014';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ff801f';
  ctx.beginPath();
  ctx.arc(985, 360, 255, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#101014';
  ctx.font = `800 380px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('3', 985, 500);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 150px ${FONT}`;
  ctx.fillText('MISTAKES', 60, 300, 640);
}

function sampleB(ctx: CanvasRenderingContext2D) {
  // Busy, mid-tone, small text: the kind of layout that turns to mush at a glance.
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#2d6f96');
  g.addColorStop(1, '#5c9dbd');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const tones = ['#347aa3', '#4f8fb2', '#3b82a9', '#6aa8c6', '#2a6a90', '#5b9bbb'];
  const shapes: [number, number, number, number][] = [
    [80, 70, 220, 150],
    [340, 40, 160, 210],
    [560, 110, 260, 130],
    [870, 60, 170, 170],
    [1060, 150, 150, 210],
    [120, 290, 200, 160],
    [400, 320, 250, 120],
    [700, 300, 170, 200],
    [930, 350, 260, 110],
  ];
  shapes.forEach(([x, y, w, h], i) => {
    ctx.fillStyle = tones[i % tones.length];
    roundRect(ctx, x, y, w, h, 26);
    ctx.fill();
  });
  ctx.fillStyle = '#84b6d0';
  ctx.font = `600 58px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.fillText('HOW I FIXED MY EDITING WORKFLOW', 70, 585);
  // Second line is sized to run to the right edge, so it passes under the duration badge.
  const line2 = 'IN ONE WEEK (AND WHAT IT ACTUALLY COST ME)';
  ctx.font = `600 58px ${FONT}`;
  const natural = ctx.measureText(line2).width;
  ctx.font = `600 ${Math.floor((58 * 1150) / natural)}px ${FONT}`;
  ctx.fillText(line2, 70, 665);
}

function sampleC(ctx: CanvasRenderingContext2D) {
  // Light background: its edge meets a light-mode feed with almost no contrast.
  ctx.fillStyle = '#f4ecdb';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ead1bd';
  ctx.beginPath();
  ctx.arc(1170, 90, 150, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#d5e2c9';
  ctx.beginPath();
  ctx.arc(90, 650, 170, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1c1c1c';
  roundRect(ctx, 90, 130, 500, 460, 46);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 400px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('3', 340, 500);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#1c1c1c';
  ctx.font = `800 118px ${FONT}`;
  ctx.fillText('MISTAKES', 650, 350, 570);
  // A small tag in the bottom-right corner: exactly where the duration badge lands.
  ctx.fillStyle = '#1c1c1c';
  roundRect(ctx, 1060, 615, 170, 70, 18);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 34px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('PART 1', 1145, 661);
}

const DRAWERS = [sampleA, sampleB, sampleC];

export async function makeSampleFiles(): Promise<File[]> {
  FONT = readInterFamily();
  try {
    await Promise.all([document.fonts.load(`800 100px ${FONT}`), document.fonts.load(`600 60px ${FONT}`)]);
  } catch {
    /* fall back to the system font */
  }
  const files: File[] = [];
  for (let i = 0; i < DRAWERS.length; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No canvas');
    DRAWERS[i](ctx);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
    if (!blob) throw new Error('Could not draw the example');
    files.push(new File([blob], `example-${'abc'[i]}.png`, { type: 'image/png' }));
  }
  return files;
}
