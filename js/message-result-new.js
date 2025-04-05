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
    
    // Get the emotion from URL parameter
    selectedEmotion = getEmotionFromUrl();
    console.log('Emotion from URL:', selectedEmotion);
    
    // Load data from localStorage
    loadRecipientData();
    loadIntentData();
    loadToneData();
    
    // Initialize UI elements
    initButtons();
    initNavigation();
    initBypassAuth();
    initAdjustmentOptions();
    initDevModeToggle();
    
    // Show debug button
    createDebugButton();
    
    // Use saved token if available
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
        logDebug('Using saved authentication token');
        generateMessageWithToken(savedToken);
    } else {
        // If no token is found from previous steps, authentication is required.
        logDebug('ERROR: No auth token found in localStorage. Authentication required.');
        showError('Authentication required. Please sign in again.'); 
        // Don't attempt generation or checkAuthentication which might try anonymous auth.
        // checkAuthentication(); // Remove this
        // generateMessage(); // Remove this
    }
    
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
 * Load tone data from localStorage
 */
function loadToneData() {
    try {
        const storedToneData = localStorage.getItem('toneData');
        if (storedToneData) {
            toneData = JSON.parse(storedToneData);
            logDebug(`Loaded tone data: ${toneData.type}`);
        } else {
            logDebug('ERROR: No tone data found in localStorage');
            showAlert('No tone information found. Please go back and select a tone.', 'error');
        }
    } catch (error) {
        logDebug(`ERROR: Failed to parse tone data: ${error.message}`);
        showAlert('There was a problem loading your tone information.', 'error');
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
 * Generate a message based on the selected intent and tone
 */
function generateMessage() {
    if (!intentData || !toneData || !recipientData) {
        showError('Missing required data to generate message');
        return;
    }
    
    try {
        // Show loading state
        document.getElementById('loading-state').style.display = 'flex';
        document.getElementById('message-container').style.display = 'none';
        document.getElementById('error-state').style.display = 'none';
        document.getElementById('regenerate-options').style.display = 'none';
        
        // Check if already authenticated
        if (firebase.auth().currentUser) {
            logDebug('User already authenticated, proceeding with message generation');
            firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    callCloudFunction(idToken);
                })
                .catch(error => {
                    logDebug(`ERROR: Failed to get auth token: ${error.message}`);
                    showError('Authentication error: ' + error.message);
                });
        } else {
            // Not authenticated yet, wait for auth state to change
            logDebug('No user authenticated yet, waiting for authentication change...');
            
            // Set up a one-time listener
            const unsubscribe = firebase.auth().onAuthStateChanged(function(user) {
                unsubscribe(); // Remove the listener after first call
                if (user) {
                    logDebug('User authenticated via listener, now proceeding with message generation');
                    user.getIdToken(true)
                        .then(idToken => {
                            callCloudFunction(idToken);
                        })
                        .catch(error => {
                            logDebug(`ERROR: Failed to get auth token: ${error.message}`);
                            showError('Authentication error: ' + error.message);
                        });
                } else {
                    // If listener also confirms no user, show error. Do not attempt anonymous sign-in.
                    logDebug('ERROR: Authentication listener confirmed no user. Cannot generate message.');
                    showError('Authentication required. Please sign in to generate messages.');
                }
            });
        }
    } catch (error) {
        logDebug(`ERROR: Failed to generate message: ${error.message}`);
        showError('Could not generate message: ' + error.message);
    }
}

/**
 * Check if we're in development mode
 */
function isDevMode() {
    // Never use dev mode / sample messages
    return false;
}

/**
 * Call the cloud function to generate a real message
 */
function callCloudFunction(idToken) {
    logDebug('Calling cloud function for message generation');
    
    // First, fetch the API key directly from Firestore
    const db = firebase.firestore();
    db.collection('secrets').doc('secrets').get()
        .then(doc => {
            if (!doc.exists) {
                throw new Error('API key document not found');
            }
            
            const apiKeyData = doc.data();
            if (!apiKeyData || !apiKeyData.openaikey) {
                throw new Error('API key not found in document');
            }
            
            logDebug('Successfully retrieved API key from Firestore');
            
            // Now proceed with cloud function call, including the API key in payload
            const cloudFunctionPayload = {
                scenario: getScenarioFromIntent(intentData.type),
                relationshipType: recipientData.relationship,
                tone: toneData.type || 'casual',
                toneIntensity: getToneIntensity(toneData.type),
                relationshipDuration: 'unspecified',
                specialCircumstances: intentData.customText || '',
                recipientName: recipientData.name,
                // Directly include the API key in the payload
                apiKey: apiKeyData.openaikey,
                // For backward compatibility
                secretsPath: 'secrets/secrets',
                secretsKey: 'openaikey',
                useFallback: true
            };
            
            // Add any selected adjustments as special circumstances
            if (selectedAdjustments.length > 0) {
                cloudFunctionPayload.specialCircumstances += ` Please make the message ${selectedAdjustments.join(', ')}.`;
            }
            
            logDebug('Cloud function payload prepared with API key');
            
            // Continue with normal request flow
            makeRequest(cloudFunctionPayload, idToken);
        })
        .catch(error => {
            logDebug(`ERROR: Failed to fetch API key: ${error.message}`);
            showError('Failed to access API key: ' + error.message);
        });
}

