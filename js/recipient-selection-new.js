/**
 * Recipient Selection Page - Simplified Version
 * This handles selecting the recipient and relationship type for message creation
 */

// Global variables
let selectedRelation = null;
let urlEmotion = null;

// Main initialization function - runs when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initPage);

/**
 * Initialize the page - main entry point
 */
function initPage() {
    console.log('Initializing recipient selection page...');
    
    // Get the emotion from URL parameter
    urlEmotion = getEmotionFromUrl();
    console.log('Emotion from URL:', urlEmotion);
    
    // Initialize UI elements
    initRelationshipSelection();
    initButtons();
    initNavigation();
    initBypassAuth();
    
    // Show debug button
    createDebugButton();
    
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
 * Initialize relationship type selection
 */
function initRelationshipSelection() {
    const relationshipTypes = document.querySelectorAll('.relationship-type');
    
    if (!relationshipTypes.length) {
        logDebug('ERROR: No relationship types found');
        return;
    }
    
    logDebug(`Found ${relationshipTypes.length} relationship types`);
    
    relationshipTypes.forEach(type => {
        type.addEventListener('click', function() {
            // Remove selected class from all types
            relationshipTypes.forEach(t => t.classList.remove('selected'));
            
            // Add selected class to clicked type
            this.classList.add('selected');
            
            // Save selected relation
            selectedRelation = this.getAttribute('data-relation');
            logDebug(`Selected relationship: ${selectedRelation}`);
        });
    });
}

/**
 * Initialize back and next buttons
 */
function initButtons() {
    // Back button
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'emotional-entry.html';
        });
    } else {
        logDebug('ERROR: Back button not found');
    }
    
    // Next button
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (validateForm()) {
                saveDataAndNavigate();
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
            
            // Disable save connection option
            const saveConnectionOption = document.getElementById('save-connection');
            if (saveConnectionOption) {
                saveConnectionOption.disabled = true;
                saveConnectionOption.parentElement.style.opacity = '0.5';
            }
            
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
 * Validate the form
 */
function validateForm() {
    const nameInput = document.getElementById('recipient-name');
    if (!nameInput) {
        logDebug('ERROR: Recipient name input not found');
        return false;
    }
    
    const name = nameInput.value.trim();
    if (!name) {
        logDebug('Validation failed: No recipient name');
        return false;
    }
    
    if (!selectedRelation) {
        logDebug('Validation failed: No relationship selected');
        return false;
    }
    
    return true;
}

/**
 * Save data and navigate to the next page
 */
async function saveDataAndNavigate() {
    logDebug('Attempting to save data and navigate...');
    try {
        const nameInput = document.getElementById('recipient-name');
        const name = nameInput.value.trim();
        const saveConnectionCheckbox = document.getElementById('save-connection');
        const shouldSave = saveConnectionCheckbox ? saveConnectionCheckbox.checked : false;
        const isSaveDisabled = saveConnectionCheckbox ? saveConnectionCheckbox.disabled : false; // Check if disabled (e.g., by bypass)
        
        // Prepare recipient data for localStorage (for next page)
        const recipientDataForStorage = {
            name: name,
            relationship: selectedRelation,
            // We won't pass shouldSave to the next page via localStorage
        };
        localStorage.setItem('recipientData', JSON.stringify(recipientDataForStorage));
        logDebug('Recipient data saved to localStorage for next page.');

        // Save to Firestore if requested and not disabled
        if (shouldSave && !isSaveDisabled) {
            logDebug('Save connection checkbox is checked. Attempting to save to Firestore...');
            const user = firebase.auth().currentUser;
            if (user) {
                const connectionData = {
                    name: name,
                    relationship: selectedRelation,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp() 
                    // Add any other fields you want to save for a connection
                };
                
                try {
                    // Use await here to ensure saving completes (or fails) before navigation attempt
                    const docRef = await firebase.firestore()
                        .collection('users')
                        .doc(user.uid)
                        .collection('connections')
                        .add(connectionData);
                    logDebug(`Connection successfully saved to Firestore with ID: ${docRef.id}`);
                } catch (error) {
                    logDebug(`ERROR: Failed to save connection to Firestore: ${error.message}`);
                    // Decide how to handle save failure - maybe alert user but still navigate?
                    showAlert('Could not save connection: ' + error.message, 'error'); 
                    // Don't return here, proceed to navigation anyway
                }
            } else {
                logDebug('WARNING: Cannot save connection because user is not logged in.');
                // Optionally alert the user they need to be logged in to save
            }
        } else {
             logDebug('Not saving connection to Firestore (checkbox unchecked or disabled).');
        }
        
        // Navigate to the next page regardless of save success/failure for now
        const nextPage = `message-intent-new.html?emotion=${urlEmotion}`;
        logDebug(`Navigating to: ${nextPage}`);
        window.location.href = nextPage;

    } catch (error) {
        logDebug(`ERROR in saveDataAndNavigate: ${error.message}`);
        showAlert('An unexpected error occurred.', 'error');
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