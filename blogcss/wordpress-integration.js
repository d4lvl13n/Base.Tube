// WordPress REST API Integration
const WP_API_URL = 'https://base.tube/wp/wp-json/wp/v2';

// Fetch posts from WordPress
async function fetchPosts(page = 1, perPage = 10) {
  try {
    const response = await fetch(`${WP_API_URL}/posts?page=${page}&per_page=${perPage}&_embed`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    
    const posts = await response.json();
    const totalPages = response.headers.get('X-WP-TotalPages');
    
    return { posts, totalPages };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], totalPages: 0 };
  }
}

// Get featured image URL
function getFeaturedImage(post) {
  if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }
  // Return a default image if no featured image
  return '../img/basetube-logo.png';
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Create post card HTML
function createPostCard(post, isFeatured = false) {
  const featuredClass = isFeatured ? 'featured' : '';
  const imageUrl = getFeaturedImage(post);
  const excerpt = post.excerpt.rendered.replace(/<[^>]*>/g, ''); // Strip HTML tags
  
  return `
    <article class="post-card ${featuredClass}">
      <img src="${imageUrl}" alt="${post.title.rendered}" class="post-image" loading="lazy">
      <div class="post-content">
        <h2 class="post-title">${post.title.rendered}</h2>
        ${excerpt ? `<p class="post-excerpt">${excerpt}</p>` : ''}
        <a href="/blog/${post.slug}" class="read-more" data-post-id="${post.id}">Read More</a>
      </div>
    </article>
  `;
}

// Render posts to the page
async function renderPosts() {
  const { posts, totalPages } = await fetchPosts(1, 10);
  const featuredSection = document.querySelector('.featured-post');
  
  if (!featuredSection) return;
  
  // Clear existing content
  featuredSection.innerHTML = '';
  
  // Add posts
  posts.forEach((post, index) => {
    const isFeatured = index < 3; // First 3 posts are featured
    featuredSection.innerHTML += createPostCard(post, isFeatured);
  });
  
  // Add load more button if there are more pages
  if (totalPages > 1) {
    featuredSection.innerHTML += `
      <div class="load-more-container">
        <button class="load-more-btn" data-page="2">Load More Posts</button>
      </div>
    `;
    
    // Add click handler for load more
    const loadMoreBtn = document.querySelector('.load-more-btn');
    loadMoreBtn.addEventListener('click', loadMorePosts);
  }
}

// Load more posts
async function loadMorePosts(e) {
  const btn = e.target;
  const currentPage = parseInt(btn.dataset.page);
  
  btn.textContent = 'Loading...';
  btn.disabled = true;
  
  const { posts, totalPages } = await fetchPosts(currentPage, 10);
  
  // Insert new posts before the load more button
  const container = btn.closest('.featured-post');
  const loadMoreContainer = btn.closest('.load-more-container');
  
  posts.forEach(post => {
    const postHTML = createPostCard(post, false);
    loadMoreContainer.insertAdjacentHTML('beforebegin', postHTML);
  });
  
  // Update or remove load more button
  if (currentPage < totalPages) {
    btn.dataset.page = currentPage + 1;
    btn.textContent = 'Load More Posts';
    btn.disabled = false;
  } else {
    loadMoreContainer.remove();
  }
}

// Handle post link clicks (for single post pages)
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('read-more')) {
    e.preventDefault();
    const postId = e.target.dataset.postId;
    const slug = e.target.href.split('/').pop();
    
    // For now, we'll navigate to a single post page
    // You'll need to create a separate single-post.html template
    window.location.href = `/blog-post.html?id=${postId}&slug=${slug}`;
  }
});

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderPosts);
} else {
  renderPosts();
} 