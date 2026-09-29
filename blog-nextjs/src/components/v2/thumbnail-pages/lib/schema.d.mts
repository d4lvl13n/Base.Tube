// Type declarations for schema.mjs. This is the contract between the content
// files (content/thumbnails/*.md) and the page template. Writer-facing field
// documentation lives in content/thumbnails/_TEMPLATE.md and README.md.

import type { Block } from './markdown-lite.mjs';

export type IssueLevel = 'error' | 'blocker' | 'warning';

export interface Issue {
  level: IssueLevel;
  /** Field path, e.g. "gallery[3].alt" */
  field: string;
  message: string;
  /** Line in the file (only for body problems) */
  line?: number;
}

export type PageStatus = 'draft' | 'published';
export type PageCategory = 'game' | 'style' | 'genre';

export interface PaletteColour {
  name: string;
  /** "#RRGGBB", upper case */
  hex: string;
  use: string;
}

export interface StyleRecipe {
  palette: PaletteColour[];
  composition: string;
  text: string;
  expressions: string;
  props: string[];
  background: string;
}

export interface LayoutRecipe {
  name: string;
  description: string;
  /** Idea sent to the Studio as ?prompt=... */
  prompt: string;
}

export interface GalleryImage {
  /** File name inside public/thumbnails/<slug>/ */
  file: string;
  /** Public path, e.g. /thumbnails/fortnite/victory-01.webp */
  src: string;
  alt: string;
  caption: string;
  /** The prompt / style notes used to generate the image */
  prompt: string;
  notes: string;
  /** Name of the layout recipe it illustrates ('' if none) */
  layout: string;
  placeholder: boolean;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface VideoEmbed {
  youtubeId: string;
  title: string;
  description: string;
  /** YYYY-MM-DD */
  uploadDate: string;
  /** ISO 8601 duration (PT1M20S) or '' */
  duration: string;
}

export interface Trademark {
  name: string;
  /** '' when unknown */
  owner: string;
}

export interface SectionHeadings {
  gallery?: string;
  recipe?: string;
  layouts?: string;
  guide?: string;
  dos?: string;
  faq?: string;
  related?: string;
  listing?: string;
}

export interface ThumbnailPage {
  slug: string;
  status: PageStatus;
  category: PageCategory;
  name: string;
  /** YYYY-MM-DD */
  updated: string;
  /** YYYY-MM-DD or '' */
  published: string;
  title: string;
  description: string;
  h1: string;
  h1Accent: string;
  summary: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  intro: string;
  styleRecipe: StyleRecipe;
  layouts: LayoutRecipe[];
  gallery: GalleryImage[];
  dos: string[];
  donts: string[];
  faq: FaqItem[];
  related: string[];
  cta: { style: string; label: string };
  trademark: Trademark | null;
  video: VideoEmbed | null;
  listing: PageCategory | null;
  headings: SectionHeadings;
  body: string;
  bodyBlocks: Block[];
  /** Words of visible text on the page (for the validator) */
  wordCount: number;
  /** Source file name, e.g. fortnite.md */
  file: string;
}

export interface HubContent {
  title: string;
  description: string;
  h1: string;
  h1Accent: string;
  intro: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  faq: FaqItem[];
  updated: string;
  body: string;
  bodyBlocks: Block[];
  file: string;
}

export const SLUG_RE: RegExp;

export function containsKeyword(text: string, keyword: string): boolean;

export function normalizePage(
  data: Record<string, unknown>,
  body: string,
  ctx: { file: string; bodyStartLine?: number },
): { page: ThumbnailPage | null; issues: Issue[] };

export function normalizeHub(
  data: Record<string, unknown>,
  body: string,
  ctx: { file: string; bodyStartLine?: number },
): { hub: HubContent | null; issues: Issue[] };

export function studioGenerateUrl(opts: { style?: string; prompt?: string; ref?: string }): string;
