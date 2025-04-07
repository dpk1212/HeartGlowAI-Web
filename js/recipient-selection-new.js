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
    // Log the recipient data being used to create the card
    console.log('Creating recipient card with data:', recipient);
    console.log('Connection ID for card:', recipient.id);
    
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
    
    // Log selected recipient data for debugging
    console.log('Selected recipient data:', recipient);
    console.log('Connection ID for selected recipient:', recipient.id);
    
    // Verify the ID is present and correctly stored in the selectedSavedRecipient
    console.log('Connection ID in selectedSavedRecipient:', selectedSavedRecipient.id);
    
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
    // Since recipient is now the first page, we don't need to load intent data
    // Hide the intent summary card since there's no intent yet
    const intentSummaryCard = document.querySelector('.intent-summary-card');
    if (intentSummaryCard) {
        intentSummaryCard.style.display = 'none';
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
        if (isValid && selectedRelationship === 'other' && otherSection.classList.contains('visible')) {
            isValid = otherRelationshipInput.value.trim() !== '';
        }
    }
    
    // Enable/disable next button
    if (nextBtn) {
        nextBtn.disabled = !isValid;
    }
    
    console.log('Form validation result:', {
        isValid,
        name: recipientNameInput.value.trim(),
        relationship: selectedRelationship,
        otherVisible: otherSection ? otherSection.classList.contains('visible') : false,
        otherValue: otherRelationshipInput ? otherRelationshipInput.value.trim() : ''
    });
    
    return isValid;
}

/**
 * Initialize navigation buttons
 */
function initNavigation() {
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', async () => {
            // Validate the form first
            if (!validateForm()) {
                showAlert('Please complete all required fields.', 'error');
                return;
            }
            
            // Save the recipient data and navigate to the intention page
            await saveDataAndNavigate();
        });
    }
    
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'home.html';
        });
    }
}

/**
 * Save data and navigate to the next page
 */
async function saveDataAndNavigate() {
    showLoading('Saving your selection...');
    
    try {
        // Get form values
        const name = document.getElementById('recipientName').value.trim();
        const otherRelationship = selectedRelationship === 'other' 
            ? document.getElementById('otherRelationship').value.trim()
            : '';
        
        // Retrieve message configurator data from sessionStorage
        const messageCategory = sessionStorage.getItem('messageCategory');
        const messageFormat = sessionStorage.getItem('messageFormat');
        const messageIntention = sessionStorage.getItem('messageIntention');
        const messageConfigTimestamp = sessionStorage.getItem('messageConfigTimestamp');
        
        console.log('Message configurator data from sessionStorage:');
        console.log('- messageCategory:', messageCategory);
        console.log('- messageFormat:', messageFormat);
        console.log('- messageIntention:', messageIntention);
        console.log('- messageConfigTimestamp:', messageConfigTimestamp);
        
        // Create recipient data object
        const recipientData = {
            name: name,
            relationship: selectedRelationship,
            otherRelationship: otherRelationship,
            // Add message configurator data from sessionStorage
            messageCategory: messageCategory,
            messageFormat: messageFormat,
            messageIntention: messageIntention,
            messageConfigTimestamp: messageConfigTimestamp
        };
        
        // For displaying in the UI
        const displayRelationship = selectedRelationship === 'other' 
            ? otherRelationship 
            : capitalizeFirstLetter(selectedRelationship);
        
        // Create a simplified recipient object for the message flow
        const selectedRecipient = {
            name: name,
            relationship: displayRelationship,
            initial: name.charAt(0).toUpperCase()
        };
        
        // Save both objects to localStorage for persistence
        localStorage.setItem('recipientData', JSON.stringify(recipientData));
        localStorage.setItem('selectedRecipient', JSON.stringify(selectedRecipient));
        
        // Preserve message configurator data in localStorage as well to ensure it's available across all pages
        if (messageCategory) localStorage.setItem('messageCategory', messageCategory);
        if (messageFormat) localStorage.setItem('messageFormat', messageFormat);
        if (messageIntention) localStorage.setItem('messageIntention', messageIntention);
        if (messageConfigTimestamp) localStorage.setItem('messageConfigTimestamp', messageConfigTimestamp);
        localStorage.setItem('messageConfigComplete', sessionStorage.getItem('messageConfigComplete') || 'true');
        
        // If save checkbox is checked, save to Firestore
        const saveCheckbox = document.getElementById('saveRecipient');
        if (saveCheckbox && saveCheckbox.checked) {
            const user = firebase.auth().currentUser;
            if (user) {
                try {
                    // Only save if this is a new recipient or if we're updating an existing one
                    await saveRecipientToFirestore(
                        user.uid, 
                        name, 
                        selectedRelationship, 
                        otherRelationship
                    );
                } catch (error) {
                    console.error('Error saving recipient to Firestore:', error);
                    // Continue with the flow even if saving to Firestore fails
                }
            }
        }
        
        // Navigate to the intention selection page
        setTimeout(() => {
            window.location.href = 'message-intent-new.html';
        }, 800);
    } catch (error) {
        console.error('Error in saveDataAndNavigate:', error);
        hideLoading();
        showAlert('Could not save your selection. Please try again.', 'error');
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
        
        // Create connection object with enhanced fields
        const connectionData = {
            name: name,
            relationship: relationship,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Add otherRelationship if applicable
        if (relationship === 'other' && otherRelationship) {
            connectionData.otherRelationship = otherRelationship;
        }
        
        console.log('Saving connection data:', connectionData);
        
        // Add to Firestore
        const docRef = await connectionsRef.add(connectionData);
        console.log('Connection saved successfully with ID:', docRef.id);
        
        // Show success message
        showAlert('Connection saved to your dashboard!', 'success');
        
        // Refresh the connections list
        loadSavedRecipients(userId);
        
        return docRef.id;
    } catch (error) {
        console.error('Error saving connection to Firestore:', error);
        showAlert('Failed to save connection. Please try again later.', 'error');
        // Don't stop the flow if saving fails
        return null;
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