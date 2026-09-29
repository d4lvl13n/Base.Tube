import type { MetadataRoute } from 'next';

import { BASE_PATH, SITE_URL } from './lib/config.mjs';
import type { LiveIndex } from './lib/content.mjs';
import liveIndexJson from './lib/live-pages.json';

const liveIndex = liveIndexJson as unknown as LiveIndex;

/**
 * Sitemap entries for /thumbnails: the hub (once enough pages are live) and
 * every live page. Reads live-pages.json, which is bundled with the code, so it
 * works when the sitemap is refreshed on the server (where the Markdown files
 * are not available). The build checks that this file matches the content.
 */
export function getThumbnailSitemapEntries(baseUrl: string = SITE_URL): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];
  if (liveIndex.hub) {
    out.push({
      url: `${baseUrl}${BASE_PATH}`,
      lastModified: new Date(`${liveIndex.hub.updated}T00:00:00Z`),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }
  for (const p of liveIndex.pages) {
    out.push({
      url: `${baseUrl}${BASE_PATH}/${p.slug}`,
      lastModified: new Date(`${p.updated}T00:00:00Z`),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }
  return out;
}
