/**
 * HeartGlowAI - Message Result Page
 * This file handles all the functionality for the message result page
 */

let recipientData = null;
let intentData = null;
let toneData = null;
let selectedEmotion = null;
let generatedMessage = null;
let selectedAdjustments = [];
let authBypass = false;

// Auth Promise Setup
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
    logDebug(`[Result Page] Starting initialization, Auth State: ${authStateResolved ? 'Resolved' : 'Not Resolved'}`);
    
    try {
        // Initialize user menu functionality
        initUserMenu();
        
        // Check authentication state
        checkAuthentication();
        
        // Initialize message actions (edit, copy, share)
        initMessageActions();
        
        // Load data from previous steps
        loadData();
        
        // Fix the navigation buttons
        setupNavigationButtons();
        
        // Ensure the recipient avatar is properly initialized
        initializeRecipientAvatar();
        
        // Firebase will try to load previous data
        // authStatePromise will resolve with user object or null
        authStatePromise.then(user => {
            if (user) {
                // User is signed in, try to generate message
                generateMessage();
            } else {
                // No user signed in, still try to generate with local storage data
                generateMessage();
            }
        }).catch(error => {
            console.error('Auth state promise error:', error);
            showError('Authentication error. Please try again later.');
        });
    } catch (error) {
        console.error('Error in initPage:', error);
        showError('Failed to initialize. Please refresh the page.');
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
 * Initialize user menu dropdown
 */
function initUserMenu() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            if (userDropdown.classList.contains('show')) {
                userDropdown.classList.remove('show');
            }
        });
        
        // Handle logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                if (firebase.auth) {
                    firebase.auth().signOut()
                        .then(() => {
                            window.location.href = 'index.html';
                        })
                        .catch((error) => {
                            console.error('Logout error:', error);
                            showAlert('Failed to log out. Please try again.', 'error');
                        });
                } else {
                    window.location.href = 'index.html';
                }
            });
        }
        
        // Update user info if authenticated
        if (firebase.auth) {
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    // Update user info in the dropdown
                    updateUserInfo(user);
                }
            });
        }
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
 * Load all required data from localStorage
 */
function loadData() {
    try {
        // Load recipient data
        const storedRecipientData = localStorage.getItem('recipientData') || localStorage.getItem('selectedRecipient');
        if (storedRecipientData) {
            recipientData = JSON.parse(storedRecipientData);
            logDebug(`Loaded recipient data from localStorage: ${JSON.stringify(recipientData)}`);
            
            // Ensure that connection ID is available if it exists in the data
            if (recipientData.id) {
                logDebug(`Found connection ID in recipient data: ${recipientData.id}`);
            } else {
                logDebug('No connection ID found in recipient data');
            }
            
            updateRecipientDisplay();
        } else {
            console.error('No recipient data found');
            logDebug('No recipient data found in localStorage');
        }
        
        // Load intent data
        const storedIntentData = localStorage.getItem('intentData');
        if (storedIntentData) {
            intentData = JSON.parse(storedIntentData);
            logDebug(`Loaded intent data from localStorage: ${JSON.stringify(intentData)}`);
            updateIntentDisplay();
        } else {
            console.error('No intent data found');
            logDebug('No intent data found in localStorage');
        }
        
        // Load tone data
        const storedToneData = localStorage.getItem('toneData') || localStorage.getItem('selectedTone');
        if (storedToneData) {
            toneData = JSON.parse(storedToneData);
            logDebug(`Loaded tone data from localStorage: ${JSON.stringify(toneData)}`);
            updateToneDisplay();
        } else {
            console.error('No tone data found');
            logDebug('No tone data found in localStorage');
        }
        
        // If any data is missing, show error
        if (!recipientData || !intentData || !toneData) {
            showError('Some information is missing. Please go back and complete all steps.');
        }
    } catch (error) {
        console.error('Error loading data:', error);
        logDebug(`Error loading data: ${error.message}`);
        showError('There was a problem loading your information.');
    }
}

/**
 * Update the recipient display with loaded data
 */
function updateRecipientDisplay() {
    if (!recipientData) return;
    
    const recipientName = document.getElementById('recipientName');
    const recipientRelation = document.getElementById('recipientRelation');
    const recipientInitial = document.getElementById('recipientInitial');
    
    if (recipientName) {
        recipientName.textContent = recipientData.name || 'Unknown Recipient';
    }
    
    if (recipientRelation) {
        recipientRelation.textContent = capitalizeFirstLetter(recipientData.relationship) || 'Contact';
    }
    
    if (recipientInitial) {
        recipientInitial.textContent = getInitials(recipientData.name);
    }
}

/**
 * Update the intent display with loaded data
 */
function updateIntentDisplay() {
    if (!intentData) return;
    
    const intentDisplay = document.getElementById('intentDisplay');
    
    if (intentDisplay) {
        let intentText = capitalizeFirstLetter(intentData.type);
        if (intentText === 'Custom' && intentData.customText) {
            intentText += ` (${intentData.customText})`;
        }
        intentDisplay.textContent = intentText;
    }
}

/**
 * Update the tone display with loaded data
 */
function updateToneDisplay() {
    if (!toneData) return;
    
    const toneDisplay = document.getElementById('toneDisplay');
    
    if (toneDisplay) {
        let toneText = capitalizeFirstLetter(toneData.type);
        if (toneText === 'Custom' && toneData.customText) {
            toneText += ` (${toneData.customText})`;
        }
        toneDisplay.textContent = toneText;
    }
}

/**
 * Initialize message actions (edit, copy, share)
 */
