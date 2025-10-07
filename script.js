// Navigation functionality
let activeSection = '';

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu();
        }
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuBtn = document.getElementById('mobile-menu-btn');
    
    if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('show');
        menuBtn.innerHTML = `
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        `;
    } else {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('show');
        menuBtn.innerHTML = `
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
        `;
    }
}

// Update active navigation item based on scroll position
function updateActiveNavigation() {
    const sections = ['mission', 'vision', 'framework', 'community', 'commons', 'partnerships', 'join'];
    const scrollPosition = window.scrollY + 100;

    for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
            if (activeSection !== sections[i]) {
                // Remove active class from all nav items
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to current section's nav items
                document.querySelectorAll(`[onclick="scrollToSection('${sections[i]}')"]`).forEach(item => {
                    if (item.classList.contains('nav-item')) {
                        item.classList.add('active');
                    }
                });
                
                activeSection = sections[i];
            }
            break;
        }
    }
}

// Three.js Dotted Surface Animation
function initDottedSurface() {
    const container = document.getElementById('dotted-surface');
    if (!container) return;

    const SEPARATION = 150;
    const AMOUNTX = 40;
    const AMOUNTY = 60;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 1000, 3000); // Closer fog for more mist effect

    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        10000
    );
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color, 0);

    container.appendChild(renderer.domElement);

    // Create particles
    const positions = [];
    const colors = [];

    // Create geometry for all particles
    const geometry = new THREE.BufferGeometry();

    for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
            const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
            const y = 0; // Will be animated
            const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

            positions.push(x, y, z);
            // Dark theme colors (white dots)
            colors.push(200, 200, 200);
        }
    }

    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Create material
    const material = new THREE.PointsMaterial({
        size: 8,
        vertexColors: true,
        transparent: true,
        opacity: 0.6, // Reduced opacity for more faded effect
        sizeAttenuation: true,
        fog: true, // Enable fog interaction
    });

    // Create points object
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;

    // Animation function
    function animate() {
        requestAnimationFrame(animate);

        const positionAttribute = geometry.attributes.position;
        const positions = positionAttribute.array;

        let i = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                const index = i * 3;

                // Animate Y position with sine waves - SLOWER AND SMOOTHER
                positions[index + 1] =
                    Math.sin((ix + count) * 0.1) * 50 +  // Slower frequency
                    Math.sin((iy + count) * 0.15) * 50; // Slower frequency

                i++;
            }
        }

        positionAttribute.needsUpdate = true;
        renderer.render(scene, camera);
        count += 0.05; // SLOWER - reduced from 0.1 to 0.05
    }

    // Handle window resize
    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', handleResize);

    // Start animation
    animate();

    // Store cleanup function for potential future use
    window.cleanupDottedSurface = function() {
        window.removeEventListener('resize', handleResize);
        
        // Clean up Three.js objects
        scene.traverse((object) => {
            if (object instanceof THREE.Points) {
                object.geometry.dispose();
                if (Array.isArray(object.material)) {
                    object.material.forEach((material) => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });

        renderer.dispose();

        if (container && renderer.domElement) {
            container.removeChild(renderer.domElement);
        }
    };
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Initialize scroll listener for navigation
    window.addEventListener('scroll', updateActiveNavigation);

    // Initialize dotted surface animation
    initDottedSurface();

    // Initial navigation update
    updateActiveNavigation();
});

// Handle page visibility change to pause/resume animation when tab is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, could pause animation here if needed
    } else {
        // Page is visible again
    }
});
