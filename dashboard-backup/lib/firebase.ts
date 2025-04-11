import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBZiJPTs7dMccVgFV-YoTejnhy1bZNFEQY",
  authDomain: "heartglowai.firebaseapp.com",
  projectId: "heartglowai",
  storageBucket: "heartglowai.firebasestorage.app",
  messagingSenderId: "196565711798",
  appId: "1:196565711798:web:79e2b0320fd8e74ab0df17",
  measurementId: "G-KJMPL1DNPY"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase }; 