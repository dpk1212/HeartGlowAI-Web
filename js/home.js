// Global variables
let currentUser = null;

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
  
  // Set permissions to allow access during development
  // This is a temporary fix until proper security rules are deployed
  if (firebase.firestore) {
    firebase.firestore().settings({
      ignoreUndefinedProperties: true,
      // This allows temporary bypass of security rules
      experimentalForceLongPolling: true
    });
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
    // Make the debug console visible
    document.getElementById('debug-console').style.display = 'block';
    
    // Initialize UI elements that don't depend on Firestore data
    initNavigationButtons();
    initializeQuickActions();
    initializeManageButtons();
    
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
    
    // Display empty states for the data sections
    displayEmptyStates();
    
    // Try to load data, but don't let failures stop the page from working
    try {
      loadUserConnections();
    } catch (error) {
      console.error('Error loading connections:', error);
      if (typeof debugLog === 'function') {
        debugLog('Error loading connections: ' + error.message);
      }
      showConnectionsError(error.message);
    }
    
    try {
      loadUserMessages();
    } catch (error) {
      console.error('Error loading messages:', error);
      if (typeof debugLog === 'function') {
        debugLog('Error loading messages: ' + error.message);
      }
      showMessagesError(error.message);
    }
    
    try {
      loadUserReminders();
    } catch (error) {
      console.error('Error loading reminders:', error);
      if (typeof debugLog === 'function') {
        debugLog('Error loading reminders: ' + error.message);
      }
      showRemindersError(error.message);
    }
  } catch (error) {
    console.error('Error in initializeHomePage:', error);
    showAlert('Error initializing dashboard. Please refresh the page.', 'error');
    if (typeof debugLog === 'function') {
      debugLog('Home page initialization error: ' + error.message);
      document.getElementById('debug-console').style.display = 'block';
    }
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
      // For now, just scroll to the section
      const connectionsSection = document.querySelector('.dashboard-section:nth-child(3)');
      if (connectionsSection) {
        connectionsSection.scrollIntoView({ behavior: 'smooth' });
      }
      // In a full implementation, this might open a modal or navigate to a separate page
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

// Display empty states for data sections when data can't be loaded
function displayEmptyStates() {
  const connectionsList = document.getElementById('connections-list');
  if (connectionsList) {
    connectionsList.innerHTML = `
      <li class="empty-state">
        <div class="empty-icon"><i class="fas fa-user-friends"></i></div>
        <div class="empty-title">No connections yet</div>
        <div class="empty-description">Save people to your connections when sending messages</div>
        <a href="emotional-entry.html" class="empty-action">
          <i class="fas fa-plus-circle"></i> Create a message
        </a>
      </li>
    `;
  }
  
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
        <button class="error-action secondary" onclick="document.getElementById('debug-console').style.display='block'">Show Details</button>
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
        <button class="error-action secondary" onclick="document.getElementById('debug-console').style.display='block'">Show Details</button>
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
        <button class="error-action secondary" onclick="document.getElementById('debug-console').style.display='block'">Show Details</button>
      </div>
    `;
  }
}

// Load user's connections from Firestore
function loadUserConnections() {
  if (!currentUser) {
    console.warn('No current user for loading connections');
    return;
  }
  
  const connectionsList = document.getElementById('connections-list');
  if (!connectionsList) {
    console.warn('Connections list element not found');
    return;
  }
  
  try {
    console.log('Loading user connections...');
    
    // First, check if the user document exists, if not create it
    firebase.firestore()
      .collection('users')
      .doc(currentUser.uid)
      .get()
      .then((docSnapshot) => {
        if (!docSnapshot.exists) {
          // Create the user document if it doesn't exist
          return firebase.firestore()
            .collection('users')
            .doc(currentUser.uid)
            .set({
              displayName: currentUser.displayName || 'User',
              email: currentUser.email,
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
              console.log('Created user document');
              // Show empty connections since this is a new user
              connectionsList.innerHTML = `
                <li class="empty-state">
                  <div class="empty-icon"><i class="fas fa-user-friends"></i></div>
                  <div class="empty-title">No connections yet</div>
                  <div class="empty-description">Save people to your connections when sending messages</div>
                  <a href="emotional-entry.html" class="empty-action">
                    <i class="fas fa-plus-circle"></i> Create a message
                  </a>
                </li>
              `;
            });
        }
      })
      .catch((error) => {
        console.error('Error checking user document:', error);
        // Continue anyway to try fetching connections
      })
      .finally(() => {
        // Now try to fetch connections
        firebase.firestore()
          .collection('users')
          .doc(currentUser.uid)
          .collection('connections')
          .orderBy('name', 'asc')
          .limit(10)
          .get()
          .then((querySnapshot) => {
            // Clear loading indicator
            connectionsList.innerHTML = '';
            
            if (querySnapshot.empty) {
              // Show empty state
              connectionsList.innerHTML = `
                <li class="empty-state">
                  <div class="empty-icon"><i class="fas fa-user-friends"></i></div>
                  <div class="empty-title">No connections yet</div>
                  <div class="empty-description">Save people to your connections when sending messages</div>
                  <a href="emotional-entry.html" class="empty-action">
                    <i class="fas fa-plus-circle"></i> Create a message
                  </a>
                </li>
              `;
              return;
            }
            
            // Add connections to the list
            querySnapshot.forEach((doc) => {
              const connectionData = doc.data();
              
              // Get initials for avatar
              const initials = getInitials(connectionData.name);
              
              // Get last message timestamp if available
              let lastMessageText = 'No messages yet';
              if (connectionData.lastMessageDate) {
                const lastMessageDate = connectionData.lastMessageDate.toDate();
                const timeAgo = getTimeAgo(lastMessageDate);
                lastMessageText = `Last message ${timeAgo}`;
              }
              
              // Create connection item
              const connectionItem = document.createElement('li');
              connectionItem.className = 'connection-item';
              connectionItem.innerHTML = `
                <div class="connection-avatar">${initials}</div>
                <div class="connection-details">
                  <div class="connection-name">${connectionData.name}</div>
                  <div class="connection-meta">
                    <span class="connection-relation">${capitalizeFirstLetter(connectionData.relationship || 'Contact')}</span>
                    <span class="connection-last-message">${lastMessageText}</span>
                  </div>
                </div>
                <div class="connection-actions">
                  <div class="connection-action send-message" title="Send Message">
                    <i class="fas fa-paper-plane"></i>
                  </div>
                  <div class="connection-action view-history" title="View History">
                    <i class="fas fa-history"></i>
                  </div>
                </div>
              `;
              
              // Add connection ID as data attribute
              connectionItem.setAttribute('data-id', doc.id);
              
              // Add click handlers for the connection item and its actions
              const sendMessageBtn = connectionItem.querySelector('.send-message');
              const viewHistoryBtn = connectionItem.querySelector('.view-history');
              
              if (sendMessageBtn) {
                sendMessageBtn.addEventListener('click', function(e) {
                  e.stopPropagation(); // Prevent triggering the parent click
                  // Store recipient data for message flow
                  localStorage.setItem('recipientData', JSON.stringify({
                    id: doc.id,
                    name: connectionData.name,
                    relationship: connectionData.relationship,
                    isExisting: true
                  }));
                  // Navigate to message intent page
                  window.location.href = 'message-intent.html';
                });
              }
              
              if (viewHistoryBtn) {
                viewHistoryBtn.addEventListener('click', function(e) {
                  e.stopPropagation(); // Prevent triggering the parent click
                  // Navigate to history page filtered for this connection
                  window.location.href = `history.html?connectionId=${doc.id}`;
                });
              }
              
              connectionsList.appendChild(connectionItem);
            });
            
            console.log('Connections loaded successfully');
          })
          .catch((error) => {
            console.error('Error loading connections:', error);
            showConnectionsError(error.message);
            if (typeof debugLog === 'function') {
              debugLog('Error loading connections: ' + error.message);
              document.getElementById('debug-console').style.display = 'block';
            }
          });
      });
  } catch (error) {
    console.error('Exception in loadUserConnections:', error);
    showConnectionsError(error.message);
    if (typeof debugLog === 'function') {
      debugLog('Exception in loadUserConnections: ' + error.message);
      document.getElementById('debug-console').style.display = 'block';
    }
  }
}

// Load user's recent messages from Firestore
function loadUserMessages() {
  if (!currentUser) return;
  
  const recentMessages = document.getElementById('recent-messages');
  if (!recentMessages) return;
  
  // Query Firestore for user's messages
  firebase.firestore()
    .collection('users')
    .doc(currentUser.uid)
    .collection('messages')
    .orderBy('createdAt', 'desc')
    .limit(5)
    .get()
    .then((querySnapshot) => {
      // Clear loading indicator
      recentMessages.innerHTML = '';
      
      if (querySnapshot.empty) {
        // Show empty state
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
        return;
      }
      
      // Add messages to the list
      querySnapshot.forEach((doc) => {
        const messageData = doc.data();
        
        // Format date
        let dateText = 'Recently';
        if (messageData.createdAt) {
          const messageDate = messageData.createdAt.toDate();
          dateText = formatDate(messageDate);
        }
        
        // Create message preview (truncate if too long)
        let messagePreview = messageData.content || '';
        if (messagePreview.length > 120) {
          messagePreview = messagePreview.substring(0, 120) + '...';
        }
        
        // Create tags array
        const tags = [];
        if (messageData.intent) {
          tags.push(formatIntentTag(messageData.intent));
        }
        if (messageData.tone) {
          tags.push(capitalizeFirstLetter(messageData.tone));
        }
        
        // Create message item
        const messageItem = document.createElement('li');
        messageItem.className = 'message-item';
        messageItem.setAttribute('data-id', doc.id);
        messageItem.innerHTML = `
          <div class="message-header">
            <div class="message-recipient">${messageData.recipientName || 'Unknown Recipient'}</div>
            <div class="message-date">${dateText}</div>
          </div>
          <div class="message-preview">${messagePreview}</div>
          ${tags.length > 0 ? `
            <div class="message-tags">
              ${tags.map(tag => `<div class="message-tag">${tag}</div>`).join('')}
            </div>
          ` : ''}
        `;
        
        // Add click handler
        messageItem.addEventListener('click', function() {
          // In a full implementation, this would navigate to a message detail page
          localStorage.setItem('viewMessageId', doc.id);
          window.location.href = `view-message.html?id=${doc.id}`;
        });
        
        recentMessages.appendChild(messageItem);
      });
    })
    .catch((error) => {
      console.error('Error loading messages:', error);
      showMessagesError(error.message);
    });
}

// Load user's reminders from Firestore
function loadUserReminders() {
  if (!currentUser) return;
  
  const remindersList = document.getElementById('reminders-list');
  if (!remindersList) return;
  
  try {
    // Get current date for comparison
    const now = new Date();
    
    // First, ensure the user document and subcollections exist
    firebase.firestore()
      .collection('users')
      .doc(currentUser.uid)
      .get()
      .then((docSnapshot) => {
        if (!docSnapshot.exists) {
          // If the user document doesn't exist yet, just show empty state
          remindersList.innerHTML = `
            <div class="empty-state">
              <div class="empty-icon"><i class="fas fa-bell"></i></div>
              <div class="empty-title">No upcoming reminders</div>
              <div class="empty-description">Set reminders when sending messages to stay connected</div>
            </div>
          `;
          return;
        }
        
        // Now try to fetch reminders
        return firebase.firestore()
          .collection('users')
          .doc(currentUser.uid)
          .collection('reminders')
          .where('isComplete', '==', false)
          .where('reminderDate', '>=', now)
          .orderBy('reminderDate', 'asc')
          .limit(5)
          .get()
          .then((querySnapshot) => {
            // Clear loading indicator
            remindersList.innerHTML = '';
            
            if (querySnapshot.empty) {
              // Show empty state
              remindersList.innerHTML = `
                <div class="empty-state">
                  <div class="empty-icon"><i class="fas fa-bell"></i></div>
                  <div class="empty-title">No upcoming reminders</div>
                  <div class="empty-description">Set reminders when sending messages to stay connected</div>
                </div>
              `;
              return;
            }
            
            // Add reminders to the list
            querySnapshot.forEach((doc) => {
              const reminderData = doc.data();
              
              // Format reminder date
              let dateText = 'Soon';
              if (reminderData.reminderDate) {
                const reminderDate = reminderData.reminderDate.toDate();
                dateText = formatDate(reminderDate);
              }
              
              // Create reminder item
              const reminderItem = document.createElement('div');
              reminderItem.className = 'reminder-item';
              reminderItem.innerHTML = `
                <div class="reminder-icon">
                  <i class="fas fa-bell"></i>
                </div>
                <div class="reminder-content">
                  <div class="reminder-title">Message ${reminderData.recipientName || 'Someone'}</div>
                  <div class="reminder-date">${dateText}</div>
                  <div class="reminder-actions">
                    <div class="reminder-action message-now">Message Now</div>
                    <div class="reminder-action dismiss">Dismiss</div>
                  </div>
                </div>
              `;
              
              // Add reminder ID as data attribute
              reminderItem.setAttribute('data-id', doc.id);
              
              // Add click handlers for action buttons
              const messageNowBtn = reminderItem.querySelector('.message-now');
              const dismissBtn = reminderItem.querySelector('.dismiss');
              
              if (messageNowBtn) {
                messageNowBtn.addEventListener('click', function() {
                  // Navigate to message creation with recipient pre-selected
                  if (reminderData.connectionId) {
                    // If we have a connection ID, use it
                    firebase.firestore()
                      .collection('users')
                      .doc(currentUser.uid)
                      .collection('connections')
                      .doc(reminderData.connectionId)
                      .get()
                      .then((doc) => {
                        if (doc.exists) {
                          const connectionData = doc.data();
                          localStorage.setItem('recipientData', JSON.stringify({
                            id: reminderData.connectionId,
                            name: connectionData.name,
                            relationship: connectionData.relationship,
                            isExisting: true
                          }));
                          window.location.href = 'message-intent.html';
                        } else {
                          // If connection not found, just use the name
                          localStorage.setItem('recipientData', JSON.stringify({
                            name: reminderData.recipientName,
                            isExisting: false
                          }));
                          window.location.href = 'message-intent.html';
                        }
                      })
                      .catch((error) => {
                        console.error('Error fetching connection:', error);
                        // Fallback to just using the name
                        localStorage.setItem('recipientData', JSON.stringify({
                          name: reminderData.recipientName,
                          isExisting: false
                        }));
                        window.location.href = 'message-intent.html';
                      });
                  } else {
                    // If no connection ID, just use the name
                    localStorage.setItem('recipientData', JSON.stringify({
                      name: reminderData.recipientName,
                      isExisting: false
                    }));
                    window.location.href = 'message-intent.html';
                  }
                  
                  // Mark reminder as complete
                  markReminderComplete(doc.id);
                });
              }
              
              if (dismissBtn) {
                dismissBtn.addEventListener('click', function() {
                  // Mark reminder as complete
                  markReminderComplete(doc.id);
                  // Remove from UI
                  reminderItem.remove();
                  
                  // Check if list is now empty
                  if (remindersList.children.length === 0) {
                    remindersList.innerHTML = `
                      <div class="empty-state">
                        <div class="empty-icon"><i class="fas fa-bell"></i></div>
                        <div class="empty-title">No upcoming reminders</div>
                        <div class="empty-description">Set reminders when sending messages to stay connected</div>
                      </div>
                    `;
                  }
                });
              }
              
              remindersList.appendChild(reminderItem);
            });
          })
          .catch((error) => {
            console.error('Error loading reminders:', error);
            showRemindersError(error.message);
            if (typeof debugLog === 'function') {
              debugLog('Error loading reminders: ' + error.message);
            }
          });
      })
      .catch((error) => {
        console.error('Error checking user document for reminders:', error);
        showRemindersError(error.message);
        if (typeof debugLog === 'function') {
          debugLog('Error checking user document for reminders: ' + error.message);
        }
      });
  } catch (error) {
    console.error('Exception in loadUserReminders:', error);
    showRemindersError(error.message);
    if (typeof debugLog === 'function') {
      debugLog('Exception in loadUserReminders: ' + error.message);
    }
  }
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