import Link from 'next/link';
import Image from 'next/image';
import { WordPressPost, getFeaturedImageUrl, getCleanExcerpt, formatDate } from '@/lib/wordpress';

interface PostCardProps {
  post: WordPressPost;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const featuredImage = getFeaturedImageUrl(post);
  const excerpt = getCleanExcerpt(post);
  const formattedDate = formatDate(post.date);

  if (featured) {
    return (
      <article className="post-card featured">
        <Image
          src={featuredImage}
          alt={post.title.rendered}
          width={600}
          height={300}
          className="post-image"
          loading="lazy"
        />
        
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
      <Image
        src={featuredImage}
        alt={post.title.rendered}
        width={400}
        height={200}
        className="post-image"
        loading="lazy"
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
      />
      
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