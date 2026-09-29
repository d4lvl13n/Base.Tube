import { Anton, Archivo } from 'next/font/google';

/**
 * The page's two typefaces (the app loaded them with useLandingFonts): Archivo with its width axis
 * (headlines are set widened) and Anton for the big quote marks. Self-hosted by next/font, applied to
 * the page wrapper only through these CSS variables.
 */
export const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-lp-archivo',
});

/** Only the quote marks far down the page use it: not preloaded. */
export const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  preload: false,
  variable: '--font-lp-anton',
});
