// Global variables
let currentUser = null;
let editingConnectionId = null; // Track if we're editing an existing connection

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Home page loaded, initializing...');
  
  // Debug logging function (defined in home.html)
  if (typeof debugLog === 'function') {
    debugLog('Home.js script loaded and executing');
  }
  
  // Check if Firebase is already initialized
  if (!firebase || !firebase.apps || !firebase.apps.length) {
    console.error("Firebase not initialized properly. Please refresh the page.");
    showAlert("Error initializing Firebase. Please refresh the page.", "error");
    if (typeof debugLog === 'function') {
      debugLog('Firebase initialization error detected');
      document.getElementById('debug-console').style.display = 'block';
    }
    return;
  }
  
  // Check authentication status on load
  try {
    console.log('Checking authentication status...');
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('User authenticated:', user.uid);
        currentUser = user;
        
        // Update the user name display if possible
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
          userNameElement.textContent = user.displayName || 'there';
        }
        
        // Set user initials in avatar
        const userInitialsElement = document.getElementById('userInitials');
        if (userInitialsElement) {
          const displayName = user.displayName || user.email || 'User';
          userInitialsElement.textContent = getInitials(displayName);
          
          // Add click handler for user menu
          userInitialsElement.addEventListener('click', function() {
            // You could show a dropdown menu here
            console.log('User avatar clicked');
            // Temporary alert
            showAlert(`Logged in as ${displayName}`, 'info');
          });
        }
        
        initializeHomePage();
      } else {
        console.log('No user logged in, redirecting to login page');
        window.location.href = 'login.html';
      }
    });
  } catch (error) {
    console.error('Error checking authentication:', error);
    showAlert('Error checking authentication. Please refresh the page.', 'error');
    if (typeof debugLog === 'function') {
      debugLog('Authentication error: ' + error.message);
      document.getElementById('debug-console').style.display = 'block';
    }
  }
});

// Initialize the home page functionality
function initializeHomePage() {
  console.log('Initializing home page functionality');
  if (typeof debugLog === 'function') {
    debugLog('Initializing home page functionality');
  }
  
  try {
    // Hide any static empty states on page load
    checkAndHideStaticEmptyStates();
    
    // Create the expanded connection modal to ensure it's always available
    createConnectionModal();
    
    // Initialize UI elements that don't depend on Firestore data
    initNavigationButtons();
    initializeQuickActions();
    initializeManageButtons();
    initializeConnectionModal();
    
    // Initialize add connection button
    const addConnectionBtn = document.getElementById('add-connection-btn');
    if (addConnectionBtn) {
      addConnectionBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Add connection button clicked');
        openConnectionModal();
      });
    } else {
      console.warn('Add connection button not found');
    }
    
    // Make sure all "Add New Connection" buttons work using event delegation
    document.addEventListener('click', function(e) {
      if (e.target && 
          (e.target.classList.contains('home-page__add-connection') || 
           e.target.closest('.home-page__add-connection') ||
           e.target.id === 'add-connection-btn' ||
           e.target.closest('#add-connection-btn'))) {
        console.log('Add connection button clicked via delegation');
        e.preventDefault();
        openConnectionModal();
      }
    });
    
    // Create message button
    const createMessageBtn = document.getElementById('create-message-btn');
    if (createMessageBtn) {
      createMessageBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Create message button clicked');
        window.location.href = 'message-intent-new.html';
      });
    } else {
      console.warn('Create message button not found');
    }
    
    // Initialize home page logo link
    const logoLink = document.querySelector('.home-page__logo');
    if (logoLink) {
      logoLink.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Logo clicked, reloading home page');
        window.location.href = 'home.html';
      });
    }
    
    // Initialize logout button if it exists
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        showLoading('Logging out...');
        firebase.auth().signOut()
          .then(() => {
            window.location.href = 'index.html';
          })
          .catch((error) => {
            console.error('Logout error:', error);
            hideLoading();
            showAlert(`Logout error: ${error.message}`, 'error');
          });
      });
    }
    
    // Set up the view all messages button
    const viewAllMessagesBtn = document.getElementById('view-all-messages');
    if (viewAllMessagesBtn) {
      viewAllMessagesBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('View all messages clicked');
        // Get a reference to the modal
        const allMessagesModal = document.getElementById('all-messages-modal');
        if (allMessagesModal) {
          // Show the modal
          allMessagesModal.style.display = 'block';
          
          // Check if we already loaded messages or need to load them
          if (allMessagesModal.querySelector('.all-messages-list').children.length === 0) {
            loadUserMessages(true); // Pass true to indicate we want to load for the modal
          }
        } else {
          console.warn('All messages modal not found');
          showAlert('Messages view is not available', 'error');
        }
      });
    }
    
    // Set up the manage connections button
    const manageConnectionsBtn = document.getElementById('manage-connections');
    if (manageConnectionsBtn) {
      manageConnectionsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Manage connections clicked');
        openConnectionsManagement();
      });
    }
    
    // Set up the manage reminders button
    const manageRemindersBtn = document.getElementById('manage-reminders');
    if (manageRemindersBtn) {
      manageRemindersBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Manage reminders clicked');
        // Display a not implemented message for now
        showAlert('Reminder management will be available soon', 'info');
      });
    }
    
    // Ensure all message buttons functionality works with event delegation
    document.addEventListener('click', function(e) {
      // Copy button
      if (e.target && (e.target.classList.contains('fa-copy') || e.target.closest('.home-page__message-button i.fa-copy'))) {
        const messageCard = e.target.closest('.home-page__message-card');
        if (messageCard) {
          const messageText = messageCard.querySelector('.home-page__message-text').textContent;
          navigator.clipboard.writeText(messageText.trim())
            .then(() => showAlert('Message copied to clipboard!', 'success'))
            .catch(() => showAlert('Could not copy message', 'error'));
        }
      }
      
      // Edit button
      if (e.target && (e.target.classList.contains('fa-edit') || e.target.closest('.home-page__message-button i.fa-edit'))) {
        const messageCard = e.target.closest('.home-page__message-card');
        if (messageCard && messageCard.dataset.messageId) {
          console.log('Edit message clicked for ID:', messageCard.dataset.messageId);
          // Navigate to message editor with this message ID
          window.location.href = `message-editor.html?messageId=${messageCard.dataset.messageId}`;
        }
      }
      
      // Share button
      if (e.target && (e.target.classList.contains('fa-share') || e.target.closest('.home-page__message-button i.fa-share'))) {
        const messageCard = e.target.closest('.home-page__message-card');
        if (messageCard) {
          const messageText = messageCard.querySelector('.home-page__message-text').textContent;
          // Try to use the Web Share API if available
          if (navigator.share) {
            navigator.share({
              title: 'A heartfelt message from HeartGlowAI',
              text: messageText.trim()
            })
            .then(() => console.log('Message shared successfully'))
            .catch((error) => console.log('Error sharing:', error));
          } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(messageText.trim())
              .then(() => showAlert('Message copied to clipboard for sharing!', 'success'))
              .catch(() => showAlert('Could not copy message', 'error'));
          }
        }
      }
      
      // Connection action buttons
      if (e.target && (e.target.classList.contains('fa-paper-plane') || e.target.closest('.home-page__connection-button i.fa-paper-plane'))) {
        const connectionEl = e.target.closest('.home-page__connection');
        if (connectionEl && connectionEl.dataset.connectionId) {
          console.log('Create message for connection ID:', connectionEl.dataset.connectionId);
          window.location.href = `message-intent-new.html?connectionId=${connectionEl.dataset.connectionId}`;
        }
      }
      
      if (e.target && (e.target.classList.contains('fa-edit') || e.target.closest('.home-page__connection-button i.fa-edit'))) {
        const connectionEl = e.target.closest('.home-page__connection');
        if (connectionEl && connectionEl.dataset.connectionId) {
          console.log('Edit connection ID:', connectionEl.dataset.connectionId);
          openConnectionModal(connectionEl.dataset.connectionId);
        }
      }
      
      if (e.target && (e.target.classList.contains('fa-trash') || e.target.closest('.home-page__connection-button i.fa-trash'))) {
        const connectionEl = e.target.closest('.home-page__connection');
        if (connectionEl && connectionEl.dataset.connectionId) {
          console.log('Delete connection ID:', connectionEl.dataset.connectionId);
          showDeleteConfirmation(connectionEl.dataset.connectionId);
        }
      }
    });
    
    // Close button functionality for all modals
    const closeModalButtons = document.querySelectorAll('.close-modal');
    closeModalButtons.forEach(button => {
      button.addEventListener('click', function() {
        const modal = button.closest('.modal');
        if (modal) {
          modal.style.display = 'none';
          // If this was the connection modal, reset it
          if (modal.id === 'connection-modal') {
            editingConnectionId = null;
            // Reset form if needed
            const form = modal.querySelector('form');
            if (form) form.reset();
          }
        }
      });
    });
    
    // Close modals when clicking outside the modal content
    window.addEventListener('click', function(event) {
      if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        
        // If this was the connection modal, reset it
        if (event.target.id === 'connection-modal') {
          editingConnectionId = null;
          // Reset form if needed
          const form = event.target.querySelector('form');
          if (form) form.reset();
        }
      }
    });
    
    // Try to load data from Firebase
    try {
      loadUserConnections();
    } catch (error) {
      console.error('Error loading connections:', error);
      showConnectionsError('Failed to initiate connection loading.');
    }
    
    try {
      loadUserMessages();
    } catch (error) {
      console.error('Error loading messages:', error);
      showMessagesError('Failed to initiate message loading.');
    }
    
    try {
      loadUserReminders();
    } catch (error) {
      console.error('Error loading reminders:', error);
      showRemindersError('Failed to initiate reminder loading.');
    }
    
    // Add event handlers to clean up any stale modals
    window.addEventListener('resize', checkAndCleanupModals);
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden) {
        // When tab becomes visible again, check for stale modals
        checkAndCleanupModals();
      }
    });
    
  } catch (error) {
    console.error('Critical Error in initializeHomePage:', error);
    // Show a general error if basic initialization fails
    showAlert('A critical error occurred initializing the page. Please refresh.', 'error');
  }
}

/**
 * Check for and clean up any stale modals that might be stuck open
 */
function checkAndCleanupModals() {
  console.log('Checking for stale modals...');
  
  // Check for stale delete confirmation dialog
  const deleteDialog = document.getElementById('delete-confirmation-dialog');
  if (deleteDialog) {
    console.log('Found stale delete dialog, cleaning up');
    try {
      deleteDialog.style.display = 'none';
      document.body.removeChild(deleteDialog);
    } catch (e) {
      // Ignore errors
    }
    editingConnectionId = null;
  }
  
  // Close any open connection modals
  closeConnectionModal();
}

