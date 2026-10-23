import type { Metadata } from 'next';

import { standoutsOf, type Creator } from './creators';
import { CREATORS_PATH, creatorPath, SITE_URL } from './links';

const NOINDEX = { index: false, follow: true, googleBot: { index: false, follow: true } } as const;
const DEFAULT_OG = { url: `${SITE_URL}/images/og-card.webp`, width: 1200, height: 630, alt: 'Base.Tube' };
const PUBLISHER = { '@type': 'Organization', name: 'Base.Tube', url: SITE_URL };

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

export function creatorUrl(slug: string): string {
  return `${SITE_URL}${creatorPath(slug)}`;
}

export const HUB_URL = `${SITE_URL}${CREATORS_PATH}`;

/** Cuts at a word boundary and adds "…" when the text is longer than max. */
export function clip(text: string, max: number): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,;:.–-]+$/, '')}…`;
}

/** The longest title form that fits in TITLE_MAX characters. */
export function creatorTitle(c: Creator): string {
  const forms = [
    `${c.name} YouTube Thumbnails: Style, Stats and Standout Videos`,
    `${c.name} YouTube Thumbnails: Style and Standout Videos`,
    `${c.name} YouTube Thumbnails: Style and Stats`,
    `${c.name} YouTube Thumbnails`,
  ];
  return forms.find((f) => f.length <= TITLE_MAX) ?? clip(forms[forms.length - 1], TITLE_MAX);
}

export function creatorDescription(c: Creator): string {
  const subs = c.subscribersText ? ` (${c.subscribersText})` : '';
  const niche = c.analysis?.niche?.replace(/[.\s]+$/, '');
  // Longest form that fits in DESCRIPTION_MAX, so the snippet ends on a full sentence.
  const forms = niche
    ? [
        `${c.name}${subs}: ${niche}. How the thumbnails look, which videos beat the channel's median and what you can borrow.`,
        `${c.name}${subs}: ${niche}. Thumbnail style, standout videos and what you can borrow.`,
        `${c.name}: ${niche}. Thumbnail style, standout videos and what you can borrow.`,
        `${c.name}: ${niche}. Thumbnail style and standout videos.`,
      ]
    : [
        `${c.name}${subs}: latest YouTube uploads, view counts and standout videos, from public data collected ${c.collectedAt}.`,
        `${c.name}${subs}: latest YouTube uploads, view counts and standout videos.`,
      ];
  return forms.find((f) => f.length <= DESCRIPTION_MAX) ?? clip(forms[forms.length - 1], DESCRIPTION_MAX);
}

/** <head> of a creator page. Pages that are not live get noindex. */
export function buildCreatorMetadata(c: Creator): Metadata {
  const url = creatorUrl(c.slug);
  const title = creatorTitle(c);
  const description = creatorDescription(c);
  const first = standoutsOf(c)[0]?.video ?? c.videos[0];
  // hqdefault always exists (maxresdefault does not for every video).
  const og = first ? { url: first.thumbnail, width: 480, height: 360, alt: `${first.title}: video by ${c.name}` } : DEFAULT_OG;
  return {
    // Absolute: the title is already sized for search results, no " | Base.Tube" suffix.
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { type: 'profile', url, siteName: 'Base.Tube', title, description, images: [og] },
    twitter: { card: 'summary_large_image', site: '@base_tube', title, description, images: [og.url] },
    ...(c.live ? {} : { robots: NOINDEX }),
  };
}

function breadcrumb(items: { name: string; url: string }[], id: string) {
  return {
    '@type': 'BreadcrumbList',
    '@id': id,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}

/** ProfilePage (about the channel) + BreadcrumbList (+ FAQPage when the analysis has questions). */
export function buildCreatorJsonLd(c: Creator) {
  const url = creatorUrl(c.slug);
  const sameAs = [c.url, c.handle ? `https://www.youtube.com/@${c.handle.replace(/^@/, '')}` : null].filter(Boolean);
  const person: Record<string, unknown> = {
    '@type': 'Person',
    '@id': `${url}#creator`,
    name: c.name,
    ...(c.handle ? { alternateName: `@${c.handle.replace(/^@/, '')}` } : {}),
    url: c.url,
    sameAs,
    ...(c.avatar ? { image: c.avatar } : {}),
    ...(c.analysis?.niche ? { description: c.analysis.niche } : {}),
  };
  const stats: Record<string, unknown>[] = [];
  if (typeof c.subscribers === 'number') {
    stats.push({ '@type': 'InteractionCounter', interactionType: 'https://schema.org/FollowAction', userInteractionCount: c.subscribers });
  }
  if (typeof c.videoCount === 'number') {
    stats.push({ '@type': 'InteractionCounter', interactionType: 'https://schema.org/WriteAction', userInteractionCount: c.videoCount });
  }
  if (stats.length) person.interactionStatistic = stats;

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'ProfilePage',
      '@id': `${url}#page`,
      url,
      name: creatorTitle(c),
      description: creatorDescription(c),
      inLanguage: 'en',
      dateModified: c.collectedAt,
      isPartOf: { '@type': 'WebSite', name: 'Base.Tube', url: SITE_URL },
      publisher: PUBLISHER,
      breadcrumb: { '@id': `${url}#breadcrumb` },
      mainEntity: person,
    },
    breadcrumb(
      [
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'Creators', url: HUB_URL },
        { name: c.name, url },
      ],
      `${url}#breadcrumb`,
    ),
  ];
  const faq = c.analysis?.faq ?? [];
  if (faq.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

export const HUB_TITLE = 'YouTube Creators to Learn From: Thumbnails and Stats';
export const HUB_DESCRIPTION =
  'Real YouTube creators, sorted by game: their thumbnail style, the videos that beat their usual views and what you can borrow for your own channel.';

export function buildHubMetadata(isLive: boolean, firstThumb?: { src: string; alt: string }): Metadata {
  const og = firstThumb ? { url: firstThumb.src, width: 480, height: 360, alt: firstThumb.alt } : DEFAULT_OG;
  return {
    title: { absolute: HUB_TITLE },
    description: HUB_DESCRIPTION,
    alternates: { canonical: HUB_URL },
    openGraph: { type: 'website', url: HUB_URL, siteName: 'Base.Tube', title: HUB_TITLE, description: HUB_DESCRIPTION, images: [og] },
    twitter: { card: 'summary_large_image', site: '@base_tube', title: HUB_TITLE, description: HUB_DESCRIPTION, images: [og.url] },
    ...(isLive ? {} : { robots: NOINDEX }),
  };
}

export function buildHubJsonLd(creators: Creator[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${HUB_URL}#page`,
        url: HUB_URL,
        name: HUB_TITLE,
        description: HUB_DESCRIPTION,
        inLanguage: 'en',
        isPartOf: { '@type': 'WebSite', name: 'Base.Tube', url: SITE_URL },
        publisher: PUBLISHER,
        breadcrumb: { '@id': `${HUB_URL}#breadcrumb` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: creators.length,
          itemListElement: creators.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: creatorUrl(c.slug), name: c.name })),
        },
      },
      breadcrumb(
        [
          { name: 'Home', url: `${SITE_URL}/` },
          { name: 'Creators', url: HUB_URL },
        ],
        `${HUB_URL}#breadcrumb`,
      ),
    ],
  };
}

/** Serialise JSON-LD safely inside a <script> tag. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