function initMessageActions() {
    // Edit button
    const editBtn = document.getElementById('editBtn');
    const editContainer = document.getElementById('editContainer');
    const editMessage = document.getElementById('editMessage');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const saveEditBtn = document.getElementById('saveEditBtn');
    
    if (editBtn && editContainer && editMessage && cancelEditBtn && saveEditBtn) {
        // Edit button click handler
        editBtn.addEventListener('click', function() {
            // Hide message content
            document.getElementById('messageContent').style.display = 'none';
            
            // Show edit container
            editContainer.style.display = 'block';
            
            // Set edit textarea content
            editMessage.value = generatedMessage || '';
            
            // Focus the textarea
            editMessage.focus();
        });
        
        // Cancel edit button
        cancelEditBtn.addEventListener('click', function() {
            // Hide edit container
            editContainer.style.display = 'none';
            
            // Show message content
            document.getElementById('messageContent').style.display = 'block';
        });
        
        // Save edit button
        saveEditBtn.addEventListener('click', function() {
            // Get edited message
            const editedMessage = editMessage.value.trim();
            
            // Validate
            if (!editedMessage) {
                showAlert('Please enter a message', 'error');
                return;
            }
            
            // Update message content
            generatedMessage = editedMessage;
            document.getElementById('content').textContent = editedMessage;
            
            // Hide edit container
            editContainer.style.display = 'none';
            
            // Show message content
            document.getElementById('messageContent').style.display = 'block';
            
            // Show success message
            showAlert('Message updated successfully', 'success');
        });
    }
    
    // Copy button
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            copyMessageToClipboard();
        });
    }
    
    // Copy insights button
    const copyInsightsBtn = document.getElementById('copyInsightsBtn');
    if (copyInsightsBtn) {
        copyInsightsBtn.addEventListener('click', function() {
            copyInsightsToClipboard();
        });
    }
    
    // Share button
    const shareBtn = document.getElementById('shareBtn');
    const shareModal = document.getElementById('shareModal');
    const closeShareModal = document.getElementById('closeShareModal');
    const shareOptions = document.querySelectorAll('.share-option');
    
    if (shareBtn && shareModal && closeShareModal) {
        // Share button click handler
        shareBtn.addEventListener('click', function() {
            // Show share modal
            shareModal.style.display = 'block';
            
            // Add animation class for entry
            setTimeout(() => {
                shareModal.classList.add('show');
            }, 10);
        });
        
        // Close modal button
        closeShareModal.addEventListener('click', function() {
            hideShareModal();
        });
        
        // Close modal function
        function hideShareModal() {
            // Remove animation class first
            shareModal.classList.remove('show');
            
            // Hide after animation completes
            setTimeout(() => {
                shareModal.style.display = 'none';
            }, 300);
        }
        
        // Close when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === shareModal) {
                hideShareModal();
            }
        });
        
        // Share options
        if (shareOptions) {
            shareOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const platform = this.getAttribute('data-platform');
                    shareMessage(platform);
                    hideShareModal();
                });
            });
        }
    }
}

/**
 * Copy message text to clipboard
 */
function copyMessageToClipboard() {
    if (!generatedMessage) {
        showAlert('No message to copy', 'error');
        return;
    }
    
    // Create a temporary textarea element to copy from
    const textarea = document.createElement('textarea');
    textarea.value = generatedMessage;
    document.body.appendChild(textarea);
    
    // Select and copy
    textarea.select();
    document.execCommand('copy');
    
    // Clean up
    document.body.removeChild(textarea);
    
    // Show success message
    showAlert('Message copied to clipboard!', 'success');
    
    // Add animation to the copy button
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<i class="fas fa-check"></i> <span>Copied!</span>';
        
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> <span>Copy</span>';
        }, 2000);
    }
}

/**
 * Copy message insights to clipboard
 */
function copyInsightsToClipboard() {
    const insightsContent = document.getElementById('insightsContent');
    if (!insightsContent || !insightsContent.textContent.trim()) {
        showAlert('No insights to copy', 'error');
        return;
    }
    
    // Extract text from insights content
    let insightsText = "Why This Message Works:\n";
    const insightsList = insightsContent.querySelectorAll('li');
    
    if (insightsList && insightsList.length > 0) {
        insightsList.forEach((item, index) => {
            insightsText += `${index + 1}. ${item.textContent.trim()}\n`;
        });
    } else {
        insightsText += insightsContent.textContent.trim();
    }
    
    // Create a temporary textarea element to copy from
    const textarea = document.createElement('textarea');
    textarea.value = insightsText;
    document.body.appendChild(textarea);
    
    // Select and copy
    textarea.select();
    document.execCommand('copy');
    
    // Clean up
    document.body.removeChild(textarea);
    
    // Show success message
    showAlert('Insights copied to clipboard!', 'success');
    
    // Add animation to the insights copy button
    const copyInsightsBtn = document.getElementById('copyInsightsBtn');
    if (copyInsightsBtn) {
        copyInsightsBtn.classList.add('copied');
        copyInsightsBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        setTimeout(() => {
            copyInsightsBtn.classList.remove('copied');
            copyInsightsBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Insights';
        }, 2000);
    }
}

/**
 * Show loading state with improved loading indicator
 */
function showLoadingState() {
    try {
        console.log("Showing loading state...");
        
        // Get all the elements we need to control
        const loadingState = document.getElementById('loadingState');
        const messageContent = document.getElementById('messageContent');
        const errorState = document.getElementById('errorState');
        const regenerateOptions = document.getElementById('regenerateOptions');
        const messageInsights = document.getElementById('messageInsights');
        
        // Hide everything except loading
        if (messageContent) messageContent.style.display = 'none';
        if (errorState) errorState.style.display = 'none';
        if (regenerateOptions) regenerateOptions.style.display = 'none';
        if (messageInsights) messageInsights.style.display = 'none';
        
        // Show loading state
        if (loadingState) loadingState.style.display = 'flex';
    } catch (error) {
        console.error('Error showing loading state:', error);
    }
}

/**
 * Show error state with better UI
 */
