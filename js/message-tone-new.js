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
 * Load intent data from localStorage
 */
function loadIntentData() {
    try {
        const storedIntentData = localStorage.getItem('intentData');
        if (storedIntentData) {
            intentData = JSON.parse(storedIntentData);
            logDebug(`Loaded intent data: ${intentData.type}`);
        } else {
            logDebug('ERROR: No intent data found in localStorage');
            showAlert('No intent information found. Please go back and select an intent.', 'error');
        }
    } catch (error) {
        logDebug(`ERROR: Failed to parse intent data: ${error.message}`);
        showAlert('There was a problem loading your intent information.', 'error');
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
 * Initialize tone selection
 */
function initToneSelection() {
    const toneOptions = document.querySelectorAll('.tone-option');
    const nextBtn = document.getElementById('next-btn');
    const customToneForm = document.getElementById('custom-tone-form');
    
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
            if (selectedTone === 'custom' && customToneForm) {
                customToneForm.classList.add('active');
            } else if (customToneForm) {
                customToneForm.classList.remove('active');
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
    const toneOption = document.querySelector(`.tone-option[data-tone="${toneToSelect}"]`);
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
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'message-intent-new.html?emotion=' + selectedEmotion;
        });
    } else {
        logDebug('ERROR: Back button not found');
    }
    
    // Next button
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (validateSelection()) {
                saveToneAndNavigate();
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
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
        logDebug('Found auth token in localStorage. Assuming authenticated initially.');
    }

    if (window.firebase && firebase.auth) {
        logDebug('Setting up onAuthStateChanged listener...');
        let initialCheckDone = false; // Flag to track if initial listener has run

        firebase.auth().onAuthStateChanged(function(user) {
            logDebug(`>>> onAuthStateChanged Fired! User: ${user ? user.uid : 'null'}. Already resolved: ${authStateResolved}`);
            
            // Logic for the FIRST time the listener fires after page load
            if (!authStateResolved) {
                 if (user) {
                    logDebug(`   [Listener Initial] User found directly. Resolving promise with user.`);
                    user.getIdToken(true).then(token => localStorage.setItem('authToken', token)).catch(e => logDebug('Error refreshing token initial', e)); 
                    authStatePromiseResolver(user);
                    authStateResolved = true;
                } else {
                    logDebug('   [Listener Initial] Initial trigger is NULL. Setting 250ms timeout to check persisted state...');
                    setTimeout(() => {
                        logDebug('   [Listener Timeout Check] Timeout finished.');
                        if (!authStateResolved) { // Check again, maybe resolved by a rapid second fire
                            const currentUserAfterDelay = firebase.auth().currentUser;
                            logDebug(`   [Listener Timeout Check] State after delay: ${currentUserAfterDelay ? currentUserAfterDelay.uid : 'null'}`);
                            if (currentUserAfterDelay) {
                                logDebug('   [Listener Timeout Check] User found after delay. Resolving promise with user.');
                                authStatePromiseResolver(currentUserAfterDelay);
                            } else {
                                logDebug('   [Listener Timeout Check] No user after delay. ***NOT deleting token***. Resolving promise with null.');
                                authStatePromiseResolver(null);
                                if (!authBypass && !storedToken) { // Only show error if no token existed initially either
                                    logDebug('   [Listener Timeout Check] Authentication potentially required (no initial token either). Showing debug console.');
                                    document.getElementById('debug-console').style.display = 'block';
                                }
                            }
                            authStateResolved = true;
                        } else {
                            logDebug('   [Listener Timeout Check] Auth state was already resolved before timeout check finished.');
                        }
                    }, 250); 
                }
            } 
            // Logic for SUBSEQUENT times the listener fires (e.g., user logs out in another tab)
            else {
                 logDebug('   [Listener Subsequent] Fired again after promise was resolved.');
                 if (!user) {
                      logDebug('   [Listener Subsequent] Subsequent fire reports logged out user. Clearing token NOW.');
                      localStorage.removeItem('authToken'); // OK to clear token now if state changes AFTER initial resolution
                      // Optionally update UI or redirect if needed based on logout
                 } else {
                     // User is still logged in or logged in again
                     logDebug('   [Listener Subsequent] Subsequent fire reports logged in user.');
                 }
            }
            initialCheckDone = true; // Mark that the listener logic has run at least once
        });
    } else {
        logDebug('WARNING: Firebase auth not available. Resolving promise with null.');
        authStatePromiseResolver(null); 
        authStateResolved = true;
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
 * Validate tone selection before proceeding
 */
function validateSelection() {
    if (!selectedTone) {
        logDebug('ERROR: No tone selected');
        return false;
    }
    
    if (selectedTone === 'custom') {
        const customToneInput = document.getElementById('custom-tone');
        if (!customToneInput || !customToneInput.value.trim()) {
            logDebug('ERROR: Custom tone selected but no description provided');
            return false;
        }
    }
    
    return true;
}

/**
 * Save tone data and navigate to message result page
 */
async function saveToneAndNavigate() {
    logDebug('Attempting to save tone and navigate...');
    try {
        logDebug('   Waiting for authStatePromise to resolve...');
        await authStatePromise;
        logDebug('>>> authStatePromise Resolved. Proceeding with navigation logic.');

        // Create tone data object
        const toneData = {
            type: selectedTone
        };
        
        if (selectedTone === 'custom') {
            const customToneInput = document.getElementById('custom-tone');
            if (customToneInput) {
                toneData.customText = customToneInput.value.trim();
            }
        }
        localStorage.setItem('toneData', JSON.stringify(toneData));
        logDebug('   Tone data saved.');

        const currentUser = firebase.auth().currentUser;
        const storedToken = localStorage.getItem('authToken');
        logDebug(`   State post-await: currentUser = ${currentUser ? currentUser.uid : 'null'}, storedToken exists = ${!!storedToken}`);

        if (currentUser) {
            logDebug('   Condition: currentUser is valid. Getting fresh token...');
            currentUser.getIdToken(true) // Force refresh token
                .then(token => {
                    logDebug('      Successfully got fresh token post-wait.');
                    localStorage.setItem('authToken', token);
                    const nextPage = `message-result-new.html?emotion=${selectedEmotion}`;
                    logDebug(`      Navigating to: ${nextPage}`);
                    window.location.href = nextPage;
                })
                .catch(error => {
                    logDebug(`      ERROR getting fresh token post-wait: ${error.message}`);
                    showAlert('Could not verify authentication. Please try refreshing the page.', 'error');
                });
        } else if (storedToken && !authBypass) {
            logDebug('   Condition: currentUser is null, but storedToken exists. Navigating with assumption...');
            const nextPage = `message-result-new.html?emotion=${selectedEmotion}`;
            logDebug(`      Navigating (using stored token assumption) to: ${nextPage}`);
            window.location.href = nextPage; 
        } else if (authBypass) {
             logDebug('   Condition: Auth bypass enabled. Navigating...');
             const nextPage = `message-result-new.html?emotion=${selectedEmotion}`;
             logDebug(`      Navigating (bypass) to: ${nextPage}`);
             window.location.href = nextPage;
        } else {
            logDebug('   Condition: No currentUser, no storedToken, no bypass. Showing error.');
            showAlert('Authentication required. Please ensure you are logged in or try refreshing.', 'error');
        }
    } catch (error) {
        logDebug(`   ERROR during saveToneAndNavigate: ${error.message}`);
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