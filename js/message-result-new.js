/**
 * Message Result Page - Simplified Version
 * This handles displaying the generated message based on the user's selections
 */

// Global variables
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
            updateRecipientDisplay();
        } else {
            console.error('No recipient data found');
        }
        
        // Load intent data
        const storedIntentData = localStorage.getItem('intentData');
        if (storedIntentData) {
            intentData = JSON.parse(storedIntentData);
            updateIntentDisplay();
        } else {
            console.error('No intent data found');
        }
        
        // Load tone data
        const storedToneData = localStorage.getItem('toneData') || localStorage.getItem('selectedTone');
        if (storedToneData) {
            toneData = JSON.parse(storedToneData);
            updateToneDisplay();
        } else {
            console.error('No tone data found');
        }
        
        // If any data is missing, show error
        if (!recipientData || !intentData || !toneData) {
            showError('Some information is missing. Please go back and complete all steps.');
        }
    } catch (error) {
        console.error('Error loading data:', error);
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
 * Initialize message action buttons (edit, copy, share)
 */
function initMessageActions() {
    // Edit button
    const editBtn = document.getElementById('editBtn');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            // Show edit container
            const editContainer = document.getElementById('editContainer');
            const messageContent = document.getElementById('messageContent');
            const editMessage = document.getElementById('editMessage');
            
            if (editContainer && messageContent && editMessage) {
                // Get current content
                const content = document.getElementById('content');
                const currentText = content ? content.textContent : '';
                
                // Set textarea value
                editMessage.value = currentText;
                
                // Hide message content and show edit container
                messageContent.style.display = 'none';
                editContainer.style.display = 'block';
                
                // Focus textarea
                editMessage.focus();
            }
        });
    }
    
    // Cancel edit button
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            // Hide edit container and show message content
            const editContainer = document.getElementById('editContainer');
            const messageContent = document.getElementById('messageContent');
            
            if (editContainer && messageContent) {
                editContainer.style.display = 'none';
                messageContent.style.display = 'block';
            }
        });
    }
    
    // Save edit button
    const saveEditBtn = document.getElementById('saveEditBtn');
    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', function() {
            // Get edited message
            const editMessage = document.getElementById('editMessage');
            
            if (editMessage) {
                const updatedText = editMessage.value.trim();
                
                // Update content
                const content = document.getElementById('content');
                if (content) {
                    content.textContent = updatedText;
                }
                
                // Update the stored message object
                if (generatedMessage) {
                    generatedMessage.content = updatedText;
                }
                
                // Hide edit container and show message content
                const editContainer = document.getElementById('editContainer');
                const messageContent = document.getElementById('messageContent');
                
                if (editContainer && messageContent) {
                    editContainer.style.display = 'none';
                    messageContent.style.display = 'block';
                }
                
                // Show success message
                showAlert('Your message has been updated.', 'success');
            }
        });
    }
    
    // Copy button
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const content = document.getElementById('content');
            const messageText = content ? content.textContent : '';
            
            if (messageText) {
                // Copy to clipboard
                navigator.clipboard.writeText(messageText)
                    .then(() => {
                        showAlert('Message copied to clipboard!', 'success');
                    })
                    .catch(err => {
                        console.error('Error copying message:', err);
                        showAlert('Failed to copy message. Please try again.', 'error');
                    });
            }
        });
    }
    
    // Share button
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            const content = document.getElementById('content');
            const messageText = content ? content.textContent : '';
            
            if (!messageText) {
                showAlert('No message to share.', 'error');
                return;
            }
            
            // Check if Web Share API is supported
            if (navigator.share) {
                navigator.share({
                    title: `Message for ${recipientData ? recipientData.name : 'You'}`,
                    text: messageText
                })
                .then(() => {
                    console.log('Message shared successfully');
                })
                .catch(err => {
                    console.error('Error sharing message:', err);
                    // Fall back to clipboard
                    navigator.clipboard.writeText(messageText)
                        .then(() => {
                            showAlert('Message copied to clipboard for sharing!', 'success');
                        })
                        .catch(clipErr => {
                            console.error('Error copying message:', clipErr);
                            showAlert('Failed to copy message. Please try again.', 'error');
                        });
                });
            } else {
                // Web Share API not supported, fall back to clipboard
                navigator.clipboard.writeText(messageText)
                    .then(() => {
                        showAlert('Message copied to clipboard for sharing!', 'success');
                    })
                    .catch(err => {
                        console.error('Error copying message:', err);
                        showAlert('Failed to copy message. Please try again.', 'error');
                    });
            }
        });
    }
}

