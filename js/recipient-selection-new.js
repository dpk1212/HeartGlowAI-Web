/**
 * Recipient Selection Page - HeartGlowAI
 * This handles selecting the recipient and relationship type for message creation
 */

// Global variables
let selectedRelationship = null;
let selectedIntent = null;
let userMenuOpen = false;
let savedRecipients = [];
let selectedSavedRecipient = null;

// Main initialization function - runs when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initPage);

/**
 * Initialize the page - main entry point
 */
function initPage() {
    console.log('Initializing recipient selection page...');
    
    // Load the selected intent from the previous page
    loadSelectedIntent();
    
    // Initialize UI elements and event listeners
    initUserMenu();
    initRelationshipSelection();
    initSavedRecipients();
    initNavigation();
    initFormValidation();
    
    // Check authentication state
    checkAuthState();
}

/**
 * Initialize the user menu dropdown
 */
function initUserMenu() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenuOpen = !userMenuOpen;
            userDropdown.style.display = userMenuOpen ? 'block' : 'none';
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            if (userMenuOpen) {
                userMenuOpen = false;
                userDropdown.style.display = 'none';
            }
        });
        
        // Prevent dropdown from closing when clicking inside
        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Setup logout functionality
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }
}

/**
 * Initialize the saved recipients section
 */
function initSavedRecipients() {
    const savedRecipientsSection = document.getElementById('savedRecipientsSection');
    
    if (!savedRecipientsSection) {
        console.error('Saved recipients section not found');
        return;
    }
    
    // Wait for authentication before loading recipients
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            loadSavedRecipients(user.uid);
        }
    });
}

/**
 * Load saved recipients from Firestore
 */
