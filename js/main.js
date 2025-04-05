    // Global variables and functions
    let currentMessage = '';
    let currentInsights = [];
    let currentUser = null;
    let welcomeScreen, authScreen, homeScreen, generatorScreen, learningScreen; // Declare screen variables globally
    let messageCount = 0;
    let hasSubmittedFeedback = false;
    
    // Popup functions defined at the top of the script
    let resultPopupOverlay = null;
    let popupMessageText = null;
    let popupInsightsList = null;
    let copyMessageBtn = null;
    let closeFeedbackBtn = null;
    let resultCard = null;
    let popupFeedbackSection = null;
    let popupFeedback = null;
    let popupToneAdjustment = null;
    let popupLengthAdjustment = null;

    function initializePopupElements() {
      resultPopupOverlay = document.getElementById('resultsPopupOverlay');
      popupMessageText = document.getElementById('popupMessageText');
      popupInsightsList = document.getElementById('popupInsightsList');
      popupFeedbackSection = document.getElementById('popupFeedbackSection');
      popupFeedback = document.getElementById('popupFeedback');
      popupToneAdjustment = document.getElementById('popupToneAdjustment');
      popupLengthAdjustment = document.getElementById('popupLengthAdjustment');
      resultCard = document.getElementById('result');
    }

    // Screen transition function - updated to manage visibility classes
    function showScreen(screen) {
      const screens = [welcomeScreen, homeScreen, generatorScreen, learningScreen]; // authScreen removed
      screens.forEach(s => {
        if (s === screen) {
          s.style.display = 'flex';
          setTimeout(() => s.classList.add('active'), 50);
          
          // Add appropriate body classes for the active screen
          if (s === generatorScreen) {
            document.body.classList.add('generator-active');
          } else {
            document.body.classList.remove('generator-active');
          }
        } else {
          s.classList.remove('active');
          setTimeout(() => {
            if (!s.classList.contains('active')) {
              s.style.display = 'none';
            }
          }, 500);
        }
      });
    }

    // Initialize app function
    function initializeApp() {
      // Initialize Firebase - DO NOT hardcode credentials - use the existing configuration
      try {
        console.log('Firebase initialization check - using existing configuration');
        // Firebase is already initialized in the HTML header
        // DO NOT add API keys or credentials here - they would be exposed in GitHub
      } catch (error) {
        console.error('Firebase initialization error:', error);
      }
      
      // Initialize tab navigation
      initTabNavigation();
      
      // Initialize authentication handlers
      if (typeof initializeAuthHandlers === 'function') {
        initializeAuthHandlers();
      }
      
      // Check authentication state - use existing handler
      // The authentication state change listener should already be set up
      console.log('App initialization completed');
    }
    
    // Tab navigation functionality
    function initTabNavigation() {
      const navTabs = document.querySelectorAll('.nav-tab');
      const typeContents = document.querySelectorAll('.type-content');
      
      // If elements don't exist, log and exit early
      if (navTabs.length === 0 || typeContents.length === 0) {
        console.log("Tab navigation elements not found, skipping initialization");
        return;
      }
      
      let selectedType = 'romantic'; // Default
      console.log("Initializing tab navigation with", navTabs.length, "tabs");
      
      // Add click event to navigation tabs
      navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          console.log("Tab clicked:", tab.getAttribute('data-type'));
          
          // Update active tab
          navTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          
          // Update content visibility
          const type = tab.getAttribute('data-type');
          selectedType = type;
          typeContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${type}-content`) {
              content.classList.add('active');
            }
          });
          
          // Update selected type indicators
          const selectedTypeIcon = document.getElementById('selected-type-icon');
          const selectedTypeText = document.getElementById('selected-type-text');
          
          if (selectedTypeIcon && selectedTypeText) {
            // Set the icon based on the selected type
            if (type === 'romantic') {
              selectedTypeIcon.textContent = '❤️';
            } else if (type === 'professional') {
              selectedTypeIcon.textContent = '💼';
            } else if (type === 'personal') {
              selectedTypeIcon.textContent = '🤝';
            }
            selectedTypeText.textContent = type.charAt(0).toUpperCase() + type.slice(1);
          }
        });
      });
    }

    // Save message to history function
    async function saveMessage(scenario, relationshipType, message) {
      if (!currentUser) return false;
      
      try {
        const timestamp = new Date();
        
        await firebase.firestore()
          .collection('users')
          .doc(currentUser.uid)
          .collection('messages')
          .add({
            scenario,
            relationshipType,
            message,
            timestamp
          });
        
        console.log('Message saved to history');
        return true;
      } catch (error) {
        console.error('Error saving message:', error);
        return false;
      }
    }

    // Global functions for feedback and copy functionality
    window.showFeedback = function() {
      const feedbackSection = document.getElementById('feedbackSection');
      feedbackSection.style.display = 'block';
      document.getElementById('feedback').focus();
    };

    window.tweakMessage = async function() {
      console.log("tweakMessage called");
      
      const feedback = document.getElementById('feedback');
      if (!feedback || !feedback.value.trim()) {
        showAlert("Please provide feedback for the message", 'error');
        return;
      }
      
      const feedbackText = feedback.value.trim();

      if (!currentUser) {
        showAlert("Please sign in to generate messages", 'error');
        return;
      }

      const scenario = document.getElementById('scenario')?.value.trim() || '';
      const relationship = document.getElementById('relationship')?.value || '';
      const tone = document.getElementById('tone')?.value || '';
      const intensity = document.getElementById('intensity')?.value || '';
      const duration = document.getElementById('duration')?.value || '';
      const circumstances = document.getElementById('circumstances')?.value.trim() || '';
      
      // Safely access loading and result elements
      const loadingSpinner = document.getElementById('loading');
      const resultCard = document.getElementById('result');
      
      // Show loading state
      if (loadingSpinner) {
      loadingSpinner.style.display = "flex";
      } else {
        console.warn("Loading spinner element not found");
      }
      
      // Hide result card
      if (resultCard) {
      resultCard.style.display = "none";
      } else {
        console.warn("Result card element not found");
      }
      
      // Also hide the popup if it's visible
      hideResultsPopup();
      
      try {
        // Get the current user's ID token
        const idToken = await currentUser.getIdToken();
        
        console.log("Sending tweak request:", {
          scenario,
          relationship,
          tone,
          intensity,
          duration,
          circumstances,
          previousMessage: currentMessage,
          feedbackText
        });

        const response = await fetch('https://us-central1-heartglowai.cloudfunctions.net/generateMessage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({
            scenario,
            relationshipType: relationship,
            tone,
            toneIntensity: intensity,
            relationshipDuration: duration,
            specialCircumstances: circumstances,
            previousMessage: currentMessage,
            userFeedback: feedbackText
          })
        });

        const data = await response.json();
        console.log("Tweak response:", data);
        
        if (response.ok) {
          // Update current message
          currentMessage = data.message;
          
          // Initialize popup elements if needed
          if (!popupMessageText) {
            initializePopupElements();
          }
          
          // Update popup content
          if (popupMessageText) {
            popupMessageText.textContent = data.message;
          }
          
          // Update popup insights
          if (popupInsightsList) {
            popupInsightsList.innerHTML = '';
            if (data.insights && data.insights.length > 0) {
              data.insights.forEach(insight => {
                const li = document.createElement('li');
                li.textContent = insight;
                popupInsightsList.appendChild(li);
              });
            }
          }
          
          // Update original card content (for compatibility)
          const messageText = document.getElementById('messageText');
          const insightsList = document.getElementById('insightsList');
          const feedbackSection = document.getElementById('feedbackSection');
          
          if (messageText) {
          messageText.textContent = data.message;
          }
          
          // Clear and populate insights in the original card
          if (insightsList) {
          insightsList.innerHTML = '';
          if (data.insights && data.insights.length > 0) {
            data.insights.forEach(insight => {
              const li = document.createElement('li');
              li.className = 'insight-item';
              li.textContent = insight;
              insightsList.appendChild(li);
            });
            }
          }
          
          // Reset feedback
          if (feedback) {
            feedback.value = '';
          }
          
          if (feedbackSection) {
          feedbackSection.style.display = 'none';
          }
          
          // Hide loading
          if (loadingSpinner) {
          loadingSpinner.style.display = "none";
          }
          
          // Show the results in the popup
          showResultsPopup();
          
          // Save message to history if user is authenticated
          if (currentUser) {
            await saveMessage(scenario, relationship, data.message);
          }
          
          // Safely update message count
          try {
            if (typeof updateMessageCount === 'function') {
              await updateMessageCount();
            } else {
              console.log('updateMessageCount function not available');
            }
          } catch (err) {
            console.log('Error updating message count:', err);
            // Non-critical error, continue
          }
        } else {
          throw new Error(data.error || 'Failed to generate message');
        }
      } catch (error) {
        console.error('Error generating tweaked message:', error);
        
        // Hide loading spinner
        if (loadingSpinner) {
        loadingSpinner.style.display = "none";
        }
        
        // Enhanced error handling
        if (error.message?.includes('authenticated')) {
          showAlert('Please sign in to generate messages', 'error');
        } else if (error.message?.includes('Failed to fetch') || error.message?.includes('Network error')) {
          showAlert('Network error - please check your connection', 'error');
        } else if (error.response?.status === 401) {
          showAlert('Authentication error - please sign in again', 'error');
        } else if (error.response?.status === 403) {
          showAlert('Permission denied - please contact support', 'error');
        } else {
          showAlert(error.message || 'Failed to generate message', 'error');
        }
      }
    };

    window.copyMessage = function() {
      const messageText = document.getElementById('messageText').textContent;
      navigator.clipboard.writeText(messageText).then(() => {
        showAlert('Message copied to clipboard!', 'success');
      }).catch(err => {
        console.error('Failed to copy:', err);
        showAlert('Failed to copy message', 'error');
      });
    };

    // Global function for showing alerts
    function showAlert(message, type = 'error') {
      const alertEl = document.createElement('div');
      alertEl.style.position = 'fixed';
      alertEl.style.top = '20px';
      alertEl.style.left = '50%';
      alertEl.style.transform = 'translateX(-50%)';
      alertEl.style.padding = '12px 24px';
      alertEl.style.borderRadius = '8px';
      alertEl.style.color = 'white';
      alertEl.style.zIndex = '1000';
      alertEl.style.maxWidth = '90%';
      alertEl.style.textAlign = 'center';
      alertEl.style.animation = 'slideIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      alertEl.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      alertEl.style.backdropFilter = 'blur(8px)';
      
      if (type === 'error') {
        alertEl.style.backgroundColor = 'rgba(255, 87, 87, 0.9)';
      } else if (type === 'success') {
        alertEl.style.backgroundColor = 'rgba(88, 214, 141, 0.9)';
      } else {
        alertEl.style.backgroundColor = 'rgba(52, 152, 219, 0.9)';
      }
      
      alertEl.textContent = message;
      document.body.appendChild(alertEl);
      
      setTimeout(() => {
        alertEl.style.transform = 'translateX(-50%) translateY(-20px)';
        alertEl.style.opacity = '0';
        alertEl.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        setTimeout(() => {
          document.body.removeChild(alertEl);
        }, 300);
      }, 3000);
    }

    document.addEventListener('DOMContentLoaded', function() {
      // Initialize the app first
      initializeApp();

      // Firebase configuration
      const firebaseConfig = {
        apiKey: "AIzaSyBZiJPTs7dMccVgFV-YoTejnhy1bZNFEQY",
        authDomain: "heartglowai.firebaseapp.com",
        projectId: "heartglowai",
        storageBucket: "heartglowai.firebasestorage.app",
        messagingSenderId: "196565711798",
        appId: "1:196565711798:web:79e2b0320fd8e74ab0df17",
        measurementId: "G-KJMPL1DNPY"
      };
      
      // Initialize Firebase only if it hasn't been initialized yet
      if (!firebase.apps.length) {
        try {
            firebase.initializeApp(firebaseConfig);
            console.log("main.js: Firebase initialized.");
        } catch (error) {
            console.error("main.js: Firebase initialization error:", error);
        }
      } else {
          console.log("main.js: Firebase already initialized (likely by inline script). Skipping init.");
      }
      
      // Initialize Firebase Analytics
      const analytics = firebase.analytics();
      
      // Track page view
      logAnalyticsEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href
      });
      
      // Get elements
      const loginRegisterBtn = document.getElementById('login-register-btn');
      console.log('Login button element:', loginRegisterBtn);
      
      // Check if user is already authenticated
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log("User already authenticated, redirecting to home page");
          // Only redirect to home page if we're on the landing page (index.html)
          // This prevents the login page from redirecting immediately after being loaded
          const isLoginPage = window.location.pathname.includes('login.html');
          if (!isLoginPage) {
            window.location.href = 'home.html';
          }
        } else {
          console.log("No authenticated user, showing welcome screen");
        }
      });
      
      // Handle login/register button click
      if (loginRegisterBtn) {
        console.log('Adding click event listener to login button');
      loginRegisterBtn.addEventListener('click', function() {
          console.log('Login/Register button clicked');
          try {
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Navigation error:', error);
            // Fallback method
            window.open('login.html', '_self');
          }
        });
        } else {
        console.error('Login button not found in the DOM');
      }
    });

    // ... existing code ...
