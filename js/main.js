    // Global variables and functions
    let currentMessage = '';
    let currentUser = null;
    let welcomeScreen, authScreen, homeScreen, generatorScreen, tourScreen, learningScreen; // Declare screen variables globally
    let messageCount = 0;
    let hasSubmittedFeedback = false;
    
    // Popup functions defined at the top of the script
    let resultPopupOverlay = null;
    let popupMessageText = null;
    let popupInsightsList = null;
    let copyMessageBtn = null;
    let closeFeedbackBtn = null;
    let resultCard = null;

    function initializePopupElements() {
      resultPopupOverlay = document.getElementById('resultsPopupOverlay');
      popupMessageText = document.getElementById('popupMessageText');
      popupInsightsList = document.getElementById('popupInsightsList');
      resultCard = document.getElementById('result');
    }

    // Screen transition function
    function showScreen(screen) {
      const screens = [welcomeScreen, authScreen, homeScreen, generatorScreen, tourScreen, learningScreen];
      screens.forEach(s => {
        if (s === screen) {
          s.style.display = 'flex';
          setTimeout(() => s.classList.add('active'), 50);
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
      // Initialize screen elements
      welcomeScreen = document.getElementById('welcome-screen');
      authScreen = document.getElementById('auth-screen');
      homeScreen = document.getElementById('home-screen');
      generatorScreen = document.getElementById('generator-screen');
      tourScreen = document.getElementById('tour-screen');
      learningScreen = document.getElementById('learning-screen');

      // Add favicon
      const favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/svg+xml';
      favicon.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' fill='%23ff6b9d'/%3E%3C/svg%3E";
      document.head.appendChild(favicon);

      // Show welcome screen by default
      showScreen(welcomeScreen);
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
      
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      
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
          
          showScreen(homeScreen);
          
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
      
      // Tour navigation event listeners
      const takeTourBtn = document.getElementById('take-tour-btn');
      const backToWelcomeBtn = document.getElementById('back-to-welcome-btn');
      const tourSignupBtn = document.getElementById('tour-signup-btn');
      const tourSignupBtnBottom = document.getElementById('tour-signup-btn-bottom');
      
      takeTourBtn.addEventListener('click', function() {
        showScreen(tourScreen);
        
        // Log analytics event
        logAnalyticsEvent('tour_view', {
          source: 'welcome_screen'
        });
      });
      
      backToWelcomeBtn.addEventListener('click', function() {
        showScreen(welcomeScreen);
      });
      
      tourSignupBtn.addEventListener('click', function() {
        showScreen(authScreen);
        
        // Log analytics event
        logAnalyticsEvent('signup_click', {
          source: 'tour_page_top'
        });
      });
      
      tourSignupBtnBottom.addEventListener('click', function() {
        showScreen(authScreen);
        
        // Log analytics event
        logAnalyticsEvent('signup_click', {
          source: 'tour_page_bottom'
        });
      });
      
      // Learn with AI button event listener
      const learnBtn = document.getElementById('learn-btn');
      if (learnBtn) {
        learnBtn.addEventListener('click', function() {
          // Hide home screen and show learning screen
          homeScreen.classList.remove('active');
          setTimeout(() => {
            homeScreen.style.display = 'none';
            learningScreen.style.display = 'flex';
            setTimeout(() => learningScreen.classList.add('active'), 50);
          }, 500);
          
          // Log analytics event
          logAnalyticsEvent('learn_module_click', {
            source: 'home_screen'
          });
        });
      }
      
      // Back to home from learning button
      const backToHomeFromLearning = document.getElementById('back-to-home-from-learning');
      if (backToHomeFromLearning) {
        backToHomeFromLearning.addEventListener('click', function() {
          // Hide learning screen and show home screen
          learningScreen.classList.remove('active');
          setTimeout(() => {
            learningScreen.style.display = 'none';
            homeScreen.style.display = 'flex';
            setTimeout(() => homeScreen.classList.add('active'), 50);
          }, 500);
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
              showScreen(homeScreen);
            })
            .catch((error) => {
              showAlert(`Login error: ${error.message}`, 'error');
            });
        } else {
          // Register
          firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
              // Create user document in Firestore
              firebase.firestore().collection('users').doc(userCredential.user.uid).set({
                email: email,
                createdAt: new Date()
              });
              
              showScreen(homeScreen);
              showAlert('Account created successfully!', 'success');
            })
            .catch((error) => {
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
          // Get the current user's ID token
          const idToken = await currentUser.getIdToken();
          
          console.log('Sending request to Cloud Function:', {
            scenario,
            relationshipType: relationship,
            tone,
            toneIntensity: intensity,
            relationshipDuration: duration,
            specialCircumstances: circumstances
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
              specialCircumstances: circumstances
            })
          });
          
          console.log('Response status:', response.status);
          const data = await response.json();
          console.log('Response data:', data);
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to generate message');
          }
          
          if (!data.message) {
            throw new Error('No message received from server');
          }
          
          // Store current message for feedback
          currentMessage = data.message;
          
          // Display the message
          const messageText = document.getElementById('messageText');
          messageText.textContent = data.message;
          
          // Clear and populate insights
          const insightsList = document.getElementById('insightsList');
          insightsList.innerHTML = '';
          if (data.insights && data.insights.length > 0) {
            data.insights.forEach(insight => {
              const li = document.createElement('li');
              li.className = 'insight-item';
              li.textContent = insight;
              insightsList.appendChild(li);
            });
          }
          
          // Hide loading overlay and show result card
          hideLoading();
          
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
          
          // Show popup instead of original card
          showResultsPopup();
          
          // Also update original card for compatibility (but keep it hidden)
          if (resultCard) {
            // Set content but keep hidden
            resultCard.style.display = "none";
          }
          
          // Save to history if logged in
          if (currentUser) {
            await saveMessage(scenario, relationship, data.message);
          }
          
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
        } catch (error) {
          // Hide loading
          hideLoading();
          
          console.error('Error details:', {
            error: error,
            message: error.message,
            stack: error.stack,
            name: error.name
          });
          
          if (error.response) {
            console.error('Response error:', {
              status: error.response.status,
              data: error.response.data,
              headers: error.response.headers
            });
          }
          
          // Enhanced error handling
          if (error.message.includes('authenticated')) {
            showAlert('Please sign in to generate messages', 'error');
          } else if (error.message.includes('Failed to fetch') || error.message.includes('Network error')) {
            showAlert('Network error - please check your connection', 'error');
          } else if (error.response?.status === 401) {
            showAlert('Authentication error - please sign in again', 'error');
          } else if (error.response?.status === 403) {
            showAlert('Permission denied - please contact support', 'error');
          } else {
          showAlert(error.message || 'Failed to generate message', 'error');
          }
        }
      });

      // Add Google Sign In functionality
      document.getElementById('google-sign-in').addEventListener('click', function() {
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
                showScreen(homeScreen);
              });
            } else {
              showScreen(homeScreen);
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
      if (!popupMessageText) {
        initializePopupElements();
      }
      
      const textToCopy = popupMessageText.textContent;
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            alert('Message copied to clipboard!');
          })
          .catch(err => {
            console.error('Error copying text: ', err);
          });
      }
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
        console.log('Getting API key...');
        const apiKey = await getPerplexityApiKey();
        console.log('API key retrieved (first few chars):', apiKey.substring(0, 8) + '...');
        
        console.log('Preparing to send request to Perplexity API');
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "sonar",
            messages: [
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 500,
            top_p: 0.9
          })
        });
        
        console.log('Got response from API, status:', response.status);
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API error response:', errorData);
          throw new Error(`Perplexity API error: ${errorData.error?.message || response.statusText}`);
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
        console.log('About to call Perplexity API with test prompt');
        const result = await callPerplexityAPI('What are the top 3 benefits of meditation?');
        console.log('Call completed, got result:', result);
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
      console.log('Looking for test-perplexity-btn-main...');
      const testButton = document.getElementById('test-perplexity-btn-main');
      console.log('Found test button?', !!testButton);
      if (testButton) {
        console.log('Adding click event listener to Test Perplexity AI button');
        testButton.addEventListener('click', async function() {
          console.log('Test Perplexity AI button clicked!');
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

