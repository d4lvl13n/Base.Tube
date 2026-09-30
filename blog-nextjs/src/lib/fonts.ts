import { DM_Serif_Display, Geist_Mono, Inter } from 'next/font/google';

/**
 * The site's typefaces, self-hosted by next/font and exposed as CSS variables on <body> (see
 * app/layout.tsx). Inter and DM Serif Display used to come from a render-blocking Google Fonts
 * @import in v2.css (Inter 300 to 900, DM Serif Display regular and italic): the same families and
 * weights, so the pages look the same. None is preloaded: the home page and /ai-thumbnails set their
 * text in Archivo, so a preload in the root layout would only compete with their first paint.
 */
export const inter = Inter({
  subsets: ['latin'],
  // The seven weights the @import asked for, declared one by one as Google declared them: with a
  // single 100-900 range, Chrome set some titles a hair narrower and they wrapped differently.
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  // No metric-adjusted Arial in the font list: characters Inter lacks (the → of many links) keep
  // coming from the system font, as they did.
  adjustFontFallback: false,
  display: 'swap',
  preload: false,
  variable: '--font-inter',
});

export const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  adjustFontFallback: false,
  display: 'swap',
  preload: false,
  variable: '--font-dm-serif',
});

/** Figures and labels on the /thumbnails pages and the video-to-thumbnail tool. */
export const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-geist-mono',
});
