import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  signInAnonymously as firebaseSignInAnonymously
} from 'firebase/auth';
import { app } from './config';

export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signIn = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const auth_signUp = async (email: string, password: string) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signInAnonymously = async () => {
  try {
    return await firebaseSignInAnonymously(auth);
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const onAuthStateChangedListener = (callback: (user: User | null) => void) => {
  try {
    console.log('Setting up auth state listener');
    return onAuthStateChanged(auth, callback, (error) => {
      console.error('Auth state change error:', error);
      // Ensure we call the callback even on error to prevent infinite loading
      callback(null);
    });
  } catch (error) {
    console.error('Failed to set up auth state listener:', error);
    // Return a dummy unsubscribe function
    setTimeout(() => callback(null), 100);
    return () => {};
  }
}; 