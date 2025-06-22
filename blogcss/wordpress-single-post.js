// WordPress REST API Integration for Single Posts
const WP_API_URL = 'https://base.tube/wp/wp-json/wp/v2';

// Get URL parameters
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const pathSegments = window.location.pathname.split('/');
  
  return {
    id: params.get('id'),
    slug: params.get('slug') || pathSegments[pathSegments.length - 1] || pathSegments[pathSegments.length - 2]
  };
}

// Fetch single post from WordPress
async function fetchSinglePost(identifier) {
  try {
    let url;
    // If identifier is a number, fetch by ID, otherwise fetch by slug
    if (!isNaN(identifier) && identifier !== '') {
      url = `${WP_API_URL}/posts/${identifier}?_embed`;
    } else {
      url = `${WP_API_URL}/posts?slug=${identifier}&_embed`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch post');
    
    const data = await response.json();
    // If fetching by slug, the response is an array
    const post = Array.isArray(data) ? data[0] : data;
    
    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// Get featured image URL
function getFeaturedImage(post) {
  if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }
  // Return a default image if no featured image
  return '/img/basetube-logo.png';
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Render single post
async function renderSinglePost() {
  const { id, slug } = getUrlParams();
  
  if (!id && !slug) {
    // If no ID or slug in URL, redirect to blog page
    window.location.href = '/blog/';
    return;
  }
  
  // Use ID if available, otherwise use slug
  const identifier = id || slug;
  const post = await fetchSinglePost(identifier);
  
  if (!post) {
    document.querySelector('.post-main').innerHTML = `
      <div class="error-message">
        <h2>Post not found</h2>
        <p>The post you're looking for doesn't exist.</p>
        <a href="/blog/" class="cta-button primary-button">Back to Blog</a>
      </div>
    `;
    return;
  }
  
  // Update page title
  document.title = `${post.title.rendered} - Base.Tube Blog`;
  
  // Update post title
  const postTitle = document.querySelector('.post-title');
  if (postTitle) {
    postTitle.innerHTML = post.title.rendered;
  }
  
  // Update post meta
  const postMeta = document.querySelector('.post-meta');
  if (postMeta) {
    postMeta.innerHTML = `Published on ${formatDate(post.date)}`;
  }
  
  // Update featured image
  const featuredImage = document.querySelector('.post-feature-image img');
  if (featuredImage) {
    featuredImage.src = getFeaturedImage(post);
    featuredImage.alt = post.title.rendered;
  }
  
  // Update post content
  const postBody = document.querySelector('.post-body');
  if (postBody) {
    postBody.innerHTML = post.content.rendered;
  }
  
  // Fetch related posts
  fetchRelatedPosts(post.categories[0]);
}

// Fetch related posts
async function fetchRelatedPosts(categoryId) {
  try {
    const response = await fetch(`${WP_API_URL}/posts?categories=${categoryId}&per_page=3&_embed`);
    const posts = await response.json();
    
    const relatedPostsList = document.querySelector('.related-posts ul');
    if (relatedPostsList && posts.length > 0) {
      relatedPostsList.innerHTML = posts.map(post => `
        <li><a href="/blog/${post.slug}">${post.title.rendered}</a></li>
      `).join('');
    }
  } catch (error) {
    console.error('Error fetching related posts:', error);
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderSinglePost);
} else {
  renderSinglePost();
} 