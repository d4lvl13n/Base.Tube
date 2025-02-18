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
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', function() {
  const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
  const scrollProgress = (window.pageYOffset / scrollTotal) * 100;
  progressBar.style.width = scrollProgress + '%';
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

// Header animation
let lastScrollTop = 0;
const header = document.querySelector('header');
const logoContainer = document.querySelector('.logo-container');

function updateHeaderOnScroll() {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  let scrollProgress = Math.min(scrollTop / 200, 1);

  if (scrollTop > 50) {
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

// Animate post content
gsap.from(".post-content", {
  opacity: 0,
  y: 50,
  duration: 1,
  scrollTrigger: {
    trigger: ".post-content",
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse"
  }
});

// Split text animations
const splitTypes = document.querySelectorAll(".split-text");
splitTypes.forEach((word) => {
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

// Parallax effect for feature image
gsap.to(".parallax-image", {
  yPercent: 30,
  ease: "none",
  scrollTrigger: {
    trigger: ".post-feature-image",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    lenis.scrollTo(target);
  });
});

// Newsletter subscription functionality
document.addEventListener('DOMContentLoaded', function() {
  const bubble = document.getElementById('subscriptionBubble');
  const bubbleIcon = bubble.querySelector('.bubble-icon');
  const form = bubble.querySelector('.subscription-form');

  bubbleIcon.addEventListener('click', function() {
    bubble.classList.toggle('expanded');
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value;
    // Here you would typically send the email to your server or newsletter service
    console.log('Subscribing email:', email);
    alert('Thank you for subscribing!');
    form.reset();
    bubble.classList.remove('expanded');
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