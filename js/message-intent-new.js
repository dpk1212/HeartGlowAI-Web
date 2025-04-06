/**
 * Message Intent Page - Updated Version
 * This handles selecting the message intent/purpose for message creation
 */

// Global variables
let currentUser = null;
let selectedIntent = null;
let customIntent = '';

// DOM Elements
const nextBtn = document.getElementById('nextBtn');
const userMenuBtn = document.getElementById('userMenuBtn');
const userDropdown = document.getElementById('userDropdown');
const logoutBtn = document.getElementById('logoutBtn');
const userAvatar = document.getElementById('userAvatar');
const userDisplayName = document.getElementById('userDisplayName');
const userEmail = document.getElementById('userEmail');
const optionCards = document.querySelectorAll('.option-card');
const customIntentSection = document.getElementById('customIntentSection');
const customIntentInput = document.getElementById('customIntentInput');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingContext = document.getElementById('loadingContext');
const alertContainer = document.getElementById('alertContainer');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize auth state
    initializeAuthState();
    
    // Setup event listeners
    setupEventListeners();
    
    // Check for previous data
    checkPreviousData();
    
    // Debug log
    console.log('Message Intent page initialized');
});

// Initialize authentication state
function initializeAuthState() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            currentUser = user;
            updateUserInterface(user);
            console.log('User authenticated:', user.email);
        } else {
            // No user is signed in, redirect to login
            console.log('No user authenticated, redirecting to login');
            window.location.href = 'login.html';
        }
    });
}

// Update UI elements based on the user
function updateUserInterface(user) {
    if (user) {
        userDisplayName.textContent = user.displayName || 'User';
        userEmail.textContent = user.email || '';
        
        if (user.photoURL) {
            userAvatar.src = user.photoURL;
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // User menu toggle
    userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (userDropdown.classList.contains('show') && !userMenuBtn.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });
    
    // Logout button
    logoutBtn.addEventListener('click', () => {
        showLoading('Signing out...');
        firebase.auth().signOut()
            .then(() => {
                window.location.href = 'login.html';
            })
            .catch((error) => {
                hideLoading();
                showAlert('Error signing out. Please try again.', 'error');
                console.error('Logout error:', error);
            });
    });
    
    // Option card selection
    optionCards.forEach(card => {
        card.addEventListener('click', () => {
            // Deselect all cards
            optionCards.forEach(c => c.classList.remove('selected'));
            
            // Select the clicked card
            card.classList.add('selected');
            
            // Get the intent
            selectedIntent = card.getAttribute('data-intent');
            console.log('Selected intent:', selectedIntent);
            
            // Handle custom intent field
            if (selectedIntent === 'custom') {
                customIntentSection.style.display = 'block';
                customIntentInput.focus();
                if (!customIntentInput.value.trim()) {
                    nextBtn.disabled = true;
                } else {
                    customIntent = customIntentInput.value.trim();
                    nextBtn.disabled = false;
                }
            } else {
                customIntentSection.style.display = 'none';
                nextBtn.disabled = false;
            }
        });
    });
    
    // Custom intent input
    if (customIntentInput) {
        customIntentInput.addEventListener('input', () => {
            customIntent = customIntentInput.value.trim();
            nextBtn.disabled = customIntent === '';
        });
    }
    
    // Next button
    nextBtn.addEventListener('click', () => {
        if (!selectedIntent) {
            showAlert('Please select an intention for your message', 'error');
            return;
        }
        
        // Create intent data
        let intentData = {
            type: selectedIntent,
            timestamp: new Date().toISOString()
        };
        
        // Add custom intent text if applicable
        if (selectedIntent === 'custom' && customIntent) {
            intentData.customText = customIntent;
        }
        
        // Create an intent object for easier access on the tone page
        let intentObject = {
            title: '',
            description: '',
            icon: ''
        };
        
        // Get data from the selected card
        const selectedCard = document.querySelector(`.option-card[data-intent="${selectedIntent}"]`);
        if (selectedCard) {
            const titleElement = selectedCard.querySelector('.option-title');
            const descriptionElement = selectedCard.querySelector('.option-description');
            const iconElement = selectedCard.querySelector('.option-icon i');
            
            intentObject.title = titleElement ? titleElement.textContent : selectedIntent;
            intentObject.description = descriptionElement ? descriptionElement.textContent : '';
            intentObject.icon = iconElement ? iconElement.className.replace('fas ', '') : 'fa-heart';
        } else {
            // Fallback values if we can't find the card elements
            intentObject.title = selectedIntent.charAt(0).toUpperCase() + selectedIntent.slice(1);
            intentObject.icon = 'fa-heart';
        }
        
        console.log('Saving intent data:', intentData);
        console.log('Saving intent object for tone page:', intentObject);
        
        try {
            // Keep recipient data but clear any existing tone data
            localStorage.removeItem('toneData');
            localStorage.removeItem('selectedTone');
            
            // Save both objects to localStorage for persistence
            localStorage.setItem('intentData', JSON.stringify(intentData));
            localStorage.setItem('selectedIntent', JSON.stringify(intentObject));
            
            // Show loading overlay
            showLoading('Saving your selection...');
            
            // Proceed to next page (tone selection)
            setTimeout(() => {
                window.location.href = 'message-tone-new.html';
            }, 800);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            hideLoading();
            showAlert('Could not save your selection. Please try again.', 'error');
        }
    });
    
    // Back button
    const backBtn = document.querySelector('.secondary-button');
    if (backBtn) {
        backBtn.href = 'recipient-selection-new.html';
    }
}

// Check for previous data
function checkPreviousData() {
    try {
        const storedIntentData = localStorage.getItem('intentData');
        if (storedIntentData) {
            const intentData = JSON.parse(storedIntentData);
            selectedIntent = intentData.type;
            
            // Select the correct card
            const card = document.querySelector(`.option-card[data-intent="${selectedIntent}"]`);
            if (card) {
                card.click();
                
                // Set custom intent if applicable
                if (selectedIntent === 'custom' && intentData.customText) {
                    customIntent = intentData.customText;
                    customIntentInput.value = customIntent;
                }
            }
        }
    } catch (e) {
        console.error('Error parsing previous intent data:', e);
    }
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    loadingContext.textContent = message;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    loadingOverlay.classList.remove('active');
}

// Show alert message
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    
    const alertContent = document.createElement('div');
    alertContent.className = 'alert-content';
    
    const alertMessage = document.createElement('div');
    alertMessage.className = 'alert-message';
    alertMessage.textContent = message;
    
    const alertClose = document.createElement('button');
    alertClose.className = 'alert-close';
    alertClose.innerHTML = '&times;';
    alertClose.addEventListener('click', () => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    });
    
    alertContent.appendChild(alertMessage);
    alertContent.appendChild(alertClose);
    alert.appendChild(alertContent);
    
    alertContainer.appendChild(alert);
    
    // Force reflow to trigger transition
    alert.offsetHeight;
    alert.classList.add('show');
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}

