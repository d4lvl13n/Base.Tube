import { getAllPosts, getCleanTitle, getCleanExcerpt, getFeaturedImageUrl } from '@/lib/wordpress'

export async function GET() {
  const posts = await getAllPosts()
  const baseUrl = 'https://base.tube'
  
  const rssItems = posts.map(post => {
    const title = getCleanTitle(post)
    const excerpt = getCleanExcerpt(post)
    const featuredImage = getFeaturedImageUrl(post)
    const imageUrl = featuredImage.startsWith('http') ? featuredImage : `${baseUrl}${featuredImage}`
    
    return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${excerpt}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>team@base.tube (Base.Tube Team)</author>
      <media:content url="${imageUrl}" type="image/webp" medium="image" width="1200" height="630" />
      <media:thumbnail url="${imageUrl}" width="1200" height="630" />
    </item>`
  }).join('')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Base.Tube Insights</title>
    <link>${baseUrl}/blog</link>
    <description>Exploring the Future of Web3 Video Sharing. Discover insights about decentralized content creation, NFTs, and the future of digital storytelling.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${posts.length > 0 ? new Date(posts[0].date).toUTCString() : new Date().toUTCString()}</pubDate>
    <managingEditor>team@base.tube (Base.Tube Team)</managingEditor>
    <webMaster>team@base.tube (Base.Tube Team)</webMaster>
    <ttl>60</ttl>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/images/basetube-logo.png</url>
      <title>Base.Tube Insights</title>
      <link>${baseUrl}/blog</link>
      <width>144</width>
      <height>144</height>
    </image>
    ${rssItems}
  </channel>
</rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

