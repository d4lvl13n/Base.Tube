import { CATEGORY_LABELS } from '@/components/v2/thumbnail-pages/lib/config.mjs';
import { getLivePages } from '@/components/v2/thumbnail-pages/lib/content.mjs';
import type { ThumbnailPage } from '@/components/v2/thumbnail-pages/lib/schema.mjs';
import { ideaText } from '@/components/v2/thumbnail-pages/lib/studio-link.mjs';

// The template library of the AI Thumbnails app (beta.base.tube): every image of the live
// thumbnail pages with the idea behind it, built with the site. The app's create page lists them
// and fills its brief from one (visual direction and the exact words on the image).
export const dynamic = 'force-static';

/** The words written on the image ("text "QUEEN SAC""), or '' when the prompt has none. */
function headlineOf(prompt: string): string {
  const match = prompt.match(/\btext\s+"([^"]{1,60})"/i) || prompt.match(/"([^"]{2,60})"/);
  return match ? match[1].trim() : '';
}

export function GET() {
  const pages = getLivePages().map((loaded) => loaded.page as ThumbnailPage);
  const templates = pages.flatMap((page) =>
    page.gallery
      .filter((image) => !image.placeholder && image.prompt)
      .map((image) => ({
        id: `${page.slug}/${image.file}`,
        page: page.slug,
        image: image.src,
        alt: image.alt,
        caption: image.caption,
        layout: image.layout,
        direction: ideaText(image.prompt),
        headline: headlineOf(image.prompt),
      })),
  );
  const body = {
    version: 1,
    categories: Object.entries(CATEGORY_LABELS).map(([id, label]) => ({ id, label })),
    pages: pages
      .filter((page) => templates.some((template) => template.page === page.slug))
      .map((page) => ({ slug: page.slug, name: page.name, category: page.category }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    templates,
  };
  return Response.json(body, {
    headers: {
      // Public data, read by the app from another address.
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
