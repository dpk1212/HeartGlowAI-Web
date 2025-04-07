/**
 * HeartGlowAI - Message Configurator
 * Enhanced script for improved desktop and mobile functionality
 */

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    initMessageConfigurator();
    setupAccessibility();
    checkViewportAndAdjust();
    
    // Listen for window resize events to adjust layout
    window.addEventListener('resize', debounce(checkViewportAndAdjust, 250));
});

/**
 * Initialize the message configuration interface
 */
function initMessageConfigurator() {
    console.log('Initializing message configurator...');
    
    // Set up context buttons
    setupContextButtons();
    
    // Set up starting point cards
    setupStartingPointCards();
    
    // Set up navigation buttons
    setupNavigationButtons();
    
    // Load saved data if available
    loadSavedConfigurations();
    
    // Initialize progress indicator
    updateProgressIndicator(1);
}

/**
 * Set up the context selection buttons with proper events
 */
function setupContextButtons() {
    const contextButtons = document.querySelectorAll('.context-btn');
    
    contextButtons.forEach(button => {
        // Add click handler
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            contextButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Save the selected context
            const selectedContext = this.getAttribute('data-context');
            saveConfiguration('messageCategory', selectedContext);
            
            // Enable the next button if not already enabled
            enableNavigationButton('next-btn');
            
            // Update UI based on selection
            updateStartingPointsBasedOnContext(selectedContext);
        });
        
        // Add keyboard support
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Set up the starting point selection cards with proper events
 */
function setupStartingPointCards() {
    const startingPointCards = document.querySelectorAll('.starting-point-card');
    
    startingPointCards.forEach(card => {
        // Add click handler
        card.addEventListener('click', function() {
            // Remove active class from all cards
            startingPointCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            this.classList.add('active');
            
            // Save the selected starting point
            const startingPoint = this.getAttribute('data-intention');
            saveConfiguration('messageIntention', startingPoint);
            
            // Enable the continue button
            enableNavigationButton('continue-btn');
            
            // Add subtle animation to show selection
            animateSelection(this);
        });
        
        // Add keyboard support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Make cards focusable for keyboard navigation
        if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
        }
    });
}

/**
 * Set up navigation buttons (back, next, continue)
 */
function setupNavigationButtons() {
    // Next button (for context selection)
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (!this.disabled) {
                // Show starting points section, hide context section
                showSection('starting-points-section');
                hideSection('context-section');
                
                // Update progress indicator
                updateProgressIndicator(2);
                
                // Scroll to the section
                scrollToElement('starting-points-section');
            }
        });
    }
    
    // Back button (for starting points)
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            // Show context section, hide starting points section
            showSection('context-section');
            hideSection('starting-points-section');
            
            // Update progress indicator
            updateProgressIndicator(1);
            
            // Scroll to the section
            scrollToElement('context-section');
        });
    }
    
    // Continue button (for proceeding to format selection)
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            if (!this.disabled) {
                // Save configuration timestamp
                saveConfiguration('messageConfigTimestamp', new Date().toISOString());
                saveConfiguration('messageConfigComplete', 'true');
                
                // Navigate to the format selection page
                window.location.href = 'message-format.html';
            }
        });
    }
}

/**
 * Update the UI based on the selected context
 */
function updateStartingPointsBasedOnContext(context) {
    const startingPointCards = document.querySelectorAll('.starting-point-card');
    
    // Reset all cards
    startingPointCards.forEach(card => {
        card.style.display = 'flex';
    });
    
    // Filter cards based on context if needed
    if (context === 'professional' || context === 'personal') {
        startingPointCards.forEach(card => {
            const cardContexts = card.getAttribute('data-contexts') || 'all';
            
            if (cardContexts !== 'all' && !cardContexts.includes(context)) {
                card.style.display = 'none';
            }
        });
    }
}

/**
 * Save configuration value to session storage and localStorage for persistence
 */