function showError(message) {
    try {
        console.error("Showing error state:", message);
        
        // Get all the elements we need to control
        const loadingState = document.getElementById('loadingState');
        const messageContent = document.getElementById('messageContent');
        const errorState = document.getElementById('errorState');
        const errorText = document.getElementById('errorText');
        const regenerateOptions = document.getElementById('regenerateOptions');
        const messageInsights = document.getElementById('messageInsights');
        
        // Hide everything except error
        if (loadingState) loadingState.style.display = 'none';
        if (messageContent) messageContent.style.display = 'none';
        if (regenerateOptions) regenerateOptions.style.display = 'none';
        if (messageInsights) messageInsights.style.display = 'none';
        
        // Update error message
        if (errorText) {
            errorText.textContent = message || 'An error occurred while generating your message. Please try again.';
        }
        
        // Show error state
        if (errorState) {
            errorState.style.display = 'block';
        }
    } catch (error) {
        console.error('Error showing error state:', error);
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
 * Initialize adjustment options
 */
function initAdjustmentOptions() {
    const regenerateOptions = document.getElementById('regenerateOptions');
    
    if (!regenerateOptions) {
        console.error('Regenerate options container not found');
        return;
    }
    
    // Get all the option cards
    const optionCards = regenerateOptions.querySelectorAll('.option-card');
    
    // Add click event to each option
    optionCards.forEach(card => {
        card.addEventListener('click', function() {
            // Get variation type
            const variation = this.getAttribute('data-variation');
            
            // Remove selected class from all cards
            optionCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected class to clicked card
            this.classList.add('selected');
            
            // Show loading state
            showLoadingState();
            
            // Hide regenerate options
            regenerateOptions.style.display = 'none';
            
            // Generate new message with variation
            generateMessage(variation);
        });
    });
}

/**
 * Initialize message options
 */
function initMessageOptions() {
    const copyBtn = document.getElementById('copy-btn');
    const shareBtn = document.getElementById('share-btn');
    const saveBtn = document.getElementById('save-btn');
    
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            if (generatedMessage) {
                navigator.clipboard.writeText(generatedMessage)
                    .then(() => {
                        showAlert('Message copied to clipboard!', 'success');
                    })
                    .catch(err => {
                        logDebug(`ERROR: Failed to copy: ${err}`);
                        showAlert('Failed to copy message', 'error');
                    });
            }
        });
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            if (generatedMessage) {
                // In a real implementation, this would open sharing options
                showAlert('Sharing functionality not available in this demo', 'info');
            }
        });
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            if (generatedMessage) {
                // In a real implementation, this would save to history
                showAlert('Message saved to history!', 'success');
            }
        });
    }
}

/**
 * Initialize buttons and UI elements
 */
function initButtons() {
    try {
        // Back button
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                window.location.href = 'message-tone-new.html';
            });
        } else {
            logDebug('ERROR: Back button not found');
        }
        
        // Next/Done button
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                // In a real implementation, this might save the message and go to home
                showAlert('Message process completed!', 'success');
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            });
        } else {
            logDebug('ERROR: Next button not found');
        }
        
        // Initialize message options
        initMessageOptions();
    } catch (error) {
        console.error('Error initializing buttons:', error);
    }
}

/**
 * Authentication check logic (similar to message-tone-new.js)
 */
function checkAuthentication() {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
        logDebug('[Result Page] Found auth token in localStorage. Assuming authenticated initially.');
    }

    if (window.firebase && firebase.auth) {
        logDebug('[Result Page] Setting up onAuthStateChanged listener...');
        firebase.auth().onAuthStateChanged(function(user) {
            logDebug(`[Result Page] >>> onAuthStateChanged Fired! User: ${user ? user.uid : 'null'}. Already resolved: ${authStateResolved}`);
            if (!authStateResolved) {
                 if (user) {
                    logDebug(`   [Result Listener Initial] User found directly. Resolving promise with user.`);
                    user.getIdToken(true).then(token => localStorage.setItem('authToken', token)).catch(e => logDebug('Error refreshing token initial', e)); 
                    authStatePromiseResolver(user);
                    authStateResolved = true;
                } else {
                    logDebug('   [Result Listener Initial] Initial trigger is NULL. Setting 250ms timeout...');
                    setTimeout(() => {
                        logDebug('   [Result Listener Timeout Check] Timeout finished.');
                        if (!authStateResolved) {
                            const currentUserAfterDelay = firebase.auth().currentUser;
                            logDebug(`   [Result Listener Timeout Check] State after delay: ${currentUserAfterDelay ? currentUserAfterDelay.uid : 'null'}`);
                            if (currentUserAfterDelay) {
                                logDebug('   [Result Listener Timeout Check] User found after delay. Resolving promise with user.');
                                authStatePromiseResolver(currentUserAfterDelay);
                            } else {
                                logDebug('   [Result Listener Timeout Check] No user after delay. ***NOT deleting token***. Resolving promise with null.');
                                authStatePromiseResolver(null);
                                // Don't show debug console here, initPage handles error display if needed
                            }
                            authStateResolved = true;
                        }
                    }, 250); 
                }
            } else {
                 logDebug('   [Result Listener Subsequent] Fired again after promise was resolved.');
                 if (!user) {
                      logDebug('   [Result Listener Subsequent] Subsequent fire reports logged out user. Clearing token NOW.');
                      localStorage.removeItem('authToken'); 
                      // Might need to update UI or show error if user logs out while on this page
                 }
            }
        });
    } else {
        logDebug('[Result Page] WARNING: Firebase auth not available. Resolving promise with null.');
        authStatePromiseResolver(null); 
        authStateResolved = true;
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
 * Setup the navigation buttons
 */
function setupNavigationButtons() {
    // Get all necessary buttons
    const backButton = document.getElementById('backBtn');
    const dashboardButton = document.getElementById('dashboardBtn');
    
    // Add event listeners
    if (backButton) {
        console.log('Setting up back button');
        backButton.addEventListener('click', function() {
            console.log('Back button clicked');
            window.location.href = 'message-tone-new.html';
        });
    } else {
        console.warn('Back button not found');
    }
    
    if (dashboardButton) {
        console.log('Setting up dashboard button');
        dashboardButton.addEventListener('click', function() {
            console.log('Dashboard button clicked');
            // Save the generated message before redirecting if available
            if (generatedMessage) {
                console.log('Message available, saving before navigation');
                // Save to local storage for future reference
                const savedMessages = JSON.parse(localStorage.getItem('savedMessages') || '[]');
                savedMessages.push({
                    message: typeof generatedMessage === 'string' ? generatedMessage : generatedMessage.content || generatedMessage,
                    timestamp: new Date().toISOString(),
                    recipientName: recipientData ? recipientData.name : 'Unknown',
                    relationship: recipientData ? recipientData.relationship : 'Unknown',
                    intent: intentData ? intentData.type : 'General',
                    tone: toneData ? toneData.type : 'Warm'
                });
                localStorage.setItem('savedMessages', JSON.stringify(savedMessages));
            }
            
            // Navigate to dashboard
            window.location.href = 'home.html';
        });
    } else {
        console.warn('Dashboard button not found');
    }
    
    // Add a simple function to handle the retry button for error state
    const retryButton = document.getElementById('retryButton');
    if (retryButton) {
        console.log('Setting up retry button');
        retryButton.addEventListener('click', function() {
            console.log('Retry button clicked');
            generateMessage();
        });
    }
    
    // Setup action buttons for message
    setupMessageActionButtons();
}

/**
 * Setup all message action buttons
 */
function setupMessageActionButtons() {
    // Edit button
    const editBtn = document.getElementById('editBtn');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            startEditing();
        });
    }
    
    // Copy button
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            copyMessageToClipboard();
        });
    }
    
    // Share button
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            openShareModal();
        });
    }
    
    // Regenerate button
    const regenerateBtn = document.getElementById('regenerateBtn');
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', function() {
            showRegenerateOptions();
        });
    }
    
    // Cancel regenerate button
    const cancelRegenerateBtn = document.getElementById('cancelRegenerateBtn');
    if (cancelRegenerateBtn) {
        cancelRegenerateBtn.addEventListener('click', function() {
            hideRegenerateOptions();
        });
    }
}

