import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getFirestore,
  CollectionReference,
  DocumentData,
  Unsubscribe,
  limit
} from 'firebase/firestore';
import { Message } from '@/types'; // Import the shared type
// TODO: Import Firebase app instance if not initialized globally
// import { app } from '@/firebase/firebaseConfig'; // Example path

// Assume db is initialized Firestore instance
// const db = getFirestore(app);

/**
 * Custom hook to fetch messages for a specific connection in real-time from Firestore.
 * 
 * @param userId The ID of the authenticated user.
 * @param connectionId The ID of the selected connection (chat thread). Null if none selected.
 * @returns An object containing the messages array and loading state.
 */
export const useMessages = (userId: string | null | undefined, connectionId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch only if userId is available
    if (!userId) {
      setMessages([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    let unsubscribe: Unsubscribe | null = null;

    try {
      const db = getFirestore();
      let messagesCollectionRef: CollectionReference<DocumentData>;

      // Determine the correct collection path
      if (connectionId && connectionId !== 'heartglow-ai') {
        // Path for a specific user connection
        messagesCollectionRef = collection(db, 'users', userId, 'connections', connectionId, 'messages');
        console.log(`Setting up listener for connection messages: users/${userId}/connections/${connectionId}/messages`);
      } else {
        // CORRECTED Path for the general HeartGlow AI chat
        messagesCollectionRef = collection(db, 'users', userId, 'messages'); // Use the direct messages collection
        console.log(`Setting up listener for general AI chat: users/${userId}/messages`); // Updated log
      }
      
      // MODIFIED orderBy field from 'timestamp' to 'createdAt' to match backend
      const q = query(messagesCollectionRef, orderBy('createdAt', 'asc'));

      unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          const fetchedMessages = querySnapshot.docs.map(doc => ({
            id: doc.id,
            // Ensure data mapping matches the Message type, especially the timestamp field name
            ...(doc.data() as Omit<Message, 'id'>),
            // Make sure the timestamp is correctly converted if needed (e.g., from Firestore Timestamp to Date)
            // Assuming the Message type expects a compatible format or this is handled
          }));
          setMessages(fetchedMessages);
          setIsLoading(false);
          console.log(`Fetched ${fetchedMessages.length} messages for ${connectionId || 'general chat'}`);
        },
        (err) => {
          console.error(`Error fetching messages for ${connectionId || 'general chat'}: `, err);
          setError(err);
          setIsLoading(false);
        }
      );

    } catch (err) {
      console.error("Error setting up message listener: ", err);
      setError(err instanceof Error ? err : new Error('Failed to setup listener'));
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      if (unsubscribe) {
        console.log(`Unsubscribing from messages for ${connectionId || 'general chat'}`); // Debug log
        unsubscribe();
      }
    };
  // Depend on userId and connectionId (null connectionId is now a valid state)
  }, [userId, connectionId]); 

  return { messages, isLoading, error };
}; 