import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://base.tube'
  
  // Static pages
  const staticPages = [
    '',
    '/blog',
    '/roadmap',
    '/landing',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // TODO: Add dynamic blog posts here when fetching from WordPress
  // const posts = await getAllPosts()
  // const blogPosts = posts.map((post) => ({
  //   url: `${baseUrl}/blog/${post.slug}`,
  //   lastModified: new Date(post.modified),
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.6,
  // }))

  return [
    ...staticPages,
    // ...blogPosts,
  ]
} 