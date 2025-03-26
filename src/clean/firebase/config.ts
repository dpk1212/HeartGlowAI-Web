import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration with your actual project details
const firebaseConfig = {
  apiKey: "AIzaSyBZiJPTs7dMccVgFV-YoTejnhy1bZNFEQY",
  authDomain: "heartglowai.firebaseapp.com",
  projectId: "heartglowai",
  storageBucket: "heartglowai.appspot.com",
  messagingSenderId: "196565711798",
  appId: "1:196565711798:web:79e2b0320fd8e74ab0df17",
  measurementId: "G-KJMPL1DNPY"
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