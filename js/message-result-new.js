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
    console.log('Initializing message result page...');
    
    // Show loading state
    showLoadingState();
    
    // Initialize user menu
    initUserMenu();
    
    // Load data from localStorage
    loadData();
    
    // Initialize UI elements
    initButtons();
    
    // Since we have all the data now, try to generate message
    generateMessage();
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
 * Generate message using cloud function
 */
function generateMessage() {
    console.log('Generating message...');
    showLoadingState();
    
    // Check if we have all required data
    if (!recipientData || !intentData || !toneData) {
        showError('Missing required information. Please complete all previous steps.');
         return;
    }
    
    // For development/testing, allow bypassing authentication
    // This makes it easier to test the message generation even without being logged in
    const bypassAuth = window.location.href.includes('localhost') || 
                      window.location.href.includes('127.0.0.1') ||
                      window.location.search.includes('bypass=true');
    
    // Get authentication token from Firebase
    if (firebase.auth && firebase.auth().currentUser) {
        firebase.auth().currentUser.getIdToken(true)
            .then(token => {
                // Call cloud function with token
                callCloudFunction(token);
            })
            .catch(error => {
                console.error('Failed to get auth token:', error);
                if (bypassAuth) {
                    console.log('Bypassing authentication for development environment');
                    callCloudFunction(null);
                } else {
                    showError('Authentication error. Please try refreshing the page or sign in again.');
                }
            });
    } else {
        // No authenticated user
        console.error('No authenticated user found');
        if (bypassAuth) {
            console.log('Bypassing authentication for development environment');
            callCloudFunction(null); // Call without token in development mode
        } else {
            // Try to re-authenticate
            if (firebase.auth) {
                firebase.auth().signInAnonymously()
                    .then(() => {
                        console.log('Anonymous auth successful');
                        firebase.auth().currentUser.getIdToken(true)
                            .then(token => callCloudFunction(token))
                            .catch(err => {
                                console.error('Error getting token after anon auth:', err);
                                showError('Could not authenticate. Try refreshing the page.');
                            });
                    })
                    .catch(error => {
                        console.error('Anonymous auth failed:', error);
                        showError('Authentication required. Please sign in to generate messages. Try refreshing the page or logging in again.');
                    });
            } else {
                showError('Authentication required. Please sign in to generate messages.');
            }
        }
    }
}

/**
 * Call cloud function to generate message
 */
function callCloudFunction(idToken) {
    const apiUrl = 'https://us-central1-heartglowai.cloudfunctions.net/generateMessage';
    
    // Prepare payload
    const payload = {
        intent: intentData.type,
        recipient: {
            name: recipientData.name,
            relationship: recipientData.relationship
        },
        tone: toneData.type,
        customizations: {
            custom_intent: intentData.customText || '',
            custom_tone: toneData.customText || ''
        }
    };
    
    console.log('Calling cloud function with payload:', payload);
    
    // Set up headers
    const headers = {
        'Content-Type': 'application/json'
    };
    
    // Add auth token if available
    if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
    }
    
    // Set timeout of 30 seconds
    const timeout = 30000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    // Debug URL
    console.log(`API URL: ${apiUrl}`);
    console.log('Headers:', headers);
    
    // Make request
    fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
        signal: controller.signal
    })
    .then(response => {
        clearTimeout(timeoutId);
        
        // Log response status for debugging
        console.log(`API response status: ${response.status}`);
        
        if (!response.ok) {
            // Try to get response text for better error message
            return response.text().then(text => {
                let errorMessage = `API returned status ${response.status}`;
                if (text) {
                    try {
                        // Try to parse as JSON first
                        const errorJson = JSON.parse(text);
                        errorMessage += `: ${errorJson.error || errorJson.message || text}`;
                    } catch (e) {
                        // If not JSON, just use the text
                        errorMessage += `: ${text}`;
                    }
                }
                throw new Error(errorMessage);
            });
        }
         return response.json();
    })
    .then(data => {
        console.log('Message generated successfully:', data);
        displayGeneratedMessage(data);
    })
    .catch(error => {
        console.error('Error calling cloud function:', error);
        
        // For timeout or network errors, retry once
        if (error.name === 'AbortError' || error.message.includes('NetworkError')) {
            console.log('Connection timed out or network error. Retrying...');
            showAlert('Connection issue. Retrying...', 'info');
            setTimeout(() => {
                callCloudFunction(idToken); // Retry once
            }, 1000);
        } else if (error.message.includes('401') || error.message.includes('403')) {
            // Authentication issues
            showError('Authentication error: You may need to sign in again. ' + error.message);
        } else if (error.message.includes('429')) {
            // Rate limiting
            showError('Too many requests. Please wait a moment and try again.');
        } else if (error.message.includes('500')) {
            // Server error
            showError('Server error. Our team has been notified. Please try again later.');
        } else {
            // For other errors, show a specific error message
            showError('Could not generate message: ' + error.message + '. Please try again.');
        }
    });
}

