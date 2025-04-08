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
    const connectionsList = elements.recipientStep.connectionsList;
    if (!connectionsList) return;
    
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
    
    // Add card to list
    connectionsList.appendChild(card);
    
    // Add animation class after a short delay (for animation)
    setTimeout(() => {
        card.classList.add('fade-in');
    }, 10);
    
    // Add click handler
    card.addEventListener('click', function(e) {
        // Ignore clicks on the edit button
        if (e.target.closest('.connection-edit')) {
            e.stopPropagation();
            editConnection(connection);
            return;
        }
        
        // Remove selected class from all cards
        document.querySelectorAll('.connection-card').forEach(c => c.classList.remove('selected'));
        
        // Add selected class to this card
        this.classList.add('selected');
        
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
        
        // Update preview
        updatePreview();
    });
    
    // Add edit button handler
    const editButton = card.querySelector('.connection-edit');
    if (editButton) {
        editButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card selection
            editConnection(connection);
        });
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
 * Initialize step content based on step ID
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
                initializeIntentStep();
            } catch (error) {
                console.error('Error initializing intent step:', error);
                showAlert('There was a problem setting up this step. Please try refreshing the page.', 'error');
            }
            break;
            
        case 'tone':
            // Initialize the tone selection step
            try {
                console.log('Initializing tone step');
                initializeToneStep();
            } catch (error) {
                console.error('Error initializing tone step:', error);
                showAlert('There was a problem setting up this step. Please try refreshing the page.', 'error');
            }
            break;
            
        case 'result':
            // Initialize the result step
            try {
                console.log('Initializing result step');
                initializeResultStep();
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

/**
 * Refresh connections list from Firestore
 * @param {boolean} forceReload - Whether to bypass cache and force reload
 * @returns {Promise} Promise that resolves when connections are loaded
 */
function refreshConnectionsList(forceReload = false) {
    // Check if user is authenticated
    if (!currentUser || !currentUser.uid) {
        console.log('Waiting for authentication before loading connections...');
        
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
            setTimeout(() => {
                clearInterval(authCheck);
                console.warn('Authentication timeout when waiting for connections');
                
                // Display authentication timeout in the UI
                if (connectionsList) {
                    connectionsList.innerHTML = '<div class="error-state"><p>Authentication timed out. Please refresh the page.</p></div>';
                }
                
                // Resolve with empty array instead of rejecting
                resolve([]);
            }, 10000);
        });
    }
    
    // User is already authenticated, load connections
    try {
        return loadUserConnections(forceReload);
    } catch (error) {
        console.error('Error in refreshConnectionsList:', error);
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
    const connectionsList = elements.recipientStep.connectionsList;
    if (!connectionsList) {
        console.error('Cannot display connections: Connection list element not found');
        return;
    }

    // Clear existing connections
    connectionsList.innerHTML = '';

    // Handle empty state
    if (!connections || connections.length === 0) {
        console.log('No connections found');
        connectionsList.innerHTML = '<div class="empty-state"><p>You don\'t have any connections yet. Create one to get started!</p></div>';
        return;
    }

    // Sort connections by name
    connections.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    // Add each connection as a card with staggered animation
    connections.forEach((connection, index) => {
        setTimeout(() => {
            addConnectionCard(connection);
        }, index * 50); // Stagger animation by 50ms per card
    });

    // Check if we have a selected connection
    if (messageData.recipient && messageData.recipient.id) {
        setTimeout(() => {
            const selectedCard = connectionsList.querySelector(`.connection-card[data-id="${messageData.recipient.id}"]`);
            if (selectedCard) {
                selectedCard.classList.add('selected');
                elements.buttons.recipientNext.classList.remove('disabled');
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