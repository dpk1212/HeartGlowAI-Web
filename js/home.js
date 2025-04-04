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

// Display empty states for data sections (called when query is empty)
function displayEmptyStates(type) {
  if (type === 'connections') {
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
    showConnectionsError('User not authenticated.'); // Show error if no user
    return;
  }
  
  const connectionsList = document.getElementById('connections-list');
  if (!connectionsList) {
    console.warn('Connections list element not found');
    return; // Should not happen, but exit gracefully
  }
  
  // Show loading state
  connectionsList.innerHTML = `
    <li class="loading-state">
      <span class="loading-spinner"></span> Loading your connections...
    </li>
  `;
  
  try {
    console.log('Loading user connections...');
    firebase.firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('connections')
      .limit(20) // Fetch a bit more to sort
      .get()
      .then((querySnapshot) => {
        try {
          // Clear loading indicator
          connectionsList.innerHTML = '';
          
          if (querySnapshot.empty) {
            displayEmptyStates('connections');
            return;
          }
          
          // Process and sort connections client-side
          const connections = [];
          querySnapshot.forEach((doc) => {
            connections.push({ id: doc.id, data: doc.data() });
          });
          
          // Sort by name (case-insensitive)
          connections.sort((a, b) => {
            const nameA = a.data.name ? a.data.name.toLowerCase() : '';
            const nameB = b.data.name ? b.data.name.toLowerCase() : '';
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
          });
          
          // Limit to 10 after sorting
          const connectionsToDisplay = connections.slice(0, 10);

          // Add connections to the list
          connectionsToDisplay.forEach(({ id, data: connectionData }) => {
            // Add checks for potentially missing data
            const name = connectionData.name || 'Unknown Connection';
            const relationship = connectionData.relationship || 'Contact';
            
            const initials = getInitials(name);
            let lastMessageText = 'No messages yet';
            if (connectionData.lastMessageDate && typeof connectionData.lastMessageDate.toDate === 'function') {
              const lastMessageDate = connectionData.lastMessageDate.toDate();
              const timeAgo = getTimeAgo(lastMessageDate);
              lastMessageText = `Last message ${timeAgo}`;
            } else {
              console.warn('Missing or invalid lastMessageDate for connection:', id);
            }
            
            const connectionItem = document.createElement('li');
            connectionItem.className = 'connection-item';
            connectionItem.innerHTML = `
              <div class="connection-avatar">${initials}</div>
              <div class="connection-details">
                <div class="connection-name">${name}</div>
                <div class="connection-meta">
                  <span class="connection-relation">${capitalizeFirstLetter(relationship)}</span>
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
            connectionItem.setAttribute('data-id', id);
            
            const sendMessageBtn = connectionItem.querySelector('.send-message');
            const viewHistoryBtn = connectionItem.querySelector('.view-history');
            
            if (sendMessageBtn) {
              sendMessageBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                localStorage.setItem('recipientData', JSON.stringify({
                  id: id, 
                  name: name, 
                  relationship: relationship, 
                  isExisting: true
                }));
                window.location.href = 'message-intent.html';
              });
            }
            
            if (viewHistoryBtn) {
              viewHistoryBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                window.location.href = `history.html?connectionId=${id}`;
              });
            }
            
            connectionsList.appendChild(connectionItem);
          });
          
          console.log('Connections loaded and sorted successfully');
        } catch(processingError) {
          console.error('Error processing connections data:', processingError);
          showConnectionsError('Failed to display connections: ' + processingError.message);
        }
      })
      .catch((error) => {
        console.error('Error loading connections query:', error); // Changed log message
        showConnectionsError(error.message);
        if (typeof debugLog === 'function') {
          debugLog('Error loading connections query: ' + error.message);
          document.getElementById('debug-console').style.display = 'block';
        }
      });
  } catch (error) {
    console.error('Exception in loadUserConnections setup:', error); // Changed log message
    showConnectionsError(error.message);
    if (typeof debugLog === 'function') {
      debugLog('Exception in loadUserConnections setup: ' + error.message);
      document.getElementById('debug-console').style.display = 'block';
    }
  }
}

// Load user's recent messages from Firestore
function loadUserMessages() {
  if (!currentUser) {
    console.warn('No current user for loading messages');
    showMessagesError('User not authenticated.');
    return;
  }
  
  const recentMessages = document.getElementById('recent-messages');
  if (!recentMessages) {
    console.warn('Recent messages element not found');
    return;
  }
  
  // Show loading state
  recentMessages.innerHTML = `
    <li class="loading-state">
      <span class="loading-spinner"></span> Loading recent messages...
    </li>
  `;
  
  firebase.firestore()
    .collection('users')
    .doc(currentUser.uid)
    .collection('messages')
    .limit(20) // Fetch a bit more to sort
    .get()
    .then((querySnapshot) => {
      try {
        // Clear loading indicator
        recentMessages.innerHTML = '';
        
        if (querySnapshot.empty) {
          displayEmptyStates('messages');
          return;
        }
        
        // Process and sort messages client-side
        const messages = [];
        querySnapshot.forEach((doc) => {
            // Include ALL messages, with a fallback date if createdAt is missing
            const data = doc.data();
            const messageObj = { id: doc.id, data: data };
            
            // If createdAt is missing or invalid, add a fallback date
            if (!data.createdAt || typeof data.createdAt.toDate !== 'function') {
                console.log('Adding fallback date for message:', doc.id);
                messageObj.data.createdAt = { toDate: () => new Date(0) }; // Jan 1, 1970
                messageObj.hasFallbackDate = true;
            }
            
            messages.push(messageObj);
        });

        // Sort by createdAt date (descending) with special handling for fallback dates
        messages.sort((a, b) => {
          // Messages with fallback dates go to the end
          if (a.hasFallbackDate && !b.hasFallbackDate) return 1;
          if (!a.hasFallbackDate && b.hasFallbackDate) return -1;
          
          const dateA = a.data.createdAt.toDate();
          const dateB = b.data.createdAt.toDate();
          return dateB - dateA; // Descending order
        });

        // Limit to 5 after sorting
        const messagesToDisplay = messages.slice(0, 5);
        
        // Add messages to the list
        messagesToDisplay.forEach(({ id, data: messageData, hasFallbackDate }) => {
           // Add checks for potentially missing data
          const recipientName = messageData.recipientName || 'Unknown Recipient';
          const content = messageData.content || '';
          const intent = messageData.intent || 'custom';
          const tone = messageData.tone || 'neutral';
          
          let dateText = hasFallbackDate ? 'Date unknown' : 'Recently';
          
          // Use the date (which may be our fallback date)
          const messageDate = messageData.createdAt.toDate();
          if (!hasFallbackDate) {
            dateText = formatDate(messageDate);
          }
          
          let messagePreview = content;
          if (messagePreview.length > 120) {
            messagePreview = messagePreview.substring(0, 120) + '...';
          }
          const tags = [];
          if (intent) {
            tags.push(formatIntentTag(intent));
          }
          if (tone) {
            tags.push(capitalizeFirstLetter(tone));
          }
          const messageItem = document.createElement('li');
          messageItem.className = 'message-item';
          messageItem.setAttribute('data-id', id);
          messageItem.innerHTML = `
            <div class="message-header">
              <div class="message-recipient">${recipientName}</div>
              <div class="message-date">${dateText}</div>
            </div>
            <div class="message-preview">${messagePreview}</div>
            ${tags.length > 0 ? `
              <div class="message-tags">
                ${tags.map(tag => `<div class="message-tag">${tag}</div>`).join('')}
              </div>
            ` : ''}
          `;
          messageItem.addEventListener('click', function() {
            localStorage.setItem('viewMessageId', id);
            window.location.href = `view-message.html?id=${id}`;
          });
          recentMessages.appendChild(messageItem);
        });
        
        console.log('Messages loaded and sorted successfully');
      } catch(processingError) {
        console.error('Error processing messages data:', processingError);
        showMessagesError('Failed to display messages: ' + processingError.message);
      }
    })
    .catch((error) => {
      console.error('Error loading messages query:', error); // Changed log message
      showMessagesError(error.message);
    });
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