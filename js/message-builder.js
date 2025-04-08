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
            
            // Try to load user's connections
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
        elements.buttons.intentPrev.addEventListener('click', function() {
            goToPreviousStep('intent');
        });
    }
    
    if (elements.buttons.intentNext) {
        elements.buttons.intentNext.addEventListener('click', function() {
            goToNextStep('intent');
        });
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
 * @param {boolean} initialLoad - Whether this is the initial load
 */
function updatePreview(initialLoad = false) {
    console.log('Updating preview panel...');
    
    // Update container class if there's a message
    const previewContainer = elements.preview.container;
    if (previewContainer) {
        if (messageData.result && messageData.result.message) {
            previewContainer.classList.add('preview-has-message');
        } else {
            previewContainer.classList.remove('preview-has-message');
        }
    }
    
    // Recipient info
    updatePreviewElement(elements.preview.recipientName, 
        messageData.recipient ? messageData.recipient.name : 'Select a recipient',
        initialLoad);
    
    updatePreviewElement(elements.preview.recipientRelationship, 
        messageData.recipient ? formatRelationship(messageData.recipient) : '',
        initialLoad);
    
    updatePreviewElement(elements.preview.recipientInitial, 
        messageData.recipient ? getInitials(messageData.recipient.name) : '?',
        initialLoad);
    
    // Intent info
    updatePreviewElement(elements.preview.intent, 
        messageData.intent ? messageData.intent.title : '-',
        initialLoad);
    
    // Tone info
    updatePreviewElement(elements.preview.tone, 
        messageData.tone ? messageData.tone.name : '-',
        initialLoad);
    
    // Message text
    if (messageData.result && messageData.result.message) {
        // Show actual message text
        elements.preview.messagePlaceholder.style.display = 'none';
        updatePreviewElement(elements.preview.messageText, 
            messageData.result.message,
            initialLoad,
            true); // text element - preserve formatting
    } else if (messageData.recipient && messageData.intent && messageData.tone) {
        // Show placeholder for what we know so far
        elements.preview.messagePlaceholder.style.display = 'block';
        elements.preview.messagePlaceholder.textContent = `
            Creating a ${messageData.tone.name.toLowerCase()} message for ${messageData.recipient.name} 
            to ${messageData.intent.title.toLowerCase()}...
        `;
        elements.preview.messageText.style.display = 'none';
    } else {
        // Default placeholder
        elements.preview.messagePlaceholder.style.display = 'block';
        elements.preview.messagePlaceholder.textContent = 'Your message will appear here as you make selections...';
        elements.preview.messageText.style.display = 'none';
    }
}

/**
 * Helper function to update preview elements with animation
 * @param {HTMLElement} element - The element to update
 * @param {string} value - The new value
 * @param {boolean} skipAnimation - Whether to skip the animation
 * @param {boolean} isTextElement - Whether this is a text element that should preserve formatting
 */
function updatePreviewElement(element, value, skipAnimation = false, isTextElement = false) {
    if (!element) return;
    
    // Don't animate if content hasn't changed
    if (isTextElement ? element.innerHTML === value : element.textContent === value) {
        return;
    }
    
    // Function to update the content
    const updateContent = () => {
        if (isTextElement) {
            // For message text, preserve line breaks by replacing \n with <br>
            element.innerHTML = value.replace(/\n/g, '<br>');
        } else {
            element.textContent = value;
        }
        
        element.dataset.value = value;
        element.style.display = value ? 'block' : 'none';
    };
    
    if (skipAnimation) {
        // Update immediately without animation
        updateContent();
    } else {
        // Add transition out class
        element.classList.add('preview-update-out');
        
        // After transition out, update content and transition back in
        setTimeout(() => {
            updateContent();
            element.classList.remove('preview-update-out');
            element.classList.add('preview-update-in');
            
            // Remove the transition in class after animation completes
            setTimeout(() => {
                element.classList.remove('preview-update-in');
            }, 300);
        }, 300);
    }
}

/**
 * Load user's connections from Firestore
 */
function loadUserConnections() {
    if (!currentUser) return;
    
    showLoading('Loading your connections...');
    
    firebase.firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('connections')
        .orderBy('name')
        .get()
        .then(snapshot => {
            hideLoading();
            
            const connectionsList = elements.recipientStep.connectionsList;
            if (!connectionsList) return;
            
            // Clear existing connections
            connectionsList.innerHTML = '';
            
            if (snapshot.empty) {
                console.log('No connections found');
                return;
            }
            
            // Add each connection as a card
            snapshot.forEach(doc => {
                const connection = doc.data();
                connection.id = doc.id;
                
                addConnectionCard(connection);
            });
            
            // Check if we have a selected connection
            if (messageData.recipient && messageData.recipient.id) {
                const selectedCard = connectionsList.querySelector(`.connection-card[data-id="${messageData.recipient.id}"]`);
                if (selectedCard) {
                    selectedCard.classList.add('selected');
                    elements.buttons.recipientNext.classList.remove('disabled');
                }
            }
        })
        .catch(error => {
            console.error('Error loading connections:', error);
            hideLoading();
            showAlert('Failed to load your connections. Please try again.', 'error');
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
 * Add connection card to the list
 */
function addConnectionCard(connection) {
    const connectionsList = elements.recipientStep.connectionsList;
    if (!connectionsList) return;
    
    const card = document.createElement('div');
    card.className = 'connection-card';
    card.setAttribute('data-id', connection.id);
    
    // Get relationship display text
    const relationship = connection.relationship === 'other' && connection.otherRelationship 
        ? connection.otherRelationship 
        : connection.relationship;
    
    // Get relationship icon
    const relationshipIcon = getRelationshipIcon(connection.relationship);
    
    card.innerHTML = `
        <div class="connection-avatar">
            <i class="fas ${relationshipIcon}"></i>
        </div>
        <div class="connection-info">
            <div class="connection-name">${connection.name}</div>
            <div class="connection-relationship">${capitalizeFirstLetter(relationship)}</div>
        </div>
    `;
    
    // Add click event to select this connection
    card.addEventListener('click', function() {
        // Remove selected class from all cards
        const cards = connectionsList.querySelectorAll('.connection-card');
        cards.forEach(c => c.classList.remove('selected'));
        
        // Add selected class to this card
        this.classList.add('selected');
        
        // Update messageData
        messageData.recipient = {
            id: connection.id,
            name: connection.name,
            relationship: connection.relationship,
            otherRelationship: connection.otherRelationship
        };
        
        // Save to localStorage
        localStorage.setItem('recipientData', JSON.stringify(messageData.recipient));
        
        // Enable next button
        elements.buttons.recipientNext.classList.remove('disabled');
        
        // Update preview panel
        updatePreview();
    });
    
    // Add fade-in animation
    setTimeout(() => {
        card.classList.add('fade-in');
    }, 50);
    
    connectionsList.appendChild(card);
}

/**
 * Get icon for relationship type
 */
function getRelationshipIcon(relationship) {
    const icons = {
        'friend': 'fa-user-friends',
        'family': 'fa-home',
        'partner': 'fa-heart',
        'colleague': 'fa-briefcase',
        'acquaintance': 'fa-handshake'
    };
    
    return icons[relationship] || 'fa-user';
}

/**
 * Open connection modal to create/edit a connection
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
 * Close connection modal
 */
function closeConnectionModal() {
    closeModal(elements.modals.connectionModal);
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
    
    // Ensure the step exists
    if (!STEPS[stepId]) {
        console.error(`Invalid step ID: ${stepId}`);
        return false;
    }
    
    // Validate that all previous steps have data
    if (stepId !== 'recipient' && !validatePreviousSteps(stepId)) {
        console.warn(`Cannot show step ${stepId} because previous steps are incomplete`);
        
        // Find the earliest incomplete step
        const stepKeys = Object.keys(STEPS);
        for (let i = 0; i < stepKeys.length; i++) {
            const checkStepId = stepKeys[i];
            
            // Check if we've already passed this step
            if (checkStepId === stepId) {
                break;
            }
            
            // If this step is missing data, show it instead
            if (!messageData[checkStepId]) {
                showStep(checkStepId);
                showAlert(`Please complete step ${i + 1} first.`, 'warning');
                return false;
            }
        }
        
        return false;
    }
    
    // Validate the current step's data if moving forward
    const currentStepIndex = Object.keys(STEPS).indexOf(currentStep);
    const targetStepIndex = Object.keys(STEPS).indexOf(stepId);
    
    if (targetStepIndex > currentStepIndex && STEPS[currentStep].validate) {
        const isValid = STEPS[currentStep].validate();
        if (!isValid) {
            console.warn(`Validation failed for step: ${currentStep}`);
            return false;
        }
    }
    
    // Save current step data
    saveStepData(currentStep);
    
    // Update current step
    const previousStep = currentStep;
    currentStep = stepId;
    
    // Save to localStorage
    localStorage.setItem('currentStep', currentStep);
    
    // Get DOM elements
    const stepElements = document.querySelectorAll('.message-builder__step');
    
    // Determine animation direction (forward or backward)
    const isForward = targetStepIndex > currentStepIndex;
    
    // Hide all steps with appropriate animation
    stepElements.forEach(element => {
        if (!skipAnimation) {
            // Remove existing animation classes
            element.classList.remove('slide-in-right', 'slide-in-left', 'slide-out-right', 'slide-out-left');
            
            // Add appropriate exit animation class if this is the active step
            if (element.classList.contains('active')) {
                element.classList.add(isForward ? 'slide-out-left' : 'slide-out-right');
            }
        }
        
        // After exit animation, remove active class
        setTimeout(() => {
            element.classList.remove('active');
        }, skipAnimation ? 0 : 300);
    });
    
    // Show target step with animation
    const targetElement = document.getElementById(STEPS[stepId].id);
    if (targetElement) {
        setTimeout(() => {
            if (!skipAnimation) {
                // Add appropriate entrance animation class
                targetElement.classList.add(isForward ? 'slide-in-right' : 'slide-in-left');
            }
            
            // Add active class
            targetElement.classList.add('active');
            
            // Scroll to top
            targetElement.scrollTop = 0;
        }, skipAnimation ? 0 : 300);
    }
    
    // Update sidebar
    updateSidebar(previousStep, stepId);
    
    // Update preview
    updatePreview();
    
    // Initialize step-specific functionality
    initializeStepContent(stepId);
    
    // Track step view in analytics
    if (firebase.analytics) {
        firebase.analytics().logEvent('view_step', {
            step_id: stepId,
            step_number: Object.keys(STEPS).indexOf(stepId) + 1,
            timestamp: new Date().toISOString()
        });
    }
    
    return true;
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
    switch (stepId) {
        case 'recipient':
            // Recipient step content might already be loaded
            refreshConnectionsList();
            break;
            
        case 'intent':
            // Load intent options if not already loaded
            if (!document.querySelector('.intent-options-container')) {
                loadIntentOptions();
            }
            break;
            
        case 'tone':
            // Load tone options if not already loaded
            if (!document.querySelector('.tone-options-container')) {
                loadToneOptions();
            }
            
            // Update context section with recipient and intent
            updateToneContext();
            break;
            
        case 'result':
            // Initialize or refresh result display
            initializeResultStep();
            break;
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
    console.log('Initializing intent step...');
    
    // Get the intent step content container
    const stepContent = elements.steps.intent.querySelector('.step-body');
    if (!stepContent) {
        console.error('Intent step content container not found');
        return;
    }
    
    // Create intent selection HTML
    const intentHTML = `
        <div class="intent-categories">
            <div class="intent-toggle">
                <button class="intent-toggle__btn intent-toggle__btn--professional active" data-category="professional">
                    <i class="fas fa-briefcase"></i>
                    <span>Professional</span>
                </button>
                <button class="intent-toggle__btn intent-toggle__btn--personal" data-category="personal">
                    <i class="fas fa-heart"></i>
                    <span>Personal</span>
                </button>
            </div>
        </div>
        
        <div class="intent-options-container">
            <!-- Professional Intents -->
            <div class="intent-options professional-intents active">
                <div class="option-card" data-intent="recognize_effort">
                    <div class="option-icon">
                        <i class="fas fa-award"></i>
                    </div>
                    <div class="option-content">
                        <h4 class="option-title">Recognize Effort</h4>
                        <p class="option-description">Acknowledge someone's hard work and dedication to a project or task.</p>
                    </div>
                </div>
                
                <div class="option-card" data-intent="give_feedback">
                    <div class="option-icon">
                        <i class="fas fa-comment-dots"></i>
                    </div>
                    <div class="option-content">
                        <h4 class="option-title">Give Feedback</h4>
                        <p class="option-description">Provide constructive feedback while maintaining a supportive tone.</p>
                    </div>
                </div>
                
                <div class="option-card" data-intent="thank_support">
                    <div class="option-icon">
                        <i class="fas fa-hands-helping"></i>
                    </div>
                    <div class="option-content">
                        <h4 class="option-title">Thank for Support</h4>
                        <p class="option-description">Express gratitude for someone's help, guidance, or mentorship.</p>
                    </div>
                </div>
                
                <div class="option-card" data-intent="express_clearly">
                    <div class="option-icon">
                        <i class="fas fa-bullseye"></i>
                    </div>
                    <div class="option-content">
                        <h4 class="option-title">Express Clearly</h4>
                        <p class="option-description">Communicate your thoughts or concerns in a direct yet respectful manner.</p>
                    </div>
                </div>
                
                <div class="option-card" data-intent="acknowledge_impact">
                    <div class="option-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="option-content">
                        <h4 class="option-title">Acknowledge Impact</h4>
                        <p class="option-description">Highlight the positive impact someone has made on you, the team, or a project.</p>
                    </div>
                </div>
            </div>
            
            <!-- Personal Intents -->
            <div class="intent-options personal-intents">
                <div class="option-card" data-intent="thinking_of_you">
                    <div class="option-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <div class="option-content">
                        <h4 class="option-title">Thinking of You</h4>
                        <p class="option-description">Let someone know they've been on your mind and you care about them.</p>
                    </div>
                </div>
                
                <div class="option-card" data-intent="say_thank_you">
                    <div class="option-icon">
                        <i class="fas fa-gift"></i>
                    </div>
                    <div class="option-content">
                        <h4 class="option-title">Say Thank You</h4>
                        <p class="option-description">Express sincere gratitude for something someone has done for you.</p>
                    </div>
                </div>
                
                <div class="option-card" data-intent="reconnect">
                    <div class="option-icon">
                        <i class="fas fa-user-friends"></i>
                    </div>
                    <div class="option-content">
                        <h4 class="option-title">Reconnect</h4>
                        <p class="option-description">Reach out to someone you haven't spoken to in a while.</p>
                    </div>
                </div>
                
                <div class="option-card" data-intent="express_feelings">
                    <div class="option-icon">
                        <i class="fas fa-comment-heart"></i>
                    </div>
                    <div class="option-content">
                        <h4 class="option-title">Express Feelings</h4>
                        <p class="option-description">Share your emotions or how someone makes you feel.</p>
                    </div>
                </div>
                
                <div class="option-card" data-intent="make_smile">
                    <div class="option-icon">
                        <i class="fas fa-smile"></i>
                    </div>
                    <div class="option-content">
                        <h4 class="option-title">Make Someone Smile</h4>
                        <p class="option-description">Brighten someone's day with a light-hearted message.</p>
                    </div>
                </div>
                
                <div class="option-card" data-intent="custom">
                    <div class="option-icon">
                        <i class="fas fa-pen"></i>
                    </div>
                    <div class="option-content">
                        <h4 class="option-title">Custom Intent</h4>
                        <p class="option-description">Specify your own messaging intent.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div id="customIntentSection" class="custom-intent-section" style="display: none;">
            <label for="customIntentInput" class="input-label">Describe your intent:</label>
            <div class="custom-intent-input-container">
                <input type="text" id="customIntentInput" class="custom-intent-input" placeholder="E.g., Celebrate a milestone, Apologize for a mistake...">
            </div>
        </div>
    `;
    
    // Add intent HTML to the step content
    stepContent.innerHTML = intentHTML;
    
    // Initialize intent event listeners
    const intentToggleBtns = stepContent.querySelectorAll('.intent-toggle__btn');
    const optionCards = stepContent.querySelectorAll('.option-card');
    const customIntentSection = stepContent.querySelector('#customIntentSection');
    const customIntentInput = stepContent.querySelector('#customIntentInput');
    
    // Intent category toggle
    intentToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all toggle buttons
            intentToggleBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected category
            const category = this.getAttribute('data-category');
            
            // Toggle visible intent options
            const professionalIntents = stepContent.querySelector('.professional-intents');
            const personalIntents = stepContent.querySelector('.personal-intents');
            
            if (category === 'professional') {
                professionalIntents.classList.add('active');
                personalIntents.classList.remove('active');
            } else {
                professionalIntents.classList.remove('active');
                personalIntents.classList.add('active');
            }
            
            // Reset selection
            optionCards.forEach(card => card.classList.remove('selected'));
            customIntentSection.style.display = 'none';
            
            // Disable next button
            elements.buttons.intentNext.classList.add('disabled');
            
            // Reset message data
            messageData.intent = null;
        });
    });
    
    // Intent option selection
    optionCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            optionCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected class to clicked card
            this.classList.add('selected');
            
            // Get intent data
            const intentType = this.getAttribute('data-intent');
            const titleElement = this.querySelector('.option-title');
            const descriptionElement = this.querySelector('.option-description');
            const iconElement = this.querySelector('.option-icon i');
            
            const title = titleElement ? titleElement.textContent : '';
            const description = descriptionElement ? descriptionElement.textContent : '';
            const iconClass = iconElement ? iconElement.className : '';
            
            // Handle custom intent
            if (intentType === 'custom') {
                customIntentSection.style.display = 'block';
                customIntentInput.focus();
                
                // Only enable next if custom text is entered
                elements.buttons.intentNext.classList.add('disabled');
                
                // Check if custom input already has a value (from previous selection)
                if (customIntentInput.value.trim()) {
                    elements.buttons.intentNext.classList.remove('disabled');
                    
                    // Update message data
                    messageData.intent = {
                        type: 'custom',
                        title: customIntentInput.value.trim(),
                        description: 'Custom intent',
                        category: document.querySelector('.intent-toggle__btn.active').getAttribute('data-category'),
                        icon: iconClass,
                        customText: customIntentInput.value.trim()
                    };
                    
                    // Update preview
                    updatePreview();
                }
            } else {
                // Hide custom intent section
                customIntentSection.style.display = 'none';
                
                // Enable next button
                elements.buttons.intentNext.classList.remove('disabled');
                
                // Update message data
                messageData.intent = {
                    type: intentType,
                    title: title,
                    description: description,
                    category: document.querySelector('.intent-toggle__btn.active').getAttribute('data-category'),
                    icon: iconClass
                };
                
                // Update preview
                updatePreview();
            }
        });
    });
    
    // Add a SINGLE event listener for the custom intent input
    // This prevents the issue of adding multiple listeners when clicking the custom intent card repeatedly
    if (customIntentInput) {
        customIntentInput.addEventListener('input', function() {
            const customText = this.value.trim();
            
            if (customText) {
                elements.buttons.intentNext.classList.remove('disabled');
                
                // Update message data
                messageData.intent = {
                    type: 'custom',
                    title: customText,
                    description: 'Custom intent',
                    category: document.querySelector('.intent-toggle__btn.active').getAttribute('data-category'),
                    icon: document.querySelector('.option-card[data-intent="custom"] .option-icon i')?.className || 'fas fa-pen',
                    customText: customText
                };
                
                // Update preview
                updatePreview();
            } else {
                elements.buttons.intentNext.classList.add('disabled');
                messageData.intent = null;
            }
        });
    }
    
    // Load previous intent data if available
    if (messageData.intent) {
        const category = messageData.intent.category || 'professional';
        const intentType = messageData.intent.type;
        
        // Set correct category
        const categoryBtn = stepContent.querySelector(`.intent-toggle__btn--${category}`);
        if (categoryBtn) {
            categoryBtn.click();
        }
        
        // Select correct intent card
        const intentCard = stepContent.querySelector(`.option-card[data-intent="${intentType}"]`);
        if (intentCard) {
            intentCard.click();
            
            // Handle custom intent
            if (intentType === 'custom' && messageData.intent.customText) {
                customIntentInput.value = messageData.intent.customText;
                elements.buttons.intentNext.classList.remove('disabled');
            }
        }
    }
}

