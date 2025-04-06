/**
 * Message Tone Page - Simplified Version
 * This handles selecting the tone for message creation
 */

// Global variables
let selectedTone = null;
let recipientData = null;
let intentData = null;
let selectedEmotion = null;
let authBypass = false;
let authStateResolved = false;
let authStatePromiseResolver = null;
let authStatePromise = new Promise(resolve => {
  authStatePromiseResolver = resolve;
});

// Main initialization function - runs when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initPage);

/**
 * Initialize the page - main entry point
 */
function initPage() {
    console.log('Initializing message tone page...');
    
    // Get the emotion from URL parameter
    selectedEmotion = getEmotionFromUrl();
    console.log('Emotion from URL:', selectedEmotion);
    
    // Load recipient data and intent data
    loadRecipientData();
    loadIntentData();
    
    // Initialize UI elements
    initToneSelection();
    initButtons();
    initNavigation();
    
    // Check authentication state
    checkAuthState();
    
    console.log('Page initialized successfully');
}

/**
 * Get the emotion parameter from the URL
 */
function getEmotionFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('emotion') || localStorage.getItem('selectedEmotion') || 'default';
}

/**
 * Load recipient data from localStorage
 */
function loadRecipientData() {
    try {
        console.log('Attempting to load recipient data...');
        
        // Try both storage keys for maximum compatibility
        let storedRecipientData = localStorage.getItem('recipientData');
        if (!storedRecipientData) {
            storedRecipientData = localStorage.getItem('selectedRecipient');
        }
        
        if (storedRecipientData) {
            recipientData = JSON.parse(storedRecipientData);
            logDebug(`Loaded recipient data: ${recipientData.name} (${recipientData.relationship})`);
            updateRecipientDisplay();
            return true;
        } else {
            logDebug('ERROR: No recipient data found in localStorage');
            showAlert('No recipient information found. Please go back and enter recipient details.', 'error');
            
            // After a delay, redirect back to recipient selection
            setTimeout(() => {
                window.location.href = 'recipient-selection-new.html';
            }, 2000);
            
            return false;
        }
    } catch (error) {
        logDebug(`ERROR: Failed to parse recipient data: ${error.message}`);
        showAlert('There was a problem loading your recipient information.', 'error');
        return false;
    }
}

/**
 * Load intent data from localStorage
 */
function loadIntentData() {
    try {
        console.log('Attempting to load intent data...');
        
        // Try both storage keys for maximum compatibility
        let storedIntentData = localStorage.getItem('intentData');
        let selectedIntent = localStorage.getItem('selectedIntent');
        
        if (storedIntentData) {
            intentData = JSON.parse(storedIntentData);
            logDebug(`Loaded intent data: ${intentData.type}`);
            
            // Also parse the selectedIntent if available for display purposes
            if (selectedIntent) {
                try {
                    const intentDisplay = JSON.parse(selectedIntent);
                    updateIntentDisplay(intentDisplay);
                } catch (e) {
                    console.error('Error parsing selectedIntent for display:', e);
                }
            }
            
            return true;
        } else {
            logDebug('ERROR: No intent data found in localStorage');
            showAlert('No intent information found. Please go back and select an intent.', 'error');
            
            // After a delay, redirect back to intent selection
            setTimeout(() => {
                window.location.href = 'message-intent-new.html';
            }, 2000);
            
            return false;
        }
    } catch (error) {
        logDebug(`ERROR: Failed to parse intent data: ${error.message}`);
        showAlert('There was a problem loading your intent information.', 'error');
        return false;
    }
}

/**
 * Update the recipient display with loaded data
 */
function updateRecipientDisplay() {
    if (!recipientData) return;
    
    // Update recipient display
    const nameDisplay = document.getElementById('recipient-name-display');
    const relationshipDisplay = document.getElementById('recipient-relationship-display');
    const avatarDisplay = document.getElementById('recipient-avatar');
    const recipientInfo = document.querySelector('.recipient-info');
    
    if (recipientInfo) {
        recipientInfo.classList.remove('loading');
    }
    
    if (nameDisplay) {
        nameDisplay.textContent = recipientData.name || 'Unknown recipient';
    }
    
    if (relationshipDisplay) {
        relationshipDisplay.textContent = capitalizeFirstLetter(recipientData.relationship) || 'Contact';
    }
    
    if (avatarDisplay) {
        avatarDisplay.textContent = getInitials(recipientData.name);
    }
}

