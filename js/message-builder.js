/**
 * HeartGlowAI - Unified Message Builder
 * This file contains all the functionality for the unified message creation experience
 */

// Global state
let currentUser = null;
let currentStep = 'recipient';
let messageData = {
    recipient: null,
    intent: null,
    tone: null,
    result: null
};

// Step definitions
const STEPS = {
    recipient: {
        id: 'step-recipient',
        previous: null,
        next: 'intent',
        validate: validateRecipientStep
    },
    intent: {
        id: 'step-intent',
        previous: 'recipient',
        next: 'tone',
        validate: validateIntentStep
    },
    tone: {
        id: 'step-tone',
        previous: 'intent',
        next: 'result',
        validate: validateToneStep
    },
    result: {
        id: 'step-result',
        previous: 'tone',
        next: null,
        validate: null
    }
};

// DOM Elements - these will be initialized on page load
let elements = {
    steps: {},
    sidebar: {},
    preview: {},
    buttons: {},
    modals: {}
};

// Initialize the page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeMessageBuilder);

/**
 * Main initialization function
 */
function initializeMessageBuilder() {
    console.log('Initializing unified message builder...');
    
    // Initialize Firebase
    initializeFirebase();
    
    // Initialize DOM elements
    initializeElements();
    
    // Apply visibility fixes to connections list elements
    setTimeout(fixConnectionsVisibility, 500);
    
    // Set up event listeners
    setupEventListeners();
    
    // Check authentication state
    checkAuthentication();
    
    // Initialize preview panel
    initializePreviewPanel();
    
    // Try to load existing data (if the user is resuming)
    loadExistingData();
    
    // Show the current step (determined by loadExistingData)
    showStep(currentStep);
}

/**
 * Initialize Firebase
 */
function initializeFirebase() {
    try {
        // Firebase config - copied from existing pages
        const firebaseConfig = {
            apiKey: "AIzaSyBZiJPTs7dMccVgFV-YoTejnhy1bZNFEQY",
            authDomain: "heartglowai.firebaseapp.com",
            projectId: "heartglowai",
            storageBucket: "heartglowai.firebasestorage.app",
            messagingSenderId: "196565711798",
            appId: "1:196565711798:web:79e2b0320fd8e74ab0df17",
            measurementId: "G-KJMPL1DNPY"
        };
        
        console.log("Starting Firebase initialization...");
        
        // Initialize Firebase if not already initialized
        if (!window.firebase || !firebase.apps || !firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log("Firebase initialized successfully");
            
            // Set persistence to LOCAL for auth (copied from home.html)
            if (firebase && firebase.auth) {
                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                    .catch(function(error) {
                        console.error("Auth persistence error:", error);
                        // Continue anyway, not critical
                    });
            }
        } else {
            console.log("Firebase already initialized");
        }
        
        // Configure analytics
        if (firebase.analytics) {
            firebase.analytics().logEvent('unified_flow_start', {
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Firebase initialization error:', error);
        showAlert('An error occurred during initialization. Please refresh the page.', 'error');
    }
}

/**
 * Check user authentication
 */
function checkAuthentication() {
    showLoading('Checking authentication...');
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            currentUser = user;
            updateUserInterface(user);
            hideLoading();
            
            // Only try to load user's connections after we confirm authentication
            console.log('User authenticated:', user.uid);
            loadUserConnections();
        } else {
            // No user is signed in, redirect to login
            console.log('No user authenticated, redirecting to login');
            window.location.href = 'login.html';
        }
    });
}

/**
 * Update UI with user information
 */
function updateUserInterface(user) {
    if (!user) return;
    
    // Update user menu
    const userInitials = elements.userMenu.initials;
    const userDisplayName = elements.userMenu.displayName;
    const userEmail = elements.userMenu.email;
    
    if (userInitials) {
        userInitials.textContent = getInitials(user.displayName || user.email || 'User');
    }
    
    if (userDisplayName) {
        userDisplayName.textContent = user.displayName || 'User';
    }
    
    if (userEmail) {
        userEmail.textContent = user.email || '';
    }
}

/**
 * Get user's initials from name
 */
function getInitials(name) {
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
}

/**
 * Initialize all DOM elements
 */
function initializeElements() {
    console.log('Initializing DOM elements...');
    
    try {
        // User menu elements
        elements.userMenu = {
            button: document.getElementById('userMenuBtn'),
            dropdown: document.getElementById('userDropdown'),
            initials: document.getElementById('userInitials'),
            displayName: document.getElementById('userDisplayName'),
            email: document.getElementById('userEmail'),
            logoutBtn: document.getElementById('logoutBtn')
        };
        
        // Step elements
        elements.steps = {
            recipient: document.getElementById('step-recipient'),
            intent: document.getElementById('step-intent'),
            tone: document.getElementById('step-tone'),
            result: document.getElementById('step-result')
        };
        
        // Sidebar elements
        elements.sidebar = {
            container: document.querySelector('.message-builder__sidebar'),
            steps: document.querySelectorAll('.progress-step'),
            startOverBtn: document.getElementById('startOverBtn')
        };
        
        // Navigation buttons
        elements.buttons = {
            recipientNext: document.getElementById('recipientNextBtn'),
            intentPrev: document.getElementById('intentPrevBtn'),
            intentNext: document.getElementById('intentNextBtn'),
            tonePrev: document.getElementById('tonePrevBtn'),
            toneNext: document.getElementById('toneNextBtn'),
            resultPrev: document.getElementById('resultPrevBtn'),
            createNew: document.getElementById('createNewBtn')
        };
        
        // Preview panel elements
        elements.preview = {
            container: document.querySelector('.message-builder__preview'),
            recipientName: document.getElementById('preview-recipient-name'),
            recipientRelationship: document.getElementById('preview-recipient-relationship'),
            recipientInitial: document.getElementById('preview-recipient-initial'),
            intent: document.getElementById('preview-intent'),
            tone: document.getElementById('preview-tone'),
            messageText: document.getElementById('preview-message-text'),
            messagePlaceholder: document.getElementById('preview-message-placeholder')
        };
        
        // Connection modal elements
        elements.modals = {
            connectionModal: document.getElementById('connection-modal'),
            connectionForm: document.getElementById('connection-form'),
            connectionName: document.getElementById('connection-name'),
            connectionRelationship: document.getElementById('connection-relationship'),
            otherRelationship: document.getElementById('other-relationship'),
            otherRelationshipGroup: document.getElementById('other-relationship-group'),
            connectionSave: document.getElementById('connection-save'),
            connectionCancel: document.getElementById('connection-cancel'),
            connectionTitle: document.getElementById('connection-modal-title'),
            closeButtons: document.querySelectorAll('.close-modal')
        };
        
        // Loading and alerts
        elements.loading = {
            overlay: document.getElementById('loadingOverlay'),
            context: document.getElementById('loadingContext')
        };
        
        elements.alerts = {
            container: document.getElementById('alertContainer')
        };
        
        // Recipient step specific elements
        elements.recipientStep = {
            connectionsList: document.getElementById('connections-list'),
            addNewConnection: document.getElementById('add-new-connection')
        };
        
        // Log elements that are critical for functionality
        console.log('Critical elements initialization:');
        console.log('- Recipient step element:', elements.steps.recipient ? 'Found' : 'MISSING');
        console.log('- Connections list element:', elements.recipientStep.connectionsList ? 'Found' : 'MISSING');
        console.log('- Add connection button:', elements.recipientStep.addNewConnection ? 'Found' : 'MISSING');
        console.log('- Next button:', elements.buttons.recipientNext ? 'Found' : 'MISSING');
        
        // If connections list is not found, try alternative selectors
        if (!elements.recipientStep.connectionsList) {
            console.warn('Connections list element not found by ID, trying alternatives...');
            
            // Try by class name
            const byClass = document.querySelector('.connections-list');
            if (byClass) {
                console.log('Found connections list by class');
                elements.recipientStep.connectionsList = byClass;
            } else {
                // Try by attribute
                const byAttribute = document.querySelector('[data-element="connections-list"]');
                if (byAttribute) {
                    console.log('Found connections list by attribute');
                    elements.recipientStep.connectionsList = byAttribute;
                } else {
                    console.error('Could not find connections list element by any method');
                }
            }
        }
        
        // Log stylesheets for debugging styling issues
        console.log('Stylesheets loaded:', document.styleSheets.length);
        Array.from(document.styleSheets).slice(0, 5).forEach((sheet, i) => {
            console.log(`Sheet ${i}:`, sheet.href || 'inline');
        });
        
        console.log('Intent Back button DOM element:', document.getElementById('intentPrevBtn'));
        console.log('Intent Next button DOM element:', document.getElementById('intentNextBtn'));
        
    } catch (error) {
        console.error('Error initializing DOM elements:', error);
    }
}

/**
 * Set up event listeners for all interactive elements
 */
function setupEventListeners() {
    // User menu toggle
    if (elements.userMenu.button && elements.userMenu.dropdown) {
        elements.userMenu.button.addEventListener('click', function(e) {
            e.stopPropagation();
            elements.userMenu.dropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking elsewhere
        document.addEventListener('click', function() {
            if (elements.userMenu.dropdown.classList.contains('show')) {
                elements.userMenu.dropdown.classList.remove('show');
            }
        });
    }
    
    // Logout button
    if (elements.userMenu.logoutBtn) {
        elements.userMenu.logoutBtn.addEventListener('click', function() {
            showLoading('Signing out...');
            firebase.auth().signOut()
                .then(() => {
                    window.location.href = 'login.html';
                })
                .catch(error => {
                    hideLoading();
                    showAlert('Error signing out: ' + error.message, 'error');
                });
        });
    }
    
    // Navigation buttons
    // Recipient step
    if (elements.buttons.recipientNext) {
        elements.buttons.recipientNext.addEventListener('click', function() {
            goToNextStep('recipient');
        });
    }
    
    // Intent step
    if (elements.buttons.intentPrev) {
        console.log('Back button found:', elements.buttons.intentPrev);
        elements.buttons.intentPrev.addEventListener('click', function() {
            console.log('Back button clicked');
            goToPreviousStep('intent');
        });
        
        // Add direct onclick attribute as backup
        elements.buttons.intentPrev.setAttribute('onclick', "goToPreviousStep('intent')");
    }
    
    if (elements.buttons.intentNext) {
        console.log('Next button found:', elements.buttons.intentNext);
        elements.buttons.intentNext.addEventListener('click', function() {
            console.log('Next button clicked');
            goToNextStep('intent');
        });
        
        // Add direct onclick attribute as backup
        elements.buttons.intentNext.setAttribute('onclick', "goToNextStep('intent')");
    }
    
    // Tone step
    if (elements.buttons.tonePrev) {
        elements.buttons.tonePrev.addEventListener('click', function() {
            goToPreviousStep('tone');
        });
    }
    
    if (elements.buttons.toneNext) {
        elements.buttons.toneNext.addEventListener('click', function() {
            goToNextStep('tone');
        });
    }
    
    // Result step
    if (elements.buttons.resultPrev) {
        elements.buttons.resultPrev.addEventListener('click', function() {
            goToPreviousStep('result');
        });
    }
    
    if (elements.buttons.createNew) {
        elements.buttons.createNew.addEventListener('click', function() {
            // Confirm with user before starting over
            if (confirm('Start a new message? Your current message will be saved to your history.')) {
                resetAll();
                showStep('recipient');
            }
        });
    }
    
    // Sidebar progress steps
    elements.sidebar.steps.forEach(step => {
        step.addEventListener('click', function() {
            const stepId = this.getAttribute('data-step');
            
            // Only allow clicking on completed steps or the current step
            if (this.classList.contains('completed') || this.classList.contains('active')) {
                showStep(stepId);
            }
        });
    });
    
    // Start over button
    if (elements.sidebar.startOverBtn) {
        elements.sidebar.startOverBtn.addEventListener('click', function() {
            // Confirm with user before starting over
            if (confirm('Are you sure you want to start over? This will clear your current progress.')) {
                resetAll();
                showStep('recipient');
            }
        });
    }
    
    // Add new connection button
    if (elements.recipientStep.addNewConnection) {
        elements.recipientStep.addNewConnection.addEventListener('click', function() {
            openConnectionModal();
        });
    }
    
    // Connection relationship selection
    if (elements.modals.connectionRelationship) {
        elements.modals.connectionRelationship.addEventListener('change', function() {
            const value = this.value;
            
            // Show "other relationship" field if "other" is selected
            if (value === 'other') {
                elements.modals.otherRelationshipGroup.style.display = 'block';
            } else {
                elements.modals.otherRelationshipGroup.style.display = 'none';
            }
        });
    }
    
    // Connection save button
    if (elements.modals.connectionSave) {
        elements.modals.connectionSave.addEventListener('click', function() {
            saveConnection();
        });
    }
    
    // Connection cancel button
    if (elements.modals.connectionCancel) {
        elements.modals.connectionCancel.addEventListener('click', function() {
            closeConnectionModal();
        });
    }
    
    // Modal close buttons
    elements.modals.closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });
    
    // Close modals when clicking outside content
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Save data before user leaves page
    window.addEventListener('beforeunload', function() {
        saveAllData();
    });
}

/**
 * Initialize preview panel with enhanced features
 */
function initializePreviewPanel() {
    console.log('Initializing enhanced preview panel...');
    
    // Add preview toggle button for mobile view
    const previewPanel = document.querySelector('.message-builder__preview');
    const contentArea = document.querySelector('.message-builder__content');
    
    // Create mobile toggle button if it doesn't exist
    if (!document.getElementById('preview-toggle-btn') && previewPanel && contentArea) {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'preview-toggle-btn';
        toggleBtn.className = 'preview-toggle-btn';
        toggleBtn.innerHTML = `
            <i class="fas fa-eye"></i>
            <span>Preview</span>
        `;
        
        // Add to DOM
        document.body.appendChild(toggleBtn);
        
        // Add toggle functionality
        toggleBtn.addEventListener('click', function() {
            previewPanel.classList.toggle('show-mobile');
            
            // Update button text
            if (previewPanel.classList.contains('show-mobile')) {
                toggleBtn.innerHTML = `
                    <i class="fas fa-times"></i>
                    <span>Close</span>
                `;
            } else {
                toggleBtn.innerHTML = `
                    <i class="fas fa-eye"></i>
                    <span>Preview</span>
                `;
            }
        });
    }
    
    // Add animation hooks for preview updates
    const previewElements = [
        elements.preview.recipientName,
        elements.preview.recipientRelationship,
        elements.preview.intent,
        elements.preview.tone,
        elements.preview.messageText
    ];
    
    // Add animation classes to elements
    previewElements.forEach(element => {
        if (element) {
            element.classList.add('preview-animated');
        }
    });
    
    // Initialize preview with any existing data
    updatePreview(true);
}

/**
 * Update preview panel with current message data
 * @param {boolean} skipAnimation - Whether to skip animations
 */
function updatePreview(skipAnimation = false) {
    console.log('Updating preview panel...');
    
    try {
        // Recipient preview
        if (messageData.recipient) {
            const name = messageData.recipient.name || '';
            const relationship = formatRelationship(messageData.recipient) || '';
            const initial = getInitials(name);
            
            // Update recipient information
            updatePreviewElement(elements.preview.recipientName, name, skipAnimation);
            updatePreviewElement(elements.preview.recipientRelationship, relationship, skipAnimation);
            updatePreviewElement(elements.preview.recipientInitial, initial, skipAnimation);
            
            // Update avatar background
            if (elements.preview.recipientInitial?.parentElement) {
                elements.preview.recipientInitial.parentElement.style.background = '#8a57de';
            }
        }
        
        // Intent preview
        if (messageData.intent) {
            updatePreviewElement(elements.preview.intent, messageData.intent.title || '', skipAnimation);
        } else {
            updatePreviewElement(elements.preview.intent, '-', skipAnimation);
        }
        
        // Tone preview
        if (messageData.tone) {
            updatePreviewElement(elements.preview.tone, messageData.tone.name || '', skipAnimation);
        } else {
            updatePreviewElement(elements.preview.tone, '-', skipAnimation);
        }
        
        // Message preview placeholder/text logic
        if (messageData.result && messageData.result.message) {
            // We have a generated message
            if (elements.preview.messagePlaceholder) elements.preview.messagePlaceholder.style.display = 'none';
            if (elements.preview.messageText) {
                elements.preview.messageText.style.display = 'block';
                updatePreviewElement(elements.preview.messageText, messageData.result.message, skipAnimation);
            }
        } else {
            // Still in progress, show placeholder
            if (elements.preview.messagePlaceholder) elements.preview.messagePlaceholder.style.display = 'block';
            if (elements.preview.messageText) elements.preview.messageText.style.display = 'none';
            
            // Customize placeholder based on progress
            let placeholderText = 'Your message will appear here as you make selections...';
            if (messageData.recipient && messageData.intent && messageData.tone) {
                placeholderText = 'Ready to generate your message! Complete all steps to see the result.';
            } else if (messageData.recipient && messageData.intent) {
                placeholderText = 'Now select a tone to refine your message...';
            } else if (messageData.recipient) {
                placeholderText = 'Next, choose your message intent...';
            }
            
            if (elements.preview.messagePlaceholder) {
                updatePreviewElement(elements.preview.messagePlaceholder, placeholderText, skipAnimation);
            }
        }
    } catch (error) {
        console.error('Error updating preview:', error);
    }
}

/**
 * Update a preview element with animation
 * @param {Element} element - Element to update
 * @param {string} value - New text value
 * @param {boolean} skipAnimation - Whether to skip animation
 */
function updatePreviewElement(element, value, skipAnimation) {
    if (!element) return;
    
    if (element.textContent === value) return; // No change
    
    if (skipAnimation) {
        element.textContent = value;
        return;
    }
    
    // Add animation class
    element.classList.add('updating');
    
    // Set new value after short delay
    setTimeout(() => {
        element.textContent = value;
        
        // Remove animation class
        setTimeout(() => {
            element.classList.remove('updating');
        }, 300);
    }, 300);
}

/**
 * Load user's connections from Firestore
 * @param {boolean} forceReload - Whether to bypass cache and force reload
 * @returns {Promise} Promise that resolves with connections array
 */
function loadUserConnections(forceReload = false) {
    if (!currentUser || !currentUser.uid) {
        console.error('Cannot load connections: No user is logged in');
        showAlert('Authentication issue detected. Please refresh the page.', 'error');
        return Promise.reject(new Error('No authenticated user'));
    }
    
    // Use cached connections if available and not forcing reload
    if (!forceReload && window.cachedConnections && window.cachedConnections.length > 0) {
        console.log('Using cached connections');
        displayConnections(window.cachedConnections);
        return Promise.resolve(window.cachedConnections);
    }
    
    showLoading('Loading your connections...');
    console.log('Loading connections for user:', currentUser.uid);
    
    return firebase.firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('connections')
        .orderBy('name')
        .get()
        .then(snapshot => {
            hideLoading();
            console.log('Connections loaded successfully');
            
            // Process connections
            const connections = [];
            snapshot.forEach(doc => {
                const connection = {
                    id: doc.id,
                    ...doc.data()
                };
                connections.push(connection);
            });
            
            // Cache connections for future use
            window.cachedConnections = connections;
            
            // Display connections in the UI
            displayConnections(connections);
            return connections;
        })
        .catch(error => {
            hideLoading();
            console.error('Error loading connections:', error);
            showAlert('Failed to load your connections. Please try refreshing the page.', 'error');
            return [];
        });
}

