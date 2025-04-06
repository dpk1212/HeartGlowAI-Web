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

// Sample messages for different intents and tones
const sampleMessages = {
    reconnect: {
        warm: "Hi [NAME], it's been too long since we last connected! I've been thinking about you and wondering how you've been. I'd love to catch up sometime soon and hear what's been happening in your life. Hope you're doing well!",
        professional: "Hello [NAME], I hope this message finds you well. It's been some time since we last connected, and I wanted to reach out to reestablish our connection. I would appreciate the opportunity to catch up when you have the time.",
        casual: "Hey [NAME]! Long time no talk! Just wanted to drop a quick message to see how you're doing these days. We should definitely catch up sometime!",
        enthusiastic: "Hey [NAME]!! I was just thinking about you today and realized how much I miss our conversations! Would LOVE to reconnect and hear all about what's been happening in your world! Hope you're doing amazing!",
        sincere: "Dear [NAME], I've been reflecting lately on the important people in my life, and you came to mind. I've missed our connection and would genuinely love to reconnect if you're open to it. I hope you've been well.",
        humorous: "Hey [NAME], I'm pretty sure the law requires me to check in with awesome people at least once a year, and I'm way overdue! How have you been? I promise I'll be more punctual with the next legally-mandated awesome-person check-in!",
        formal: "Dear [NAME], I hope this message finds you in good health and spirits. I am writing to reestablish our connection after our period of absence. I would be most pleased to hear from you at your earliest convenience."
    },
    appreciate: {
        warm: "Hi [NAME], I just wanted to take a moment to tell you how much I appreciate you and everything you do. Your kindness and support mean the world to me. Thank you for being such an important part of my life!",
        professional: "Hello [NAME], I wanted to express my sincere appreciation for your contributions and support. Your dedication and effort have made a significant positive impact, and I am truly grateful for everything you've done.",
        casual: "Hey [NAME]! Just wanted to say thanks for being awesome! You really helped me out and I super appreciate it.",
        enthusiastic: "Hey [NAME]!! I just HAD to message you to say THANK YOU SO MUCH for everything you've done! You're absolutely amazing and I can't express enough how much I appreciate you and your incredible support!!",
        sincere: "Dear [NAME], I'm taking a moment to express my heartfelt gratitude for you. Your impact on my life has been profound, and I truly value your presence, support, and all that you bring to my world. Thank you, from the bottom of my heart.",
        humorous: "Hey [NAME], if appreciation were a currency, I'd be sending you a trillion-dollar thank you right now! You're so awesome that scientists are studying you to unlock the secrets of awesomeness. Thanks for everything!",
        formal: "Dear [NAME], I wish to convey my most sincere gratitude for your exemplary contributions and unwavering support. Your actions have been most commendable and have not gone unnoticed. Please accept my deepest appreciation."
    },
    apologize: {
        warm: "Hi [NAME], I wanted to reach out and say I'm truly sorry for what happened. I value our relationship, and I understand that my actions affected you. I hope we can talk about this and move forward together.",
        professional: "Hello [NAME], I would like to extend my sincere apologies regarding the recent situation. I recognize the impact of the misunderstanding and take full responsibility. I am committed to resolving this matter and preventing similar occurrences in the future.",
        casual: "Hey [NAME], I messed up and I'm really sorry about that. Totally my bad. Hope we can put this behind us?",
        enthusiastic: "Hey [NAME]! I feel TERRIBLE about what happened and want you to know I'm SO SORRY! I really value you and our relationship, and I promise to do better going forward! Can you forgive me?",
        sincere: "Dear [NAME], I've been reflecting deeply on what happened, and I need to express my genuine remorse for my actions. I understand that I hurt you, and that was never my intention. I take full responsibility and am truly sorry. If you're willing, I'd like to make things right between us.",
        humorous: "Hey [NAME], I've officially won the 'Biggest Mess-Up of the Month' award, and I'd like to apologize and return the trophy to its rightful place. I'm sincerely sorry and promise to aim for 'Most Improved' next time.",
        formal: "Dear [NAME], I wish to extend my most profound apologies for the regrettable incident that has transpired between us. I acknowledge my indiscretion and the consequent distress it may have caused you. I humbly request your forgiveness and the opportunity to make amends."
    },
    celebrate: {
        warm: "Hi [NAME]! I just heard about your achievement and wanted to say congratulations! I'm so happy for you and proud of all the hard work you've put in to reach this milestone. You truly deserve this success!",
        professional: "Hello [NAME], congratulations on your recent accomplishment. Your dedication and perseverance have clearly paid off, and this achievement is well-deserved. I wish you continued success in your future endeavors.",
        casual: "Hey [NAME]! Congrats on the big news! That's awesome and definitely calls for a celebration!",
        enthusiastic: "OMG [NAME]!! HUGE CONGRATULATIONS on your amazing achievement!! I'm absolutely THRILLED for you and so excited to see all your hard work paying off!! This is just the beginning of all the incredible things coming your way!! SO PROUD OF YOU!!",
        sincere: "Dear [NAME], I wanted to express my heartfelt congratulations on your achievement. Knowing the journey you've been on and the challenges you've overcome makes this accomplishment even more meaningful. I'm truly happy for you and honored to celebrate this milestone with you.",
        humorous: "Hey [NAME]! I heard you're officially too awesome for regular people standards now! Congratulations on your achievement! I'll be telling everyone I knew you before you were famous!",
        formal: "Dear [NAME], please accept my most sincere congratulations on your distinguished achievement. It is with great pleasure that I acknowledge this momentous occasion in recognition of your exemplary accomplishment. May this success herald the commencement of further triumphs in your future endeavors."
    },
    encourage: {
        warm: "Hi [NAME], I just wanted to reach out and let you know that I believe in you completely. Everyone faces challenges, but I know you have the strength and resilience to overcome whatever you're facing. I'm here for you if you need anything at all.",
        professional: "Hello [NAME], I wanted to express my confidence in your abilities to handle the current situation. Your track record demonstrates your competence and resilience, and I have no doubt that you will navigate through this challenge successfully.",
        casual: "Hey [NAME]! Just wanted to say you've got this! Sending good vibes your way!",
        enthusiastic: "Hey [NAME]!! I just HAD to tell you how ABSOLUTELY AMAZING you are!! You've got EVERYTHING it takes to succeed at this, and I'm your biggest cheerleader!! You're going to CRUSH this and I can't wait to celebrate your success!!",
        sincere: "Dear [NAME], I've been thinking about what you're going through, and I wanted you to know that I truly believe in your capacity to overcome this challenge. Your strength, resilience, and character are remarkable, and they will carry you through this difficult time. I'm here for you, believing in you even in moments when belief might be hard to find within yourself.",
        humorous: "Hey [NAME], I just checked the Official Book of Awesome People Who Can Handle Anything, and guess whose name was at the top? YOURS! Scientific fact: you've got this! And if science isn't enough, I've also consulted fortune cookies, magic 8 balls, and my cat - they all agree!",
        formal: "Dear [NAME], I wish to convey my utmost confidence in your capabilities as you confront the present circumstances. Your demonstrated fortitude and perseverance are most commendable attributes that shall undoubtedly facilitate your triumph over the challenges at hand."
    },
    invite: {
        warm: "Hi [NAME]! I'm planning a get-together next Saturday afternoon, and it would mean so much to me if you could join us. We'll have good food, good company, and plenty of time to catch up. I really hope you can make it!",
        professional: "Hello [NAME], I would like to cordially invite you to attend our upcoming event on [DATE] at [TIME]. Your presence would be greatly valued, and I believe you would find the occasion both beneficial and enjoyable. Please let me know if you are able to attend.",
        casual: "Hey [NAME]! We're getting some people together this weekend. Wanna join? Should be fun!",
        enthusiastic: "Hey [NAME]!! We're planning an AMAZING get-together next weekend and it would be ABSOLUTELY FANTASTIC if you could come!! There will be great food, awesome people, and it just wouldn't be the same without YOU!! Hope you can join us!!",
        sincere: "Dear [NAME], I'm reaching out with a heartfelt invitation to join us for an upcoming gathering. Your presence would truly make the event special for me, as I've always valued your company and the unique perspective you bring. I sincerely hope you'll be able to attend.",
        humorous: "Hey [NAME]! I'm throwing a party where the guest list exclusively features awesome people, and your attendance is crucial for maintaining our awesome-people quota. No pressure, but the success of the entire event depends on you showing up!",
        formal: "Dear [NAME], I am pleased to extend a formal invitation for your esteemed presence at our forthcoming gathering on the evening of [DATE]. Your attendance would be most graciously received and would contribute significantly to the distinction of the occasion."
    },
    custom: {
        warm: "Hi [NAME], I hope this message finds you well. I wanted to reach out because you've been on my mind lately. Looking forward to connecting with you soon!",
        professional: "Hello [NAME], I hope this message finds you well. I wanted to reach out regarding the matter we discussed previously. Please let me know when would be a convenient time to discuss this further.",
        casual: "Hey [NAME]! Just dropping a quick note to say hi! What's new with you these days?",
        enthusiastic: "Hey [NAME]!! Just wanted to send you a SUPER quick message to brighten your day!! Hope everything is AMAZING in your world!!",
        sincere: "Dear [NAME], I've been reflecting on our connection recently and felt compelled to reach out. I value our relationship deeply and wanted you to know you're in my thoughts.",
        humorous: "Hey [NAME]! Scientific studies show that receiving random messages from me improves your day by at least 27.5%. You're welcome for this evidence-based happiness boost!",
        formal: "Dear [NAME], I hope this correspondence finds you in good health and high spirits. I am writing to convey my thoughts regarding our previous discourse and to express my sincere regards."
    }
};

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
        
        // Set up the API endpoint URL for the new V2 function
        const apiUrl = 'https://us-central1-heartglowai.cloudfunctions.net/generateMessageV2';
        
        // Make the API call
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken ? `Bearer ${authToken}` : ''
            },
            body: JSON.stringify(prompt)
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