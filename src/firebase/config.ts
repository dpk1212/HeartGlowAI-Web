import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Default configuration for demo purposes (using empty strings for fallback)
// In production, you would use real values from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBn7MnPVe9wdaUkH6AQDaNm_TK0_i-Fs_A",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "heartglowai-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "heartglowai-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "heartglowai-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abc123def456ghi789",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ABC123DEF4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Only initialize analytics if supported
export const analytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export default app; 