/**
 * Initialize the recipient avatar with initials
 */
function initializeRecipientAvatar() {
    try {
        const recipientData = JSON.parse(localStorage.getItem('recipientData') || '{}');
        const initialElement = document.getElementById('recipientInitial');
        const nameElement = document.getElementById('recipientName');
        const relationElement = document.getElementById('recipientRelation');
        
        if (initialElement && recipientData.name) {
            // Get the first letter of the recipient's name
            const initial = recipientData.name.charAt(0).toUpperCase();
            initialElement.textContent = initial;
        }
        
        if (nameElement && recipientData.name) {
            nameElement.textContent = recipientData.name;
        }
        
        if (relationElement && recipientData.relationship) {
            relationElement.textContent = recipientData.relationship;
        }
    } catch (error) {
        console.error('Error initializing recipient avatar:', error);
    }
}

/**
 * Generate message based on user inputs
 */
function generateMessage(variation = null) {
    // Show loading state
    showLoadingState();
    
    try {
        // Get data from localStorage
        const intentData = JSON.parse(localStorage.getItem('intentData') || '{}');
        const recipientData = JSON.parse(localStorage.getItem('recipientData') || '{}');
        const toneData = JSON.parse(localStorage.getItem('toneData') || '{}');
        
        // Log the input data
        console.log("Intent data:", intentData);
        console.log("Recipient data:", recipientData);
        console.log("Tone data:", toneData);
        
        // Hide any error state that might be showing
        const errorState = document.getElementById('errorState');
        if (errorState) {
            errorState.style.display = 'none';
        }
        
        // Build the prompt and call the API
        buildOpenAIPrompt(intentData, recipientData, toneData, variation)
            .then(messagePrompt => {
                console.log("Prompt built successfully");
                
                // Get auth token if available
                const authToken = localStorage.getItem('authToken');
                
                // Call the message generation API with the complete prompt
                return callGenerationAPI(messagePrompt, authToken);
            })
            .then(response => {
                console.log("API response received");
                
                // Parse the response to extract message and insights
                const parsedResponse = parseOpenAIResponse(response);
                
                // Display the message
                displayGeneratedMessage(parsedResponse.message);
                
                // Only display insights if we actually have them from the API
                if (parsedResponse.insights && parsedResponse.insights.length > 0) {
                    displayMessageInsights(parsedResponse.insights);
                }
                
                // Setup the regenerate options
                initializeRegenerateOptions();
                
                // Save the message to Firebase for the current user
                saveMessageToFirebase(parsedResponse.message, parsedResponse.insights);
            })
            .catch(error => {
                console.error('Error in message generation flow:', error);
                showError('Error generating message. Please try again.');
            });
    } catch (error) {
        console.error('Exception in generateMessage:', error);
        showError('Failed to generate message. Please check your inputs and try again.');
    }
}

/**
 * Save the generated message to Firebase
 */
