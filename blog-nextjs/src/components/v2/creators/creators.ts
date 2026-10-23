import { isLive, readCreatorFiles } from './lib/creators-files.mjs';
import { CREATORS_HUB_MIN_LIVE } from './links';

/**
 * Server-only loader for the creator pages (content/creators/<slug>.json). Runs at build time
 * (every /creators/youtube page is static). Never import it from a client component.
 * Format of the files: content/creators/README.md.
 */

export interface CreatorVideo {
  id: string;
  title: string;
  views: number | null;
  viewsText: string | null;
  duration: string | null;
  durationSec: number | null;
  published: string | null;
  thumbnail: string;
  thumbnailHd: string;
}

export interface CreatorAnalysis {
  summary: string;
  niche: string;
  styleTraits: { title: string; detail: string }[];
  standouts: { id: string; why: string }[];
  lessons: string[];
  experiment: string;
  faq: { q: string; a: string }[];
  reviewedAt?: string;
}

export interface Creator {
  slug: string;
  status: 'draft' | 'published' | string;
  channelId: string;
  name: string;
  handle: string | null;
  url: string;
  avatar: string | null;
  game: string;
  subscribers: number | null;
  subscribersText: string | null;
  videoCount: number | null;
  description: string;
  collectedAt: string;
  source: string;
  stats: { sample: number; medianViews: number | null; outliers: { id: string; multiple: number }[] };
  videos: CreatorVideo[];
  analysis: CreatorAnalysis | null;
  /** status "published" AND analysis written: indexed and listed. Computed, not in the file. */
  live: boolean;
}

function normalize(raw: Record<string, unknown>): Creator {
  const c = raw as unknown as Creator;
  const a = c.analysis;
  return {
    ...c,
    name: c.name || c.slug,
    handle: c.handle ?? null,
    videos: Array.isArray(c.videos) ? c.videos.filter((v) => v && v.id) : [],
    stats: c.stats ?? { sample: 0, medianViews: null, outliers: [] },
    analysis: a
      ? {
          ...a,
          summary: a.summary ?? '',
          niche: a.niche ?? '',
          styleTraits: a.styleTraits ?? [],
          standouts: a.standouts ?? [],
          lessons: a.lessons ?? [],
          experiment: a.experiment ?? '',
          faq: a.faq ?? [],
        }
      : null,
    live: isLive(c as unknown as Record<string, unknown>),
  };
}

let cache: Creator[] | null = null;

/** Every creator file (drafts included), sorted by name. */
export function getCreators(): Creator[] {
  if (cache && process.env.NODE_ENV === 'production') return cache;
  cache = readCreatorFiles()
    .map(normalize)
    .sort((a, b) => a.name.localeCompare(b.name));
  return cache;
}

export function getCreator(slug: string): Creator | undefined {
  return getCreators().find((c) => c.slug === slug);
}

/** Creators of one game (slug of a /thumbnails/<game> page), drafts included. */
export function creatorsForGame(game: string): Creator[] {
  return getCreators().filter((c) => c.game === game);
}

// ── Numbers ────────────────────────────────────────────────────────────

/**
 * Views of a video, or null when the collected count cannot be trusted. When YouTube shows a
 * byline (collab videos), the scraped "view count" field sometimes holds the date instead
 * ("4 months ago" was read as 4M views). Only counts whose text says "views" are kept.
 */
export function trustedViews(v: CreatorVideo): number | null {
  if (typeof v.views !== 'number' || !v.viewsText || !/\bviews?\b/i.test(v.viewsText)) return null;
  return v.views;
}

/** "62K views", or null when unknown. */
export function viewsLabel(v: CreatorVideo): string | null {
  return trustedViews(v) != null ? v.viewsText : null;
}

/** "3 days ago" (the date sometimes landed in the views field, see trustedViews). */
export function publishedLabel(v: CreatorVideo): string | null {
  if (v.published) return v.published;
  if (v.viewsText && /\bago\b/i.test(v.viewsText)) return v.viewsText;
  return null;
}

function median(xs: number[]): number | null {
  const s = [...xs].sort((a, b) => a - b);
  if (!s.length) return null;
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}

export interface ChannelNumbers {
  /** videos with a trusted view count */
  sample: number;
  medianViews: number | null;
  /** best views ÷ median among those videos */
  bestMultiple: number | null;
  bestVideo: CreatorVideo | null;
}

/**
 * Median and multiples computed from the videos with a trusted view count (the numbers stored in
 * stats can include misread dates, see trustedViews).
 */
export function channelNumbers(c: Creator): ChannelNumbers {
  const counted = c.videos.filter((v) => trustedViews(v) != null);
  const med = median(counted.map((v) => trustedViews(v) as number));
  let bestVideo: CreatorVideo | null = null;
  for (const v of counted) if (!bestVideo || (trustedViews(v) as number) > (trustedViews(bestVideo) as number)) bestVideo = v;
  const bestMultiple = med && bestVideo ? round1((trustedViews(bestVideo) as number) / med) : null;
  return { sample: counted.length, medianViews: med, bestMultiple, bestVideo };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** views ÷ the channel's median, or null when either is unknown. */
export function multipleOf(v: CreatorVideo, nums: ChannelNumbers): number | null {
  const views = trustedViews(v);
  return views != null && nums.medianViews ? round1(views / nums.medianViews) : null;
}

export interface Standout {
  video: CreatorVideo;
  multiple: number | null;
  why: string | null;
}

/**
 * The videos to feature: the ones the analysis picked, or else the 3 videos furthest above the
 * median (trusted counts only).
 */
export function standoutsOf(c: Creator): Standout[] {
  const nums = channelNumbers(c);
  const byId = new Map(c.videos.map((v) => [v.id, v]));
  const picked = (c.analysis?.standouts ?? [])
    .map((s) => ({ video: byId.get(s.id), why: s.why || null }))
    .filter((s): s is { video: CreatorVideo; why: string | null } => Boolean(s.video));
  if (picked.length) return picked.map((s) => ({ ...s, multiple: multipleOf(s.video, nums) }));
  return c.videos
    .map((video) => ({ video, multiple: multipleOf(video, nums), why: null }))
    .filter((s) => s.multiple != null)
    .sort((a, b) => (b.multiple as number) - (a.multiple as number))
    .slice(0, 3);
}

/** "×30.8", "×2" */
export function formatMultiple(m: number): string {
  return `×${Number.isInteger(m) ? m : m.toFixed(1)}`;
}

/** 259500 → "259.5K", 4000000 → "4M" */
export function compactNumber(n: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

/** "2026-10-23" → "October 23, 2026" */
export function formatDay(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

// ── Hub ────────────────────────────────────────────────────────────────

/**
 * What /creators/youtube shows. Once CREATORS_HUB_MIN_LIVE creators are live it is indexed and
 * lists live creators only; before that it is a noindex preview of every creator.
 */
export function creatorsHubState(): { isLive: boolean; creators: Creator[] } {
  const all = getCreators();
  const live = all.filter((c) => c.live);
  const isLive = live.length >= CREATORS_HUB_MIN_LIVE;
  return { isLive, creators: isLive ? live : all };
}

/**
 * Other creators of the same game to link from a creator page. A live page links to live pages
 * only (an indexed page never points to a noindex draft); a draft links to every one.
 */
export function moreCreators(c: Creator): Creator[] {
  return creatorsForGame(c.game).filter((o) => o.slug !== c.slug && (o.live || !c.live));
}
