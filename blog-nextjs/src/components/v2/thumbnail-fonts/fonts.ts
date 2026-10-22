import {
  Abril_Fatface,
  Anton,
  Archivo_Black,
  Bangers,
  Bebas_Neue,
  Black_Ops_One,
  Fredoka,
  Lilita_One,
  Luckiest_Guy,
  Montserrat,
  Oswald,
  Permanent_Marker,
  Poppins,
  Press_Start_2P,
} from 'next/font/google';
import type { FontId } from './content';

/**
 * The 14 fonts shown on /youtube-thumbnail-fonts, self-hosted by next/font (no request to Google
 * at runtime). Only this page imports this module, so no other page downloads them. One weight
 * each, latin only, and no preload: fourteen preloaded files would compete with the page's own
 * text. `display: swap` shows a fallback first, then swaps in the real font.
 */
const anton = Anton({ weight: '400', subsets: ['latin'], display: 'swap', preload: false });
const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], display: 'swap', preload: false });
const oswald = Oswald({ weight: '700', subsets: ['latin'], display: 'swap', preload: false });
const lilita = Lilita_One({ weight: '400', subsets: ['latin'], display: 'swap', preload: false });
const fredoka = Fredoka({ weight: '700', subsets: ['latin'], display: 'swap', preload: false });
const luckiest = Luckiest_Guy({ weight: '400', subsets: ['latin'], display: 'swap', preload: false });
const bangers = Bangers({ weight: '400', subsets: ['latin'], display: 'swap', preload: false });
const montserrat = Montserrat({ weight: '900', subsets: ['latin'], display: 'swap', preload: false });
const poppins = Poppins({ weight: '900', subsets: ['latin'], display: 'swap', preload: false });
const archivo = Archivo_Black({ weight: '400', subsets: ['latin'], display: 'swap', preload: false });
const abril = Abril_Fatface({ weight: '400', subsets: ['latin'], display: 'swap', preload: false });
const marker = Permanent_Marker({ weight: '400', subsets: ['latin'], display: 'swap', preload: false });
const pressStart = Press_Start_2P({ weight: '400', subsets: ['latin'], display: 'swap', preload: false });
const blackOps = Black_Ops_One({ weight: '400', subsets: ['latin'], display: 'swap', preload: false });

/** CSS font-family value for each font (the real family first, then next/font's fallback). */
export const FONT_FAMILY: Record<FontId, string> = {
  anton: anton.style.fontFamily,
  bebas: bebas.style.fontFamily,
  oswald: oswald.style.fontFamily,
  lilita: lilita.style.fontFamily,
  fredoka: fredoka.style.fontFamily,
  luckiest: luckiest.style.fontFamily,
  bangers: bangers.style.fontFamily,
  montserrat: montserrat.style.fontFamily,
  poppins: poppins.style.fontFamily,
  archivo: archivo.style.fontFamily,
  abril: abril.style.fontFamily,
  marker: marker.style.fontFamily,
  pressStart: pressStart.style.fontFamily,
  blackOps: blackOps.style.fontFamily,
};
