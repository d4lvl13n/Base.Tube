// Client-side router for blog posts
class BlogRouter {
  constructor() {
    this.routes = {
      '/blog/': this.showBlogList,
      '/blog/:slug': this.showBlogPost
    };
    
    this.init();
  }

  init() {
    // Handle initial page load
    this.handleRoute();
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      this.handleRoute();
    });
    
    // Handle hash changes (fallback support)
    window.addEventListener('hashchange', () => {
      this.handleRoute();
    });
    
    // Handle clicks on blog links
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="/blog/"]') || e.target.closest('a[href^="/blog/"]')) {
        e.preventDefault();
        const link = e.target.matches('a') ? e.target : e.target.closest('a');
        this.navigateTo(link.href);
      }
    });
  }

  navigateTo(url) {
    // Update browser URL without page reload
    history.pushState(null, null, url);
    this.handleRoute();
  }

  handleRoute() {
    const path = window.location.pathname;
    const hash = window.location.hash.slice(1); // Remove the #
    
    // Check for hash-based routing (fallback)
    if (hash) {
      this.showBlogPost(hash);
      // Update URL to clean format
      history.replaceState(null, null, `/blog/${hash}`);
      return;
    }
    
    // Check if we're on a blog post page
    if (path.startsWith('/blog/') && path !== '/blog/') {
      const slug = path.replace('/blog/', '');
      if (slug) {
        this.showBlogPost(slug);
        return;
      }
    }
    
    // Default to blog list
    if (path === '/blog/' || path === '/blog') {
      this.showBlogList();
      return;
    }
  }

  showBlogList() {
    // Show blog listing page
    const blogMain = document.querySelector('.blog-main');
    const postMain = document.querySelector('.post-main');
    
    if (blogMain) {
      blogMain.style.display = 'block';
      // Trigger post loading if needed
      if (typeof renderPosts === 'function') {
        renderPosts();
      }
    }
    
    if (postMain) {
      postMain.style.display = 'none';
    }
    
    // Update page title
    document.title = 'Base.Tube Insights - Blog';
  }

  showBlogPost(slug) {
    // Show individual blog post
    const blogMain = document.querySelector('.blog-main');
    const postMain = document.querySelector('.post-main');
    
    if (blogMain) {
      blogMain.style.display = 'none';
    }
    
    if (postMain) {
      postMain.style.display = 'block';
      // Load the post content
      this.loadBlogPost(slug);
    } else {
      // If we're on the blog listing page, redirect to post template
      window.location.href = `/blog-post.html?slug=${slug}`;
    }
  }

  async loadBlogPost(slug) {
    const WP_API_URL = 'https://base.tube/wp/wp-json/wp/v2';
    
    try {
      const response = await fetch(`${WP_API_URL}/posts?slug=${slug}&_embed`);
      if (!response.ok) throw new Error('Failed to fetch post');
      
      const posts = await response.json();
      const post = posts[0];
      
      if (!post) {
        this.show404();
        return;
      }
      
      // Update page content
      this.renderPost(post);
      
    } catch (error) {
      console.error('Error loading post:', error);
      this.show404();
    }
  }

  renderPost(post) {
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
      const date = new Date(post.date);
      const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      postMeta.innerHTML = `Published on ${formattedDate}`;
    }
    
    // Update featured image
    const featuredImage = document.querySelector('.post-feature-image img');
    if (featuredImage && post._embedded && post._embedded['wp:featuredmedia']) {
      featuredImage.src = post._embedded['wp:featuredmedia'][0].source_url;
      featuredImage.alt = post.title.rendered;
    }
    
    // Update post content
    const postBody = document.querySelector('.post-body');
    if (postBody) {
      postBody.innerHTML = post.content.rendered;
    }
  }

  show404() {
    const postMain = document.querySelector('.post-main');
    if (postMain) {
      postMain.innerHTML = `
        <div class="error-message" style="text-align: center; padding: 3rem;">
          <h2>Post not found</h2>
          <p>The post you're looking for doesn't exist.</p>
          <a href="/blog/" class="cta-button primary-button" style="display: inline-block; padding: 1rem 2rem; background-color: #fa7517; color: white; text-decoration: none; border-radius: 5px;">Back to Blog</a>
        </div>
      `;
    }
  }
}

// Initialize router when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new BlogRouter();
  });
} else {
  new BlogRouter();
} 