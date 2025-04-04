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
      const screens = [welcomeScreen, authScreen, homeScreen, generatorScreen, learningScreen];
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
      // Initialize Firebase first
      try {
        if (!firebase.apps.length) {
          const firebaseConfig = {
            apiKey: "AIzaSyDx-RCOt6KU4KFV9w-fKmIEcW0mvmQJ2Z8",
            authDomain: "heartglowai-web.firebaseapp.com",
            projectId: "heartglowai-web",
            storageBucket: "heartglowai-web.appspot.com",
            messagingSenderId: "564142355525",
            appId: "1:564142355525:web:bd10f60b9d30e518b19c0f",
            measurementId: "G-25W7SVNL3Z"
          };
          firebase.initializeApp(firebaseConfig);
          console.log('Firebase initialized successfully');
        }
      } catch (error) {
        console.error('Firebase initialization error:', error);
      }
      
      // Initialize tab navigation
      initTabNavigation();
      
      // Initialize authentication handlers
      initializeAuthHandlers();
      
      // Check authentication state
      firebase.auth().onAuthStateChanged(async (user) => {
        console.log('Auth state changed:', user ? 'Logged in' : 'Logged out');
        currentUser = user;
        
        if (user) {
          try {
            // Initialize user document if it doesn't exist
            const userRef = firebase.firestore().collection('users').doc(user.uid);
            const userDoc = await userRef.get();
            
            if (!userDoc.exists) {
              await userRef.set({
                email: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                messageCount: 0,
                hasFeedbackSubmitted: false,
                lastFeedbackSubmittedAt: null,
                feedbackData: null
              });
            }
            
            // Check feedback status
            await checkFeedbackStatus();
            
            // Use the new handleAuthSuccess function to determine navigation
            handleAuthSuccess(user);
            
            // Ensure template clicks work after auth state is determined
            attachTemplateClickListeners();
          } catch (error) {
            console.error('Error handling authenticated user:', error);
          }
        } else {
          console.log('User not authenticated, showing welcome screen');
          showScreen(welcomeScreen);
        }
      });
      
      // Initialize any additional components
      console.log('App initialization completed');
    }
    
    // Tab navigation functionality
    function initTabNavigation() {
      const navTabs = document.querySelectorAll('.nav-tab');
      const typeContents = document.querySelectorAll('.type-content');
      const nextBtn = document.getElementById('next-btn');
      
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
          
          // Update the Next button properties
          if (nextBtn) {
            nextBtn.classList.remove('hidden');
            nextBtn.style.opacity = 1;
          }
          
          // Update selected type indicators for next screen
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
      
      // Next button functionality - only set up if the button exists
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          console.log("Next button clicked with type:", selectedType);
          
          // Store the selected type for future use after authentication
          localStorage.setItem('selectedMessageType', selectedType);
          
          // Navigate to auth screen instead of message flow
          if (typeof authScreen !== 'undefined') {
            showScreen(authScreen);
          } else {
            console.error("Auth screen not defined");
          }
        });
        
        // Make sure Next button is visible by default since we already have a tab selected
        if (nextBtn.classList.contains('hidden')) {
          nextBtn.classList.remove('hidden');
        }
      } else {
        console.log("Next button not found for tab navigation");
      }
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
      
      const authForm = document.getElementById('auth-form');
      const authSubmitBtn = document.getElementById('auth-submit-btn');
      const authToggleText = document.getElementById('auth-toggle-text');
      const authToggleLink = document.getElementById('auth-toggle-link');
      const forgotPasswordLink = document.getElementById('forgot-password-link');
      
      const newConversationBtn = document.getElementById('new-conversation-btn');
      const templateCards = document.querySelectorAll('.template-card');
      const settingsBtn = document.getElementById('history-btn');
      const logoutBtn = document.getElementById('logout-btn');
      
      const backToHomeBtn = document.getElementById('back-to-home-btn');
      const scenarioInput = document.getElementById('scenario');
      const relationshipSelect = document.getElementById('relationship');
      const generateBtn = document.getElementById('generateBtn');
      const loadingSpinner = document.getElementById('loading');
      const resultCard = document.getElementById('result');
      const resultMessage = document.getElementById('messageText');
      
      // Storage keys
      const STORAGE_KEYS = {
        USER_SETTINGS: 'user_settings',
        MESSAGE_HISTORY: 'message_history'
      };
      
      // Constants
      const RELATIONSHIP_TYPES = [
        "Romantic Partner",
        "Friend",
        "Family Member",
        "Professional Contact"
      ];
      
      // Auth state
      let isLogin = true;
      let openaiApiKey = null;
      
      // Check auth state
      firebase.auth().onAuthStateChanged(async (user) => {
        currentUser = user;
        
        if (user) {
          // Initialize user document if it doesn't exist
          const userRef = firebase.firestore().collection('users').doc(user.uid);
          const userDoc = await userRef.get();
          
          if (!userDoc.exists) {
            await userRef.set({
              email: user.email,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              messageCount: 0,
              hasFeedbackSubmitted: false,
              lastFeedbackSubmittedAt: null,
              feedbackData: null
            });
          }
          
          // Check feedback status
          await checkFeedbackStatus();
          
          // Use the new handleAuthSuccess function to determine navigation
          handleAuthSuccess(user);
          
          // Ensure template clicks work after auth state is determined
          attachTemplateClickListeners();
        } else {
          showScreen(welcomeScreen);
        }
      });
      
      // Function to attach template click listeners
      function attachTemplateClickListeners() {
        const templateCards = document.querySelectorAll('.template-card');
        console.log('Attaching template listeners to', templateCards.length, 'cards');
        
        templateCards.forEach(card => {
          const templateType = card.getAttribute('data-template');
          
          // Remove any existing listeners to prevent duplicates
          const newCard = card.cloneNode(true);
          card.parentNode.replaceChild(newCard, card);
          
          newCard.addEventListener('click', function() {
            console.log('Template clicked:', templateType);
            handleTemplateClick(templateType);
          });
        });
      }
      
      // Event Listeners
      loginRegisterBtn.addEventListener('click', function() {
        showScreen(authScreen);
      });
      
      // Try without signup option
      const noSignupOption = document.querySelector('.no-signup-option');
      if (noSignupOption) {
        noSignupOption.addEventListener('click', function() {
          // Pre-fill the quick options data if selected
          const quickRelationship = document.getElementById('quick-relationship');
          const quickTone = document.getElementById('quick-tone');
          const activeTonePill = document.querySelector('.tone-pill.active');
          
          // Prepare the generator screen
          if (scenarioInput) {
            scenarioInput.value = ""; // Clear any previous input
            
            // Set relationship if selected
            if (quickRelationship && quickRelationship.value && relationshipSelect) {
              relationshipSelect.value = quickRelationship.value;
            }
            
            // Set tone if selected
            if (quickTone && quickTone.value && document.getElementById('tone')) {
              document.getElementById('tone').value = quickTone.value;
            }
            
            // Skip auth and go directly to generator
            showScreen(generatorScreen);
          }
        });
      }
      
      // Tone pill buttons
      const tonePills = document.querySelectorAll('.tone-pill');
      tonePills.forEach(pill => {
        pill.addEventListener('click', function() {
          // Remove active class from all pills
          tonePills.forEach(p => p.classList.remove('active'));
          
          // Add active class to clicked pill
          this.classList.add('active');
          
          // Optionally set the tone in the dropdown
          const quickTone = document.getElementById('quick-tone');
          if (quickTone) {
            const pillText = this.textContent.toLowerCase();
            
            // Map pill text to tone option values
            const toneMap = {
              'gentle': 'casual',
              'honest': 'serious',
              'warm': 'casual'
            };
            
            if (toneMap[pillText] && quickTone.querySelector(`option[value="${toneMap[pillText]}"]`)) {
              quickTone.value = toneMap[pillText];
            }
          }
        });
      });
      
      // Quick relationship and tone selection
      const quickRelationship = document.getElementById('quick-relationship');
      const quickTone = document.getElementById('quick-tone');
      
      if (quickRelationship) {
        quickRelationship.addEventListener('change', function() {
          // Highlight this field to show it's been selected
          this.style.borderColor = 'var(--accent-pink)';
        });
      }
      
      if (quickTone) {
        quickTone.addEventListener('change', function() {
          // Highlight this field to show it's been selected
          this.style.borderColor = 'var(--accent-pink)';
          
          // Update tone pills to match if possible
          const tonePills = document.querySelectorAll('.tone-pill');
          const selectedTone = this.value;
          
          // Simple mapping from tone values to pill text
          const toneToLabel = {
            'casual': 'Gentle',
            'formal': 'Formal',
            'humorous': 'Warm',
            'serious': 'Honest'
          };
          
          if (toneToLabel[selectedTone]) {
            tonePills.forEach(pill => {
              pill.classList.remove('active');
              if (pill.textContent === toneToLabel[selectedTone]) {
                pill.classList.add('active');
              }
            });
          }
        });
      }
      
      // Learn with AI button event listener
      const learnBtn = document.getElementById('learn-btn');
      if (learnBtn) {
        learnBtn.addEventListener('click', function() {
          // Navigate to the learn.html page
          window.location.href = 'learn.html';
        });
      }
      
      authToggleLink.addEventListener('click', function(e) {
        e.preventDefault();
        isLogin = !isLogin;
        if (isLogin) {
          authToggleText.textContent = "Don't have an account?";
          authToggleLink.textContent = "Sign up";
          authSubmitBtn.textContent = "Continue";
        } else {
          authToggleText.textContent = "Already have an account?";
          authToggleLink.textContent = "Log in";
          authSubmitBtn.textContent = "Create Account";
        }
      });
      
      forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        const email = prompt("Please enter your email address to reset your password:");
        if (email) {
          firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
              showAlert('Password reset email sent!', 'success');
            })
            .catch((error) => {
              showAlert(`Error: ${error.message}`, 'error');
            });
        }
      });
      
      authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
          showAlert('Please enter both email and password', 'error');
          return;
        }
        
        if (isLogin) {
          // Login
          firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
              // Use handleAuthSuccess instead of directly navigating
              handleAuthSuccess(userCredential.user);
            })
            .catch((error) => {
              console.error('Login error:', error);
              showAlert(`Login error: ${error.message}`, 'error');
            });
        } else {
          // Register
          firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
              // Create user document in Firestore
              return firebase.firestore().collection('users').doc(userCredential.user.uid).set({
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                messageCount: 0,
                hasFeedbackSubmitted: false,
                lastFeedbackSubmittedAt: null,
                feedbackData: null
              }).then(() => {
                // Use handleAuthSuccess instead of directly navigating
                handleAuthSuccess(userCredential.user);
                showAlert('Account created successfully!', 'success');
              });
            })
            .catch((error) => {
              console.error('Registration error:', error);
              showAlert(`Registration error: ${error.message}`, 'error');
            });
        }
      });
      
      newConversationBtn.addEventListener('click', function() {
        scenarioInput.value = "";
        relationshipSelect.value = "Romantic Partner";
        resultCard.style.display = "none";
        showScreen(generatorScreen);
      });
      
      // Enhanced template presets
      const templates = {
        apology: {
          scenario: "I need to apologize to someone for missing an important event",
          relationship: "Friend",
          tone: "sincere",
          intensity: "4",
          duration: "few months",
          circumstances: "I missed their birthday celebration due to work commitments"
        },
        romantic: {
          scenario: "I want to express my love and appreciation to my partner",
          relationship: "Romantic Partner",
          tone: "poetic",
          intensity: "5",
          duration: "1-5 years",
          circumstances: "We recently celebrated our anniversary"
        },
        tough: {
          scenario: "I need to have a difficult conversation about boundaries",
          relationship: "Friend",
          tone: "formal",
          intensity: "3",
          duration: "few months",
          circumstances: "There have been some misunderstandings about personal space"
        },
        checkin: {
          scenario: "I want to check in with someone I haven't spoken to in a while",
          relationship: "Family Member",
          tone: "casual",
          intensity: "2",
          duration: "5+ years",
          circumstances: "We've been busy with our own lives but I miss them"
        },
        gratitude: {
          scenario: "I want to express deep gratitude for someone's support during a difficult time",
          relationship: "Friend",
          tone: "sincere",
          intensity: "4",
          duration: "1-5 years",
          circumstances: "They helped me through a challenging period in my life"
        },
        celebration: {
          scenario: "I want to congratulate someone on their recent achievement",
          relationship: "Professional",
          tone: "enthusiastic",
          intensity: "4",
          duration: "few months",
          circumstances: "They recently got promoted/completed a major project"
        },
        encouragement: {
          scenario: "I want to encourage someone who is facing a challenge",
          relationship: "Friend",
          tone: "supportive",
          intensity: "4",
          duration: "1-5 years",
          circumstances: "They're going through a difficult transition"
        },
        sympathy: {
          scenario: "I want to express sympathy and support during their loss",
          relationship: "Family Member",
          tone: "compassionate",
          intensity: "3",
          duration: "lifelong",
          circumstances: "They recently lost a loved one"
        }
      };

      // Enhanced feedback submission
      async function handleFeedbackSubmit() {
        const formData = {
          email: document.getElementById('feedbackEmail').value,
          userType: document.getElementById('feedbackUserType').value,
          messageQuality: document.querySelector('input[name="messageQuality"]:checked')?.value,
          easeOfUse: document.querySelector('input[name="easeOfUse"]:checked')?.value,
          features: Array.from(document.querySelectorAll('input[name="features"]:checked')).map(cb => cb.value),
          strengths: document.getElementById('feedbackStrengths').value.trim(),
          improvements: document.getElementById('feedbackImprovements').value.trim(),
          featureRequests: document.getElementById('feedbackFeatures').value.trim(),
          npsScore: document.getElementById('npsScore').value,
          timestamp: new Date().toISOString()
        };

        if (!formData.messageQuality || !formData.easeOfUse || !formData.strengths) {
          showAlert('Please fill in the star ratings and what you liked most', 'error');
          return;
        }

        try {
          const response = await fetch('https://formspree.io/f/xwplnpbl', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            if (currentUser) {
              // Update user document with feedback data but don't mark as submitted
              await firebase.firestore().collection('users').doc(currentUser.uid).update({
                lastFeedbackSubmittedAt: firebase.firestore.FieldValue.serverTimestamp(),
                feedbackData: formData
              });
            }

            showAlert('Thank you for your detailed feedback!', 'success');
            hideFeedbackModal();
            
            // Reset form
            document.getElementById('feedbackForm').reset();
          } else {
            throw new Error('Failed to submit feedback');
          }
        } catch (error) {
          console.error('Feedback submission error:', error);
          showAlert('Failed to submit feedback. Please try again.', 'error');
        }
      }

      // Template card click handler
      function handleTemplateClick(templateType) {
              const template = templates[templateType];
        if (template) {
              document.getElementById('scenario').value = template.scenario;
              document.getElementById('relationship').value = template.relationship;
              document.getElementById('tone').value = template.tone;
              document.getElementById('intensity').value = template.intensity;
          document.getElementById('duration').value = template.duration;
          document.getElementById('circumstances').value = template.circumstances;
              document.getElementById('result').style.display = "none";
          showScreen(generatorScreen);
        }
      }

      // Add template click listeners
      document.addEventListener('DOMContentLoaded', function() {
        // Attach template click listeners on initial load
        attachTemplateClickListeners();
      });
      
      backToHomeBtn.addEventListener('click', function() {
        if (currentUser) {
          showScreen(homeScreen);
        } else {
          showScreen(welcomeScreen);
        }
      });
      
      settingsBtn.addEventListener('click', async function() {
        if (!currentUser) {
          showAlert('Please log in to view message history', 'error');
          return;
        }
        
        try {
          const messagesRef = firebase.firestore()
            .collection('users')
            .doc(currentUser.uid)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .limit(10);
            
          const snapshot = await messagesRef.get();
          
          if (snapshot.empty) {
            showAlert('No messages in history yet', 'info');
            return;
          }
          
          // Create and show history modal
          const modal = document.createElement('div');
          modal.style.position = 'fixed';
          modal.style.top = '50%';
          modal.style.left = '50%';
          modal.style.transform = 'translate(-50%, -50%)';
          modal.style.backgroundColor = 'var(--card-bg)';
          modal.style.padding = '20px';
          modal.style.borderRadius = '16px';
          modal.style.maxWidth = '90%';
          modal.style.width = '400px';
          modal.style.maxHeight = '80vh';
          modal.style.overflowY = 'auto';
          modal.style.zIndex = '1000';
          
          // Add close button
          const closeBtn = document.createElement('button');
          closeBtn.textContent = '×';
          closeBtn.style.position = 'absolute';
          closeBtn.style.right = '10px';
          closeBtn.style.top = '10px';
          closeBtn.style.background = 'none';
          closeBtn.style.border = 'none';
          closeBtn.style.color = 'white';
          closeBtn.style.fontSize = '24px';
          closeBtn.style.cursor = 'pointer';
          closeBtn.onclick = () => modal.remove();
          modal.appendChild(closeBtn);
          
          // Add title
          const title = document.createElement('h2');
          title.textContent = 'Message History';
          title.style.marginBottom = '20px';
          title.style.fontSize = '20px';
          title.style.fontWeight = '600';
          modal.appendChild(title);
          
          // Add messages
          snapshot.forEach(doc => {
            const data = doc.data();
            const messageDiv = document.createElement('div');
            messageDiv.style.marginBottom = '20px';
            messageDiv.style.padding = '15px';
            messageDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            messageDiv.style.borderRadius = '8px';
            
            const header = document.createElement('div');
            header.style.marginBottom = '10px';
            header.style.fontSize = '14px';
            header.style.color = 'var(--text-secondary)';
            header.textContent = `${data.relationshipType} - ${new Date(data.timestamp.toDate()).toLocaleDateString()}`;
            messageDiv.appendChild(header);
            
            const scenario = document.createElement('div');
            scenario.style.marginBottom = '10px';
            scenario.style.fontSize = '14px';
            scenario.style.fontStyle = 'italic';
            scenario.textContent = data.scenario;
            messageDiv.appendChild(scenario);
            
            const message = document.createElement('div');
            message.style.fontSize = '15px';
            message.style.lineHeight = '1.5';
            message.textContent = data.message;
            messageDiv.appendChild(message);
            
            modal.appendChild(messageDiv);
          });
          
          // Add overlay
          const overlay = document.createElement('div');
          overlay.style.position = 'fixed';
          overlay.style.top = '0';
          overlay.style.left = '0';
          overlay.style.width = '100%';
          overlay.style.height = '100%';
          overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
          overlay.style.zIndex = '999';
          overlay.onclick = () => {
            modal.remove();
            overlay.remove();
          };
          
          document.body.appendChild(overlay);
          document.body.appendChild(modal);
          
        } catch (error) {
          console.error('Error fetching message history:', error);
          showAlert('Error loading message history', 'error');
        }
      });
      
      logoutBtn.addEventListener('click', function() {
        if (confirm("Are you sure you want to log out?")) {
          firebase.auth().signOut()
            .then(() => {
              showScreen(welcomeScreen);
              showAlert('Logged out successfully', 'success');
            })
            .catch((error) => {
              showAlert(`Error logging out: ${error.message}`, 'error');
            });
        }
      });
      
      // Update the generateMessage function to store the current message
      generateBtn.addEventListener('click', async function() {
        // Show animation immediately
        showGenerateAnimation();
        
        // Track message generation attempt - use safe function
        logAnalyticsEvent('generate_message', {
          relationship_type: document.getElementById('relationship').value
        });
        
        const scenario = document.getElementById('scenario').value.trim();
        const relationship = document.getElementById('relationship').value;
        const tone = document.getElementById('tone').value;
        const intensity = document.getElementById('intensity').value;
        const duration = document.getElementById('duration').value;
        const circumstances = document.getElementById('circumstances').value.trim();
        
        if (!scenario) {
          showAlert("Please enter a communication scenario", 'error');
          return;
        }
        
        if (!currentUser) {
          showAlert("Please sign in to generate messages", 'error');
          return;
        }
        
        // Show the loading overlay with context about the message being generated
        updateLoadingContext(relationship, tone);
        showLoading();
        
        try {
          const idToken = await currentUser.getIdToken();
          const response = await fetch('https://us-central1-heartglowai.cloudfunctions.net/generateMessage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({
              scenario,
              relationshipType: relationship,
              tone,
              toneIntensity: intensity,
              relationshipDuration: duration,
              specialCircumstances: circumstances
            })
          });
          
          console.log('Response status:', response.status);
          
          if (!response.ok) {
            if (response.status === 429) {
              throw new Error('Rate limit exceeded. Please try again later.');
            }
            throw new Error('Failed to generate message.');
          }
          
          const data = await response.json();
          console.log('Response data:', data);
          
          if (data.message) {
            // Store current message for feedback and tweaking
            currentMessage = data.message;
            
            // Store insights if available
            if (data.insights && Array.isArray(data.insights)) {
              currentInsights = data.insights;
            } else {
              currentInsights = [];
            }
            
            // Show the result with the new layout
            showResultsPopup();
            
            // Save to history if logged in
            if (currentUser) {
              await saveMessage(scenario, relationship, data.message);
            }
            
            // Update message count after successful generation
            try {
              await updateMessageCount();
            } catch (err) {
              console.log('Error updating message count:', err);
              // Non-critical error, continue
            }
          } else {
            throw new Error('No message received from server');
          }
        } catch (error) {
          console.error('Error:', error);
          hideLoading();
          showAlert(error.message || 'An error occurred. Please try again.', 'error');
        }
      });

      // Add Google Sign In functionality
      safeAddEventListener('google-sign-in', 'click', function() {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({
          prompt: 'select_account'
        });
        
        firebase.auth()
          .signInWithPopup(provider)
          .then((result) => {
            // Check if it's a new user
            const isNewUser = result.additionalUserInfo.isNewUser;
            
            if (isNewUser) {
              // Create user document in Firestore
              return firebase.firestore().collection('users').doc(result.user.uid).set({
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
                createdAt: new Date(),
                authProvider: 'google'
              }).then(() => {
                showAlert('Account created successfully!', 'success');
                // Use handleAuthSuccess instead of directly navigating to home screen
                handleAuthSuccess(result.user);
              });
            } else {
              // Use handleAuthSuccess instead of directly navigating to home screen
              handleAuthSuccess(result.user);
            }
          })
          .catch((error) => {
            console.error('Google Sign In Error:', error);
            showAlert(`Error: ${error.message}`, 'error');
          });
      });

      // Check for and redirect to feedback.html after a certain number of messages
      async function checkFeedbackStatus() {
        if (currentUser) {
          try {
            const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
            // Only check for first-time feedback submission
            hasSubmittedFeedback = userDoc.exists && userDoc.data().hasFeedbackSubmitted === true;
            
            if (!hasSubmittedFeedback) {
              // Get stored message count
              messageCount = userDoc.data()?.messageCount || 0;
            }
          } catch (error) {
            console.error('Error checking feedback status:', error);
          }
        }
      }

      // Update the message count in Firestore
      async function updateMessageCount() {
        if (currentUser && !hasSubmittedFeedback) {
          try {
            messageCount++;
            await firebase.firestore().collection('users').doc(currentUser.uid).update({
              messageCount: messageCount
            });

            if (messageCount >= 3) {
              // Instead of showing the modal, suggest visiting the feedback page
              showAlert('We value your feedback! Please click the "Submit Feedback" button when you have a moment.', 'info');
            }
          } catch (error) {
            console.error('Error updating message count:', error);
          }
        }
      }

      // Event Listeners for Feedback
      document.getElementById('feedbackButton').addEventListener('click', function() {
        window.location.href = 'feedback.html';
      });
      document.getElementById('feedbackCancel').addEventListener('click', hideFeedbackModal);
      document.getElementById('feedbackSubmit').addEventListener('click', handleFeedbackSubmit);
      document.getElementById('feedbackOverlay').addEventListener('click', hideFeedbackModal);

      // Update the generateMessage event listener to include feedback tracking
      generateBtn.addEventListener('click', async function() {
        // ... existing generate message code ...
        
        try {
          // ... existing try block code ...
          
          // After successful message generation, update message count
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
          
          // ... rest of the existing code ...
        } catch (error) {
          // ... existing error handling ...
        }
      });
    });

    function showGenerateAnimation() {
      const generateBtn = document.getElementById('generateBtn');
      
      // Add a 'generating' class with animation
      generateBtn.classList.add('generating');
      
      // Create and add the animation span
      const animationSpan = document.createElement('span');
      animationSpan.className = 'generate-animation';
      generateBtn.appendChild(animationSpan);
      
      // Remove after animation completes
      setTimeout(() => {
        generateBtn.classList.remove('generating');
        if (animationSpan && animationSpan.parentNode === generateBtn) {
          generateBtn.removeChild(animationSpan);
        }
      }, 1500);
    }

    // Update the loading context with user variables
    function updateLoadingContext(relationship, tone) {
      const loadingContext = document.getElementById('loadingContext');
      if (!loadingContext) return;
      
      // Craft a loading message based on the relationship and tone
      let message = `Creating a <span class="loading-highlight">${tone}</span> message for your <span class="loading-highlight">${relationship.toLowerCase()}</span>`;
      
      // Add variety based on tone
      switch(tone.toLowerCase()) {
        case 'casual':
          message += "... keeping it relaxed and friendly";
          break;
        case 'formal':
          message += "... with the right level of respect";
          break;
        case 'humorous':
          message += "... with a touch of humor";
          break;
        case 'poetic':
          message += "... with flowing, heartfelt words";
          break;
        case 'serious':
          message += "... with sincerity and depth";
          break;
        default:
          message += "... with the perfect words";
      }
      
      loadingContext.innerHTML = message;
    }
    
    // Show the loading overlay
    function showLoading() {
      const loadingOverlay = document.getElementById('loadingOverlay');
      if (loadingOverlay) {
        loadingOverlay.classList.add('active');
      }
    }
    
    // Hide the loading overlay
    function hideLoading() {
      const loadingOverlay = document.getElementById('loadingOverlay');
      if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
      }
    }

    // Consolidated and improved showResultsPopup function
    function showResultsPopup() {
      console.log("showResultsPopup called");
      
      // Initialize elements if needed
      if (!resultPopupOverlay || !popupMessageText) {
        console.log("Re-initializing popup elements");
        initializePopupElements();
      }
      
      // Get the popup overlay element
      const popup = document.getElementById('resultsPopupOverlay');
      if (!popup) {
        console.error('Results popup overlay element not found');
        return false;
      }
      
      // Update popup content with the current message
      if (popupMessageText && currentMessage) {
        popupMessageText.textContent = currentMessage;
      }
      
      // Update popup insights
      if (popupInsightsList && currentInsights && currentInsights.length > 0) {
        popupInsightsList.innerHTML = '';
        currentInsights.forEach(insight => {
          const li = document.createElement('li');
          li.textContent = insight;
          popupInsightsList.appendChild(li);
        });
      }
      
      // Set high z-index to ensure it's above everything
      popup.style.zIndex = '10000';
      popup.style.display = 'flex';
      
      // Force browser to reflow the element for animation to work properly
      void popup.offsetWidth;
      
      // Add active class to trigger animations
      setTimeout(() => {
        popup.classList.add('active');
      }, 10);
      
      // Hide the original result card
      const resultCard = document.getElementById('result');
      if (resultCard) {
        resultCard.style.display = 'none';
      }
      
      // Hide the loading spinner
      hideLoading();
      
      return true;
    }

    // Improved hideResultsPopup function
    function hideResultsPopup() {
      console.log("hideResultsPopup called");
      
      // Initialize elements if needed
      if (!resultPopupOverlay) {
        console.log("Re-initializing popup elements");
        initializePopupElements();
      }
      
      const popup = document.getElementById('resultsPopupOverlay');
      if (!popup) {
        console.error('Results popup overlay element not found');
        return false;
      }
      
      popup.classList.remove('active');
      
      // Hide after transition completes
      setTimeout(() => {
        popup.style.display = 'none';
      }, 300);
      
      return true;
    }

    function showPopupFeedback() {
      console.log("showPopupFeedback called");
      
      // Make sure we have the popup elements
      if (!resultPopupOverlay) {
        initializePopupElements();
      }
      
      const feedbackSection = document.getElementById('popupFeedbackSection');
      if (!feedbackSection) {
        console.error('Popup feedback section element not found');
        return false;
      }
      
      feedbackSection.style.display = 'block';
      
      const popupFeedback = document.getElementById('popupFeedback');
      if (popupFeedback) {
        popupFeedback.focus();
      } else {
        console.warn('Popup feedback textarea not found');
      }
      
      return true;
    }

    function copyPopupMessage() {
      console.log("copyPopupMessage called");
      
      // Initialize elements if needed
      if (!popupMessageText) {
        initializePopupElements();
      }
      
      if (!popupMessageText) {
        console.error('Popup message text element not found');
        return false;
      }
      
      // Get the message text
      const messageText = popupMessageText.textContent;
      
      // Copy to clipboard
      navigator.clipboard.writeText(messageText)
        .then(() => {
          // Show success indicator
          const copyButton = document.querySelector('.popup-copy-button');
          if (copyButton) {
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = '<span>✓</span> Copied!';
            
            // Reset after 2 seconds
            setTimeout(() => {
              copyButton.innerHTML = originalText;
            }, 2000);
          }
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
          showAlert('Failed to copy to clipboard', 'error');
        });
      
      return true;
    }

    function tweakPopupMessage() {
      console.log("tweakPopupMessage called");
      
      // Get feedback from popup
      const popupFeedback = document.getElementById('popupFeedback');
      if (!popupFeedback || !popupFeedback.value.trim()) {
        showAlert("Please provide feedback for the message", 'error');
        return;
      }
      
      const feedbackText = popupFeedback.value.trim();
      
      if (!currentUser) {
        showAlert("Please sign in to generate messages", 'error');
        return;
      }
      
      // Get input values from the form
      const scenario = document.getElementById('scenario')?.value.trim() || '';
      const relationship = document.getElementById('relationship')?.value || '';
      const tone = document.getElementById('tone')?.value || '';
      const intensity = document.getElementById('intensity')?.value || '';
      const duration = document.getElementById('duration')?.value || '';
      const circumstances = document.getElementById('circumstances')?.value.trim() || '';
      
      // Show the loading overlay
      showLoading();
      
      // Hide the popup
      hideResultsPopup();
      
      // Make the API call directly instead of calling the original tweakMessage
      (async function() {
        try {
          // Get the current user's ID token
          const idToken = await currentUser.getIdToken();
          
          console.log('Sending tweak request from popup:', {
            scenario,
            relationshipType: relationship,
            tone,
            toneIntensity: intensity,
            relationshipDuration: duration,
            specialCircumstances: circumstances,
            previousMessage: currentMessage,
            userFeedback: feedbackText
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
          
          console.log('Response status:', response.status);
          const data = await response.json();
          console.log('Response data:', data);
          
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
            
            // For compatibility, also update the original card
            const messageText = document.getElementById('messageText');
            if (messageText) {
              messageText.textContent = data.message;
            }
            
            const insightsList = document.getElementById('insightsList');
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
            
            // Clear feedback input
            if (popupFeedback) {
              popupFeedback.value = '';
            }
            
            // Hide loading overlay
            hideLoading();
            
            // Show the popup with the new content
            showResultsPopup();
            
            // Save message to history if logged in
            if (currentUser) {
              await saveMessage(scenario, relationship, data.message);
            }
            
            // Safely call updateMessageCount
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
          // Hide loading
          hideLoading();
          
          console.error('Error generating tweaked message:', error);
          
          // Enhanced error handling
          if (error.message?.includes('authenticated')) {
            showAlert('Please sign in to generate messages', 'error');
          } else if (error.message?.includes('Failed to fetch') || error.message?.includes('Network error')) {
            showAlert('Network error - please check your connection', 'error');
          } else {
            showAlert(error.message || 'Failed to generate message', 'error');
          }
        }
      })();
    }

    // Call this once DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
      initializePopupElements();
    });

    // Fix analytics reference error
    function logAnalyticsEvent(eventName, eventParams) {
      // Try to use gtag if available
      if (typeof gtag === 'function') {
        gtag('event', eventName, eventParams);
      } else if (typeof analytics !== 'undefined' && analytics !== null) {
        // Fall back to analytics object if available
        analytics.logEvent(eventName, eventParams);
      } else {
        // If no analytics available, just log to console
        console.log('Analytics event:', eventName, eventParams);
      }
    }

    // Update the generateMessage function to properly handle analytics
    function generateMessage() {
      // Check if user is logged in
      const currentUser = gapi.auth2.getAuthInstance().currentUser.get();
      const isLoggedIn = currentUser.isSignedIn();
      
      // Get input values
      const scenario = document.getElementById('scenario').value;
      const relationship = document.getElementById('relationship').value;
      const tone = document.getElementById('tone').value;
      const intensity = document.getElementById('intensity').value;
      const duration = document.getElementById('duration').value;
      const circumstances = document.getElementById('circumstances').value;
      
      // Validate input
      if (!scenario || !relationship || !tone || !intensity || !duration) {
        alert('Please fill out all required fields.');
        return;
      }
      
      // Log analytics event using our safe function
      logAnalyticsEvent('generate_message', {
        'event_category': 'engagement',
        'event_label': scenario
      });
      
      // Show loading animation
      showLoading();
      
      // Prepare data for the Cloud Function
      const data = {
        userId: isLoggedIn ? currentUser.getId() : 'anonymous',
        scenario: scenario,
        relationship: relationship,
        tone: tone,
        intensity: intensity,
        duration: duration,
        circumstances: circumstances
      };
      
      console.log('Sending request to Cloud Function:', data);
      
      // Send request to Cloud Function
      fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GENERATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        console.log('Response status:', response.status);
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        if (!response.ok) {
          throw new Error('Failed to generate message.');
        }
        return response.json();
      })
      .then(data => {
        console.log('Response data:', data);
        if (data.success) {
          // Hide loading animation
          hideLoading();
          
          // Initialize elements if not already done
          if (!resultPopupOverlay || !popupMessageText) {
            initializePopupElements();
          }
          
          // Update popup content with generated message
          if (popupMessageText) {
            popupMessageText.textContent = data.message;
          }
          
          // Update popup insights if available
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
          
          // Show the popup overlay with results
          showResultsPopup();
          
          // Additionally, still update the original card for backward compatibility
          const messageText = document.getElementById('message-text');
          if (messageText) {
            messageText.textContent = data.message;
          }
          
          const insightsList = document.getElementById('insights-list');
          if (insightsList) {
            insightsList.innerHTML = '';
            if (data.insights && data.insights.length > 0) {
              data.insights.forEach(insight => {
                const li = document.createElement('li');
                li.textContent = insight;
                insightsList.appendChild(li);
              });
            }
          }
          
          // Make sure original card is hidden
          const resultCard = document.getElementById('result');
          if (resultCard) {
            resultCard.style.display = 'none';
          }
          
          // Save message to history if logged in
          if (isLoggedIn) {
            saveMessageToHistory(data.message, scenario, relationship, tone, intensity, duration, circumstances);
          }
        } else {
          hideLoading();
          alert(data.error || 'Failed to generate message.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        hideLoading();
        alert(error.message || 'An error occurred. Please try again.');
      });
    }

    // Add JavaScript for Dashboard navigation
    document.addEventListener('DOMContentLoaded', function() {
      // Initialize the app first
      initializeApp();

      // Get dashboard-related buttons
      const dashboardBtn = document.getElementById('dashboard-btn');
      const backToHomeFromDashboard = document.getElementById('back-to-home-from-dashboard');
      const dashboardScreen = document.getElementById('dashboard-screen');
      
      // Add event listeners for dashboard navigation
      if (dashboardBtn) {
        dashboardBtn.addEventListener('click', function() {
          // Hide home screen and show dashboard
          homeScreen.classList.remove('active');
          setTimeout(() => {
            homeScreen.style.display = 'none';
            dashboardScreen.style.display = 'flex';
            setTimeout(() => dashboardScreen.classList.add('active'), 50);
            
            // Load dashboard data when dashboard is shown
            loadDashboardData();
          }, 500);
        });
      }
      
      if (backToHomeFromDashboard) {
        backToHomeFromDashboard.addEventListener('click', function() {
          // Hide dashboard and show home screen
          dashboardScreen.classList.remove('active');
          setTimeout(() => {
            dashboardScreen.style.display = 'none';
            homeScreen.style.display = 'flex';
            setTimeout(() => homeScreen.classList.add('active'), 50);
          }, 500);
        });
      }
    });

    // Add this function to fetch and display user's message statistics and history
    async function loadDashboardData() {
      if (!currentUser) {
        console.error('No user logged in while trying to load dashboard data');
        return;
      }
      
      try {
        // Show loading state
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach(el => {
          el.textContent = '...';
        });
        
        const messageHistoryContainer = document.querySelector('.message-history');
        if (messageHistoryContainer) {
          messageHistoryContainer.innerHTML = '<div style="text-align: center; padding: 20px;">Loading messages...</div>';
        }
        
        // Get user's messages collection
        const messagesRef = firebase.firestore()
          .collection('users')
          .doc(currentUser.uid)
          .collection('messages');
        
        // Get messages ordered by timestamp (newest first)
        const messagesSnapshot = await messagesRef
          .orderBy('timestamp', 'desc')
          .limit(10)
          .get();
        
        // Process message data for statistics and display
        const messages = [];
        const relationshipTypes = new Set();
        const templateTypes = new Set();
        
        messagesSnapshot.forEach(doc => {
          const messageData = doc.data();
          messages.push({
            id: doc.id,
            ...messageData,
            timestamp: messageData.timestamp?.toDate?.() || new Date(),
          });
          
          if (messageData.relationshipType) {
            relationshipTypes.add(messageData.relationshipType);
          }
          
          if (messageData.templateType) {
            templateTypes.add(messageData.templateType);
          }
        });
        
        // Update statistics
        const totalMessages = messages.length;
        const totalRelationships = relationshipTypes.size;
        const totalTemplates = templateTypes.size;
        
        // Find stat elements and update them
        const messageCountEl = document.querySelector('.stat-value[data-stat="messages"]');
        const relationshipsCountEl = document.querySelector('.stat-value[data-stat="relationships"]');
        const templatesCountEl = document.querySelector('.stat-value[data-stat="templates"]');
        
        if (messageCountEl) messageCountEl.textContent = totalMessages;
        if (relationshipsCountEl) relationshipsCountEl.textContent = totalRelationships;
        if (templatesCountEl) templatesCountEl.textContent = totalTemplates;
        
        // Update message history
        if (messageHistoryContainer) {
          if (messages.length > 0) {
            messageHistoryContainer.innerHTML = '';
            
            messages.slice(0, 5).forEach(message => {
              // Format the date
              const messageDate = message.timestamp;
              let dateText = 'Unknown date';
              
              if (messageDate) {
                const now = new Date();
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                
                if (messageDate.toDateString() === now.toDateString()) {
                  dateText = 'Today';
                } else if (messageDate.toDateString() === yesterday.toDateString()) {
                  dateText = 'Yesterday';
                } else {
                  // If within last week, show days ago
                  const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));
                  if (diffDays < 7) {
                    dateText = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
                  } else {
                    // Otherwise show the date
                    dateText = messageDate.toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric' 
                    });
                  }
                }
              }
              
              // Determine the emoji based on relationship or template type
              let emoji = '💬'; // Default
              
              if (message.relationshipType) {
                if (message.relationshipType.includes('Romantic')) {
                  emoji = '❤️';
                } else if (message.relationshipType.includes('Friend')) {
                  emoji = '✉️';
                } else if (message.relationshipType.includes('Family')) {
                  emoji = '👋';
                } else if (message.relationshipType.includes('Professional')) {
                  emoji = '👔';
                }
              }
              
              if (message.templateType) {
                if (message.templateType === 'apology') {
                  emoji = '✉️';
                } else if (message.templateType === 'romantic') {
                  emoji = '❤️';
                } else if (message.templateType === 'checkin') {
                  emoji = '👋';
                } else if (message.templateType === 'tough') {
                  emoji = '💬';
                } else if (message.templateType === 'gratitude') {
                  emoji = '🙏';
                } else if (message.templateType === 'celebration') {
                  emoji = '🎉';
                } else if (message.templateType === 'encouragement') {
                  emoji = '⭐';
                }
              }
              
              // Create message history item
              const item = document.createElement('div');
              item.className = 'message-history-item';
              item.innerHTML = `
                <div class="message-icon">${emoji}</div>
                <div class="message-details">
                  <div class="message-title">${message.scenario || 'No scenario provided'}</div>
                  <div class="message-meta">
                    <span class="message-date">${dateText}</span>
                    <span class="message-relationship">${message.relationshipType || 'Unknown'}</span>
                  </div>
                </div>
              `;
              
              // Add click event to show full message
              item.addEventListener('click', () => {
                // Create a modal to show the full message
                const modal = document.createElement('div');
                modal.className = 'full-message-modal';
                modal.innerHTML = `
                  <div class="full-message-container">
                    <div class="full-message-header">
                      <h3>Message</h3>
                      <button class="close-modal">×</button>
                    </div>
                    <div class="full-message-content">
                      <div class="full-message-scenario">${message.scenario || 'No scenario provided'}</div>
                      <div class="full-message-relationship">${message.relationshipType || 'Unknown'} · ${dateText}</div>
                      <div class="full-message-text">${message.message || 'No message content'}</div>
                    </div>
                  </div>
                `;
                
                // Add styles if not already in the document
                if (!document.querySelector('#message-modal-styles')) {
                  const styleEl = document.createElement('style');
                  styleEl.id = 'message-modal-styles';
                  styleEl.textContent = `
                    .full-message-modal {
                      position: fixed;
                      top: 0;
                      left: 0;
                      width: 100%;
                      height: 100%;
                      background-color: rgba(0, 0, 0, 0.7);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      z-index: 1000;
                    }
                    .full-message-container {
                      background-color: var(--card-bg);
                      border-radius: 16px;
                      width: 90%;
                      max-width: 500px;
                      max-height: 80vh;
                      overflow-y: auto;
                      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                    }
                    .full-message-header {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      padding: 16px 20px;
                      border-bottom: 1px solid var(--border-color);
                    }
                    .full-message-header h3 {
                      margin: 0;
                      font-size: 18px;
                      color: var(--text-primary);
                    }
                    .close-modal {
                      background: none;
                      border: none;
                      color: var(--text-secondary);
                      font-size: 24px;
                      cursor: pointer;
                    }
                    .full-message-content {
                      padding: 20px;
                    }
                    .full-message-scenario {
                      font-size: 16px;
                      font-weight: 600;
                      margin-bottom: 8px;
                      color: var(--text-primary);
                    }
                    .full-message-relationship {
                      font-size: 14px;
                      color: var(--text-secondary);
                      margin-bottom: 16px;
                    }
                    .full-message-text {
                      font-size: 15px;
                      line-height: 1.6;
                      white-space: pre-wrap;
                      color: var(--text-primary);
                    }
                  `;
                  document.head.appendChild(styleEl);
                }
                
                // Add modal to the document
                document.body.appendChild(modal);
                
                // Add close functionality
                const closeBtn = modal.querySelector('.close-modal');
                closeBtn.addEventListener('click', () => {
                  modal.remove();
                });
                
                // Close when clicking outside
                modal.addEventListener('click', (e) => {
                  if (e.target === modal) {
                    modal.remove();
                  }
                });
              });
              
              messageHistoryContainer.appendChild(item);
            });
            
            // If no messages, show a message
            if (messages.length === 0) {
              messageHistoryContainer.innerHTML = `
                <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
                  No messages yet. Generate your first message to see it here.
                </div>
              `;
            }
          }
        }
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        
        // Update with fallback values
        const messageCountEl = document.querySelector('.stat-value[data-stat="messages"]');
        const relationshipsCountEl = document.querySelector('.stat-value[data-stat="relationships"]');
        const templatesCountEl = document.querySelector('.stat-value[data-stat="templates"]');
        
        if (messageCountEl) messageCountEl.textContent = '0';
        if (relationshipsCountEl) relationshipsCountEl.textContent = '0';
        if (templatesCountEl) templatesCountEl.textContent = '0';
        
        const messageHistoryContainer = document.querySelector('.message-history');
        if (messageHistoryContainer) {
          messageHistoryContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
              Could not load message history. Please try again later.
            </div>
          `;
        }
      }
    }

    // Perplexity API Integration
    // Function to retrieve Perplexity API key from Firestore
    async function getPerplexityApiKey() {
      try {
        // Check local storage first
        let perplexityApiKey = localStorage.getItem('perplexity_api_key');
        
        if (perplexityApiKey) {
          console.log('Using Perplexity API key from local storage');
          return perplexityApiKey;
        }
        
        // Try to get from Firebase if user is authenticated
        if (firebase.auth && firebase.auth().currentUser) {
          console.log('Retrieving Perplexity API key from Firestore');
          try {
            // Access the secrets collection
            const secretsDoc = await firebase.firestore().collection('secrets').doc('secrets').get();
            
            if (secretsDoc.exists && secretsDoc.data().perplexitykey) {
              perplexityApiKey = secretsDoc.data().perplexitykey;
              localStorage.setItem('perplexity_api_key', perplexityApiKey);
              console.log('Perplexity API key retrieved from secrets collection');
              return perplexityApiKey;
            }
          } catch (fbError) {
            console.warn('Could not retrieve key from Firestore:', fbError);
          }
        }
        
        // For demo/testing purposes, provide a fallback method
        // In production, you should use a more secure approach
        // This is just for demonstration purposes
        const demoKey = "pplx-xxxxxxxx"; // Replace with your key for demo
        
        // Check URL parameters for a demo key (development only)
        const urlParams = new URLSearchParams(window.location.search);
        const paramKey = urlParams.get('demo_key');
        if (paramKey && paramKey.startsWith('pplx-')) {
          console.log('Using demo key from URL parameter');
          return paramKey;
        }
        
        // Prompt user for API key if we don't have one
        if (!perplexityApiKey && confirm('Perplexity API key required. Would you like to provide one for this session?')) {
          const userKey = prompt('Please enter your Perplexity API key (starts with pplx-):');
          if (userKey && userKey.startsWith('pplx-')) {
            localStorage.setItem('perplexity_api_key', userKey);
            return userKey;
          }
        }
        
        // If we still don't have a key, use the demo key
        return demoKey; 
      } catch (error) {
        console.error('Error fetching Perplexity API key:', error);
        
        // For demo purposes, return a fake key instead of throwing an error
        return "pplx-xxxxxxxx"; // Replace with your key for demo
      }
    }

    // Function to make a Perplexity API call
    async function callPerplexityAPI(prompt) {
      try {
        console.log('Making Perplexity API call with prompt:', prompt);
        
        // More resilient authentication check with retry
        let authUser = currentUser;
        
        // If no user is available, wait a short time to see if auth state catches up
        if (!authUser) {
          console.log('No user detected initially, waiting briefly for auth state to update...');
          // Wait for a short time to see if Firebase auth completes
          await new Promise(resolve => setTimeout(resolve, 500));
          authUser = currentUser;
          
          // Try to use Firebase auth directly as a fallback
          if (!authUser) {
            console.log('Attempting to get user directly from Firebase auth...');
            authUser = firebase.auth().currentUser;
          }
        }
        
        // Final authentication check
        if (!authUser) {
          console.error('Authentication check failed after retry');
          throw new Error('Authentication required to use Perplexity API');
        }
        
        console.log('User authenticated, calling perplexityResearch HTTP endpoint');
        
        // Get the ID token from the authenticated user
        const idToken = await authUser.getIdToken();
        
        // Call the HTTP endpoint
        const response = await fetch('https://us-central1-heartglowai.cloudfunctions.net/perplexityResearch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({
            prompt: prompt
          })
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          let errorMessage = `Server responded with status ${response.status}`;
          
          try {
            const errorData = await response.json();
            if (errorData && errorData.error) {
              errorMessage = errorData.error;
            }
          } catch (jsonError) {
            // If JSON parsing fails, use status text
            errorMessage = `Error: ${response.statusText || errorMessage}`;
          }
          
          console.error('Server function error:', errorMessage);
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        console.log('Perplexity API response:', data);
        return data;
      } catch (error) {
        console.error('Perplexity API call failed:', error);
        throw error;
      }
    }

    // Test function for Perplexity API
    async function testPerplexityAPI() {
      try {
        console.log('Testing Perplexity API...');
        const result = await callPerplexityAPI('What are the top 3 benefits of meditation?');
        console.log('Result:', result.choices[0].message.content);
        if (result.citations && result.citations.length > 0) {
          console.log('Citations:', result.citations);
        }
        return result;
      } catch (error) {
        console.error('Test failed:', error);
        throw error;
      }
    }

    // Initialize the test button for Perplexity API (development only)
    document.addEventListener('DOMContentLoaded', function() {
      const testButton = document.getElementById('test-perplexity-btn');
      if (testButton) {
        testButton.addEventListener('click', async function() {
          try {
            // Disable the button and show loading state
            testButton.disabled = true;
            testButton.innerHTML = '<span class="button-content">Testing... <div class="spinner" style="display: inline-block; width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 1s linear infinite; margin-left: 10px;"></div></span>';
            
            // Test the API
            const result = await testPerplexityAPI();
            
            // Show the result div
            const resultDiv = document.getElementById('perplexity-result');
            const responseDiv = document.getElementById('perplexity-response');
            
            if (resultDiv && responseDiv) {
              resultDiv.style.display = 'block';
              
              // Format the response nicely
              if (result && result.choices && result.choices.length > 0) {
                const content = result.choices[0].message.content;
                responseDiv.textContent = content;
                
                // Show success message
                showAlert('Perplexity API test successful!', 'success');
              } else {
                responseDiv.textContent = 'No valid response received. Please check the console for details.';
                showAlert('Test completed but no valid response received.', 'error');
              }
            } else {
              // Fallback if result div isn't found
              const responseHtml = `
                <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-top: 20px;">
                  <h3>Perplexity API Test Result</h3>
                  <pre style="white-space: pre-wrap;">${
                    result && result.choices && result.choices.length > 0 
                    ? result.choices[0].message.content 
                    : 'No valid response received'
                  }</pre>
                </div>
              `;
              
              // Create temporary element
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = responseHtml;
              testButton.parentNode.appendChild(tempDiv);
              
              showAlert('Perplexity API test successful! Check console for details.', 'success');
            }
            
            console.log('Perplexity API test result:', result);
          } catch (error) {
            console.error('Perplexity API test error:', error);
            showAlert(`Perplexity API test failed: ${error.message}`, 'error');
          } finally {
            // Re-enable the button
            testButton.disabled = false;
            testButton.innerHTML = '<span class="button-content">Test Perplexity AI <span class="button-icon">🧠</span></span>';
          }
        });
      }
    });

    // Add event listeners for the new controls
    document.addEventListener('DOMContentLoaded', function() {
      const toneAdjustment = document.getElementById('toneAdjustment');
      const lengthAdjustment = document.getElementById('lengthAdjustment');
      const gradeMessageBtn = document.querySelector('.grade-message-btn');
      const generateNewVersionBtn = document.querySelector('.generate-new-version-btn');

      // Store current slider values
      let currentToneValue = 3;
      let currentLengthValue = 3;

      // Update tone adjustment
      toneAdjustment.addEventListener('input', function() {
        currentToneValue = this.value;
        updateSliderLabels(this, 'More Casual', 'Current', 'More Formal');
      });

      // Update length adjustment
      lengthAdjustment.addEventListener('input', function() {
        currentLengthValue = this.value;
        updateSliderLabels(this, 'Shorter', 'Current', 'Longer');
      });

      // Grade message button click handler
      gradeMessageBtn.addEventListener('click', async function() {
        if (!currentMessage) {
          showAlert('No message to grade', 'error');
          return;
        }

        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'loading-spinner';
        loadingSpinner.innerHTML = '<div class="spinner"></div>';
        gradeMessageBtn.appendChild(loadingSpinner);
        gradeMessageBtn.disabled = true;

        try {
          const idToken = await firebase.auth().currentUser.getIdToken();
          const response = await fetch('https://us-central1-heartglowai.cloudfunctions.net/generateMessage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({
              messageToAnalyze: currentMessage,
              scenario: `You are an expert in communication psychology and relationship dynamics. Analyze this message and provide a detailed grade with specific feedback on:

1. Emotional Impact (0-10):
- How well does it convey the intended emotions?
- Is the emotional tone appropriate for the context?

2. Clarity & Effectiveness (0-10):
- Is the message clear and easy to understand?
- Does it achieve its intended purpose?

3. Relationship Appropriateness (0-10):
- How well does it match the relationship context?
- Is the tone and formality level appropriate?

4. Authenticity (0-10):
- How genuine and personal does it feel?
- Does it reflect the sender's true feelings?

Provide specific examples and suggestions for improvement.`
            })
          });

          if (!response.ok) {
            throw new Error('Failed to grade message');
          }

          const data = await response.json();
          const insightsList = document.getElementById('insightsList');
          insightsList.innerHTML = ''; // Clear existing insights

          // Parse and display the grade
          const gradeMatch = data.message.match(/Emotional Impact \((\d+)\)/);
          const grade = gradeMatch ? gradeMatch[1] : 'N/A';
          
          const gradeElement = document.createElement('li');
          gradeElement.innerHTML = `<strong>Overall Grade: ${grade}/10</strong>`;
          insightsList.appendChild(gradeElement);

          // Add detailed feedback
          const feedbackPoints = data.message.split('\n').filter(line => line.trim());
          feedbackPoints.forEach(point => {
            if (point.includes('(') && point.includes(')')) {
              const insightElement = document.createElement('li');
              insightElement.textContent = point;
              insightsList.appendChild(insightElement);
            }
          });

          showAlert('Message graded successfully!', 'success');
        } catch (error) {
          console.error('Error grading message:', error);
          showAlert('Failed to grade message', 'error');
        } finally {
          loadingSpinner.remove();
          gradeMessageBtn.disabled = false;
        }
      });

      // Generate new version button click handler
      generateNewVersionBtn.addEventListener('click', async function() {
        if (!currentMessage) {
          showAlert('No message to modify', 'error');
          return;
        }

        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'loading-spinner';
        loadingSpinner.innerHTML = '<div class="spinner"></div>';
        generateNewVersionBtn.appendChild(loadingSpinner);
        generateNewVersionBtn.disabled = true;

        try {
          const idToken = await firebase.auth().currentUser.getIdToken();
          const response = await fetch('https://us-central1-heartglowai.cloudfunctions.net/generateMessage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({
              messageToAnalyze: currentMessage,
              scenario: `Revise this message with the following adjustments:
- Tone: ${getToneAdjustment(currentToneValue)}
- Length: ${getLengthAdjustment(currentLengthValue)}

Maintain the core message and emotional intent while applying these changes.`
            })
          });

          if (!response.ok) {
            throw new Error('Failed to generate new version');
          }

          const data = await response.json();
          currentMessage = data.message;
          document.getElementById('messageText').textContent = data.message;
          showAlert('New version generated!', 'success');
        } catch (error) {
          console.error('Error generating new version:', error);
          showAlert('Failed to generate new version', 'error');
        } finally {
          loadingSpinner.remove();
          generateNewVersionBtn.disabled = false;
        }
      });
    });

    // Helper function to update slider labels
    function updateSliderLabels(slider, leftLabel, centerLabel, rightLabel) {
      const labels = slider.parentElement.querySelector('.slider-labels').children;
      labels[0].textContent = leftLabel;
      labels[1].textContent = centerLabel;
      labels[2].textContent = rightLabel;
    }

    // Helper function to get tone adjustment description
    function getToneAdjustment(value) {
      switch (value) {
        case '1': return 'Much more casual and conversational';
        case '2': return 'Slightly more casual';
        case '3': return 'Keep current tone';
        case '4': return 'Slightly more formal';
        case '5': return 'Much more formal and professional';
        default: return 'Keep current tone';
      }
    }

    // Helper function to get length adjustment description
    function getLengthAdjustment(value) {
      switch (value) {
        case '1': return 'Make it much shorter and more concise';
        case '2': return 'Make it slightly shorter';
        case '3': return 'Keep current length';
        case '4': return 'Make it slightly longer';
        case '5': return 'Make it much longer and more detailed';
        default: return 'Keep current length';
      }
    }

    // Function to handle slider regeneration
    function regenerateWithOptions() {
      console.log("regenerateWithOptions called");
      
      // Get slider values
      const toneValue = document.getElementById('popupToneAdjustment').value;
      const lengthValue = document.getElementById('popupLengthAdjustment').value;
      
      // Determine tone and length adjustments
      let toneAdjustment = "neutral";
      if (toneValue == 1) toneAdjustment = "very casual";
      else if (toneValue == 2) toneAdjustment = "somewhat casual";
      else if (toneValue == 4) toneAdjustment = "somewhat formal";
      else if (toneValue == 5) toneAdjustment = "very formal";
      
      let lengthAdjustment = "same length";
      if (lengthValue == 1) lengthAdjustment = "much shorter";
      else if (lengthValue == 2) lengthAdjustment = "a bit shorter";
      else if (lengthValue == 4) lengthAdjustment = "a bit longer";
      else if (lengthValue == 5) lengthAdjustment = "much longer";
      
      // Build feedback based on slider settings
      const feedback = `Please regenerate this message with the following adjustments: 
      - Make it ${toneAdjustment} in tone
      - Make it ${lengthAdjustment}
      But keep the same overall content and message.`;
      
      // Set feedback in the textarea
      const popupFeedback = document.getElementById('popupFeedback');
      if (popupFeedback) {
        popupFeedback.value = feedback;
        
        // Show the feedback section
        const feedbackSection = document.getElementById('popupFeedbackSection');
        if (feedbackSection) {
          feedbackSection.style.display = 'block';
        }
        
        // Trigger tweak message
        tweakPopupMessage();
      } else {
        console.error('Cannot find popupFeedback element');
      }
    }

    // Event Listeners for Type Selection Flow
    // Select message type cards
    const messageTypeCards = document.querySelectorAll('.message-type-card');
    const nextStepBtn = document.getElementById('next-step-btn');
    const messageFlowScreen = document.getElementById('message-flow-screen');
    const backToTypesBtn = document.getElementById('back-to-types-btn');
    const selectedTypeIcon = document.getElementById('selected-type-icon');
    const selectedTypeText = document.getElementById('selected-type-text');
    
    // Track the currently selected message type
    let selectedMessageType = null;
    
    // Add click listeners to message type cards
    messageTypeCards.forEach(card => {
      card.addEventListener('click', function() {
        // Remove selected class from all cards
        messageTypeCards.forEach(c => c.classList.remove('selected'));
        
        // Add selected class to clicked card
        this.classList.add('selected');
        
        // Store the selected type
        const typeId = this.id;
        selectedMessageType = typeId.replace('-type', '');
        
        // Show the next button
        nextStepBtn.style.display = 'block';
      });
    });
    
    // Handle next button click - go to type-specific flow
    nextStepBtn.addEventListener('click', function() {
      if (!selectedMessageType) {
        return; // Do nothing if no type selected
      }
      
      // Update the type indicator in the flow screen
      const iconMap = {
        'romantic': '❤️',
        'professional': '👔',
        'personal': '💬'
      };
      
      selectedTypeIcon.textContent = iconMap[selectedMessageType] || '💌';
      selectedTypeText.textContent = selectedMessageType.charAt(0).toUpperCase() + selectedMessageType.slice(1);
      
      // Update example message based on selected type
      updateExampleMessage(selectedMessageType);
      
      // Show the message flow screen
      showScreen(messageFlowScreen);
    });
    
    // Handle back button from flow screen
    backToTypesBtn.addEventListener('click', function() {
      showScreen(welcomeScreen);
    });
    
    // Handle scenario selection
    const scenarioCards = document.querySelectorAll('.scenario-card');
    scenarioCards.forEach(card => {
      card.addEventListener('click', function() {
        // Toggle selection
        scenarioCards.forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        
        // Get selected scenario
        const scenarioType = this.getAttribute('data-scenario');
        updateExampleMessage(selectedMessageType, scenarioType);
      });
    });
    
    // Update example message based on selection
    function updateExampleMessage(messageType, scenario = null) {
      const exampleTextElement = document.getElementById('example-message-text');
      
      // Example messages by type and scenario
      const messages = {
        romantic: {
          reconnect: "It's been on my mind for a while now, and I just wanted to reach out. I miss our conversations and the way we used to laugh together. I hope we can reconnect soon.",
          appreciation: "I was thinking about the time you surprised me with that perfect gift, and it made me smile. You've always had a way of knowing exactly what I need. I truly appreciate how thoughtful you are.",
          missing: "I've been thinking about you lately. The little things keep reminding me of our time together, and I realized I never properly expressed how much you mean to me. I miss the way you always knew how to make me laugh."
        },
        professional: {
          reconnect: "I hope this message finds you well. It's been some time since we last connected, and I wanted to reach out to see how things have progressed since our last interaction.",
          appreciation: "I wanted to take a moment to express my sincere appreciation for your guidance on the recent project. Your insights were invaluable and made a significant difference in the outcome.",
          missing: "I've been reflecting on our professional relationship, and I realized I never properly acknowledged how much your mentorship has meant to me. Your advice has been instrumental in my growth."
        },
        personal: {
          reconnect: "It's been too long since we caught up! Life gets busy, but I've been thinking about you and wondering how you've been. I'd love to hear what's new in your world.",
          appreciation: "I was just thinking about that time you helped me through that rough patch. Your support meant more than you know, and I'm grateful to have you in my life.",
          missing: "It's been a while. I just wanted to reach out and let you know you've been on my mind. Sometimes the simplest connections are the most meaningful."
        }
      };
      
      // Default to the missing scenario if none selected
      const defaultScenario = 'missing';
      const selectedScenario = scenario || defaultScenario;
      
      // Set the example message text
      if (messages[messageType] && messages[messageType][selectedScenario]) {
        exampleTextElement.textContent = messages[messageType][selectedScenario];
      }
    }
    
    // Event Listeners
    loginRegisterBtn.addEventListener('click', function() {
      showScreen(authScreen);
    });
    
    // No account note (try without signing up)
    const noAccountNote = document.querySelector('.no-account-note');
    if (noAccountNote) {
      noAccountNote.addEventListener('click', function() {
        prefillAndNavigateToGenerator();
      });
    }
    
    // Get Started button in the flow screen
    const createMessageBtn = document.getElementById('create-message-btn');
    if (createMessageBtn) {
      createMessageBtn.addEventListener('click', function() {
        prefillAndNavigateToGenerator();
      });
    }
    
    // Helper function to prefill generator and navigate to it
    function prefillAndNavigateToGenerator(messageType) {
      // Get the input elements first
      const scenarioInput = document.getElementById('scenario');
      const relationshipSelect = document.getElementById('relationship');
      
      // Pre-fill the generator form based on selections
      if (scenarioInput && relationshipSelect) {
        // Use the passed messageType parameter if available, otherwise use the global selectedMessageType
        const selectedType = messageType || selectedMessageType;
        
        // Determine scenario text based on selected message type and scenario
        const selectedScenario = document.querySelector('.scenario-card.selected');
        let scenarioDescription = '';
        
        if (selectedType === 'romantic') {
          relationshipSelect.value = 'Romantic Partner';
          scenarioDescription = 'Express my feelings to my partner';
        } else if (selectedType === 'professional') {
          relationshipSelect.value = 'Professional';
          scenarioDescription = 'Communicate with a colleague or professional contact';
        } else if (selectedType === 'personal') {
          relationshipSelect.value = 'Friend';
          scenarioDescription = 'Reach out to a friend';
        } else {
          // Default if no type was selected
          relationshipSelect.value = 'Friend';
          scenarioDescription = 'Write a heartfelt message';
        }
        
        // Add scenario detail if available
        if (selectedScenario) {
          const scenarioType = selectedScenario.getAttribute('data-scenario');
          if (scenarioType === 'reconnect') {
            scenarioDescription += ' after we haven\'t spoken in a while';
          } else if (scenarioType === 'appreciation') {
            scenarioDescription += ' to show my appreciation';
          } else if (scenarioType === 'missing') {
            scenarioDescription += ' to let them know I miss them';
          }
        }
        
        scenarioInput.value = scenarioDescription;
      }
      
      // Show generator screen directly
      showScreen(generatorScreen);
    }

    // Function to handle successful authentication
    function handleAuthSuccess(user) {
      currentUser = user;
      
      // Check if we have a stored message type selection
      const selectedType = localStorage.getItem('selectedMessageType');
      
      if (selectedType) {
        // Clear the stored selection to avoid it being used again unnecessarily
        localStorage.removeItem('selectedMessageType');
        
        // Navigate to message flow screen with the selected type
        prefillAndNavigateToGenerator(selectedType);
      } else {
        // Default navigation to home screen if no pending message creation
        showScreen(homeScreen);
      }
    }

    // Helper function to safely add event listeners
    function safeAddEventListener(elementId, eventType, handler) {
      const element = document.getElementById(elementId);
      if (element) {
        element.addEventListener(eventType, handler);
        return true;
      } else {
        console.warn(`Element with ID '${elementId}' not found for event listener`);
        return false;
      }
    }

    // Function to initialize all authentication handlers
    function initializeAuthHandlers() {
      console.log('Initializing authentication handlers...');
      
      // Set up auth form submission handling
      const authForm = document.getElementById('auth-form');
      if (authForm) {
        authForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          
          if (!email || !password) {
            showAlert('Please enter both email and password', 'error');
            return;
          }
          
          if (isLogin) {
            // Login
            firebase.auth().signInWithEmailAndPassword(email, password)
              .then((userCredential) => {
                // Use handleAuthSuccess instead of directly navigating
                handleAuthSuccess(userCredential.user);
              })
              .catch((error) => {
                console.error('Login error:', error);
                showAlert(`Login error: ${error.message}`, 'error');
              });
          } else {
            // Register
            firebase.auth().createUserWithEmailAndPassword(email, password)
              .then((userCredential) => {
                // Create user document in Firestore
                return firebase.firestore().collection('users').doc(userCredential.user.uid).set({
                  email: email,
                  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                  messageCount: 0,
                  hasFeedbackSubmitted: false,
                  lastFeedbackSubmittedAt: null,
                  feedbackData: null
                }).then(() => {
                  // Use handleAuthSuccess instead of directly navigating
                  handleAuthSuccess(userCredential.user);
                  showAlert('Account created successfully!', 'success');
                });
              })
              .catch((error) => {
                console.error('Registration error:', error);
                showAlert(`Registration error: ${error.message}`, 'error');
              });
          }
        });
      } else {
        console.warn('Auth form not found');
      }
      
      // Handle Google Sign In
      safeAddEventListener('google-sign-in', 'click', function() {
        console.log('Google sign-in button clicked');
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({
          prompt: 'select_account'
        });
        
        firebase.auth()
          .signInWithPopup(provider)
          .then((result) => {
            console.log('Google sign-in successful');
            // Check if it's a new user
            const isNewUser = result.additionalUserInfo.isNewUser;
            
            if (isNewUser) {
              // Create user document in Firestore
              return firebase.firestore().collection('users').doc(result.user.uid).set({
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                messageCount: 0,
                hasFeedbackSubmitted: false,
                lastFeedbackSubmittedAt: null,
                feedbackData: null,
                authProvider: 'google'
              }).then(() => {
                showAlert('Account created successfully!', 'success');
                // Use handleAuthSuccess instead of directly navigating to home screen
                handleAuthSuccess(result.user);
              });
            } else {
              // Use handleAuthSuccess instead of directly navigating to home screen
              handleAuthSuccess(result.user);
            }
          })
          .catch((error) => {
            console.error('Google Sign In Error:', error);
            showAlert(`Error: ${error.message}`, 'error');
          });
      });
      
      // Toggle between login and registration
      safeAddEventListener('auth-toggle-link', 'click', function(e) {
        e.preventDefault();
        const authToggleText = document.getElementById('auth-toggle-text');
        const authToggleLink = document.getElementById('auth-toggle-link');
        const authSubmitBtn = document.getElementById('auth-submit-btn');
        
        isLogin = !isLogin;
        if (isLogin) {
          if (authToggleText) authToggleText.textContent = "Don't have an account?";
          if (authToggleLink) authToggleLink.textContent = "Sign up";
          if (authSubmitBtn) authSubmitBtn.textContent = "Continue";
        } else {
          if (authToggleText) authToggleText.textContent = "Already have an account?";
          if (authToggleLink) authToggleLink.textContent = "Log in";
          if (authSubmitBtn) authSubmitBtn.textContent = "Create Account";
        }
      });
      
      // Handle forgot password
      safeAddEventListener('forgot-password-link', 'click', function(e) {
        e.preventDefault();
        const email = prompt("Please enter your email address to reset your password:");
        if (email) {
          firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
              showAlert('Password reset email sent!', 'success');
            })
            .catch((error) => {
              showAlert(`Error: ${error.message}`, 'error');
            });
        }
      });
      
      console.log('Authentication handlers initialized');
    }

// Updated on Sun Mar 30 13:14:46 EDT 2025

    // Ensure DOM is fully loaded before initializing
    document.addEventListener('DOMContentLoaded', function() {
      console.log('DOM fully loaded, initializing app...');
      
      // Initialize screen elements
      welcomeScreen = document.getElementById('welcome-screen');
      authScreen = document.getElementById('auth-screen');
      homeScreen = document.getElementById('home-screen');
      generatorScreen = document.getElementById('generator-screen');
      learningScreen = document.getElementById('learning-screen');
      
      // Check if we are on index.html by looking for a key element
      const welcomeScreenCheck = document.getElementById('welcome-screen');
      if (!welcomeScreenCheck) {
        console.log("main.js: Skipping screen initialization (not on index.html).");
        return; 
      }
      
      // Add favicon
      const favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/svg+xml';
      favicon.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' fill='%23ff6b9d'/%3E%3C/svg%3E";
    document.head.appendChild(favicon);
    
    // Remove any visible classes that shouldn't be on initial load
    document.body.classList.remove('generator-active', 'results-active');
    
    // Short delay to ensure everything is ready
    setTimeout(() => {
      try {
        initializeApp();
      } catch (error) {
        console.error('Error during app initialization:', error);
      }
    }, 200);
  });

    // Helper function for safe screen navigation
    function showScreen(screen) {
      // Basic validation
      if (!screen) {
        console.error("Attempted to navigate to undefined screen");
        return;
      }
      
      // Get all screens that could be active
      const allScreens = document.querySelectorAll('.screen');
      console.log(`Transitioning to screen: ${screen.id}, from ${allScreens.length} possible screens`);
      
      try {
        // Hide all screens first
        allScreens.forEach(s => {
          if (s) {
            s.style.display = 'none';
          }
        });
        
        // Show the target screen
        screen.style.display = 'block';
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Add animation class if needed
        screen.classList.add('screen-fade-in');
        setTimeout(() => {
          screen.classList.remove('screen-fade-in');
        }, 500);
        
        console.log(`Screen transition to ${screen.id} complete`);
      } catch (error) {
        console.error(`Error during screen transition: ${error.message}`);
      }
    }