async function loadSavedRecipients(userId) {
    try {
        // Use connections collection instead of recipients
        const connectionsRef = firebase.firestore().collection('users').doc(userId).collection('connections');
        const snapshot = await connectionsRef.get();
        
        // Clear any previous loading state
        const savedRecipientsList = document.getElementById('savedRecipientsList');
        savedRecipientsList.innerHTML = '';
        
        if (snapshot.empty) {
            // No saved recipients found
            console.log('No saved connections found');
            document.getElementById('noSavedRecipients').style.display = 'block';
            document.getElementById('savedRecipientsList').style.display = 'none';
            return;
        }
        
        // Hide the no recipients message if showing
        document.getElementById('noSavedRecipients').style.display = 'none';
        document.getElementById('savedRecipientsList').style.display = 'grid';
        
        // Process saved recipients
        savedRecipients = [];
        snapshot.forEach(doc => {
            const recipient = {
                id: doc.id,
                ...doc.data()
            };
            savedRecipients.push(recipient);
            
            // Create and append recipient card
            const card = createRecipientCard(recipient);
            savedRecipientsList.appendChild(card);
        });
        
        console.log(`Loaded ${savedRecipients.length} saved connections`);
        
        // Add fade-in animation to cards
        const cards = document.querySelectorAll('.saved-recipient-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 50); // Stagger the animations
        });
        
    } catch (error) {
        console.error('Error loading saved connections:', error);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'connection-error';
        errorMessage.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>Failed to load your saved connections. <button id="retryConnectionsBtn" class="text-button">Try again</button></p>
        `;
        
        // Clear loading placeholders
        const savedRecipientsList = document.getElementById('savedRecipientsList');
        savedRecipientsList.innerHTML = '';
        savedRecipientsList.appendChild(errorMessage);
        
        // Add retry button functionality
        const retryBtn = document.getElementById('retryConnectionsBtn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                // Show loading state again
                savedRecipientsList.innerHTML = `
                    <div class="saved-recipient-card loading">
                        <div class="recipient-avatar"></div>
                        <div class="recipient-info">
                            <div class="skeleton-text skeleton-name"></div>
                            <div class="skeleton-text skeleton-relationship"></div>
                        </div>
                    </div>
                    <div class="saved-recipient-card loading">
                        <div class="recipient-avatar"></div>
                        <div class="recipient-info">
                            <div class="skeleton-text skeleton-name"></div>
                            <div class="skeleton-text skeleton-relationship"></div>
                        </div>
                    </div>
                `;
                
                // Try loading again
                const user = firebase.auth().currentUser;
                if (user) {
                    loadSavedRecipients(user.uid);
                }
            });
        }
    }
}

/**
 * Create a recipient card element
 */
function createRecipientCard(recipient) {
    const card = document.createElement('div');
    card.className = 'saved-recipient-card';
    card.dataset.recipientId = recipient.id;
    
    // Get relationship icon
    const relationshipIcon = getRelationshipIcon(recipient.relationship);
    
    // Create the avatar with the relationship icon instead of just a letter
    const avatar = document.createElement('div');
    avatar.className = 'recipient-avatar';
    avatar.innerHTML = `<i class="fas ${relationshipIcon}"></i>`;
    
    // Create the recipient info
    const info = document.createElement('div');
    info.className = 'recipient-info';
    
    const name = document.createElement('div');
    name.className = 'recipient-name';
    name.textContent = recipient.name;
    
    const relationship = document.createElement('div');
    relationship.className = 'recipient-relationship';
    
    // Format the relationship nicely (handle 'other' case)
    let relationshipText = recipient.relationship;
    if (recipient.relationship === 'other' && recipient.otherRelationship) {
        relationshipText = recipient.otherRelationship;
    } else {
        relationshipText = capitalizeFirstLetter(recipient.relationship);
    }
    
    relationship.textContent = relationshipText;
    
    // Assemble the card
    info.appendChild(name);
    info.appendChild(relationship);
    
    card.appendChild(avatar);
    card.appendChild(info);
    
    // Add click event to select this recipient
    card.addEventListener('click', () => selectSavedRecipient(recipient, card));
    
    return card;
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
 * Capitalize first letter of a string
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Handle selection of a saved recipient
 */
function selectSavedRecipient(recipient, cardElement) {
    // If there was a previously selected card, deselect it
    const previousSelection = document.querySelector('.saved-recipient-card.selected');
    if (previousSelection) {
        previousSelection.classList.remove('selected');
    }
    
    // If we're selecting the same recipient, deselect it
    if (selectedSavedRecipient && selectedSavedRecipient.id === recipient.id) {
        selectedSavedRecipient = null;
        clearRecipientForm();
        validateForm();
        return;
    }
    
    // Select new recipient
    selectedSavedRecipient = recipient;
    cardElement.classList.add('selected');
    
    // Fill the form with the selected recipient data
    document.getElementById('recipientName').value = recipient.name;
    
    // Select the appropriate relationship option
    const relationshipOptions = document.querySelectorAll('.relationship-option');
    relationshipOptions.forEach(option => {
        const relationshipType = option.getAttribute('data-relationship');
        if (relationshipType === recipient.relationship) {
            // Remove selected class from all types
            relationshipOptions.forEach(o => o.classList.remove('selected'));
            
            // Add selected class to this option
            option.classList.add('selected');
            selectedRelationship = relationshipType;
            
            // If it's "other", show the other input
            if (relationshipType === 'other' && recipient.otherRelationship) {
                const otherSection = document.getElementById('otherRelationshipSection');
                otherSection.style.display = 'block';
                // Add visible class for animation
                setTimeout(() => {
                    otherSection.classList.add('visible');
                }, 10);
                document.getElementById('otherRelationship').value = recipient.otherRelationship || '';
            } else {
                // Hide the other input field
                const otherSection = document.getElementById('otherRelationshipSection');
                otherSection.classList.remove('visible');
                setTimeout(() => {
                    otherSection.style.display = 'none';
                }, 300);
            }
        }
    });
    
    // Uncheck the save checkbox since this is already saved
    document.getElementById('saveRecipient').checked = false;
    
    // Validate form
    validateForm();
    
    // Scroll to form area
    setTimeout(() => {
        document.querySelector('.card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
}

/**
 * Clear the recipient form
 */
function clearRecipientForm() {
    document.getElementById('recipientName').value = '';
    
    // Deselect relationship options
    const relationshipOptions = document.querySelectorAll('.relationship-option');
    relationshipOptions.forEach(option => option.classList.remove('selected'));
    
    // Hide other relationship section and clear it
    const otherSection = document.getElementById('otherRelationshipSection');
    otherSection.classList.remove('visible');
    setTimeout(() => {
        otherSection.style.display = 'none';
        document.getElementById('otherRelationship').value = '';
    }, 300);
    
    // Reset selected relationship
    selectedRelationship = null;
    
    // Reset the save checkbox to checked (default)
    document.getElementById('saveRecipient').checked = true;
}

/**
 * Check authentication state and update UI accordingly
 */
function checkAuthState() {
    if (firebase.auth) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in
                updateUserInfo(user);
            } else {
                // User is not signed in, redirect to login page
                window.location.href = 'index.html';
            }
        });
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
 * Handle user logout
 */
function handleLogout() {
    showLoading('Signing out...');
    
    if (firebase.auth) {
                firebase.auth().signOut()
                    .then(() => {
                        window.location.href = 'index.html';
                    })
                    .catch((error) => {
                hideLoading();
                showAlert('Logout failed: ' + error.message, 'error');
                        console.error('Logout error:', error);
                    });
            } else {
                window.location.href = 'index.html';
            }
}

/**
 * Load the selected intent from previous page
 */
function loadSelectedIntent() {
    try {
        console.log('Attempting to load selectedIntent from localStorage');
        const storedIntent = localStorage.getItem('selectedIntent');
        console.log('Retrieved stored intent:', storedIntent);
        
        if (storedIntent) {
            selectedIntent = JSON.parse(storedIntent);
            console.log('Parsed selectedIntent:', selectedIntent);
            displayIntent(selectedIntent);
        } else {
            // Try to load from intentData as a fallback
            const intentData = localStorage.getItem('intentData');
            if (intentData) {
                try {
                    const parsedIntentData = JSON.parse(intentData);
                    // Create a simplified intent object
                    selectedIntent = {
                        title: parsedIntentData.type.charAt(0).toUpperCase() + parsedIntentData.type.slice(1),
                        description: getIntentDescription(parsedIntentData.type),
                        icon: getIntentIcon(parsedIntentData.type)
                    };
                    displayIntent(selectedIntent);
                    console.log('Created fallback intent from intentData:', selectedIntent);
                    return;
                } catch (e) {
                    console.error('Error parsing fallback intent data:', e);
                }
            }
            
            console.log('No intent found in localStorage, redirecting to intent selection');
            showAlert('No message intention found. Redirecting to select an intention.', 'info');
            setTimeout(() => {
                window.location.href = 'message-intent-new.html';
            }, 1500);
        }
    } catch (e) {
        console.error('Error loading intent data:', e);
        showAlert('Something went wrong. Please start over.', 'error');
    }
}

/**
 * Get a description for an intent type when missing
 */
function getIntentDescription(type) {
    const descriptions = {
        'appreciate': 'Express gratitude and thank someone for their support, kindness, or actions.',
        'apologize': 'Say sorry and express remorse for a mistake or misunderstanding.',
        'celebrate': 'Congratulate someone on their achievements or special occasions.',
        'reconnect': 'Reach out to someone you\'ve lost touch with and rebuild your connection.',
        'encourage': 'Motivate and support someone facing challenges or pursuing goals.',
        'custom': 'Craft a message with your own specific intention in mind.'
    };
    
    return descriptions[type] || 'Create a heartfelt message';
}

/**
 * Get an icon class for an intent type when missing
 */
function getIntentIcon(type) {
    const icons = {
        'appreciate': 'fa-heart',
        'apologize': 'fa-dove',
        'celebrate': 'fa-trophy',
        'reconnect': 'fa-handshake',
        'encourage': 'fa-star',
        'custom': 'fa-edit'
    };
    
    return icons[type] || 'fa-heart';
}

/**
 * Display the selected intent in the UI
 */
function displayIntent(intent) {
    const intentIcon = document.getElementById('intentIcon');
    const intentTitle = document.getElementById('intentTitle');
    const intentDescription = document.getElementById('intentDescription');
    
    if (intentIcon && intent.icon) {
        intentIcon.innerHTML = `<i class="fas ${intent.icon}"></i>`;
    }
    
    if (intentTitle && intent.title) {
        intentTitle.textContent = intent.title;
    }
    
    if (intentDescription && intent.description) {
        intentDescription.textContent = intent.description;
    }
}

/**
 * Initialize relationship type selection
 */
function initRelationshipSelection() {
    const relationshipOptions = document.querySelectorAll('.relationship-option');
    
    if (!relationshipOptions.length) {
        console.error('No relationship options found');
        return;
    }
    
    relationshipOptions.forEach(option => {
        option.addEventListener('click', function() {
            // If selecting from the form, clear any saved recipient selection
            if (selectedSavedRecipient) {
                selectedSavedRecipient = null;
                const previousSelection = document.querySelector('.saved-recipient-card.selected');
                if (previousSelection) {
                    previousSelection.classList.remove('selected');
                }
            }
            
            // Remove selected class from all types
            relationshipOptions.forEach(o => o.classList.remove('selected'));
            
            // Add selected class to clicked type
            this.classList.add('selected');
            
            // Save selected relation
            selectedRelationship = this.getAttribute('data-relationship');
            console.log(`Selected relationship: ${selectedRelationship}`);
            
            // Show "other" input field if "other" relationship is selected
            const otherSection = document.getElementById('otherRelationshipSection');
            if (otherSection) {
                if (selectedRelationship === 'other') {
                    otherSection.style.display = 'block';
                    // Add visible class for animation
                    setTimeout(() => {
                        otherSection.classList.add('visible');
                    }, 10);
                    // Focus the input field
                    setTimeout(() => {
                        document.getElementById('otherRelationship').focus();
                    }, 300);
                } else {
                    // Remove visible class first for animation
                    otherSection.classList.remove('visible');
                    // Then hide after animation completes
                    setTimeout(() => {
                        otherSection.style.display = 'none';
                        document.getElementById('otherRelationship').value = '';
                    }, 300);
                }
            }
            
            // Validate to enable/disable the Next button
            validateForm();
        });
    });
    
    // Add event listener for recipient name to clear saved selection
    const recipientNameInput = document.getElementById('recipientName');
    if (recipientNameInput) {
        recipientNameInput.addEventListener('input', function() {
            if (selectedSavedRecipient && this.value !== selectedSavedRecipient.name) {
                // User is changing the name, so clear saved selection
                selectedSavedRecipient = null;
                const previousSelection = document.querySelector('.saved-recipient-card.selected');
                if (previousSelection) {
                    previousSelection.classList.remove('selected');
                }
            }
            
            // Validate to enable/disable the Next button
            validateForm();
        });
    }
}

/**
 * Initialize form validation
 */
function initFormValidation() {
    // Add event listeners for input fields
    document.getElementById('recipientName').addEventListener('input', validateForm);
    document.getElementById('otherRelationship').addEventListener('input', validateForm);
    
    // Initial validation
    validateForm();
}

/**
 * Validate the form and enable/disable the Next button
 */
function validateForm() {
    const nextBtn = document.getElementById('nextBtn');
    const recipientNameInput = document.getElementById('recipientName');
    const otherRelationshipInput = document.getElementById('otherRelationship');
    const otherSection = document.getElementById('otherRelationshipSection');
    
    // Basic validation - name required
    let isValid = recipientNameInput.value.trim() !== '';
    
    // If using a relationship type, it must be selected
    if (isValid && !selectedSavedRecipient) {
        isValid = selectedRelationship !== null;
        
        // If 'other' is selected, the other field must be filled
        if (isValid && selectedRelationship === 'other' && otherSection.style.display !== 'none') {
            isValid = otherRelationshipInput.value.trim() !== '';
        }
    }
    
    // Enable/disable next button
    if (nextBtn) {
        nextBtn.disabled = !isValid;
    }
}

/**
 * Initialize navigation buttons
 */
function initNavigation() {
    const backBtn = document.getElementById('backBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'message-intent-new.html';
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            saveDataAndNavigate();
        });
    }
}

/**
 * Save recipient data and navigate to next page
 */
async function saveDataAndNavigate() {
    showLoading('Saving your selection...');
    
    try {
        // Get the name and relationship data
        let name, relationship, otherRelationship;
        
        if (selectedSavedRecipient) {
            // If a saved recipient is selected, use that data
            name = selectedSavedRecipient.name;
            relationship = selectedSavedRecipient.relationship;
            otherRelationship = selectedSavedRecipient.otherRelationship || '';
        } else {
            // Otherwise use the form data
            name = document.getElementById('recipientName').value.trim();
            relationship = selectedRelationship;
            
            // Get other relationship value if applicable
            if (relationship === 'other') {
                otherRelationship = document.getElementById('otherRelationship').value.trim();
            }
        }
        
        // Create recipient data object
        const recipientData = {
            name: name,
            relationship: relationship,
            otherRelationship: otherRelationship || ''
        };
        
        // Save to localStorage for next pages
        localStorage.setItem('recipientData', JSON.stringify(recipientData));
        
        // Check if user wants to save this recipient
        const saveRecipient = document.getElementById('saveRecipient').checked;
        
        // If checked and not already a saved recipient, save to Firestore
        if (saveRecipient && !selectedSavedRecipient) {
            const user = firebase.auth().currentUser;
            if (user) {
                await saveRecipientToFirestore(user.uid, name, relationship, otherRelationship);
            }
        }
        
        // Navigate to the tone selection page
        setTimeout(() => {
            // Get the current URL path and build the correct next URL
            const currentUrl = window.location.href;
            const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
            window.location.href = baseUrl + 'message-tone-new.html';
        }, 500);
    } catch (error) {
        console.error('Error saving recipient data:', error);
        hideLoading();
        showAlert('Failed to save recipient data. Please try again.', 'error');
    }
}

/**
 * Save a recipient to Firestore
 */
async function saveRecipientToFirestore(userId, name, relationship, otherRelationship) {
    try {
        // Reference to the connections collection for this user (not recipients)
        const connectionsRef = firebase.firestore().collection('users').doc(userId).collection('connections');
        
        // Check if this connection already exists to avoid duplicates
        const querySnapshot = await connectionsRef
            .where('name', '==', name)
            .where('relationship', '==', relationship)
            .limit(1)
            .get();
        
        if (!querySnapshot.empty) {
            console.log('Connection already exists, skipping save');
            return;
        }
        
        // Create connection object
        const connectionData = {
            name: name,
            relationship: relationship,
            created: firebase.firestore.FieldValue.serverTimestamp() // Match existing field name in rules
        };
        
        // Add otherRelationship if applicable
        if (relationship === 'other' && otherRelationship) {
            connectionData.otherRelationship = otherRelationship;
        }
        
        // Add to Firestore
        await connectionsRef.add(connectionData);
        console.log('Connection saved successfully');
        
        // Refresh the connections list
        loadSavedRecipients(userId);
        
    } catch (error) {
        console.error('Error saving connection to Firestore:', error);
        showAlert('Failed to save connection. Please try again later.', 'error');
        // Don't stop the flow if saving fails
    }
}

/**
 * Show loading overlay
 */
function showLoading(message = 'Loading...') {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingContext = document.getElementById('loadingContext');
    
    if (loadingContext) {
        loadingContext.textContent = message;
    }
    
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

/**
 * Show an alert message
 */
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    
    if (!alertContainer) return;
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    
    alertDiv.innerHTML = `
        <div class="alert-content">
            <div class="alert-message">${message}</div>
            <button class="alert-close">&times;</button>
        </div>
    `;
    
    alertContainer.appendChild(alertDiv);
    
    // Show the alert with animation
    setTimeout(() => {
        alertDiv.classList.add('show');
    }, 10);
    
    // Setup close button
    const closeButton = alertDiv.querySelector('.alert-close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            alertDiv.classList.remove('show');
            setTimeout(() => {
                alertDiv.remove();
            }, 300);
        });
    }
    
    // Auto-remove after 5 seconds for info and success
    if (type !== 'error') {
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.classList.remove('show');
                setTimeout(() => {
                    if (alertDiv.parentNode) {
                        alertDiv.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
} 