function saveMessageToFirebase(messageText, insights) {
    // Only proceed if the user is authenticated
    if (!firebase || !firebase.auth || !firebase.auth().currentUser) {
        logDebug('User not authenticated, message not saved to Firebase');
        return;
    }
    
    try {
        // Show a subtle saving indicator
        const savingIndicator = document.createElement('div');
        savingIndicator.className = 'saving-indicator';
        savingIndicator.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Saving message...';
        savingIndicator.style.position = 'fixed';
        savingIndicator.style.bottom = '20px';
        savingIndicator.style.right = '20px';
        savingIndicator.style.background = 'rgba(0,0,0,0.7)';
        savingIndicator.style.color = '#fff';
        savingIndicator.style.padding = '10px 15px';
        savingIndicator.style.borderRadius = '4px';
        savingIndicator.style.zIndex = '9999';
        savingIndicator.style.fontSize = '14px';
        document.body.appendChild(savingIndicator);
        
        // Get data from localStorage
        const intentData = JSON.parse(localStorage.getItem('intentData') || '{}');
        const recipientData = JSON.parse(localStorage.getItem('recipientData') || '{}');
        const toneData = JSON.parse(localStorage.getItem('toneData') || '{}');
        
        // Log the recipient data to verify connection ID
        logDebug(`Saving message to Firebase with recipient data: ${JSON.stringify(recipientData)}`);
        logDebug(`Connection ID from recipientData: ${recipientData.id}`);
        
        // Get current user ID
        const userId = firebase.auth().currentUser.uid;
        
        // Create message object
        const messageData = {
            content: messageText,
            insights: insights || [],
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            recipientName: recipientData.name || 'Unknown',
            relationship: recipientData.relationship || 'friend',
            connectionId: recipientData.id || null,
            type: intentData.type || 'general',
            tone: toneData.type || 'warm',
            toneIntensity: toneData.intensity || 'medium',
            createdBy: userId
        };
        
        // Log the final message data with connection ID
        logDebug(`Message data being saved to Firebase: ${JSON.stringify(messageData)}`);
        
        // Reference to Firestore
        const db = firebase.firestore();
        
        // If we have a connection ID, update the connection's message count
        if (recipientData.id) {
            logDebug(`Connection ID found: ${recipientData.id}. Updating connection with new message.`);
            // Use a transaction to ensure data consistency
            db.runTransaction(async (transaction) => {
                // Reference to the connection
                const connectionRef = db.collection('users').doc(userId)
                    .collection('connections').doc(recipientData.id);
                
                // Get current connection data
                const connectionDoc = await transaction.get(connectionRef);
                
                // Check if connection exists
                if (!connectionDoc.exists) {
                    throw new Error('Connection does not exist');
                }
                
                // Create message document
                const messageRef = db.collection('users').doc(userId)
                    .collection('messages').doc();
                
                // Get the connection data
                const connectionData = connectionDoc.data();
                
                // Calculate new message count
                const currentCount = connectionData.messageCount || 0;
                const newCount = currentCount + 1;
                
                // Update connection with message count
                transaction.update(connectionRef, { 
                    messageCount: newCount,
                    lastMessageDate: firebase.firestore.FieldValue.serverTimestamp(),
                    // Add the connection ID to the message data
                    lastMessageType: intentData.type || 'general'
                });
                
                // Save the message with connection data
                transaction.set(messageRef, {
                    ...messageData,
                    // Include connection info in message
                    connectionId: recipientData.id,
                    connectionName: connectionData.name || recipientData.name,
                    messageNumber: newCount  // Which message number this is for the connection
                });
                
                logDebug(`Message saved with ID: ${messageRef.id} for connection: ${recipientData.id}`);
                return { messageId: messageRef.id, connectionId: recipientData.id };
            })
            .then(result => {
                logDebug(`Transaction successfully completed. Message ID: ${result.messageId}`);
                // Remove saving indicator with success message
                savingIndicator.innerHTML = '<i class="fas fa-check"></i> Message saved!';
                savingIndicator.style.background = 'rgba(0,128,0,0.7)';
                setTimeout(() => {
                    try {
                        document.body.removeChild(savingIndicator);
                    } catch (e) {
                        // Ignore if already removed
                    }
                }, 3000);
            })
            .catch(error => {
                console.error('Transaction failed:', error);
                // Save message without updating connection as fallback
                saveMessageWithoutConnection(userId, messageData, savingIndicator);
            });
        } else {
            // No connection ID, save message normally
            saveMessageWithoutConnection(userId, messageData, savingIndicator);
        }
    } catch (error) {
        console.error('Error preparing message for Firebase:', error);
        // Still try to show a temporary error notification
        const errorIndicator = document.createElement('div');
        errorIndicator.style.position = 'fixed';
        errorIndicator.style.bottom = '20px';
        errorIndicator.style.right = '20px';
        errorIndicator.style.background = 'rgba(200,0,0,0.7)';
        errorIndicator.style.color = '#fff';
        errorIndicator.style.padding = '10px 15px';
        errorIndicator.style.borderRadius = '4px';
        errorIndicator.style.zIndex = '9999';
        errorIndicator.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error saving message';
        document.body.appendChild(errorIndicator);
        setTimeout(() => {
            try {
                document.body.removeChild(errorIndicator);
            } catch (e) {
                // Ignore if already removed
            }
        }, 3000);
    }
}

/**
 * Helper function to save message without connection
 */
function saveMessageWithoutConnection(userId, messageData, savingIndicator) {
    firebase.firestore()
        .collection('users')
        .doc(userId)
        .collection('messages')
        .add(messageData)
        .then(docRef => {
            logDebug(`Message saved to Firebase with ID: ${docRef.id}`);
            // Update indicator to show success
            savingIndicator.innerHTML = '<i class="fas fa-check"></i> Message saved!';
            savingIndicator.style.background = 'rgba(0,128,0,0.7)';
            setTimeout(() => {
                try {
                    document.body.removeChild(savingIndicator);
                } catch (e) {
                    // Ignore if already removed
                }
            }, 3000);
        })
        .catch(error => {
            console.error('Error saving message to Firebase:', error);
            // Update indicator to show error
            savingIndicator.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error saving message';
            savingIndicator.style.background = 'rgba(200,0,0,0.7)';
            setTimeout(() => {
                try {
                    document.body.removeChild(savingIndicator);
                } catch (e) {
                    // Ignore if already removed
                }
            }, 3000);
        });
}

/**
 * Build the OpenAI prompt based on user inputs
 * @returns {Promise<Object>} Promise that resolves to the complete request data
 */
