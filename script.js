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

/////////////////////////////////////////////
const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

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
  if (!ctaSection) return; // Exit if CTA section doesn't exist

  const ctaElements = ctaSection.querySelectorAll('.cta-title, .cta-description, .cta-button');

  gsap.from(ctaElements, {
    opacity: 0,
    y: 20,
    duration: 0.8,
    stagger: 0.2,
    scrollTrigger: {
      trigger: ctaSection,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
      once: false,
    }
  });
}

// Ensure GSAP is fully loaded before running the animation
gsap.onLoad(() => {
  initCTAAnimation();
});