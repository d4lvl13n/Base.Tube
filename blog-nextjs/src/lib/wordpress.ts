// WordPress API configuration
// TODO: Update this when WordPress is properly configured
const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'http://wp.base.tube/wp/wp-json/wp/v2';

// Types for WordPress API response
export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  format: string;
  categories: number[];
  tags: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}

// Fetch all posts for static generation
export async function getAllPosts(page: number = 1, perPage: number = 100): Promise<WordPressPost[]> {
  try {
    const url = `${WP_API_URL}/posts?page=${page}&per_page=${perPage}&_embed=1&status=publish`;
    console.log('Fetching posts from:', url);
    
    const response = await fetch(url, {
      // Add caching for better performance
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      console.error(`Failed to fetch posts: ${response.status} - ${response.statusText}`);
      console.error('Response URL:', response.url);
      // Return empty array instead of throwing
      return [];
    }

    const posts: WordPressPost[] = await response.json();
    console.log(`Fetched ${posts.length} posts`);
    console.log('Sample post structure:', posts[0] ? {
      id: posts[0].id,
      title: posts[0].title.rendered,
      featured_media: posts[0].featured_media,
      has_embedded: !!posts[0]._embedded
    } : 'No posts found');
    
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// Fetch a single post by slug
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    const url = `${WP_API_URL}/posts?slug=${slug}&_embed=1&status=publish`;
    console.log('Fetching post by slug from:', url);
    
    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error(`Failed to fetch post: ${response.status} - ${response.statusText}`);
      console.error('Response URL:', response.url);
      return null;
    }

    const posts: WordPressPost[] = await response.json();
    const post = posts[0] || null;
    
    if (post) {
      console.log('Found post:', {
        id: post.id,
        title: post.title.rendered,
        featured_media: post.featured_media,
        has_embedded: !!post._embedded
      });
    } else {
      console.log('No post found with slug:', slug);
    }
    
    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// Get all post slugs for static generation
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const posts = await getAllPosts();
    return posts.map(post => post.slug);
  } catch (error) {
    console.error('Error fetching post slugs:', error);
    return [];
  }
}

// Helper function to get featured image URL
export function getFeaturedImageUrl(post: WordPressPost): string {
  // Debug logging
  console.log('Post ID:', post.id);
  console.log('Featured media ID:', post.featured_media);
  console.log('Embedded data:', post._embedded);
  
  // Check if embedded media exists
  if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    const imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
    console.log('Featured image URL:', imageUrl);
    return imageUrl;
  }
  
  // If no embedded media but featured_media ID exists, construct URL
  if (post.featured_media && post.featured_media > 0) {
    // This would require a separate API call to get the media
    console.log('Featured media ID found but no embedded data');
  }
  
  console.log('Using fallback image');
  return '/images/og-card.webp'; // Fallback image - using existing image
}

// Helper function to get clean excerpt
export function getCleanExcerpt(post: WordPressPost): string {
  return post.excerpt.rendered.replace(/<[^>]*>/g, '').trim();
}

// Helper function to format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
} 