function saveConfiguration(key, value) {
    try {
        // Save to sessionStorage for current session
        sessionStorage.setItem(key, value);
        
        // Also save to localStorage for persistence across sessions
        localStorage.setItem(key, value);
        
        console.log(`Saved configuration: ${key}=${value}`);
    } catch (error) {
        console.error('Error saving configuration:', error);
    }
}

/**
 * Load saved configurations from storage
 */
function loadSavedConfigurations() {
    try {
        // Try to load from sessionStorage first (current session)
        const messageCategory = sessionStorage.getItem('messageCategory') || localStorage.getItem('messageCategory');
        const messageIntention = sessionStorage.getItem('messageIntention') || localStorage.getItem('messageIntention');
        
        console.log('Loaded saved configurations:', { messageCategory, messageIntention });
        
        // Apply the saved context selection
        if (messageCategory) {
            const contextBtn = document.querySelector(`.context-btn[data-context="${messageCategory}"]`);
            if (contextBtn) {
                contextBtn.click();
            }
        }
        
        // Apply the saved starting point selection
        if (messageIntention) {
            const startingPointCard = document.querySelector(`.starting-point-card[data-intention="${messageIntention}"]`);
            if (startingPointCard) {
                startingPointCard.click();
            }
        }
    } catch (error) {
        console.error('Error loading saved configurations:', error);
    }
}

/**
 * Enable a navigation button
 */
function enableNavigationButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = false;
        button.classList.add('active');
    }
}

/**
 * Update the progress indicator
 */
function updateProgressIndicator(step) {
    const steps = document.querySelectorAll('.progress-step');
    
    if (steps.length === 0) return;
    
    steps.forEach((stepEl, index) => {
        if (index + 1 <= step) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
    });
}

/**
 * Show a section by ID
 */
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        
        // Add animation class
        section.classList.add('fade-in');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            section.classList.remove('fade-in');
        }, 1000);
    }
}

/**
 * Hide a section by ID
 */
function hideSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'none';
    }
}

/**
 * Scroll to an element smoothly
 */
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        // Check if smooth scrolling is preferred
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            element.scrollIntoView();
        }
    }
}

/**
 * Add a subtle animation to a selected element
 */
function animateSelection(element) {
    // Only animate if reduced motion is not preferred
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, 700);
    }
}

/**
 * Set up accessibility features
 */
function setupAccessibility() {
    // Add proper ARIA roles and labels
    const contextButtons = document.querySelectorAll('.context-btn');
    contextButtons.forEach(button => {
        button.setAttribute('role', 'radio');
        button.setAttribute('aria-checked', button.classList.contains('active') ? 'true' : 'false');
    });
    
    const startingPointCards = document.querySelectorAll('.starting-point-card');
    startingPointCards.forEach(card => {
        card.setAttribute('role', 'option');
        card.setAttribute('aria-selected', card.classList.contains('active') ? 'true' : 'false');
    });
    
    // Add role to container
    const contextContainer = document.querySelector('.context-options');
    if (contextContainer) {
        contextContainer.setAttribute('role', 'radiogroup');
        contextContainer.setAttribute('aria-label', 'Select message context');
    }
    
    const startingPointsContainer = document.querySelector('.starting-points');
    if (startingPointsContainer) {
        startingPointsContainer.setAttribute('role', 'listbox');
        startingPointsContainer.setAttribute('aria-label', 'Select message intention');
    }
}

/**
 * Check viewport size and adjust layout as needed
 */
function checkViewportAndAdjust() {
    const isMobile = window.innerWidth < 768;
    
    // Make adjustments based on viewport size
    if (isMobile) {
        // Adjust for mobile view
        const startingPointCards = document.querySelectorAll('.starting-point-card');
        startingPointCards.forEach(card => {
            // Ensure cards are more touch-friendly on mobile
            card.style.padding = '1.5rem';
        });
    } else {
        // Reset adjustments for desktop view
        const startingPointCards = document.querySelectorAll('.starting-point-card');
        startingPointCards.forEach(card => {
            card.style.padding = '';
        });
    }
}

/**
 * Debounce function to limit the rate at which a function can fire
 */
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 