/**
 * Initialize the recipient step
 */
function initializeRecipientStep() {
    console.log('Initializing recipient step...');
    
    // Initialize the connections list
    const connectionsList = elements.recipientStep.connectionsList;
    if (!connectionsList) {
        console.error('Connections list element not found');
        return;
    }
    
    // Add search functionality for connections
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'searchConnections';
    searchInput.className = 'search-connections';
    searchInput.placeholder = 'Search connections...';
    
    // Create search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.appendChild(searchInput);
    
    // Add search container before connections list
    connectionsList.parentNode.insertBefore(searchContainer, connectionsList);
    
    // Add search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        // Get all connection cards
        const cards = connectionsList.querySelectorAll('.connection-card');
        
        // Filter cards based on search term
        cards.forEach(card => {
            const nameText = card.querySelector('.connection-name').textContent.toLowerCase();
            const relationshipText = card.querySelector('.connection-relationship').textContent.toLowerCase();
            
            if (nameText.includes(searchTerm) || relationshipText.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

/**
 * Add a connection card to the connections list
 * @param {Object} connection - Connection data
 */
function addConnectionCard(connection) {
    console.log('Adding connection card for:', connection.name);
    
    const connectionsList = elements.recipientStep.connectionsList;
    if (!connectionsList) {
        console.error('Cannot add connection card: Connection list element not found');
        return;
    }
    
    try {
        // Create the card element
        const card = document.createElement('div');
        card.className = 'connection-card';
        card.setAttribute('data-id', connection.id);
        
        // Get relationship icon
        let relationshipIcon = 'user-friends';
        switch (connection.relationship) {
            case 'family': relationshipIcon = 'home'; break;
            case 'partner': relationshipIcon = 'heart'; break;
            case 'coworker': relationshipIcon = 'briefcase'; break;
            case 'friend': relationshipIcon = 'user-friends'; break;
            default: relationshipIcon = 'user'; break;
        }
        
        // Build card content
        card.innerHTML = `
            <div class="connection-avatar">
                <span>${getInitials(connection.name)}</span>
                <div class="connection-icon">
                    <i class="fas fa-${relationshipIcon}"></i>
                </div>
            </div>
            <div class="connection-info">
                <div class="connection-name">${connection.name}</div>
                <div class="connection-relationship">${formatRelationship(connection)}</div>
            </div>
            <div class="connection-actions">
                <button class="connection-edit" aria-label="Edit connection">
                    <i class="fas fa-pencil-alt"></i>
                </button>
            </div>
        `;
        
        // Apply enhanced styling directly to the card for consistent visibility
        card.style.border = '1px solid #8a57de';
        card.style.padding = '16px';
        card.style.borderRadius = '12px';
        card.style.margin = '12px 0';
        card.style.display = 'flex';
        card.style.alignItems = 'center';
        card.style.justifyContent = 'space-between';
        card.style.background = '#211E2E';
        card.style.cursor = 'pointer';
        card.style.transition = 'all 0.2s ease';
        card.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        
        // Style avatar
        const avatar = card.querySelector('.connection-avatar');
        if (avatar) {
            avatar.style.width = '40px';
            avatar.style.height = '40px';
            avatar.style.borderRadius = '50%';
            avatar.style.background = '#8a57de';
            avatar.style.color = 'white';
            avatar.style.display = 'flex';
            avatar.style.alignItems = 'center';
            avatar.style.justifyContent = 'center';
            avatar.style.position = 'relative';
            avatar.style.marginRight = '12px';
        }
        
        // Style icon
        const icon = card.querySelector('.connection-icon');
        if (icon) {
            icon.style.position = 'absolute';
            icon.style.bottom = '-4px';
            icon.style.right = '-4px';
            icon.style.background = '#ff7eb6';
            icon.style.borderRadius = '50%';
            icon.style.width = '16px';
            icon.style.height = '16px';
            icon.style.display = 'flex';
            icon.style.alignItems = 'center';
            icon.style.justifyContent = 'center';
            icon.style.fontSize = '8px';
        }
        
        // Style info
        const info = card.querySelector('.connection-info');
        if (info) {
            info.style.flex = '1';
        }
        
        // Style name
        const name = card.querySelector('.connection-name');
        if (name) {
            name.style.fontWeight = 'bold';
            name.style.color = 'white';
            name.style.fontSize = '16px';
        }
        
        // Style relationship
        const relationship = card.querySelector('.connection-relationship');
        if (relationship) {
            relationship.style.color = '#b8b5c7';
            relationship.style.fontSize = '14px';
        }
        
        // Find and style edit button
        const editBtn = card.querySelector('.connection-edit');
        if (editBtn) {
            // Style the button
            editBtn.style.background = 'transparent';
            editBtn.style.border = 'none';
            editBtn.style.color = '#8a57de';
            editBtn.style.cursor = 'pointer';
            editBtn.style.padding = '8px';
            
            // Add click handler for edit button
            editBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent card selection
                console.log('Edit button clicked for:', connection.name);
                editConnection(connection);
            });
        }
        
        // Add card to list
        connectionsList.appendChild(card);
        console.log('Card added to DOM:', card);
        
        // Add hover effect
        card.addEventListener('mouseover', function() {
            this.style.background = '#2D2A3B';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseout', function() {
            this.style.background = '#211E2E';
            this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        });
        
        // Add animation class after a short delay (for animation)
        setTimeout(() => {
            card.classList.add('fade-in');
        }, 10);
        
        // Add click handler
        card.addEventListener('click', function(e) {
            console.log('Connection card clicked:', connection.name);
            
            // Ignore clicks on the edit button
            if (e.target.closest('.connection-edit')) {
                e.stopPropagation();
                return; // Edit button has its own handler
            }
            
            // Remove selected class from all cards
            document.querySelectorAll('.connection-card').forEach(c => {
                c.classList.remove('selected');
                c.style.border = '1px solid #8a57de';
                c.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
            });
            
            // Add selected class to this card
            this.classList.add('selected');
            this.style.border = '2px solid #ff7eb6';
            this.style.boxShadow = '0 0 0 2px rgba(255, 126, 182, 0.2)';
            
            // Save the selected recipient
            messageData.recipient = {
                id: connection.id,
                name: connection.name,
                relationship: connection.relationship,
                otherRelationship: connection.otherRelationship || ''
            };
            
            // Save to localStorage
            localStorage.setItem('recipientData', JSON.stringify(messageData.recipient));
            
            // Enable next button
            elements.buttons.recipientNext.classList.remove('disabled');
            elements.buttons.recipientNext.style.opacity = '1';
            elements.buttons.recipientNext.style.pointerEvents = 'auto';
            
            // Update preview
            updatePreview();
        });
    } catch (error) {
        console.error('Error creating connection card:', error);
    }
}

/**
 * Format relationship text for display
 * @param {Object} connection - Connection data
 * @returns {string} Formatted relationship text
 */
function formatRelationship(connection) {
    if (!connection || !connection.relationship) return '';
    
    // If other relationship is specified, return that
    if (connection.relationship === 'other' && connection.otherRelationship) {
        return connection.otherRelationship.charAt(0).toUpperCase() + connection.otherRelationship.slice(1);
    }
    
    // Otherwise capitalize the relationship type
    return connection.relationship.charAt(0).toUpperCase() + connection.relationship.slice(1);
}

/**
 * Open connection modal to create/edit a connection
 * @param {string} connectionId - Optional ID of connection to edit
 */
function openConnectionModal(connectionId = null) {
    const modal = elements.modals.connectionModal;
    if (!modal) return;
    
    // Set modal title based on whether we're creating or editing
    const isEditing = !!connectionId;
    elements.modals.connectionTitle.textContent = isEditing ? 'Edit Connection' : 'New Connection';
    
    // Reset form
    elements.modals.connectionForm.reset();
    elements.modals.otherRelationshipGroup.style.display = 'none';
    
    // If editing, populate form with connection data
    if (isEditing) {
        showLoading('Loading connection...');
        
        firebase.firestore()
            .collection('users')
            .doc(currentUser.uid)
            .collection('connections')
            .doc(connectionId)
            .get()
            .then(doc => {
                hideLoading();
                
                if (doc.exists) {
                    const connection = doc.data();
                    
                    elements.modals.connectionName.value = connection.name || '';
                    elements.modals.connectionRelationship.value = connection.relationship || '';
                    
                    if (connection.relationship === 'other') {
                        elements.modals.otherRelationship.value = connection.otherRelationship || '';
                        elements.modals.otherRelationshipGroup.style.display = 'block';
                    }
                    
                    // Store the ID for update
                    elements.modals.connectionForm.setAttribute('data-editing-id', connectionId);
                } else {
                    showAlert('Connection not found.', 'error');
                    closeConnectionModal();
                }
            })
            .catch(error => {
                console.error('Error loading connection:', error);
                hideLoading();
                showAlert('Failed to load connection. Please try again.', 'error');
                closeConnectionModal();
            });
    } else {
        // Clear any previous editing ID
        elements.modals.connectionForm.removeAttribute('data-editing-id');
    }
    
    // Show modal
    openModal(modal);
}

/**
 * Close the connection modal
 */
function closeConnectionModal() {
    closeModal(elements.modals.connectionModal);
}

/**
 * Save connection to Firestore
 */
function saveConnection() {
    if (!currentUser) {
        showAlert('Please sign in to save connections.', 'error');
        return;
    }
    
    // Validate form
    const name = elements.modals.connectionName.value.trim();
    const relationship = elements.modals.connectionRelationship.value;
    
    if (!name) {
        showAlert('Please enter a name.', 'error');
        return;
    }
    
    if (!relationship) {
        showAlert('Please select a relationship.', 'error');
        return;
    }
    
    // Get other relationship if applicable
    let otherRelationship = '';
    if (relationship === 'other') {
        otherRelationship = elements.modals.otherRelationship.value.trim();
        
        if (!otherRelationship) {
            showAlert('Please specify the relationship.', 'error');
            return;
        }
    }
    
    // Prepare connection data
    const connectionData = {
        name,
        relationship,
        otherRelationship,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    showLoading('Saving connection...');
    
    // Check if we're editing or creating
    const editingId = elements.modals.connectionForm.getAttribute('data-editing-id');
    
    const connectionRef = firebase.firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('connections');
    
    // Create or update the connection
    const savePromise = editingId 
        ? connectionRef.doc(editingId).update({
            ...connectionData,
            updatedAt: new Date().toISOString() // Only update the update time
          }) 
        : connectionRef.add(connectionData);
    
    savePromise
        .then(result => {
            hideLoading();
            
            // Get the ID if this is a new connection
            const connectionId = editingId || (result?.id);
            
            // Add the new connection to messageData if selected
            if (!editingId) {
                messageData.recipient = {
                    id: connectionId,
                    name,
                    relationship,
                    otherRelationship
                };
                
                // Enable next button
                elements.buttons.recipientNext.classList.remove('disabled');
                
                // Save to localStorage
                localStorage.setItem('recipientData', JSON.stringify(messageData.recipient));
                
                // Update preview panel
                updatePreview();
            }
            
            // Close modal
            closeConnectionModal();
            
            // Reload connections
            loadUserConnections();
            
            // Show success message
            showAlert(`Connection ${editingId ? 'updated' : 'created'} successfully.`, 'success');
            
            // Track event
            if (firebase.analytics) {
                firebase.analytics().logEvent('connection_saved', {
                    isNew: !editingId,
                    hasName: !!name,
                    relationshipType: relationship
                });
            }
        })
        .catch(error => {
            console.error('Error saving connection:', error);
            hideLoading();
            showAlert('Failed to save connection. Please try again.', 'error');
        });
}

/**
 * Open a modal
 */
function openModal(modal) {
    if (!modal) return;
    
    // Add show class
    modal.classList.add('show');
    
    // Set aria-hidden
    modal.setAttribute('aria-hidden', 'false');
    
    // Add body class to prevent scrolling
    document.body.classList.add('modal-open');
}

/**
 * Close a modal
 */
function closeModal(modal) {
    if (!modal) return;
    
    // Remove show class
    modal.classList.remove('show');
    
    // Set aria-hidden
    modal.setAttribute('aria-hidden', 'true');
    
    // Remove body class
    document.body.classList.remove('modal-open');
}

/**
 * Show a specific step with enhanced validation and animations
 * @param {string} stepId - The ID of the step to show
 * @param {boolean} skipAnimation - Whether to skip the animation
 * @returns {boolean} - Whether the step change was successful
 */
function showStep(stepId, skipAnimation = false) {
    console.log(`Showing step: ${stepId}`);
    
    // Validate step ID
    if (!STEPS[stepId]) {
        console.error(`Invalid step ID: ${stepId}`);
        return;
    }
    
    // Store previous step for animation purposes
    const previousStep = currentStep;
    currentStep = stepId;
    
    try {
        // Track analytics
        trackStepChange(previousStep, currentStep);
        
        // Update steps visibility
        Object.keys(elements.steps).forEach(step => {
            if (elements.steps[step]) {
                elements.steps[step].classList.remove('active');
            }
        });
        
        if (elements.steps[stepId]) {
            elements.steps[stepId].classList.add('active');
            // Scroll to top
            elements.steps[stepId].scrollTop = 0;
        }
        
        // Update sidebar
        elements.sidebar.steps.forEach(step => {
            step.classList.remove('active');
            step.classList.remove('completed');
            
            // Get step ID from data attribute
            const sidebarStepId = step.getAttribute('data-step');
            
            // Mark completed steps
            const stepIndex = Object.keys(STEPS).indexOf(sidebarStepId);
            const currentIndex = Object.keys(STEPS).indexOf(currentStep);
            
            if (stepIndex < currentIndex) {
                step.classList.add('completed');
            }
            
            // Mark active step
            if (sidebarStepId === currentStep) {
                step.classList.add('active');
            }
        });
        
        // Initialize navigation protection
        initializeNavigationProtection();
        
        // Initialize step-specific content
        initializeStepContent(stepId);
        
        // Update preview panel
        updatePreview();
        
        // Ensure navigation buttons are visible after a short delay
        setTimeout(() => {
            verifyAndFixStepFooter(stepId);
        }, 300);
        
        // Force enable all buttons for testing
        forceEnableAllButtons();
        
        return true;
    } catch (error) {
        console.error('Error showing step:', error);
        showErrorRecoveryOptions(error, stepId, previousStep);
        return false;
    }
}

/**
 * Forcefully enable all navigation buttons (for troubleshooting)
 */
function forceEnableAllButtons() {
    console.log('Forcefully enabling all navigation buttons');
    
    const allButtons = [
        elements.buttons.recipientNext,
        elements.buttons.intentPrev,
        elements.buttons.intentNext,
        elements.buttons.tonePrev,
        elements.buttons.toneNext,
        elements.buttons.resultPrev,
        elements.buttons.createNew
    ];
    
    allButtons.forEach(button => {
        if (button) {
            button.classList.remove('disabled');
            button.disabled = false;
        }
    });
    
    // Also try to get buttons by ID directly
    const buttonIds = [
        'recipientNextBtn',
        'intentPrevBtn',
        'intentNextBtn',
        'tonePrevBtn',
        'toneNextBtn',
        'resultPrevBtn',
        'createNewBtn'
    ];
    
    buttonIds.forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            console.log(`Enabling button by ID: ${id}`);
            button.classList.remove('disabled');
            button.disabled = false;
        }
    });
}

/**
 * Apply enhanced styling to navigation buttons for better visibility
 */