/**
 * Show loading state
 */
function showLoadingState() {
    const loadingState = document.getElementById('loadingState');
    if (loadingState) {
        loadingState.style.display = 'flex';
    }
}

/**
 * Show error message
 */
function showError(message = 'An error occurred') {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const messageContent = document.getElementById('messageContent');
    const regenerateOptions = document.getElementById('regenerateOptions');
    
    if (loadingState) {
        loadingState.style.display = 'none';
    }
    
    if (errorState) {
        errorState.style.display = 'block';
        
        const errorText = document.getElementById('errorText');
        if (errorText) {
            errorText.textContent = message;
        }
        
        const retryButton = document.getElementById('retryButton');
        if (retryButton) {
            // Remove existing event listeners to prevent duplicates
            const newRetryButton = retryButton.cloneNode(true);
            if (retryButton.parentNode) {
                retryButton.parentNode.replaceChild(newRetryButton, retryButton);
            }
            
            // Add click event listener to retry
            newRetryButton.addEventListener('click', function() {
                // Hide error state
                if (errorState) {
                    errorState.style.display = 'none';
                }
                
                // Show loading state
                if (loadingState) {
                    loadingState.style.display = 'flex';
                }
                
                // Try to clean up any token issues first
                if (message.includes('Authentication') || message.includes('auth')) {
                    // Try to get a fresh token
                    if (firebase.auth && firebase.auth().currentUser) {
                        firebase.auth().currentUser.getIdToken(true)
                            .then(newToken => {
                                localStorage.setItem('authToken', newToken);
                                console.log('Got fresh token on retry');
                                // Call directly with new token
                                generateMessage();
                            })
                            .catch(error => {
                                console.error('Failed to get token on retry:', error);
                                // Fall back to normal generation
                                generateMessage();
                            });
                    } else {
                        // No current user, just try generation which will use any saved token
                        generateMessage();
                    }
                } else {
                    // For non-auth errors, just try generation again after a short delay
                    setTimeout(() => {
                        generateMessage();
                    }, 500);
                }
            });
        }
    } else {
        // Fallback to alert if error state element doesn't exist
        showAlert(message, 'error');
    }
    
    if (messageContent) {
        messageContent.style.display = 'none';
    }
    
    if (regenerateOptions) {
        regenerateOptions.style.display = 'none';
    }
    
    // Log the error
    console.error('Error:', message);
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
 * Set up navigation buttons in a clean, consistent way
 */
function setupNavigationButtons() {
    // Find or create the navigation container
    let navButtons = document.querySelector('.navigation-buttons');
    
    if (!navButtons) {
        navButtons = document.createElement('div');
        navButtons.className = 'navigation-buttons';
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.appendChild(navButtons);
        } else {
            document.body.appendChild(navButtons);
        }
    } else {
        // Clear existing buttons to avoid duplicates
        navButtons.innerHTML = '';
    }
    
    // Remove any duplicate navigation buttons that might exist elsewhere
    const existingBackBtn = document.getElementById('backBtn');
    if (existingBackBtn && existingBackBtn.parentNode !== navButtons) {
        existingBackBtn.remove();
    }
    
    const existingDashboardBtns = document.querySelectorAll('[id^="dashboardBtn"]');
    existingDashboardBtns.forEach(btn => {
        if (btn.parentNode !== navButtons) {
            btn.remove();
        }
    });
    
    // Create Back button
    const backButton = document.createElement('button');
    backButton.id = 'backBtn';
    backButton.className = 'secondary-button';
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back';
    
    // Add event listener for Back button
    backButton.addEventListener('click', function() {
        window.location.href = 'message-tone-new.html';
    });
    
    // Create Dashboard button
    const dashboardButton = document.createElement('button');
    dashboardButton.id = 'dashboardBtn';
    dashboardButton.className = 'primary-button';
    dashboardButton.innerHTML = '<i class="fas fa-home"></i> Back to Dashboard';
    
    // Add event listener for Dashboard button
    dashboardButton.addEventListener('click', function() {
        window.location.href = 'home.html';
    });
    
    // Create Regenerate button
    const regenerateButton = document.createElement('button');
    regenerateButton.id = 'regenerateBtn';
    regenerateButton.className = 'secondary-button';
    regenerateButton.innerHTML = '<i class="fas fa-sync-alt"></i> Regenerate';
    
    // Add event listener for Regenerate button
    regenerateButton.addEventListener('click', function() {
        // Show regenerate options
        const regenerateOptions = document.getElementById('regenerateOptions');
        if (regenerateOptions) {
            if (regenerateOptions.style.display === 'none' || !regenerateOptions.style.display) {
                regenerateOptions.style.display = 'block';
                
                // Smooth scroll to regenerate options
                regenerateOptions.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Initialize options if not already done
                initializeRegenerateOptions();
            } else {
                // If already visible, hide it
                regenerateOptions.style.display = 'none';
            }
        } else {
            // If options not available, just regenerate with different variation
            showLoadingState();
            generateMessage('different');
        }
    });
    
    // Add buttons to navigation container
    navButtons.appendChild(backButton);
    navButtons.appendChild(regenerateButton);
    navButtons.appendChild(dashboardButton);
    
    // Add proper styling to ensure buttons look good
    navButtons.style.display = 'flex';
    navButtons.style.justifyContent = 'space-between';
    navButtons.style.marginTop = '30px';
    
    // Add special styling for the regenerate button (middle button)
    regenerateButton.style.margin = '0 10px';
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
        logDebug(`Generating message with intent: ${intentData.type}, recipient: ${recipientData.name}, tone: ${toneData.type}`);
        
        // Build the message prompt that would be sent to OpenAI
        const messagePrompt = buildOpenAIPrompt(intentData, recipientData, toneData, variation);
        
        // Log the prompt for debugging
        logDebug(`Prompt for OpenAI: ${JSON.stringify(messagePrompt)}`);
        
        // Get auth token if available
        const authToken = localStorage.getItem('authToken');
        
        // Call the message generation API (or use the mock implementation for now)
        callGenerationAPI(messagePrompt, authToken)
            .then(response => {
                // Parse the response to extract message and insights
                const parsedResponse = parseOpenAIResponse(response);
                
                // Display the message and insights
                displayGeneratedMessage(parsedResponse.message);
                displayMessageInsights(parsedResponse.insights);
                
                // Log success
                logDebug('Message generated successfully');
            })
            .catch(error => {
                console.error('Error calling message generation API:', error);
                showError('Failed to generate message: ' + (error.message || 'Unknown error'));
            });
    } catch (error) {
        console.error('Error generating message:', error);
        showError('Failed to generate message. Please check your inputs and try again.');
    }
}