/**
 * Display the generated message in the UI
 */
function displayGeneratedMessage(data) {
    console.log('Displaying generated message:', data);
    
    // Hide loading state
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'none';
    
    // Show message content
    const messageContent = document.getElementById('messageContent');
    if (messageContent) {
        messageContent.style.display = 'block';
    }
    
    // Create full message text
    let fullMessageText = '';
    
    if (data.message.greeting) {
        fullMessageText += data.message.greeting + '\n\n';
    }
    
    if (data.message.content) {
        fullMessageText += data.message.content;
    }
    
    if (data.message.closing) {
        fullMessageText += '\n\n' + data.message.closing;
    }
    
    if (data.message.signature) {
        fullMessageText += '\n' + data.message.signature;
    }
    
    // Set message in content area
    const messageElement = document.getElementById('content');
    if (messageElement) {
        messageElement.textContent = fullMessageText;
    }
    
    // Store the generated message for later use
    generatedMessage = data.message;
    
    // Show regenerate options
    const regenerateOptions = document.getElementById('regenerateOptions');
    if (regenerateOptions) {
        regenerateOptions.style.display = 'block';
    }
    
    // Initialize message action buttons
    initMessageActions();
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
                
                // Try generating again after a short delay
                setTimeout(() => {
                    generateMessage();
                }, 500);
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
    const adjustmentOptions = document.querySelectorAll('.adjustment-option');
    const regenerateBtn = document.getElementById('regenerate-btn');
    
    if (!adjustmentOptions.length) {
        logDebug('No adjustment options found');
        return;
    }
    
    adjustmentOptions.forEach(option => {
        option.addEventListener('click', function() {
            const adjustment = this.getAttribute('data-adjust');
            
            // Toggle selection
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                selectedAdjustments = selectedAdjustments.filter(a => a !== adjustment);
            } else {
                this.classList.add('selected');
                selectedAdjustments.push(adjustment);
            }
            
            logDebug(`Adjustments selected: ${selectedAdjustments.join(', ')}`);
        });
    });
    
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', function() {
            if (generatedMessage) {
                document.getElementById('loading-state').style.display = 'flex';
                document.getElementById('message-container').style.display = 'none';
                document.getElementById('regenerate-options').style.display = 'none';
                
                // Call generateMessage to regenerate with the selected adjustments
                generateMessage();
            }
        });
    }
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
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                window.location.href = 'message-tone-new.html';
            });
        } else {
            console.error('DEBUG: ERROR: Back button not found');
        }
        
        // Next/Done button
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                // In a real implementation, this might save the message and go to home
                showAlert('Message process completed!', 'success');
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            });
        } else {
            console.error('DEBUG: ERROR: Next button not found');
        }
        
        // Initialize dev mode if URL contains dev=true
        if (window.location.search.includes('dev=true')) {
            initDevMode();
        }
    } catch (error) {
        console.error('Error initializing buttons:', error);
    }
}