function enhanceNavigationButtonsStyle() {
    console.log('Enhancing navigation buttons style');
    
    // Style all navigation buttons
    const allButtons = [
        elements.buttons.recipientNext,
        elements.buttons.intentPrev,
        elements.buttons.intentNext,
        elements.buttons.tonePrev,
        elements.buttons.toneNext,
        elements.buttons.resultPrev,
        elements.buttons.createNew
    ];
    
    // Debug button existence
    allButtons.forEach((button, index) => {
        const buttonNames = ['recipientNext', 'intentPrev', 'intentNext', 'tonePrev', 'toneNext', 'resultPrev', 'createNew'];
        console.log(`Button ${buttonNames[index]} exists:`, !!button);
    });
    
    // Base styles for all buttons
    allButtons.forEach(button => {
        if (!button) return;
        
        // Common styles
        button.style.padding = '12px 24px';
        button.style.borderRadius = '8px';
        button.style.fontWeight = 'bold';
        button.style.transition = 'all 0.2s ease';
        button.style.cursor = 'pointer';
        
        // CRITICAL: Force visibility properties
        button.style.opacity = button.classList.contains('disabled') ? '0.5' : '1';
        button.style.visibility = 'visible';
        button.style.display = 'inline-flex';
        button.style.position = 'relative';
        button.style.zIndex = '100';
        button.style.overflow = 'visible';
        
        // Specific styles based on button type
        if (button.classList.contains('primary-button')) {
            // Primary button styles
            button.style.background = 'linear-gradient(135deg, #8a57de 0%, #ff7eb6 100%)';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.boxShadow = '0 4px 12px rgba(138, 87, 222, 0.25)';
        } else if (button.classList.contains('secondary-button')) {
            // Secondary button styles
            button.style.background = 'transparent';
            button.style.color = 'white';
            button.style.border = '1px solid #8a57de';
        }
        
        // Disabled state
        if (button.classList.contains('disabled')) {
            button.style.opacity = '0.5';
            button.style.pointerEvents = 'none';
        } else {
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        }
        
        // Hover effects
        button.addEventListener('mouseover', function() {
            if (this.classList.contains('primary-button') && !this.classList.contains('disabled')) {
                this.style.boxShadow = '0 6px 16px rgba(138, 87, 222, 0.4)';
                this.style.transform = 'translateY(-2px)';
            } else if (this.classList.contains('secondary-button') && !this.classList.contains('disabled')) {
                this.style.background = 'rgba(138, 87, 222, 0.1)';
            }
        });
        
        button.addEventListener('mouseout', function() {
            if (this.classList.contains('primary-button') && !this.classList.contains('disabled')) {
                this.style.boxShadow = '0 4px 12px rgba(138, 87, 222, 0.25)';
                this.style.transform = 'translateY(0)';
            } else if (this.classList.contains('secondary-button') && !this.classList.contains('disabled')) {
                this.style.background = 'transparent';
            }
        });
    });
    
    // Special enhancement for the next button in current step
    let currentNextButton = null;
    switch (currentStep) {
        case 'recipient': currentNextButton = elements.buttons.recipientNext; break;
        case 'intent': currentNextButton = elements.buttons.intentNext; break;
        case 'tone': currentNextButton = elements.buttons.toneNext; break;
        case 'result': currentNextButton = elements.buttons.createNew; break;
    }
    
    if (currentNextButton) {
        // Make it more prominent
        currentNextButton.style.padding = '14px 28px';
        currentNextButton.style.fontSize = '16px';
        
        // Add a subtle animation pulse if not disabled
        if (!currentNextButton.classList.contains('disabled')) {
            currentNextButton.style.animation = 'pulse 2s infinite';
            
            // Add keyframes for pulse animation if they don't exist
            if (!document.getElementById('pulse-animation')) {
                const style = document.createElement('style');
                style.id = 'pulse-animation';
                style.innerHTML = `
                    @keyframes pulse {
                        0% { box-shadow: 0 4px 12px rgba(138, 87, 222, 0.25); }
                        50% { box-shadow: 0 8px 24px rgba(138, 87, 222, 0.5); }
                        100% { box-shadow: 0 4px 12px rgba(138, 87, 222, 0.25); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    // Create a floating button container as backup
    ensureFloatingNavigationButtons();
}

/**
 * Update sidebar with enhanced animations
 * @param {string} previousStep - The previous step ID
 * @param {string} newStep - The new step ID
 */
function updateSidebar(previousStep, newStep) {
    // First update all steps
    updateStepProgress();
    
    // Then add animation to the current step indicator
    const previousStepElement = previousStep ? 
        document.querySelector(`.progress-step[data-step="${previousStep}"]`) : null;
    
    const newStepElement = document.querySelector(`.progress-step[data-step="${newStep}"]`);
    
    if (previousStepElement && newStepElement && previousStep !== newStep) {
        // Add pulse animation to current step
        newStepElement.classList.add('pulse-animation');
        
        // Remove pulse after animation completes
        setTimeout(() => {
            newStepElement.classList.remove('pulse-animation');
        }, 1000);
    }
}

/**
 * Initialize step-specific content and functionality
 * @param {string} stepId - The step ID to initialize
 */
function initializeStepContent(stepId) {
    console.log(`Initializing content for step: ${stepId}`);
    
    switch (stepId) {
        case 'recipient':
            try {
                // Show temporary loading state
                const connectionsList = elements.recipientStep.connectionsList;
                if (connectionsList) {
                    connectionsList.innerHTML = '<div class="loading-state"><div class="loading-spinner-small"></div><p>Loading connections...</p></div>';
                }
                
                // Add a test card after a delay to ensure the container is ready
                setTimeout(() => {
                    testConnectionCard();
                }, 2000);
                
                // Load recipient step content
                refreshConnectionsList()
                    .then(connections => {
                        console.log('Connections loaded for recipient step:', connections.length);
                        
                        // Check if we have a selected recipient already
                        if (messageData.recipient && messageData.recipient.id) {
                            console.log('Found selected recipient:', messageData.recipient.name);
                            // Update the UI with a delay to ensure DOM is ready
                            setTimeout(() => {
                                updateSelectedRecipient(messageData.recipient);
                            }, 100);
                        }
                    })
                    .catch(error => {
                        console.error('Error loading connections:', error);
                        // Show user-friendly error
                        if (connectionsList) {
                            connectionsList.innerHTML = '<div class="error-state"><p>Failed to load connections. Please try refreshing the page.</p></div>';
                        }
                        showAlert('Failed to load connections. Please try refreshing the page.', 'error');
                    });
            } catch (error) {
                console.error('Error initializing recipient step:', error);
                showAlert('There was a problem setting up this step. Please try refreshing the page.', 'error');
            }
            break;
            
        case 'intent':
            // Initialize the intent selection step
            try {
                console.log('Initializing intent step');
                if (typeof initializeIntentStep === 'function') {
                    initializeIntentStep();
                } else {
                    console.warn('initializeIntentStep function not found');
                }
            } catch (error) {
                console.error('Error initializing intent step:', error);
                showAlert('There was a problem setting up this step. Please try refreshing the page.', 'error');
            }
            break;
            
        case 'tone':
            // Initialize the tone selection step
            try {
                console.log('Initializing tone step');
                if (typeof initializeToneStep === 'function') {
                    initializeToneStep();
                } else {
                    console.warn('initializeToneStep function not found');
                }
            } catch (error) {
                console.error('Error initializing tone step:', error);
                showAlert('There was a problem setting up this step. Please try refreshing the page.', 'error');
            }
            break;
            
        case 'result':
            // Initialize the result step
            try {
                console.log('Initializing result step');
                if (typeof initializeResultStep === 'function') {
                    initializeResultStep();
                } else {
                    console.warn('initializeResultStep function not found');
                }
            } catch (error) {
                console.error('Error initializing result step:', error);
                showAlert('There was a problem setting up this step. Please try refreshing the page.', 'error');
            }
            break;
            
        default:
            console.log(`No specific initialization for step: ${stepId}`);
    }
}

/**
 * Smoothly navigate to the next step with validation
 * @param {string} currentStepId - The current step ID
 * @returns {boolean} - Whether the navigation was successful
 */
function goToNextStep(currentStepId) {
    // Get the next step
    const nextStep = STEPS[currentStepId].next;
    
    if (!nextStep) {
        console.warn(`No next step defined for ${currentStepId}`);
        return false;
    }
    
    // Validate current step if validation function exists
    if (STEPS[currentStepId].validate) {
        const isValid = STEPS[currentStepId].validate();
        
        if (!isValid) {
            console.warn(`Validation failed for step: ${currentStepId}`);
            return false;
        }
    }
    
    // Save data from current step
    saveStepData(currentStepId);
    
    // If going to result step, check if we need to generate a message
    if (nextStep === 'result' && (!messageData.result || !messageData.result.message)) {
        const genFunctions = {
            showStep: () => {
                showStep(nextStep);
                return generateMessage();
            }
        };
        
        // Slight delay to allow animation to start
        setTimeout(genFunctions.showStep, 100);
    } else {
        // Show the next step
        return showStep(nextStep);
    }
    
    return true;
}

/**
 * Smoothly navigate to the previous step
 * @param {string} currentStepId - The current step ID
 * @returns {boolean} - Whether the navigation was successful
 */
function goToPreviousStep(currentStepId) {
    // Get the previous step
    const prevStep = STEPS[currentStepId].previous;
    
    if (!prevStep) {
        console.warn(`No previous step defined for ${currentStepId}`);
        return false;
    }
    
    // Save data from current step even if incomplete
    saveStepData(currentStepId);
    
    // Show the previous step
    return showStep(prevStep);
}

/**
 * Initialize intent step
 */
function initializeIntentStep() {
    console.log('Initializing intent step');
    
    try {
        // Get intent step content container
        const stepBody = document.querySelector('#step-intent .step-body');
        if (!stepBody) {
            console.error('Intent step body not found');
            return;
        }
        
        // Check if content is already initialized
        if (stepBody.querySelector('.intent-options-container')) {
            console.log('Intent step already initialized, enhancing UI');
            
            // Just add click handlers to cards
            const intentCards = stepBody.querySelectorAll('.intent-card, .option-card');
            console.log('Found intent cards:', intentCards.length);
            
            // Add click event listeners to all intent cards
            intentCards.forEach(card => {
                card.addEventListener('click', function() {
                    console.log('Intent card clicked:', this.getAttribute('data-intent-id'));
                    
                    // Get intent data
                    const intentId = this.getAttribute('data-intent-id') || this.getAttribute('data-intent');
                    const category = this.getAttribute('data-category') || 'personal';
                    const title = this.querySelector('.option-card__title, .intent-card__title')?.textContent || 
                                 this.querySelector('h3')?.textContent || 'Custom Intent';
                    const description = this.querySelector('.option-card__description, .intent-card__description')?.textContent || 
                                       this.querySelector('p')?.textContent || '';
                    
                    // Create intent data
                    const intentData = {
                        id: intentId,
                        type: intentId,
                        category: category,
                        title: title,
                        description: description
                    };
                    
                    // Handle selection
                    handleIntentSelection(this, intentData);
                });
                
                // Add direct click attribute as backup
                card.setAttribute('onclick', "this.click()");
            });
            
            // Force enable the Next button for testing
            enableIntentNextButton();
            return;
        }
        
        // Otherwise, create the UI from scratch (existing code)
        console.log('Creating intent UI from scratch');
        // ... rest of original function
    } catch (error) {
        console.error('Error initializing intent step:', error);
        showAlert('There was a problem setting up this step. Please try refreshing the page.', 'error');
    }
}

/**
 * Create intent selection UI
 * @param {Element} container - Container to add UI to
 */
function createIntentUI(container) {
    console.log('Creating intent selection UI');
    
    // Create intent categories toggle
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'intent-toggle';
    toggleContainer.innerHTML = `
        <button class="intent-toggle__btn active" data-category="professional">
            <i class="fas fa-briefcase"></i> Professional
        </button>
        <button class="intent-toggle__btn" data-category="personal">
            <i class="fas fa-heart"></i> Personal
        </button>
    `;
    
    // Create intent options container
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'intent-options-container';
    
    // Create professional intents
    const professionalOptions = document.createElement('div');
    professionalOptions.className = 'intent-options professional active';
    professionalOptions.innerHTML = createIntentOptionsHTML('professional');
    
    // Create personal intents
    const personalOptions = document.createElement('div');
    personalOptions.className = 'intent-options personal';
    personalOptions.style.display = 'none';
    personalOptions.innerHTML = createIntentOptionsHTML('personal');
    
    // Assemble the UI
    optionsContainer.appendChild(professionalOptions);
    optionsContainer.appendChild(personalOptions);
    
    container.appendChild(toggleContainer);
    container.appendChild(optionsContainer);
    
    // Add event listeners for category toggle
    const toggleButtons = toggleContainer.querySelectorAll('.intent-toggle__btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            toggleIntentCategory(category);
        });
    });
    
    // Add event listeners for intent selection
    const intentCards = optionsContainer.querySelectorAll('.option-card');
    intentCards.forEach(card => {
        card.addEventListener('click', function() {
            selectIntent(this);
        });
    });
}

/**
 * Create HTML for intent options
 * @param {string} category - Category of intents (professional or personal)
 * @returns {string} HTML for intent options
 */
function createIntentOptionsHTML(category) {
    const professionalIntents = [
        {
            id: 'say_thank_you',
            title: 'Say Thank You',
            description: 'Express sincere gratitude for something someone has done for you.',
            icon: 'fa-gift'
        },
        {
            id: 'reconnect',
            title: 'Reconnect',
            description: 'Reach out to someone you haven\'t spoken to in a while.',
            icon: 'fa-users'
        },
        {
            id: 'give_feedback',
            title: 'Give Feedback',
            description: 'Provide constructive feedback in a supportive way.',
            icon: 'fa-comment'
        },
        {
            id: 'introduce_yourself',
            title: 'Introduce Yourself',
            description: 'Make a professional introduction that stands out.',
            icon: 'fa-handshake'
        }
    ];
    
    const personalIntents = [
        {
            id: 'thinking_of_you',
            title: 'Thinking of You',
            description: 'Let someone know they\'ve been on your mind and you care about them.',
            icon: 'fa-heart'
        },
        {
            id: 'express_feelings',
            title: 'Express Feelings',
            description: 'Share your emotions or how someone makes you feel.',
            icon: 'fa-smile'
        },
        {
            id: 'celebrate_milestone',
            title: 'Celebrate a Milestone',
            description: 'Brighten someone\'s special day or achievement.',
            icon: 'fa-birthday-cake'
        },
        {
            id: 'apologize',
            title: 'Apologize',
            description: 'Say sorry in a sincere and heartfelt way.',
            icon: 'fa-hands'
        }
    ];
    
    const intents = category === 'professional' ? professionalIntents : personalIntents;
    
    let html = '';
    intents.forEach(intent => {
        html += `
            <div class="option-card" data-intent-id="${intent.id}" data-category="${category}">
                <div class="option-card__icon">
                    <i class="fas ${intent.icon}"></i>
                </div>
                <div class="option-card__content">
                    <h3 class="option-card__title">${intent.title}</h3>
                    <p class="option-card__description">${intent.description}</p>
                </div>
            </div>
        `;
    });
    
    // Add custom intent option
    html += `
        <div class="option-card custom-intent" data-intent-id="custom" data-category="${category}">
            <div class="option-card__icon">
                <i class="fas fa-pencil-alt"></i>
            </div>
            <div class="option-card__content">
                <h3 class="option-card__title">Custom Intent</h3>
                <p class="option-card__description">Specify your own messaging intent.</p>
            </div>
        </div>
    `;
    
    return html;
}

/**
 * Toggle between professional and personal intent categories
 * @param {string} category - Category to show (professional or personal)
 */
function toggleIntentCategory(category) {
    console.log(`Toggling intent category to: ${category}`);
    
    // Update toggle buttons
    const toggleButtons = document.querySelectorAll('.intent-toggle__btn');
    toggleButtons.forEach(button => {
        if (button.getAttribute('data-category') === category) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Update options containers
    const optionsContainers = document.querySelectorAll('.intent-options');
    optionsContainers.forEach(container => {
        if (container.classList.contains(category)) {
            container.classList.add('active');
            container.style.display = 'grid';
        } else {
            container.classList.remove('active');
            container.style.display = 'none';
        }
    });
    
    // Save the selected category
    messageData.intentCategory = category;
    localStorage.setItem('messageCategory', category);
    
    // Apply enhanced styling to the toggle buttons
    styleIntentCategories();
}

/**
 * Select an intent option
 * @param {Element} intentCard - Selected intent card element
 */
function selectIntent(intentCard) {
    console.log('Intent selected:', intentCard.getAttribute('data-intent-id'));
    
    // Remove selected class from all cards
    const allCards = document.querySelectorAll('.option-card');
    allCards.forEach(card => {
        card.classList.remove('selected');
        // Reset styling
        card.style.border = '1px solid #8a57de';
        card.style.transform = 'none';
        card.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
    });
    
    // Add selected class and styling to clicked card
    intentCard.classList.add('selected');
    intentCard.style.border = '2px solid #ff7eb6';
    intentCard.style.transform = 'translateY(-3px)';
    intentCard.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
    
    // Get intent data
    const intentId = intentCard.getAttribute('data-intent-id');
    const category = intentCard.getAttribute('data-category');
    const title = intentCard.querySelector('.option-card__title').textContent;
    const description = intentCard.querySelector('.option-card__description').textContent;
    
    // Handle custom intent
    if (intentId === 'custom') {
        showCustomIntentInput();
    } else {
        // Save intent data
        messageData.intent = {
            id: intentId,
            category: category,
            title: title,
            description: description
        };
        
        // Save to localStorage
        localStorage.setItem('messageIntention', intentId);
        localStorage.setItem('messageCategory', category);
        
        // Enable next button
        const nextButton = document.getElementById('intentNextBtn');
        if (nextButton) {
            nextButton.classList.remove('disabled');
            nextButton.style.opacity = '1';
            nextButton.style.pointerEvents = 'auto';
        }
        
        // Update preview
        updatePreview();
    }
}

/**
 * Show custom intent input
 */
function showCustomIntentInput() {
    console.log('Showing custom intent input');
    
    // Create custom intent modal
    const modalHTML = `
        <div id="custom-intent-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Custom Intent</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="custom-intent-text">Describe your messaging intent</label>
                        <textarea id="custom-intent-text" rows="4" placeholder="e.g., I want to express my appreciation for their mentorship"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="custom-intent-cancel" class="secondary-button">Cancel</button>
                    <button id="custom-intent-save" class="primary-button">Save</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body if it doesn't exist
    if (!document.getElementById('custom-intent-modal')) {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer.firstChild);
        
        // Add event listeners
        const modal = document.getElementById('custom-intent-modal');
        const closeButton = modal.querySelector('.close-modal');
        const cancelButton = document.getElementById('custom-intent-cancel');
        const saveButton = document.getElementById('custom-intent-save');
        
        closeButton.addEventListener('click', () => closeModal(modal));
        cancelButton.addEventListener('click', () => closeModal(modal));
        
        saveButton.addEventListener('click', () => {
            const customText = document.getElementById('custom-intent-text').value.trim();
            if (customText) {
                // Save custom intent
                messageData.intent = {
                    id: 'custom',
                    category: messageData.intentCategory || 'personal',
                    title: 'Custom Intent',
                    description: customText,
                    customText: customText
                };
                
                // Save to localStorage
                localStorage.setItem('messageIntention', 'custom');
                localStorage.setItem('customIntentText', customText);
                
                // Enable next button
                const nextButton = document.getElementById('intentNextBtn');
                if (nextButton) {
                    nextButton.classList.remove('disabled');
                    nextButton.style.opacity = '1';
                    nextButton.style.pointerEvents = 'auto';
                }
                
                // Update preview
                updatePreview();
                
                // Close modal
                closeModal(modal);
            } else {
                // Show error if no text entered
                alert('Please enter a description of your intent');
            }
        });
    }
    
    // Open the modal
    const modal = document.getElementById('custom-intent-modal');
    openModal(modal);
    
    // Focus on the textarea
    setTimeout(() => {
        const textarea = document.getElementById('custom-intent-text');
        if (textarea) textarea.focus();
    }, 300);
}

/**
 * Enhance the intent UI with better styling and interactions
 */
function enhanceIntentUI() {
    console.log('Enhancing intent UI');
    
    // Style category toggle buttons
    styleIntentCategories();
    
    // Enhance intent cards
    enhanceIntentCards();
    
    // Ensure next button is visible and properly styled
    enhanceNavigationButtons();
    
    // Pre-select any saved intent
    restoreSavedIntent();
}

/**
 * Style intent category toggle buttons
 */
function styleIntentCategories() {
    console.log('Styling intent categories');
    
    const categoryButtons = document.querySelectorAll('.intent-toggle__btn');
    categoryButtons.forEach(btn => {
        // Base styles
        btn.style.padding = '12px 20px';
        btn.style.borderRadius = '6px';
        btn.style.fontSize = '15px';
        btn.style.fontWeight = 'bold';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'all 0.2s ease';
        btn.style.margin = '0 8px';
        btn.style.minWidth = '140px';
        
        // Active vs inactive styles
        if (btn.classList.contains('active')) {
            btn.style.background = 'linear-gradient(135deg, #8a57de 0%, #ff7eb6 100%)';
            btn.style.color = 'white';
            btn.style.boxShadow = '0 4px 12px rgba(138, 87, 222, 0.25)';
            btn.style.border = 'none';
        } else {
            btn.style.background = 'transparent';
            btn.style.color = '#b8b5c7';
            btn.style.border = '1px solid #8a57de';
        }
    });
    
    // Style container
    const toggleContainer = document.querySelector('.intent-toggle');
    if (toggleContainer) {
        toggleContainer.style.display = 'flex';
        toggleContainer.style.justifyContent = 'center';
        toggleContainer.style.margin = '0 0 24px 0';
    }
}

/**
 * Enhance intent option cards
 */
function enhanceIntentCards() {
    console.log('Enhancing intent cards');
    
    const intentCards = document.querySelectorAll('.option-card');
    intentCards.forEach(card => {
        // Card base styling
        card.style.background = 'linear-gradient(135deg, #2D2A3B 0%, #211E2E 100%)';
        card.style.borderRadius = '12px';
        card.style.padding = '20px';
        card.style.border = '1px solid #8a57de';
        card.style.cursor = 'pointer';
        card.style.transition = 'all 0.3s ease';
        card.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        
        // Icon styling
        const icon = card.querySelector('.option-card__icon');
        if (icon) {
            icon.style.width = '40px';
            icon.style.height = '40px';
            icon.style.borderRadius = '50%';
            icon.style.backgroundColor = '#8a57de';
            icon.style.color = 'white';
            icon.style.display = 'flex';
            icon.style.alignItems = 'center';
            icon.style.justifyContent = 'center';
            icon.style.marginBottom = '16px';
        }
        
        // Title styling
        const title = card.querySelector('.option-card__title');
        if (title) {
            title.style.fontSize = '18px';
            title.style.fontWeight = 'bold';
            title.style.color = 'white';
            title.style.marginBottom = '8px';
        }
        
        // Description styling
        const description = card.querySelector('.option-card__description');
        if (description) {
            description.style.fontSize = '14px';
            description.style.color = '#b8b5c7';
            description.style.lineHeight = '1.4';
        }
        
        // Add hover effects
        card.addEventListener('mouseover', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
                this.style.border = '1px solid #b296ff';
            }
        });
        
        card.addEventListener('mouseout', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'none';
                this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
                this.style.border = '1px solid #8a57de';
            }
        });
    });
    
    // Style container for options
    const optionsContainers = document.querySelectorAll('.intent-options');
    optionsContainers.forEach(container => {
        container.style.display = container.classList.contains('active') ? 'grid' : 'none';
        container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
        container.style.gap = '16px';
        container.style.marginTop = '24px';
    });
}

