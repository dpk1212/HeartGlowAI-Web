/**
 * Message Intent Page - Simplified Version
 * This handles selecting the message intent/purpose for message creation
 */

// Global variables
let selectedIntent = null;
let recipientData = null;
let selectedEmotion = null;
let authBypass = false;

// Main initialization function - runs when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initPage);

/**
 * Initialize the page - main entry point
 */
function initPage() {
    console.log('Initializing message intent page...');
    
    // Get the emotion from URL parameter
    selectedEmotion = getEmotionFromUrl();
    console.log('Emotion from URL:', selectedEmotion);
    
    // Load recipient data
    loadRecipientData();
    
    // Initialize UI elements
    initIntentSelection();
    initButtons();
    initNavigation();
    initBypassAuth();
    
    // Show debug button
    createDebugButton();
    
    // Check authentication (with bypass option)
    checkAuthentication();
    
    // Log page loaded
    logDebug('Page initialized successfully');
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
        const storedRecipientData = localStorage.getItem('recipientData');
        if (storedRecipientData) {
            recipientData = JSON.parse(storedRecipientData);
            logDebug(`Loaded recipient data: ${recipientData.name} (${recipientData.relationship})`);
            updateRecipientDisplay();
        } else {
            logDebug('ERROR: No recipient data found in localStorage');
            showAlert('No recipient information found. Please go back and enter recipient details.', 'error');
        }
    } catch (error) {
        logDebug(`ERROR: Failed to parse recipient data: ${error.message}`);
        showAlert('There was a problem loading your recipient information.', 'error');
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
 * Initialize intent selection
 */
function initIntentSelection() {
    const intentOptions = document.querySelectorAll('.intent-option');
    const nextBtn = document.getElementById('next-btn');
    const customIntentForm = document.getElementById('custom-intent-form');
    
    if (!intentOptions.length) {
        logDebug('ERROR: No intent options found');
        return;
    }
    
    logDebug(`Found ${intentOptions.length} intent options`);
    
    intentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            intentOptions.forEach(o => o.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Save selected intent
            selectedIntent = this.getAttribute('data-intent');
            logDebug(`Selected intent: ${selectedIntent}`);
            
            // Show/hide custom intent form
            if (selectedIntent === 'custom' && customIntentForm) {
                customIntentForm.classList.add('active');
            } else if (customIntentForm) {
                customIntentForm.classList.remove('active');
            }
            
            // Enable next button
            if (nextBtn) {
                nextBtn.disabled = false;
            }
        });
    });
    
    // Pre-select appropriate intent based on emotion
    preSelectIntentBasedOnEmotion();
}

/**
 * Pre-select an intent based on the emotional choice
 */
function preSelectIntentBasedOnEmotion() {
    if (!selectedEmotion) return;
    
    let intentToSelect = null;
    
    // Map emotion to relevant intent
    switch (selectedEmotion) {
        case 'vulnerability':
            intentToSelect = 'apologize';
            break;
        case 'reconnect':
            intentToSelect = 'reconnect';
            break;
        case 'appreciation':
            intentToSelect = 'appreciate';
            break;
        default:
            // Don't pre-select anything
            return;
    }
    
    // Find and click the matching intent option
    const intentOption = document.querySelector(`.intent-option[data-intent="${intentToSelect}"]`);
    if (intentOption) {
        intentOption.click();
        logDebug(`Pre-selected intent: ${intentToSelect} based on emotion: ${selectedEmotion}`);
    }
}

/**
 * Initialize back and next buttons
 */
function initButtons() {
    // Back button
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'recipient-selection-new.html?emotion=' + selectedEmotion;
        });
    } else {
        logDebug('ERROR: Back button not found');
    }
    
    // Next button
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (validateSelection()) {
                saveIntentAndNavigate();
            } else {
                showError();
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
    // Dashboard button
    const dashboardBtn = document.getElementById('dashboard-btn');
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', function() {
            window.location.href = 'home.html';
        });
    }
    
    // History button
    const historyBtn = document.getElementById('history-btn');
    if (historyBtn) {
        historyBtn.addEventListener('click', function() {
            window.location.href = 'history.html';
        });
    }
    
    // Learn button
    const learnBtn = document.getElementById('learn-btn');
    if (learnBtn) {
        learnBtn.addEventListener('click', function() {
            window.location.href = 'learn.html';
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (window.firebase && firebase.auth) {
                firebase.auth().signOut()
                    .then(() => {
                        window.location.href = 'index.html';
                    })
                    .catch((error) => {
                        console.error('Logout error:', error);
                    });
            } else {
                window.location.href = 'index.html';
            }
        });
    }
}

/**
 * Initialize bypass auth button
 */
function initBypassAuth() {
    const bypassAuthBtn = document.getElementById('bypass-auth-btn');
    if (bypassAuthBtn) {
        bypassAuthBtn.addEventListener('click', function() {
            logDebug('AUTH BYPASS ACTIVATED - continuing without authentication');
            authBypass = true;
            
            // Show debug console
            document.getElementById('debug-console').style.display = 'block';
        });
    }
}

/**
 * Create and add a debug button to the page
 */
