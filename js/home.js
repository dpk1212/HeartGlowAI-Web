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
    
    // Initialize UI elements that don't depend on Firestore data
    initNavigationButtons();
    initializeQuickActions();
    initializeManageButtons();
    initializeConnectionModal();
    
    // Initialize add connection button
    const addConnectionBtn = document.getElementById('add-connection-btn');
    if (addConnectionBtn) {
      addConnectionBtn.addEventListener('click', function() {
        console.log('Add connection button clicked');
        openConnectionModal();
      });
    } else {
      console.warn('Add connection button not found');
    }
    
    // Initialize create message button
    const createMessageBtn = document.getElementById('create-message-btn');
    if (createMessageBtn) {
      createMessageBtn.addEventListener('click', function() {
        // Navigate to emotional entry page
        window.location.href = 'emotional-entry.html';
      });
    } else {
      console.warn('Create message button not found');
    }
    
    // Initialize logout button
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
    } else {
      console.warn('Logout button not found');
    }
    
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
    
  } catch (error) {
    console.error('Critical Error in initializeHomePage:', error);
    // Show a general error if basic initialization fails
    showAlert('A critical error occurred initializing the page. Please refresh.', 'error');
  }
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
            window.location.href = 'emotional-entry.html';
            break;
          case 1: // Express appreciation
            localStorage.setItem('selectedEmotion', 'appreciation');
            window.location.href = 'emotional-entry.html';
            break;
          case 2: // Make an apology
            localStorage.setItem('selectedEmotion', 'vulnerability');
            window.location.href = 'emotional-entry.html';
            break;
          case 3: // Create from scratch
            localStorage.setItem('selectedEmotion', 'explore');
            window.location.href = 'emotional-entry.html';
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
  const cancelBtn = document.getElementById('cancel-connection');
  const closeBtn = document.getElementById('close-modal');
  
  if (!modal) {
    console.warn('Connection modal not found');
    return;
  }
  
  if (!form) {
    console.warn('Connection form not found');
    return;
  }
  
  // Close modal when clicking X button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeConnectionModal);
  } else {
    console.warn('Modal close button not found');
  }
  
  // Close modal when clicking cancel button
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeConnectionModal);
  } else {
    console.warn('Modal cancel button not found');
  }
  
  // Close modal when clicking outside of it
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeConnectionModal();
    }
  });
  
  // Handle form submission
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      saveConnection();
    });
  }
}

// Open connection modal for adding new connection
function openConnectionModal(connectionId = null) {
  console.log('Opening connection modal', connectionId ? `for editing connection: ${connectionId}` : 'for adding new connection');
  
  const modal = document.getElementById('connection-modal');
  const modalTitle = document.getElementById('modal-title');
  const form = document.getElementById('connection-form');
  const idField = document.getElementById('connection-id');
  const nameField = document.getElementById('connection-name');
  const relationshipField = document.getElementById('connection-relationship');
  const deleteBtn = document.querySelector('.delete-connection-btn');
  
  if (!modal) {
    console.error('Connection modal not found');
    alert('Error: Connection modal not found in the DOM');
    return;
  }
  
  if (!form) {
    console.error('Connection form not found');
    alert('Error: Connection form not found in the DOM');
    return;
  }
  
  // Reset form
  form.reset();
  
  // Check if we're editing or adding
  if (connectionId) {
    // Editing existing connection
    editingConnectionId = connectionId;
    modalTitle.textContent = 'Edit Person';
    idField.value = connectionId;
    
    // Add delete button if it doesn't exist
    if (!deleteBtn) {
      const actionDiv = document.querySelector('.modal-actions');
      if (actionDiv) {
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'btn-danger delete-connection-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', deleteConnection);
        actionDiv.appendChild(deleteButton);
        console.log('Added delete button to modal');
      } else {
        console.warn('Modal actions div not found');
      }
    } else {
      deleteBtn.style.display = 'inline-block';
    }
    
    // Check if user is authenticated
    if (!currentUser) {
      console.error('User not authenticated for loading connection data');
      showAlert('You must be logged in to edit connections', 'error');
      return;
    }
    
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
          nameField.value = data.name || '';
          relationshipField.value = data.relationship || '';
          
          // Show modal after data is loaded to ensure it's visible
          showModalWithFallback(modal);
        } else {
          console.error('Connection not found:', connectionId);
          showAlert('Connection not found', 'error');
          closeConnectionModal();
        }
      })
      .catch((error) => {
        console.error('Error fetching connection:', error);
        showAlert('Error loading connection details: ' + error.message, 'error');
      });
  } else {
    // Adding new connection
    editingConnectionId = null;
    modalTitle.textContent = 'Add New Person';
    idField.value = '';
    
    // Hide delete button if it exists
    if (deleteBtn) {
      deleteBtn.style.display = 'none';
    }
    
    // Show modal immediately for adding new connection
    showModalWithFallback(modal);
  }
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
    // Reset all visibility settings
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

