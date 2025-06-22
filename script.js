gsap.registerPlugin(ScrollTrigger);

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".slide-header",
    start: "top center",
    end: "bottom center",
    scrub: true,
  },
});

gsap.to(".slide-header-content", {
  scrollTrigger: {
    trigger: ".slide-header",
    end: "bottom center",
    scrub: true,
    pin: true,
  },
  opacity: 0,
});

gsap.from(".slide-1-content", {
  scrollTrigger: {
    trigger: ".slide-1",
    start: "top top",
    end: "bottom 10%",
    scrub: true,
    pin: true,
  },
  scale: 0.5,
  opacity: 0,
});

gsap
  .timeline({
    scrollTrigger: {
      trigger: ".slide-2",
      start: "top bottom",
      end: "top center",
      scrub: true,
    },
  })
  .fromTo(
    ".slide-1-content",
    {
      opacity: 1,
    },
    {
      opacity: 0,
    }
  );

gsap.from(".slide-2", {
  scrollTrigger: {
    trigger: ".slide-2",
    start: "top top",
    end: "bottom 10%",
    scrub: true,
    pin: true,
  },
  opacity: 0,
});

gsap
  .timeline({
    scrollTrigger: {
      trigger: ".slide-3",
      start: "top 95%",
      end: "top center",
      scrub: true,
    },
  })
  .fromTo(
    ".slide-2",
    {
      opacity: 1,
    },
    { opacity: 0 }
  );

const splitTypes = document.querySelectorAll(".split-text");
splitTypes.forEach((word, i) => {
  const text = new SplitType(word, { types: "words" });

  gsap.from(text.words, {
    scrollTrigger: {
      trigger: word,
      start: "top 25%",
      end: "bottom top",
      scrub: true,
      markers: false,
    },
    y: 20,
    opacity: 0,
    stagger: 0.1,
  });
});

const contentContainers = gsap.utils.toArray(".content-container");
contentContainers.forEach((cc) => {
  gsap.from(cc, {
    scrollTrigger: {
      trigger: cc,
      start: "top 90%",
      end: "top 60%",
      scrub: true,
    },
    ease: "none",
    xPercent: -100,
    opacity: 0.5,
  });
});

const splitInfoTypes = document.querySelectorAll(".split-info-section");
splitInfoTypes.forEach((word, i) => {
  const text = new SplitType(word, { types: "words" });

  gsap.from(text.words, {
    scrollTrigger: {
      trigger: word,
      start: "top 70%",
      end: "top center",
      scrub: true,
      markers: false,
    },
    y: 20,
    opacity: 0,
    stagger: 0.1,
  });
});

// Replace with this simple smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Scroll Progress Bar
window.addEventListener('scroll', function() {
  const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
  const scrollProgress = (window.pageYOffset / scrollTotal) * 100;
  document.getElementById('progress-bar').style.width = scrollProgress + '%';
});

// Mega Menu Functionality
const megaMenuIcon = document.getElementById('menu-icon');
const megaMenu = document.getElementById('mega-menu');
const menuItems = megaMenu.querySelectorAll('nav ul li a');

function toggleMenu() {
  megaMenuIcon.classList.toggle('active');
  megaMenu.classList.toggle('active');
  document.body.classList.toggle('menu-open');
}

megaMenuIcon.addEventListener('click', toggleMenu);

// Close menu when clicking on a menu item
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    toggleMenu();
  });
});

// Close the mega menu by clicking outside it
document.addEventListener('click', (event) => {
  if (!megaMenu.contains(event.target) && !megaMenuIcon.contains(event.target) && megaMenu.classList.contains('active')) {
    toggleMenu();
  }
});

// Add escape key functionality to close the menu
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && megaMenu.classList.contains('active')) {
    toggleMenu();
  }
});

// Optional: Add smooth scrolling for anchor links
menuItems.forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  });
});

// Header animation
let lastScrollTop = 0;
const header = document.querySelector('header');
const logoContainer = document.querySelector('.logo-container');
const headerMenuIcon = document.querySelector('.menu-icon');

