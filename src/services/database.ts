import {
  doc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  DocumentData
} from 'firebase/firestore';
import { db } from '../firebase/config';

interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
}

interface MessageData {
  userId: string;
  content: string;
  createdAt: Date;
}

export const saveUser = async (userData: UserData): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userData.uid);
    await setDoc(userRef, userData);
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (
  userId: string,
  data: Partial<UserData>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
  } catch (error) {
    throw error;
  }
};

export const saveMessage = async (messageData: MessageData): Promise<string> => {
  try {
    const messagesRef = collection(db, 'messages');
    const docRef = await addDoc(messagesRef, messageData);
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getMessages = async (userId: string): Promise<DocumentData[]> => {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

export const deleteMessage = async (messageId: string): Promise<void> => {
  try {
    const messageRef = doc(db, 'messages', messageId);
    await deleteDoc(messageRef);
  } catch (error) {
    throw error;
  }
}; 