/**
 * Build the OpenAI prompt based on user inputs
 */
function buildOpenAIPrompt(intentData, recipientData, toneData, variation = null) {
    // Create a structured request object that matches our cloud function expectations
    const requestData = {
        intent: {
            type: intentData.type || 'Support',
            details: intentData.details || ''
        },
        recipient: {
            name: recipientData.name || 'Friend',
            relationship: recipientData.relationship || 'Friend',
            relationshipCategory: recipientData.relationshipCategory || '',
            relationshipFocus: recipientData.relationshipFocus || '',
            yearsKnown: recipientData.yearsKnown || '',
            communicationStyle: recipientData.communicationStyle || '',
            personalNotes: recipientData.personalNotes || ''
        },
        tone: {
            type: toneData.type || 'Warm',
            intensity: toneData.intensity || 'Medium'
        },
        variation: variation
    };
    
    return requestData;
}

/**
 * Parse the OpenAI response to extract message and insights
 */
function parseOpenAIResponse(response) {
    // The response from our cloud function should already be in the correct format
    return {
        message: response.message || '',
        insights: response.insights || []
    };
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
                return firebase.firestore().collection('secrets').doc('secrets').get()
                    .then(doc => {
                        if (doc.exists && doc.data().openaikey) {
                            logDebug('API keys retrieved successfully');
                            return { 
                                token: token, 
                                apiKey: doc.data().openaikey,
                                perplexitykey: doc.data().perplexitykey 
                            };
                        } else {
                            throw new Error('API keys not found in Firestore');
                        }
                    });
            })
            .then(({ token, apiKey, perplexitykey }) => {
                // Now that we have the API key, we can make a direct call to OpenAI
                // or use our cloud function with the key included in the request
                
                // Option 1: Use cloud function but include the API key in the request
                const apiUrl = 'https://us-central1-heartglowai.cloudfunctions.net/generateMessageV2';
                
                logDebug('Making API call with auth token and API key');
                
                // Prepare request with API key included
                const requestBody = {
                    ...prompt,
                    apiKey: apiKey, // Include API key in the request body
                    perplexitykey: perplexitykey // Include perplexity key if available
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
                if (!response.ok) {
                    throw new Error(`API responded with status ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Log success
                logDebug('API call successful');
                
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
 * Display message insights
 */
function displayMessageInsights(insights) {
    const insightsContainer = document.getElementById('messageInsights');
    const insightsContent = document.getElementById('insightsContent');
    
    if (!insightsContainer || !insightsContent) {
        console.error('Insights containers not found');
        return;
    }
    
    // Clear previous content
    insightsContent.innerHTML = '';
    
    // Create insights list
    const insightsList = document.createElement('ul');
    
    // Add each insight as a list item
    insights.forEach(insight => {
        const listItem = document.createElement('li');
        listItem.textContent = insight;
        insightsList.appendChild(listItem);
    });
    
    // Add list to container
    insightsContent.appendChild(insightsList);
    
    // Show insights container
    insightsContainer.style.display = 'block';
}

/**
 * Display the generated message in the UI
 */
function displayGeneratedMessage(message) {
    // Hide loading and error states
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    
    if (loadingState) {
        loadingState.style.display = 'none';
    }
    
    if (errorState) {
        errorState.style.display = 'none';
    }
    
    // Set current date in the message header if it's not already set
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement && !currentDateElement.textContent) {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        currentDateElement.textContent = now.toLocaleDateString('en-US', options);
    }
    
    // Store the message for copy functionality
    generatedMessage = message;
    
    // Set the message content
    const contentElement = document.getElementById('content');
    if (contentElement) {
        contentElement.textContent = message;
    }
    
    // Make the message content visible
    const messageContent = document.getElementById('messageContent');
    if (messageContent) {
        messageContent.style.display = 'block';
    }
}

/**
 * Initialize the regenerate options section
 */
function initializeRegenerateOptions() {
    // Get the regenerate options container
    const regenerateOptions = document.getElementById('regenerateOptions');
    
    if (!regenerateOptions) {
        console.error('Regenerate options container not found');
        return;
    }
    
    // Make sure it's visible
    regenerateOptions.style.display = 'block';
    
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