/**
 * Initialize tone step
 */
function initializeToneStep() {
    console.log('Initializing tone step...');
    
    // Get the tone step content container
    const stepContent = elements.steps.tone.querySelector('.step-body');
    if (!stepContent) {
        console.error('Tone step content container not found');
        return;
    }
    
    // Create context section HTML to show recipient and intent info
    const contextHTML = `
        <div class="context-section">
            <div class="recipient-info">
                <div class="recipient-avatar" id="context-recipient-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="recipient-details">
                    <h4 class="recipient-name" id="context-recipient-name">Loading recipient...</h4>
                    <div class="recipient-relationship" id="context-recipient-relationship">Preparing...</div>
                </div>
            </div>

            <div class="intent-info">
                <div class="intent-icon" id="context-intent-icon">
                    <i class="fas fa-question"></i>
                </div>
                <div class="intent-details">
                    <h4 class="intent-title" id="context-intent-title">Loading intention...</h4>
                    <div class="intent-description" id="context-intent-description">Preparing...</div>
                </div>
            </div>
        </div>
    `;
    
    // Create tone options HTML
    const toneOptionsHTML = `
        <div class="options-grid">
            <div class="option-card" data-tone="warm">
                <div class="option-icon">
                    <i class="fas fa-sun"></i>
                </div>
                <h3 class="option-title">Warm</h3>
                <p class="option-description">Friendly, gentle, and affectionate words that convey closeness.</p>
            </div>
            
            <div class="option-card" data-tone="professional">
                <div class="option-icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <h3 class="option-title">Professional</h3>
                <p class="option-description">Polished, respectful language suitable for work relationships.</p>
            </div>
            
            <div class="option-card" data-tone="casual">
                <div class="option-icon">
                    <i class="fas fa-coffee"></i>
                </div>
                <h3 class="option-title">Casual</h3>
                <p class="option-description">Relaxed, conversational language as if chatting in person.</p>
            </div>
            
            <div class="option-card" data-tone="formal">
                <div class="option-icon">
                    <i class="fas fa-pen-fancy"></i>
                </div>
                <h3 class="option-title">Formal</h3>
                <p class="option-description">Proper, structured language for important or ceremonial occasions.</p>
            </div>
            
            <div class="option-card" data-tone="humorous">
                <div class="option-icon">
                    <i class="fas fa-laugh"></i>
                </div>
                <h3 class="option-title">Humorous</h3>
                <p class="option-description">Light-hearted and playful with elements of gentle humor.</p>
            </div>
            
            <div class="option-card" data-tone="sincere">
                <div class="option-icon">
                    <i class="fas fa-heart"></i>
                </div>
                <h3 class="option-title">Sincere</h3>
                <p class="option-description">Earnest, heartfelt language that expresses genuine emotion.</p>
            </div>
            
            <div class="option-card" data-tone="custom">
                <div class="option-icon">
                    <i class="fas fa-edit"></i>
                </div>
                <h3 class="option-title">Custom</h3>
                <p class="option-description">Create your own specific tone for this message.</p>
            </div>
        </div>
        
        <div id="customToneSection" class="custom-tone-section" style="display: none;">
            <div class="form-group">
                <label for="customToneInput">Describe your custom tone:</label>
                <input type="text" id="customToneInput" class="input-field" placeholder="E.g., Optimistic, Contemplative...">
            </div>
        </div>
    `;
    
    // Combine context and tone options
    stepContent.innerHTML = contextHTML + toneOptionsHTML;
    
    // Update context with recipient and intent info
    updateToneContext();
    
    // Initialize tone selection
    const toneCards = stepContent.querySelectorAll('.option-card');
    const customToneSection = stepContent.querySelector('#customToneSection');
    const customToneInput = stepContent.querySelector('#customToneInput');
    
    // Handle tone card selection
    toneCards.forEach(card => {
        card.addEventListener('click', function() {
            // Deselect all cards
            toneCards.forEach(c => c.classList.remove('selected'));
            
            // Select clicked card
            this.classList.add('selected');
            
            // Get tone data
            const toneType = this.getAttribute('data-tone');
            const titleElement = this.querySelector('.option-title');
            const descriptionElement = this.querySelector('.option-description');
            const iconElement = this.querySelector('.option-icon i');
            
            const name = titleElement ? titleElement.textContent : '';
            const description = descriptionElement ? descriptionElement.textContent : '';
            const iconClass = iconElement ? iconElement.className : '';
            
            // Handle custom tone
            if (toneType === 'custom') {
                customToneSection.style.display = 'block';
                customToneInput.focus();
                
                // Only enable next if custom text is entered
                elements.buttons.toneNext.classList.add('disabled');
                
                // Check if custom input already has a value (from previous selection)
                if (customToneInput.value.trim()) {
                    elements.buttons.toneNext.classList.remove('disabled');
                    
                    // Update message data
                    messageData.tone = {
                        type: 'custom',
                        name: customToneInput.value.trim(),
                        description: 'Custom tone',
                        icon: iconClass,
                        customText: customToneInput.value.trim()
                    };
                    
                    // Update preview
                    updatePreview();
                }
            } else {
                // Hide custom tone section
                customToneSection.style.display = 'none';
                
                // Enable next button
                elements.buttons.toneNext.classList.remove('disabled');
                
                // Update message data
                messageData.tone = {
                    type: toneType,
                    name: name,
                    description: description,
                    icon: iconClass
                };
                
                // Update preview
                updatePreview();
            }
        });
    });
    
    // Add a SINGLE event listener for the custom tone input
    // This prevents the issue of adding multiple listeners when clicking the custom tone card repeatedly
    if (customToneInput) {
        customToneInput.addEventListener('input', function() {
            const customText = this.value.trim();
            
            if (customText) {
                elements.buttons.toneNext.classList.remove('disabled');
                
                // Update message data
                messageData.tone = {
                    type: 'custom',
                    name: customText,
                    description: 'Custom tone',
                    icon: document.querySelector('.option-card[data-tone="custom"] .option-icon i')?.className || 'fas fa-edit',
                    customText: customText
                };
                
                // Update preview
                updatePreview();
            } else {
                elements.buttons.toneNext.classList.add('disabled');
                messageData.tone = null;
            }
        });
    }
    
    // Load previous tone data if available
    if (messageData.tone) {
        const toneType = messageData.tone.type;
        
        // Select correct tone card
        const toneCard = stepContent.querySelector(`.option-card[data-tone="${toneType}"]`);
        if (toneCard) {
            toneCard.click();
            
            // Handle custom tone
            if (toneType === 'custom' && messageData.tone.customText) {
                customToneInput.value = messageData.tone.customText;
                elements.buttons.toneNext.classList.remove('disabled');
            }
        }
    }
}