/**
 * Make the actual request to the cloud function
 */
function makeRequest(payload, idToken, retryCount = 0) {
    logDebug(`Calling cloud function (attempt ${retryCount + 1})`);
    
    const fetchWithTimeout = (url, options, timeout = 30000) => {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timed out')), timeout)
            )
        ]);
    };
    
    fetchWithTimeout('https://us-central1-heartglowai.cloudfunctions.net/generateMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(payload)
    }, 60000) // 60 second timeout for AI-based functions
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Check if we have a message
        if (!data.message) {
            throw new Error('No message received from API');
        }
        
        // Store generated message and insights
        generatedMessage = data.message;
        const insights = data.insights || [];
        
        // Hide loading, show message
        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('message-container').style.display = 'block';
        document.getElementById('regenerate-options').style.display = 'block';
        
        // Update message display
        document.getElementById('message-content').textContent = data.message;
        document.getElementById('intent-display').textContent = `Intent: ${capitalizeFirstLetter(intentData.type)}`;
        document.getElementById('tone-display').textContent = `Tone: ${capitalizeFirstLetter(toneData.type)}`;
        
        // Display insights
        displayInsights(insights);
        
        logDebug('Cloud function message generated successfully');
    })
    .catch(error => {
        logDebug(`ERROR: Cloud function call failed: ${error.message}`);
        
        // Try again if we haven't exceeded max retries
        if (retryCount < 2) {
            logDebug(`Retrying request (${retryCount + 1}/2)...`);
            setTimeout(() => makeRequest(payload, idToken, retryCount + 1), 2000);
        } else {
            // If still failing after retries, show error
            document.getElementById('loading-state').style.display = 'none';
            document.getElementById('error-state').style.display = 'block';
            document.getElementById('error-state').querySelector('.error-message').textContent = 
                `Failed to generate message: ${error.message}. Please try again.`;
        }
    });
}

/**
 * Display insights from the API response
 */
function displayInsights(insights) {
    const insightsContainer = document.getElementById('insights-container');
    const insightsList = document.getElementById('insights-list');
    
    if (!insightsContainer || !insightsList) {
        logDebug('ERROR: Insights container not found');
        return;
    }
    
    // Clear previous insights
    insightsList.innerHTML = '';
    
    // If no insights, hide the container
    if (!insights || !insights.length) {
        insightsContainer.style.display = 'none';
        return;
    }
    
    // Show the container
    insightsContainer.style.display = 'block';
    
    // Add each insight
    insights.forEach(insight => {
        const insightItem = document.createElement('div');
        insightItem.style.marginBottom = '10px';
        
        // Try to extract title and description from the insight string
        // Format is usually "Title: Description"
        const parts = insight.split(/:\s+/);
        if (parts.length >= 2) {
            const title = parts[0];
            const description = parts.slice(1).join(': ');
            
            insightItem.innerHTML = `<strong style="color: var(--text-color);">${title}:</strong> ${description}`;
        } else {
            // If not in expected format, just display the whole string
            insightItem.textContent = insight;
        }
        
        insightsList.appendChild(insightItem);
    });
    
    logDebug(`Displayed ${insights.length} insights`);
}

/**
 * Map intent type to scenario for the cloud function
 */
function getScenarioFromIntent(intentType) {
    const scenarioMap = {
        'reconnect': 'Reconnecting with someone after time apart',
        'appreciate': 'Expressing gratitude and appreciation',
        'apologize': 'Apologizing for a mistake or misunderstanding',
        'celebrate': 'Celebrating an achievement or special occasion',
        'encourage': 'Offering encouragement and support',
        'invite': 'Inviting someone to an event or activity',
        'custom': 'Custom message'
    };
    
    return scenarioMap[intentType] || 'Custom message';
}

/**
 * Convert tone to intensity level for the cloud function
 */
function getToneIntensity(toneType) {
    const intensityMap = {
        'warm': '3',
        'professional': '2',
        'casual': '3',
        'enthusiastic': '5',
        'sincere': '4',
        'humorous': '4',
        'formal': '2',
        'custom': '3'
    };
    
    return intensityMap[toneType] || '3';
}

/**
 * Apply any selected adjustments to the message
 */
