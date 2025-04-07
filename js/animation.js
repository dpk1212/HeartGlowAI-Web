/**
 * HeartGlowAI - Animation utilities
 * Provides animations for various UI elements
 */

// Initialize animations when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Animation utilities loaded');
    initializeAnimations();
});

/**
 * Set up animations for UI elements
 */
function initializeAnimations() {
    // Animate welcome elements when they become visible
    animateOnScroll('.welcome-section', 'fadeInUp');
    
    // Animate cards with staggered delay
    animateCards();
    
    // Animate the brand logo with a pulse effect
    animateBrandLogo();
}

/**
 * Animate elements when they scroll into view
 * @param {string} selector - CSS selector for elements to animate
 * @param {string} animationClass - CSS animation class to apply
 */
function animateOnScroll(selector, animationClass) {
    const elements = document.querySelectorAll(selector);
    
    if (!elements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(animationClass);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Animate cards with a staggered delay
 */
function animateCards() {
    const cards = document.querySelectorAll('.starting-point-card, .config-card');
    
    if (!cards.length) return;
    
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
}

/**
 * Animate the brand logo with a pulse effect
 */
function animateBrandLogo() {
    const logo = document.querySelector('.brand-logo');
    
    if (!logo) return;
    
    // Add pulse animation on hover
    logo.addEventListener('mouseenter', () => {
        logo.classList.add('pulse');
    });
    
    logo.addEventListener('animationend', () => {
        logo.classList.remove('pulse');
    });
    
    // Initial animation
    setTimeout(() => {
        logo.classList.add('pulse');
    }, 1500);
}

/**
 * Add a fade-in animation to an element
 * @param {HTMLElement} element - The element to animate
 */
function fadeIn(element) {
    if (!element) return;
    
    element.style.opacity = '0';
    element.style.display = 'block';
    
    setTimeout(() => {
        element.style.transition = 'opacity 0.5s ease';
        element.style.opacity = '1';
    }, 10);
}

/**
 * Add a fade-out animation to an element
 * @param {HTMLElement} element - The element to animate
 * @param {Function} callback - Optional callback after animation completes
 */
function fadeOut(element, callback) {
    if (!element) return;
    
    element.style.transition = 'opacity 0.5s ease';
    element.style.opacity = '0';
    
    setTimeout(() => {
        element.style.display = 'none';
        if (typeof callback === 'function') {
            callback();
        }
    }, 500);
}

/**
 * Add a slide-down animation to an element
 * @param {HTMLElement} element - The element to animate
 */
function slideDown(element) {
    if (!element) return;
    
    // Get the element's height
    element.style.display = 'block';
    const height = element.scrollHeight;
    
    // Start the animation
    element.style.overflow = 'hidden';
    element.style.height = '0';
    element.style.opacity = '0';
    element.style.transition = 'height 0.5s ease, opacity 0.5s ease';
    
    setTimeout(() => {
        element.style.height = height + 'px';
        element.style.opacity = '1';
    }, 10);
    
    // Clean up after animation
    setTimeout(() => {
        element.style.height = '';
        element.style.overflow = '';
    }, 510);
}

/**
 * Add a slide-up animation to an element
 * @param {HTMLElement} element - The element to animate
 * @param {Function} callback - Optional callback after animation completes
 */
function slideUp(element, callback) {
    if (!element) return;
    
    const height = element.scrollHeight;
    
    // Start the animation
    element.style.overflow = 'hidden';
    element.style.height = height + 'px';
    element.style.transition = 'height 0.5s ease, opacity 0.5s ease';
    
    setTimeout(() => {
        element.style.height = '0';
        element.style.opacity = '0';
    }, 10);
    
    // Clean up after animation
    setTimeout(() => {
        element.style.display = 'none';
        if (typeof callback === 'function') {
            callback();
        }
    }, 510);
}

// Export animation functions for use in other scripts
window.HeartGlowAnimations = {
    fadeIn,
    fadeOut,
    slideDown,
    slideUp
}; 