/**
 * HeartGlowAI Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize page elements
  initLearnWithAI();
  initSmoothScrolling();
  
  // Initialize Learn with AI button functionality
  function initLearnWithAI() {
    const learnWithAiBtn = document.getElementById('learn-with-ai-btn');
    
    if (learnWithAiBtn) {
      console.log('Learn with AI button found - adding click analytics');
      
      // Add analytics tracking (if applicable)
      learnWithAiBtn.addEventListener('click', function(e) {
        // Don't prevent default behavior - let the link navigate
        console.log('Learn with AI button clicked');
        
        // Optional: Track the event if analytics is available
        if (typeof gtag === 'function') {
          gtag('event', 'click', {
            'event_category': 'navigation',
            'event_label': 'learn_with_ai_button'
          });
        }
      });
    }
  }
  
  // Add smooth scrolling to all links
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Only apply smooth scrolling to page anchors, not external links
        if (href.startsWith('#') && href.length > 1) {
          e.preventDefault();
          
          const targetElement = document.querySelector(href);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
  }
  
  // Handle responsive navigation 
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      const nav = document.querySelector('.main-nav');
      nav.classList.toggle('active');
      
      // Toggle between menu and close icons
      const isOpen = nav.classList.contains('active');
      this.innerHTML = isOpen ? '✕' : '☰';
    });
  }
  
  // Add animation to elements when they come into view
  const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .cta-content');
  
  // Create intersection observer
  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after animation is triggered
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });
    
    // Observe each element
    animatedElements.forEach(el => {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    animatedElements.forEach(el => {
      el.classList.add('visible');
    });
  }
}); 