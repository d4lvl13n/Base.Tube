// WordPress API configuration
// TODO: Update this when WordPress is properly configured
const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://base.tube/wp/wp-json/wp/v2';

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
    const response = await fetch(
      `${WP_API_URL}/posts?page=${page}&per_page=${perPage}&_embed&status=publish`,
      {
        // Add caching for better performance
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch posts: ${response.status} - ${response.statusText}`);
      // Return empty array instead of throwing
      return [];
    }

    const posts: WordPressPost[] = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// Fetch a single post by slug
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    const response = await fetch(
      `${WP_API_URL}/posts?slug=${slug}&_embed&status=publish`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch post: ${response.status} - ${response.statusText}`);
      return null;
    }

    const posts: WordPressPost[] = await response.json();
    return posts[0] || null;
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
  if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }
  return '/images/default-blog-image.jpg'; // Fallback image
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