/**
 * Update the intent display with loaded data
 */
function updateIntentDisplay(intentData) {
    if (!intentData) return;
    
    const intentIcon = document.getElementById('intent-icon');
    const intentTitle = document.getElementById('intent-title');
    const intentDescription = document.getElementById('intent-description');
    const intentInfo = document.querySelector('.intent-info');
    
    if (intentInfo) {
        intentInfo.classList.remove('loading');
    }
    
    if (intentIcon && intentData.icon) {
        intentIcon.innerHTML = `<i class="fas ${intentData.icon}"></i>`;
    }
    
    if (intentTitle && intentData.title) {
        intentTitle.textContent = intentData.title;
    }
    
    if (intentDescription && intentData.description) {
        intentDescription.textContent = intentData.description;
    }
}

/**
 * Initialize tone selection
 */
function initToneSelection() {
    const toneOptions = document.querySelectorAll('.option-card');
    const nextBtn = document.getElementById('nextBtn');
    const customToneSection = document.getElementById('customToneSection');
    const customToneInput = document.getElementById('customToneInput');
    
    if (!toneOptions.length) {
        logDebug('ERROR: No tone options found');
        return;
    }
    
    logDebug(`Found ${toneOptions.length} tone options`);
    
    toneOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            toneOptions.forEach(o => o.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Save selected tone
            selectedTone = this.getAttribute('data-tone');
            logDebug(`Selected tone: ${selectedTone}`);
            
            // Show/hide custom tone form
            if (selectedTone === 'custom' && customToneSection) {
                customToneSection.style.display = 'block';
                if (customToneInput) {
                    customToneInput.focus();
                }
            } else if (customToneSection) {
                customToneSection.style.display = 'none';
            }
            
            // Enable next button
            if (nextBtn) {
                nextBtn.disabled = false;
            }
        });
    });
    
    // Pre-select appropriate tone based on emotion and intent
    preSelectToneBasedOnContext();
}

/**
 * Pre-select a tone based on the emotional choice and intent
 */
function preSelectToneBasedOnContext() {
    if (!selectedEmotion || !intentData) return;
    
    let toneToSelect = null;
    
    // Map emotion and intent to relevant tone
    if (selectedEmotion === 'vulnerability' && intentData.type === 'apologize') {
        toneToSelect = 'sincere';
    } else if (selectedEmotion === 'reconnect' && intentData.type === 'reconnect') {
        toneToSelect = 'warm';
    } else if (selectedEmotion === 'appreciation' && intentData.type === 'appreciate') {
        toneToSelect = 'enthusiastic';
    } else {
        // Some other default mappings based on intent type
        switch (intentData.type) {
            case 'celebrate':
                toneToSelect = 'enthusiastic';
                break;
            case 'encourage':
                toneToSelect = 'warm';
                break;
            case 'invite':
                toneToSelect = 'casual';
                break;
            default:
                // Don't pre-select anything
                return;
        }
    }
    
    // Find and click the matching tone option
    const toneOption = document.querySelector(`.option-card[data-tone="${toneToSelect}"]`);
    if (toneOption) {
        toneOption.click();
        logDebug(`Pre-selected tone: ${toneToSelect} based on emotion: ${selectedEmotion} and intent: ${intentData.type}`);
    }
}

/**
 * Initialize back and next buttons
 */
function initButtons() {
    // Back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'recipient-selection-new.html';
        });
    } else {
        logDebug('ERROR: Back button not found');
    }
    
    // Next button
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (validateSelection()) {
                saveToneAndNavigate();
            } else {
                showAlert('Please select a tone before continuing.', 'error');
            }
        });
    } else {
        logDebug('ERROR: Next button not found');
    }
}

/**
 * Initialize navigation buttons
 */
function initNavigation() {
    // We're already handling the main navigation buttons in initButtons()
    
    // User menu functionality is already added in the DOMContentLoaded event
    
    // Add any additional navigation button handling here
}

/**
 * Check authentication state and update UI accordingly
 */
