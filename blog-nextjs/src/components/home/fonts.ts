import localFont from 'next/font/local';

/**
 * The home page's Archivo: the same typeface and CSS variable as the AI Thumbnails page, in a smaller
 * file (35 kB instead of 90 kB). It is Google's Latin file of Archivo (SIL Open Font License),
 * limited with fontTools to what this page uses: weights 400 to 800, widths 100% to 115%, ASCII,
 * the accents the page and the fan names use, and typographic punctuation. Lighthouse's LCP
 * simulation counts every file that arrives before the
 * first paint, so the preloaded font's size weighs on it directly.
 */
export const archivo = localFont({
  src: './archivo-home.woff2',
  weight: '400 800',
  style: 'normal',
  display: 'swap',
  variable: '--font-lp-archivo',
  declarations: [{ prop: 'font-stretch', value: '100% 115%' }],
});
