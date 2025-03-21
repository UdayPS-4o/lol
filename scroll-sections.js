// Scroll Sections JavaScript with GSAP and ScrollTrigger

// Debounce function to limit how often a function can run
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Throttle function to limit the rate at which a function is executed
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const context = this;
        const args = arguments;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load GSAP and ScrollTrigger dynamically
    const loadScripts = async () => {
        // Load GSAP Core
        const gsapScript = document.createElement('script');
        gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
        document.head.appendChild(gsapScript);
        
        // Wait for GSAP to load before loading ScrollTrigger
        await new Promise(resolve => gsapScript.onload = resolve);
        
        // Load ScrollTrigger plugin
        const scrollTriggerScript = document.createElement('script');
        scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
        document.head.appendChild(scrollTriggerScript);
        
        // Wait for ScrollTrigger to load before loading ScrollToPlugin
        await new Promise(resolve => scrollTriggerScript.onload = resolve);
        
        // Load ScrollToPlugin for smooth navigation
        const scrollToScript = document.createElement('script');
        scrollToScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollToPlugin.min.js';
        document.head.appendChild(scrollToScript);
        
        // Initialize after all plugins load
        scrollToScript.onload = initScrollSections;
    };
    
    // Initialize all scroll sections
    const initScrollSections = () => {
        // Register plugins
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        
        // Add smooth scrolling to the entire page with optimized settings
        gsap.config({
            autoSleep: 60,
            force3D: true,
            autoKill: true
        });
        
        // Set default ease for all animations
        gsap.defaults({
            ease: 'power2.out',
            overwrite: 'auto'
        });
        
        // Improve ScrollTrigger defaults
        ScrollTrigger.config({
            ignoreMobileResize: true,
            fastScrollEnd: true,
            preventOverlaps: true
        });
        
        // Initialize About Scroll Section
        initAboutScrollSection();
        
        // Initialize Vertical Scroll Section
        initVerticalScrollSection();
        
        // Initialize Features Scroll Section
        initFeaturesScrollSection();
        
        // Initialize Text Reveal Animations
        initTextRevealAnimations();
    };
    
    // About Section Horizontal Scroll
    const initAboutScrollSection = () => {
        const aboutSection = document.querySelector('.about-scroll-section');
        if (!aboutSection) return;
        
        const panels = gsap.utils.toArray('.about-panel');
        
        // Create horizontal scroll animation
        gsap.to('.about-scroll-panels', {
            xPercent: -100 * (panels.length - 1),
            ease: 'power1.inOut',
            scrollTrigger: {
                trigger: '.about-scroll-section',
                pin: true,
                scrub: 0.5,
                snap: {
                    snapTo: 1 / (panels.length - 1),
                    duration: {min: 0.1, max: 0.3},
                    delay: 0.1,
                    ease: 'power1.inOut'
                },
                start: 'top top',
                end: () => '+=' + (aboutSection.offsetWidth * (panels.length - 1)),
                anticipatePin: 1
            }
        });
        
        // Animate each panel's content
        panels.forEach((panel, i) => {
            const panelContent = panel.querySelector('.about-panel-content');
            
            ScrollTrigger.create({
                trigger: panel,
                containerAnimation: ScrollTrigger.getById('about-scroll'),
                start: 'left center',
                end: 'right center',
                onEnter: () => updateActivePanel(i),
                onEnterBack: () => updateActivePanel(i)
            });
        });
        
        // Update active panel indicator
        function updateActivePanel(index) {
            const dots = document.querySelectorAll('.about-scroll-indicator .scroll-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
    };
    
    // Features Section Scroll - Enhanced version inspired by myzscore.ai
    const initFeaturesScrollSection = () => {
        const featuresSection = document.querySelector('.features-scroll-section');
        if (!featuresSection) return;
        
        // Get elements
        const cards = gsap.utils.toArray('.feature-scroll-card');
        const cardsContainer = featuresSection.querySelector('.features-scroll-cards');
        const progressIndicator = featuresSection.querySelector('.features-progress-indicator');
        
        // Calculate total width for horizontal scrolling
        const totalWidth = cardsContainer.scrollWidth - window.innerWidth + 100;
        
        // Pin the features section with a longer duration for smoother scrolling
        ScrollTrigger.create({
            trigger: '.features-scroll-section',
            pin: true,
            start: 'top top',
            end: '+=400%',
            scrub: 0.5,
            anticipatePin: 1,
            onUpdate: (self) => {
                // Update progress bar
                if (progressIndicator) {
                    gsap.to(progressIndicator, {
                        width: `${self.progress * 100}%`,
                        duration: 0.1,
                        overwrite: true
                    });
                }
            }
        });
        
        // Create a timeline for the cards animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.features-scroll-section',
                start: 'top top',
                end: '+=400%',
                scrub: 0.5
            }
        });
        
        // Animate cards to move horizontally with a smooth ease
        tl.to('.features-scroll-cards', {
            x: () => -totalWidth,
            ease: 'power2.out'
        });
        
        // Add staggered entrance animation for cards
        gsap.set(cards, { opacity: 0, y: 30 });
        gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.features-scroll-section',
                start: 'top 80%',
            }
        });
        
        // Add scale and opacity effects to each card as they move into view
        cards.forEach((card, i) => {
            // Get the card index
            const index = card.getAttribute('data-index');
            
            // Create a timeline for each card
            const cardTl = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    containerAnimation: tl,
                    start: 'left center',
                    end: 'right center',
                    scrub: true,
                    onEnter: () => highlightActiveCard(index),
                    onEnterBack: () => highlightActiveCard(index)
                }
            });
        });
        
        // Function to highlight the active card
        function highlightActiveCard(index) {
            // Remove active class from all cards
            cards.forEach(card => {
                card.classList.remove('active');
            });
            
            // Add active class to current card
            if (cards[index]) {
                cards[index].classList.add('active');
            }
            
            // Update progress indicator if needed
            const progressSteps = featuresSection.querySelectorAll('.features-progress-step');
            if (progressSteps.length) {
                progressSteps.forEach((step, i) => {
                    step.classList.toggle('active', i <= index);
                });
            }
        }
    
    };
    
    // Vertical Scroll Section
    const initVerticalScrollSection = () => {
        const verticalScrollSection = document.querySelector('.vertical-scroll-section');
        if (!verticalScrollSection) return;
        
        // Get elements
        const cards = gsap.utils.toArray('.vertical-scroll-card');
        const aboutBoxes = gsap.utils.toArray('.about-box');
        const scrollContent = verticalScrollSection.querySelector('.vertical-scroll-content');
        const dots = verticalScrollSection.querySelectorAll('.vertical-scroll-dot');
        
        // Create simplified parallax effect for background with will-change optimization
        const verticalBg = document.querySelector('.vertical-scroll-section');
        if (verticalBg) {
            verticalBg.style.willChange = 'background-position';
            
            gsap.to('.vertical-scroll-section', {
                backgroundPosition: '0% 100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: '.vertical-scroll-section',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.8
                }
            });
        }
        
        // Pin the section
        ScrollTrigger.create({
            trigger: '.vertical-scroll-section',
            pin: true,
            start: 'top top',
            end: '+=250%',
            scrub: 0.5,
            anticipatePin: 1
        });
        
        // Create a timeline for the cards animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.vertical-scroll-section',
                start: 'top top',
                end: '+=300%',
                scrub: 0.5
            }
        });
        
        // Animate vertical scroll with improved easing
        tl.to('.vertical-scroll-content', {
            y: () => -(scrollContent.scrollHeight - verticalScrollSection.offsetHeight),
            ease: 'power2.out'
        });
        
        // Animate each card as it comes into view
        cards.forEach((card, i) => {
            // Create a timeline for each card
            gsap.set(card, { opacity: 0, y: 30 });
            
            ScrollTrigger.create({
                trigger: card,
                containerAnimation: tl,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleClass: 'active',
                onEnter: () => updateActiveDot(i),
                onEnterBack: () => updateActiveDot(i)
            });
        });
        
        // Add click events to dots for navigation
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                // Calculate the scroll position
                const scrollPos = i * (scrollContent.scrollHeight / cards.length);
                
                // Animate to the position
                gsap.to(window, {
                    scrollTo: {
                        y: verticalScrollSection.offsetTop + (scrollPos / 3),
                        autoKill: false
                    },
                    duration: 1,
                    ease: 'power2.inOut'
                });
            });
        });
        
        // Function to update active dot
        function updateActiveDot(index) {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
    };
    
    // Start loading scripts
    // Function to handle text reveal animations with enhanced smoothness
    const initTextRevealAnimations = () => {
        const revealElements = document.querySelectorAll('.reveal-text');
        
        // Group elements by their parent container for staggered animations
        const containers = {};
        revealElements.forEach(element => {
            const parent = element.parentElement;
            const parentId = 'default';
            
            if (!containers[parentId]) {
                containers[parentId] = [];
            }
            containers[parentId].push(element);
        });
        
        // Process each container group
        Object.values(containers).forEach(elements => {
            // Create a timeline for each group
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: elements[0].parentElement,
                    start: 'top 85%',
                    end: 'top 15%',
                    toggleActions: 'play none none reverse',
                    once: false,
                    markers: false
                }
            });
            
            // Add each element to the timeline with staggered effect
            tl.fromTo(elements, 
                {
                    opacity: 0,
                    y: 40,
                    scale: 0.95,
                    filter: 'blur(5px)',
                    transformOrigin: 'center bottom'
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 1.2,
                    ease: 'power2.out',
                    stagger: {
                        amount: 0.6, // Total stagger time for all elements
                        ease: 'power1.in'
                    }
                }
            );
        });
        
        // For standalone elements not in containers
        const standaloneElements = Array.from(revealElements);
            
        if (standaloneElements.length > 0) {
            gsap.fromTo(standaloneElements,
                {
                    opacity: 0,
                    y: 30,
                    scale: 0.98,
                    filter: 'blur(3px)'
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 1,
                    ease: 'power2.out',
                    stagger: 0.15,
                    scrollTrigger: {
                        trigger: standaloneElements[0],
                        start: 'top 85%',
                        end: 'top 15%',
                        toggleActions: 'play none none reverse',
                        once: false
                    }
                }
            );
        }
    };
    
    loadScripts();
    
    // Handle window resize to refresh ScrollTrigger
    const handleResize = debounce(() => {
        ScrollTrigger.refresh(true);
    }, 250);
    
    // Throttle scroll events for better performance
    const handleScroll = throttle(() => {
        // This empty function helps reduce the number of scroll events processed
    }, 100);
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
});