// Check for static empty state elements in the HTML and hide them
function checkAndHideStaticEmptyStates() {
  if (!currentUser) return;
  
  const userUid = currentUser.uid;
  
  // Check if there are actual connections and messages in Firestore
  // This avoids showing "No connections yet" when there are actually connections
  
  // Check connections
  firebase.firestore()
    .collection('users')
    .doc(userUid)
    .collection('connections')
    .limit(1)
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        console.log('User has connections, hiding empty states');
        hideEmptyState('connections');
        
        // Also hide any container that has the text "No connections yet"
        const elementsToCheck = document.querySelectorAll('*');
        elementsToCheck.forEach(el => {
          if (el.textContent && el.textContent.includes('No connections yet')) {
            if (el.parentElement && 
               !el.closest('.connections-list') && 
               !el.closest('.messages-list')) {
              console.log('Hiding element with "No connections yet" text:', el);
              el.style.display = 'none';
            }
          }
        });
      }
    })
    .catch(error => console.error('Error checking for connections:', error));
  
  // Check messages
  firebase.firestore()
    .collection('users')
    .doc(userUid)
    .collection('messages')
    .limit(1)
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        console.log('User has messages, hiding empty states');
        hideEmptyState('messages');
        
        // Also hide any container that has the text "No messages yet"
        const elementsToCheck = document.querySelectorAll('*');
        elementsToCheck.forEach(el => {
          if (el.textContent && el.textContent.includes('No messages yet')) {
            if (el.parentElement && 
               !el.closest('.connections-list') && 
               !el.closest('.messages-list')) {
              console.log('Hiding element with "No messages yet" text:', el);
              el.style.display = 'none';
            }
          }
        });
      }
    })
    .catch(error => console.error('Error checking for messages:', error));
}

// Initialize navigation buttons
function initNavigationButtons() {
  // Dashboard button is already active
  
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
}

// Initialize quick action items
function initializeQuickActions() {
  const quickActionItems = document.querySelectorAll('.quick-actions-list .message-item');
  
  if (quickActionItems && quickActionItems.length > 0) {
    console.log('Found', quickActionItems.length, 'quick action items');
    quickActionItems.forEach((item, index) => {
      item.addEventListener('click', function() {
        // Handle different quick actions
        switch (index) {
          case 0: // Reconnect
            localStorage.setItem('selectedEmotion', 'reconnect');
            window.location.href = 'message-intent-new.html';
            break;
          case 1: // Express appreciation
            localStorage.setItem('selectedEmotion', 'appreciation');
            window.location.href = 'message-intent-new.html';
            break;
          case 2: // Make an apology
            localStorage.setItem('selectedEmotion', 'vulnerability');
            window.location.href = 'message-intent-new.html';
            break;
          case 3: // Create from scratch
            localStorage.setItem('selectedEmotion', 'explore');
            window.location.href = 'message-intent-new.html';
            break;
        }
      });
    });
  } else {
    console.warn('Quick action items not found');
  }
}

// Initialize manage buttons
function initializeManageButtons() {
  // Manage connections button
  const manageConnectionsBtn = document.getElementById('manage-connections-btn');
  if (manageConnectionsBtn) {
    manageConnectionsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Open the connections management view
      openConnectionsManagement();
    });
  }
  
  // Manage reminders button
  const manageRemindersBtn = document.getElementById('manage-reminders-btn');
  if (manageRemindersBtn) {
    manageRemindersBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // For now, just scroll to the section
      const remindersSection = document.querySelector('.dashboard-sidebar .dashboard-section');
      if (remindersSection) {
        remindersSection.scrollIntoView({ behavior: 'smooth' });
      }
      // In a full implementation, this might open a modal or navigate to a separate page
    });
  }
}

// Initialize connection modal functionality
function initializeConnectionModal() {
  const modal = document.getElementById('connection-modal');
  const form = document.getElementById('connection-form');
  const cancelBtn = modal?.querySelector('.form-cancel-btn');
  const closeBtn = modal?.querySelector('.close-modal');
  
  if (!modal || !form) {
    console.error('Connection modal or form not found');
    return;
  }
  
  // Handle relationship grid selection
  const relationshipOptions = document.querySelectorAll('.relationship-option');
  const relationshipInput = document.getElementById('connection-relationship');
  const otherRelationshipGroup = document.getElementById('other-relationship-group');
  
  relationshipOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove 'selected' class from all options
      relationshipOptions.forEach(opt => opt.classList.remove('selected'));
      
      // Add 'selected' class to clicked option
      this.classList.add('selected');
      
      // Get the relationship type from the data attribute
      const relationshipType = this.getAttribute('data-relationship');
      
      // Set the hidden input value
      if (relationshipInput) {
        relationshipInput.value = relationshipType;
      }
      
      // Show/hide the "other" relationship input field if needed
      if (otherRelationshipGroup) {
        otherRelationshipGroup.style.display = relationshipType === 'other' ? 'block' : 'none';
      }
    });
  });
  
  // Close the modal when clicking the close button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeConnectionModal);
  }
  
  // Close the modal when clicking the cancel button
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeConnectionModal);
  }
  
  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    saveConnection();
  });
}

// Open the connection modal
function openConnectionModal(connectionId = null) {
  console.log('Opening connection modal. Editing connection ID:', connectionId);
  
  let modal = document.getElementById('connection-modal');
  if (!modal) {
    // If we're not finding the modal, create it dynamically
    createConnectionModal();
    
    // Try to get the modal again
    modal = document.getElementById('connection-modal');
    if (!modal) {
      console.error('Could not find or create connection modal');
      return;
    }
  }
  
  // Set global editing state
  editingConnectionId = connectionId;
  
  // Update modal title
  const modalTitle = document.getElementById('modal-title');
  if (modalTitle) {
    modalTitle.textContent = connectionId ? 'Edit Connection' : 'Add New Connection';
  }
  
  // Get form elements
  const form = document.getElementById('connection-form');
  const nameField = document.getElementById('connection-name');
  const relationshipField = document.getElementById('connection-relationship');
  const specificRelationshipContainer = document.getElementById('specific-relationship-container');
  const specificRelationshipField = document.getElementById('connection-specific-relationship');
  const yearsField = document.getElementById('connection-years');
  const communicationStyleField = document.getElementById('connection-communication-style');
  const goalField = document.getElementById('connection-goal');
  const notesField = document.getElementById('connection-notes');
  
  // Reset form
  if (form) {
    form.reset();
    
    // Hide specific relationship container initially
    if (specificRelationshipContainer) {
      specificRelationshipContainer.style.display = 'none';
    }
  }
  
  // If editing an existing connection, fetch and populate data
  if (connectionId) {
    if (!currentUser) {
      showAlert('You must be logged in to edit connections', 'error');
      return;
    }
    
    // Show loading indicator
    showLoading('Loading connection details...');
    
    // Fetch connection data
    firebase.firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('connections')
      .doc(connectionId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          console.log('Loaded connection data:', data);
          
          // Populate basic fields
          if (nameField) nameField.value = data.name || '';
          if (relationshipField) relationshipField.value = data.relationship || '';
          
          // Handle specific relationship selection
          if (data.relationship && data.relationship !== 'other' && specificRelationshipContainer) {
            specificRelationshipContainer.style.display = 'block';
            
            // Trigger relationship change to populate the specific options
            updateSpecificRelationshipOptions();
            
            // Then set the specific relationship value
            setTimeout(() => {
              if (specificRelationshipField && data.specificRelationship) {
                specificRelationshipField.value = data.specificRelationship;
              }
            }, 100);  // Slight delay to ensure options are populated
          }
          
          // Populate additional fields
          if (yearsField) yearsField.value = data.yearsKnown || '';
          if (communicationStyleField) communicationStyleField.value = data.communicationStyle || '';
          if (goalField) goalField.value = data.relationshipGoal || '';
          if (notesField) notesField.value = data.notes || '';
          
          hideLoading();
        } else {
          console.error('Connection not found:', connectionId);
          showAlert('Connection not found', 'error');
          hideLoading();
          closeConnectionModal();
        }
      })
      .catch((error) => {
        console.error('Error fetching connection:', error);
        showAlert('Error loading connection details', 'error');
        hideLoading();
        closeConnectionModal();
      });
  }
  
  // Show the modal
  modal.style.display = 'block';
}