/**
 * Check for recipient data from previous page
 */
function checkRecipientData() {
    const recipientData = localStorage.getItem('recipientData');
    const selectedRecipient = localStorage.getItem('selectedRecipient');
    
    if (!recipientData || !selectedRecipient) {
        // Redirect to recipient selection if no data found
        showAlert('Please select a recipient first', 'error');
        setTimeout(() => {
            window.location.href = 'recipient-selection-new.html';
        }, 1500);
        return false;
    }
    
    return true;
}

/**
 * Display recipient information in the summary card
 */
function displayRecipientInfo() {
    try {
        const selectedRecipient = JSON.parse(localStorage.getItem('selectedRecipient'));
        if (!selectedRecipient) return;
        
        const recipientName = document.getElementById('recipientName');
        const recipientRelationship = document.getElementById('recipientRelationship');
        const recipientInitial = document.getElementById('recipientInitial');
        
        if (recipientName) {
            recipientName.textContent = selectedRecipient.name || 'Unknown';
        }
        
        if (recipientRelationship) {
            recipientRelationship.textContent = selectedRecipient.relationship || 'Unknown relationship';
        }
        
        if (recipientInitial) {
            recipientInitial.textContent = selectedRecipient.initial || selectedRecipient.name.charAt(0).toUpperCase() || '?';
        }
    } catch (error) {
        console.error('Error displaying recipient info:', error);
    }
}

/**
 * Initialize page: set up UI and event handlers
 */
function initPage() {
    console.log('Message Intent Page Initialized');
    
    // Initialize authentication
    initializeAuthState();
    
    // Check for existing recipient data first
    if (checkRecipientData()) {
        // Display recipient information if it exists
        displayRecipientInfo();
    }
    
    // Set up event handlers
    setupEventListeners();
    
    // Check for previous intent data
    checkPreviousData();
} 