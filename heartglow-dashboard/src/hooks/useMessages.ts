import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getFirestore,
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
    // Don't fetch if userId or connectionId is missing
    if (!userId || !connectionId) {
      setMessages([]);
      setIsLoading(false); 
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    let unsubscribe: Unsubscribe | null = null;

    try {
      const db = getFirestore(); // Get Firestore instance
      const messagesRef = collection(db, 'users', userId, 'connections', connectionId, 'messages');
      
      // Query messages, ordered by timestamp ascending
      // Consider adding limit() for performance with very long chats, though requires pagination logic
      const q = query(messagesRef, orderBy('timestamp', 'asc')); 
      // Example with limit: query(messagesRef, orderBy('timestamp', 'desc'), limit(50)); // descending for last N

      unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          const fetchedMessages = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Message, 'id'>),
          }));
          // If query was descending for limit, reverse here: fetchedMessages.reverse()
          setMessages(fetchedMessages);
          setIsLoading(false);
        },
        (err) => {
          console.error(`Error fetching messages for connection ${connectionId}: `, err);
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
        unsubscribe();
      }
    };
  // Depend on both userId and connectionId
  }, [userId, connectionId]); 

  return { messages, isLoading, error };
}; 