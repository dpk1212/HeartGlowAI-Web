import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID
} from '@env';

// Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

console.log('Initializing Firebase with config:', JSON.stringify({
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
}));

// Initialize Firebase if it hasn't been initialized already
if (!firebase.apps.length) {
  try {
    // Check if we have the required configuration values
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.error('Firebase configuration missing. Please check your environment variables.');
      throw new Error('Firebase configuration incomplete. Please provide required environment variables.');
    } else {
      firebase.initializeApp(firebaseConfig);
      console.log('Firebase initialized successfully');
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();

// Helper function to check if Firebase is properly configured
export const isFirebaseConfigured = () => {
  return !!FIREBASE_API_KEY && !!FIREBASE_PROJECT_ID && 
         !!FIREBASE_AUTH_DOMAIN && !!FIREBASE_APP_ID;
};

export default firebase; 