/**
 * Update context section in tone step with recipient and intent info
 */
function updateToneContext() {
    // Get context elements
    const recipientName = document.getElementById('context-recipient-name');
    const recipientRelationship = document.getElementById('context-recipient-relationship');
    const recipientAvatar = document.getElementById('context-recipient-avatar');
    const intentTitle = document.getElementById('context-intent-title');
    const intentDescription = document.getElementById('context-intent-description');
    const intentIcon = document.getElementById('context-intent-icon');
    
    if (!recipientName || !intentTitle) {
        return;
    }
    
    // Update recipient info
    if (messageData.recipient) {
        recipientName.textContent = messageData.recipient.name;
        
        // Format relationship
        let relationshipText = messageData.recipient.relationship;
        if (messageData.recipient.relationship === 'other' && messageData.recipient.otherRelationship) {
            relationshipText = messageData.recipient.otherRelationship;
        } else {
            relationshipText = capitalizeFirstLetter(messageData.recipient.relationship);
        }
        
        recipientRelationship.textContent = relationshipText;
        
        // Update avatar
        recipientAvatar.innerHTML = `<i class="fas ${getRelationshipIcon(messageData.recipient.relationship)}"></i>`;
        
        // Remove loading class
        recipientName.parentElement.parentElement.classList.remove('loading');
    }
    
    // Update intent info
    if (messageData.intent) {
        intentTitle.textContent = messageData.intent.title;
        intentDescription.textContent = messageData.intent.description;
        
        // Extract icon class from the full class string
        let iconClass = 'fa-question';
        if (messageData.intent.icon) {
            const iconMatch = messageData.intent.icon.match(/fa-\w+/);
            if (iconMatch) {
                iconClass = iconMatch[0];
            }
        }
        
        intentIcon.innerHTML = `<i class="fas ${iconClass}"></i>`;
        
        // Remove loading class
        intentTitle.parentElement.parentElement.classList.remove('loading');
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
                        <p>Generating your heartfelt message...</p>
                    </div>
                    
                    <div class="message-text" id="message-text" style="display: none;">
                        <!-- Will be populated with the generated message -->
                    </div>
                    
                    <div class="message-error" id="message-error" style="display: none;">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>There was an error generating your message. Please try again.</p>
                        <button id="retry-generation" class="secondary-button">Retry</button>
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
            
            <!-- Message Insights -->
            <div class="insights-card" id="insights-card" style="display: none;">
                <div class="insights-header">
                    <h3>Emotional Insights</h3>
                </div>
                <div class="insights-content" id="insights-content">
                    <!-- Will be populated with insights -->
                </div>
            </div>
        </div>
    `;
    
    // Set up event listeners for buttons
    const copyBtn = document.getElementById('copy-message');
    const regenerateBtn = document.getElementById('regenerate-message');
    const editBtn = document.getElementById('edit-message');
    const saveBtn = document.getElementById('save-message');
    const retryBtn = document.getElementById('retry-generation');
    
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const messageText = document.getElementById('message-text');
            if (messageText && messageText.textContent) {
                navigator.clipboard.writeText(messageText.textContent)
                    .then(() => {
                        showAlert('Message copied to clipboard!', 'success');
                    })
                    .catch(err => {
                        console.error('Failed to copy message:', err);
                        showAlert('Failed to copy message. Please try again.', 'error');
                    });
            }
        });
    }
    
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to regenerate your message?')) {
                generateMessage();
            }
        });
    }
    
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            // Editing functionality will be implemented later
            showAlert('Message editing will be implemented in the next phase.', 'info');
        });
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            saveMessageToHistory();
            showAlert('Message saved to your history!', 'success');
        });
    }
    
    if (retryBtn) {
        retryBtn.addEventListener('click', function() {
            generateMessage();
        });
    }
    
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
 * @returns {Promise<void>}
 */
async function generateMessage() {
    // Show loading state
    const messageLoading = document.getElementById('message-loading');
    const messageText = document.getElementById('message-text');
    const messageError = document.getElementById('message-error');
    const insightsCard = document.getElementById('insights-card');
    
    if (messageLoading) messageLoading.style.display = 'flex';
    if (messageText) messageText.style.display = 'none';
    if (messageError) messageError.style.display = 'none';
    if (insightsCard) insightsCard.style.display = 'none';
    
    try {
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
        
        // Track the start of message generation in analytics
        if (firebase.analytics) {
            firebase.analytics().logEvent('message_generation_started', {
                intent_type: messageData.intent.type,
                tone_type: messageData.tone.type,
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
                has_insights: (result.insights && result.insights.length > 0),
                timestamp: new Date().toISOString()
            });
        }
        
    } catch (error) {
        console.error('Error generating message:', error);
        
        // Show error message
        if (messageLoading) messageLoading.style.display = 'none';
        if (messageText) messageText.style.display = 'none';
        if (messageError) {
            messageError.style.display = 'block';
            messageError.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>We couldn't generate your message. Please try again.</p>
                </div>
                <button id="retry-generation" class="primary-button">
                    <i class="fas fa-redo"></i> Try Again
                </button>
            `;
            
            // Add retry button functionality
            const retryButton = document.getElementById('retry-generation');
            if (retryButton) {
                retryButton.addEventListener('click', generateMessage);
            }
        }
        
        // Track error in analytics
        if (firebase.analytics) {
            firebase.analytics().logEvent('message_generation_error', {
                error_type: error.message.includes('NetworkError') ? 'network' : 
                            error.message.includes('401') ? 'authentication' : 'api',
                intent_type: messageData.intent.type,
                tone_type: messageData.tone.type,
                timestamp: new Date().toISOString()
            });
        }
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
 * Show the loading overlay
 */
function showLoading(message = 'Loading...') {
    if (elements.loading.overlay) {
        elements.loading.context.textContent = message;
        elements.loading.overlay.classList.add('active');
    }
}

/**
 * Hide the loading overlay
 */
function hideLoading() {
    if (elements.loading.overlay) {
        elements.loading.overlay.classList.remove('active');
    }
}

/**
 * Show an alert message with enhanced options
 * @param {string} message - The message to display
 * @param {string} type - The alert type (success, error, warning, info)
 * @param {string} action - The action button type (close, retry, etc.)
 * @param {Function} retryFn - Function to call when retry button is clicked
 */
function showAlert(message, type = 'info', action = 'close', retryFn = null) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    
    // Create content container
    const alertContent = document.createElement('div');
    alertContent.className = 'alert-content';
    
    // Add icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    // Add icon and message
    const alertMessage = document.createElement('div');
    alertMessage.className = 'alert-message';
    alertMessage.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
    
    // Add close button
    const alertClose = document.createElement('button');
    alertClose.className = 'alert-close';
    alertClose.innerHTML = '<i class="fas fa-times"></i>';
    alertClose.addEventListener('click', () => {
        alert.classList.remove('show');
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 300);
    });
    
    // Add retry button if action is retry and retry function provided
    if (action === 'retry' && retryFn) {
        const retryButton = document.createElement('button');
        retryButton.className = 'alert-action';
        retryButton.innerHTML = '<i class="fas fa-redo"></i> Retry';
        retryButton.addEventListener('click', () => {
            alert.classList.remove('show');
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
                // Call the retry function
                retryFn();
            }, 300);
        });
        alertContent.appendChild(retryButton);
    }
    
    // Assemble alert
    alertContent.appendChild(alertMessage);
    alert.appendChild(alertContent);
    alert.appendChild(alertClose);
    
    // Add to container
    elements.alerts.container.appendChild(alert);
    
    // Force reflow to trigger transition
    alert.offsetHeight;
    alert.classList.add('show');
    
    // Auto-close after 5 seconds for non-error alerts
    if (type !== 'error') {
        setTimeout(() => {
            if (alert.parentNode) {
                alert.classList.remove('show');
                setTimeout(() => {
                    if (alert.parentNode) {
                        alert.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Track in analytics
    if (firebase.analytics) {
        firebase.analytics().logEvent('alert_shown', {
            type: type,
            action: action,
            has_retry: !!retryFn,
            timestamp: new Date().toISOString()
        });
    }
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
    if (!messageData.intent) {
        showAlert('Please select an intention for your message.', 'error');
        return false;
    }
    
    if (messageData.intent.type === 'custom' && !messageData.intent.customText) {
        showAlert('Please describe your custom intention.', 'error');
        return false;
    }
    
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
 * @returns {Promise<string>} The ID token
 */
async function getIdToken() {
    try {
        if (!firebase.auth().currentUser) {
            throw new Error('No authenticated user found');
        }
        // Force token refresh to ensure it's not expired
        return await firebase.auth().currentUser.getIdToken(true);
    } catch (error) {
        console.error('Error getting ID token:', error);
        showAlert('Authentication error. Please refresh and try again.', 'error');
        throw error;
    }
}

/**
 * Call the message generation API with authentication
 * @param {Object} data - The data to send to the API
 * @returns {Promise<Object>} - The API response
 */
async function callGenerateMessageAPI(data) {
    try {
        // Get authentication token
        const idToken = await getIdToken();
        
        // Call the API with proper authentication
        const response = await fetch('https://us-central1-heartglowai.cloudfunctions.net/generateMessage', {
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
            throw new Error(`API error (${response.status}): ${errorText}`);
        }
        
        // Parse and return the response
        return await response.json();
    } catch (error) {
        console.error('Message generation API call failed:', error);
        
        // Provide user-friendly error message based on error type
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            showAlert('Network error. Please check your connection and try again.', 'error');
        } else if (error.message.includes('401') || error.message.includes('403')) {
            showAlert('Authentication error. Please refresh and try again.', 'error');
        } else {
            showAlert('Failed to generate message. Please try again.', 'error');
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