// Create the connection modal if it doesn't exist
function createConnectionModal() {
  // Only create if it doesn't already exist
  if (document.getElementById('connection-modal')) {
    return;
  }
  
  const modalHTML = `
    <div id="connection-modal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modal-title">Add New Person</h3>
          <button id="close-modal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form id="connection-form">
            <input type="hidden" id="connection-id">
            
            <!-- Basic Information Section -->
            <div class="field-group">
              <h4>Basic Information</h4>
              <div class="form-group">
                <label for="connection-name">Name*</label>
                <input type="text" id="connection-name" class="input-field" placeholder="Enter name" required>
              </div>
              
              <!-- Primary Relationship Type -->
              <div class="form-group">
                <label for="connection-relationship">Relationship Type*</label>
                <select id="connection-relationship" class="input-field" required>
                  <option value="">Select relationship type</option>
                  <option value="family">Family</option>
                  <option value="friend">Friend</option>
                  <option value="partner">Partner/Romantic</option>
                  <option value="colleague">Professional</option>
                  <option value="acquaintance">Acquaintance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <!-- Specific Relationship - dynamically shown based on primary type -->
              <div class="form-group" id="specific-relationship-container" style="display: none;">
                <label for="connection-specific-relationship">Specific Relationship</label>
                <select id="connection-specific-relationship" class="input-field">
                  <option value="">Select specific relationship</option>
                  <!-- Options will be dynamically populated based on primary relationship -->
                </select>
                <div class="field-help">Helps us create more personalized messages</div>
              </div>
              
              <div class="form-group">
                <label for="connection-years">Years Known</label>
                <input type="number" id="connection-years" class="input-field" min="0" max="100" placeholder="How many years have you known them?">
                <div class="field-help">Helps tailor messages to the depth of your relationship</div>
              </div>
            </div>
            
            <!-- Communication Preferences -->
            <div class="field-group">
              <h4>Communication Preferences</h4>
              <div class="form-group">
                <label for="connection-communication-style">Communication Style</label>
                <select id="connection-communication-style" class="input-field">
                  <option value="">Select style (optional)</option>
                  <option value="direct">Direct and straightforward</option>
                  <option value="warm">Warm and emotional</option>
                  <option value="formal">Formal and respectful</option>
                  <option value="casual">Casual and relaxed</option>
                  <option value="humorous">Humorous and playful</option>
                </select>
                <div class="field-help">Helps us match the tone of messages to their preferences</div>
              </div>
              
              <!-- Relationship Goal Field -->
              <div class="form-group">
                <label for="connection-goal">Relationship Focus</label>
                <select id="connection-goal" class="input-field">
                  <option value="">Select focus (optional)</option>
                  <option value="maintain">Maintain current connection</option>
                  <option value="strengthen">Strengthen the relationship</option>
                  <option value="reconnect">Reconnect after distance</option>
                  <option value="deepen">Deepen emotional connection</option>
                  <option value="support">Support through tough times</option>
                  <option value="celebrate">Celebrate achievements</option>
                  <option value="professional">Develop professional relationship</option>
                </select>
                <div class="field-help">Helps us craft messages that serve your relationship goals</div>
              </div>
            </div>
            
            <!-- Additional Notes -->
            <div class="field-group" style="border-bottom: none; margin-bottom: 10px;">
              <h4>Additional Notes</h4>
              <div class="form-group">
                <label for="connection-notes">Personal Notes</label>
                <textarea id="connection-notes" rows="3" placeholder="Any personal details or conversation topics they enjoy"></textarea>
                <div class="field-help">Add memorable moments, important life events, or topics they love discussing</div>
              </div>
            </div>
            
            <div class="modal-actions">
              <button type="button" id="cancel-connection" class="btn-secondary">Cancel</button>
              <button type="submit" class="btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  
  // Append to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Initialize event listeners
  const modal = document.getElementById('connection-modal');
  const form = document.getElementById('connection-form');
  const cancelBtn = document.getElementById('cancel-connection');
  const closeBtn = document.getElementById('close-modal');
  
  // Close modal when clicking X button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeConnectionModal);
  }
  
  // Close modal when clicking cancel button
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeConnectionModal);
  }
  
  // Close modal when clicking outside of it
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeConnectionModal();
      }
    });
  }
  
  // Set up relationship type change handler
  const relationshipTypeSelect = document.getElementById('connection-relationship');
  if (relationshipTypeSelect) {
    relationshipTypeSelect.addEventListener('change', updateSpecificRelationshipOptions);
  }
  
  // Handle form submission
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      saveConnection();
    });
  }
  
  console.log('Connection modal created and initialized');
}

// Update specific relationship options based on primary relationship type
function updateSpecificRelationshipOptions() {
  const primaryType = document.getElementById('connection-relationship').value;
  const specificContainer = document.getElementById('specific-relationship-container');
  const specificSelect = document.getElementById('connection-specific-relationship');
  
  if (!specificContainer || !specificSelect) {
    console.error('Specific relationship elements not found');
    return;
  }
  
  // Clear existing options except the first one
  while (specificSelect.options.length > 1) {
    specificSelect.remove(1);
  }
  
  // Show/hide and populate based on primary type
  if (primaryType && primaryType !== 'other') {
    specificContainer.style.display = 'block';
    
    const relationshipOptions = {
      family: [
        { value: 'parent', text: 'Parent' },
        { value: 'child', text: 'Child' },
        { value: 'sibling', text: 'Sibling' },
        { value: 'grandparent', text: 'Grandparent' },
        { value: 'grandchild', text: 'Grandchild' },
        { value: 'aunt-uncle', text: 'Aunt/Uncle' },
        { value: 'niece-nephew', text: 'Niece/Nephew' },
        { value: 'cousin', text: 'Cousin' },
        { value: 'in-law', text: 'In-law' },
        { value: 'step-family', text: 'Step-family' }
      ],
      friend: [
        { value: 'best-friend', text: 'Best friend' },
        { value: 'close-friend', text: 'Close friend' },
        { value: 'childhood-friend', text: 'Childhood friend' },
        { value: 'school-friend', text: 'School friend' },
        { value: 'college-friend', text: 'College friend' },
        { value: 'activity-friend', text: 'Activity/hobby friend' },
        { value: 'online-friend', text: 'Online friend' },
        { value: 'neighbor', text: 'Neighbor' },
        { value: 'new-friend', text: 'New friend' }
      ],
      partner: [
        { value: 'spouse', text: 'Spouse' },
        { value: 'fiance', text: 'Fiancé/Fiancée' },
        { value: 'significant-other', text: 'Significant other' },
        { value: 'boyfriend-girlfriend', text: 'Boyfriend/Girlfriend' },
        { value: 'dating', text: 'Dating' },
        { value: 'ex-partner', text: 'Ex-partner (on good terms)' }
      ],
      colleague: [
        { value: 'manager', text: 'Manager/Supervisor' },
        { value: 'direct-report', text: 'Direct report' },
        { value: 'team-member', text: 'Team member' },
        { value: 'department-colleague', text: 'Department colleague' },
        { value: 'cross-functional', text: 'Cross-functional colleague' },
        { value: 'client', text: 'Client' },
        { value: 'vendor', text: 'Vendor/Supplier' },
        { value: 'mentor', text: 'Mentor' },
        { value: 'mentee', text: 'Mentee' },
        { value: 'business-partner', text: 'Business partner' }
      ],
      acquaintance: [
        { value: 'social-acquaintance', text: 'Social acquaintance' },
        { value: 'friend-of-friend', text: 'Friend of a friend' },
        { value: 'occasional-contact', text: 'Occasional contact' },
        { value: 'service-provider', text: 'Service provider' },
        { value: 'community-member', text: 'Community member' },
        { value: 'alumni-connection', text: 'Alumni connection' },
        { value: 'social-media', text: 'Social media connection' }
      ]
    };
    
    // Add options for the selected relationship type
    if (relationshipOptions[primaryType]) {
      relationshipOptions[primaryType].forEach(option => {
        const newOption = document.createElement('option');
        newOption.value = option.value;
        newOption.textContent = option.text;
        specificSelect.appendChild(newOption);
      });
    }
  } else {
    specificContainer.style.display = 'none';
  }
}

// Save connection to Firestore
function saveConnection() {
  if (!currentUser) {
    showAlert('You must be logged in to save connections', 'error');
    return;
  }
  
  // Get form values
  const nameField = document.getElementById('connection-name');
  const relationshipField = document.getElementById('connection-relationship');
  const specificRelationshipField = document.getElementById('connection-specific-relationship');
  const yearsField = document.getElementById('connection-years');
  const communicationStyleField = document.getElementById('connection-communication-style');
  const goalField = document.getElementById('connection-goal');
  const notesField = document.getElementById('connection-notes');
  
  if (!nameField || !relationshipField) {
    console.error('Form fields not found');
    return;
  }
  
  const name = nameField.value.trim();
  const relationship = relationshipField.value;
  
  // Validate form
  if (!name) {
    showAlert('Please enter a name', 'error');
    nameField.focus();
    return;
  }
  
  if (!relationship) {
    showAlert('Please select a relationship type', 'error');
    return;
  }
  
  // Prepare data to save
  const connectionData = {
    name,
    relationship,
    updatedAt: new Date()
  };
  
  // Add specific relationship if selected
  if (specificRelationshipField && specificRelationshipField.value) {
    connectionData.specificRelationship = specificRelationshipField.value;
  }
  
  // Add years known if provided
  if (yearsField && yearsField.value) {
    connectionData.yearsKnown = parseInt(yearsField.value);
  }
  
  // Add communication style if selected
  if (communicationStyleField && communicationStyleField.value) {
    connectionData.communicationStyle = communicationStyleField.value;
  }
  
  // Add relationship goal/focus if selected
  if (goalField && goalField.value) {
    connectionData.relationshipGoal = goalField.value;
  }
  
  // Add notes if provided
  if (notesField && notesField.value.trim()) {
    connectionData.notes = notesField.value.trim();
  }
  
  // If creating a new connection, add creation date
  if (!editingConnectionId) {
    connectionData.createdAt = new Date();
  }
  
  // Show loading
  showLoading(editingConnectionId ? 'Updating connection...' : 'Creating connection...');
  
  // Save to Firestore
  const connectionsRef = firebase.firestore()
    .collection('users')
    .doc(currentUser.uid)
    .collection('connections');
  
  const savePromise = editingConnectionId
    ? connectionsRef.doc(editingConnectionId).update(connectionData)
    : connectionsRef.add(connectionData);
  
  savePromise
    .then(() => {
      // Success
      showAlert(
        editingConnectionId ? 'Connection updated successfully' : 'Connection created successfully',
        'success'
      );
      
      // Close modal
      closeConnectionModal();
      
      // Reload connections
      loadUserConnections();
      
      // Also refresh all connections modal if it's open
      const allConnectionsModal = document.getElementById('all-connections-modal');
      if (allConnectionsModal && allConnectionsModal.style.display === 'block') {
        loadAllConnections();
      }
      
      hideLoading();
    })
    .catch(error => {
      console.error('Error saving connection:', error);
      showAlert('Error saving connection', 'error');
      hideLoading();
    });
}

// Show delete confirmation before deleting a connection
function showDeleteConfirmation() {
  if (!editingConnectionId) {
    console.error('No connection ID to delete');
    return;
  }
  
  // Create confirmation dialog
  let confirmDialog = document.getElementById('delete-confirmation-dialog');
  
  if (!confirmDialog) {
    // Create dialog if it doesn't exist
    confirmDialog = document.createElement('div');
    confirmDialog.id = 'delete-confirmation-dialog';
    confirmDialog.className = 'modal modal-visible';
    confirmDialog.innerHTML = `
      <div class="modal-content" style="max-width: 400px;">
        <div class="modal-header">
          <h3>Delete Connection</h3>
          <button class="modal-close" id="close-delete-dialog">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this connection? This action cannot be undone.</p>
          <div class="modal-actions" style="margin-top: 20px;">
            <button class="btn-secondary" id="cancel-delete">Cancel</button>
            <button class="btn-danger" id="confirm-delete">Delete</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(confirmDialog);
    
    // Add event listeners
    const closeBtn = document.getElementById('close-delete-dialog');
    const cancelBtn = document.getElementById('cancel-delete');
    const confirmBtn = document.getElementById('confirm-delete');
    
    if (closeBtn) closeBtn.addEventListener('click', closeDeleteDialog);
    if (cancelBtn) cancelBtn.addEventListener('click', closeDeleteDialog);
    if (confirmBtn) confirmBtn.addEventListener('click', performDeleteConnection);
    
    confirmDialog.addEventListener('click', function(e) {
      if (e.target === confirmDialog) closeDeleteDialog();
    });
  }
  
  // Show dialog with CSS transitions
  confirmDialog.style.display = 'flex';
  setTimeout(() => {
    confirmDialog.style.opacity = '1';
    document.querySelector('#delete-confirmation-dialog .modal-content').style.transform = 'translateY(0)';
  }, 10);
}

