// Web Firebase implementation
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Firebase configuration - using environment variables or hardcoded fallbacks
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyBZiJPTs7dMccVgFV-YoTejnhy1bZNFEQY",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "heartglowai.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "heartglowai",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "heartglowai.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "196565711798",
  appId: process.env.FIREBASE_APP_ID || "1:196565711798:web:79e2b0320fd8e74ab0df17",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-KJMPL1DNPY"
};

// Initialize Firebase if it hasn't been initialized already
if (!firebase.apps.length) {
  try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase Web initialized successfully');
  } catch (error) {
    console.error('Firebase Web initialization error:', error);
  }
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();

// Helper function to check if Firebase is properly configured
export const isFirebaseConfigured = () => {
  return !!firebaseConfig.apiKey && !!firebaseConfig.projectId && 
         !!firebaseConfig.authDomain && !!firebaseConfig.appId;
};

export default firebase; 