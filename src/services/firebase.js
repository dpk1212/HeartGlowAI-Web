import { Platform } from 'react-native';
import { isWeb } from './platform';

let firebase, auth, firestore, isFirebaseConfigured;

// Use the appropriate Firebase implementation based on platform
if (isWeb) {
  try {
    // Import web-specific Firebase implementation
    const webFirebase = require('./firebase-web');
    firebase = webFirebase.default;
    auth = webFirebase.auth;
    firestore = webFirebase.firestore;
    isFirebaseConfigured = webFirebase.isFirebaseConfigured;
    console.log('Using web Firebase implementation');
  } catch (error) {
    console.error('Error importing web Firebase:', error);
  }
} else {
  try {
    // Import React Native Firebase implementation (this is the existing code)
    const nativeFirebase = require('@react-native-firebase/app');
    const nativeAuth = require('@react-native-firebase/auth');
    const nativeFirestore = require('@react-native-firebase/firestore');
    
    // Firebase configuration
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY || "AIzaSyBZiJPTs7dMccVgFV-YoTejnhy1bZNFEQY",
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || "heartglowai.firebaseapp.com", 
      projectId: process.env.FIREBASE_PROJECT_ID || "heartglowai",
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "heartglowai.firebasestorage.app",
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "196565711798",
      appId: process.env.FIREBASE_APP_ID || "1:196565711798:web:79e2b0320fd8e74ab0df17",
      measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-KJMPL1DNPY"
    };
    
    console.log('Initializing Firebase with config:', JSON.stringify({
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain
    }));
    
    // Initialize Firebase if it hasn't been initialized already
    if (!nativeFirebase.apps.length) {
      try {
        // Check if we have the required configuration values
        if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
          console.error('Firebase configuration missing. Please check your environment variables.');
          throw new Error('Firebase configuration incomplete. Please provide required environment variables.');
        } else {
          nativeFirebase.initializeApp(firebaseConfig);
          console.log('Firebase initialized successfully');
        }
      } catch (error) {
        console.error('Firebase initialization error:', error);
      }
    }
    
    firebase = nativeFirebase;
    auth = nativeAuth().auth();
    firestore = nativeFirestore().firestore();
    
    // Helper function to check if Firebase is properly configured
    isFirebaseConfigured = () => {
      return !!process.env.FIREBASE_API_KEY && !!process.env.FIREBASE_PROJECT_ID && 
             !!process.env.FIREBASE_AUTH_DOMAIN && !!process.env.FIREBASE_APP_ID;
    };
    
    console.log('Using native Firebase implementation');
  } catch (error) {
    console.error('Error importing native Firebase:', error);
  }
}

// Function to mark user as having submitted feedback
export const markFeedbackSubmitted = async (userId) => {
  try {
    await firestore.collection('users').doc(userId).update({
      hasFeedbackSubmitted: true,
      feedbackSubmittedAt: firestore.FieldValue.serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error marking feedback as submitted:', error);
    return false;
  }
};

// Function to check if user has submitted feedback
export const hasUserSubmittedFeedback = async (userId) => {
  try {
    const userDoc = await firestore.collection('users').doc(userId).get();
    return userDoc.exists && userDoc.data().hasFeedbackSubmitted === true;
  } catch (error) {
    console.error('Error checking feedback status:', error);
    return false;
  }
};

export { firebase, auth, firestore, isFirebaseConfigured };
export default firebase; 