// Save connection to Firestore
function saveConnection() {
  console.log('Attempting to save connection');
  
  if (!currentUser) {
    console.error('No current user for saving connection');
    showAlert('You must be logged in to save connections', 'error');
    return;
  }
  
  // Ensure Firestore is initialized
  if (!firebase.firestore) {
    console.error('Firestore is not initialized');
    showAlert('Firebase Firestore is not available', 'error');
    return;
  }
  
  const idField = document.getElementById('connection-id');
  const nameField = document.getElementById('connection-name');
  const relationshipField = document.getElementById('connection-relationship');
  
  if (!nameField) {
    console.error('Name field not found');
    return;
  }
  
  if (!relationshipField) {
    console.error('Relationship field not found');
    return;
  }
  
  const name = nameField.value.trim();
  const relationship = relationshipField.value;
  
  console.log('Form data:', { name, relationship });
  
  if (!name) {
    showAlert('Please enter a name', 'error');
    return;
  }
  
  if (!relationship) {
    showAlert('Please select a relationship', 'error');
    return;
  }
  
  showLoading('Saving connection...');
  
  const connectionData = {
    name: name,
    relationship: relationship,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  
  // If new connection, add createdAt field
  if (!editingConnectionId) {
    connectionData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  }
  
  const connectionId = editingConnectionId || idField.value;
  const isNewConnection = !connectionId;
  
  console.log(`Saving ${isNewConnection ? 'new' : 'existing'} connection:`, connectionData);
  
  // Reference to the connections collection
  const connectionsRef = firebase.firestore()
    .collection('users')
    .doc(currentUser.uid)
    .collection('connections');
  
  // Save to Firestore
  let savePromise;
  if (isNewConnection) {
    console.log('Adding new connection to Firestore');
    savePromise = connectionsRef.add(connectionData);
  } else {
    console.log(`Updating existing connection: ${connectionId}`);
    savePromise = connectionsRef.doc(connectionId).update(connectionData);
  }
  
  savePromise
    .then((result) => {
      console.log(`Connection ${isNewConnection ? 'added' : 'updated'} successfully`, result);
      hideLoading();
      showAlert(`Person ${isNewConnection ? 'added' : 'updated'} successfully`, 'success');
      closeConnectionModal();
      // Wait a moment before refreshing the list
      setTimeout(() => {
        loadUserConnections(); // Refresh the list
      }, 500);
    })
    .catch((error) => {
      console.error(`Error ${isNewConnection ? 'adding' : 'updating'} connection:`, error);
      hideLoading();
      showAlert(`Error saving connection: ${error.message}`, 'error');
    });
}

// Delete connection from Firestore
function deleteConnection() {
  if (!currentUser || !editingConnectionId) {
    showAlert('Cannot delete connection', 'error');
    return;
  }
  
  if (!confirm('Are you sure you want to delete this connection? This cannot be undone.')) {
    return;
  }
  
  showLoading('Deleting connection...');
  
  firebase.firestore()
    .collection('users')
    .doc(currentUser.uid)
    .collection('connections')
    .doc(editingConnectionId)
    .delete()
    .then(() => {
      hideLoading();
      showAlert('Connection deleted successfully', 'success');
      closeConnectionModal();
      loadUserConnections(); // Refresh the list
    })
    .catch((error) => {
      hideLoading();
      console.error('Error deleting connection:', error);
      showAlert(`Error deleting connection: ${error.message}`, 'error');
    });
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
    console.error('No user available for loading connections');
    showConnectionsError('Authentication error. Please refresh the page.');
    return;
  }
  
  const userUid = currentUser.uid;
  const connectionsContainer = document.querySelector('.connections-list');
  
  if (!connectionsContainer) {
    console.error('Connections container not found');
    return;
  }
  
  // Hide any existing no connections messages before showing the loading spinner
  hideEmptyState('connections');
  
  connectionsContainer.innerHTML = `
    <li class="loading-item">
      <div class="loading-spinner"></div>
      <span>Loading your connections...</span>
    </li>
  `;
  
  try {
    console.log('Loading connections for user', userUid);
    const connectionsRef = firebase.firestore()
      .collection('users')
      .doc(userUid)
      .collection('connections');
    
    const snapshot = await connectionsRef.get();
    
    // Start with an empty container
    connectionsContainer.innerHTML = '';
    
    if (snapshot.empty) {
      console.log('No connections found for user');
            displayEmptyStates('connections');
            return;
          }
          
    // Process all connections
          const connections = [];
    snapshot.forEach(doc => {
      connections.push({
        id: doc.id,
        ...doc.data(),
        created: doc.data().created || doc.data().createdAt || new Date(0)
      });
    });
    
    // Hide any static empty state messages in the DOM
    hideEmptyState('connections');
    
    // Sort by most recently created first
          connections.sort((a, b) => {
      const dateA = a.created instanceof Date ? a.created : a.created.toDate();
      const dateB = b.created instanceof Date ? b.created : b.created.toDate();
      return dateB - dateA;
    });
    
    // Only show the first 3 connections
    const displayConnections = connections.slice(0, 3);
    
    // Add connections to container
    displayConnections.forEach(connection => {
      // Format relationship text
      const relationshipText = connection.relationship === 'other' && connection.otherRelationship
        ? connection.otherRelationship
        : capitalizeFirstLetter(connection.relationship || 'friend');
      
      // Choose icon based on relationship
      let relationshipIcon = 'fa-user-friends';
      if (connection.relationship === 'family') relationshipIcon = 'fa-home';
      else if (connection.relationship === 'partner') relationshipIcon = 'fa-heart';
      else if (connection.relationship === 'colleague') relationshipIcon = 'fa-briefcase';
      else if (connection.relationship === 'acquaintance') relationshipIcon = 'fa-handshake';
            
            const connectionItem = document.createElement('li');
      connectionItem.className = 'connection-item animate__animated animate__fadeIn';
      connectionItem.setAttribute('data-id', connection.id);
      
            connectionItem.innerHTML = `
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
          <div class="connection-action message-action" title="Create message">
            <i class="fas fa-paper-plane"></i>
          </div>
          <div class="connection-action edit-action" title="Edit connection">
            <i class="fas fa-pencil-alt"></i>
          </div>
        </div>
      `;
      
      // Add click event to the main item to view connection
      connectionItem.addEventListener('click', function(e) {
        // Only proceed if not clicking on an action button
        if (!e.target.closest('.connection-action')) {
          // Show connection details or open message creation
          createMessageForConnection(connection);
        }
      });
      
      // Add click event to message action button (paper airplane)
      const messageAction = connectionItem.querySelector('.message-action');
      if (messageAction) {
        messageAction.addEventListener('click', (e) => {
          e.stopPropagation();
          createMessageForConnection(connection);
        });
      }
      
      // Add click event to edit action button (pencil)
      const editAction = connectionItem.querySelector('.edit-action');
      if (editAction) {
        editAction.addEventListener('click', (e) => {
          e.stopPropagation();
          openConnectionModal(connection.id);
        });
      }
      
      connectionsContainer.appendChild(connectionItem);
    });
    
    // Add "View all" button if there are more connections
    if (connections.length > 3) {
      const viewAllItem = document.createElement('li');
      viewAllItem.className = 'view-all-item';
      viewAllItem.innerHTML = `
        <button class="view-all-button">
          <i class="fas fa-users"></i> View All Connections (${connections.length})
        </button>
      `;
      
      viewAllItem.addEventListener('click', () => {
        // Show all connections modal
        showAllConnectionsModal(connections);
      });
      
      connectionsContainer.appendChild(viewAllItem);
    }
    
    // Add "Add connection" button at the end
    const addConnectionItem = document.createElement('li');
    addConnectionItem.className = 'add-connection-item';
    addConnectionItem.innerHTML = `
      <button class="add-connection-button">
        <i class="fas fa-plus"></i> Add New Connection
      </button>
    `;
    
    addConnectionItem.addEventListener('click', () => {
      openConnectionModal();
    });
    
    connectionsContainer.appendChild(addConnectionItem);
    
    console.log(`Displayed ${displayConnections.length} of ${connections.length} connections`);
  } catch (error) {
    console.error('Error loading connections:', error);
    connectionsContainer.innerHTML = `
      <li class="error-state">
        <div class="error-icon"><i class="fas fa-exclamation-triangle"></i></div>
        <div class="error-message">
          <p>Couldn't load your connections</p>
          <button class="retry-button" id="retry-connections-btn">Retry</button>
        </div>
      </li>
    `;
    
    const retryBtn = document.getElementById('retry-connections-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => loadUserConnections());
    }
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
async function loadUserMessages() {
  if (!currentUser) {
    console.error('No user available for loading messages');
    showMessagesError('Authentication error. Please refresh the page.');
    return;
  }
  
  const userUid = currentUser.uid;
  const messagesContainer = document.querySelector('.messages-list');
  
  if (!messagesContainer) {
    console.error('Messages container not found');
    return;
  }
  
  // Hide any existing no messages messages before showing the loading spinner
  hideEmptyState('messages');
  
  messagesContainer.innerHTML = `
    <li class="loading-item">
      <div class="loading-spinner"></div>
      <span>Loading your messages...</span>
    </li>
  `;
  
  try {
    console.log('Loading messages for user', userUid);
    const messagesRef = firebase.firestore()
    .collection('users')
      .doc(userUid)
    .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(10);
    
    const snapshot = await messagesRef.get();
    
    // Start with an empty container
    messagesContainer.innerHTML = '';
    
    if (snapshot.empty) {
      console.log('No messages found for user');
          displayEmptyStates('messages');
          return;
        }
        
    // Process all messages
        const messages = [];
    snapshot.forEach(doc => {
            const data = doc.data();
      messages.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp || new Date(0)
      });
    });
    
    // Hide any static empty state messages in the DOM
    hideEmptyState('messages');
    
    // Get all connection information for message recipients
    const connectionIds = new Set(messages.filter(m => m.connectionId).map(m => m.connectionId));
    let connectionMap = {};
    
    if (connectionIds.size > 0) {
      try {
        const connectionsSnapshot = await Promise.all(
          Array.from(connectionIds).map(id => 
            firebase.firestore()
              .collection('users')
              .doc(userUid)
              .collection('connections')
              .doc(id)
              .get()
          )
        );
        
        connectionsSnapshot.forEach(doc => {
          if (doc.exists) {
            connectionMap[doc.id] = doc.data();
          }
        });
      } catch (error) {
        console.error('Error loading connection details for messages:', error);
      }
    }
    
    // Only show the first 3 messages
    const displayMessages = messages.slice(0, 3);
    
    // Add messages to container
    displayMessages.forEach(message => {
      // Get recipient info
      let recipientName = message.recipientName || 'Unknown';
      let relationship = message.relationship || 'friend';
      
      // Use connection data if available
      if (message.connectionId && connectionMap[message.connectionId]) {
        const connection = connectionMap[message.connectionId];
        recipientName = connection.name || recipientName;
        relationship = connection.relationship || relationship;
      }
      
      // Format date
      const messageDateText = message.timestamp instanceof Date 
        ? formatDate(message.timestamp) 
        : formatDate(message.timestamp.toDate());
      
      // Get message type
      const messageType = message.type || 'general';
      const intentLabel = formatIntentTag(messageType);
      
      // Truncate content
      const truncatedContent = message.content
        ? message.content.substring(0, 60) + (message.content.length > 60 ? '...' : '')
        : 'No message content';
      
      const messageItem = document.createElement('li');
      messageItem.className = 'message-item animate__animated animate__fadeIn';
      messageItem.setAttribute('data-id', message.id);
      
      messageItem.innerHTML = `
        <div class="message-content">
          <div class="message-header">
            <span class="message-recipient">${recipientName}</span>
            <span class="message-date">${messageDateText}</span>
          </div>
          <div class="message-body">${truncatedContent}</div>
          <div class="message-footer">
            <span class="message-intent">${intentLabel}</span>
          </div>
        </div>
        <div class="message-action" title="View message">
          <i class="fas fa-eye"></i>
        </div>
      `;
      
      // Add click event to view message
      messageItem.addEventListener('click', function(e) {
        if (!e.target.closest('.message-action')) {
          viewMessage(message.id);
        }
      });
      
      // Add click event to action button
      const actionButton = messageItem.querySelector('.message-action');
      if (actionButton) {
        actionButton.addEventListener('click', (e) => {
          e.stopPropagation();
          viewMessage(message.id);
        });
      }
      
      messagesContainer.appendChild(messageItem);
    });
    
    // Add "View all" button if there are more messages
    if (messages.length > 3) {
      const viewAllItem = document.createElement('li');
      viewAllItem.className = 'view-all-item';
      viewAllItem.innerHTML = `
        <button class="view-all-button">
          <i class="fas fa-list"></i> View All Messages (${messages.length})
        </button>
      `;
      
      viewAllItem.addEventListener('click', () => {
        // Show all messages modal
        showAllMessagesModal(messages, connectionMap);
      });
      
      messagesContainer.appendChild(viewAllItem);
    }
    
    // Add "Create message" button at the end
    const createMessageItem = document.createElement('li');
    createMessageItem.className = 'create-message-item';
    createMessageItem.innerHTML = `
      <button class="create-message-button">
        <i class="fas fa-magic"></i> Create New Message
      </button>
    `;
    
    createMessageItem.addEventListener('click', () => {
      window.location.href = 'message-intent-new.html';
    });
    
    messagesContainer.appendChild(createMessageItem);
    
    console.log(`Displayed ${displayMessages.length} of ${messages.length} messages`);
  } catch (error) {
    console.error('Error loading messages:', error);
    messagesContainer.innerHTML = `
      <li class="error-state">
        <div class="error-icon"><i class="fas fa-exclamation-triangle"></i></div>
        <div class="error-message">
          <p>Couldn't load your messages</p>
          <button class="retry-button" id="retry-messages-btn">Retry</button>
        </div>
      </li>
    `;
    
    const retryBtn = document.getElementById('retry-messages-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => loadUserMessages());
    }
  }
}