function buildOpenAIPrompt(intentData, recipientData, toneData, variation = null) {
    // Log all available data for debugging
    console.log('Building prompt with data:', { intentData, recipientData, toneData, variation });
    logDebug('Building prompt with recipient data: ' + JSON.stringify(recipientData));
    
    // Create a structured request object that matches our cloud function expectations
    const requestData = {
        intent: {
            type: intentData.type || 'Support',
            details: intentData.details || ''
        },
        recipient: {
            name: recipientData.name || 'Friend',
            relationship: recipientData.relationship || 'Friend',
            relationshipCategory: recipientData.specificRelationship || recipientData.relationshipCategory || '',
            relationshipFocus: recipientData.relationshipGoal || recipientData.relationshipFocus || '',
            yearsKnown: recipientData.yearsKnown || '',
            communicationStyle: recipientData.communicationStyle || '',
            personalNotes: recipientData.notes || recipientData.personalNotes || ''
        },
        tone: {
            type: toneData.type || 'Warm',
            intensity: toneData.intensity || 'Medium'
        },
        variation: variation
    };
    
    // Return a promise to allow proper async handling
    return new Promise((resolve) => {
        // Try to fetch additional data if available
        if (recipientData.id && firebase.auth && firebase.auth().currentUser) {
            const userId = firebase.auth().currentUser.uid;
            console.log(`Fetching additional connection data for ID: ${recipientData.id}`);
            
            // Try to get the full connection data from Firestore
            firebase.firestore()
                .collection('users')
                .doc(userId)
                .collection('connections')
                .doc(recipientData.id)
                .get()
                .then(doc => {
                    if (doc.exists) {
                        const fullConnectionData = doc.data();
                        console.log('Retrieved full connection data:', fullConnectionData);
                        logDebug('Retrieved full connection data: ' + JSON.stringify(fullConnectionData));
                        
                        // Update the request data with any additional fields
                        requestData.recipient.yearsKnown = fullConnectionData.yearsKnown || requestData.recipient.yearsKnown;
                        requestData.recipient.communicationStyle = fullConnectionData.communicationStyle || requestData.recipient.communicationStyle;
                        requestData.recipient.personalNotes = fullConnectionData.notes || requestData.recipient.personalNotes;
                        requestData.recipient.relationshipCategory = fullConnectionData.specificRelationship || fullConnectionData.relationshipCategory || requestData.recipient.relationshipCategory;
                        requestData.recipient.relationshipFocus = fullConnectionData.relationshipGoal || fullConnectionData.relationshipFocus || requestData.recipient.relationshipFocus;
                        
                        // Add any additional fields that might be useful
                        if (fullConnectionData.birthday) {
                            requestData.recipient.birthday = fullConnectionData.birthday;
                        }
                        
                        if (fullConnectionData.interests) {
                            requestData.recipient.interests = fullConnectionData.interests;
                        }
                        
                        // Log the updated request for debugging
                        console.log('Updated prompt with full connection data:', requestData);
                        logDebug('Updated prompt with full connection data: ' + JSON.stringify(requestData));
                        resolve(requestData);
                    } else {
                        console.log('No connection document found, using existing data');
                        logDebug('No connection document found');
                        resolve(requestData);
                    }
                })
                .catch(error => {
                    console.error('Error fetching connection data:', error);
                    logDebug('Error fetching connection data: ' + error.message);
                    // Return the initial request data if there's an error
                    resolve(requestData);
                });
        } else {
            // No connection ID or not logged in, use what we have
            console.log('No connection ID or user not logged in, using existing data');
            logDebug('No connection ID or user not logged in');
            resolve(requestData);
        }
    });
}

/**
 * Parse the OpenAI API response to extract message and insights
 */
