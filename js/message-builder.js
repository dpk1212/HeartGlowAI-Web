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
 * Add connection card to the list
 */
function addConnectionCard(connection) {
    const connectionsList = elements.recipientStep.connectionsList;
    if (!connectionsList) return;
    
    const card = document.createElement('div');
    card.className = 'connection-card';
    card.setAttribute('data-id', connection.id);
    
    const relationship = connection.relationship === 'other' && connection.otherRelationship 
        ? connection.otherRelationship 
        : connection.relationship;
    
    card.innerHTML = `
        <div class="connection-avatar">
            <span>${getInitials(connection.name)}</span>
        </div>
        <div class="connection-name">${connection.name}</div>
        <div class="connection-relationship">${capitalizeFirstLetter(relationship)}</div>
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
    
    connectionsList.appendChild(card);
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
        ? connectionRef.doc(editingId).update(connectionData) 
        : connectionRef.add(connectionData);
    
    savePromise
        .then(result => {
            hideLoading();
            
            // Get the ID if this is a new connection
            const connectionId = editingId || (result?.id);
            
            // Close modal
            closeConnectionModal();
            
            // Reload connections
            loadUserConnections();
            
            // Show success message
            showAlert(`Connection ${editingId ? 'updated' : 'created'} successfully.`, 'success');
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
    // Update current step
    currentStep = stepId;
    
    // Hide all steps
    Object.values(elements.steps).forEach(stepElement => {
        stepElement.classList.remove('active');
    });
    
    // Show the selected step
    const stepElement = elements.steps[stepId];
    if (stepElement) {
        stepElement.classList.add('active');
    }
    
    // Update sidebar
    updateSidebar();
    
    // Special step initialization
    initializeCurrentStep();
}

/**
 * Initialize the current step content
 */
function initializeCurrentStep() {
    switch (currentStep) {
        case 'recipient':
            // Already loaded user connections
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
    }
}

/**
 * Initialize intent step
 */
function initializeIntentStep() {
    // Will implement with content from message-intent-new.js
    console.log('Initializing intent step');
    
    // TODO: Add content from message-intent-new.js
    
    // Temporarily disable next button until selection
    if (elements.buttons.intentNext) {
        elements.buttons.intentNext.classList.add('disabled');
    }
}

/**
 * Initialize tone step
 */
function initializeToneStep() {
    // Will implement with content from message-tone-new.js
    console.log('Initializing tone step');
    
    // TODO: Add content from message-tone-new.js
    
    // Temporarily disable next button until selection
    if (elements.buttons.toneNext) {
        elements.buttons.toneNext.classList.add('disabled');
    }
}

/**
 * Initialize result step
 */
function initializeResultStep() {
    // Will implement with content from message-result-new.js
    console.log('Initializing result step');
    
    // TODO: Add content from message-result-new.js
    
    // Show loading indicator
    showLoading('Generating your message...');
    
    // Simulate message generation
    setTimeout(() => {
        hideLoading();
        
        // Mock message
        messageData.result = {
            message: "This is a placeholder message. The actual message generation will use the Firebase Cloud Function API.",
            insights: ["Placeholder insight 1", "Placeholder insight 2"]
        };
        
        // Update preview
        updatePreview();
    }, 1500);
}

/**
 * Update the sidebar based on current step
 */
function updateSidebar() {
    // Update step indicators
    elements.sidebar.steps.forEach(stepElement => {
        const stepId = stepElement.getAttribute('data-step');
        
        // Remove all classes first
        stepElement.classList.remove('active', 'completed');
        
        // Add appropriate class
        if (stepId === currentStep) {
            stepElement.classList.add('active');
        } else if (isStepCompleted(stepId)) {
            stepElement.classList.add('completed');
        }
    });
}

/**
 * Check if a step is completed
 */
function isStepCompleted(stepId) {
    // Get the index of current step
    const stepKeys = Object.keys(STEPS);
    const currentIndex = stepKeys.indexOf(currentStep);
    const stepIndex = stepKeys.indexOf(stepId);
    
    // If step index is less than current, it's completed
    return stepIndex < currentIndex;
}

/**
 * Update preview panel with current data
 */
function updatePreview() {
    // Update recipient info
    if (messageData.recipient) {
        elements.preview.recipientName.textContent = messageData.recipient.name || 'Select a recipient';
        
        const relationship = messageData.recipient.relationship === 'other' && messageData.recipient.otherRelationship
            ? messageData.recipient.otherRelationship
            : messageData.recipient.relationship;
            
        elements.preview.recipientRelationship.textContent = capitalizeFirstLetter(relationship) || '';
        elements.preview.recipientInitial.textContent = getInitials(messageData.recipient.name || '?');
    }
    
    // Update intent
    if (messageData.intent) {
        elements.preview.intent.textContent = messageData.intent.type || '-';
    }
    
    // Update tone
    if (messageData.tone) {
        elements.preview.tone.textContent = messageData.tone.type || '-';
    }
    
    // Update message
    if (messageData.result && messageData.result.message) {
        elements.preview.messageText.textContent = messageData.result.message;
        elements.preview.messagePlaceholder.style.display = 'none';
        elements.preview.messageText.style.display = 'block';
    } else {
        elements.preview.messagePlaceholder.style.display = 'block';
        elements.preview.messageText.style.display = 'none';
    }
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
    try {
        if (firebase.analytics) {
            firebase.analytics().logEvent('unified_step_complete', {
                step: step,
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Analytics error:', error);
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
        showAlert('Please select an intention.', 'error');
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