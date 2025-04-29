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
  // Start loading initially, regardless of initial userId status, as a fetch will occur.
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If userId becomes null/undefined later (e.g., logout), clear state and stop loading.
    if (!userId) {
      setConnections([]);
      if (isLoading) setIsLoading(false);
      setError(null);
      return; // Stop the effect here
    }

    // When userId is present (or changes), we are effectively initiating a new fetch.
    // Do NOT set loading to true here synchronously, as it causes instability during ID transitions.
    // The initial state `useState(true)` covers the initial load, and the parent component's
    // check `if (isLoadingConnections)` handles showing loading during transitions.
    // setIsLoading(true); // <--- REMOVE THIS LINE
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
          setError(null);
        },
        (err) => {
          console.error("Error fetching connections: ", err);
          setError(err.message || 'Failed to fetch connections');
          setIsLoading(false);
        }
      );

    } catch (err: any) {
      console.error("Error setting up connection listener: ", err);
      setError(err.message || 'Failed to setup listener');
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