function applyAdjustments(message) {
    if (!selectedAdjustments.length) return message;
    
    let adjustedMessage = message;
    
    // Very simple adjustments for demo purposes
    if (selectedAdjustments.includes('longer')) {
        adjustedMessage += " I'm really looking forward to our continued connection and all the wonderful conversations ahead.";
    }
    
    if (selectedAdjustments.includes('shorter')) {
        // Simplify message by taking just the first two sentences
        const sentences = adjustedMessage.split(/(?<=[.!?])\s+/);
        if (sentences.length > 2) {
            adjustedMessage = sentences.slice(0, 2).join(' ');
        }
    }
    
    if (selectedAdjustments.includes('casual')) {
        adjustedMessage = adjustedMessage.replace('would like to', 'want to');
        adjustedMessage = adjustedMessage.replace('I am', "I'm");
        adjustedMessage = adjustedMessage.replace('Hello', 'Hey');
    }
    
    if (selectedAdjustments.includes('formal')) {
        adjustedMessage = adjustedMessage.replace('Hey', 'Hello');
        adjustedMessage = adjustedMessage.replace('thanks', 'thank you');
        adjustedMessage = adjustedMessage.replace('Congrats', 'Congratulations');
    }
    
    if (selectedAdjustments.includes('emotional')) {
        adjustedMessage = adjustedMessage.replace(/\./g, '!');
        adjustedMessage += " This means so much to me!";
    }
    
    if (selectedAdjustments.includes('clear')) {
        adjustedMessage = adjustedMessage.replace(/\!+/g, '.');
        adjustedMessage = adjustedMessage.replace(/\bvery\b/g, '');
        adjustedMessage = adjustedMessage.replace(/\breally\b/g, '');
    }
    
    return adjustedMessage;
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
 * Initialize back and next buttons
 */
function initButtons() {
    // Back button
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'message-tone-new.html?emotion=' + selectedEmotion;
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
    
    // Init message-specific options
    initMessageOptions();
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
 * Generate message using a previously saved token
 */
function generateMessageWithToken(token) {
    if (!intentData || !toneData || !recipientData) {
        showError('Missing required data to generate message');
        return;
    }
    
    try {
        // Show loading state
        document.getElementById('loading-state').style.display = 'flex';
        document.getElementById('message-container').style.display = 'none';
        document.getElementById('error-state').style.display = 'none';
        document.getElementById('regenerate-options').style.display = 'none';
        
        logDebug('Generating message with saved token');
        callCloudFunction(token);
        
    } catch (error) {
        logDebug(`ERROR: Failed to generate message with token: ${error.message}`);
        showError('Could not generate message: ' + error.message);
    }
}

/**
 * Check authentication and save token for future use
 */
function checkAuthentication() {
    // First, check if we have a token from a previous step
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
        logDebug('Found auth token in localStorage. Assuming authenticated initially.');
        // Optional: We could try to verify this token or use it,
        // but for now, just knowing it exists helps bridge the gap.
    }

    if (window.firebase && firebase.auth) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                logDebug(`User authenticated via listener: ${user.uid}`);
                
                // Refresh auth token if needed (e.g., for subsequent actions on this page)
                user.getIdToken(true).then(token => {
                    localStorage.setItem('authToken', token);
                    logDebug('Refreshed authentication token in localStorage');
                }).catch(error => {
                    logDebug(`ERROR: Failed to refresh auth token: ${error.message}`);
                });
            } else {
                logDebug('Auth listener reports no user logged in.');
                // Clear potentially stale token if listener confirms logged out
                localStorage.removeItem('authToken'); 
                if (!authBypass) {
                    logDebug('Authentication required. Showing debug console with bypass option');
                    if (document.getElementById('debug-console')) {
                       document.getElementById('debug-console').style.display = 'block';
                    }
                    // Error is handled by initPage if no token was present initially
                    // showError('Authentication required. Please sign in again.'); 
                } else {
                     logDebug('Auth bypass enabled.');
                }
            }
        });
    } else {
        logDebug('WARNING: Firebase auth not available');
        if (!storedToken && !authBypass) { // Only show debug if no token and no bypass
             if (document.getElementById('debug-console')) {
                 document.getElementById('debug-console').style.display = 'block';
             }
             // Error is handled by initPage if no token was present initially
             // showError('Authentication required. Please sign in again.');
        }
    }
    
    // REMOVE automatic anonymous authentication attempt
    // if (window.firebase && firebase.auth && !firebase.auth().currentUser) { ... } 
}

/**
 * Show error message
 */
function showError(message = 'An error occurred') {
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('error-state').style.display = 'block';
    document.getElementById('message-container').style.display = 'none';
    document.getElementById('regenerate-options').style.display = 'none';
    
    const errorMessage = document.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) {
        retryBtn.addEventListener('click', function() {
            document.getElementById('error-state').style.display = 'none';
            document.getElementById('loading-state').style.display = 'flex';
            setTimeout(() => {
                generateMessage();
            }, 1000);
        });
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