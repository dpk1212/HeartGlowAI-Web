/**
 * Secure API Server for HeartGlowAI
 * 
 * This server provides secure endpoints for the HeartGlowAI web app,
 * handling Firebase authentication and data operations while keeping
 * sensitive API keys and credentials secure.
 */

// Load environment variables
require('dotenv').config();

const express = require('express');
const admin = require('firebase-admin');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin SDK with service account
// Note: In production, load this from environment variables or secure storage
admin.initializeApp({
  credential: admin.credential.cert({
    // This would be loaded from environment variables in production
    // For example: process.env.FIREBASE_PRIVATE_KEY, etc.
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  }),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// Session middleware - verifies Firebase auth token from cookies
const authMiddleware = async (req, res, next) => {
  try {
    const sessionCookie = req.cookies.session || '';
    if (!sessionCookie) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    req.user = decodedClaims;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ success: false, error: 'Invalid session' });
  }
};

// Serve static files from web-build directory
app.use(express.static(path.join(__dirname, 'web-build')));

// Auth API Endpoints

// Check auth status
app.get('/api/auth/status', async (req, res) => {
  try {
    const sessionCookie = req.cookies.session || '';
    if (!sessionCookie) {
      return res.json({ isAuthenticated: false });
    }
    
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    res.json({ 
      isAuthenticated: true, 
      userId: decodedClaims.uid,
      email: decodedClaims.email 
    });
  } catch (error) {
    console.error('Auth status error:', error);
    res.json({ isAuthenticated: false });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    
    // Create a Firebase Auth user with email and password
    const userRecord = await admin.auth().getUserByEmail(email);
    
    // Generate a session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await admin.auth().createSessionCookie(userRecord.uid, { expiresIn });
    
    // Set cookie options
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };
    
    res.cookie('session', sessionCookie, options);
    res.json({ 
      success: true, 
      userId: userRecord.uid,
      email: userRecord.email
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ success: false, error: 'Invalid email or password' });
  }
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    
    // Create user with Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: false
    });
    
    // Create user document in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      messageCount: 0,
      hasFeedbackSubmitted: false,
      lastFeedbackSubmittedAt: null,
      feedbackData: null
    });
    
    // Generate a session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await admin.auth().createSessionCookie(userRecord.uid, { expiresIn });
    
    // Set cookie options
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };
    
    res.cookie('session', sessionCookie, options);
    res.json({ 
      success: true, 
      userId: userRecord.uid,
      email: userRecord.email
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ success: false, error: 'Email already in use' });
    }
    
    if (error.code === 'auth/invalid-email') {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    
    if (error.code === 'auth/weak-password') {
      return res.status(400).json({ success: false, error: 'Password is too weak' });
    }
    
    res.status(500).json({ success: false, error: 'Failed to create account' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('session');
  res.json({ success: true });
});

// Password reset
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    
    await admin.auth().generatePasswordResetLink(email);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Password reset error:', error);
    
    if (error.code === 'auth/user-not-found') {
      // Don't reveal that the user doesn't exist
      return res.json({ success: true });
    }
    
    if (error.code === 'auth/invalid-email') {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    
    res.status(500).json({ success: false, error: 'Failed to send reset email' });
  }
});

// Google sign-in redirect
app.get('/api/auth/google', (req, res) => {
  // In a real implementation, you would redirect to Google OAuth
  // For now, we'll just redirect back to the app with a message
  res.redirect('/?error=google-auth-not-implemented');
});

// Message API Endpoints

// Save message
app.post('/api/messages/save', authMiddleware, async (req, res) => {
  try {
    const { scenario, relationshipType, message } = req.body;
    const userId = req.user.uid;
    
    if (!scenario || !relationshipType || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    // Save message to Firestore
    await admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('messages')
      .add({
        scenario,
        relationshipType,
        message,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Save message error:', error);
    res.status(500).json({ success: false, error: 'Failed to save message' });
  }
});

// Get message history
app.get('/api/messages/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;
    
    const messagesSnapshot = await admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .get();
    
    const messages = [];
    messagesSnapshot.forEach(doc => {
      messages.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      });
    });
    
    res.json({ success: true, messages });
  } catch (error) {
    console.error('Get message history error:', error);
    res.status(500).json({ success: false, error: 'Failed to get message history' });
  }
});

