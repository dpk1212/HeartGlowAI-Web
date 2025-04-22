import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, getFirestore, Unsubscribe } from 'firebase/firestore';
import { Connection } from '@/types'; // Import the shared type
// TODO: Import Firebase app instance if not initialized globally
// import { app } from '@/firebase/firebaseConfig'; // Example path

// Assume db is initialized Firestore instance
// const db = getFirestore(app);

/**
 * Custom hook to fetch a user's connections in real-time from Firestore.
 * 
 * @param userId The ID of the authenticated user.
 * @returns An object containing the connections array and loading state.
 */
export const useConnections = (userId: string | null | undefined) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      // If no user ID, clear connections and stop loading
      setConnections([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    let unsubscribe: Unsubscribe | null = null;

    try {
      const db = getFirestore(); // Get Firestore instance (ensure it's initialized)
      const connectionsRef = collection(db, 'users', userId, 'connections');
      
      // Query to order connections (e.g., by creation date or last message)
      // For now, ordering by name, adjust as needed
      const q = query(connectionsRef, orderBy('name', 'asc')); 
      // Example: Order by last message: query(connectionsRef, orderBy('lastMessageTimestamp', 'desc'))

      unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          const fetchedConnections = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Connection, 'id'>),
          }));
          setConnections(fetchedConnections);
          setIsLoading(false);
        },
        (err) => {
          console.error("Error fetching connections: ", err);
          setError(err);
          setIsLoading(false);
        }
      );

    } catch (err) {
      console.error("Error setting up connection listener: ", err);
      setError(err instanceof Error ? err : new Error('Failed to setup listener'));
      setIsLoading(false);
    }

    // Cleanup function to unsubscribe from the listener when the component unmounts
    // or when the userId changes.
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId]); // Re-run effect if userId changes

  return { connections, isLoading, error };
}; 