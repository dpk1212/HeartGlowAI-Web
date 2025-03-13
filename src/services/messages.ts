import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { getCurrentUser } from './auth';

export interface Message {
  id?: string;
  userId: string;
  content: string;
  relationshipType: string;
  status: string;
  frequency: string;
  challenges: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const saveMessage = async (message: Omit<Message, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const user = getCurrentUser();
  if (!user) throw new Error('User must be logged in to save messages');

  const messageData = {
    ...message,
    userId: user.uid,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'messages'), messageData);
  return docRef.id;
};

export const getMessages = async (limitCount: number = 10): Promise<Message[]> => {
  const user = getCurrentUser();
  if (!user) throw new Error('User must be logged in to get messages');

  const messagesQuery = query(
    collection(db, 'messages'),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const querySnapshot = await getDocs(messagesQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
  })) as Message[];
};

export const deleteMessage = async (messageId: string): Promise<void> => {
  const user = getCurrentUser();
  if (!user) throw new Error('User must be logged in to delete messages');

  const messageRef = doc(db, 'messages', messageId);
  await deleteDoc(messageRef);
}; 