function createDebugButton() {
    const debugBtn = document.createElement('button');
    debugBtn.textContent = 'Debug';
    debugBtn.style.position = 'fixed';
    debugBtn.style.bottom = '10px';
    debugBtn.style.right = '10px';
    debugBtn.style.zIndex = '9999';
    debugBtn.style.padding = '5px 10px';
    debugBtn.style.background = '#333';
    debugBtn.style.color = '#fff';
    debugBtn.style.border = 'none';
    debugBtn.style.borderRadius = '4px';
    debugBtn.style.cursor = 'pointer';
    
    debugBtn.addEventListener('click', function() {
        const debugConsole = document.getElementById('debug-console');
        if (debugConsole) {
            debugConsole.style.display = debugConsole.style.display === 'none' ? 'block' : 'none';
        }
    });
    
    document.body.appendChild(debugBtn);
}

/**
 * Simple authentication check with bypass option
 */
function checkAuthentication() {
    if (window.firebase && firebase.auth) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                logDebug(`User authenticated: ${user.uid}`);
                
                // Save auth token for next pages but don't redirect
                user.getIdToken(true).then(token => {
                    localStorage.setItem('authToken', token);
                    logDebug('Saved authentication token to localStorage');
                }).catch(error => {
                    logDebug(`ERROR: Failed to get auth token: ${error.message}`);
                });
            } else {
                logDebug('No user logged in');
                if (!authBypass) {
                    logDebug('Authentication check failed, showing debug console with bypass option');
                    document.getElementById('debug-console').style.display = 'block';
                    
                    // Optionally redirect to login page if needed
                    // window.location.href = 'login.html';
                }
            }
        });
    } else {
        logDebug('WARNING: Firebase auth not available');
        document.getElementById('debug-console').style.display = 'block';
    }
}

/**
 * Show error message
 */
function showError() {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.classList.remove('hidden');
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 5000);
    }
}

/**
 * Show alert message
 */
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => {
        document.body.removeChild(alert);
    });
    
    // Create alert element
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type}`;
    alertElement.innerHTML = `
        <div class="alert-content">
            <span class="alert-message">${message}</span>
            <button class="alert-close">&times;</button>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(alertElement);
    
    // Show after a small delay (for animation)
    setTimeout(() => {
        alertElement.classList.add('show');
    }, 10);
    
    // Add close button handler
    const closeBtn = alertElement.querySelector('.alert-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            alertElement.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(alertElement)) {
                    document.body.removeChild(alertElement);
                }
            }, 300);
        });
    }
    
    // Auto remove for non-error alerts
    if (type !== 'error') {
        setTimeout(() => {
            alertElement.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(alertElement)) {
                    document.body.removeChild(alertElement);
                }
            }, 300);
        }, 5000);
    }
}

/**
 * Validate intent selection before proceeding
 */
function validateSelection() {
    if (!selectedIntent) {
        logDebug('ERROR: No intent selected');
        return false;
    }
    
    if (selectedIntent === 'custom') {
        const customIntentInput = document.getElementById('custom-intent');
        if (!customIntentInput || !customIntentInput.value.trim()) {
            logDebug('ERROR: Custom intent selected but no description provided');
            return false;
        }
    }
    
    return true;
}

/**
 * Save intent data and navigate to message tone page
 */
function saveIntentAndNavigate() {
    logDebug('Attempting to save intent and navigate...');
    try {
        // Create intent data object
        const intentData = {
            type: selectedIntent
        };
        
        // Add custom intent details if relevant
        if (selectedIntent === 'custom') {
            const customIntentInput = document.getElementById('custom-intent');
            if (customIntentInput) {
                intentData.customText = customIntentInput.value.trim();
            }
        }
        
        // Store in localStorage
        localStorage.setItem('intentData', JSON.stringify(intentData));
        logDebug('Intent data saved to localStorage.');
        
        // Authentication check and token saving BEFORE navigation
        const currentUser = firebase.auth().currentUser;
        
        if (currentUser) {
            logDebug('User found. Getting auth token before navigating...');
            currentUser.getIdToken(true) // Force refresh token
                .then(token => {
                    logDebug('Successfully got auth token.');
                    localStorage.setItem('authToken', token);
                    logDebug('Auth token saved to localStorage.');
                    
                    // NOW navigate
                    const nextPage = `message-tone-new.html?emotion=${selectedEmotion}`;
                    logDebug(`Navigating to: ${nextPage}`);
                    window.location.href = nextPage;
                })
                .catch(error => {
                    logDebug(`ERROR: Failed to get auth token before navigation: ${error.message}`);
                    showAlert('Could not verify authentication. Please try again.', 'error');
                    // Do not navigate if token retrieval fails
                });
        } else if (authBypass) {
             logDebug('Auth bypass enabled. Navigating without saving token.');
             // Navigate without token (as bypass is enabled)
             const nextPage = `message-tone-new.html?emotion=${selectedEmotion}`;
             logDebug(`Navigating (bypass) to: ${nextPage}`);
             window.location.href = nextPage;
        } else {
            logDebug('ERROR: No authenticated user found before navigation.');
            showAlert('Authentication required. Please ensure you are logged in.', 'error');
            // Do not navigate
        }

    } catch (error) {
        logDebug(`ERROR: Failed during saveIntentAndNavigate: ${error.message}`);
        showAlert('There was a problem proceeding to the next step.', 'error');
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