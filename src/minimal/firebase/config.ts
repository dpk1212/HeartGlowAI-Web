import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
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

// Initialize Firebase auth
export const auth = getAuth(app);

export default app; 