/**
 * Enhance navigation buttons styling
 */
function enhanceNavigationButtons() {
    console.log('Enhancing navigation buttons');
    
    // Style all navigation buttons
    const allButtons = [
        document.getElementById('intentPrevBtn'),
        document.getElementById('intentNextBtn')
    ];
    
    // Base styles for all buttons
    allButtons.forEach(button => {
        if (!button) return;
        
        // Common styles
        button.style.padding = '12px 24px';
        button.style.borderRadius = '8px';
        button.style.fontWeight = 'bold';
        button.style.transition = 'all 0.2s ease';
        button.style.cursor = 'pointer';
        button.style.display = 'inline-flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        
        // Specific styles based on button type
        if (button.classList.contains('primary-button')) {
            // Primary button styles
            button.style.background = 'linear-gradient(135deg, #8a57de 0%, #ff7eb6 100%)';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.boxShadow = '0 4px 12px rgba(138, 87, 222, 0.25)';
        } else if (button.classList.contains('secondary-button')) {
            // Secondary button styles
            button.style.background = 'transparent';
            button.style.color = 'white';
            button.style.border = '1px solid #8a57de';
        }
        
        // Disabled state
        if (button.classList.contains('disabled')) {
            button.style.opacity = '0.5';
            button.style.pointerEvents = 'none';
        } else {
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        }
    });
    
    // Special handling for next button
    const nextButton = document.getElementById('intentNextBtn');
    if (nextButton) {
        nextButton.style.padding = '14px 28px';
        nextButton.style.fontSize = '16px';
        
        // Add pulse animation if not disabled
        if (!nextButton.classList.contains('disabled')) {
            nextButton.style.animation = 'pulse 2s infinite';
            
            // Add keyframes for pulse animation if they don't exist
            if (!document.getElementById('pulse-animation')) {
                const style = document.createElement('style');
                style.id = 'pulse-animation';
                style.innerHTML = `
                    @keyframes pulse {
                        0% { box-shadow: 0 4px 12px rgba(138, 87, 222, 0.25); }
                        50% { box-shadow: 0 8px 24px rgba(138, 87, 222, 0.5); }
                        100% { box-shadow: 0 4px 12px rgba(138, 87, 222, 0.25); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }
    
    // Style the step footer to ensure buttons are positioned correctly
    const stepFooter = document.querySelector('#step-intent .step-footer');
    if (stepFooter) {
        stepFooter.style.display = 'flex';
        stepFooter.style.justifyContent = 'space-between';
        stepFooter.style.marginTop = '24px';
        stepFooter.style.padding = '16px 0';
    }
}

/**
 * Restore any previously saved intent
 */
function restoreSavedIntent() {
    console.log('Restoring saved intent');
    
    // Check if we have intent data
    const savedCategory = localStorage.getItem('messageCategory') || 'professional';
    const savedIntentId = localStorage.getItem('messageIntention');
    
    console.log('Saved intent:', savedIntentId, 'Category:', savedCategory);
    
    if (savedCategory) {
        // Switch to the saved category
        toggleIntentCategory(savedCategory);
    }
    
    if (savedIntentId) {
        // Find and select the saved intent card
        const intentCard = document.querySelector(`.option-card[data-intent-id="${savedIntentId}"][data-category="${savedCategory}"]`);
        
        if (intentCard) {
            console.log('Found saved intent card, selecting it');
            selectIntent(intentCard);
        } else if (savedIntentId === 'custom') {
            // Handle custom intent
            const customText = localStorage.getItem('customIntentText');
            if (customText) {
                // Select the custom intent card
                const customCard = document.querySelector(`.option-card[data-intent-id="custom"][data-category="${savedCategory}"]`);
                if (customCard) {
                    selectIntent(customCard);
                    
                    // Manually set the intent data
                    messageData.intent = {
                        id: 'custom',
                        category: savedCategory,
                        title: 'Custom Intent',
                        description: customText,
                        customText: customText
                    };
                    
                    // Enable next button
                    const nextButton = document.getElementById('intentNextBtn');
                    if (nextButton) {
                        nextButton.classList.remove('disabled');
                        nextButton.style.opacity = '1';
                        nextButton.style.pointerEvents = 'auto';
                    }
                    
                    // Update preview
                    updatePreview();
                }
            }
        }
    }
}

/**
 * Initialize tone step
 */
function initializeToneStep() {
    console.log('Initializing tone step');
    
    try {
        // Get tone step content container
        const stepBody = document.querySelector('#step-tone .step-body');
        if (!stepBody) {
            console.error('Tone step body not found');
            return;
        }
        
        // Check if content is already initialized
        if (stepBody.querySelector('.tone-options-container')) {
            console.log('Tone step already initialized, enhancing UI');
            enhanceToneUI();
            return;
        }
        
        // Create tone selection UI
        createToneUI(stepBody);
        
        // Enhance the UI with better styling and interactions
        enhanceToneUI();
        
    } catch (error) {
        console.error('Error initializing tone step:', error);
    }
}

/**
 * Create tone selection UI
 * @param {Element} container - Container to add UI to
 */
function createToneUI(container) {
    console.log('Creating tone selection UI');
    
    // Create context section to show recipient and intent
    const contextSection = document.createElement('div');
    contextSection.className = 'tone-context';
    contextSection.innerHTML = `
        <div class="tone-context__title">Creating a message for:</div>
        <div class="tone-context__card">
            <div class="tone-context__recipient">
                <div class="tone-context__avatar">
                    <span id="context-recipient-initial"></span>
                </div>
                <div class="tone-context__info">
                    <div id="context-recipient-name" class="tone-context__name"></div>
                    <div id="context-recipient-relationship" class="tone-context__relationship"></div>
                </div>
            </div>
            <div class="tone-context__divider"></div>
            <div class="tone-context__intent">
                <div class="tone-context__intent-icon">
                    <i class="fas fa-comment"></i>
                </div>
                <div id="context-intent" class="tone-context__intent-text"></div>
            </div>
        </div>
    `;
    
    // Create tone options container
    const toneOptionsContainer = document.createElement('div');
    toneOptionsContainer.className = 'tone-options-container';
    toneOptionsContainer.innerHTML = createToneOptionsHTML();
    
    // Assemble the UI
    container.appendChild(contextSection);
    container.appendChild(toneOptionsContainer);
    
    // Add event listeners for tone selection
    const toneCards = toneOptionsContainer.querySelectorAll('.tone-card');
    toneCards.forEach(card => {
        card.addEventListener('click', function() {
            selectTone(this);
        });
    });
    
    // Update context with recipient and intent data
    updateToneContext();
}

/**
 * Create HTML for tone options
 * @returns {string} HTML for tone options
 */
function createToneOptionsHTML() {
    const tones = [
        {
            id: 'warm',
            name: 'Warm',
            description: 'Friendly and approachable with genuine warmth.',
            icon: 'fa-smile'
        },
        {
            id: 'professional',
            name: 'Professional',
            description: 'Polished and appropriate for work contexts.',
            icon: 'fa-briefcase'
        },
        {
            id: 'enthusiastic',
            name: 'Enthusiastic',
            description: 'Energetic and excited with a positive outlook.',
            icon: 'fa-star'
        },
        {
            id: 'sincere',
            name: 'Sincere',
            description: 'Heartfelt and honest with genuine emotion.',
            icon: 'fa-heart'
        },
        {
            id: 'grateful',
            name: 'Grateful',
            description: 'Expressing genuine appreciation and thanks.',
            icon: 'fa-hands'
        },
        {
            id: 'humorous',
            name: 'Humorous',
            description: 'Light-hearted with appropriate humor.',
            icon: 'fa-laugh'
        },
        {
            id: 'respectful',
            name: 'Respectful',
            description: 'Showing clear respect and consideration.',
            icon: 'fa-user-tie'
        },
        {
            id: 'supportive',
            name: 'Supportive',
            description: 'Encouraging and uplifting in tone.',
            icon: 'fa-hands-helping'
        }
    ];
    
    let html = '<div class="tone-grid">';
    
    tones.forEach(tone => {
        html += `
            <div class="tone-card" data-tone-id="${tone.id}">
                <div class="tone-card__icon">
                    <i class="fas ${tone.icon}"></i>
                </div>
                <div class="tone-card__content">
                    <h3 class="tone-card__name">${tone.name}</h3>
                    <p class="tone-card__description">${tone.description}</p>
                </div>
            </div>
        `;
    });
    
    // Add custom tone option
    html += `
        <div class="tone-card custom-tone" data-tone-id="custom">
            <div class="tone-card__icon">
                <i class="fas fa-pencil-alt"></i>
            </div>
            <div class="tone-card__content">
                <h3 class="tone-card__name">Custom Tone</h3>
                <p class="tone-card__description">Specify your own preferred tone or style.</p>
            </div>
        </div>
    `;
    
    html += '</div>';
    
    return html;
}

/**
 * Select a tone option
 * @param {Element} toneCard - Selected tone card element
 */
function selectTone(toneCard) {
    console.log('Tone selected:', toneCard.getAttribute('data-tone-id'));
    
    // Remove selected class from all cards
    const allCards = document.querySelectorAll('.tone-card');
    allCards.forEach(card => {
        card.classList.remove('selected');
        // Reset styling
        card.style.border = '1px solid #8a57de';
        card.style.transform = 'none';
        card.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
    });
    
    // Add selected class and styling to clicked card
    toneCard.classList.add('selected');
    toneCard.style.border = '2px solid #ff7eb6';
    toneCard.style.transform = 'translateY(-3px)';
    toneCard.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
    
    // Get tone data
    const toneId = toneCard.getAttribute('data-tone-id');
    const name = toneCard.querySelector('.tone-card__name').textContent;
    const description = toneCard.querySelector('.tone-card__description').textContent;
    
    // Handle custom tone
    if (toneId === 'custom') {
        showCustomToneInput();
    } else {
        // Save tone data
        messageData.tone = {
            type: toneId,
            name: name,
            description: description
        };
        
        // Save to localStorage
        localStorage.setItem('toneData', JSON.stringify(messageData.tone));
        
        // Enable next button
        const nextButton = document.getElementById('toneNextBtn');
        if (nextButton) {
            nextButton.classList.remove('disabled');
            nextButton.style.opacity = '1';
            nextButton.style.pointerEvents = 'auto';
        }
        
        // Update preview
        updatePreview();
    }
}

/**
 * Show custom tone input
 */
function showCustomToneInput() {
    console.log('Showing custom tone input');
    
    // Create custom tone modal
    const modalHTML = `
        <div id="custom-tone-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Custom Tone</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="custom-tone-text">Describe your preferred tone</label>
                        <textarea id="custom-tone-text" rows="4" placeholder="e.g., Gentle but firm, with a touch of humor"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="custom-tone-cancel" class="secondary-button">Cancel</button>
                    <button id="custom-tone-save" class="primary-button">Save</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body if it doesn't exist
    if (!document.getElementById('custom-tone-modal')) {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer.firstChild);
        
        // Add event listeners
        const modal = document.getElementById('custom-tone-modal');
        const closeButton = modal.querySelector('.close-modal');
        const cancelButton = document.getElementById('custom-tone-cancel');
        const saveButton = document.getElementById('custom-tone-save');
        
        closeButton.addEventListener('click', () => closeModal(modal));
        cancelButton.addEventListener('click', () => closeModal(modal));
        
        saveButton.addEventListener('click', () => {
            const customText = document.getElementById('custom-tone-text').value.trim();
            if (customText) {
                // Save custom tone
                messageData.tone = {
                    type: 'custom',
                    name: 'Custom',
                    description: customText,
                    customText: customText
                };
                
                // Save to localStorage
                localStorage.setItem('toneData', JSON.stringify(messageData.tone));
                
                // Enable next button
                const nextButton = document.getElementById('toneNextBtn');
                if (nextButton) {
                    nextButton.classList.remove('disabled');
                    nextButton.style.opacity = '1';
                    nextButton.style.pointerEvents = 'auto';
                }
                
                // Update preview
                updatePreview();
                
                // Close modal
                closeModal(modal);
            } else {
                // Show error if no text entered
                alert('Please enter a description of your preferred tone');
            }
        });
    }
    
    // Open the modal
    const modal = document.getElementById('custom-tone-modal');
    openModal(modal);
    
    // Focus on the textarea
    setTimeout(() => {
        const textarea = document.getElementById('custom-tone-text');
        if (textarea) textarea.focus();
    }, 300);
}

/**
 * Update the context section with recipient and intent data
 */
function updateToneContext() {
    console.log('Updating tone context');
    
    // Update recipient information
    if (messageData.recipient) {
        const nameElement = document.getElementById('context-recipient-name');
        const relationshipElement = document.getElementById('context-recipient-relationship');
        const initialElement = document.getElementById('context-recipient-initial');
        
        if (nameElement) nameElement.textContent = messageData.recipient.name || '';
        if (relationshipElement) relationshipElement.textContent = formatRelationship(messageData.recipient) || '';
        if (initialElement) initialElement.textContent = getInitials(messageData.recipient.name || '');
    }
    
    // Update intent information
    if (messageData.intent) {
        const intentElement = document.getElementById('context-intent');
        if (intentElement) intentElement.textContent = messageData.intent.title || '';
    }
}

/**
 * Enhance the tone UI with better styling and interactions
 */
function enhanceToneUI() {
    console.log('Enhancing tone UI');
    
    // Style tone context section
    styleToneContext();
    
    // Enhance tone cards
    enhanceToneCards();
    
    // Ensure next button is visible and properly styled
    enhanceNavigationButtons();
    
    // Pre-select any saved tone
    restoreSavedTone();
}

/**
 * Style the tone context section
 */
function styleToneContext() {
    console.log('Styling tone context');
    
    const contextSection = document.querySelector('.tone-context');
    if (contextSection) {
        contextSection.style.marginBottom = '24px';
        
        // Style the title
        const title = contextSection.querySelector('.tone-context__title');
        if (title) {
            title.style.fontSize = '16px';
            title.style.color = '#b8b5c7';
            title.style.marginBottom = '12px';
        }
        
        // Style the context card
        const card = contextSection.querySelector('.tone-context__card');
        if (card) {
            card.style.background = 'linear-gradient(135deg, #2D2A3B 0%, #211E2E 100%)';
            card.style.borderRadius = '12px';
            card.style.padding = '16px';
            card.style.border = '1px solid #8a57de';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.gap = '12px';
        }
        
        // Style recipient row
        const recipient = contextSection.querySelector('.tone-context__recipient');
        if (recipient) {
            recipient.style.display = 'flex';
            recipient.style.alignItems = 'center';
        }
        
        // Style avatar
        const avatar = contextSection.querySelector('.tone-context__avatar');
        if (avatar) {
            avatar.style.width = '40px';
            avatar.style.height = '40px';
            avatar.style.borderRadius = '50%';
            avatar.style.background = '#8a57de';
            avatar.style.color = 'white';
            avatar.style.display = 'flex';
            avatar.style.alignItems = 'center';
            avatar.style.justifyContent = 'center';
            avatar.style.marginRight = '12px';
            avatar.style.fontSize = '16px';
            avatar.style.fontWeight = 'bold';
        }
        
        // Style recipient info
        const info = contextSection.querySelector('.tone-context__info');
        if (info) {
            info.style.flex = '1';
        }
        
        // Style name
        const name = contextSection.querySelector('.tone-context__name');
        if (name) {
            name.style.fontWeight = 'bold';
            name.style.color = 'white';
            name.style.fontSize = '16px';
        }
        
        // Style relationship
        const relationship = contextSection.querySelector('.tone-context__relationship');
        if (relationship) {
            relationship.style.color = '#b8b5c7';
            relationship.style.fontSize = '14px';
        }
        
        // Style divider
        const divider = contextSection.querySelector('.tone-context__divider');
        if (divider) {
            divider.style.height = '1px';
            divider.style.background = '#3D3A4B';
            divider.style.margin = '8px 0';
        }
        
        // Style intent row
        const intent = contextSection.querySelector('.tone-context__intent');
        if (intent) {
            intent.style.display = 'flex';
            intent.style.alignItems = 'center';
        }
        
        // Style intent icon
        const intentIcon = contextSection.querySelector('.tone-context__intent-icon');
        if (intentIcon) {
            intentIcon.style.width = '28px';
            intentIcon.style.height = '28px';
            intentIcon.style.borderRadius = '50%';
            intentIcon.style.background = '#ff7eb6';
            intentIcon.style.color = 'white';
            intentIcon.style.display = 'flex';
            intentIcon.style.alignItems = 'center';
            intentIcon.style.justifyContent = 'center';
            intentIcon.style.marginRight = '12px';
            intentIcon.style.fontSize = '14px';
        }
        
        // Style intent text
        const intentText = contextSection.querySelector('.tone-context__intent-text');
        if (intentText) {
            intentText.style.color = 'white';
            intentText.style.fontSize = '15px';
        }
    }
}

/**
 * Enhance tone cards with styling and animations
 */
function enhanceToneCards() {
    console.log('Enhancing tone cards');
    
    const toneCards = document.querySelectorAll('.tone-card');
    toneCards.forEach(card => {
        // Card base styling
        card.style.background = 'linear-gradient(135deg, #2D2A3B 0%, #211E2E 100%)';
        card.style.borderRadius = '12px';
        card.style.padding = '16px';
        card.style.border = '1px solid #8a57de';
        card.style.cursor = 'pointer';
        card.style.transition = 'all 0.3s ease';
        card.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        
        // Icon styling
        const icon = card.querySelector('.tone-card__icon');
        if (icon) {
            icon.style.width = '36px';
            icon.style.height = '36px';
            icon.style.borderRadius = '50%';
            icon.style.backgroundColor = '#8a57de';
            icon.style.color = 'white';
            icon.style.display = 'flex';
            icon.style.alignItems = 'center';
            icon.style.justifyContent = 'center';
            icon.style.marginBottom = '12px';
        }
        
        // Name styling
        const name = card.querySelector('.tone-card__name');
        if (name) {
            name.style.fontSize = '17px';
            name.style.fontWeight = 'bold';
            name.style.color = 'white';
            name.style.marginBottom = '6px';
        }
        
        // Description styling
        const description = card.querySelector('.tone-card__description');
        if (description) {
            description.style.fontSize = '14px';
            description.style.color = '#b8b5c7';
            description.style.lineHeight = '1.4';
        }
        
        // Add hover effects
        card.addEventListener('mouseover', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
                this.style.border = '1px solid #b296ff';
            }
        });
        
        card.addEventListener('mouseout', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'none';
                this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
                this.style.border = '1px solid #8a57de';
            }
        });
    });
    
    // Style container for tone grid
    const toneGrid = document.querySelector('.tone-grid');
    if (toneGrid) {
        toneGrid.style.display = 'grid';
        toneGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
        toneGrid.style.gap = '16px';
        toneGrid.style.marginTop = '16px';
    }
}