function updateHeaderOnScroll() {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  let scrollProgress = Math.min(scrollTop / 200, 1); // Adjust 200 to control animation speed

  if (scrollTop > 50) { // Show header after scrolling 50px
    header.classList.add('header-visible');
    header.classList.remove('header-hidden');

    // Move logo from left to center
    let logoPosition = Math.min(50, 20 + (30 * scrollProgress));
    logoContainer.style.left = `${logoPosition}%`;
  } else {
    header.classList.remove('header-visible');
    header.classList.add('header-hidden');

    // Reset logo to left
    logoContainer.style.left = '20%';
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}

window.addEventListener('scroll', updateHeaderOnScroll, false);

// Initial call to set the correct state on page load
updateHeaderOnScroll();

document.addEventListener('DOMContentLoaded', function() {
  const bubble = document.getElementById('subscriptionBubble');
  const form = bubble.querySelector('.subscription-form');
  const input = form.querySelector('input');
  const button = form.querySelector('button');

  // Initially hide the bubble
  bubble.style.display = 'none';

  // Function to check scroll position and show bubble
  function checkScrollPosition() {
    if (window.scrollY > 100) { // Adjust this value to change when the bubble appears
      bubble.style.display = 'block';
    } else {
      bubble.style.display = 'none';
      bubble.classList.remove('expanded');
    }
  }

  // Listen for scroll events
  window.addEventListener('scroll', checkScrollPosition);

  bubble.addEventListener('click', function(e) {
    if (!bubble.classList.contains('expanded')) {
      bubble.classList.add('expanded');
      input.focus();
      e.stopPropagation();
    }
  });

  document.addEventListener('click', function(e) {
    if (!bubble.contains(e.target) && bubble.classList.contains('expanded')) {
      bubble.classList.remove('expanded');
    }
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
      // Here you would typically send the email to your server
      alert('Thank you for subscribing!');
      input.value = '';
      bubble.classList.remove('expanded');
    }
  });

  // Initial check in case the page is loaded scrolled down
  checkScrollPosition();
});

function initCTAAnimation() {
  const ctaSection = document.querySelector('.section--CTA');
  if (!ctaSection) return;

  const ctaElements = ctaSection.querySelectorAll('.cta-title, .cta-description, .cta-button');

  gsap.from(ctaElements, {
    opacity: 0,
    y: 20,
    duration: 0.5,
    stagger: 0,
    scrollTrigger: {
      trigger: ctaSection,
      start: 'top bottom',
      end: 'top center',
      toggleActions: 'play none none none',
      once: true,
    }
  });
}

// Replace this:
/*
gsap.onLoad(() => {
  initCTAAnimation();
});
*/

// With this:
document.addEventListener('DOMContentLoaded', () => {
  initCTAAnimation();
});

// Holographic card effects
document.addEventListener('DOMContentLoaded', () => {
  if (typeof VanillaTilt === 'undefined') {
    console.error('VanillaTilt is not loaded');
    return;
  }

  document.querySelectorAll('.holo-card').forEach(card => {
    try {
      // Initialize vanilla-tilt
      VanillaTilt.init(card, {
        max: 10,
        speed: 400,
        glare: true,
        'max-glare': 0.3,
        scale: 1.05
      });

      // Custom mouse tracking for radial gradient
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });

      // Glitch effect on hover
      card.addEventListener('mouseenter', () => {
        const glitchElements = card.querySelectorAll('.glitch-effect');
        glitchElements.forEach((el, i) => {
          el.style.opacity = '0.1';
          el.style.animationDelay = `${i * 0.1}s`;
        });
      });

      card.addEventListener('mouseleave', () => {
        const glitchElements = card.querySelectorAll('.glitch-effect');
        glitchElements.forEach(el => {
          el.style.opacity = '0';
        });
      });
    } catch (error) {
      console.error('Error initializing card:', error);
    }
  });
});

// Intersection Observer for card reveal animations
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px'
};

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0) rotate(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.holo-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(50px) rotate(2deg)';
  card.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
  cardObserver.observe(card);
});

// Add mouse tracking for halo effect
document.querySelectorAll('.holo-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / card.clientWidth) * 100;
    const y = ((e.clientY - rect.top) / card.clientHeight) * 100;
    
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});

/* Add this to your JavaScript */
const createParticles = () => {
  // Create floating particles effect
};

function initGlitchEffect() {
  const glitchText = document.querySelector('.glitch');
  
  // Random intense glitch effect
  function triggerIntenseGlitch() {
    glitchText.style.animation = 'none';
    void glitchText.offsetWidth; // Trigger reflow
    glitchText.style.animation = null;
    
    // Add intense glitch class temporarily
    glitchText.classList.add('intense-glitch');
    setTimeout(() => {
      glitchText.classList.remove('intense-glitch');
    }, 200);
  }
  
  // Trigger random intense glitches
  setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance of intense glitch
      triggerIntenseGlitch();
    }
  }, 2000);
}

// Call this after DOM is loaded
document.addEventListener('DOMContentLoaded', initGlitchEffect);