function checkAuthState() {
    if (firebase.auth) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in
                updateUserInfo(user);
            } else {
                // User is not signed in, redirect to login page
                window.location.href = 'index.html';
            }
        });
    }
}

/**
 * Update user information in the UI
 */
function updateUserInfo(user) {
    const userDisplayName = document.getElementById('userDisplayName');
    const userEmail = document.getElementById('userEmail');
    const userAvatar = document.getElementById('userAvatar');
    
    if (userDisplayName && user.displayName) {
        userDisplayName.textContent = user.displayName;
    }
    
    if (userEmail && user.email) {
        userEmail.textContent = user.email;
    }
    
    if (userAvatar && user.photoURL) {
        userAvatar.src = user.photoURL;
    }
}

/**
 * Validate tone selection before proceeding
 */
function validateSelection() {
    if (!selectedTone) {
        console.log('ERROR: No tone selected');
        return false;
    }
    
    if (selectedTone === 'custom') {
        const customToneInput = document.getElementById('customToneInput');
        if (!customToneInput || !customToneInput.value.trim()) {
            console.log('ERROR: Custom tone selected but no description provided');
            showAlert('Please describe your custom tone before continuing.', 'error');
            return false;
        }
    }
    
    return true;
}

/**
 * Save tone data and navigate to the next page
 */
async function saveToneAndNavigate() {
    console.log('Attempting to save tone and navigate...');
    showLoading('Preparing your message...');
    
    try {
        // Create tone data object
        const toneData = {
            type: selectedTone
        };
        
        if (selectedTone === 'custom') {
            const customToneInput = document.getElementById('customToneInput');
            if (customToneInput) {
                toneData.customText = customToneInput.value.trim();
            }
        }
        
        // Save tone data to localStorage
        localStorage.setItem('toneData', JSON.stringify(toneData));
        localStorage.setItem('selectedTone', JSON.stringify(toneData));
        
        console.log('Tone data saved:', toneData);
        
        // Navigate to the next page after a short delay
        setTimeout(() => {
            window.location.href = 'message-result-new.html';
        }, 800);
    } catch (error) {
        console.error('Error during tone saving:', error);
        hideLoading();
        showAlert('There was a problem saving your tone selection. Please try again.', 'error');
    }
}

/**
 * Log debug message to console and debug output
 */
function logDebug(message) {
    console.log('DEBUG:', message);
    
    const debugOutput = document.getElementById('debug-output');
    if (debugOutput) {
        const logEntry = document.createElement('div');
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        debugOutput.appendChild(logEntry);
    }
}

/**
 * Get initials from a name
 */
function getInitials(name) {
    if (!name) return '?';
    
    const parts = name.split(' ');
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Capitalize first letter of a string
 */
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Show alert message
 * @param {string} message - The message to display
 * @param {string} type - The type of alert: 'info', 'error', or 'success'
 */
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    
    if (!alertContainer) {
        console.error('Alert container not found');
        return;
    }
    
    const alertBox = document.createElement('div');
    alertBox.className = `alert alert-${type}`;
    alertBox.innerHTML = `
        <div class="alert-icon">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 
                         type === 'success' ? 'fa-check-circle' : 
                         'fa-info-circle'}"></i>
        </div>
        <div class="alert-content">${message}</div>
        <button class="alert-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add close functionality
    const closeBtn = alertBox.querySelector('.alert-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            alertBox.classList.add('alert-closing');
            setTimeout(() => {
                if (alertContainer.contains(alertBox)) {
                    alertContainer.removeChild(alertBox);
                }
            }, 300);
        });
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertContainer.contains(alertBox)) {
            alertBox.classList.add('alert-closing');
            setTimeout(() => {
                if (alertContainer.contains(alertBox)) {
                    alertContainer.removeChild(alertBox);
                }
            }, 300);
        }
    }, 5000);
    
    // Add to container
    alertContainer.appendChild(alertBox);
    
    // Force reflow to trigger transition
    alertBox.offsetHeight;
    alertBox.classList.add('show');
}

/**
 * Show loading overlay with custom message
 */
function showLoading(message = 'Loading...') {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingContext = document.getElementById('loadingContext');
    
    if (loadingContext) {
        loadingContext.textContent = message;
    }
    
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
} 