/**
 * Initialize developer mode features
 * This adds additional debugging options not visible in production
 */
function initDevMode() {
    console.log('🔧 Initializing developer mode');
    
    // Create dev panel
    const devPanel = document.createElement('div');
    devPanel.className = 'dev-panel';
    devPanel.style.position = 'fixed';
    devPanel.style.bottom = '10px';
    devPanel.style.right = '10px';
    devPanel.style.backgroundColor = '#333';
    devPanel.style.color = '#fff';
    devPanel.style.padding = '10px';
    devPanel.style.borderRadius = '5px';
    devPanel.style.zIndex = '1000';
    devPanel.style.fontSize = '12px';
    devPanel.style.maxWidth = '300px';
    
    // Add bypass auth button
    const bypassAuthBtn = document.createElement('button');
    bypassAuthBtn.textContent = 'Bypass Auth';
    bypassAuthBtn.style.marginRight = '5px';
    bypassAuthBtn.style.padding = '5px';
    bypassAuthBtn.style.cursor = 'pointer';
    bypassAuthBtn.addEventListener('click', function() {
        const url = new URL(window.location.href);
        url.searchParams.set('bypass', 'true');
        window.location.href = url.toString();
    });
    
    // Add regenerate button
    const regenerateBtn = document.createElement('button');
    regenerateBtn.textContent = 'Regenerate';
    regenerateBtn.style.marginRight = '5px';
    regenerateBtn.style.padding = '5px';
    regenerateBtn.style.cursor = 'pointer';
    regenerateBtn.addEventListener('click', function() {
        generateMessage();
    });
    
    // Add clear localStorage button
    const clearStorageBtn = document.createElement('button');
    clearStorageBtn.textContent = 'Clear Storage';
    clearStorageBtn.style.padding = '5px';
    clearStorageBtn.style.cursor = 'pointer';
    clearStorageBtn.addEventListener('click', function() {
        localStorage.clear();
        showAlert('localStorage cleared', 'info');
    });
    
    // Add status display
    const statusDisplay = document.createElement('div');
    statusDisplay.id = 'devStatus';
    statusDisplay.style.marginTop = '10px';
    statusDisplay.style.fontSize = '11px';
    statusDisplay.style.wordBreak = 'break-all';
    statusDisplay.innerHTML = '<strong>Dev Mode Active</strong><br>' +
                             'URL: ' + window.location.href + '<br>' +
                             'Auth: ' + (firebase.auth && firebase.auth().currentUser ? 'Yes' : 'No');
    
    // Assemble dev panel
    devPanel.appendChild(bypassAuthBtn);
    devPanel.appendChild(regenerateBtn);
    devPanel.appendChild(clearStorageBtn);
    devPanel.appendChild(statusDisplay);
    
    // Add to body
    document.body.appendChild(devPanel);
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
            logDebug('AUTH BYPASS ACTIVATED - signing in anonymously');
            authBypass = true;
            
            // Sign in anonymously instead of just bypassing
            if (window.firebase && firebase.auth) {
                firebase.auth().signInAnonymously()
                    .then(() => {
                        logDebug('Anonymous authentication successful');
                        // Regenerate message
                        generateMessage();
                    })
                    .catch((error) => {
                        logDebug(`ERROR: Anonymous authentication failed: ${error.message}`);
                        showError(`Authentication error: ${error.message}`);
                    });
            }
            
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
 * Initialize dev mode toggle button
 */
function initDevModeToggle() {
    const toggleDevModeBtn = document.getElementById('toggle-dev-mode-btn');
    const devModeStatus = document.getElementById('dev-mode-status');
    
    if (toggleDevModeBtn && devModeStatus) {
        // Dev mode disabled - hide button
        toggleDevModeBtn.style.display = 'none';
        devModeStatus.textContent = 'USING API ONLY';
        devModeStatus.style.color = '#4CAF50';
    }
} 