/**
 * Restore any previously saved tone
 */
function restoreSavedTone() {
    console.log('Restoring saved tone');
    
    try {
        // Check if we have tone data in messageData
        if (messageData.tone && messageData.tone.type) {
            const toneId = messageData.tone.type;
            
            // Find and select the saved tone card
            const toneCard = document.querySelector(`.tone-card[data-tone-id="${toneId}"]`);
            
            if (toneCard) {
                console.log('Found saved tone card, selecting it');
                selectTone(toneCard);
            } else if (toneId === 'custom' && messageData.tone.customText) {
                // Handle custom tone
                const customCard = document.querySelector(`.tone-card[data-tone-id="custom"]`);
                if (customCard) {
                    selectTone(customCard);
                    
                    // Update the message data directly
                    // Update preview
                    updatePreview();
                    
                    // Enable next button
                    const nextButton = document.getElementById('toneNextBtn');
                    if (nextButton) {
                        nextButton.classList.remove('disabled');
                        nextButton.style.opacity = '1';
                        nextButton.style.pointerEvents = 'auto';
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error restoring saved tone:', error);
    }
}

/**
 * Validate the tone step data
 */
function validateToneStep() {
    if (!messageData.tone) {
        showAlert('Please select a tone for your message.', 'error');
        return false;
    }
    
    if (messageData.tone.type === 'custom' && !messageData.tone.customText) {
        showAlert('Please describe your custom tone.', 'error');
        return false;
    }
    
    return true;
}

/**
 * Initialize the result step
 */
function initializeResultStep() {
    console.log('Initializing result step...');
    
    // Get the result step content container
    const stepContent = elements.steps.result.querySelector('.step-body');
    if (!stepContent) {
        console.error('Result step content container not found');
        return;
    }
    
    // Build the HTML for the result step
    stepContent.innerHTML = `
        <div class="message-container">
            <!-- Message Display -->
            <div class="message-card" id="message-display">
                <div class="message-header">
                    <h3>Your Generated Message</h3>
                </div>
                
                <div class="message-content" id="message-content">
                    <div class="message-loading" id="message-loading">
                        <div class="spinner"></div>
                        <div class="loading-message">
                            <p>Creating your heartfelt message...</p>
                        </div>
                    </div>
                    
                    <div class="message-text" id="message-text" style="display: none;">
                        <!-- Will be populated with the generated message -->
                    </div>
                    
                    <div class="message-error" id="message-error" style="display: none;">
                        <div class="error-message">
                            <i class="fas fa-exclamation-circle"></i>
                            <p id="error-message">There was an error generating your message. Please try again.</p>
                        </div>
                        <button id="retry-generation" class="secondary-button">
                            <i class="fas fa-redo"></i> Try Again
                        </button>
                    </div>
                </div>
                
                <div class="message-actions">
                    <button id="copy-message" class="action-button">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                    <button id="regenerate-message" class="action-button">
                        <i class="fas fa-redo"></i> Regenerate
                    </button>
                    <button id="edit-message" class="action-button">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button id="save-message" class="action-button action-button--primary">
                        <i class="fas fa-save"></i> Save
                    </button>
                </div>
            </div>
            
            <!-- Message Variations -->
            <div class="variations-section">
                <h3>Try Message Variations</h3>
                <div id="message-variations" class="message-variations">
                    <!-- Variation buttons will be dynamically added -->
                </div>
            </div>
            
            <!-- Message Insights -->
            <div class="insights-card" id="insights-card" style="display: none;">
                <div class="insights-header">
                    <h3>Emotional Insights</h3>
                </div>
                <div class="insights-content" id="insights-content">
                    <!-- Will be populated with insights -->
                </div>
            </div>
            
            <!-- Message Edit Modal -->
            <div id="edit-message-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Edit Your Message</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="message-edit-textarea">Make your changes:</label>
                            <textarea id="message-edit-textarea" rows="10"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="edit-cancel" class="secondary-button">Cancel</button>
                        <button id="edit-save" class="primary-button">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Set up action buttons
    const copyBtn = document.getElementById('copy-message');
    const regenerateBtn = document.getElementById('regenerate-message');
    const editBtn = document.getElementById('edit-message');
    const saveBtn = document.getElementById('save-message');
    const retryBtn = document.getElementById('retry-generation');
    
    // Copy button
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            if (!messageData.result || !messageData.result.message) {
                showAlert('No message to copy', 'warning');
                return;
            }
            
            // Copy to clipboard
            const textArea = document.createElement('textarea');
            textArea.value = messageData.result.message;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            showAlert('Message copied to clipboard', 'success');
            
            // Track copy in analytics
            if (firebase.analytics) {
                firebase.analytics().logEvent('message_copied', {
                    timestamp: new Date().toISOString()
                });
            }
        });
    }
    
    // Regenerate button
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', function() {
            if (confirm('Generate a new message? This will replace your current message.')) {
                generateMessage();
            }
        });
    }
    
    // Edit button - Modal functionality
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            if (!messageData.result || !messageData.result.message) {
                showAlert('No message to edit', 'warning');
                return;
            }
            
            const modal = document.getElementById('edit-message-modal');
            const textarea = document.getElementById('message-edit-textarea');
            
            // Set up the textarea with the current message
            if (textarea) {
                textarea.value = messageData.result.message;
            }
            
            // Show the modal
            if (modal) {
                modal.style.display = 'block';
                // Add show class for animation
                setTimeout(() => modal.classList.add('show'), 10);
                
                // Focus the textarea after a short delay to allow modal animation
                setTimeout(() => {
                    if (textarea) textarea.focus();
                }, 300);
            }
        });
    }
    
    // Modal close button
    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });
    
    // Cancel button in edit modal
    const editCancelBtn = document.getElementById('edit-cancel');
    if (editCancelBtn) {
        editCancelBtn.addEventListener('click', function() {
            const modal = document.getElementById('edit-message-modal');
            if (modal) {
                closeModal(modal);
            }
        });
    }
    
    // Save changes button in edit modal
    const editSaveBtn = document.getElementById('edit-save');
    if (editSaveBtn) {
        editSaveBtn.addEventListener('click', saveEditedMessage);
    }
    
    // Add keyboard accessibility to the textarea
    const textarea = document.getElementById('message-edit-textarea');
    if (textarea) {
        textarea.addEventListener('keydown', function(e) {
            // Save on Ctrl+Enter or Cmd+Enter
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                saveEditedMessage();
            }
            // Close on Escape
            else if (e.key === 'Escape') {
                e.preventDefault();
                const modal = document.getElementById('edit-message-modal');
                if (modal) {
                    closeModal(modal);
                }
            }
        });
    }
    
    // Save button - Save to history
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            if (!messageData.result || !messageData.result.message) {
                showAlert('No message to save', 'warning');
                return;
            }
            
            saveMessageToHistory();
            showAlert('Message saved to your history', 'success');
        });
    }
    
    // Retry button
    if (retryBtn) {
        retryBtn.addEventListener('click', function() {
            generateMessage();
        });
    }
    
    // Initialize message variation buttons
    initializeVariationButtons();
    
    // Check if we already have a generated message
    if (messageData.result && messageData.result.message) {
        showGeneratedMessage(messageData.result.message, messageData.result.insights || []);
    } else {
        // Generate a new message
        generateMessage();
    }
}

/**
 * Generate message using Cloud Function API
 * @param {Object} options - Optional parameters for generation
 * @param {string} options.variationType - Type of variation (more_formal, more_casual, more_emotional, more_direct)
 * @param {boolean} options.showLoading - Whether to show loading indicators
 * @returns {Promise<Object>} - The generated message result
 */
async function generateMessage(options = {}) {
    const { 
        variationType = null, 
        showLoading = true 
    } = options;
    
    // Show loading state if requested
    if (showLoading) {
        const messageLoading = document.getElementById('message-loading');
        const messageText = document.getElementById('message-text');
        const messageError = document.getElementById('message-error');
        const insightsCard = document.getElementById('insights-card');
        
        if (messageLoading) messageLoading.style.display = 'flex';
        if (messageText) messageText.style.display = 'none';
        if (messageError) messageError.style.display = 'none';
        if (insightsCard) insightsCard.style.display = 'none';
        
        // Update loading message if variation
        const loadingMessage = document.querySelector('.loading-message p');
        if (loadingMessage) {
            if (variationType) {
                loadingMessage.textContent = 'Creating message variation...';
            } else {
                loadingMessage.textContent = 'Creating your heartfelt message...';
            }
        }
    }
    
    try {
        // Ensure we have the required data
        if (!messageData.recipient || !messageData.recipient.name) {
            throw new Error('Missing recipient information');
        }
        
        if (!messageData.intent || !messageData.intent.type) {
            throw new Error('Missing intent information');
        }
        
        if (!messageData.tone || !messageData.tone.type) {
            throw new Error('Missing tone information');
        }
        
        // Prepare data for API
        const apiData = {
            recipient: {
                name: messageData.recipient.name,
                relationship: messageData.recipient.relationship,
                otherRelationship: messageData.recipient.otherRelationship || ''
            },
            intent: {
                type: messageData.intent.type,
                title: messageData.intent.title,
                customText: messageData.intent.customText || ''
            },
            tone: {
                type: messageData.tone.type,
                name: messageData.tone.name,
                customText: messageData.tone.customText || ''
            },
            userId: currentUser.uid
        };
        
        // Add variation info if specified
        if (variationType) {
            apiData.variation = variationType;
            
            // If we already have a message, send it as context for the variation
            if (messageData.result && messageData.result.message) {
                apiData.currentMessage = messageData.result.message;
            }
        }
        
        // Track the start of message generation in analytics
        if (firebase.analytics) {
            firebase.analytics().logEvent('message_generation_started', {
                intent_type: messageData.intent.type,
                tone_type: messageData.tone.type,
                is_variation: !!variationType,
                variation_type: variationType || 'none',
                timestamp: new Date().toISOString()
            });
        }
        
        // Call the API with authentication
        const result = await callGenerateMessageAPI(apiData);
        
        // Validate the response
        if (!result || !result.message) {
            throw new Error('Invalid response from API');
        }
        
        // Store the results
        messageData.result = {
            message: result.message,
            insights: result.insights || [],
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('messageData', JSON.stringify(messageData));
        localStorage.setItem('resultData', JSON.stringify(messageData.result));
        
        // Display the message
        showGeneratedMessage(result.message, result.insights);
        
        // Update preview
        updatePreview();
        
        // Track successful generation in analytics
        if (firebase.analytics) {
            firebase.analytics().logEvent('message_generation_success', {
                intent_type: messageData.intent.type,
                tone_type: messageData.tone.type,
                is_variation: !!variationType,
                variation_type: variationType || 'none',
                has_insights: (result.insights && result.insights.length > 0),
                timestamp: new Date().toISOString()
            });
        }
        
        return result;
    } catch (error) {
        console.error('Failed to generate message:', error);
        
        // Show error state in UI
        const messageLoading = document.getElementById('message-loading');
        const messageError = document.getElementById('message-error');
        
        if (messageLoading) messageLoading.style.display = 'none';
        if (messageError) {
            messageError.style.display = 'block';
            
            // Customize error message based on error type
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
                    errorMessage.textContent = 'Network error. Please check your connection and try again.';
                } else if (error.message.includes('auth') || error.message.includes('401') || error.message.includes('403')) {
                    errorMessage.textContent = 'Authentication error. Please refresh and try again.';
                } else if (error.message.includes('Missing')) {
                    errorMessage.textContent = error.message + '. Please go back and complete all steps.';
                } else {
                    errorMessage.textContent = 'Sorry, we couldn\'t generate your message. Please try again.';
                }
            }
            
            // Show retry button
            const retryButton = document.getElementById('retry-generation');
            if (retryButton) {
                retryButton.style.display = 'block';
                retryButton.onclick = function() {
                    generateMessage(options);
                };
            }
        }
        
        // Track error in analytics
        if (firebase.analytics) {
            firebase.analytics().logEvent('message_generation_error', {
                error_message: error.message,
                is_variation: !!variationType,
                variation_type: variationType || 'none',
                timestamp: new Date().toISOString()
            });
        }
        
        // Propagate error for handling by caller
        throw error;
    }
}

/**
 * Display a generated message and insights
 */
function showGeneratedMessage(message, insights) {
    const messageLoading = document.getElementById('message-loading');
    const messageText = document.getElementById('message-text');
    const messageError = document.getElementById('message-error');
    const insightsCard = document.getElementById('insights-card');
    const insightsContent = document.getElementById('insights-content');
    
    // Hide loading, show message
    if (messageLoading) messageLoading.style.display = 'none';
    if (messageText) {
        messageText.textContent = message;
        messageText.style.display = 'block';
    }
    if (messageError) messageError.style.display = 'none';
    
    // Show insights if available
    if (insights && insights.length > 0 && insightsCard && insightsContent) {
        insightsCard.style.display = 'block';
        
        // Clear previous insights
        insightsContent.innerHTML = '';
        
        // Add each insight
        insights.forEach(insight => {
            const insightItem = document.createElement('div');
            insightItem.className = 'insight-item';
            insightItem.textContent = insight;
            insightsContent.appendChild(insightItem);
        });
    }
}

/**
 * Save message to user's history in Firestore
 */
function saveMessageToHistory() {
    if (!currentUser || !messageData.result || !messageData.result.message) {
        return;
    }
    
    // Create a document to save
    const messageDoc = {
        recipient: {
            id: messageData.recipient.id,
            name: messageData.recipient.name,
            relationship: messageData.recipient.relationship,
            otherRelationship: messageData.recipient.otherRelationship || ''
        },
        intent: {
            type: messageData.intent.type,
            title: messageData.intent.title,
            customText: messageData.intent.customText || ''
        },
        tone: {
            type: messageData.tone.type,
            name: messageData.tone.name,
            customText: messageData.tone.customText || ''
        },
        message: messageData.result.message,
        insights: messageData.result.insights || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Save to Firestore
    firebase.firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('messages')
        .add(messageDoc)
        .then(() => {
            console.log('Message saved to history');
        })
        .catch(error => {
            console.error('Error saving message:', error);
            showAlert('Failed to save message to history.', 'error');
        });
}

/**
 * Update step progress in sidebar
 */
function updateStepProgress() {
    // Update sidebar steps
    elements.sidebar.steps.forEach(step => {
        const stepId = step.getAttribute('data-step');
        
        // Remove all classes
        step.classList.remove('active', 'completed');
        
        // Add classes based on status
        if (stepId === currentStep) {
            step.classList.add('active');
        } else if (STEPS[stepId] && STEPS[currentStep]) {
            // Get the indices of the steps
            const stepKeys = Object.keys(STEPS);
            const currentIndex = stepKeys.indexOf(currentStep);
            const stepIndex = stepKeys.indexOf(stepId);
            
            // If this step is before the current step, mark as completed
            if (stepIndex < currentIndex) {
                step.classList.add('completed');
            }
        }
    });
}

/**
 * Save step data to messageData
 */
function saveStepData(stepId) {
    switch (stepId) {
        case 'recipient':
            // Already saved on selection
            break;
            
        case 'intent':
            // Will implement with logic from message-intent-new.js
            // For now, save placeholder data
            if (!messageData.intent) {
                messageData.intent = { type: 'appreciation' };
                localStorage.setItem('intentData', JSON.stringify(messageData.intent));
            }
            break;
            
        case 'tone':
            // Will implement with logic from message-tone-new.js
            // For now, save placeholder data
            if (!messageData.tone) {
                messageData.tone = { type: 'sincere' };
                localStorage.setItem('toneData', JSON.stringify(messageData.tone));
            }
            break;
            
        case 'result':
            // Save result data if it exists
            if (messageData.result) {
                localStorage.setItem('resultData', JSON.stringify(messageData.result));
            }
            break;
    }
}

/**
 * Save all data to localStorage
 */
function saveAllData() {
    if (messageData.recipient) {
        localStorage.setItem('recipientData', JSON.stringify(messageData.recipient));
    }
    
    if (messageData.intent) {
        localStorage.setItem('intentData', JSON.stringify(messageData.intent));
    }
    
    if (messageData.tone) {
        localStorage.setItem('toneData', JSON.stringify(messageData.tone));
    }
    
    if (messageData.result) {
        localStorage.setItem('resultData', JSON.stringify(messageData.result));
    }
    
    // Save current step
    localStorage.setItem('currentStep', currentStep);
}

/**
 * Load existing data from localStorage
 */
function loadExistingData() {
    try {
        console.log('Loading existing data from localStorage...');
        
        // Load recipient data - try both storage keys for compatibility
        const recipientDataString = localStorage.getItem('recipientData');
        const selectedRecipientString = localStorage.getItem('selectedRecipient');
        
        if (recipientDataString) {
            messageData.recipient = JSON.parse(recipientDataString);
            console.log('Loaded recipient data:', messageData.recipient);
        } else if (selectedRecipientString) {
            // Handle legacy format
            const selectedRecipient = JSON.parse(selectedRecipientString);
            messageData.recipient = {
                id: selectedRecipient.id,
                name: selectedRecipient.name,
                relationship: selectedRecipient.relationship || 'friend',
                otherRelationship: selectedRecipient.otherRelationship || ''
            };
            console.log('Loaded recipient data from legacy format:', messageData.recipient);
        }
        
        // Load intent data - try both storage keys for compatibility
        const intentDataString = localStorage.getItem('intentData');
        const selectedIntentString = localStorage.getItem('selectedIntent');
        
        if (intentDataString) {
            const intentData = JSON.parse(intentDataString);
            
            // First try to use the full intent object if it exists
            if (selectedIntentString) {
                const selectedIntent = JSON.parse(selectedIntentString);
                messageData.intent = {
                    type: intentData.type,
                    title: selectedIntent.title || intentData.type,
                    description: selectedIntent.description || '',
                    category: selectedIntent.category || 'personal',
                    icon: selectedIntent.icon || 'fa-heart',
                    customText: intentData.customText || ''
                };
            } else {
                // Fallback to simple intent data
                messageData.intent = {
                    type: intentData.type,
                    title: intentData.type.charAt(0).toUpperCase() + intentData.type.slice(1).replace('_', ' '),
                    description: '',
                    category: 'personal',
                    customText: intentData.customText || ''
                };
            }
            console.log('Loaded intent data:', messageData.intent);
        }
        
        // Load tone data - try both storage keys for compatibility
        const toneDataString = localStorage.getItem('toneData');
        const selectedToneString = localStorage.getItem('selectedTone');
        
        if (toneDataString) {
            const toneData = JSON.parse(toneDataString);
            
            messageData.tone = {
                type: toneData.type,
                name: toneData.type.charAt(0).toUpperCase() + toneData.type.slice(1),
                description: '',
                customText: toneData.customText || ''
            };
            console.log('Loaded tone data:', messageData.tone);
        } else if (selectedToneString) {
            // Handle legacy format
            const selectedTone = JSON.parse(selectedToneString);
            messageData.tone = {
                type: selectedTone.type || selectedTone.name.toLowerCase(),
                name: selectedTone.name,
                description: selectedTone.description || '',
                customText: selectedTone.customText || ''
            };
            console.log('Loaded tone data from legacy format:', messageData.tone);
        }
        
        // Load result data if it exists
        const resultDataString = localStorage.getItem('resultData');
        if (resultDataString) {
            messageData.result = JSON.parse(resultDataString);
            console.log('Loaded result data:', messageData.result);
        }
        
        // Determine current step based on available data
        determineCurrentStep();
        
        // Update preview panel with loaded data
        updatePreview();
        
        return true;
    } catch (error) {
        console.error('Error loading existing data:', error);
        showAlert('There was an error loading your previous data. Starting fresh.', 'error');
        return false;
    }
}

/**
 * Determine the appropriate step based on loaded data
 */
function determineCurrentStep() {
    const savedStep = localStorage.getItem('currentStep');
    
    // If we have a saved step and all required data for that step is available, use it
    if (savedStep && STEPS[savedStep]) {
        if (validatePreviousSteps(savedStep)) {
            currentStep = savedStep;
            console.log('Resuming at saved step:', currentStep);
            return;
        }
    }
    
    // Otherwise determine step based on available data
    if (messageData.result && messageData.result.message) {
        currentStep = 'result';
    } else if (messageData.tone) {
        currentStep = 'result';  // Go to result to generate message
    } else if (messageData.intent) {
        currentStep = 'tone';
    } else if (messageData.recipient) {
        currentStep = 'intent';
    } else {
        currentStep = 'recipient';
    }
    
    console.log('Determined current step based on data:', currentStep);
}

/**
 * Validate that all previous steps have data before showing a step
 */
function validatePreviousSteps(stepId) {
    const stepKeys = Object.keys(STEPS);
    const stepIndex = stepKeys.indexOf(stepId);
    
    // Check all previous steps
    for (let i = 0; i < stepIndex; i++) {
        const prevStepId = stepKeys[i];
        if (!messageData[prevStepId]) {
            return false;
        }
    }
    
    return true;
}

/**
 * Reset all data and start over
 */
function resetAll() {
    // Clear messageData
    messageData = {
        recipient: null,
        intent: null,
        tone: null,
        result: null
    };
    
    // Clear localStorage (except for user auth data)
    localStorage.removeItem('recipientData');
    localStorage.removeItem('intentData');
    localStorage.removeItem('toneData');
    localStorage.removeItem('resultData');
    localStorage.removeItem('currentStep');
    
    // Reset UI
    currentStep = 'recipient';
    updateSidebar();
    updatePreview();
    
    // Reset buttons
    if (elements.buttons.recipientNext) {
        elements.buttons.recipientNext.classList.add('disabled');
    }
}

/**
 * Track step completion in analytics
 */
function trackStepCompletion(step) {
    // Track with Firebase Analytics if available
    if (firebase.analytics) {
        firebase.analytics().logEvent('unified_step_complete', {
            step: step,
            timestamp: new Date().toISOString()
        });
    }
}

/**
 * Show loading overlay with optional context message
 * @param {string} message - Optional context message to display
 */
function showLoading(message = 'Loading...') {
    const overlay = elements.loading.overlay;
    const context = elements.loading.context;
    
    if (overlay && context) {
        context.textContent = message;
        overlay.classList.add('show');
        document.body.classList.add('loading');
    }
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    const overlay = elements.loading.overlay;
    
    if (overlay) {
        overlay.classList.remove('show');
        document.body.classList.remove('loading');
    }
}

/**
 * Show alert message
 * @param {string} message - Alert message to display
 * @param {string} type - Alert type (success, error, warning, info)
 * @param {number} duration - Duration to show alert in ms
 */
function showAlert(message, type = 'info', duration = 5000) {
    const alertContainer = elements.alerts.container;
    if (!alertContainer) return;
    
    // Create alert element
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type}`;
    
    // Get icon based on type
    let icon = 'info-circle';
    switch (type) {
        case 'success': icon = 'check-circle'; break;
        case 'error': icon = 'exclamation-circle'; break;
        case 'warning': icon = 'exclamation-triangle'; break;
    }
    
    // Add content
    alertElement.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span class="alert-message">${message}</span>
        <button class="alert-close" aria-label="Close">&times;</button>
    `;
    
    // Add to DOM
    alertContainer.appendChild(alertElement);
    
    // Add animation class after a small delay
    setTimeout(() => {
        alertElement.classList.add('show');
    }, 10);
    
    // Add close button handler
    const closeButton = alertElement.querySelector('.alert-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            removeAlert(alertElement);
        });
    }
    
    // Auto-remove after duration
    if (duration > 0) {
        setTimeout(() => {
            removeAlert(alertElement);
        }, duration);
    }
}

/**
 * Remove alert element with animation
 * @param {HTMLElement} alertElement - Alert element to remove
 */
function removeAlert(alertElement) {
    if (!alertElement) return;
    
    alertElement.classList.remove('show');
    alertElement.classList.add('hiding');
    
    setTimeout(() => {
        if (alertElement.parentNode) {
            alertElement.parentNode.removeChild(alertElement);
        }
    }, 300);
}

/**
 * Enhanced error handler with consistent reporting and retry options
 * @param {Error} error - The error object
 * @param {string} context - The context in which the error occurred
 * @param {Function} retryFn - Optional function to retry the operation
 */
function handleError(error, context, retryFn = null) {
    console.error(`Error in ${context}:`, error);
    
    // Categorize the error
    let errorType = 'generic';
    let message = 'Something went wrong. Please try again.';
    
    // Network errors
    if (error.message.includes('NetworkError') || 
        error.message.includes('Failed to fetch') ||
        error.message.includes('Network request failed')) {
        errorType = 'network';
        message = 'Network connection issue. Please check your internet connection and try again.';
    } 
    // Authentication errors
    else if (error.message.includes('401') || 
             error.message.includes('403') || 
             error.message.includes('auth') || 
             error.message.includes('Authentication')) {
        errorType = 'auth';
        message = 'Authentication error. Please refresh the page and sign in again.';
    }
    // API errors
    else if (error.message.includes('API error') || 
             error.message.includes('500') || 
             error.message.includes('502') ||
             error.message.includes('504')) {
        errorType = 'api';
        message = 'Our service is experiencing issues. Please try again in a few moments.';
    }
    // Validation errors
    else if (error.message.includes('validation') || 
             error.message.includes('invalid')) {
        errorType = 'validation';
        message = error.message;
    }
    
    // Show error with retry option if provided
    showAlert(message, 'error', retryFn ? 'retry' : 'close', retryFn);
    
    // Track error in analytics
    if (firebase.analytics) {
        firebase.analytics().logEvent('error_occurred', {
            error_type: errorType,
            error_message: error.message,
            error_context: context,
            has_retry: !!retryFn,
            timestamp: new Date().toISOString()
        });
    }
    
    return { errorType, message };
}

// Step validation functions
function validateRecipientStep() {
    if (!messageData.recipient) {
        showAlert('Please select a recipient.', 'error');
        return false;
    }
    
    return true;
}

function validateIntentStep() {
    console.log('Validating intent step, current data:', messageData.intent);
    
    // Always return true for now to allow navigation
    return true;
}

function validateToneStep() {
    if (!messageData.tone) {
        showAlert('Please select a tone.', 'error');
        return false;
    }
    
    return true;
}

/**
 * Get Firebase ID Token for authenticated API calls
 * @param {boolean} forceRefresh - Whether to force refresh the token
 * @returns {Promise<string>} The ID token
 */
async function getIdToken(forceRefresh = true) {
    try {
        if (!firebase.auth().currentUser) {
            throw new Error('No authenticated user found');
        }
        // Force token refresh to ensure it's not expired
        return await firebase.auth().currentUser.getIdToken(forceRefresh);
    } catch (error) {
        console.error('Error getting ID token:', error);
        showAlert('Authentication error. Please refresh and try again.', 'error');
        throw error;
    }
}

/**
 * Call the message generation API with authentication
 * @param {Object} data - The data to send to the API
 * @param {number} retryCount - Number of retry attempts (internal use)
 * @returns {Promise<Object>} - The API response
 */
async function callGenerateMessageAPI(data, retryCount = 0) {
    const MAX_RETRIES = 2;
    const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
    
    try {
        // Check if we have a cached response for exactly the same request
        const cacheKey = `msgCache_${JSON.stringify(data)}`;
        const cachedResponse = localStorage.getItem(cacheKey);
        
        if (cachedResponse) {
            const parsed = JSON.parse(cachedResponse);
            const cacheTime = new Date(parsed.timestamp);
            const now = new Date();
            
            // If cache is still valid (within CACHE_DURATION), return it
            if (now - cacheTime < CACHE_DURATION) {
                console.log('Using cached message response');
                return parsed.data;
            } else {
                // Cache expired, remove it
                localStorage.removeItem(cacheKey);
            }
        }
        
        // Get authentication token (force refresh on retry)
        const idToken = await getIdToken(retryCount > 0);
        
        // Log the API call attempt
        console.log(`Calling message generation API (attempt ${retryCount + 1})...`);
        
        // Decide which API endpoint to use based on configuration
        // Default to V1, with option to use V2 if needed
        const useV2API = false; // Toggle this based on A/B testing or configuration
        const apiEndpoint = useV2API 
            ? 'https://us-central1-heartglowai.cloudfunctions.net/generateMessageV2'
            : 'https://us-central1-heartglowai.cloudfunctions.net/generateMessage';
            
        // Call the API with proper authentication
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify(data)
        });
        
        // Check for HTTP errors
        if (!response.ok) {
            const errorText = await response.text();
            const errorStatus = response.status;
            
            // Handle specific status codes
            if (errorStatus === 401 || errorStatus === 403) {
                // Auth error - if we haven't retried too many times, try again with a fresh token
                if (retryCount < MAX_RETRIES) {
                    console.log('Authentication error, retrying with fresh token...');
                    return callGenerateMessageAPI(data, retryCount + 1);
                }
                throw new Error(`Authentication error (${errorStatus}): ${errorText}`);
            } else if (errorStatus === 429) {
                // Rate limiting
                throw new Error('Too many requests. Please wait a moment and try again.');
            } else if (errorStatus >= 500) {
                // Server error - retry if we haven't retried too many times
                if (retryCount < MAX_RETRIES) {
                    // Exponential backoff for retries
                    const backoffTime = Math.pow(2, retryCount) * 1000;
                    console.log(`Server error, retrying in ${backoffTime}ms...`);
                    
                    return new Promise(resolve => {
                        setTimeout(() => {
                            resolve(callGenerateMessageAPI(data, retryCount + 1));
                        }, backoffTime);
                    });
                }
                throw new Error(`Server error (${errorStatus}): ${errorText}`);
            }
            
            throw new Error(`API error (${errorStatus}): ${errorText}`);
        }
        
        // Parse the response
        const result = await response.json();
        
        // Validate result format
        if (!result || !result.message) {
            throw new Error('Invalid response format from API');
        }
        
        // Cache the successful response
        try {
            localStorage.setItem(cacheKey, JSON.stringify({
                timestamp: new Date().toISOString(),
                data: result
            }));
        } catch (cacheError) {
            // If caching fails (e.g., localStorage is full), just log and continue
            console.warn('Failed to cache API response:', cacheError);
        }
        
        // Return the parsed response
        return result;
    } catch (error) {
        console.error('Message generation API call failed:', error);
        
        // Check for network errors and retry if appropriate
        if ((error.message.includes('Failed to fetch') || 
             error.message.includes('NetworkError') || 
             error.message.includes('network error')) && 
            retryCount < MAX_RETRIES) {
            
            // Exponential backoff for retries
            const backoffTime = Math.pow(2, retryCount) * 1000;
            console.log(`Network error, retrying in ${backoffTime}ms...`);
            
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(callGenerateMessageAPI(data, retryCount + 1));
                }, backoffTime);
            });
        }
        
        // Provide user-friendly error message based on error type
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            showAlert('Network error. Please check your connection and try again.', 'error');
        } else if (error.message.includes('401') || error.message.includes('403')) {
            showAlert('Authentication error. Please refresh and try again.', 'error');
        } else if (error.message.includes('429')) {
            showAlert('Too many requests. Please wait a moment and try again.', 'error');
        } else if (error.message.includes('500')) {
            showAlert('Server error. Our team has been notified. Please try again later.', 'error');
        } else {
            showAlert('Failed to generate message. Please try again.', 'error');
        }
        
        // For analytics - track the error
        if (firebase.analytics) {
            firebase.analytics().logEvent('message_generation_error', {
                error_type: error.message.includes('401') || error.message.includes('403') ? 'auth_error' :
                           error.message.includes('Failed to fetch') ? 'network_error' :
                           error.message.includes('429') ? 'rate_limit' :
                           error.message.includes('500') ? 'server_error' : 'other_error',
                error_message: error.message.substring(0, 100), // Truncate for analytics
                retry_count: retryCount,
                timestamp: new Date().toISOString()
            });
        }
        
        throw error;
    }
}

/**
 * Capitalize the first letter of a string
 */
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Format relationship text for display
 * @param {Object} recipient - The recipient object
 * @returns {string} - Formatted relationship text
 */
function formatRelationship(recipient) {
    if (!recipient || !recipient.relationship) {
        return '';
    }
    
    // If it's a custom "other" relationship type
    if (recipient.relationship === 'other' && recipient.otherRelationship) {
        return recipient.otherRelationship;
    }
    
    // Otherwise capitalize the standard relationship type
    return capitalizeFirstLetter(recipient.relationship);
}

// Add a global authentication check flag to prevent multiple concurrent checks
let authCheckInProgress = false;
let authCheckTimeoutId = null;

/**
 * Refresh connections list from Firestore
 * @param {boolean} forceReload - Whether to bypass cache and force reload
 * @returns {Promise} Promise that resolves when connections are loaded
 */
function refreshConnectionsList(forceReload = false) {
    // If auth check is already in progress, return a resolved promise
    if (authCheckInProgress) {
        console.log('Auth check already in progress, skipping duplicate call');
        return Promise.resolve([]);
    }
    
    // Check if user is authenticated
    if (!currentUser || !currentUser.uid) {
        console.log('Waiting for authentication before loading connections...');
        
        // Set flag to prevent multiple auth checks
        authCheckInProgress = true;
        
        // Show a temporary loading message in the connections list
        const connectionsList = elements.recipientStep.connectionsList;
        if (connectionsList) {
            connectionsList.innerHTML = '<div class="loading-state"><div class="loading-spinner-small"></div><p>Waiting for authentication...</p></div>';
        }
        
        // Return a promise that resolves when authentication is complete
        return new Promise((resolve) => {
            const authCheck = setInterval(() => {
                if (currentUser && currentUser.uid) {
                    clearInterval(authCheck);
                    clearTimeout(authCheckTimeoutId);
                    authCheckInProgress = false;
                    console.log('Authentication complete, loading connections...');
                    
                    // Once authenticated, load connections and pass through the result
                    loadUserConnections(forceReload)
                        .then(connections => resolve(connections))
                        .catch(error => {
                            console.error('Failed to load connections after authentication:', error);
                            // Return empty array rather than rejecting to prevent uncaught errors
                            resolve([]);
                        });
                }
            }, 500);
            
            // Timeout after 10 seconds
            authCheckTimeoutId = setTimeout(() => {
                clearInterval(authCheck);
                authCheckInProgress = false;
                console.warn('Authentication timeout when waiting for connections');
                
                // Display authentication timeout in the UI
                if (connectionsList) {
                    connectionsList.innerHTML = '<div class="error-state"><p>Authentication timed out. Please refresh the page.</p></div>';
                }
                
                // Add a 'try again' button for better UX
                if (connectionsList) {
                    const tryAgainBtn = document.createElement('button');
                    tryAgainBtn.className = 'primary-button';
                    tryAgainBtn.innerHTML = 'Try Again';
                    tryAgainBtn.style.marginTop = '15px';
                    tryAgainBtn.addEventListener('click', () => {
                        console.log('Retrying connection loading...');
                        refreshConnectionsList(true);
                    });
                    
                    const errorDiv = connectionsList.querySelector('.error-state');
                    if (errorDiv) {
                        errorDiv.appendChild(tryAgainBtn);
                    }
                }
                
                // Resolve with empty array instead of rejecting
                resolve([]);
            }, 10000);
        });
    }
    
    // User is already authenticated, load connections
    try {
        return loadUserConnections(forceReload)
            .finally(() => {
                // Ensure the flag is reset even if there's an error
                authCheckInProgress = false;
            });
    } catch (error) {
        console.error('Error in refreshConnectionsList:', error);
        authCheckInProgress = false;
        // Return a resolved promise with empty array instead of propagating the error
        return Promise.resolve([]);
    }
}

/**
 * Load user connections from Firebase
 */
function loadUserConnections(forceReload = false) {
    if (!currentUser || !currentUser.uid) {
        console.error('Cannot load connections: No user is logged in');
        showAlert('Authentication issue detected. Please refresh the page.', 'error');
        return Promise.reject(new Error('No authenticated user'));
    }
    
    showLoading('Loading your connections...');
    console.log('Loading connections for user:', currentUser.uid);
    
    return firebase.firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('connections')
        .get()
        .then(snapshot => {
            hideLoading();
            console.log('Connections loaded successfully');
            
            // Process connections
            const connections = [];
            snapshot.forEach(doc => {
                const connection = {
                    id: doc.id,
                    ...doc.data()
                };
                connections.push(connection);
            });
            
            // Display connections in the UI
            displayConnections(connections);
            return connections;
        })
        .catch(error => {
            hideLoading();
            console.error('Error loading connections:', error);
            showAlert('Failed to load your connections. Please try refreshing the page.', 'error');
            return [];
        });
}

/**
 * Display connections in the UI
 * @param {Array} connections - Array of connection objects
 */
function displayConnections(connections) {
    console.log('displayConnections called with:', connections);
    
    const connectionsList = elements.recipientStep.connectionsList;
    console.log('Connection list element:', connectionsList);
    console.log('Element exists:', !!connectionsList);
    
    if (!connectionsList) {
        console.error('Cannot display connections: Connection list element not found');
        // Try to locate connections-list element by ID
        const altConnectionsList = document.getElementById('connections-list');
        console.log('Alternative connections-list by ID:', altConnectionsList);
        
        // If we found it by ID, use that instead
        if (altConnectionsList) {
            elements.recipientStep.connectionsList = altConnectionsList;
            console.log('Updated connection list reference');
            // Continue with this element
            displayConnectionsImpl(connections, altConnectionsList);
            return;
        }
        return;
    }
    
    // Call the implementation function
    displayConnectionsImpl(connections, connectionsList);
}

/**
 * Implementation of displaying connections
 * @param {Array} connections - Array of connection objects 
 * @param {Element} connectionsList - DOM element to display connections in
 */
function displayConnectionsImpl(connections, connectionsList) {
    // Clear existing connections
    connectionsList.innerHTML = '';
    console.log('Cleared existing connections');
    
    // Handle empty state
    if (!connections || connections.length === 0) {
        console.log('No connections found, showing empty state');
        connectionsList.innerHTML = '<div class="empty-state"><p>You don\'t have any connections yet. Create one to get started!</p></div>';
        return;
    }
    
    console.log(`Displaying ${connections.length} connections`);
    
    // Sort connections by name
    connections.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    
    // Add each connection as a card with staggered animation
    connections.forEach((connection, index) => {
        console.log(`Creating card for connection ${index}:`, connection.name);
        setTimeout(() => {
            addConnectionCard(connection);
        }, index * 50); // Stagger animation by 50ms per card
    });
    
    // Check if we have a selected connection
    if (messageData.recipient && messageData.recipient.id) {
        console.log('We have a selected recipient:', messageData.recipient);
        setTimeout(() => {
            const selectedCard = connectionsList.querySelector(`.connection-card[data-id="${messageData.recipient.id}"]`);
            console.log('Selected card element:', selectedCard);
            if (selectedCard) {
                selectedCard.classList.add('selected');
                elements.buttons.recipientNext.classList.remove('disabled');
            } else {
                console.warn('Selected card not found in DOM');
            }
        }, connections.length * 50 + 100); // After all cards are added
    }
}

/**
 * Open the connection modal to edit an existing connection
 * @param {Object} connection - The connection to edit
 */
function editConnection(connection) {
    if (!connection) return;
    
    // Set modal title
    elements.modals.connectionTitle.textContent = 'Edit Connection';
    
    // Set form values
    elements.modals.connectionName.value = connection.name || '';
    elements.modals.connectionRelationship.value = connection.relationship || '';
    
    // Handle other relationship
    if (connection.relationship === 'other') {
        elements.modals.otherRelationshipGroup.style.display = 'block';
        elements.modals.otherRelationship.value = connection.otherRelationship || '';
    } else {
        elements.modals.otherRelationshipGroup.style.display = 'none';
        elements.modals.otherRelationship.value = '';
    }
    
    // Store the connection ID for update
    elements.modals.connectionForm.setAttribute('data-connection-id', connection.id);
    
    // Open the modal
    openModal(elements.modals.connectionModal);
}

/**
 * Open a modal dialog
 * @param {HTMLElement} modal - Modal element to open
 */
function openModal(modal) {
    if (!modal) return;
    
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Focus the first input
    const firstInput = modal.querySelector('input, select, textarea');
    if (firstInput) {
        setTimeout(() => {
            firstInput.focus();
        }, 200);
    }
}

/**
 * Close a modal dialog
 * @param {HTMLElement} modal - Modal element to close
 */
function closeModal(modal) {
    if (!modal) return;
    
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

/**
 * Open the connection modal for a new connection
 */
function openConnectionModal() {
    // Set modal title
    elements.modals.connectionTitle.textContent = 'New Connection';
    
    // Reset form
    elements.modals.connectionForm.reset();
    elements.modals.connectionForm.removeAttribute('data-connection-id');
    elements.modals.otherRelationshipGroup.style.display = 'none';
    
    // Open the modal
    openModal(elements.modals.connectionModal);
}

/**
 * Close the connection modal
 */
function closeConnectionModal() {
    closeModal(elements.modals.connectionModal);
}

/**
 * Save connection (create or update)
 */
function saveConnection() {
    if (!currentUser) {
        showAlert('You must be logged in to save connections', 'error');
        return;
    }
    
    // Get form values
    const name = elements.modals.connectionName.value.trim();
    const relationship = elements.modals.connectionRelationship.value;
    let otherRelationship = '';
    
    // Validate
    if (!name) {
        showAlert('Please enter a name', 'error');
        return;
    }
    
    if (!relationship) {
        showAlert('Please select a relationship', 'error');
        return;
    }
    
    // Get other relationship if selected
    if (relationship === 'other') {
        otherRelationship = elements.modals.otherRelationship.value.trim();
        if (!otherRelationship) {
            showAlert('Please specify the relationship', 'error');
            return;
        }
    }
    
    // Prepare connection data
    const connectionData = {
        name,
        relationship,
        otherRelationship,
        updatedAt: new Date().toISOString()
    };
    
    // Check if updating or creating
    const connectionId = elements.modals.connectionForm.getAttribute('data-connection-id');
    
    showLoading('Saving connection...');
    
    // Get a reference to the connections collection
    const connectionsRef = firebase.firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('connections');
    
    let savePromise;
    
    if (connectionId) {
        // Update existing connection
        savePromise = connectionsRef.doc(connectionId).update(connectionData);
    } else {
        // Add created timestamp for new connections
        connectionData.createdAt = new Date().toISOString();
        
        // Create new connection
        savePromise = connectionsRef.add(connectionData);
    }
    
    savePromise.then(() => {
        hideLoading();
        closeConnectionModal();
        
        // Refresh connections list
        loadUserConnections();
        
        showAlert(
            connectionId ? 'Connection updated successfully' : 'Connection created successfully',
            'success'
        );
    }).catch(error => {
        hideLoading();
        console.error('Error saving connection:', error);
        showAlert('Error saving connection: ' + error.message, 'error');
    });
}

/**
 * Generate a variation of the current message
 * @param {string} variationType - The type of variation to generate
 * @returns {Promise<Object>} - The generated message variation
 */
async function generateMessageVariation(variationType) {
    if (!messageData.result || !messageData.result.message) {
        showAlert('You need to generate a message first before creating variations.', 'warning');
        return null;
    }
    
    try {
        // Show loading state for the variation
        showLoading(`Creating ${variationType.replace('_', ' ')} variation...`);
        
        // Generate the variation
        const result = await generateMessage({
            variationType: variationType,
            showLoading: false // We're managing loading state here
        });
        
        hideLoading();
        
        // Show success message
        showAlert(`${capitalizeFirstLetter(variationType.replace('_', ' '))} variation created!`, 'success');
        
        return result;
    } catch (error) {
        console.error('Error generating message variation:', error);
        hideLoading();
        showAlert('Failed to create variation. Please try again.', 'error');
        return null;
    }
}

/**
 * Initialize message variation buttons
 */
function initializeVariationButtons() {
    const variationTypes = [
        { id: 'more_formal', label: 'More Formal', icon: 'fa-user-tie' },
        { id: 'more_casual', label: 'More Casual', icon: 'fa-coffee' },
        { id: 'more_emotional', label: 'More Emotional', icon: 'fa-heart' },
        { id: 'more_direct', label: 'More Direct', icon: 'fa-bullseye' }
    ];
    
    const variationContainer = document.getElementById('message-variations');
    
    if (!variationContainer) return;
    
    // Ensure proper aria attributes for the container
    variationContainer.setAttribute('role', 'group');
    variationContainer.setAttribute('aria-label', 'Message variation options');
    
    // Clear existing buttons
    variationContainer.innerHTML = '';
    
    // Create a button for each variation type
    variationTypes.forEach(variation => {
        const button = document.createElement('button');
        button.className = 'variation-button';
        button.dataset.variation = variation.id;
        button.setAttribute('aria-label', `Generate ${variation.label} variation`);
        button.innerHTML = `<i class="fas ${variation.icon}"></i> ${variation.label}`;
        
        button.addEventListener('click', function() {
            generateMessageVariation(variation.id);
        });
        
        variationContainer.appendChild(button);
    });
}

/**
 * Capitalize the first letter of a string
 * @param {string} string - The string to capitalize
 * @returns {string} - The capitalized string
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Save edited message from the modal
 */
function saveEditedMessage() {
    const textarea = document.getElementById('message-edit-textarea');
    if (!textarea || !textarea.value.trim()) {
        showAlert('Please enter a message', 'warning');
        return;
    }
    
    // Update the message in state
    if (messageData.result) {
        messageData.result.message = textarea.value.trim();
        
        // Add a note that the message was manually edited
        messageData.result.edited = true;
        messageData.result.editTimestamp = new Date().toISOString();
        
        // Update the UI
        const messageText = document.getElementById('message-text');
        if (messageText) {
            messageText.textContent = messageData.result.message;
        }
        
        // Update localStorage
        localStorage.setItem('messageData', JSON.stringify(messageData));
        localStorage.setItem('resultData', JSON.stringify(messageData.result));
        
        // Update preview
        updatePreview();
        
        // Track edit in analytics
        if (firebase.analytics) {
            firebase.analytics().logEvent('message_edited', {
                timestamp: new Date().toISOString()
            });
        }
        
        // Close the modal
        const modal = document.getElementById('edit-message-modal');
        if (modal) {
            closeModal(modal);
        }
        
        showAlert('Message updated successfully', 'success');
    }
}

/**
 * Update UI for selected recipient
 * @param {Object} recipient - Selected recipient data
 */
function updateSelectedRecipient(recipient) {
    if (!recipient) return;
    
    // Find the card for this recipient and select it
    const recipientCard = document.querySelector(`.connection-card[data-id="${recipient.id}"]`);
    if (recipientCard) {
        // Remove selected class from all cards
        document.querySelectorAll('.connection-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selected class to this card
        recipientCard.classList.add('selected');
        
        // Enable next button
        if (elements.buttons.recipientNext) {
            elements.buttons.recipientNext.classList.remove('disabled');
        }
    } else {
        console.warn('Selected recipient card not found in the DOM:', recipient.id);
    }
    
    // Update preview panel
    updatePreview();
}

/**
 * Create a test connection card for debugging rendering issues
 */
function testConnectionCard() {
    console.log('Creating test connection card...');
    
    // Find connections list container
    const container = elements.recipientStep.connectionsList;
    if (!container) {
        console.error('Cannot create test card: Container not found');
        
        // Try to find by alternative methods
        const altContainer = document.querySelector('.connections-list') || 
                            document.getElementById('connections-list');
        
        if (!altContainer) {
            console.error('Cannot create test card: No suitable container found by any method');
            return;
        }
        
        console.log('Found alternative container for test card');
        
        // Update our reference
        elements.recipientStep.connectionsList = altContainer;
        
        // Use this container instead
        return createTestCard(altContainer);
    }
    
    return createTestCard(container);
}

/**
 * Helper function to create a test card in a container
 * @param {Element} container - Container element to add the card to
 */
function createTestCard(container) {
    // Create test card
    const testCard = document.createElement('div');
    testCard.className = 'connection-card test-card';
    testCard.innerHTML = `
        <div style="display: flex; align-items: center;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: #8a57de; display: flex; align-items: center; justify-content: center; color: white; margin-right: 12px;">
                <span>TC</span>
            </div>
            <div>
                <div style="font-weight: bold; color: white;">Test Connection</div>
                <div style="color: #b8b5c7;">Test Relationship</div>
            </div>
        </div>
    `;
    
    // Apply inline styles for visibility
    testCard.style.border = '2px dashed #ff7eb6';
    testCard.style.padding = '12px';
    testCard.style.borderRadius = '12px';
    testCard.style.margin = '8px 0';
    testCard.style.background = '#211E2E';
    testCard.style.cursor = 'pointer';
    
    // Add to container
    container.appendChild(testCard);
    console.log('Test card added:', testCard);
    
    // Add click handler
    testCard.addEventListener('click', function() {
        console.log('Test card clicked');
        
        // Remove selected class from all cards
        document.querySelectorAll('.connection-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selected class to this card
        this.classList.add('selected');
        this.style.borderColor = '#8a57de';
        this.style.borderStyle = 'solid';
        
        // Enable next button
        if (elements.buttons.recipientNext) {
            elements.buttons.recipientNext.classList.remove('disabled');
        }
    });
    
    return testCard;
}

/**
 * Fix visibility issues with connections container and list
 * This function resolves rendering issues where cards are created but not visible
 */
function fixConnectionsVisibility() {
    console.log('Applying visibility fixes to connections elements...');
    
    // Fix recipient step container
    const recipientStep = document.getElementById('step-recipient');
    if (recipientStep) {
        const stepBody = recipientStep.querySelector('.step-body');
        if (stepBody) {
            // Ensure the step body is visible
            stepBody.style.display = 'block';
            stepBody.style.width = '100%';
            stepBody.style.position = 'relative';
            
            console.log('Fixed step body visibility');
        }
    }
    
    // Fix connections container
    const connectionsContainer = document.querySelector('.connections-container');
    if (connectionsContainer) {
        // Ensure the connections container is visible
        connectionsContainer.style.display = 'block';
        connectionsContainer.style.width = '100%';
        connectionsContainer.style.margin = '20px 0';
        connectionsContainer.style.position = 'relative';
        connectionsContainer.style.zIndex = '5';
        
        console.log('Fixed connections container visibility');
    } else {
        console.warn('Connections container not found, may need to create it');
        createConnectionsContainer();
    }
    
    // Fix connections list
    const connectionsList = document.getElementById('connections-list');
    if (connectionsList) {
        // Ensure list is visible
        connectionsList.style.display = 'block';
        connectionsList.style.width = '100%';
        connectionsList.style.maxHeight = '400px';
        connectionsList.style.overflowY = 'auto';
        connectionsList.style.position = 'relative';
        connectionsList.style.zIndex = '10';
        
        // Add debug border temporarily to see boundaries
        connectionsList.style.padding = '8px';
        
        console.log('Fixed connections list visibility');
    }
}

/**
 * Create connections container if missing
 */
function createConnectionsContainer() {
    console.log('Creating missing connections container...');
    
    const stepBody = document.querySelector('#step-recipient .step-body');
    if (!stepBody) {
        console.error('Cannot create connections container: Step body not found');
        return;
    }
    
    // Clear step body content first
    stepBody.innerHTML = '';
    
    // Create connections container
    const connectionsContainer = document.createElement('div');
    connectionsContainer.className = 'connections-container';
    connectionsContainer.style.display = 'block';
    connectionsContainer.style.width = '100%';
    connectionsContainer.style.margin = '20px 0';
    
    // Create connections list
    const connectionsList = document.createElement('div');
    connectionsList.id = 'connections-list';
    connectionsList.className = 'connections-list';
    connectionsList.style.display = 'block';
    connectionsList.style.width = '100%';
    
    // Create add connection button
    const addButton = document.createElement('div');
    addButton.id = 'add-new-connection';
    addButton.className = 'add-connection-card';
    addButton.innerHTML = `
        <div class="add-connection-icon">
            <i class="fas fa-plus"></i>
        </div>
        <div class="add-connection-label">Create New</div>
    `;
    
    // Add event listener to the add button
    addButton.addEventListener('click', function() {
        openConnectionModal();
    });
    
    // Assemble the structure
    connectionsContainer.appendChild(connectionsList);
    connectionsContainer.appendChild(addButton);
    stepBody.appendChild(connectionsContainer);
    
    // Update our elements reference
    elements.recipientStep.connectionsList = connectionsList;
    elements.recipientStep.addNewConnection = addButton;
    
    console.log('Created connections container structure');
    
    return connectionsContainer;
}

/**
 * Initialize the navigation protection system
 * This ensures buttons are always accessible through multiple fallback mechanisms
 */
function initializeNavigationProtection() {
    console.log('Initializing navigation protection system');
    
    // Apply enhanced button styling
    enhanceNavigationButtonsStyle();
    
    // Create floating navigation buttons
    ensureFloatingNavigationButtons();
    
    // Initialize keyboard shortcuts
    initializeKeyboardShortcuts();
    
    // Start monitoring button visibility
    startButtonVisibilityObserver();
    
    // Initialize session recovery
    initializeSessionRecovery();
    
    console.log('Navigation protection system initialized');
}

/**
 * Initialize keyboard shortcuts for navigation
 */
function initializeKeyboardShortcuts() {
    console.log('Setting up keyboard shortcuts');
    
    // Remove any existing event listeners
    document.removeEventListener('keydown', handleKeyboardNavigation);
    
    // Add keyboard navigation event
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Add keyboard shortcut info to UI
    addKeyboardShortcutInfo();
}

/**
 * Handle keyboard navigation events
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyboardNavigation(event) {
    // Only handle if not in input, textarea, etc.
    if (event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA' || 
        event.target.isContentEditable) {
        return;
    }
    
    // Handle arrow keys with Alt modifier
    if (event.altKey) {
        switch (event.key) {
            case 'ArrowRight':
                // Next step
                event.preventDefault();
                console.log('Keyboard shortcut: Next step');
                switch (currentStep) {
                    case 'recipient': 
                        if (messageData.recipient) goToNextStep('recipient');
                        break;
                    case 'intent': 
                        if (messageData.intent) goToNextStep('intent');
                        break;
                    case 'tone': 
                        if (messageData.tone) goToNextStep('tone');
                        break;
                    default: break;
                }
                break;
                
            case 'ArrowLeft':
                // Previous step
                event.preventDefault();
                console.log('Keyboard shortcut: Previous step');
                if (currentStep !== 'recipient') {
                    goToPreviousStep(currentStep);
                }
                break;
                
            case '1':
                // Go to step 1
                event.preventDefault();
                showStep('recipient');
                break;
                
            case '2':
                // Go to step 2
                event.preventDefault();
                if (messageData.recipient) showStep('intent');
                break;
                
            case '3':
                // Go to step 3
                event.preventDefault();
                if (messageData.recipient && messageData.intent) showStep('tone');
                break;
                
            case '4':
                // Go to step 4
                event.preventDefault();
                if (messageData.recipient && messageData.intent && messageData.tone) showStep('result');
                break;
                
            case 'n':
                // New message (if on result step)
                event.preventDefault();
                if (currentStep === 'result') {
                    if (confirm('Start a new message? Your current message will be saved to your history.')) {
                        resetAll();
                        showStep('recipient');
                    }
                }
                break;
        }
    }
}

/**
 * Add keyboard shortcut info to the UI
 */
function addKeyboardShortcutInfo() {
    // Remove existing helper if any
    const existingHelper = document.getElementById('keyboard-shortcut-helper');
    if (existingHelper) {
        existingHelper.remove();
    }
    
    // Create helper element
    const helper = document.createElement('div');
    helper.id = 'keyboard-shortcut-helper';
    helper.className = 'keyboard-shortcuts-info';
    
    // Style the helper
    Object.assign(helper.style, {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        background: 'rgba(33, 30, 46, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px',
        zIndex: '9999',
        backdropFilter: 'blur(5px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        transition: 'opacity 0.3s ease',
        opacity: '0',
        pointerEvents: 'none'
    });
    
    // Set helper content
    helper.innerHTML = `
        <p style="margin: 0 0 5px; font-weight: bold;">Keyboard Shortcuts</p>
        <div style="display: grid; grid-template-columns: auto auto; gap: 5px; text-align: left;">
            <div><kbd>Alt</kbd> + <kbd>→</kbd></div><div>Next step</div>
            <div><kbd>Alt</kbd> + <kbd>←</kbd></div><div>Previous step</div>
            <div><kbd>Alt</kbd> + <kbd>1-4</kbd></div><div>Jump to step</div>
            <div><kbd>Alt</kbd> + <kbd>N</kbd></div><div>New message</div>
            <div><kbd>?</kbd></div><div>Show/hide shortcuts</div>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(helper);
    
    // Add global listener for ? key to show/hide shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === '?' && !e.repeat) {
            const helper = document.getElementById('keyboard-shortcut-helper');
            if (helper) {
                if (helper.style.opacity === '0' || helper.style.opacity === '') {
                    helper.style.opacity = '1';
                    helper.style.pointerEvents = 'auto';
                    
                    // Auto-hide after 5 seconds
                    setTimeout(() => {
                        helper.style.opacity = '0';
                        helper.style.pointerEvents = 'none';
                    }, 5000);
                } else {
                    helper.style.opacity = '0';
                    helper.style.pointerEvents = 'none';
                }
            }
        }
    });
    
    // Show briefly on initialization
    setTimeout(() => {
        helper.style.opacity = '1';
        setTimeout(() => {
            helper.style.opacity = '0';
        }, 3000);
    }, 1000);
}

/**
 * Start observing button visibility to detect and fix hidden buttons
 */
function startButtonVisibilityObserver() {
    console.log('Starting button visibility observer');
    
    // List of buttons to observe
    const buttonSelectors = [
        '#recipientNextBtn', 
        '#intentPrevBtn', 
        '#intentNextBtn', 
        '#tonePrevBtn', 
        '#toneNextBtn', 
        '#resultPrevBtn', 
        '#createNewBtn'
    ];
    
    // Setup IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const buttonId = entry.target.id;
            
            // If button is not visible, try to fix it
            if (!entry.isIntersecting) {
                console.warn(`Button ${buttonId} is not visible, attempting repair`);
                
                // Force critical styles directly on the button
                const button = entry.target;
                Object.assign(button.style, {
                    visibility: 'visible',
                    display: 'inline-flex',
                    opacity: '1',
                    position: 'relative',
                    zIndex: '9999'
                });
                
                // Check if we're in the button's step
                if ((currentStep === 'recipient' && buttonId === 'recipientNextBtn') ||
                    (currentStep === 'intent' && (buttonId === 'intentPrevBtn' || buttonId === 'intentNextBtn')) ||
                    (currentStep === 'tone' && (buttonId === 'tonePrevBtn' || buttonId === 'toneNextBtn')) ||
                    (currentStep === 'result' && (buttonId === 'resultPrevBtn' || buttonId === 'createNewBtn'))) {
                    
                    // This button should be visible in the current step
                    // Force the container to be visible too
                    const stepId = currentStep;
                    verifyAndFixStepFooter(stepId);
                }
            }
        });
    }, {
        threshold: 0.1, // Trigger if less than 10% visible
        rootMargin: '0px' // No margin
    });
    
    // Start observing each button
    buttonSelectors.forEach(selector => {
        const button = document.querySelector(selector);
        if (button) {
            observer.observe(button);
        }
    });
    
    // Re-check buttons periodically
    setInterval(() => {
        buttonSelectors.forEach(selector => {
            const button = document.querySelector(selector);
            if (button) {
                // Re-apply critical styles
                Object.assign(button.style, {
                    visibility: 'visible',
                    display: 'inline-flex',
                    position: 'relative',
                    zIndex: '9999'
                });
                
                // Make sure it's observed
                observer.observe(button);
            }
        });
    }, 5000);
}

