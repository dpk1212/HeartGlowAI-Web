import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Get current user's ID token with force refresh
export const getIdToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');
  return await user.getIdToken(true);
};

// Login with email and password
export const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error logging in with email and password:', error);
    throw error;
  }
};

// Sign up with email and password
export const signUpWithEmailAndPassword = async (email: string, password: string) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing up with email and password:', error);
    throw error;
  }
};

// Log in with Google
export const logInWithGoogle = async () => {
  try {
    const googleProvider = new GoogleAuthProvider();
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error('Error logging in with Google:', error);
    throw error;
  }
};

// Sign out
export const logOut = async () => {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    return await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Auth state observer hook
export const onAuthStateChangedListener = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback);
}; 