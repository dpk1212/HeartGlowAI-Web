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
}

/**
 * Initialize Firebase
 */
function initializeFirebase() {
    // Firebase is already initialized in HTML, just configure analytics
    try {
        if (firebase.analytics) {
            // Log page load event with unified prefix
            firebase.analytics().logEvent('unified_flow_start', {
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Analytics error:', error);
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
 * Initialize preview panel
 */
function initializePreviewPanel() {
    // On mobile, add toggle button for preview panel
    if (window.innerWidth <= 768) {
        const previewToggle = document.createElement('button');
        previewToggle.className = 'preview-toggle';
        previewToggle.innerHTML = '<i class="fas fa-eye"></i> Preview';
        document.body.appendChild(previewToggle);
        
        previewToggle.addEventListener('click', function() {
            document.body.classList.toggle('preview-open');
        });
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
 * Navigate to the next step
 */
function goToNextStep(currentStepId) {
    const step = STEPS[currentStepId];
    
    // Validate current step if needed
    if (step.validate && !step.validate()) {
        return false;
    }
    
    // Save current step data
    saveStepData(currentStepId);
    
    // Go to next step if there is one
    if (step.next) {
        showStep(step.next);
        
        // Track step completion
        trackStepCompletion(currentStepId);
        
        return true;
    }
    
    return false;
}

/**
 * Navigate to the previous step
 */
function goToPreviousStep(currentStepId) {
    const step = STEPS[currentStepId];
    
    // Save current step data
    saveStepData(currentStepId);
    
    // Go to previous step if there is one
    if (step.previous) {
        showStep(step.previous);
        return true;
    }
    
    return false;
}

/**
 * Show a specific step
 */
function showStep(stepId) {
    // Validate step ID
    if (!STEPS[stepId]) {
        console.error('Invalid step ID:', stepId);
        return false;
    }
    
    // Check if we're already on this step
    if (currentStep === stepId) {
        return true;
    }
    
    // If going to a new step that's not the first, validate previous steps have data
    if (stepId !== 'recipient' && !validatePreviousSteps(stepId)) {
        showAlert('Please complete the previous steps first.', 'error');
        return false;
    }
    
    // Hide all steps
    Object.keys(elements.steps).forEach(step => {
        elements.steps[step].classList.remove('active');
    });
    
    // Show the requested step
    elements.steps[stepId].classList.add('active');
    
    // Update current step
    currentStep = stepId;
    
    // Update step progress in sidebar
    updateStepProgress();
    
    // Initialize the specific step content if needed
    initializeSteps();
    
    // Scroll to top of step
    elements.steps[stepId].scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    return true;
}

/**
 * Initialize individual steps based on current step
 */
function initializeSteps() {
    console.log('Initializing steps based on current step:', currentStep);
    
    switch (currentStep) {
        case 'recipient':
            initializeRecipientStep();
            break;
            
        case 'intent':
            initializeIntentStep();
            break;
            
        case 'tone':
            initializeToneStep();
            break;
            
        case 'result':
            initializeResultStep();
            break;
            
        default:
            console.error('Unknown step:', currentStep);
    }
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
                            icon: iconClass,
                            customText: customText
                        };
                        
                        // Update preview
                        updatePreview();
                    } else {
                        elements.buttons.intentNext.classList.add('disabled');
                        messageData.intent = null;
                    }
                });
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
                
                customToneInput.addEventListener('input', function() {
                    const customText = this.value.trim();
                    
                    if (customText) {
                        elements.buttons.toneNext.classList.remove('disabled');
                        
                        // Update message data
                        messageData.tone = {
                            type: 'custom',
                            name: customText,
                            description: 'Custom tone',
                            icon: iconClass,
                            customText: customText
                        };
                        
                        // Update preview
                        updatePreview();
                    } else {
                        elements.buttons.toneNext.classList.add('disabled');
                        messageData.tone = null;
                    }
                });
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
 * Generate a message based on the selected data
 */
function generateMessage() {
    // Show loading state
    const messageLoading = document.getElementById('message-loading');
    const messageText = document.getElementById('message-text');
    const messageError = document.getElementById('message-error');
    const insightsCard = document.getElementById('insights-card');
    
    if (messageLoading) messageLoading.style.display = 'flex';
    if (messageText) messageText.style.display = 'none';
    if (messageError) messageError.style.display = 'none';
    if (insightsCard) insightsCard.style.display = 'none';
    
    // In this implementation, we'll simulate the message generation
    // In a real implementation, you would call your API here
    
    setTimeout(() => {
        // Simulate message generation
        const message = `Dear ${messageData.recipient.name},\n\nI wanted to take a moment to express my heartfelt appreciation for all that you do. Your kindness, support, and presence in my life mean more to me than words can express.\n\nWith sincere gratitude,\n[Your Name]`;
        
        const insights = [
            "This message emphasizes genuine appreciation and gratitude",
            "The tone is warm and sincere, creating a connection",
            "Using 'heartfelt' adds emotional depth to your appreciation"
        ];
        
        // Store the results
        messageData.result = {
            message: message,
            insights: insights,
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('messageData', JSON.stringify(messageData));
        
        // Display the message
        showGeneratedMessage(message, insights);
        
        // Update preview
        updatePreview();
    }, 2000);
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
        // Try to load data from localStorage
        const recipientData = localStorage.getItem('recipientData');
        const intentData = localStorage.getItem('intentData');
        const toneData = localStorage.getItem('toneData');
        const resultData = localStorage.getItem('resultData');
        const savedStep = localStorage.getItem('currentStep');
        
        if (recipientData) {
            messageData.recipient = JSON.parse(recipientData);
        }
        
        if (intentData) {
            messageData.intent = JSON.parse(intentData);
        }
        
        if (toneData) {
            messageData.tone = JSON.parse(toneData);
        }
        
        if (resultData) {
            messageData.result = JSON.parse(resultData);
        }
        
        // Determine which step to show
        if (savedStep && Object.keys(STEPS).includes(savedStep)) {
            if (validatePreviousSteps(savedStep)) {
                currentStep = savedStep;
            }
        }
        
        // Update UI with loaded data
        updatePreview();
        showStep(currentStep);
        
        console.log('Loaded data from localStorage:', messageData);
    } catch (error) {
        console.error('Error loading data from localStorage:', error);
        
        // Offer reset option to user
        if (confirm('There was an error loading your previous progress. Would you like to start over?')) {
            resetAll();
            showStep('recipient');
        }
    }
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
 * Show an alert message
 */
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    
    const alertContent = document.createElement('div');
    alertContent.className = 'alert-content';
    
    const alertMessage = document.createElement('div');
    alertMessage.className = 'alert-message';
    alertMessage.textContent = message;
    
    const alertClose = document.createElement('button');
    alertClose.className = 'alert-close';
    alertClose.innerHTML = '&times;';
    alertClose.addEventListener('click', () => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    });
    
    alertContent.appendChild(alertMessage);
    alertContent.appendChild(alertClose);
    alert.appendChild(alertContent);
    
    elements.alerts.container.appendChild(alert);
    
    // Force reflow to trigger transition
    alert.offsetHeight;
    alert.classList.add('show');
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}

/**
 * Capitalize the first letter of a string
 */
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
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
 * Update preview panel with current data
 */
function updatePreview() {
    // Recipient preview update
    if (messageData.recipient) {
        elements.preview.recipientName.textContent = messageData.recipient.name;
        
        // Format relationship
        let relationshipText = messageData.recipient.relationship;
        if (messageData.recipient.relationship === 'other' && messageData.recipient.otherRelationship) {
            relationshipText = messageData.recipient.otherRelationship;
        } else {
            relationshipText = capitalizeFirstLetter(messageData.recipient.relationship);
        }
        
        elements.preview.recipientRelationship.textContent = relationshipText;
        elements.preview.recipientInitial.textContent = getInitials(messageData.recipient.name);
        
        // Show the actual content, hide placeholder
        elements.preview.messagePlaceholder.style.display = 'none';
    } else {
        elements.preview.recipientName.textContent = 'Select a recipient';
        elements.preview.recipientRelationship.textContent = '';
        elements.preview.recipientInitial.textContent = '?';
        
        // Show placeholder if we don't have data
        elements.preview.messagePlaceholder.style.display = 'block';
    }
    
    // Intent preview update
    if (messageData.intent) {
        elements.preview.intent.textContent = messageData.intent.title || messageData.intent.category;
    } else {
        elements.preview.intent.textContent = '-';
    }
    
    // Tone preview update
    if (messageData.tone) {
        elements.preview.tone.textContent = messageData.tone.name;
    } else {
        elements.preview.tone.textContent = '-';
    }
    
    // Message text preview
    if (messageData.result && messageData.result.message) {
        elements.preview.messageText.textContent = messageData.result.message;
        elements.preview.messageText.style.display = 'block';
    } else {
        elements.preview.messageText.style.display = 'none';
    }
    
    // Update sidebar progress indicators
    updateStepProgress();
} 