import Script from 'next/script'
import { WordPressPost, getCleanTitle, getCleanExcerpt, getFeaturedImageUrl, calculateReadingTime, getCategories, getTags, getISODate } from '@/lib/wordpress'

interface ArticleStructuredDataProps {
  post: WordPressPost
  url: string
}

// Article/BlogPosting Schema for individual blog posts
export function ArticleStructuredData({ post, url }: ArticleStructuredDataProps) {
  const title = getCleanTitle(post)
  const excerpt = getCleanExcerpt(post)
  const featuredImage = getFeaturedImageUrl(post)
  const readingTime = calculateReadingTime(post.content.rendered)
  const categories = getCategories(post)
  const tags = getTags(post)
  
  // Build keywords from categories and tags
  const keywords = [
    ...categories.map(c => c.name),
    ...tags.map(t => t.name),
  ].join(', ')

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": excerpt.slice(0, 160),
    "image": {
      "@type": "ImageObject",
      "url": featuredImage.startsWith('http') ? featuredImage : `https://base.tube${featuredImage}`,
      "width": 1200,
      "height": 630
    },
    "author": {
      "@type": "Organization",
      "name": "Base.Tube",
      "url": "https://base.tube",
      "logo": {
        "@type": "ImageObject",
        "url": "https://base.tube/images/basetube-logo.png"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Base.Tube",
      "url": "https://base.tube",
      "logo": {
        "@type": "ImageObject",
        "url": "https://base.tube/images/basetube-logo.png",
        "width": 160,
        "height": 48
      }
    },
    "datePublished": getISODate(post.date),
    "dateModified": getISODate(post.modified || post.date),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "url": url,
    "wordCount": post.content.rendered.replace(/<[^>]*>/g, '').trim().split(/\s+/).length,
    "timeRequired": `PT${readingTime}M`,
    "keywords": keywords || "Web3, video sharing, content creation, decentralized, NFT",
    "articleSection": categories.length > 0 ? categories[0].name : "Web3",
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "potentialAction": {
      "@type": "ReadAction",
      "target": url
    }
  }

  return (
    <Script
      id="article-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string
    url: string
  }>
}

// BreadcrumbList Schema
export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }

  return (
    <Script
      id="breadcrumb-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Organization Schema (for site-wide use)
export function OrganizationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Base.Tube",
    "url": "https://base.tube",
    "logo": {
      "@type": "ImageObject",
      "url": "https://base.tube/images/basetube-logo.png",
      "width": 160,
      "height": 48
    },
    "description": "The platform that pays creators first. Turn your content into tradeable assets with Web3 technology.",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/base_tube",
      "https://t.me/basetube",
      "https://discord.gg/basetube"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "url": "https://base.tube/help"
    }
  }

  return (
    <Script
      id="organization-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// WebSite Schema with SearchAction (for site search rich results)
export function WebSiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Base.Tube",
    "alternateName": "BaseTube",
    "url": "https://base.tube",
    "description": "The platform that pays creators first. Turn your content into tradeable assets.",
    "publisher": {
      "@type": "Organization",
      "name": "Base.Tube"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://base.tube/blog?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <Script
      id="website-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Blog Schema for the blog listing page
export function BlogStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Base.Tube Insights",
    "description": "Exploring the Future of Web3 Video Sharing. Discover insights about decentralized content creation, NFTs, and the future of digital storytelling.",
    "url": "https://base.tube/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Base.Tube",
      "url": "https://base.tube",
      "logo": {
        "@type": "ImageObject",
        "url": "https://base.tube/images/basetube-logo.png"
      }
    },
    "inLanguage": "en-US",
    "isAccessibleForFree": true
  }

  return (
    <Script
      id="blog-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// ItemList Schema for blog post listings (helps with carousel rich results)
interface BlogPostListStructuredDataProps {
  posts: WordPressPost[]
}

export function BlogPostListStructuredData({ posts }: BlogPostListStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Latest Articles from Base.Tube",
    "description": "Recent blog posts about Web3, content creation, and digital storytelling",
    "numberOfItems": posts.length,
    "itemListElement": posts.slice(0, 10).map((post, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://base.tube/blog/${post.slug}`,
      "name": getCleanTitle(post)
    }))
  }

  return (
    <Script
      id="blog-list-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

