import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/LandingLayout';
import SocialShareBar from '@/components/ui/SocialShareBar';
import ReadingProgressBar from '@/components/ui/ReadingProgressBar';
import TableOfContents from '@/components/ui/TableOfContents';
import RelatedArticles from '@/components/ui/RelatedArticles';
import NewsletterSignup from '@/components/ui/NewsletterSignup';
import { ArticleStructuredData, BreadcrumbStructuredData } from '@/components/seo/StructuredData';
import {
  getPostBySlug,
  getAllPostSlugs,
  getFeaturedImageUrl,
  getCleanTitle,
  getCleanExcerpt,
  getSeoTitle,
  getSeoDescription,
  formatDate,
  calculateReadingTime,
  generateKeywords,
  getCategories,
  getTags,
  sanitizeContent
} from '@/lib/wordpress';

// Generate static params for all posts
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for each post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: 'Post Not Found - Base.Tube Blog',
    };
  }

  const cleanTitle = getCleanTitle(post);
  const seoTitle = getSeoTitle(post);
  const seoDescription = getSeoDescription(post);
  const featuredImage = getFeaturedImageUrl(post);
  const dynamicKeywords = generateKeywords(post);
  const readingTime = calculateReadingTime(post.content.rendered);

  // Use RankMath meta description if available, otherwise optimize excerpt
  const metaDescription = seoDescription.length > 155
    ? seoDescription.slice(0, 155).trim() + '...'
    : seoDescription;

  // Use RankMath meta title if available (already optimized for SERP)
  // Layout template appends " | Base.Tube" automatically
  const pageTitle = post.meta?.rank_math_title
    ? seoTitle
    : cleanTitle;

  return {
    title: pageTitle,
    description: metaDescription,
    keywords: dynamicKeywords,
    authors: [{ name: 'Base.Tube Team', url: 'https://base.tube' }],
    openGraph: {
      title: seoTitle,
      description: metaDescription,
      type: 'article',
      url: `https://base.tube/blog/${resolvedParams.slug}`,
      siteName: 'Base.Tube',
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: ['Base.Tube Team'],
      section: getCategories(post)[0]?.name || 'Web3',
      tags: getTags(post).map(t => t.name),
      images: [
        {
          url: featuredImage.startsWith('http') ? featuredImage : `https://base.tube${featuredImage}`,
          width: 1200,
          height: 630,
          alt: cleanTitle,
          type: 'image/webp',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@base_tube',
      creator: '@base_tube',
      title: seoTitle,
      description: metaDescription,
      images: [featuredImage.startsWith('http') ? featuredImage : `https://base.tube${featuredImage}`],
    },
    alternates: {
      canonical: `https://base.tube/blog/${resolvedParams.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
    other: {
      'article:published_time': post.date,
      'article:modified_time': post.modified || post.date,
      'article:author': 'Base.Tube Team',
      'reading_time': `${readingTime} min`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const featuredImage = getFeaturedImageUrl(post);
  const cleanTitle = getCleanTitle(post);
  const formattedDate = formatDate(post.date);
  const postUrl = `https://base.tube/blog/${resolvedParams.slug}`;
  const readingTime = calculateReadingTime(post.content.rendered);
  const categories = getCategories(post);
  const tags = getTags(post);
  
  // Combine categories and tags for display, fallback to defaults
  const displayTags = tags.length > 0 
    ? tags 
    : categories.length > 0 
      ? categories 
      : [{ id: 1, name: 'Web3', slug: 'web3' }, { id: 2, name: 'Video Sharing', slug: 'video-sharing' }];

  // Breadcrumb items for structured data
  const breadcrumbItems = [
    { name: 'Home', url: 'https://base.tube' },
    { name: 'Blog', url: 'https://base.tube/blog' },
    { name: cleanTitle, url: postUrl },
  ];

  return (
    <Layout>
      {/* SEO Structured Data */}
      <ArticleStructuredData post={post} url={postUrl} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      
      {/* Reading Progress Bar */}
      <ReadingProgressBar />
      
      {/* Table of Contents */}
      <TableOfContents content={post.content.rendered} />
      
      {/* Social Share Bar */}
      <SocialShareBar
        url={postUrl}
        title={cleanTitle}
        description={getCleanExcerpt(post)}
      />
      
      {/* Hero Section with Featured Image */}
      <div className="post-hero">
        <div className="post-hero-image">
          <Image
            src={featuredImage}
            alt={cleanTitle}
            fill
            className="hero-image"
            priority
          />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="post-hero-content">
          {/* Semantic Breadcrumb Navigation */}
          <nav className="post-breadcrumb" aria-label="Breadcrumb">
            <ol itemScope itemType="https://schema.org/BreadcrumbList" style={{ display: 'contents' }}>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" style={{ display: 'inline' }}>
                <Link href="/" className="breadcrumb-link" itemProp="item">
                  <span itemProp="name">Home</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <span className="breadcrumb-separator" aria-hidden="true">→</span>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" style={{ display: 'inline' }}>
                <Link href="/blog" className="breadcrumb-link" itemProp="item">
                  <span itemProp="name">Blog</span>
                </Link>
                <meta itemProp="position" content="2" />
              </li>
              <span className="breadcrumb-separator" aria-hidden="true">→</span>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" style={{ display: 'inline' }}>
                <span className="breadcrumb-current" itemProp="name">Article</span>
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </nav>
          
          <h1 className="post-hero-title">{cleanTitle}</h1>
          
          {/* Author Box */}
          <div className="author-card" itemScope itemType="https://schema.org/Person">
            <div className="author-avatar">
              <Image
                src="/images/basetube-logo.png"
                alt="Base.Tube Team"
                width={60}
                height={60}
                className="avatar-image"
                itemProp="image"
              />
            </div>
            <div className="author-info">
              <div className="author-name" itemProp="name">Base.Tube Team</div>
              <div className="author-meta">
                <time className="publish-date" dateTime={post.date} itemProp="datePublished">
                  {formattedDate}
                </time>
                <span className="meta-separator">•</span>
                <span className="read-time">{readingTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Article Content */}
      <main className="post-article">
        <div className="article-container">
          {/* Post Content */}
          <article 
            className="article-content"
            itemScope 
            itemType="https://schema.org/Article"
            dangerouslySetInnerHTML={{ __html: sanitizeContent(post.content.rendered) }}
          />

          {/* Article Footer */}
          <footer className="article-footer">
            <div className="article-tags" role="list" aria-label="Article tags">
              {displayTags.slice(0, 5).map((tag) => (
                <span key={tag.id} className="tag" role="listitem">
                  {tag.name}
                </span>
              ))}
            </div>
            
            <div className="article-share">
              <span className="share-label">Share this article</span>
              <div className="share-buttons">
                <a 
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(cleanTitle)}&via=base_tube`} 
                  className="share-btn twitter" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Share on Twitter"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                  className="share-btn linkedin" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Share on LinkedIn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
                  className="share-btn facebook" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Share on Facebook"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </footer>

          {/* CTA Section */}
          <section className="article-cta" aria-labelledby="cta-headline">
            <div className="cta-content">
              <h2 id="cta-headline" className="cta-headline">Ready to Revolutionize Your Video Experience?</h2>
              <p className="cta-subtext">Join Base.Tube and be part of the future of content creation.</p>
              <div className="cta-actions">
                <a href="https://beta.base.tube/" className="cta-btn primary">
                  <span>Join our beta</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
                <a href="https://base-tube.gitbook.io/base.tube-documentation" className="cta-btn secondary" target="_blank" rel="noopener noreferrer">
                  <span>Learn More</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9 9h6v6M15 9l-6 6"/>
                  </svg>
                </a>
              </div>
            </div>
          </section>

          {/* Navigation */}
          <nav className="article-navigation" aria-label="Blog navigation">
            <Link href="/blog" className="nav-link back-to-blog">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>Back to Blog</span>
            </Link>
          </nav>
        </div>
      </main>
      
      {/* Related Articles */}
      <RelatedArticles 
        currentPostId={post.id}
        _currentPostSlug={resolvedParams.slug}
        maxArticles={3}
      />
      
      {/* Newsletter Signup */}
      <NewsletterSignup 
        title="Don't Miss Our Latest Insights"
        subtitle="Join our community of content creators and stay updated with the latest trends in Web3 and digital innovation"
        compact={true}
      />
    </Layout>
  );
}
