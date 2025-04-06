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
            showAlert('Please select an intent before continuing.', 'error');
            return;
        }
        
        // Validate custom intent if needed
        if (selectedIntent === 'custom' && !customIntent) {
            showAlert('Please describe your custom intent before continuing.', 'error');
            customIntentInput.focus();
            return;
        }
        
        // Create intent data object for storage
        const intentData = {
            type: selectedIntent
        };
        
        // Add custom intent if applicable
        if (selectedIntent === 'custom') {
            intentData.customText = customIntent;
        }
        
        // Create an intent object that matches what recipient-selection-new.js expects
        const intentObject = {
            title: document.querySelector(`.option-card[data-intent="${selectedIntent}"] .option-title`).textContent,
            description: document.querySelector(`.option-card[data-intent="${selectedIntent}"] .option-description`).textContent,
            icon: document.querySelector(`.option-card[data-intent="${selectedIntent}"] .option-icon i`).className.replace('fas ', '')
        };
        
        console.log('Saving intent data:', intentData);
        console.log('Saving intent object for recipient page:', intentObject);
        
        // Save both objects to localStorage for persistence
        localStorage.setItem('intentData', JSON.stringify(intentData));
        localStorage.setItem('selectedIntent', JSON.stringify(intentObject));
        
        // Show loading overlay
        showLoading('Saving your selection...');
        
        // Proceed to next page (recipient selection)
        setTimeout(() => {
            window.location.href = 'recipient-selection-new.html';
        }, 800);
    });
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