/**
 * Initialize recovery for session navigation
 * Stores navigation state to help recover from errors
 */
function initializeSessionRecovery() {
    // Check for stored navigation state
    try {
        const storedState = sessionStorage.getItem('messageBuilderState');
        if (storedState) {
            const state = JSON.parse(storedState);
            console.log('Recovered session state:', state);
            
            // If we have a stored currentStep that doesn't match, see if we should use it
            if (state.currentStep && state.currentStep !== currentStep) {
                // Only recover if we have appropriate data
                if (state.currentStep === 'intent' && messageData.recipient) {
                    showStep(state.currentStep);
                } else if (state.currentStep === 'tone' && messageData.recipient && messageData.intent) {
                    showStep(state.currentStep);
                } else if (state.currentStep === 'result' && messageData.recipient && messageData.intent && messageData.tone) {
                    showStep(state.currentStep);
                }
            }
        }
    } catch (e) {
        console.error('Error recovering session state:', e);
    }
    
    // Setup storage of current state
    window.addEventListener('beforeunload', saveNavigationState);
    
    // Also save periodically
    setInterval(saveNavigationState, 10000);
}

/**
 * Save current navigation state to session storage
 */
function saveNavigationState() {
    try {
        const state = {
            currentStep: currentStep,
            timestamp: new Date().getTime()
        };
        sessionStorage.setItem('messageBuilderState', JSON.stringify(state));
    } catch (e) {
        console.error('Error saving navigation state:', e);
    }
}

