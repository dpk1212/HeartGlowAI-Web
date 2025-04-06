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
  const cancelBtn = document.getElementById('cancel-connection-btn');
  
  if (!modal || !form || !cancelBtn) {
    console.warn('Connection modal elements not found');
    return;
  }
  
  // Close modal when clicking cancel button
  cancelBtn.addEventListener('click', closeConnectionModal);
  
  // Close modal when clicking outside of it
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeConnectionModal();
    }
  });
  
  // Handle form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    saveConnection();
  });
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
  
  // Add debugging elements
  console.log('Modal DOM element:', modal);
  console.log('Current modal display style:', modal.style.display);
  console.log('Computed style:', window.getComputedStyle(modal).display);
  
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
  }
  
  // Force visible modal with !important
  modal.style.cssText = 'display: flex !important; z-index: 9999 !important;';
  console.log('Modal should now be visible with display:', modal.style.display);
  
  // Add a small delay to ensure DOM updates
  setTimeout(() => {
    console.log('Modal visibility check (after timeout):', 
      modal.style.display, 
      window.getComputedStyle(modal).display, 
      window.getComputedStyle(modal).visibility
    );
  }, 100);
}

// Close connection modal
function closeConnectionModal() {
  console.log('Closing connection modal');
  const modal = document.getElementById('connection-modal');
  if (modal) {
    modal.style.display = 'none';
    console.log('Modal display style set to none');
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
    const connectionsList = document.getElementById('connections-list');
    if (connectionsList) {
      connectionsList.innerHTML = `
        <li class="empty-state">
          <div class="empty-icon"><i class="fas fa-user-friends"></i></div>
          <div class="empty-title">No people added yet</div>
          <div class="empty-description">Add important people in your life to stay connected</div>
          <button id="empty-add-connection-btn" class="create-btn" style="margin: 20px auto; display: block;">
            <i class="fas fa-plus-circle"></i> Add a Person
          </button>
        </li>
      `;
      // Add listener for the new button
      const emptyAddBtn = document.getElementById('empty-add-connection-btn');
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
    const recentMessages = document.getElementById('recent-messages');
    if (recentMessages) {
      recentMessages.innerHTML = `
        <li class="empty-state">
          <div class="empty-icon"><i class="fas fa-comment-dots"></i></div>
          <div class="empty-title">No messages yet</div>
          <div class="empty-description">Start crafting heartfelt messages to build your history</div>
          <a href="emotional-entry.html" class="empty-action">
            <i class="fas fa-pen-fancy"></i> Create your first message
          </a>
        </li>
      `;
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
  
  try {
    console.log('Loading connections for user', userUid);
    const connectionsRef = firebase.firestore()
      .collection('users')
      .doc(userUid)
      .collection('connections')
      .orderBy('created', 'desc')
      .limit(20);
    
    const snapshot = await connectionsRef.get();
    
    // Start with an empty container
    connectionsContainer.innerHTML = '';
    
    if (snapshot.empty) {
      console.log('No connections found for user');
      displayEmptyStates('connections');
      return;
    }
    
    // We have connections, so hide the no connections message even if we don't show them all
    const noConnectionsEl = document.querySelector('.no-connections-message');
    if (noConnectionsEl) {
      noConnectionsEl.style.display = 'none';
    }
    
    let connectionCount = 0;
    snapshot.forEach(doc => {
      connectionCount++;
      const connection = doc.data();
      connection.id = doc.id;
      
      // Format the connection data
      const relationshipText = connection.relationship === 'other' && connection.otherRelationship
        ? connection.otherRelationship
        : capitalizeFirstLetter(connection.relationship || 'friend');
      
      const lastMessageText = connection.lastMessage 
        ? connection.lastMessage.substring(0, 30) + (connection.lastMessage.length > 30 ? '...' : '')
        : 'No messages yet';
      
      const initials = getInitials(connection.name);
      
      // Create the connection item
      const connectionItem = document.createElement('li');
      connectionItem.className = 'connection-item';
      connectionItem.setAttribute('data-id', connection.id);
      
      // Choose icon based on relationship
      let relationshipIcon = 'fa-user-friends';
      if (connection.relationship === 'family') relationshipIcon = 'fa-home';
      else if (connection.relationship === 'partner') relationshipIcon = 'fa-heart';
      else if (connection.relationship === 'colleague') relationshipIcon = 'fa-briefcase';
      else if (connection.relationship === 'acquaintance') relationshipIcon = 'fa-handshake';
      
      connectionItem.innerHTML = `
        <div class="connection-avatar">
          <i class="fas ${relationshipIcon}"></i>
        </div>
        <div class="connection-details">
          <div class="connection-name">${connection.name}</div>
          <div class="connection-meta">
            <span class="connection-relation">${relationshipText}</span>
            <span class="connection-last-message">${lastMessageText}</span>
          </div>
        </div>
        <div class="connection-actions">
          <span class="connection-action message-action" title="Create a message">
            <i class="fas fa-paper-plane"></i>
          </span>
          <span class="connection-action edit-action" title="Edit connection">
            <i class="fas fa-pencil-alt"></i>
          </span>
        </div>
      `;
      
      // Add the connection item to the container
      connectionsContainer.appendChild(connectionItem);
      
      // Event listener for clicking on the entire connection
      connectionItem.addEventListener('click', function(e) {
        // Only proceed if not clicking on an action button
        if (!e.target.closest('.connection-action')) {
          // Navigate to message creation with this connection pre-selected
          localStorage.setItem('preselectedConnection', JSON.stringify({
            id: connection.id,
            name: connection.name,
            relationship: connection.relationship,
            otherRelationship: connection.otherRelationship || ''
          }));
          
          window.location.href = 'message-intent-new.html';
        }
      });
      
      // Event listener for the message action (airplane icon)
      const messageAction = connectionItem.querySelector('.message-action');
      if (messageAction) {
        messageAction.addEventListener('click', function(e) {
          e.stopPropagation();
          
          // Store connection info for the message creation flow
          localStorage.setItem('recipientData', JSON.stringify({
            name: connection.name,
            relationship: connection.relationship,
            otherRelationship: connection.otherRelationship || ''
          }));
          
          // Navigate to the message creation flow
          window.location.href = 'message-intent-new.html';
        });
      }
      
      // Event listener for the edit action (pencil icon)
      const editAction = connectionItem.querySelector('.edit-action');
      if (editAction) {
        editAction.addEventListener('click', function(e) {
          e.stopPropagation();
          openConnectionModal(connection.id);
        });
      }
    });
    
    console.log(`Loaded ${connectionCount} connections`);
    
    // If we have connections but none in the list (shouldn't happen), still show empty state
    if (connectionCount === 0) {
      displayEmptyStates('connections');
    }
    
  } catch (error) {
    console.error('Error loading connections:', error);
    showConnectionsError(`Failed to load connections: ${error.message}`);
  }
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
  
  try {
    console.log('Loading messages for user', userUid);
    const messagesRef = firebase.firestore()
      .collection('users')
      .doc(userUid)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(20);
    
    const snapshot = await messagesRef.get();
    
    // Start with an empty container
    messagesContainer.innerHTML = '';
    
    if (snapshot.empty) {
      console.log('No messages found for user');
      displayEmptyStates('messages');
      return;
    }
    
    // We have messages, so hide the no messages elements
    const noMessagesEl = document.querySelector('.no-messages-message');
    if (noMessagesEl) {
      noMessagesEl.style.display = 'none';
    }
    
    let messageCount = 0;
    
    // Get connection information for message recipients
    const connectionIds = new Set();
    snapshot.forEach(doc => {
      const message = doc.data();
      if (message.connectionId) {
        connectionIds.add(message.connectionId);
      }
    });
    
    // Batch get the connections if needed
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
        
        console.log('Loaded connection details for messages:', Object.keys(connectionMap).length);
      } catch (error) {
        console.error('Error loading connection details for messages:', error);
        // Continue anyway with what we have
      }
    }
    
    snapshot.forEach(doc => {
      messageCount++;
      const message = doc.data();
      message.id = doc.id;
      
      // Try to get connection info
      let recipientName = message.recipientName || 'Unknown';
      let relationship = message.relationship || 'friend';
      
      // If we have connection info, use it
      if (message.connectionId && connectionMap[message.connectionId]) {
        const connection = connectionMap[message.connectionId];
        recipientName = connection.name || recipientName;
        relationship = connection.relationship || relationship;
      }
      
      // Format the message data
      const messageDateText = message.timestamp ? formatDate(message.timestamp.toDate()) : 'Recently';
      const messageType = message.type || 'general';
      const intentTag = formatIntentTag(messageType);
      
      // Create the message item
      const messageItem = document.createElement('li');
      messageItem.className = 'message-item';
      messageItem.setAttribute('data-id', message.id);
      
      // Truncate the message content for display
      const truncatedContent = message.content
        ? message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '')
        : 'No message content';
      
      messageItem.innerHTML = `
        <div class="message-header">
          <div class="message-recipient">${recipientName}</div>
          <div class="message-date">${messageDateText}</div>
        </div>
        <div class="message-preview">${truncatedContent}</div>
        <div class="message-footer">
          <div class="message-intent">${intentTag}</div>
          <div class="message-actions">
            <span class="message-action view-action" title="View message">
              <i class="fas fa-eye"></i>
            </span>
            <span class="message-action edit-action" title="Edit message">
              <i class="fas fa-pencil-alt"></i>
            </span>
          </div>
        </div>
      `;
      
      // Add the message item to the container
      messagesContainer.appendChild(messageItem);
      
      // Event listener for clicking on the message
      messageItem.addEventListener('click', function(e) {
        // Only proceed if not clicking on an action button
        if (!e.target.closest('.message-action')) {
          // Navigate to view the message
          localStorage.setItem('viewingMessageId', message.id);
          window.location.href = 'message-result-new.html?id=' + message.id;
        }
      });
      
      // Event listener for the view action
      const viewAction = messageItem.querySelector('.view-action');
      if (viewAction) {
        viewAction.addEventListener('click', function(e) {
          e.stopPropagation();
          localStorage.setItem('viewingMessageId', message.id);
          window.location.href = 'message-result-new.html?id=' + message.id;
        });
      }
      
      // Event listener for the edit action
      const editAction = messageItem.querySelector('.edit-action');
      if (editAction) {
        editAction.addEventListener('click', function(e) {
          e.stopPropagation();
          // Store message info for editing
          localStorage.setItem('editingMessageId', message.id);
          localStorage.setItem('recipientData', JSON.stringify({
            name: recipientName,
            relationship: relationship
          }));
          window.location.href = 'message-tone-new.html?edit=true';
        });
      }
    });
    
    console.log(`Loaded ${messageCount} messages`);
    
    // If we have messages in Firestore but none in the list (shouldn't happen), still show empty state
    if (messageCount === 0) {
      displayEmptyStates('messages');
    }
    
  } catch (error) {
    console.error('Error loading messages:', error);
    showMessagesError(`Failed to load messages: ${error.message}`);
  }
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