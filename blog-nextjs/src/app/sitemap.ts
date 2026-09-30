import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/wordpress'
import { getThumbnailSitemapEntries } from '@/components/v2/thumbnail-pages/sitemap-entries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://base.tube'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/content-pass`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ai-thumbnails`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/youtube-channel-audit`,
      lastModified: new Date('2026-09-30'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/ctr-optimizer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/youtube-thumbnail-size`,
      lastModified: new Date('2026-09-29'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools/youtube-thumbnail-resizer`,
      lastModified: new Date('2026-09-29'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/youtube-thumbnail-preview`,
      lastModified: new Date('2026-09-29'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/youtube-thumbnail-tester`,
      lastModified: new Date('2026-09-29'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/youtube-title-checker`,
      lastModified: new Date('2026-09-29'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/video-to-thumbnail`,
      lastModified: new Date('2026-09-29'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]

  // Fetch all blog posts dynamically from WordPress
  let blogPosts: MetadataRoute.Sitemap = []

  try {
    const posts = await getAllPosts()
    blogPosts = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.modified || post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error)
  }

  // /thumbnails hub + niche pages: only pages that are published AND complete
  // (enough gallery images, no placeholders...). Drafts are never listed.
  let thumbnailPages: MetadataRoute.Sitemap = []
  try {
    thumbnailPages = getThumbnailSitemapEntries(baseUrl)
  } catch (error) {
    console.error('Error loading /thumbnails pages for sitemap:', error)
  }

  return [...staticPages, ...thumbnailPages, ...blogPosts]
}