// Close delete confirmation dialog
function closeDeleteDialog() {
  const dialog = document.getElementById('delete-confirmation-dialog');
  if (dialog) {
    dialog.style.opacity = '0';
    
    const modalContent = document.querySelector('#delete-confirmation-dialog .modal-content');
    if (modalContent) {
      modalContent.style.transform = 'translateY(-20px)';
    }
    
    setTimeout(() => {
      dialog.style.display = 'none';
      
      // Make sure we fully remove the dialog from the DOM to prevent stale state
      try {
        document.body.removeChild(dialog);
      } catch (err) {
        // Element might already be removed, ignore
      }
    }, 300);
  }
  
  // Also try closing any stale connection modals
  closeConnectionModal();
  
  // Reset the editing state
  editingConnectionId = null;
}

// Actually perform the delete operation
function performDeleteConnection() {
  if (!currentUser || !editingConnectionId) {
    showAlert('Cannot delete connection', 'error');
    closeDeleteDialog();
    return;
  }
  
  // Show loading state
  showLoading('Deleting connection...');
  
  // Track deletion state
  const connectionIdToDelete = editingConnectionId;
  
  firebase.firestore()
    .collection('users')
    .doc(currentUser.uid)
    .collection('connections')
    .doc(connectionIdToDelete)
    .delete()
    .then(() => {
      hideLoading();
      showAlert('Connection deleted successfully', 'success');
      
      // Make sure to clear the editing connection ID
      editingConnectionId = null;
      
      // Close all modals
      closeDeleteDialog();
      closeConnectionModal();
      
      // Refresh the connections list
      loadUserConnections();
    })
    .catch((error) => {
      hideLoading();
      console.error('Error deleting connection:', error);
      showAlert(`Error deleting connection: ${error.message}`, 'error');
      
      // Still try to close the dialog
      closeDeleteDialog();
    });
}

// Helper function to ensure modal is visible
function showModalWithFallback(modal) {
  // Try multiple approaches to ensure modal visibility
  
  // Method 1: Set inline styles with !important
  modal.style.cssText = 'display: flex !important; opacity: 1 !important; visibility: visible !important; z-index: 9999 !important;';
  
  // Method 2: Add a custom class that we know works
  modal.classList.add('modal-visible');
  
  // Method 3: Set individual styles as a fallback
  modal.style.display = 'flex';
  modal.style.opacity = '1';
  modal.style.visibility = 'visible';
  
  // Debugging info
  console.log('Modal visibility status:', {
    displayStyle: modal.style.display,
    opacityStyle: modal.style.opacity,
    visibilityStyle: modal.style.visibility,
    className: modal.className
  });
  
  // Final check
  setTimeout(() => {
    const computedStyle = window.getComputedStyle(modal);
    console.log('Modal visibility check (computed):', {
      display: computedStyle.display,
      opacity: computedStyle.opacity,
      visibility: computedStyle.visibility
    });
    
    // Emergency fallback if still not visible
    if (computedStyle.visibility === 'hidden' || computedStyle.display === 'none') {
      console.warn('Modal still not visible, trying emergency override');
      document.body.appendChild(modal.cloneNode(true));
      modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex !important; align-items: center; justify-content: center; z-index: 99999 !important; visibility: visible !important;';
    }
  }, 100);
}

// Close connection modal
function closeConnectionModal() {
  console.log('Closing connection modal');
  const modal = document.getElementById('connection-modal');
  if (modal) {
    // Reset all visibility settings - don't remove the modal, just hide it
    modal.style.cssText = '';
    modal.style.display = 'none';
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    
    // Remove custom classes
    modal.classList.remove('modal-visible');
    
    console.log('Modal display style set to none');
    
    // Clear any emergency cloned modals
    const clonedModals = document.querySelectorAll('#connection-modal:not(:first-of-type)');
    clonedModals.forEach(clone => {
      clone.parentNode.removeChild(clone);
      console.log('Removed cloned modal');
    });
  } else {
    console.error('Modal element not found when trying to close');
  }
  editingConnectionId = null;
}

// Display empty states for data sections (called when query is empty)
function displayEmptyStates(type) {
  if (type === 'connections') {
    // First, hide any existing "No connections" elements to avoid duplicates
    hideEmptyState('connections');
    
    const connectionsList = document.querySelector('.connections-list');
    if (connectionsList) {
      connectionsList.innerHTML = `
        <li class="empty-state">
          <div class="empty-icon"><i class="fas fa-user-plus"></i></div>
          <div class="empty-text">
            <p>No saved connections yet</p>
            <p class="empty-subtext">Add people you message frequently</p>
            <button id="add-first-connection-btn" class="primary-button">
              <i class="fas fa-plus"></i> Add First Connection
          </button>
          </div>
        </li>
      `;
      // Add listener for the new button
      const emptyAddBtn = document.getElementById('add-first-connection-btn');
      if (emptyAddBtn) {
          emptyAddBtn.addEventListener('click', function() {
            console.log('Empty state add person button clicked');
            openConnectionModal();
          });
      } else {
        console.warn('Empty add connection button not found');
      }
    }
  } else if (type === 'messages') {
    // First, hide any existing "No messages" elements to avoid duplicates
    hideEmptyState('messages');
    
    const messagesList = document.querySelector('.messages-list');
    if (messagesList) {
      messagesList.innerHTML = `
        <li class="empty-state">
          <div class="empty-icon"><i class="fas fa-comment-dots"></i></div>
          <div class="empty-text">
            <p>No messages yet</p>
            <p class="empty-subtext">Create your first message to see it here</p>
            <button id="create-first-message-btn" class="primary-button">
              <i class="fas fa-magic"></i> Create First Message
            </button>
          </div>
        </li>
      `;
      
      const createFirstMessageBtn = document.getElementById('create-first-message-btn');
      if (createFirstMessageBtn) {
        createFirstMessageBtn.addEventListener('click', () => {
          window.location.href = 'message-intent-new.html';
        });
      }
    }
  } else if (type === 'reminders') {
    const remindersList = document.getElementById('reminders-list');
    if (remindersList) {
      remindersList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon"><i class="fas fa-bell"></i></div>
          <div class="empty-title">No upcoming reminders</div>
          <div class="empty-description">Set reminders when sending messages to stay connected</div>
        </div>
      `;
    }
  }
}

// Display error message for connections section
function showConnectionsError(errorMessage) {
  const connectionsList = document.getElementById('connections-list');
  if (connectionsList) {
    connectionsList.innerHTML = `
      <li class="error-state">
        <div class="error-icon"><i class="fas fa-exclamation-triangle"></i></div>
        <div class="error-title">Unable to load connections</div>
        <div class="error-message">${errorMessage}</div>
        <div class="error-tip">This is likely a temporary Firebase permissions issue.</div>
        <button class="error-action" onclick="loadUserConnections()">Try Again</button>
        <button class="error-action secondary">Show Details</button>
      </li>
    `;
  }
}

// Display error message for messages section
function showMessagesError(errorMessage) {
  const recentMessages = document.getElementById('recent-messages');
  if (recentMessages) {
    recentMessages.innerHTML = `
      <li class="error-state">
        <div class="error-icon"><i class="fas fa-exclamation-triangle"></i></div>
        <div class="error-title">Unable to load messages</div>
        <div class="error-message">${errorMessage}</div>
        <div class="error-tip">This is likely a temporary Firebase permissions issue.</div>
        <button class="error-action" onclick="loadUserMessages()">Try Again</button>
        <button class="error-action secondary">Show Details</button>
      </li>
    `;
  }
}

// Display error message for reminders section
function showRemindersError(errorMessage) {
  const remindersList = document.getElementById('reminders-list');
  if (remindersList) {
    remindersList.innerHTML = `
      <div class="error-state">
        <div class="error-icon"><i class="fas fa-exclamation-triangle"></i></div>
        <div class="error-title">Unable to load reminders</div>
        <div class="error-message">${errorMessage}</div>
        <div class="error-tip">This is likely a temporary Firebase permissions issue.</div>
        <button class="error-action" onclick="loadUserReminders()">Try Again</button>
        <button class="error-action secondary">Show Details</button>
      </div>
    `;
  }
}

// Load user connections from Firestore
async function loadUserConnections() {
  if (!currentUser) {
    console.error('Cannot load connections: User not authenticated');
    return;
  }
  
  try {
    const userUid = currentUser.uid;
    console.log('Loading connections for user:', userUid);
    
    showLoading('Loading connections...');
    
    const connectionsCollection = firebase.firestore()
      .collection('users')
      .doc(userUid)
      .collection('connections');
    
    const connectionsSnapshot = await connectionsCollection.get();
    
    if (connectionsSnapshot.empty) {
      console.log('No connections found');
      displayEmptyStates('connections');
      hideLoading();
      return;
    }
    
    // We have connections, hide any empty state
    hideEmptyState('connections');
    
    const connections = [];
    connectionsSnapshot.forEach(doc => {
      connections.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Loaded ${connections.length} connections`);
    
    // Display in the connections section
    const connectionsContainer = document.getElementById('connections-list');
    if (!connectionsContainer) {
      console.error('Connections container not found');
      hideLoading();
      return;
    }
    
    // Clear the container but keep the "Add New Connection" button if it exists
    const addConnectionBtn = connectionsContainer.querySelector('.home-page__add-connection');
    connectionsContainer.innerHTML = '';
    
    // Add each connection to the container
    connections.forEach(connection => {
      const connectionItem = createConnectionItem(connection);
      connectionsContainer.appendChild(connectionItem);
    });
    
    // Re-add the "Add New Connection" button
    if (addConnectionBtn) {
      connectionsContainer.appendChild(addConnectionBtn);
    } else {
      // Create a new "Add Connection" button if it didn't exist
      const newAddBtn = document.createElement('button');
      newAddBtn.className = 'home-page__add-connection';
      newAddBtn.id = 'add-connection-btn';
      newAddBtn.innerHTML = `
        <span class="home-page__add-connection-icon"><i class="fas fa-plus"></i></span>
        Add New Connection
      `;
      
      connectionsContainer.appendChild(newAddBtn);
    }
    
    hideLoading();
  } catch (error) {
    console.error('Error loading connections:', error);
    showConnectionsError('Error loading connections. Please try again.');
    hideLoading();
  }
}

