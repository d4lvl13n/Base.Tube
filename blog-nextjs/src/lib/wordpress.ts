// WordPress API configuration
// TODO: Update this when WordPress is properly configured
const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://wp.base.tube/wp-json/wp/v2';

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
    } else {
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
  // Check if embedded media exists
  if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    const imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
    return imageUrl;
  }
  
  // If no embedded media but featured_media ID exists, construct URL
  if (post.featured_media && post.featured_media > 0) {
    // This would require a separate API call to get the media
    // For now, return fallback image
    return '/images/og-card.webp';
  }
  
  // Default fallback
  return '/images/og-card.webp'; // Fallback image - using existing image
}

// Helper function to decode HTML entities
function decodeHtmlEntities(text: string): string {
  const entities: { [key: string]: string } = {
    '&#038;': '&',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&#8217;': "'",
    '&#8216;': "'",
    '&#8220;': '"',
    '&#8221;': '"',
    '&#8211;': '–',
    '&#8212;': '—',
  };
  
  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  }
  
  return decoded;
}

// Helper function to get clean title
export function getCleanTitle(post: WordPressPost): string {
  return decodeHtmlEntities(post.title.rendered.trim());
}

// Helper function to get clean excerpt
export function getCleanExcerpt(post: WordPressPost): string {
  const rawExcerpt = post.excerpt.rendered.replace(/<[^>]*>/g, '').trim();
  return decodeHtmlEntities(rawExcerpt);
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

// Helper function to calculate reading time
export function calculateReadingTime(content: string): number {
  // Strip HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  // Count words (split by whitespace)
  const words = text.trim().split(/\s+/).length;
  // Average reading speed: 200-250 words per minute
  const wordsPerMinute = 225;
  const readingTime = Math.ceil(words / wordsPerMinute);
  // Minimum 1 minute
  return Math.max(1, readingTime);
}

// Helper function to get word count
export function getWordCount(content: string): number {
  const text = content.replace(/<[^>]*>/g, '');
  return text.trim().split(/\s+/).length;
}

// Helper function to get categories from embedded terms
export function getCategories(post: WordPressPost): Array<{ id: number; name: string; slug: string }> {
  if (post._embedded?.['wp:term']?.[0]) {
    return post._embedded['wp:term'][0].map(term => ({
      id: term.id,
      name: term.name,
      slug: term.slug,
    }));
  }
  return [];
}

// Helper function to get tags from embedded terms
export function getTags(post: WordPressPost): Array<{ id: number; name: string; slug: string }> {
  if (post._embedded?.['wp:term']?.[1]) {
    return post._embedded['wp:term'][1].map(term => ({
      id: term.id,
      name: term.name,
      slug: term.slug,
    }));
  }
  return [];
}

// Helper function to generate dynamic keywords from post content
export function generateKeywords(post: WordPressPost): string {
  const baseKeywords = ['Base.Tube', 'Web3', 'video sharing', 'content creation'];
  
  // Add categories as keywords
  const categories = getCategories(post);
  const categoryKeywords = categories.map(cat => cat.name);
  
  // Add tags as keywords
  const tags = getTags(post);
  const tagKeywords = tags.map(tag => tag.name);
  
  // Combine and deduplicate
  const allKeywords = [...new Set([...baseKeywords, ...categoryKeywords, ...tagKeywords])];
  
  return allKeywords.join(', ');
}

// Helper to get ISO date string
export function getISODate(dateString: string): string {
  return new Date(dateString).toISOString();
} 