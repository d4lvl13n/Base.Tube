/**
 * Where a YouTube title is shown, and the numbers that decide where it is cut.
 *
 * Measured on youtube.com (desktop, 1440 px window, sidebar open) and
 * m.youtube.com (390 px wide phone), signed out, on 29 September 2026:
 * font size, weight, line height, line clamp and the width of the text column.
 * The desktop home feed uses the same video card as a channel's Videos tab,
 * so its font and clamp are measured; the card width and avatar column are
 * modelled from that card. YouTube changes these layouts often and the
 * numbers depend on window size, so treat every cut as a close guide.
 */

export type SurfaceId = 'home' | 'search' | 'mobile' | 'suggested';

export interface Surface {
  id: SurfaceId;
  label: string;
  /** One line describing the modelled layout. */
  context: string;
  fontSize: number;
  fontWeight: 400 | 500;
  lineHeight: number;
  maxLines: number;
  /** Width of the title text column, in CSS pixels. */
  textWidth: number;
}

export const SURFACES: Surface[] = [
  {
    id: 'home',
    label: 'Desktop home',
    context: 'Home feed card, about 350 px wide',
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 22,
    maxLines: 2,
    // 347 px card, minus the 36 px avatar and 12 px gap, minus 24 px for the menu button.
    textWidth: 275,
  },
  {
    id: 'mobile',
    label: 'Mobile feed',
    context: 'Phone, 390 px wide',
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 17.5,
    maxLines: 2,
    textWidth: 278,
  },
  {
    id: 'suggested',
    label: 'Suggested videos',
    context: 'Watch page sidebar, 1440 px window',
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 20,
    maxLines: 3,
    textWidth: 136,
  },
  {
    id: 'search',
    label: 'Desktop search',
    context: 'Search results, 1440 px window',
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 26,
    maxLines: 2,
    textWidth: 588,
  },
];

export const surfaceById = (id: SurfaceId): Surface => SURFACES.find((s) => s.id === id) as Surface;
