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
  serverTimestamp,
  getDoc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { auth } from '../firebase/config';

export interface Message {
  id: string;
  relationshipType: string;
  status: string;
  frequency: string;
  challenges: string[];
  content: string;
  createdAt: Date;
  userId: string;
}

export const createMessage = async (messageData: Omit<Message, 'id' | 'createdAt' | 'userId'>): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be logged in to create a message');
    }

    const docRef = await addDoc(collection(db, 'messages'), {
      ...messageData,
      userId: user.uid,
      createdAt: serverTimestamp()
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
};

export const getMessages = async (limitCount = 10): Promise<Message[]> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return [];
    }

    const messagesQuery = query(
      collection(db, 'messages'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(messagesQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        relationshipType: data.relationshipType,
        status: data.status,
        frequency: data.frequency,
        challenges: data.challenges,
        content: data.content,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        userId: data.userId
      };
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

export const getMessage = async (messageId: string): Promise<Message | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be logged in to get a message');
    }

    const docRef = doc(db, 'messages', messageId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    
    // Verify the message belongs to the current user
    if (data.userId !== user.uid) {
      throw new Error('Unauthorized access to message');
    }

    return {
      id: docSnap.id,
      relationshipType: data.relationshipType,
      status: data.status,
      frequency: data.frequency,
      challenges: data.challenges,
      content: data.content,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      userId: data.userId
    };
  } catch (error) {
    console.error('Error fetching message:', error);
    return null;
  }
};

export const updateMessage = async (messageId: string, updates: Partial<Omit<Message, 'id' | 'createdAt' | 'userId'>>): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be logged in to update a message');
    }

    // Verify ownership before updating
    const messageRef = doc(db, 'messages', messageId);
    const messageSnap = await getDoc(messageRef);
    
    if (!messageSnap.exists()) {
      throw new Error('Message not found');
    }
    
    if (messageSnap.data().userId !== user.uid) {
      throw new Error('Unauthorized access to message');
    }

    await updateDoc(messageRef, updates);
  } catch (error) {
    console.error('Error updating message:', error);
    throw error;
  }
};

export const deleteMessage = async (messageId: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be logged in to delete a message');
    }

    // Verify ownership before deleting
    const messageRef = doc(db, 'messages', messageId);
    const messageSnap = await getDoc(messageRef);
    
    if (!messageSnap.exists()) {
      throw new Error('Message not found');
    }
    
    if (messageSnap.data().userId !== user.uid) {
      throw new Error('Unauthorized access to message');
    }

    await deleteDoc(messageRef);
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}; 