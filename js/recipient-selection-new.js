/**
 * Recipient Selection Page - HeartGlowAI
 * This handles selecting the recipient and relationship type for message creation
 */

// Global variables
let selectedRelationship = null;
let selectedIntent = null;
let userMenuOpen = false;

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
                otherSection.style.display = selectedRelationship === 'other' ? 'block' : 'none';
            }
            
            // Enable Next button if name is also completed
            validateForm();
        });
    });
}

/**
 * Initialize form validation
 */
function initFormValidation() {
    const recipientName = document.getElementById('recipientName');
    const otherRelationship = document.getElementById('otherRelationship');
    
    if (recipientName) {
        recipientName.addEventListener('input', validateForm);
    }
    
    if (otherRelationship) {
        otherRelationship.addEventListener('input', validateForm);
    }
}

/**
 * Validate the form
 */
function validateForm() {
    const nameInput = document.getElementById('recipientName');
    const nextBtn = document.getElementById('nextBtn');
    const otherRelationship = document.getElementById('otherRelationship');
    
    if (!nameInput || !nextBtn) {
        console.error('Required form elements not found');
        return false;
    }
    
    const name = nameInput.value.trim();
    let isValid = name.length > 0 && selectedRelationship;
    
    // If "other" relationship is selected, require the "other" field to be filled
    if (selectedRelationship === 'other' && otherRelationship) {
        isValid = isValid && otherRelationship.value.trim().length > 0;
    }
    
    // Enable/disable next button
    nextBtn.disabled = !isValid;
    
    return isValid;
}

/**
 * Initialize navigation buttons
 */
function initNavigation() {
    // Back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'message-intent-new.html';
        });
    }
    
    // Next button
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (validateForm()) {
                saveDataAndNavigate();
            } else {
                showAlert('Please complete all required fields.', 'error');
            }
        });
    }
}

/**
 * Save data and navigate to the next page
 */
async function saveDataAndNavigate() {
    try {
        showLoading('Saving your recipient information...');
        
        const nameInput = document.getElementById('recipientName');
        const name = nameInput.value.trim();
        
        // Get "other" relationship value if applicable
        let relationshipValue = selectedRelationship;
        if (selectedRelationship === 'other') {
            const otherRelationship = document.getElementById('otherRelationship');
            if (otherRelationship && otherRelationship.value.trim()) {
                relationshipValue = otherRelationship.value.trim();
            }
        }
        
        // Check if we should save the recipient
        const saveRecipient = document.getElementById('saveRecipient');
        const shouldSave = saveRecipient ? saveRecipient.checked : false;
        
        // Prepare recipient data for localStorage (for next page)
        const recipientData = {
            name: name,
            relationship: relationshipValue,
            saved: shouldSave
        };
        
        console.log('Saving recipient data:', recipientData);
        
        // Store in localStorage for next page - save as both formats for compatibility
        localStorage.setItem('selectedRecipient', JSON.stringify(recipientData));
        localStorage.setItem('recipientData', JSON.stringify(recipientData));
        
        // If user checked "save recipient", save to database
        if (shouldSave && firebase.auth && firebase.auth().currentUser) {
            try {
                const currentUser = firebase.auth().currentUser;
                await saveRecipientToFirestore(currentUser.uid, name, relationshipValue);
                console.log('Saved recipient to Firestore');
                } catch (error) {
                console.error('Error saving to Firestore:', error);
                // Continue with navigation despite Firestore error
            }
        }
        
        // Navigate to the next page after a short delay
        setTimeout(() => {
            window.location.href = 'message-tone-new.html';
        }, 800);
    } catch (error) {
        console.error('Error saving data:', error);
        hideLoading();
        showAlert('Could not save your data. Please try again.', 'error');
    }
}

/**
 * Save recipient to Firestore database
 */
async function saveRecipientToFirestore(userId, name, relationship) {
    try {
        if (!firebase.firestore) {
            console.error('Firestore not available');
            return;
        }
        
        const db = firebase.firestore();
        const connectionRef = db.collection('users').doc(userId).collection('connections');
        
        // Check if this connection already exists
        const querySnapshot = await connectionRef.where('name', '==', name).get();
        
        if (querySnapshot.empty) {
            // Create new connection
            await connectionRef.add({
                name: name,
                relationship: relationship,
                created: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('New connection saved to database');
        } else {
            // Update existing connection
            const docId = querySnapshot.docs[0].id;
            await connectionRef.doc(docId).update({
                relationship: relationship,
                updated: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Existing connection updated');
        }
    } catch (error) {
        console.error('Error saving to Firestore:', error);
        // We don't throw here to prevent blocking navigation
    }
}

/**
 * Show loading overlay with custom message
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
 * Show alert message
 * @param {string} message - The message to display
 * @param {string} type - The type of alert: 'info', 'error', or 'success'
 */
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    
    if (!alertContainer) return;
    
    const alertBox = document.createElement('div');
    alertBox.className = `alert alert-${type}`;
    alertBox.innerHTML = `
        <div class="alert-icon">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 
                         type === 'success' ? 'fa-check-circle' : 
                         'fa-info-circle'}"></i>
        </div>
        <div class="alert-content">${message}</div>
        <button class="alert-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add close functionality
    const closeBtn = alertBox.querySelector('.alert-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            alertBox.classList.add('alert-closing');
            setTimeout(() => {
                alertContainer.removeChild(alertBox);
            }, 300);
        });
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertBox.parentNode === alertContainer) {
            alertBox.classList.add('alert-closing');
            setTimeout(() => {
                if (alertBox.parentNode === alertContainer) {
                    alertContainer.removeChild(alertBox);
                }
            }, 300);
        }
    }, 5000);
    
    // Add to container
    alertContainer.appendChild(alertBox);
} 