// Show all messages in a modal
function showAllMessagesModal(messages, connectionMap) {
  // Create modal element
  let modalElement = document.getElementById('all-messages-modal');
  
  if (!modalElement) {
    modalElement = document.createElement('div');
    modalElement.id = 'all-messages-modal';
    modalElement.className = 'modal';
    document.body.appendChild(modalElement);
  }
  
  // Generate message items HTML
  const messagesHTML = messages.map(message => {
    // Get recipient info
    let recipientName = message.recipientName || 'Unknown';
    
    // Use connection data if available
    if (message.connectionId && connectionMap[message.connectionId]) {
      const connection = connectionMap[message.connectionId];
      recipientName = connection.name || recipientName;
    }
    
    // Format date
    const messageDateText = message.timestamp instanceof Date 
      ? formatDate(message.timestamp) 
      : formatDate(message.timestamp.toDate());
    
    // Get message type
    const messageType = message.type || 'general';
    const intentLabel = formatIntentTag(messageType);
    
    // Truncate content
    const truncatedContent = message.content
      ? message.content.substring(0, 100) + (message.content.length > 100 ? '...' : '')
      : 'No message content';
    
    return `
      <div class="modal-message-item" data-id="${message.id}">
        <div class="message-content">
            <div class="message-header">
            <span class="message-recipient">${recipientName}</span>
            <span class="message-date">${messageDateText}</span>
            </div>
          <div class="message-body">${truncatedContent}</div>
          <div class="message-footer">
            <span class="message-intent">${intentLabel}</span>
              </div>
        </div>
        <div class="message-actions">
          <button class="message-action view-btn" title="View message">
            <i class="fas fa-eye"></i>
          </button>
          <button class="message-action edit-btn" title="Edit message">
            <i class="fas fa-pencil-alt"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  // Populate modal content
  modalElement.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">All Messages</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="modal-messages-list">
          ${messagesHTML}
        </div>
      </div>
      <div class="modal-footer">
        <button class="modal-create-button">
          <i class="fas fa-magic"></i> Create New Message
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
  
  // Create new message button
  const createButton = modalElement.querySelector('.modal-create-button');
  if (createButton) {
    createButton.addEventListener('click', () => {
      modalElement.style.display = 'none';
      window.location.href = 'message-intent-new.html';
    });
  }
  
  // View buttons
  const viewButtons = modalElement.querySelectorAll('.view-btn');
  viewButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = button.closest('.modal-message-item');
      const messageId = item.getAttribute('data-id');
      
      modalElement.style.display = 'none';
      viewMessage(messageId);
    });
  });
  
  // Edit buttons
  const editButtons = modalElement.querySelectorAll('.edit-btn');
  editButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = button.closest('.modal-message-item');
      const messageId = item.getAttribute('data-id');
      const message = messages.find(m => m.id === messageId);
      
      if (message) {
        modalElement.style.display = 'none';
        editMessage(message, connectionMap);
      }
    });
  });
  
  // Make message items clickable to view
  const messageItems = modalElement.querySelectorAll('.modal-message-item');
  messageItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (!e.target.closest('.message-action')) {
        const messageId = item.getAttribute('data-id');
        
        modalElement.style.display = 'none';
        viewMessage(messageId);
      }
    });
  });
}

// View a message
function viewMessage(messageId) {
  localStorage.setItem('viewingMessageId', messageId);
  window.location.href = 'message-result-new.html?id=' + messageId;
}

// Edit a message
function editMessage(message, connectionMap) {
  // Get recipient info
  let recipientName = message.recipientName || 'Unknown';
  let relationship = message.relationship || 'friend';
  
  // Use connection data if available
  if (message.connectionId && connectionMap[message.connectionId]) {
    const connection = connectionMap[message.connectionId];
    recipientName = connection.name || recipientName;
    relationship = connection.relationship || relationship;
  }
  
  localStorage.setItem('editingMessageId', message.id);
  localStorage.setItem('recipientData', JSON.stringify({
    name: recipientName,
    relationship: relationship
  }));
  
  window.location.href = 'message-tone-new.html?edit=true';
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