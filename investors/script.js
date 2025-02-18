document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // GSAP Animations
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    // Animate sections on scroll with enhanced effects
    gsap.utils.toArray('.pitch-section').forEach((section, i) => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 20%',
                toggleActions: 'play none none reverse'
            }
        });

        tl.from(section.querySelectorAll('.title, .subtitle'), {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.2
        })
        .from(section.querySelectorAll('.stat-item, .problem-item, .solution-item, .feature-item, .nft-features, .nft-benefits, .team-member'), {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.1
        }, '-=0.5');
    });

    // Enhanced stat number animation
    gsap.utils.toArray('.stat-number').forEach(stat => {
        let num = parseFloat(stat.getAttribute('data-value'));
        ScrollTrigger.create({
            trigger: stat,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(stat, {
                    duration: 2,
                    text: num,
                    snap: { text: 1 },
                    ease: 'power2.out'
                });
            }
        });
    });

    // 3D Chart for Growth Projections
    function createGrowthChart() {
        const container = document.getElementById('growthChart');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Create 3D bars for each year
        const data = [
            { year: 2025, users: 5 },
            { year: 2026, users: 20 },
            { year: 2028, users: 100 },
            { year: 2030, users: 275 }
        ];

        data.forEach((item, index) => {
            const geometry = new THREE.BoxGeometry(1, item.users / 10, 1);
            const material = new THREE.MeshPhongMaterial({ color: 0xfa7517 });
            const bar = new THREE.Mesh(geometry, material);
            bar.position.x = index * 2 - 3;
            bar.position.y = item.users / 20;
            scene.add(bar);
        });

        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(0, 10, 10);
        scene.add(light);

        camera.position.z = 15;

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
    }

    // Interactive Tokenomics Pie Chart
    function createTokenomicsChart() {
        const ctx = document.getElementById('tokenomicsChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Staking rewards', 'User rewards', 'Public sale', 'Creator funds', 'Strategic Sale', 'Marketing', 'Base.Tube foundation', 'Base.Tube team', 'Private Sale', 'Advisors'],
                datasets: [{
                    data: [18, 25, 3.5, 7.5, 18.5, 2.5, 18, 5.5, 2, 2.5],
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                        '#FF9F40', '#FF6384', '#C9CBCF', '#36A2EB', '#4BC0C0'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed}%`;
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }

    // Particle system background
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 100,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#ffffff"
            },
            shape: {
                type: "circle",
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: false,
            },
            move: {
                enable: true,
                speed: 0.5,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "bubble"
                },
                onclick: {
                    enable: true,
                    mode: "repulse"
                },
                resize: true
            },
            modes: {
                bubble: {
                    distance: 250,
                    size: 0,
                    duration: 2,
                    opacity: 0,
                    speed: 3
                },
                repulse: {
                    distance: 400,
                    duration: 0.4
                }
            }
        },
        retina_detect: true
    });

    // Parallax effect for background elements
    document.addEventListener("mousemove", parallax);
    function parallax(e) {
        document.querySelectorAll(".parallax-element").forEach(function(move) {
            var moving_value = move.getAttribute("data-value");
            var x = (e.clientX * moving_value) / 250;
            var y = (e.clientY * moving_value) / 250;
            move.style.transform = "translateX(" + x + "px) translateY(" + y + "px)";
        });
    }

    // Interactive roadmap with GSAP ScrollTrigger
    gsap.utils.toArray('.roadmap-item').forEach((item, index) => {
        gsap.from(item, {
            x: index % 2 === 0 ? -100 : 100,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
                end: "top 20%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // 3D Tilt effect for feature cards
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".feature-item"), {
            max: 25,
            speed: 400,
            glare: true,
            "max-glare": 0.5
        });
    }

    // Animated gradient background
    const gradientBg = document.createElement('div');
    gradientBg.classList.add('animated-gradient-bg');
    document.body.appendChild(gradientBg);

    gsap.to(gradientBg, {
        background: 'linear-gradient(270deg, #ff6b6b, #4ecdc4, #45b7d1, #f7c873)',
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "none",
        backgroundSize: "300% 300%"
    });

    // Typewriter effect for main title
    if (typeof Typewriter !== 'undefined') {
        new Typewriter('#main-title', {
            strings: ['Beyond Viewing', 'Beyond Sharing', 'Base.Tube'],
            autoStart: true,
            loop: true,
            deleteSpeed: 50
        });
    }

    // Lottie animation for key features
    const animationContainer = document.getElementById('lottie-container');
    if (animationContainer && typeof lottie !== 'undefined') {
        lottie.loadAnimation({
            container: animationContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'path/to/your/lottie/animation.json' // Replace with your Lottie animation file
        });
    }

    // Interactive 3D globe for market reach (using Three.js)
    function create3DGlobe() {
        const container = document.getElementById('globe-container');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const geometry = new THREE.SphereGeometry(5, 32, 32);
        const texture = new THREE.TextureLoader().load('path/to/earth-texture.jpg');
        const material = new THREE.MeshPhongMaterial({ map: texture });
        const globe = new THREE.Mesh(geometry, material);
        scene.add(globe);

        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(10, 10, 10);
        scene.add(light);

        camera.position.z = 15;

        function animate() {
            requestAnimationFrame(animate);
            globe.rotation.y += 0.005;
            renderer.render(scene, camera);
        }
        animate();
    }

    // Initialize all charts and 3D elements
    window.addEventListener('load', () => {
        createGrowthChart();
        createTokenomicsChart();
        create3DGlobe();
    });

    // Add a 'loader' to ensure all assets are loaded before revealing the content
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        gsap.to(loader, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                loader.style.display = 'none';
                document.body.classList.add('loaded');
            }
        });
    });

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
});