/**
 * Show error recovery options when a step fails to load
 * @param {Error} error - The error that occurred
 * @param {string} failedStep - The step that failed
 * @param {string} previousStep - The previous step
 */
function showErrorRecoveryOptions(error, failedStep, previousStep) {
    console.error(`Error in step ${failedStep}:`, error);
    
    // Create recovery dialog
    const recoveryDialog = document.createElement('div');
    recoveryDialog.className = 'error-recovery-dialog';
    
    // Style dialog
    Object.assign(recoveryDialog.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(40, 36, 61, 0.95)',
        border: '1px solid #ff5b75',
        borderRadius: '12px',
        padding: '20px',
        zIndex: '10000',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 0 30px rgba(255, 91, 117, 0.3)',
        backdropFilter: 'blur(10px)',
        color: 'white',
        textAlign: 'center'
    });
    
    // Set dialog content
    recoveryDialog.innerHTML = `
        <h3 style="margin-top: 0; color: #ff5b75;">Oops! Something went wrong</h3>
        <p>We encountered a problem while loading the ${failedStep} step.</p>
        <p style="margin-bottom: 20px;">What would you like to do?</p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <button id="retry-step" style="padding: 10px; background: linear-gradient(135deg, #8a57de 0%, #ff7eb6 100%); border: none; color: white; border-radius: 8px; cursor: pointer;">Retry This Step</button>
            ${previousStep ? `<button id="go-back" style="padding: 10px; background: transparent; border: 1px solid #8a57de; color: white; border-radius: 8px; cursor: pointer;">Go Back to Previous Step</button>` : ''}
            <button id="reset-app" style="padding: 10px; background: transparent; border: 1px solid #ff5b75; color: #ff5b75; border-radius: 8px; cursor: pointer;">Reset Application</button>
        </div>
    `;
    
    // Add dialog to body
    document.body.appendChild(recoveryDialog);
    
    // Add event listeners
    const retryButton = recoveryDialog.querySelector('#retry-step');
    const backButton = recoveryDialog.querySelector('#go-back');
    const resetButton = recoveryDialog.querySelector('#reset-app');
    
    if (retryButton) {
        retryButton.addEventListener('click', () => {
            recoveryDialog.remove();
            setTimeout(() => showStep(failedStep), 100);
        });
    }
    
    if (backButton) {
        backButton.addEventListener('click', () => {
            recoveryDialog.remove();
            setTimeout(() => showStep(previousStep), 100);
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            recoveryDialog.remove();
            resetAll();
            setTimeout(() => showStep('recipient'), 100);
        });
    }
}

