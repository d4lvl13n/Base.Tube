'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import NavBar from '@/components/v2/NavBar';
import Footer from '@/components/v2/Footer';
import {
  WordPressPost,
  getFeaturedImageUrl,
  getCleanTitle,
  getCleanExcerpt,
  formatDate,
  getCategories,
} from '@/lib/wordpress';

const POSTS_PER_PAGE = 12;

interface BlogListProps {
  posts: WordPressPost[];
}

export default function BlogList({ posts }: BlogListProps) {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const featuredPost = posts[0] ?? null;
  const gridPosts = posts.slice(1, visibleCount + 1);
  const hasMore = visibleCount + 1 < posts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  };

  return (
    <div className="v2-root">
      <div className="v2-grain" />
      <NavBar />
      <main>
        {/* Hero */}
        <section className="v2-blog-hero">
          <div className="v2-container">
            <p className="v2-label">The Blog</p>
            <h1 className="v2-blog-headline">
              Insights for the<br />
              <span>creator economy.</span>
            </h1>
            <p className="v2-blog-subhead">
              Guides, tools, and trends for YouTube, TikTok, and Instagram
              creators. Monetization strategies, AI workflows, and platform
              comparisons.
            </p>
          </div>
        </section>

        <div className="v2-sep" />

        {/* Featured Post */}
        {featuredPost && (
          <div className="v2-container">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={`/blog/${featuredPost.slug}`} className="v2-blog-feat">
                <div className="v2-blog-feat-img">
                  <Image
                    src={getFeaturedImageUrl(featuredPost)}
                    alt={getCleanTitle(featuredPost)}
                    fill
                    className="v2-blog-feat-img-el"
                    priority
                    sizes="(max-width: 768px) 100vw, 1100px"
                  />
                </div>
                <div className="v2-blog-feat-overlay" />
                <div className="v2-blog-feat-body">
                  <div className="v2-blog-feat-eyebrow">
                    {getCategories(featuredPost)[0]?.name ?? 'Featured'}
                  </div>
                  <div className="v2-blog-feat-title">
                    {getCleanTitle(featuredPost)}
                  </div>
                  <div className="v2-blog-feat-excerpt">
                    {getCleanExcerpt(featuredPost).slice(0, 160)}
                    {getCleanExcerpt(featuredPost).length > 160 ? '…' : ''}
                  </div>
                  <div className="v2-blog-feat-meta">
                    <span>{formatDate(featuredPost.date)}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        )}

        {/* Post Grid */}
        <section className="v2-blog-grid-section">
          <div className="v2-container">
            <div className="v2-blog-grid">
              {gridPosts.map((post, i) => {
                const categories = getCategories(post);
                const excerpt = getCleanExcerpt(post);

                return (
                  <motion.div
                    key={post.id}
                    className="v2-blog-card"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: (i % 3) * 0.07,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link href={`/blog/${post.slug}`} className="v2-blog-card-link">
                      <div className="v2-blog-card-img-wrap">
                        <Image
                          src={getFeaturedImageUrl(post)}
                          alt={getCleanTitle(post)}
                          fill
                          className="v2-blog-card-img-el"
                          sizes="(max-width: 560px) 100vw, (max-width: 768px) 50vw, 33vw"
                        />
                      </div>
                      <div className="v2-blog-card-body">
                        {categories.length > 0 && (
                          <span className="v2-blog-card-cat">
                            {categories[0].name}
                          </span>
                        )}
                        <div className="v2-blog-card-title">
                          {getCleanTitle(post)}
                        </div>
                        <div className="v2-blog-card-excerpt">
                          {excerpt.slice(0, 100)}
                          {excerpt.length > 100 ? '…' : ''}
                        </div>
                        <div className="v2-blog-card-meta">
                          <span>{formatDate(post.date)}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {hasMore && (
              <div className="v2-blog-load-more">
                <button className="v2-btn v2-btn-ghost" onClick={handleLoadMore}>
                  Load more articles
                </button>
              </div>
            )}
          </div>
        </section>

        <div className="v2-sep" />

        {/* CTA */}
        <section className="v2-blog-cta">
          <span className="v2-blog-cta-eyebrow">Join the platform</span>
          <h2 className="v2-blog-cta-headline">
            Ready to build your creator economy?
          </h2>
          <a
            href="https://beta.base.tube/sign-up"
            className="v2-btn v2-btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Early Access →
          </a>
        </section>
      </main>

      <div className="v2-sep" />
      <Footer />
    </div>
  );
}
