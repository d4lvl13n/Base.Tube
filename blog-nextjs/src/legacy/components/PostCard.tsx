'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { WordPressPost, getFeaturedImageUrl, getCleanExcerpt, getCleanTitle, formatDate } from '@/lib/wordpress';

interface PostCardProps {
  post: WordPressPost;
}

export default function PostCard({ post }: PostCardProps) {
  const [imageError, setImageError] = useState(false);
  const featuredImage = getFeaturedImageUrl(post);
  const excerpt = getCleanExcerpt(post);
  const title = getCleanTitle(post);
  const formattedDate = formatDate(post.date);

  const handleImageError = () => {
    setImageError(true);
  };

  // Truncate title if too long
  const truncateTitle = (title: string, maxLength: number) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength).trim() + '...';
  };

  // Truncate excerpt if too long
  const truncateExcerpt = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <article className="post-card-modern">
      <Link href={`/blog/${post.slug}`} className="post-card-link">
        <div className="post-image-container">
          <Image
            src={imageError ? '/images/og-card.webp' : featuredImage}
            alt={title}
            fill
            className="post-image-modern"
            onError={handleImageError}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
          />
          <div className="post-image-overlay"></div>
        </div>
        
        <div className="post-content-modern">
          <div className="post-meta-modern">
            <span className="post-date">{formattedDate}</span>
          </div>
          
          <h3 className="post-title-modern">
            {truncateTitle(title, 60)}
          </h3>
          
          {excerpt && (
            <p className="post-excerpt-modern">
              {truncateExcerpt(excerpt, 120)}
            </p>
          )}
          
          <div className="read-more-modern">
            Read More →
          </div>
        </div>
      </Link>
    </article>
  );
} 