/**
 * Track step changes for analytics
 * @param {string} from - Previous step
 * @param {string} to - New step
 */
function trackStepChange(from, to) {
    try {
        console.log(`Step change: ${from || 'initial'} -> ${to}`);
        
        // Record time spent on steps
        if (from) {
            const stepStartTime = window.stepTimers ? window.stepTimers[from] : null;
            if (stepStartTime) {
                const timeSpent = new Date().getTime() - stepStartTime;
                console.log(`Time spent on ${from} step: ${timeSpent/1000} seconds`);
                
                // Could send to analytics service
            }
        }
        
        // Start timer for new step
        if (!window.stepTimers) window.stepTimers = {};
        window.stepTimers[to] = new Date().getTime();
        
    } catch (e) {
        console.error('Error tracking step change:', e);
    }
}

/**
 * Create a floating navigation container that's always visible
 * This serves as a fallback in case the regular buttons are hidden
 */
function ensureFloatingNavigationButtons() {
    // Remove any existing container to avoid duplicates
    const existingContainer = document.getElementById('floating-nav-buttons');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    // Create floating container
    const floatingContainer = document.createElement('div');
    floatingContainer.id = 'floating-nav-buttons';
    
    // Position at the bottom of the screen
    Object.assign(floatingContainer.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '9999',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '10px',
        background: 'rgba(33, 30, 46, 0.8)',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)'
    });
    
    // Create navigation buttons for all steps
    const buttons = [];
    
    // Next button for current step
    let currentNextButton = null;
    let buttonLabel = '';
    
    switch (currentStep) {
        case 'recipient': 
            currentNextButton = elements.buttons.recipientNext;
            buttonLabel = 'Next: Choose Intent';
            break;
        case 'intent': 
            currentNextButton = elements.buttons.intentNext;
            buttonLabel = 'Next: Select Tone';
            break;
        case 'tone': 
            currentNextButton = elements.buttons.toneNext;
            buttonLabel = 'Next: See Result';
            break;
        case 'result': 
            currentNextButton = elements.buttons.createNew;
            buttonLabel = 'Create New Message';
            break;
    }
    
    // Create primary button (Next or Create New)
    const primaryButton = document.createElement('button');
    primaryButton.textContent = buttonLabel;
    primaryButton.className = 'floating-next-button';
    
    // Style primary button
    Object.assign(primaryButton.style, {
        padding: '12px 20px',
        background: 'linear-gradient(135deg, #8a57de 0%, #ff7eb6 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(138, 87, 222, 0.25)',
        transition: 'all 0.2s ease'
    });
    
    // Add arrow icon
    if (currentStep !== 'result') {
        primaryButton.innerHTML += ' <i class="fas fa-arrow-right" style="margin-left: 8px;"></i>';
    }
    
    // Add click handler mirroring the original button
    primaryButton.addEventListener('click', function() {
        console.log('Floating button clicked for step:', currentStep);
        
        // Check if we should copy existing button functionality
        if (currentNextButton && !currentNextButton.classList.contains('disabled')) {
            // Simply click the original button
            currentNextButton.click();
        } else {
            // Implement direct step navigation
            if (currentStep === 'recipient' && messageData.recipient) {
                goToNextStep('recipient');
            } else if (currentStep === 'intent' && messageData.intent) {
                goToNextStep('intent');
            } else if (currentStep === 'tone' && messageData.tone) {
                goToNextStep('tone');
            } else if (currentStep === 'result') {
                resetAll();
                showStep('recipient');
            } else {
                // Show alert about selecting required data first
                showAlert(`Please complete this step before proceeding.`, 'warning');
            }
        }
    });
    
    // Add previous button for all steps except recipient
    if (currentStep !== 'recipient') {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.className = 'floating-prev-button';
        
        // Style previous button
        Object.assign(prevButton.style, {
            padding: '10px 16px',
            background: 'transparent',
            color: 'white',
            border: '1px solid #8a57de',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
        });
        
        // Add arrow icon
        prevButton.innerHTML = '<i class="fas fa-arrow-left" style="margin-right: 8px;"></i> Previous';
        
        // Add click handler
        prevButton.addEventListener('click', function() {
            goToPreviousStep(currentStep);
        });
        
        buttons.push(prevButton);
    }
    
    // Add buttons to container
    buttons.push(primaryButton);
    buttons.forEach(button => floatingContainer.appendChild(button));
    
    // Add to body
    document.body.appendChild(floatingContainer);
    
    // Make container draggable
    makeDraggable(floatingContainer);
    
    // Initially hide the container and show after a delay
    floatingContainer.style.opacity = '0';
    floatingContainer.style.transform = 'translateY(20px)';
    
    // Show after 2 seconds (gives time for main UI to load first)
    setTimeout(() => {
        floatingContainer.style.transition = 'all 0.3s ease';
        floatingContainer.style.opacity = '1';
        floatingContainer.style.transform = 'translateY(0)';
    }, 2000);
    
    console.log('Floating navigation buttons created');
}

/**
 * Make an element draggable
 * @param {HTMLElement} element - The element to make draggable
 */
function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    // Create a drag handle
    const dragHandle = document.createElement('div');
    dragHandle.innerHTML = '<i class="fas fa-grip-lines"></i>';
    dragHandle.style.cursor = 'move';
    dragHandle.style.padding = '5px';
    dragHandle.style.marginBottom = '5px';
    dragHandle.style.textAlign = 'center';
    dragHandle.style.color = '#b8b5c7';
    
    // Insert at the beginning
    element.insertBefore(dragHandle, element.firstChild);
    
    // Mouse down handler
    dragHandle.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Get the mouse cursor position at startup
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // Call a function whenever the cursor moves
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Calculate the new cursor position
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Set the element's new position
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
        element.style.right = 'auto';
        element.style.bottom = 'auto';
    }
    
    function closeDragElement() {
        // Stop moving when mouse button is released
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

/**
 * Handle intent selection
 * @param {Element} intentElement - The selected intent element
 * @param {Object} intentData - The intent data
 */
function handleIntentSelection(intentElement, intentData) {
    // Remove selected class from all intents
    const allIntents = document.querySelectorAll('.intent-card');
    allIntents.forEach(intent => intent.classList.remove('selected'));
    
    // Add selected class to clicked intent
    intentElement.classList.add('selected');
    
    // Store intent data
    messageData.intent = intentData;
    
    // Update preview
    updatePreview();
    
    // Enable next button
    enableIntentNextButton();
    
    // Debug the state after selection
    debugMessageData();
}

/**
 * Enable the intent next button
 */
function enableIntentNextButton() {
    const nextBtn = document.getElementById('intentNextBtn');
    if (nextBtn) {
        console.log('Removing disabled class from intent next button');
        nextBtn.classList.remove('disabled');
        nextBtn.disabled = false;
    }
}

/**
 * Debug helper: Log the current message data state
 */
function debugMessageData() {
    console.log('=== Current Message Data State ===');
    console.log('Current step:', currentStep);
    console.log('Recipient data:', messageData.recipient);
    console.log('Intent data:', messageData.intent);
    console.log('Tone data:', messageData.tone);
    console.log('Result data:', messageData.result);
    console.log('Intent Next button:', elements.buttons.intentNext);
    console.log('Is disabled class present:', elements.buttons.intentNext?.classList.contains('disabled'));
    console.log('================================');
}

// Call the debug function in key places
function goToNextStep(currentStepId) {
    debugMessageData();
    
    // Rest of the existing function...
}

function goToPreviousStep(currentStepId) {
    debugMessageData();
    
    // Rest of the existing function...
}

/**
 * Verify and fix the step footer to ensure navigation buttons work properly
 * @param {string} stepId - The ID of the step to verify
 */
function verifyAndFixStepFooter(stepId) {
    console.log('Verifying and fixing step footer for step:', stepId);
    
    try {
        // Get the step element
        const stepElement = document.getElementById(`step-${stepId}`);
        if (!stepElement) {
            console.warn(`Step element not found for step: ${stepId}`);
            return;
        }
        
        // Get the footer element
        const footer = stepElement.querySelector('.step-footer');
        if (!footer) {
            console.warn(`Footer element not found for step: ${stepId}`);
            return;
        }
        
        // Ensure the footer is visible
        footer.style.display = 'flex';
        footer.style.justifyContent = 'space-between';
        footer.style.alignItems = 'center';
        footer.style.marginTop = '20px';
        
        // Process buttons based on step ID
        switch (stepId) {
            case 'recipient':
                const recipientNextBtn = footer.querySelector('#recipientNextBtn');
                if (recipientNextBtn) {
                    // Enable the next button if we have a recipient selected
                    if (messageData.recipient && messageData.recipient.id) {
                        recipientNextBtn.classList.remove('disabled');
                    }
                }
                break;
                
            case 'intent':
                const intentPrevBtn = footer.querySelector('#intentPrevBtn');
                const intentNextBtn = footer.querySelector('#intentNextBtn');
                
                // Ensure buttons have proper handlers
                if (intentPrevBtn) {
                    intentPrevBtn.onclick = function() { goToPreviousStep('intent'); };
                }
                
                if (intentNextBtn) {
                    intentNextBtn.onclick = function() { goToNextStep('intent'); };
                    
                    // Enable the next button if we have an intent selected
                    if (messageData.intent) {
                        intentNextBtn.classList.remove('disabled');
                    }
                }
                break;
                
            case 'tone':
                const tonePrevBtn = footer.querySelector('#tonePrevBtn');
                const toneNextBtn = footer.querySelector('#toneNextBtn');
                
                // Ensure buttons have proper handlers
                if (tonePrevBtn) {
                    tonePrevBtn.onclick = function() { goToPreviousStep('tone'); };
                }
                
                if (toneNextBtn) {
                    toneNextBtn.onclick = function() { goToNextStep('tone'); };
                    
                    // Enable the next button if we have a tone selected
                    if (messageData.tone) {
                        toneNextBtn.classList.remove('disabled');
                    }
                }
                break;
                
            case 'result':
                const resultPrevBtn = footer.querySelector('#resultPrevBtn');
                
                // Ensure button has proper handler
                if (resultPrevBtn) {
                    resultPrevBtn.onclick = function() { goToPreviousStep('result'); };
                }
                break;
        }
        
        console.log(`Step footer for ${stepId} verified and fixed`);
    } catch (error) {
        console.error('Error in verifyAndFixStepFooter:', error);
        // Don't throw the error to prevent breaking navigation
    }
}