// User API Endpoints

// Update message count
app.post('/api/user/update-message-count', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;
    
    await admin.firestore().collection('users').doc(userId).update({
      messageCount: admin.firestore.FieldValue.increment(1)
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Update message count error:', error);
    res.status(500).json({ success: false, error: 'Failed to update message count' });
  }
});

// Check feedback status
app.get('/api/user/feedback-status', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;
    
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    const userData = userDoc.data();
    const messageCount = userData.messageCount || 0;
    const hasFeedbackSubmitted = userData.hasFeedbackSubmitted || false;
    const lastFeedbackSubmittedAt = userData.lastFeedbackSubmittedAt?.toDate() || null;
    
    // Determine if user needs to submit feedback
    // For example, show feedback prompt after every 5 messages
    const needsFeedback = messageCount % 5 === 0 && messageCount > 0 && !hasFeedbackSubmitted;
    
    res.json({ 
      success: true, 
      needsFeedback,
      lastFeedbackAt: lastFeedbackSubmittedAt
    });
  } catch (error) {
    console.error('Check feedback status error:', error);
    res.status(500).json({ success: false, error: 'Failed to check feedback status' });
  }
});

// Submit feedback
app.post('/api/user/submit-feedback', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;
    const feedbackData = req.body;
    
    await admin.firestore().collection('users').doc(userId).update({
      hasFeedbackSubmitted: true,
      lastFeedbackSubmittedAt: admin.firestore.FieldValue.serverTimestamp(),
      feedbackData
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit feedback' });
  }
});

// Generate message endpoint - proxy to Cloud Function
app.post('/api/generate-message', async (req, res) => {
  try {
    // Get user ID from session if available
    let userId = 'anonymous';
    
    try {
      const sessionCookie = req.cookies.session;
      if (sessionCookie) {
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        userId = decodedClaims.uid;
      }
    } catch (authError) {
      console.warn('Auth error in generate message:', authError);
      // Continue as anonymous user
    }
    
    // Forward the request to Cloud Function with Firebase server auth
    const functionUrl = 'https://us-central1-heartglowai.cloudfunctions.net/generateMessage';
    
    // Create server-signed token for authentication
    const token = await admin.auth().createCustomToken(userId || 'anonymous');
    
    // Forward request to Cloud Function
    const response = await axios.post(functionUrl, {
      ...req.body,
      userId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Generate message error:', error);
    
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate message' 
    });
  }
});

// Tweak message endpoint - proxy to Cloud Function
app.post('/api/tweak-message', async (req, res) => {
  try {
    // Get user ID from session if available
    let userId = 'anonymous';
    
    try {
      const sessionCookie = req.cookies.session;
      if (sessionCookie) {
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        userId = decodedClaims.uid;
      }
    } catch (authError) {
      console.warn('Auth error in tweak message:', authError);
      // Continue as anonymous user
    }
    
    // Forward the request to Cloud Function with Firebase server auth
    const functionUrl = 'https://us-central1-heartglowai.cloudfunctions.net/generateMessage';
    
    // Create server-signed token for authentication
    const token = await admin.auth().createCustomToken(userId || 'anonymous');
    
    // Forward request to Cloud Function
    const response = await axios.post(functionUrl, {
      ...req.body,
      userId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Tweak message error:', error);
    
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to tweak message' 
    });
  }
});

// Analytics endpoint
app.post('/api/analytics/log', (req, res) => {
  // In a production app, you'd send this to your analytics service
  // For now, just log it server-side
  console.log('Analytics event:', req.body);
  res.json({ success: true });
});

// Default route - serve the main app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'web-build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 