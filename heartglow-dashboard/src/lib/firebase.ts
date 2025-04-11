import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBZiJPTs7dMccVgFV-YoTejnhy1bZNFEQY",
  authDomain: "heartglowai.firebaseapp.com",
  projectId: "heartglowai",
  storageBucket: "heartglowai.firebasestorage.app",
  messagingSenderId: "196565711798",
  appId: "1:196565711798:web:79e2b0320fd8e74ab0df17",
  measurementId: "G-KJMPL1DNPY"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }; 