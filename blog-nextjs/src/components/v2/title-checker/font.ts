import { Roboto } from 'next/font/google';

/**
 * YouTube sets its titles in Roboto. Loading it here (self-hosted by Next, no
 * request to Google at runtime) lets canvas measure the same glyph widths the
 * viewer's browser uses.
 */
export const roboto = Roboto({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
});

/** Same stack for the canvas measurement and for the preview text. */
export const TITLE_FONT_STACK = `${roboto.style.fontFamily}, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", Arial, sans-serif`;
