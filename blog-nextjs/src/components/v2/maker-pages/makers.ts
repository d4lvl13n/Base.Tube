import type { MetadataRoute } from 'next';

import liveIndexJson from '../thumbnail-pages/lib/live-pages.json';
import type { LiveIndex } from '../thumbnail-pages/lib/content.mjs';
import { callOfDuty } from './content/call-of-duty';
import { fortnite } from './content/fortnite';
import { gorillaTag } from './content/gorilla-tag';
import { gta6 } from './content/gta-6';
import { minecraft } from './content/minecraft';
import { roblox } from './content/roblox';
import { zeldaOcarinaOfTime } from './content/zelda-ocarina-of-time';
import { stealABrainrot } from './content/steal-a-brainrot';
import { arcRaiders } from './content/arc-raiders';
import { valorant } from './content/valorant';
import { rainbowSixSiege } from './content/rainbow-six-siege';
import { geometryDash } from './content/geometry-dash';
import { rocketLeague } from './content/rocket-league';
import { amongUs } from './content/among-us';
import { fnaf } from './content/fnaf';
import { marvelRivals } from './content/marvel-rivals';
import { pokemon } from './content/pokemon';
import { battlefield6 } from './content/battlefield-6';
import { clashRoyale } from './content/clash-royale';
import { apexLegends } from './content/apex-legends';
import { growAGarden } from './content/grow-a-garden';
import { repo } from './content/repo';

/**
 * "<game> thumbnail maker" pages (/fortnite-thumbnail-maker…): the tool-first twin of a game's
 * /thumbnails/<game> gallery. Google shows tools for "… thumbnail maker" and inspiration for
 * "… thumbnail", so each intent gets its own page and the two link to each other.
 *
 * The page reuses the gallery's images (made with Base.Tube) and their full prompts; this file only
 * holds what the maker page says on top of them.
 */

export interface MakerIdea {
  /** Chip label, 1-3 words. */
  label: string;
  /** What a creator would type: one plain line about the video. */
  idea: string;
  /** Gallery file (content/thumbnails/<game>.md) generated from this idea. */
  file: string;
}

export interface MakerVideoType {
  name: string;
  text: string;
  /** What to type for this kind of video (sent to the Studio). */
  idea: string;
  /** Gallery file shown next to it. */
  file: string;
}

export interface MakerFaq {
  q: string;
  a: string;
}

export interface MakerContent {
  /** Slug of the /thumbnails/<game> gallery the images come from. */
  game: string;
  /** draft = noindex, not in the sitemap. published = live once its gallery is live too. */
  status: 'draft' | 'published';
  updated: string;
  title: string;
  description: string;
  primaryKeyword: string;
  h1: string;
  h1Accent: string;
  intro: string;
  ideas: MakerIdea[];
  videoTypesTitle: string;
  videoTypes: MakerVideoType[];
  faq: MakerFaq[];
}

export const MAKERS: MakerContent[] = [fortnite, minecraft, roblox, gorillaTag, callOfDuty, gta6, zeldaOcarinaOfTime,
  stealABrainrot, arcRaiders, valorant, rainbowSixSiege, geometryDash, rocketLeague, amongUs, fnaf, marvelRivals, pokemon, battlefield6, clashRoyale, apexLegends, growAGarden, repo,
];

export const makerSlug = (game: string) => `${game}-thumbnail-maker`;
export const makerPath = (game: string) => `/${makerSlug(game)}`;

const liveGalleries = new Set((liveIndexJson as unknown as LiveIndex).pages.map((p) => p.slug));

/** Live = published AND its gallery is live (same images, so same quality bar). */
export const makerIsLive = (m: MakerContent) => m.status === 'published' && liveGalleries.has(m.game);

export function getMakerBySlug(slug: string): MakerContent | undefined {
  return MAKERS.find((m) => makerSlug(m.game) === slug);
}

export function getMakerForGame(game: string): MakerContent | undefined {
  return MAKERS.find((m) => m.game === game);
}

/** Sitemap entries: live maker pages only (drafts are never listed). */
export function getMakerSitemapEntries(baseUrl: string): MetadataRoute.Sitemap {
  return MAKERS.filter(makerIsLive).map((m) => ({
    url: `${baseUrl}${makerPath(m.game)}`,
    lastModified: new Date(`${m.updated}T00:00:00Z`),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
}