// Show all connections in a modal
function showAllConnectionsModal(connections) {
  // Create modal element
  let modalElement = document.getElementById('all-connections-modal');
  
  if (!modalElement) {
    modalElement = document.createElement('div');
    modalElement.id = 'all-connections-modal';
    modalElement.className = 'modal';
    document.body.appendChild(modalElement);
  }
  
  // Create relationship icons map
  const relationshipIcons = {
    'friend': 'fa-user-friends',
    'family': 'fa-home',
    'partner': 'fa-heart',
    'colleague': 'fa-briefcase',
    'acquaintance': 'fa-handshake',
    'other': 'fa-user'
  };
  
  // Generate connection items HTML
  const connectionsHTML = connections.map(connection => {
    const relationshipText = connection.relationship === 'other' && connection.otherRelationship
      ? connection.otherRelationship
      : capitalizeFirstLetter(connection.relationship || 'friend');
    
    const relationshipIcon = relationshipIcons[connection.relationship] || 'fa-user';
    
    return `
      <div class="modal-connection-item" data-id="${connection.id}">
        <div class="connection-avatar">
          <i class="fas ${relationshipIcon}"></i>
        </div>
        <div class="connection-details">
          <div class="connection-name">${connection.name}</div>
          <div class="connection-meta">
            <span class="connection-relation">${relationshipText}</span>
          </div>
        </div>
        <div class="connection-actions">
          <button class="connection-action message-btn" title="Create message">
            <i class="fas fa-pen"></i>
          </button>
          <button class="connection-action edit-btn" title="Edit connection">
            <i class="fas fa-pencil-alt"></i>
          </button>
          <button class="connection-action delete-btn" title="Delete connection">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  // Populate modal content
  modalElement.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">All Connections</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="modal-connections-list">
          ${connectionsHTML}
        </div>
      </div>
      <div class="modal-footer">
        <button class="modal-add-button">
          <i class="fas fa-plus"></i> Add New Connection
        </button>
      </div>
    </div>
  `;
  
  // Show modal
  modalElement.style.display = 'flex';
  
  // Add event listeners
  const closeBtn = modalElement.querySelector('.modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modalElement.style.display = 'none';
    });
  }
  
  // Close modal when clicking outside
  modalElement.addEventListener('click', (e) => {
    if (e.target === modalElement) {
      modalElement.style.display = 'none';
    }
  });
  
  // Add New Connection button
  const addButton = modalElement.querySelector('.modal-add-button');
  if (addButton) {
    addButton.addEventListener('click', () => {
      modalElement.style.display = 'none';
      openConnectionModal();
    });
  }
  
  // Message buttons
  const messageButtons = modalElement.querySelectorAll('.message-btn');
  messageButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = button.closest('.modal-connection-item');
      const connectionId = item.getAttribute('data-id');
      const connection = connections.find(c => c.id === connectionId);
      
      if (connection) {
        modalElement.style.display = 'none';
        createMessageForConnection(connection);
      }
    });
  });
  
  // Edit buttons
  const editButtons = modalElement.querySelectorAll('.edit-btn');
  editButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = button.closest('.modal-connection-item');
      const connectionId = item.getAttribute('data-id');
      
      modalElement.style.display = 'none';
      openConnectionModal(connectionId);
    });
  });
  
  // Delete buttons
  const deleteButtons = modalElement.querySelectorAll('.delete-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = button.closest('.modal-connection-item');
      const connectionId = item.getAttribute('data-id');
      
      // Set the editing connection ID and show delete confirmation
      editingConnectionId = connectionId;
      showDeleteConfirmation();
    });
  });
  
  // Make connection items clickable to message
  const connectionItems = modalElement.querySelectorAll('.modal-connection-item');
  connectionItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (!e.target.closest('.connection-action')) {
        const connectionId = item.getAttribute('data-id');
        
        modalElement.style.display = 'none';
        createMessageForConnection(connections.find(c => c.id === connectionId));
      }
    });
  });
}

// Create message for a connection
function createMessageForConnection(connection) {
  // Store recipient data in localStorage
  localStorage.setItem('recipientData', JSON.stringify({
    name: connection.name,
    relationship: connection.relationship,
    otherRelationship: connection.otherRelationship || ''
  }));
  
  // Navigate to message intent page
  window.location.href = 'message-intent-new.html';
}

// Load user messages from Firestore
async function loadUserMessages(forModal = false) {
  if (!currentUser) {
    console.error('Cannot load messages: User not authenticated');
    return;
  }
  
  try {
    const userUid = currentUser.uid;
    console.log('Loading messages for user:', userUid);
    
    if (!forModal) showLoading('Loading messages...');
    
    // Get a map of connections for looking up names
    const connectionMap = await getConnectionMap();
    
    const messagesCollection = firebase.firestore()
      .collection('users')
      .doc(userUid)
      .collection('messages');
    
    // Query for recent messages, limited to 5 for the dashboard
    const limit = forModal ? 20 : 5;
    const messagesQuery = messagesCollection
      .orderBy('timestamp', 'desc')
      .limit(limit);
    
    const messagesSnapshot = await messagesQuery.get();
    
    if (messagesSnapshot.empty) {
      console.log('No messages found');
      displayEmptyStates('messages');
      hideLoading();
      return;
    }
    
    // We have messages, hide any empty state
    hideEmptyState('messages');
    
    const messages = [];
    messagesSnapshot.forEach(doc => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Loaded ${messages.length} messages`);
    
    if (forModal) {
      // Display in the all messages modal
      showAllMessagesModal(messages, connectionMap);
    } else {
      // Display in the recent messages section on the dashboard
      const messagesContainer = document.getElementById('recent-messages-list');
      if (!messagesContainer) {
        console.error('Messages container not found');
        hideLoading();
        return;
      }
      
      // Clear the container of any placeholder content
      messagesContainer.innerHTML = '';
      
      // Add each message to the container
      messages.forEach(message => {
        const messageCard = createMessageCard(message, connectionMap);
        messagesContainer.appendChild(messageCard);
      });
    }
    
    hideLoading();
  } catch (error) {
    console.error('Error loading messages:', error);
    showMessagesError('Error loading messages. Please try again.');
    hideLoading();
  }
}

// Helper function to create a message card element
function createMessageCard(message, connectionMap) {
  const messageCard = document.createElement('div');
  messageCard.className = 'home-page__message-card';
  messageCard.dataset.messageId = message.id;
  
  // Message type influences the accent color
  const accentColor = getAccentColorForType(message.type);
  if (accentColor) {
    messageCard.style.setProperty('--message-accent-color', accentColor);
  }
  
  const timeAgo = getTimeAgo(message.timestamp?.toDate() || new Date());
  
  // Create message template
  messageCard.innerHTML = `
    <div class="home-page__message-header">
      <div class="home-page__message-meta">
        <div class="home-page__message-type">${formatIntentTag(message.type)}</div>
        <div class="home-page__message-time">${timeAgo}</div>
      </div>
    </div>
    <div class="home-page__message-text">
      "${message.content}"
    </div>
    <div class="home-page__message-actions">
      <button class="home-page__message-button">
        <i class="far fa-copy"></i> Copy
      </button>
      <button class="home-page__message-button">
        <i class="far fa-edit"></i> Edit
      </button>
      <button class="home-page__message-button home-page__message-button--primary">
        <i class="fas fa-share"></i> Share
      </button>
    </div>
  `;
  
  return messageCard;
}

// Helper function to create a connection item
function createConnectionItem(connection) {
  const connectionEl = document.createElement('div');
  connectionEl.className = 'home-page__connection';
  connectionEl.dataset.connectionId = connection.id;
  
  // Create connection template
  connectionEl.innerHTML = `
    <div class="home-page__connection-info">
      <div class="home-page__connection-avatar">${getInitials(connection.name)}</div>
      <div class="home-page__connection-details">
        <div class="home-page__connection-name">${connection.name}</div>
        <div class="home-page__connection-type">${connection.relationship}</div>
      </div>
    </div>
    <div class="home-page__connection-actions">
      <button class="home-page__connection-button">
        <i class="fas fa-paper-plane"></i>
      </button>
      <button class="home-page__connection-button">
        <i class="fas fa-edit"></i>
      </button>
      <button class="home-page__connection-button">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
  
  return connectionEl;
}

// Load user's reminders from Firestore
function loadUserReminders() {
  if (!currentUser) {
    console.warn('No current user for loading reminders');
    showRemindersError('User not authenticated.');
    return;
  }
  
  const remindersList = document.getElementById('reminders-list');
  if (!remindersList) {
    console.warn('Reminders list element not found');
    return;
  }
  
  // Show loading state
  remindersList.innerHTML = `
    <div class="loading-state">
      <span class="loading-spinner"></span> Loading reminders...
    </div>
  `;
  
  const now = new Date();
  firebase.firestore()
    .collection('users')
    .doc(currentUser.uid)
    .collection('reminders')
    .where('isComplete', '==', false)
    .limit(10)
    .get()
    .then((querySnapshot) => {
      try {
        // Clear loading indicator
        remindersList.innerHTML = '';
        
        const filteredDocs = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          // Check for valid reminderDate before adding
          if (data.reminderDate && typeof data.reminderDate.toDate === 'function' && data.reminderDate.toDate() >= now) {
            filteredDocs.push({ doc, data });
          } else {
            console.warn('Skipping reminder due to missing/invalid/past date:', doc.id, data.reminderDate);
          }
        });
        
        if (filteredDocs.length === 0) {
          displayEmptyStates('reminders');
          return;
        }
        
        filteredDocs.sort((a, b) => {
          const dateA = a.data.reminderDate.toDate();
          const dateB = b.data.reminderDate.toDate();
          return dateA - dateB;
        });
        
        filteredDocs.slice(0, 5).forEach(({ doc, data: reminderData }) => {
          // Add checks for potentially missing data
          const recipientName = reminderData.recipientName || 'Someone';
          
          let dateText = 'Soon';
          // We already checked reminderDate exists and is valid
          const reminderDate = reminderData.reminderDate.toDate();
          dateText = formatDate(reminderDate);
          
          const reminderItem = document.createElement('div');
          reminderItem.className = 'reminder-item';
          reminderItem.innerHTML = `
            <div class="reminder-icon">
              <i class="fas fa-bell"></i>
            </div>
            <div class="reminder-content">
              <div class="reminder-title">Message ${recipientName}</div>
              <div class="reminder-date">${dateText}</div>
              <div class="reminder-actions">
                <div class="reminder-action message-now">Message Now</div>
                <div class="reminder-action dismiss">Dismiss</div>
              </div>
            </div>
          `;
          reminderItem.setAttribute('data-id', doc.id);
          
          const messageNowBtn = reminderItem.querySelector('.message-now');
          const dismissBtn = reminderItem.querySelector('.dismiss');
          
          if (messageNowBtn) {
            messageNowBtn.addEventListener('click', function() {
              if (reminderData.connectionId) {
                firebase.firestore()
                  .collection('users')
                  .doc(currentUser.uid)
                  .collection('connections')
                  .doc(reminderData.connectionId)
                  .get()
                  .then((doc) => {
                    let recipientDataForStorage;
                    if (doc.exists) {
                      const connectionData = doc.data();
                      recipientDataForStorage = {
                        id: reminderData.connectionId,
                        name: connectionData.name || recipientName, // Use fetched name or fallback
                        relationship: connectionData.relationship,
                        isExisting: true
                      };
                    } else {
                      recipientDataForStorage = {
                        name: recipientName,
                        isExisting: false
                      };
                    }
                    localStorage.setItem('recipientData', JSON.stringify(recipientDataForStorage));
                    window.location.href = 'message-intent.html';
                  })
                  .catch((error) => {
                    console.error('Error fetching connection for reminder:', error);
                    // Fallback if fetch fails
                    localStorage.setItem('recipientData', JSON.stringify({
                      name: recipientName,
                      isExisting: false
                    }));
                    window.location.href = 'message-intent.html';
                  });
              } else {
                localStorage.setItem('recipientData', JSON.stringify({
                  name: recipientName,
                  isExisting: false
                }));
                window.location.href = 'message-intent.html';
              }
              markReminderComplete(doc.id);
            });
          }
          
          if (dismissBtn) {
            dismissBtn.addEventListener('click', function() {
              markReminderComplete(doc.id);
              reminderItem.remove();
              if (remindersList.children.length === 0) {
                displayEmptyStates('reminders');
              }
            });
          }
          
          remindersList.appendChild(reminderItem);
        });
        
        console.log('Reminders loaded successfully');
      } catch(processingError) {
        console.error('Error processing reminders data:', processingError);
        showRemindersError('Failed to display reminders: ' + processingError.message);
      }
    })
    .catch((error) => {
      console.error('Error loading reminders:', error);
      showRemindersError(error.message);
      if (typeof debugLog === 'function') {
        debugLog('Error loading reminders: ' + error.message);
      }
    });
}

