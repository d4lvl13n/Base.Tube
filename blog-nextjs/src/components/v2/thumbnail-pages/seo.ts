import type { Metadata } from 'next';

import { BASE_PATH, SITE_URL } from './lib/config.mjs';
import type { LoadedHub, LoadedPage } from './lib/content.mjs';
import { stripInline } from './lib/markdown-lite.mjs';
import type { FaqItem, ThumbnailPage } from './lib/schema.mjs';

const DEFAULT_OG = { url: `${SITE_URL}/images/og-card.webp`, width: 1200, height: 630, alt: 'Base.Tube' };
const NOINDEX = { index: false, follow: true, googleBot: { index: false, follow: true } } as const;

export function pageUrl(slug?: string): string {
  return slug ? `${SITE_URL}${BASE_PATH}/${slug}` : `${SITE_URL}${BASE_PATH}`;
}

function absolute(src: string): string {
  return src.startsWith('http') ? src : `${SITE_URL}${src}`;
}

function mimeType(file: string): string {
  const ext = file.split('.').pop()?.toLowerCase();
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  return `image/${ext}`;
}

/** <head> tags of a niche page. Pages that are not live get noindex. */
export function buildPageMetadata(lp: LoadedPage): Metadata {
  const p = lp.page as ThumbnailPage;
  const url = pageUrl(p.slug);
  const first = p.gallery[0];
  const og = first ? { url: absolute(first.src), width: 1280, height: 720, alt: first.alt } : DEFAULT_OG;
  return {
    title: p.title,
    description: p.description,
    keywords: [p.primaryKeyword, ...p.secondaryKeywords],
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: 'Base.Tube',
      title: p.title,
      description: p.description,
      images: [og],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@base_tube',
      title: p.title,
      description: p.description,
      images: [og.url],
    },
    ...(lp.live ? {} : { robots: NOINDEX }),
  };
}

export function buildHubMetadata(loaded: LoadedHub, firstImage?: { src: string; alt: string }): Metadata {
  const h = loaded.hub;
  if (!h) return { robots: NOINDEX };
  const url = pageUrl();
  const og = firstImage ? { url: absolute(firstImage.src), width: 1280, height: 720, alt: firstImage.alt } : DEFAULT_OG;
  return {
    title: h.title,
    description: h.description,
    keywords: [h.primaryKeyword, ...h.secondaryKeywords],
    alternates: { canonical: url },
    openGraph: { type: 'website', url, siteName: 'Base.Tube', title: h.title, description: h.description, images: [og] },
    twitter: { card: 'summary_large_image', site: '@base_tube', title: h.title, description: h.description, images: [og.url] },
    ...(loaded.live ? {} : { robots: NOINDEX }),
  };
}

function breadcrumb(items: { name: string; url: string }[], id: string) {
  return {
    '@type': 'BreadcrumbList',
    '@id': id,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}

function faqPage(faq: FaqItem[], id: string) {
  return {
    '@type': 'FAQPage',
    '@id': id,
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: stripInline(f.a) },
    })),
  };
}

const PUBLISHER = { '@type': 'Organization', name: 'Base.Tube', url: SITE_URL };

/** One JSON-LD graph: ImageGallery (a kind of CollectionPage) + BreadcrumbList + FAQPage (+ VideoObject). */
export function buildPageJsonLd(p: ThumbnailPage) {
  const url = pageUrl(p.slug);
  const images = p.gallery.map((g) => ({
    '@type': 'ImageObject',
    '@id': absolute(g.src),
    contentUrl: absolute(g.src),
    url: absolute(g.src),
    name: g.caption,
    caption: g.caption,
    description: g.alt,
    encodingFormat: mimeType(g.file),
    creator: PUBLISHER,
    creditText: 'Base.Tube',
  }));
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'ImageGallery',
      '@id': `${url}#page`,
      url,
      name: p.title,
      headline: `${p.h1}${p.h1Accent ? ` ${p.h1Accent}` : ''}`,
      description: p.description,
      inLanguage: 'en',
      dateModified: p.updated,
      ...(p.published ? { datePublished: p.published } : {}),
      keywords: [p.primaryKeyword, ...p.secondaryKeywords].join(', '),
      isPartOf: { '@type': 'WebSite', name: 'Base.Tube', url: SITE_URL },
      publisher: PUBLISHER,
      breadcrumb: { '@id': `${url}#breadcrumb` },
      ...(images[0] ? { primaryImageOfPage: { '@id': images[0]['@id'] } } : {}),
      associatedMedia: images,
    },
    breadcrumb(
      [
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'Thumbnail ideas', url: pageUrl() },
        { name: `${p.name} thumbnails`, url },
      ],
      `${url}#breadcrumb`,
    ),
  ];
  if (p.faq.length) graph.push(faqPage(p.faq, `${url}#faq`));
  if (p.video) {
    graph.push({
      '@type': 'VideoObject',
      '@id': `${url}#video`,
      name: p.video.title,
      description: p.video.description,
      uploadDate: p.video.uploadDate,
      ...(p.video.duration ? { duration: p.video.duration } : {}),
      thumbnailUrl: [`https://i.ytimg.com/vi/${p.video.youtubeId}/hqdefault.jpg`],
      embedUrl: `https://www.youtube-nocookie.com/embed/${p.video.youtubeId}`,
      url: `https://www.youtube.com/watch?v=${p.video.youtubeId}`,
      publisher: PUBLISHER,
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function buildHubJsonLd(loaded: LoadedHub, pages: ThumbnailPage[]) {
  const h = loaded.hub;
  const url = pageUrl();
  if (!h) return null;
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'CollectionPage',
      '@id': `${url}#page`,
      url,
      name: h.title,
      description: h.description,
      inLanguage: 'en',
      dateModified: h.updated,
      isPartOf: { '@type': 'WebSite', name: 'Base.Tube', url: SITE_URL },
      publisher: PUBLISHER,
      breadcrumb: { '@id': `${url}#breadcrumb` },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: pages.length,
        itemListElement: pages.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: pageUrl(p.slug),
          name: `${p.name} thumbnails`,
        })),
      },
    },
    breadcrumb(
      [
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'Thumbnail ideas', url },
      ],
      `${url}#breadcrumb`,
    ),
  ];
  if (h.faq.length) graph.push(faqPage(h.faq, `${url}#faq`));
  return { '@context': 'https://schema.org', '@graph': graph };
}

/** Serialise JSON-LD safely inside a <script> tag. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
