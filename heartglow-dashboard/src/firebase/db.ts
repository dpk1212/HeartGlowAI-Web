import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  getDoc,
  doc,
  Timestamp,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './config';
export { db } from './config';
import { User } from 'firebase/auth';

// Types from the database schema
export type Connection = {
  id: string;
  name: string;
  relationship: string;
  otherRelationship?: string;
  specificRelationship?: string;
  yearsKnown?: number;
  communicationStyle?: string;
  relationshipGoal?: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  messageCount?: number;
  lastMessageDate?: Timestamp;
  lastMessageType?: string;
  lastMessageFormat?: string;
  lastMessageCategory?: string;
};

export type Message = {
  id: string;
  content: string;
  recipientName: string;
  recipientId?: string;
  relationship?: string;
  intent?: string;
  tone?: string;
  intensity?: number;
  createdAt: Timestamp;
  insights?: string[];
  messageCategory?: string;
  messageFormat?: string;
  messageIntention?: string;
  messageConfigTimestamp?: string;
};

// Helper function to determine connection frequency based on lastMessageDate
export const getConnectionFrequency = (connection: Connection): 'frequent' | 'recent' | 'new' => {
  // If no previous messages, it's a new connection
  if (!connection.messageCount || connection.messageCount === 0) {
    return 'new';
  }

  // If no lastMessageDate, default to recent
  if (!connection.lastMessageDate) {
    return 'recent';
  }

  const now = new Date();
  const lastMessageDate = connection.lastMessageDate.toDate();
  const daysDifference = Math.floor((now.getTime() - lastMessageDate.getTime()) / (1000 * 3600 * 24));

  // If messaged in the last 7 days, consider it frequent
  if (daysDifference <= 7) {
    return 'frequent';
  }
  // If messaged in the last 30 days, consider it recent
  else if (daysDifference <= 30) {
    return 'recent';
  }
  // Otherwise, it's new
  else {
    return 'new';
  }
};

// Fetch user connections
export const fetchUserConnections = async (user: User | null, maxCount = 10) => {
  if (!user) {
    console.log('No authenticated user found for fetching connections');
    return [];
  }

  try {
    console.log(`Fetching connections for user ID: ${user.uid}`);
    const connectionsRef = collection(db, `users/${user.uid}/connections`);
    const q = query(
      connectionsRef,
      orderBy('updatedAt', 'desc'),
      limit(maxCount)
    );
    
    console.log('Executing Firestore query for connections');
    const querySnapshot = await getDocs(q);
    console.log(`Retrieved ${querySnapshot.docs.length} connections from Firestore`);
    
    const connections = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log(`Connection found - ID: ${doc.id}, Name: ${data.name}, Relationship: ${data.relationship}`);
      return {
        id: doc.id,
        ...data,
      };
    }) as Connection[];
    
    return connections;
  } catch (error) {
    console.error('Error fetching connections:', error);
    return [];
  }
};

// Fetch user messages
export const fetchUserMessages = async (user: User | null, maxCount = 5) => {
  if (!user) {
    console.log('No authenticated user found for fetching messages');
    return [];
  }

  try {
    console.log(`Fetching messages for user ID: ${user.uid}`);
    const messagesRef = collection(db, `users/${user.uid}/messages`);
    const q = query(
      messagesRef,
      orderBy('createdAt', 'desc'),
      limit(maxCount)
    );
    
    console.log('Executing Firestore query for messages');
    const querySnapshot = await getDocs(q);
    console.log(`Retrieved ${querySnapshot.docs.length} messages from Firestore`);
    
    const messages = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log(`Message found - ID: ${doc.id}, Recipient: ${data.recipientName}`);
      return {
        id: doc.id,
        ...data,
      };
    }) as Message[];
    
    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

// Add a new connection
export const addConnection = async (user: User | null, connectionData: Omit<Connection, 'id' | 'createdAt' | 'updatedAt'>) => {
  if (!user) throw new Error('User not authenticated');

  try {
    const connectionsRef = collection(db, `users/${user.uid}/connections`);
    const now = Timestamp.now();
    
    const newConnection = {
      ...connectionData,
      createdAt: now,
      updatedAt: now,
      messageCount: 0
    };
    
    const docRef = await addDoc(connectionsRef, newConnection);
    return {
      id: docRef.id,
      ...newConnection
    };
  } catch (error) {
    console.error('Error adding connection:', error);
    throw error;
  }
};

// Update an existing connection
export const updateConnection = async (user: User | null, connection: Partial<Connection> & { id: string }) => {
  if (!user) throw new Error('User not authenticated');

  try {
    const connectionRef = doc(db, `users/${user.uid}/connections/${connection.id}`);
    
    const updateData = {
      ...connection,
      updatedAt: Timestamp.now(),
    };
    
    // Remove id from the data to be updated (it's part of the path)
    delete updateData.id;
    
    await updateDoc(connectionRef, updateData);
    
    // Fetch and return the updated document
    const updatedDoc = await getDoc(connectionRef);
    return {
      id: connection.id,
      ...updatedDoc.data()
    } as Connection;
  } catch (error) {
    console.error('Error updating connection:', error);
    throw error;
  }
};

// Format relative time for display
export const formatRelativeTime = (timestamp: Timestamp | undefined): string => {
  if (!timestamp) return 'Never';
  
  const now = new Date();
  const date = timestamp.toDate();
  const diff = now.getTime() - date.getTime();
  
  // Convert milliseconds to days/hours/minutes
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 30) {
    return `${Math.floor(days / 30)} ${Math.floor(days / 30) === 1 ? 'month' : 'months'} ago`;
  } else if (days > 0) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else {
    return 'Just now';
  }
};

// Delete a connection
export const deleteConnection = async (user: User | null, connectionId: string) => {
  if (!user) throw new Error('User not authenticated');

  try {
    console.log(`Deleting connection with ID: ${connectionId} for user: ${user.uid}`);
    const connectionRef = doc(db, `users/${user.uid}/connections/${connectionId}`);
    
    await deleteDoc(connectionRef);
    console.log(`Successfully deleted connection with ID: ${connectionId}`);
    
    return true;
  } catch (error) {
    console.error('Error deleting connection:', error);
    throw error;
  }
};

// Fetch a specific connection by ID
export const fetchConnectionById = async (user: User | null, connectionId: string) => {
  if (!user) throw new Error('User not authenticated');

  try {
    const connectionRef = doc(db, `users/${user.uid}/connections/${connectionId}`);
    const connectionSnap = await getDoc(connectionRef);
    
    if (connectionSnap.exists()) {
      return {
        id: connectionSnap.id,
        ...connectionSnap.data()
      } as Connection;
    } else {
      throw new Error('Connection not found');
    }
  } catch (error) {
    console.error('Error fetching connection:', error);
    throw error;
  }
}; 