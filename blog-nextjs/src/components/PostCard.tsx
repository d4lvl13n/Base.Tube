'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { WordPressPost, getFeaturedImageUrl, getCleanExcerpt, formatDate } from '@/lib/wordpress';

interface PostCardProps {
  post: WordPressPost;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const [imageError, setImageError] = useState(false);
  const featuredImage = getFeaturedImageUrl(post);
  const excerpt = getCleanExcerpt(post);
  const formattedDate = formatDate(post.date);

  const handleImageError = () => {
    console.error('Image failed to load:', featuredImage);
    setImageError(true);
  };

  const ImageComponent = () => (
    <Image
      src={imageError ? '/images/og-card.webp' : featuredImage}
      alt={post.title.rendered}
      width={featured ? 600 : 400}
      height={featured ? 300 : 200}
      className="post-image"
      loading="lazy"
      onError={handleImageError}
      style={featured ? {} : { width: '100%', height: '200px', objectFit: 'cover' }}
    />
  );

  if (featured) {
    return (
      <article className="post-card featured">
        <ImageComponent />
        
        <div className="post-content">
          <div className="post-meta">{formattedDate}</div>
          
          <h2 className="post-title">
            <Link href={`/blog/${post.slug}`}>
              {post.title.rendered}
            </Link>
          </h2>
          
          {excerpt && (
            <p className="post-excerpt">{excerpt}</p>
          )}
          
          <Link href={`/blog/${post.slug}`} className="read-more">
            Read More
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="post-card">
      <ImageComponent />
      
      <div className="post-content">
        <div className="post-meta">{formattedDate}</div>
        
        <h2 className="post-title">
          <Link href={`/blog/${post.slug}`}>
            {post.title.rendered}
          </Link>
        </h2>
        
        {excerpt && (
          <p className="post-excerpt">{excerpt}</p>
        )}
        
        <Link href={`/blog/${post.slug}`} className="read-more">
          Read More
        </Link>
      </div>
    </article>
  );
} 