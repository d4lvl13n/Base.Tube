'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WordPressPost, getPostsPage, getFeaturedImageUrl, getCleanTitle, getCleanExcerpt, formatDate } from '@/lib/wordpress';

interface RelatedArticlesProps {
  currentPostId: number;
  _currentPostSlug?: string;
  maxArticles?: number;
}

export default function RelatedArticles({ 
  currentPostId, 
  _currentPostSlug, 
  maxArticles = 3 
}: RelatedArticlesProps) {
  // Mark unused parameter as intentionally unused
  void _currentPostSlug;
  
  const [relatedPosts, setRelatedPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        setLoading(true);
        const allPosts = await getPostsPage(1, 20); // Get more posts to filter from
        
        // Filter out current post and get random selection
        const otherPosts = allPosts.filter(post => post.id !== currentPostId);
        
        // Simple related posts logic - you can enhance this with tags, categories, etc.
        const shuffled = otherPosts.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, maxArticles);
        
        setRelatedPosts(selected);
      } catch (error) {
        console.error('Error fetching related posts:', error);
        setRelatedPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [currentPostId, maxArticles]);

  if (loading) {
    return (
      <section className="related-articles">
        <div className="related-articles-container">
          <h2 className="related-articles-title">Related Articles</h2>
          <div className="related-articles-grid">
            {[...Array(maxArticles)].map((_, index) => (
              <div key={index} className="related-article-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-excerpt"></div>
                  <div className="skeleton-meta"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="related-articles">
      <div className="related-articles-container">
        <div className="related-articles-header">
          <h2 className="related-articles-title">
            <span className="title-icon">📚</span>
            Related Articles
          </h2>
          <p className="related-articles-subtitle">
            Continue your journey with these handpicked insights
          </p>
        </div>
        
        <div className="related-articles-grid">
          {relatedPosts.map((post, index) => {
            const featuredImage = getFeaturedImageUrl(post);
            const cleanTitle = getCleanTitle(post);
            const cleanExcerpt = getCleanExcerpt(post);
            const formattedDate = formatDate(post.date);

            return (
              <article key={post.id} className="related-article-card">
                <Link href={`/blog/${post.slug}`} className="related-article-link">
                  <div className="related-article-image">
                    <Image
                      src={featuredImage}
                      alt={cleanTitle}
                      fill
                      className="article-image"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                    />
                    <div className="article-overlay"></div>
                    <div className="article-number">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                  
                  <div className="related-article-content">
                    <div className="article-meta">
                      <span className="article-date">{formattedDate}</span>
                    </div>
                    
                    <h3 className="article-title">
                      {cleanTitle.length > 60 
                        ? cleanTitle.substring(0, 60) + '...' 
                        : cleanTitle
                      }
                    </h3>
                    
                    <p className="article-excerpt">
                      {cleanExcerpt.length > 120 
                        ? cleanExcerpt.substring(0, 120) + '...' 
                        : cleanExcerpt
                      }
                    </p>
                    
                    <div className="read-more-modern">
                      Read More →
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
        
        <div className="related-articles-footer">
          <Link href="/blog" className="view-all-articles">
            <span>View All Articles</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 
