// Initialize GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Scroll Progress Bar
window.addEventListener('scroll', function () {
  const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
  const scrollProgress = (window.pageYOffset / scrollTotal) * 100;
  document.getElementById('progress-bar').style.width = scrollProgress + '%';
}, { passive: true });

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
  item.addEventListener('click', toggleMenu);
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

// Header animation
const header = document.querySelector('header');
const logoContainer = document.querySelector('.logo-container');

function updateHeaderOnScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollProgress = Math.min(scrollTop / 200, 1);

  if (scrollTop > 50) {
    header.classList.add('header-visible');
    header.classList.remove('header-hidden');
    logoContainer.style.left = `${Math.min(50, 20 + (30 * scrollProgress))}%`;
  } else {
    header.classList.remove('header-visible');
    header.classList.add('header-hidden');
    logoContainer.style.left = '20%';
  }
}

window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
updateHeaderOnScroll(); // Initial call

// Blog-specific animations

// Animate hero section
gsap.from(".blog-hero", {
  opacity: 0,
  y: 50,
  duration: 1,
  scrollTrigger: {
    trigger: ".blog-hero",
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse"
  }
});

// Animate post cards
gsap.utils.toArray(".post-card").forEach(card => {
  gsap.from(card, {
    opacity: 0,
    y: 50,
    duration: 0.8,
    scrollTrigger: {
      trigger: card,
      start: "top 90%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    }
  });
});

// Animate newsletter signup
gsap.from(".newsletter-signup", {
  opacity: 0,
  y: 50,
  duration: 1,
  scrollTrigger: {
    trigger: ".newsletter-signup",
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse"
  }
});

// Split text animations
document.querySelectorAll(".split-text").forEach(word => {
  const text = new SplitType(word, { types: "words,chars" });

  gsap.from(text.chars, {
    opacity: 0,
    y: 20,
    duration: 0.7,
    stagger: 0.02,
    scrollTrigger: {
      trigger: word,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    }
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    lenis.scrollTo(target);
  });
});

// Intersection Observer for fade-in effect
const fadeElems = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

fadeElems.forEach(elem => observer.observe(elem));

// Add a simple parallax effect to post images
gsap.utils.toArray(".post-image").forEach(image => {
  gsap.to(image, {
    yPercent: 20,
    ease: "none",
    scrollTrigger: {
      trigger: image,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
});

// Newsletter subscription functionality
document.addEventListener('DOMContentLoaded', function () {
  const bubble = document.getElementById('subscriptionBubble');
  const bubbleIcon = bubble.querySelector('.bubble-icon');
  const form = bubble.querySelector('.subscription-form');

  bubbleIcon.addEventListener('click', function () {
    bubble.classList.toggle('open');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value;
    // Here you would typically send the email to your server or newsletter service
    alert('Thank you for subscribing!');
    form.reset();
    bubble.classList.remove('open');
  });
});

// Optional: Add a "back to top" button
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '↑';
backToTopButton.className = 'back-to-top';
document.body.appendChild(backToTopButton);

backToTopButton.addEventListener('click', () => {
  lenis.scrollTo('top');
});

gsap.from(backToTopButton, {
  opacity: 0,
  y: 20,
  duration: 0.3,
  scrollTrigger: {
    trigger: "body",
    start: "top -20%",
    end: "bottom 100%",
    toggleActions: "play none none reverse"
  }
});