// Mark a reminder as complete
function markReminderComplete(reminderId) {
  if (!currentUser || !reminderId) return;
  
  firebase.firestore()
    .collection('users')
    .doc(currentUser.uid)
    .collection('reminders')
    .doc(reminderId)
    .update({
      isComplete: true,
      completedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      console.log('Reminder marked as complete');
    })
    .catch((error) => {
      console.error('Error marking reminder as complete:', error);
      showAlert('Error updating reminder: ' + error.message, 'error');
    });
}

// Format date for display
function formatDate(date) {
  if (!date) return 'Unknown date';
  
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (dayDiff === 0) {
    const hourDiff = Math.floor(diff / (1000 * 60 * 60));
    if (hourDiff === 0) {
      const minuteDiff = Math.floor(diff / (1000 * 60));
      if (minuteDiff < 5) return 'Just now';
      return `${minuteDiff} minutes ago`;
    }
    return `${hourDiff} hours ago`;
  } else if (dayDiff === 1) {
    return 'Yesterday';
  } else if (dayDiff < 7) {
    return `${dayDiff} days ago`;
  } else if (dayDiff < 30) {
    const weekDiff = Math.floor(dayDiff / 7);
    return weekDiff === 1 ? '1 week ago' : `${weekDiff} weeks ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

// Get time ago from date
function getTimeAgo(date) {
  if (!date) return 'Never';
  
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (dayDiff === 0) {
    return 'Today';
  } else if (dayDiff === 1) {
    return 'Yesterday';
  } else if (dayDiff < 7) {
    return `${dayDiff} days ago`;
  } else if (dayDiff < 30) {
    const weekDiff = Math.floor(dayDiff / 7);
    return weekDiff === 1 ? '1 week ago' : `${weekDiff} weeks ago`;
  } else {
    const monthDiff = Math.floor(dayDiff / 30);
    return monthDiff === 1 ? '1 month ago' : `${monthDiff} months ago`;
  }
}

// Format intent tag for display
function formatIntentTag(intent) {
  switch (intent) {
    case 'care':
      return 'Care';
    case 'apologize':
      return 'Apology';
    case 'gratitude':
      return 'Gratitude';
    case 'reconnect':
      return 'Reconnection';
    case 'custom':
      return 'Custom';
    default:
      return capitalizeFirstLetter(intent);
  }
}

// Utility function to get initials from a name
function getInitials(name) {
  if (!name) return '?';
  
  const parts = name.split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Utility function to capitalize first letter
function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Show loading message
function showLoading(message = 'Loading...') {
  // Create loading element if it doesn't exist
  let loadingElement = document.getElementById('loading-overlay');
  
  if (!loadingElement) {
    loadingElement = document.createElement('div');
    loadingElement.id = 'loading-overlay';
    loadingElement.innerHTML = `
      <div class="loading-spinner"></div>
      <div class="loading-message">${message}</div>
    `;
    document.body.appendChild(loadingElement);
  } else {
    loadingElement.querySelector('.loading-message').textContent = message;
    loadingElement.style.display = 'flex';
  }
}

// Hide loading message
function hideLoading() {
  const loadingElement = document.getElementById('loading-overlay');
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
}

// Show alert message
function showAlert(message, type = 'info') {
  console.log('Alert:', message, type);
  
  try {
    // Create alert element if it doesn't exist
    let alertElement = document.querySelector('.alert');
    
    if (!alertElement) {
      alertElement = document.createElement('div');
      alertElement.className = `alert alert-${type}`;
      document.body.appendChild(alertElement);
    } else {
      alertElement.className = `alert alert-${type}`;
    }
    
    // Set message
    alertElement.innerHTML = `
      <div class="alert-content">
        <span class="alert-message">${message}</span>
        <button class="alert-close">&times;</button>
      </div>
    `;
    
    // Show alert
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
        if (document.body.contains(alertElement)) {
          alertElement.classList.remove('show');
          
          setTimeout(() => {
            if (document.body.contains(alertElement)) {
              document.body.removeChild(alertElement);
            }
          }, 300);
        }
      }, 5000);
    }
  } catch (error) {
    console.error('Error showing alert:', error);
    // Fallback to regular alert if custom alert fails
    if (type === 'error') {
      alert(message);
    }
  }
}

// Hide empty state in dashboard
function hideEmptyState(type) {
  if (type === 'connections') {
    // Hide all possible empty state elements for connections
    const noConnectionsMessages = document.querySelectorAll(
      '.no-connections-message, .no-connections-yet, #no-connections-message, ' +
      '[class*="connection"][class*="empty"], [id*="connection"][id*="empty"]'
    );
    
    noConnectionsMessages.forEach(el => {
      if (el) {
        console.log('Hiding empty connections state element:', el);
        el.style.display = 'none';
      }
    });
    
    // Also check for static elements in the DOM with icons/text indicating no connections
    const emptyStateElements = document.querySelectorAll(
      '.connections-list .empty-state, .connections-section .empty-state, ' +
      '.dashboard-section .empty-state'
    );
    
    emptyStateElements.forEach(el => {
      if (el) {
        console.log('Removing empty state element from connections list');
        el.remove();
      }
    });
    
    // Hide any text elements containing phrases about no connections
    const allTextElements = document.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, span');
    const phrasesToCheck = [
      'no connection', 'no connections', 
      'no saved connection', 'no saved connections',
      'no people', 'add your first', 'add first connection',
      'connections yet', 'add people'
    ];
    
    allTextElements.forEach(el => {
      if (el && el.textContent) {
        const lowerText = el.textContent.toLowerCase();
        for (const phrase of phrasesToCheck) {
          if (lowerText.includes(phrase)) {
            // Make sure we're not in a list already being populated
            if (!el.closest('.connections-list') && !el.closest('.messages-list')) {
              console.log(`Hiding element with "${phrase}" text:`, el);
              // Hide the element or its closest container
              const container = el.closest('.empty-state') || el.closest('.no-data-message') || el;
              container.style.display = 'none';
            }
            break;
          }
        }
      }
    });
    
  } else if (type === 'messages') {
    // Hide all possible empty state elements for messages
    const noMessagesMessages = document.querySelectorAll(
      '.no-messages-message, .no-messages-yet, #no-messages-message, ' +
      '[class*="message"][class*="empty"], [id*="message"][id*="empty"]'
    );
    
    noMessagesMessages.forEach(el => {
      if (el) {
        console.log('Hiding empty messages state element:', el);
        el.style.display = 'none';
      }
    });
    
    // Also check for static elements in the DOM with icons/text indicating no messages
    const emptyStateElements = document.querySelectorAll(
      '.messages-list .empty-state, .messages-section .empty-state, ' +
      '.recent-messages .empty-state, #recent-messages .empty-state'
    );
    
    emptyStateElements.forEach(el => {
      if (el) {
        console.log('Removing empty state element from messages list');
        el.remove();
      }
    });
    
    // Hide any text elements containing phrases about no messages
    const allTextElements = document.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, span');
    const phrasesToCheck = [
      'no message', 'no messages', 
      'create your first', 'no messages yet',
      'start crafting', 'create first message'
    ];
    
    allTextElements.forEach(el => {
      if (el && el.textContent) {
        const lowerText = el.textContent.toLowerCase();
        for (const phrase of phrasesToCheck) {
          if (lowerText.includes(phrase)) {
            // Make sure we're not in a list already being populated
            if (!el.closest('.connections-list') && !el.closest('.messages-list')) {
              console.log(`Hiding element with "${phrase}" text:`, el);
              // Hide the element or its closest container
              const container = el.closest('.empty-state') || el.closest('.no-data-message') || el;
              container.style.display = 'none';
            }
            break;
          }
        }
      }
    });
  }
  
  // Also hide specific elements that might be in home.html
  const specificStaticElements = {
    'connections': [
      document.querySelector('.no-connections-container'),
      document.querySelector('#no-connections-container'),
      document.querySelector('.empty-connections-state'),
      document.querySelector('#empty-connections-state')
    ],
    'messages': [
      document.querySelector('.no-messages-container'),
      document.querySelector('#no-messages-container'),
      document.querySelector('.empty-messages-state'),
      document.querySelector('#empty-messages-state')
    ]
  };
  
  if (specificStaticElements[type]) {
    specificStaticElements[type].forEach(el => {
      if (el) {
        console.log(`Hiding specific static ${type} element:`, el);
        el.style.display = 'none';
      }
    });
  }
}

// Open connections management view
function openConnectionsManagement() {
  // For now, simply open the connections section
  const connectionsSection = document.querySelector('.dashboard-section:nth-child(3)');
  if (connectionsSection) {
    connectionsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Highlight the section temporarily
    connectionsSection.classList.add('highlight-section');
    setTimeout(() => {
      connectionsSection.classList.remove('highlight-section');
    }, 2000);
  }
}

// View a message - now displays in a popup instead of redirecting
function viewMessage(messageId) {
  if (!currentUser) return;
  
  // Show loading state
  showLoading('Loading message...');
  
  // Get the message from Firestore
  firebase.firestore()
    .collection('users')
    .doc(currentUser.uid)
    .collection('messages')
    .doc(messageId)
    .get()
    .then(doc => {
      hideLoading();
      
      if (doc.exists) {
        const message = {
          id: doc.id,
          ...doc.data()
        };
        
        // Get connection details if needed
        if (message.connectionId) {
          return firebase.firestore()
            .collection('users')
            .doc(currentUser.uid)
            .collection('connections')
            .doc(message.connectionId)
            .get()
            .then(connectionDoc => {
              const connectionMap = {};
              if (connectionDoc.exists) {
                connectionMap[connectionDoc.id] = connectionDoc.data();
              }
              return { message, connectionMap };
            });
        } else {
          return { message, connectionMap: {} };
        }
      } else {
        throw new Error('Message not found');
      }
    })
    .then(({ message, connectionMap }) => {
      // Show message in popup
      showMessagePopup(message, connectionMap);
    })
    .catch(error => {
      console.error('Error loading message:', error);
      hideLoading();
      showAlert('Could not load the message. Please try again.', 'error');
    });
}

/**
 * Get accent color based on message type
 */
function getAccentColorForType(messageType) {
  if (!messageType) return '#8a57de'; // Default purple
  
  const colors = {
    'romantic': '#FF7EB9', // Pink
    'family': '#7F7CAF', // Purple-Blue
    'professional': '#5091F5', // Blue
    'friendly': '#4ECDC4', // Teal
    'gratitude': '#FFD700', // Gold
    'congratulations': '#FFA500', // Orange
    'apology': '#FF6B6B', // Red
    'sympathy': '#98D2EB', // Light Blue
    'encouragement': '#5EE6EB', // Bright Teal
    'general': '#8a57de' // Default purple
  };
  
  // Return the matching color or default
  return colors[messageType.toLowerCase()] || '#8a57de';
}

/**
 * Format a readable tag for the message intent/type
 */
function formatIntentTag(intentType) {
  if (!intentType) return 'General';
  
  // Capitalize first letter
  return intentType.charAt(0).toUpperCase() + intentType.slice(1);
}

/**
 * Format a date relative to now (e.g. "2 days ago")
 */
function getTimeAgo(date) {
  if (!date) return 'Unknown time';
  
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  // Less than a minute
  if (seconds < 60) {
    return 'Just now';
  }
  
  // Less than an hour
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  // Less than a day
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Less than a month
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  
  // Format as date
  return formatDate(date);
}

/**
 * Format a date as a readable string
 */
function formatDate(date) {
  if (!date) return 'Unknown date';
  
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

/**
 * Get a person's initials from their name
 */
function getInitials(name) {
  if (!name) return '?';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Get a map of all connections for this user
 */
async function getConnectionMap() {
  if (!currentUser) return {};
  
  try {
    const userUid = currentUser.uid;
    const connectionMap = {};
    
    const snapshot = await firebase.firestore()
      .collection('users')
      .doc(userUid)
      .collection('connections')
      .get();
    
    snapshot.forEach(doc => {
      connectionMap[doc.id] = {
        id: doc.id,
        ...doc.data()
      };
    });
    
    return connectionMap;
  } catch (error) {
    console.error('Error creating connection map:', error);
    return {};
  }
}

/**
 * Display empty states for different sections
 */
function displayEmptyStates(type) {
  console.log(`Displaying empty state for ${type}`);
  
  if (type === 'connections' || type === 'all') {
    const connectionsContainer = document.getElementById('connections-list');
    if (connectionsContainer) {
      // Keep only the add connection button if it exists
      const addConnectionBtn = connectionsContainer.querySelector('.home-page__add-connection');
      connectionsContainer.innerHTML = `
        <div class="home-page__empty-state">
          <div class="home-page__empty-state-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="home-page__empty-state-text">No connections yet</div>
          <div class="home-page__empty-state-subtext">Add connections to create personalized messages</div>
        </div>
      `;
      
      // Re-add the add connection button
      if (addConnectionBtn) {
        connectionsContainer.appendChild(addConnectionBtn);
      } else {
        // Create a new add connection button
        const newAddBtn = document.createElement('button');
        newAddBtn.className = 'home-page__add-connection';
        newAddBtn.id = 'add-connection-btn';
        newAddBtn.innerHTML = `
          <span class="home-page__add-connection-icon"><i class="fas fa-plus"></i></span>
          Add New Connection
        `;
        connectionsContainer.appendChild(newAddBtn);
      }
    }
  }
  
  if (type === 'messages' || type === 'all') {
    const messagesContainer = document.getElementById('recent-messages-list');
    if (messagesContainer) {
      messagesContainer.innerHTML = `
        <div class="home-page__empty-state">
          <div class="home-page__empty-state-icon">
            <i class="fas fa-comment-alt"></i>
          </div>
          <div class="home-page__empty-state-text">No messages yet</div>
          <div class="home-page__empty-state-subtext">Create your first message using the button above</div>
        </div>
      `;
    }
  }
  
  if (type === 'reminders' || type === 'all') {
    const remindersContainer = document.getElementById('reminders-list');
    if (remindersContainer) {
      remindersContainer.innerHTML = `
        <div class="home-page__empty-state">
          <div class="home-page__empty-state-icon">
            <i class="fas fa-bell-slash"></i>
          </div>
          <div class="home-page__empty-state-text">No upcoming reminders</div>
          <div class="home-page__empty-state-subtext">Set reminders when sending messages to stay connected</div>
        </div>
      `;
    }
  }
}

/**
 * Hide empty state for a specific section
 */
function hideEmptyState(type) {
  if (type === 'connections' || type === 'all') {
    const connectionsContainer = document.getElementById('connections-list');
    if (connectionsContainer) {
      const emptyState = connectionsContainer.querySelector('.home-page__empty-state');
      if (emptyState) {
        emptyState.remove();
      }
    }
  }
  
  if (type === 'messages' || type === 'all') {
    const messagesContainer = document.getElementById('recent-messages-list');
    if (messagesContainer) {
      const emptyState = messagesContainer.querySelector('.home-page__empty-state');
      if (emptyState) {
        emptyState.remove();
      }
    }
  }
  
  if (type === 'reminders' || type === 'all') {
    const remindersContainer = document.getElementById('reminders-list');
    if (remindersContainer) {
      const emptyState = remindersContainer.querySelector('.home-page__empty-state');
      if (emptyState) {
        emptyState.remove();
      }
    }
  }
}

/**
 * Show an error message for connections
 */
function showConnectionsError(errorMessage) {
  const connectionsContainer = document.getElementById('connections-list');
  if (connectionsContainer) {
    connectionsContainer.innerHTML = `
      <div class="home-page__error-state">
        <div class="home-page__error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="home-page__error-text">${errorMessage}</div>
        <button class="home-page__retry-button" onclick="loadUserConnections()">
          <i class="fas fa-sync-alt"></i> Retry
        </button>
      </div>
    `;
  }
}

/**
 * Show an error message for messages
 */
function showMessagesError(errorMessage) {
  const messagesContainer = document.getElementById('recent-messages-list');
  if (messagesContainer) {
    messagesContainer.innerHTML = `
      <div class="home-page__error-state">
        <div class="home-page__error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="home-page__error-text">${errorMessage}</div>
        <button class="home-page__retry-button" onclick="loadUserMessages()">
          <i class="fas fa-sync-alt"></i> Retry
        </button>
      </div>
    `;
  }
}

/**
 * Show an error message for reminders
 */
function showRemindersError(errorMessage) {
  const remindersContainer = document.getElementById('reminders-list');
  if (remindersContainer) {
    remindersContainer.innerHTML = `
      <div class="home-page__error-state">
        <div class="home-page__error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="home-page__error-text">${errorMessage}</div>
        <button class="home-page__retry-button" onclick="loadUserReminders()">
          <i class="fas fa-sync-alt"></i> Retry
        </button>
      </div>
    `;
  }
}

/**
 * Show a modal with all connections
 */
function openConnectionsManagement() {
  // Get a reference to the modal
  const allConnectionsModal = document.getElementById('all-connections-modal');
  if (!allConnectionsModal) {
    console.error('All connections modal not found');
    showAlert('Connections view is not available', 'error');
    return;
  }
  
  // Show the modal
  allConnectionsModal.style.display = 'block';
  
  // Load the full list of connections
  loadAllConnections();
}

/**
 * Load all connections for the modal
 */
async function loadAllConnections() {
  if (!currentUser) return;
  
  try {
    const userUid = currentUser.uid;
    
    const connectionsContainer = document.getElementById('all-connections-list');
    if (!connectionsContainer) {
      console.error('All connections container not found');
      return;
    }
    
    showLoading('Loading all connections...');
    
    const connectionsSnapshot = await firebase.firestore()
      .collection('users')
      .doc(userUid)
      .collection('connections')
      .get();
    
    // Clear the container
    connectionsContainer.innerHTML = '';
    
    if (connectionsSnapshot.empty) {
      connectionsContainer.innerHTML = `
        <div class="home-page__empty-state">
          <div class="home-page__empty-state-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="home-page__empty-state-text">No connections yet</div>
          <div class="home-page__empty-state-subtext">Add connections to create personalized messages</div>
        </div>
        <button class="home-page__add-connection" id="modal-add-connection-btn">
          <span class="home-page__add-connection-icon"><i class="fas fa-plus"></i></span>
          Add New Connection
        </button>
      `;
      
      // Add click event for the add button
      const addBtn = connectionsContainer.querySelector('#modal-add-connection-btn');
      if (addBtn) {
        addBtn.addEventListener('click', function() {
          openConnectionModal();
        });
      }
      
      hideLoading();
      return;
    }
    
    // Process connections
    const connections = [];
    connectionsSnapshot.forEach(doc => {
      connections.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Display all connections
    connections.forEach(connection => {
      const connectionItem = createConnectionItem(connection);
      connectionsContainer.appendChild(connectionItem);
    });
    
    // Add the "Add Connection" button at the end
    const addBtn = document.createElement('button');
    addBtn.className = 'home-page__add-connection';
    addBtn.id = 'modal-add-connection-btn';
    addBtn.innerHTML = `
      <span class="home-page__add-connection-icon"><i class="fas fa-plus"></i></span>
      Add New Connection
    `;
    
    addBtn.addEventListener('click', function() {
      openConnectionModal();
    });
    
    connectionsContainer.appendChild(addBtn);
    
    hideLoading();
  } catch (error) {
    console.error('Error loading all connections:', error);
    hideLoading();
    showAlert('Error loading connections', 'error');
  }
}

/**
 * Show a general-purpose alert message
 */
function showAlert(message, type = 'info') {
  // Remove any existing alerts
  const existingAlerts = document.querySelectorAll('.alert');
  existingAlerts.forEach(alert => {
    document.body.removeChild(alert);
  });
  
  // Create the alert element
  const alertElement = document.createElement('div');
  alertElement.className = `alert alert--${type}`;
  alertElement.textContent = message;
  
  // Add to the document
  document.body.appendChild(alertElement);
  
  // Remove after animation completes
  setTimeout(() => {
    if (alertElement.parentNode) {
      alertElement.parentNode.removeChild(alertElement);
    }
  }, 3500);
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
    loadingOverlay.style.display = 'flex';
  }
}

/**
 * Hide loading overlay
 */
function hideLoading() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  
  if (loadingOverlay) {
    loadingOverlay.style.display = 'none';
  }
}

/**
 * Initialize the connection modal form
 */
function initializeConnectionModal() {
  const form = document.getElementById('connection-form');
  if (!form) {
    console.error('Connection form not found');
    return;
  }
  
  // Handle relationship type change
  const relationshipSelect = document.getElementById('connection-relationship');
  const otherRelationshipGroup = document.getElementById('other-relationship-group');
  
  if (relationshipSelect && otherRelationshipGroup) {
    relationshipSelect.addEventListener('change', function() {
      if (this.value === 'other') {
        otherRelationshipGroup.style.display = 'block';
      } else {
        otherRelationshipGroup.style.display = 'none';
      }
    });
  }
  
  // Handle form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    saveConnection();
  });
  
  // Handle cancel button
  const cancelBtn = form.querySelector('.form-cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function() {
      closeConnectionModal();
    });
  }
}

/**
 * Open the connection modal
 */
function openConnectionModal(connectionId = null) {
  const modal = document.getElementById('connection-modal');
  if (!modal) {
    console.error('Connection modal not found');
    return;
  }
  
  // Set modal title based on whether we're editing or creating
  const modalTitle = document.getElementById('connection-modal-title');
  if (modalTitle) {
    modalTitle.textContent = connectionId ? 'Edit Connection' : 'Add New Connection';
  }
  
  // Reset form
  const form = document.getElementById('connection-form');
  if (form) {
    form.reset();
  }
  
  // Hide the "other relationship" field by default
  const otherRelationshipGroup = document.getElementById('other-relationship-group');
  if (otherRelationshipGroup) {
    otherRelationshipGroup.style.display = 'none';
  }
  
  // If editing an existing connection, pre-fill form fields
  if (connectionId) {
    editingConnectionId = connectionId;
    
    // Load connection data from Firestore
    if (currentUser) {
      showLoading('Loading connection details...');
      
      firebase.firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('connections')
        .doc(connectionId)
        .get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data();
            
            // Fill form fields
            const nameField = document.getElementById('connection-name');
            const relationshipField = document.getElementById('connection-relationship');
            const otherRelationshipField = document.getElementById('other-relationship');
            
            if (nameField) nameField.value = data.name || '';
            
            if (relationshipField) {
              relationshipField.value = data.relationship || '';
              
              // Show "other" field if needed
              if (data.relationship === 'other' && otherRelationshipGroup) {
                otherRelationshipGroup.style.display = 'block';
                
                if (otherRelationshipField && data.otherRelationship) {
                  otherRelationshipField.value = data.otherRelationship;
                }
              }
            }
          } else {
            console.error('Connection document not found');
            showAlert('Could not find connection details', 'error');
          }
          
          hideLoading();
        })
        .catch(error => {
          console.error('Error loading connection:', error);
          showAlert('Error loading connection details', 'error');
          hideLoading();
        });
    }
  } else {
    // New connection
    editingConnectionId = null;
  }
  
  // Show the modal
  modal.style.display = 'block';
}

/**
 * Close the connection modal
 */
function closeConnectionModal() {
  const modal = document.getElementById('connection-modal');
  if (modal) {
    modal.style.display = 'none';
  }
  
  // Reset editing state
  editingConnectionId = null;
}

/**
 * Save a connection (new or edited)
 */
function saveConnection() {
  if (!currentUser) {
    showAlert('You must be logged in to save connections', 'error');
    return;
  }
  
  // Get form values
  const nameField = document.getElementById('connection-name');
  const relationshipField = document.getElementById('connection-relationship');
  const specificRelationshipField = document.getElementById('connection-specific-relationship');
  const yearsField = document.getElementById('connection-years');
  const communicationStyleField = document.getElementById('connection-communication-style');
  const goalField = document.getElementById('connection-goal');
  const notesField = document.getElementById('connection-notes');
  
  if (!nameField || !relationshipField) {
    console.error('Form fields not found');
    return;
  }
  
  const name = nameField.value.trim();
  const relationship = relationshipField.value;
  
  // Validate form
  if (!name) {
    showAlert('Please enter a name', 'error');
    nameField.focus();
    return;
  }
  
  if (!relationship) {
    showAlert('Please select a relationship type', 'error');
    return;
  }
  
  // Prepare data to save
  const connectionData = {
    name,
    relationship,
    updatedAt: new Date()
  };
  
  // Add specific relationship if selected
  if (specificRelationshipField && specificRelationshipField.value) {
    connectionData.specificRelationship = specificRelationshipField.value;
  }
  
  // Add years known if provided
  if (yearsField && yearsField.value) {
    connectionData.yearsKnown = parseInt(yearsField.value);
  }
  
  // Add communication style if selected
  if (communicationStyleField && communicationStyleField.value) {
    connectionData.communicationStyle = communicationStyleField.value;
  }
  
  // Add relationship goal/focus if selected
  if (goalField && goalField.value) {
    connectionData.relationshipGoal = goalField.value;
  }
  
  // Add notes if provided
  if (notesField && notesField.value.trim()) {
    connectionData.notes = notesField.value.trim();
  }
  
  // If creating a new connection, add creation date
  if (!editingConnectionId) {
    connectionData.createdAt = new Date();
  }
  
  // Show loading
  showLoading(editingConnectionId ? 'Updating connection...' : 'Creating connection...');
  
  // Save to Firestore
  const connectionsRef = firebase.firestore()
    .collection('users')
    .doc(currentUser.uid)
    .collection('connections');
  
  const savePromise = editingConnectionId
    ? connectionsRef.doc(editingConnectionId).update(connectionData)
    : connectionsRef.add(connectionData);
  
  savePromise
    .then(() => {
      // Success
      showAlert(
        editingConnectionId ? 'Connection updated successfully' : 'Connection created successfully',
        'success'
      );
      
      // Close modal
      closeConnectionModal();
      
      // Reload connections
      loadUserConnections();
      
      // Also refresh all connections modal if it's open
      const allConnectionsModal = document.getElementById('all-connections-modal');
      if (allConnectionsModal && allConnectionsModal.style.display === 'block') {
        loadAllConnections();
      }
      
      hideLoading();
    })
    .catch(error => {
      console.error('Error saving connection:', error);
      showAlert('Error saving connection', 'error');
      hideLoading();
    });
}

/**
 * Show the delete confirmation dialog
 */
function showDeleteConfirmation(connectionId) {
  if (!connectionId) {
    console.error('No connection ID provided for deletion');
    return;
  }
  
  editingConnectionId = connectionId;
  
  const dialog = document.getElementById('delete-confirmation-dialog');
  if (!dialog) {
    console.error('Delete confirmation dialog not found');
    return;
  }
  
  // Get connection name if possible
  let connectionName = 'this connection';
  if (currentUser) {
    firebase.firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('connections')
      .doc(connectionId)
      .get()
      .then(doc => {
        if (doc.exists) {
          connectionName = doc.data().name || 'this connection';
          const dialogText = dialog.querySelector('.modal-body p');
          if (dialogText) {
            dialogText.textContent = `Are you sure you want to delete ${connectionName}?`;
          }
        }
      })
      .catch(error => {
        console.error('Error loading connection for deletion:', error);
      });
  }
  
  // Set up cancel button
  const cancelBtn = dialog.querySelector('.modal-cancel-btn');
  if (cancelBtn) {
    cancelBtn.onclick = function() {
      dialog.style.display = 'none';
      editingConnectionId = null;
    };
  }
  
  // Set up confirm button
  const confirmBtn = dialog.querySelector('.modal-confirm-btn');
  if (confirmBtn) {
    confirmBtn.onclick = function() {
      dialog.style.display = 'none';
      deleteConnection(connectionId);
    };
  }
  
  // Set up close button
  const closeBtn = dialog.querySelector('.close-modal');
  if (closeBtn) {
    closeBtn.onclick = function() {
      dialog.style.display = 'none';
      editingConnectionId = null;
    };
  }
  
  // Show the dialog
  dialog.style.display = 'block';
}

/**
 * Delete a connection
 */
function deleteConnection(connectionId) {
  if (!currentUser || !connectionId) {
    showAlert('Could not delete connection', 'error');
    return;
  }
  
  showLoading('Deleting connection...');
  
  firebase.firestore()
    .collection('users')
    .doc(currentUser.uid)
    .collection('connections')
    .doc(connectionId)
    .delete()
    .then(() => {
      showAlert('Connection deleted successfully', 'success');
      
      // Reload connections
      loadUserConnections();
      
      // Also refresh all connections modal if it's open
      const allConnectionsModal = document.getElementById('all-connections-modal');
      if (allConnectionsModal && allConnectionsModal.style.display === 'block') {
        loadAllConnections();
      }
      
      hideLoading();
    })
    .catch(error => {
      console.error('Error deleting connection:', error);
      showAlert('Error deleting connection', 'error');
      hideLoading();
    });
}

// ... existing code ...

/**
 * Display empty state for a specific container
 */
function displayEmptyState(container, type) {
  let icon, title, description, actionText, actionOnClick;
  
  switch (type) {
    case 'connections':
      icon = 'person_add';
      title = 'No connections yet';
      description = 'Start by adding your first connection to HeartGlowAI';
      actionText = 'Add Connection';
      actionOnClick = "openModal('add-connection-modal')";
      break;
    case 'messages':
      icon = 'chat';
      title = 'No messages yet';
      description = 'Your recent messages will appear here once you connect and interact with people';
      actionText = 'Learn More';
      actionOnClick = "openHelpModal()";
      break;
    case 'reminders':
      icon = 'schedule';
      title = 'No reminders set';
      description = 'Create reminders to keep track of important follow-ups';
      actionText = 'Create Reminder';
      actionOnClick = "openModal('add-reminder-modal')";
      break;
    default:
      icon = 'info';
      title = 'Nothing to display';
      description = 'Check back later for updates';
      actionText = 'Refresh';
      actionOnClick = "location.reload()";
  }

  const emptyStateHtml = `
    <div class="home-page__empty-state">
      <span class="material-icons home-page__empty-icon">${icon}</span>
      <h3 class="home-page__empty-title">${title}</h3>
      <p class="home-page__empty-description">${description}</p>
      <button class="home-page__action-button" onclick="${actionOnClick}">
        ${actionText}
      </button>
    </div>
  `;
  
  container.innerHTML = emptyStateHtml;
}

// ... existing code ... 