import Image from 'next/image';
import Link from 'next/link';
import NavBar from '@/components/v2/NavBar';
import Footer from '@/components/v2/Footer';
import ReadingProgress from '@/components/v2/blog/ReadingProgress';
import {
  WordPressPost,
  getFeaturedImageUrl,
  getCleanTitle,
  formatDate,
  calculateReadingTime,
  getCategories,
  getTags,
  sanitizeContent,
} from '@/lib/wordpress';

interface BlogArticleProps {
  post: WordPressPost;
  slug: string;
}

export default function BlogArticle({ post, slug }: BlogArticleProps) {
  const featuredImage = getFeaturedImageUrl(post);
  const cleanTitle = getCleanTitle(post);
  const formattedDate = formatDate(post.date);
  const readingTime = calculateReadingTime(post.content.rendered);
  const categories = getCategories(post);
  const tags = getTags(post);
  const postUrl = `https://base.tube/blog/${slug}`;

  const displayTags =
    tags.length > 0
      ? tags
      : categories.length > 0
      ? categories
      : [{ id: 1, name: 'Web3', slug: 'web3' }, { id: 2, name: 'Creator Economy', slug: 'creator-economy' }];

  return (
    <div className="v2-root">
      <div className="v2-grain" />
      <NavBar />

      <main>
        <ReadingProgress />

        {/* Article Header */}
        <header className="v2-article-header">
          {/* Breadcrumb */}
          <nav className="v2-article-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="v2-article-breadcrumb-sep" aria-hidden="true">›</span>
            <Link href="/blog">Blog</Link>
            <span className="v2-article-breadcrumb-sep" aria-hidden="true">›</span>
            <span>{cleanTitle}</span>
          </nav>

          {/* Category */}
          {categories.length > 0 && (
            <div className="v2-article-cat">{categories[0].name}</div>
          )}

          {/* Title */}
          <h1 className="v2-article-h1">{cleanTitle}</h1>

          {/* Meta */}
          <div className="v2-article-meta">
            <time dateTime={post.date}>{formattedDate}</time>
            <span className="v2-article-meta-sep">·</span>
            <span className="v2-article-meta-reading">{readingTime} min read</span>
          </div>
        </header>

        {/* Featured Image */}
        {featuredImage && (
          <div className="v2-article-feat-img">
            <Image
              src={featuredImage}
              alt={cleanTitle}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 900px"
            />
          </div>
        )}

        {/* Article Body */}
        <div className="v2-article-body">
          <article
            className="v2-prose"
            dangerouslySetInnerHTML={{ __html: sanitizeContent(post.content.rendered) }}
          />
        </div>

        {/* Article Footer */}
        <footer className="v2-article-footer">
          {/* Tags */}
          <div className="v2-article-tags">
            {displayTags.slice(0, 6).map((tag) => (
              <span key={tag.id} className="v2-article-tag">
                {tag.name}
              </span>
            ))}
          </div>

          {/* Share */}
          <div className="v2-article-share">
            <span className="v2-article-share-label">Share</span>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(cleanTitle)}&via=base_tube`}
              className="v2-article-share-btn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X (Twitter)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
              className="v2-article-share-btn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
              className="v2-article-share-btn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </footer>

        <div className="v2-sep" />

        {/* Article CTA */}
        <div className="v2-article-cta">
          <div className="v2-article-cta-box">
            <div className="v2-article-cta-title">
              Ready to build your creator economy?
            </div>
            <p className="v2-article-cta-sub">
              Join Base.Tube — keep 90%, earn from every resale.
            </p>
            <a
              href="https://beta.base.tube/sign-up"
              className="v2-btn v2-btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Early Access →
            </a>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="v2-article-back">
          <Link href="/blog" className="v2-article-back-link">
            ← Back to Blog
          </Link>
        </div>
      </main>

      <div className="v2-sep" />
      <Footer />
    </div>
  );
}
