import { 
  collection, 
  doc, 
  query, 
  where, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  orderBy, 
  limit,
  serverTimestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';

// Types based on the database schema
export interface ConnectionData extends DocumentData {
  id?: string;
  name: string;
  relationship: string;
  otherRelationship?: string;
  specificRelationship?: string;
  yearsKnown?: number;
  communicationStyle?: string;
  relationshipGoal?: string;
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
  messageCount?: number;
  lastMessageDate?: any;
  lastMessageType?: string;
  lastMessageFormat?: string;
  lastMessageCategory?: string;
}

export interface MessageData extends DocumentData {
  id?: string;
  content: string;
  recipientName: string;
  recipientId?: string | null;
  relationship?: string | null;
  intent?: string | null;
  tone?: string | null;
  intensity?: number;
  createdAt?: any;
  insights?: any[];
  messageCategory?: string;
  messageFormat?: string;
  messageIntention?: string;
  messageConfigTimestamp?: string;
}

// Get user's connections
export const getUserConnections = async (userId: string) => {
  const connectionsRef = collection(db, 'users', userId, 'connections');
  const q = query(connectionsRef, orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ConnectionData));
};

// Get user's recent messages
export const getRecentMessages = async (userId: string, messageLimit = 3) => {
  const messagesRef = collection(db, 'users', userId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(messageLimit));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MessageData));
};

// Save a connection
export const saveConnection = async (userId: string, connectionData: ConnectionData) => {
  const connectionsRef = collection(db, 'users', userId, 'connections');
  
  if (connectionData.id) {
    const docRef = doc(db, 'users', userId, 'connections', connectionData.id);
    await updateDoc(docRef, {
      ...connectionData,
      updatedAt: serverTimestamp()
    });
    return connectionData.id;
  } else {
    const docRef = await addDoc(connectionsRef, {
      ...connectionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      messageCount: 0
    });
    return docRef.id;
  }
};

// Save a message
export const saveMessage = async (userId: string, messageData: MessageData) => {
  const messagesRef = collection(db, 'users', userId, 'messages');
  const docRef = await addDoc(messagesRef, {
    ...messageData,
    createdAt: serverTimestamp()
  });
  
  // If the message has a recipient, update their message count
  if (messageData.recipientId) {
    const connectionRef = doc(db, 'users', userId, 'connections', messageData.recipientId);
    const connectionSnap = await getDoc(connectionRef);
    
    if (connectionSnap.exists()) {
      const connectionData = connectionSnap.data();
      await updateDoc(connectionRef, {
        messageCount: (connectionData.messageCount || 0) + 1,
        lastMessageDate: serverTimestamp(),
        lastMessageType: messageData.intent || null,
        lastMessageFormat: messageData.messageFormat || null,
        lastMessageCategory: messageData.messageCategory || null,
        updatedAt: serverTimestamp()
      });
    }
  }
  
  return docRef.id;
}; 