function parseOpenAIResponse(response) {
    try {
        console.log("Parsing API response...");
        
        // Initialize with default values
        let message = '';
        let insights = [];
        
        // Handle different response formats
        if (typeof response === 'string') {
            // Simple string response - use it as message
            message = response;
        } else if (response && typeof response === 'object') {
            // Complex object response
            if (response.choices && response.choices.length > 0) {
                // Standard OpenAI API response format
                const choice = response.choices[0];
                
                if (choice.message && choice.message.content) {
                    message = choice.message.content;
                } else if (choice.text) {
                    message = choice.text;
                }
            } else if (response.content) {
                // Our custom format
                message = response.content;
                
                if (response.insights && Array.isArray(response.insights)) {
                    insights = response.insights;
                }
            } else if (response.message) {
                // Another possible format
                message = response.message;
                
                if (response.insights && Array.isArray(response.insights)) {
                    insights = response.insights;
                }
            }
        }
        
        // If we don't have explicit insights but have a message,
        // try to extract insights by detecting a specific pattern in the message
        if (insights.length === 0 && message) {
            const insightsMatch = message.match(/###\s*INSIGHTS\s*###([\s\S]*?)(?=###|$)/i);
            
            if (insightsMatch && insightsMatch[1]) {
                // Extract insights section and clean the original message
                const insightsText = insightsMatch[1].trim();
                
                // Remove the insights section from the message
                message = message.replace(/###\s*INSIGHTS\s*###[\s\S]*?(###|$)/i, '$1').trim();
                
                // Split insights by lines or bullet points
                insights = insightsText
                    .split(/\n+/)
                    .map(line => line.replace(/^[-*•]\s*/, '').trim())
                    .filter(line => line.length > 0);
            }
        }
        
        return {
            message: message,
            insights: insights
        };
    } catch (error) {
        console.error('Error parsing API response:', error);
        return {
            message: response.toString(),
            insights: []
        };
    }
}

/**
 * Call the API to generate a message
 */
function callGenerationAPI(prompt, authToken = null) {
    return new Promise((resolve, reject) => {
        // Show extended loading time for API call
        const loadingMessage = document.querySelector('.loading-message p');
        if (loadingMessage) {
            loadingMessage.textContent = 'Creating your heartfelt message...';
        }
        
        // Log the API call attempt
        logDebug('Calling message generation API...');
        console.log('Starting API call process with prompt:', prompt);
        
        // First get auth token, then get API keys from Firestore, then make API call
        const getAuthToken = new Promise((resolveToken, rejectToken) => {
            if (authToken) {
                logDebug('Using existing auth token from localStorage');
                resolveToken(authToken);
            } else if (firebase && firebase.auth && firebase.auth().currentUser) {
                logDebug('Getting fresh token from current Firebase user');
                firebase.auth().currentUser.getIdToken(true)
                    .then(token => {
                        localStorage.setItem('authToken', token);
                        resolveToken(token);
                    })
                    .catch(error => {
                        console.error('Error getting auth token:', error);
                        rejectToken(error);
                    });
            } else {
                logDebug('No authentication method available, proceeding without token');
                resolveToken(null);
            }
        });
        
        // Get the auth token, then use it to fetch the OpenAI API key from Firestore
        getAuthToken
            .then(token => {
                // Get the API key from Firestore's 'secrets' collection
                logDebug('Getting API keys from Firestore...');
                console.log('Fetching API key from Firebase...');
                return firebase.firestore().collection('secrets').doc('secrets').get()
                    .then(doc => {
                        if (doc.exists && doc.data().openaikey) {
                            logDebug('API key retrieved successfully');
                            console.log('API key retrieved from Firebase');
                            return { 
                                token: token, 
                                apiKey: doc.data().openaikey
                            };
                        } else {
                            throw new Error('API key not found in Firestore');
                        }
                    });
            })
            .then(({ token, apiKey }) => {
                // Now that we have the API key, we can make a direct call to OpenAI
                // or use our cloud function with the key included in the request
                
                const apiUrl = 'https://us-central1-heartglowai.cloudfunctions.net/generateMessageV2';
                
                logDebug('Making API call with auth token and OpenAI API key');
                console.log('Making API call to:', apiUrl);
                
                // Prepare request with API key included
                const requestBody = {
                    ...prompt,
                    apiKey: apiKey // Include OpenAI API key in the request body
                };
                
                // Make the API call to your cloud function
                return fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : ''
                    },
                    body: JSON.stringify(requestBody)
                });
            })
            .then(response => {
                // Check if the request was successful
                console.log('API response received, status:', response.status);
                if (!response.ok) {
                    throw new Error(`API responded with status ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Log success
                logDebug('API call successful');
                console.log('API call successful, data received');
                
                // If there's an error in the response
                if (data.error) {
                    throw new Error(data.error);
                }
                
                // Resolve with the data
                resolve(data);
            })
            .catch(error => {
                // Log error
                console.error('API call failed:', error);
                logDebug('API call failed: ' + error.message);
                
                // Show error in UI
                const loadingState = document.getElementById('loadingState');
                const errorState = document.getElementById('errorState');
                const errorText = document.getElementById('errorText');
                
                if (loadingState) loadingState.style.display = 'none';
                if (errorState) errorState.style.display = 'block';
                if (errorText) errorText.textContent = `Failed to generate message: ${error.message || 'Server error'}`;
                
                // Never fall back to demo messages
                reject(error);
            });
    });
}

/**
 * Display message insights in the UI with proper formatting
 */
function displayMessageInsights(insights) {
    try {
        console.log("Displaying message insights...");
        if (!insights || !Array.isArray(insights) || insights.length === 0) {
            console.log("No insights to display");
            return;
        }
        
        // Get the insights container and content
        const insightsContainer = document.getElementById('messageInsights');
        const insightsContent = document.getElementById('insightsContent');
        
        if (!insightsContainer || !insightsContent) {
            console.error("Insights container or content element not found");
            return;
        }
        
        // Clear any existing content
        insightsContent.innerHTML = '';
        
        // Add each insight as a separate item with proper styling
        insights.forEach((insight) => {
            // Clean up the insight text
            let insightText = insight;
            
            // Check if insight already has strong/bold markup
            if (!insightText.includes('<strong>') && !insightText.includes('<b>')) {
                // Try to identify if there's a title pattern like "Personal Connection:" 
                const titleMatch = insightText.match(/^([^:]+):(.*)/);
                if (titleMatch) {
                    const [, title, content] = titleMatch;
                    insightText = `<strong>${title}:</strong>${content}`;
                }
            }
            
            const insightElement = document.createElement('div');
            insightElement.className = 'insight-item';
            insightElement.innerHTML = insightText;
            insightsContent.appendChild(insightElement);
        });
        
        // Show the insights container only if we have insights
        if (insights.length > 0) {
            insightsContainer.style.display = 'block';
            
            // Add a "Copy Insights" button if it doesn't exist
            if (!document.querySelector('.insights-footer')) {
                const footerDiv = document.createElement('div');
                footerDiv.className = 'insights-footer';
                footerDiv.style.padding = '1rem 2rem 1.5rem';
                footerDiv.style.textAlign = 'right';
                footerDiv.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
                
                const copyBtn = document.createElement('button');
                copyBtn.id = 'copyInsightsBtn';
                copyBtn.className = 'insights-copy-btn';
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Insights';
                copyBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                copyBtn.style.color = '#e0e0e0';
                copyBtn.style.border = 'none';
                copyBtn.style.padding = '0.6rem 1.2rem';
                copyBtn.style.borderRadius = '8px';
                copyBtn.style.cursor = 'pointer';
                copyBtn.style.transition = 'all 0.2s ease';
                
                copyBtn.addEventListener('mouseenter', function() {
                    this.style.background = 'rgba(255, 255, 255, 0.2)';
                    this.style.transform = 'translateY(-2px)';
                });
                
                copyBtn.addEventListener('mouseleave', function() {
                    this.style.background = 'rgba(255, 255, 255, 0.1)';
                    this.style.transform = 'translateY(0)';
                });
                
                // Add event listener for copying
                copyBtn.addEventListener('click', function() {
                    const insightText = Array.from(insightsContent.querySelectorAll('.insight-item'))
                        .map(item => item.textContent.trim())
                        .join('\n\n');
                    
                    navigator.clipboard.writeText(insightText)
                        .then(() => showToast('Insights copied to clipboard!'))
                        .catch(err => {
                            console.error('Failed to copy insights:', err);
                            showToast('Failed to copy insights', 'error');
                        });
                });
                
                footerDiv.appendChild(copyBtn);
                insightsContainer.appendChild(footerDiv);
            }
        } else {
            insightsContainer.style.display = 'none';
        }
    } catch (error) {
        console.error('Error displaying insights:', error);
    }
}

/**
 * Display the generated message in the UI with proper formatting
 */
function displayGeneratedMessage(message) {
    try {
        console.log("Displaying generated message...");
        
        // Hide loading state
        const loadingState = document.getElementById('loadingState');
        if (loadingState) {
            loadingState.style.display = 'none';
        }
        
        // Store the message for later reference
        generatedMessage = message;
        
        // Show message content container
        const messageContent = document.getElementById('messageContent');
        if (messageContent) {
            messageContent.style.display = 'block';
        }
        
        // Format and display the message text with proper styling
        const contentElement = document.getElementById('content');
        if (contentElement && message) {
            // Clean the message text
            message = message.trim();
            
            if (message.length > 0) {
                // Process paragraphs while preserving the drop cap on first letter
                const paragraphs = message.split(/\n\s*\n/);
                let formattedMessage = '';
                
                if (paragraphs.length > 0) {
                    // Handle first paragraph with drop cap
                    const firstParagraph = paragraphs[0];
                    const firstLetter = firstParagraph.charAt(0);
                    const restOfFirstParagraph = firstParagraph.substring(1);
                    
                    formattedMessage = `<span class="drop-cap">${firstLetter}</span>${restOfFirstParagraph}`;
                    
                    // Add remaining paragraphs with proper spacing
                    if (paragraphs.length > 1) {
                        for (let i = 1; i < paragraphs.length; i++) {
                            if (paragraphs[i].trim()) {
                                formattedMessage += `\n\n${paragraphs[i]}`;
                            }
                        }
                    }
                    
                    // Set the content
                    contentElement.innerHTML = formattedMessage;
                    
                    // Ensure paragraphs are properly displayed
                    const text = contentElement.textContent;
                    const formattedHtml = text
                        .replace(/\n\n/g, '</p><p style="margin-top: 1.5rem;">')
                        .replace(/\n/g, '<br>');
                    
                    // Insert the first letter as a drop cap
                    const finalHtml = '<p>' + formattedHtml + '</p>';
                    const withDropCap = finalHtml.replace('<p>', `<p><span class="drop-cap">${firstLetter}</span>${restOfFirstParagraph.substring(0, 1) === ' ' ? '' : ' '}`);
                    
                    contentElement.innerHTML = withDropCap;
                } else {
                    // Fallback for single line messages
                    const firstLetter = message.charAt(0);
                    const restOfMessage = message.substring(1);
                    contentElement.innerHTML = `<p><span class="drop-cap">${firstLetter}</span>${restOfMessage}</p>`;
                }
            } else {
                contentElement.innerHTML = '<p>No message content available.</p>';
            }
            
            // Add spacing to ensure the text is readable
            contentElement.style.whiteSpace = 'pre-wrap';
            contentElement.style.wordBreak = 'break-word';
        }
        
        // Update current date
        const currentDateElem = document.getElementById('currentDate');
        if (currentDateElem) {
            const now = new Date();
            currentDateElem.textContent = now.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
            });
        }
    } catch (error) {
        console.error('Error displaying message:', error);
        showError('Failed to display message properly. Please try again.');
    }
}

/**
 * Initialize the regenerate options section
 */
function initializeRegenerateOptions() {
    // Get the regenerate button 
    const regenerateBtn = document.getElementById('regenerateBtn');
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', function() {
            // Hide message content and insights
            const messageContent = document.getElementById('messageContent');
            if (messageContent) {
                messageContent.style.display = 'none';
            }
            
            const messageInsights = document.getElementById('messageInsights');
            if (messageInsights) {
                messageInsights.style.display = 'none';
            }
            
            // Show regenerate options
            const regenerateOptions = document.getElementById('regenerateOptions');
            if (regenerateOptions) {
                regenerateOptions.style.display = 'block';
                
                // Make sure the option cards have click handlers
                const optionCards = regenerateOptions.querySelectorAll('.option-card');
                optionCards.forEach(card => {
                    if (!card.hasEventListener) {
                        card.hasEventListener = true;
                        card.addEventListener('click', function() {
                            // Get variation type
                            const variation = this.getAttribute('data-variation');
                            
                            // Hide regenerate options
                            regenerateOptions.style.display = 'none';
                            
                            // Show loading state
                            showLoadingState();
                            
                            // Generate new message with variation
                            generateMessage(variation);
                        });
                    }
                });
            }
        });
    }
    
    // Add event listener to cancel button if it exists
    const cancelBtn = document.getElementById('cancelRegenerateBtn');
    if (!cancelBtn) {
        // Create a cancel button
        const regenerateOptions = document.getElementById('regenerateOptions');
        if (regenerateOptions) {
            const cancelBtn = document.createElement('button');
            cancelBtn.id = 'cancelRegenerateBtn';
            cancelBtn.className = 'secondary-button';
            cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
            cancelBtn.style.margin = '20px auto 0';
            cancelBtn.style.display = 'block';
            
            cancelBtn.addEventListener('click', function() {
                // Hide regenerate options
                regenerateOptions.style.display = 'none';
                
                // Show message content and insights again
                const messageContent = document.getElementById('messageContent');
                if (messageContent) {
                    messageContent.style.display = 'block';
                }
                
                const messageInsights = document.getElementById('messageInsights');
                if (messageInsights) {
                    messageInsights.style.display = 'block';
                }
            });
            
            regenerateOptions.appendChild(cancelBtn);
        }
    }
}

// Make sure to initialize the regenerate options when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // This will be called after initPage() runs
    setTimeout(initializeRegenerateOptions, 1000);
});

/**
 * Apply premium styling to message content
 */
function applyPremiumStyling() {
    // Add premium class to message container if not already present
    const messageContainer = document.getElementById('messageState');
    if (messageContainer && !messageContainer.classList.contains('message-container-premium')) {
        messageContainer.classList.add('message-container-premium');
    }
    
    // Add premium background styling to the page
    const resultPage = document.querySelector('.message-result-page');
    if (resultPage && !resultPage.classList.contains('premium-background')) {
        resultPage.classList.add('premium-background');
    }
    
    // Add animations to message content when it appears
    const messageContent = document.getElementById('messageContent');
    if (messageContent) {
        // Add delayed entrance animation class
        setTimeout(() => {
            messageContent.classList.add('premium-animation');
        }, 100);
    }
    
    // Add animation to insights content
    const insightsContent = document.getElementById('insightsContent');
    if (insightsContent) {
        insightsContent.classList.add('animated-insights');
    }
    
    console.log('Premium styling applied to message');
}

// Initialize the page - main entry point
document.addEventListener('DOMContentLoaded', function() {
    initPage();
    
    // Apply premium styling after a short delay to ensure elements are loaded
    setTimeout(applyPremiumStyling, 300);
}); 