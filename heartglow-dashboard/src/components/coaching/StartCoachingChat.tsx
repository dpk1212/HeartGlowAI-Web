import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, getDocs, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useRouter } from 'next/router';
import { CoachingThread } from '../../types/coaching'; // Import the type
import { httpsCallable } from 'firebase/functions'; // Import httpsCallable
import { getFunctions } from 'firebase/functions'; // Import getFunctions

interface StartCoachingChatProps {
  onClose: () => void;
}

// Define a simple Connection type for now (can import from elsewhere later)
interface Connection {
  id: string;
  name: string;
  relationship: string;
}

// Initialize Firebase Functions instance
const functionsInstance = getFunctions(); 

const StartCoachingChat = ({ onClose }: StartCoachingChatProps) => {
  const { currentUser } = useAuth();
  const router = useRouter(); // Add router hook
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [isStartingChat, setIsStartingChat] = useState(false); // Add state for starting chat
  const [startChatError, setStartChatError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchConnections = async () => {
      if (!currentUser) return;
      setLoadingConnections(true);
      try {
        const connectionsRef = collection(db, 'users', currentUser.uid, 'connections');
        const q = query(connectionsRef);
        const querySnapshot = await getDocs(q);
        const fetchedConnections = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Connection[];
        setConnections(fetchedConnections);
      } catch (error) {
        console.error("Error fetching connections: ", error);
        // TODO: Add user-facing error handling
      } finally {
        setLoadingConnections(false);
      }
    };
    fetchConnections();
  }, [currentUser]);

  const handleStartChat = async () => { 
    if (!selectedConnection || !currentUser || isStartingChat) return;
    
    setIsStartingChat(true);
    setStartChatError(null);

    try {
      const threadsRef = collection(db, 'coachingThreads');
      const q = query(threadsRef, 
                      where('userId', '==', currentUser.uid),
                      where('connectionId', '==', selectedConnection)
                     );

      const querySnapshot = await getDocs(q);
      let threadId: string;
      let isNewThread = false; // Flag to check if we created a new thread

      if (!querySnapshot.empty) {
        // Existing thread found
        threadId = querySnapshot.docs[0].id;
        console.log(`Found existing thread: ${threadId}`);
      } else {
        // No existing thread, create a new one
        isNewThread = true; // Set the flag
        console.log(`No existing thread found for connection ${selectedConnection}. Creating new one.`);
        const selectedConnDetails = connections.find(c => c.id === selectedConnection);
        const newThreadData: Omit<CoachingThread, 'id'> = {
          userId: currentUser.uid,
          connectionId: selectedConnection,
          threadTitle: `Chat about ${selectedConnDetails?.name || 'Connection'}`,
          lastActivity: serverTimestamp() as Timestamp, 
          createdAt: serverTimestamp() as Timestamp,
          connectionSnapshot: selectedConnDetails ? { 
            name: selectedConnDetails.name,
            relationship: selectedConnDetails.relationship,
          } : undefined,
        };

        const docRef = await addDoc(threadsRef, newThreadData);
        threadId = docRef.id;
        console.log(`Created new thread: ${threadId}`);
        
        // --- Trigger initial coach message --- 
        if (isNewThread) {
          console.log(`Triggering initial coach message for new thread: ${threadId}`);
          try {
            const callCoachingAssistant = httpsCallable(functionsInstance, 'coachingAssistant');
            // Call without userMessage to signal initial trigger
            await callCoachingAssistant({ threadId: threadId }); 
            console.log(`Initial message trigger function called successfully for thread: ${threadId}`);
          } catch (triggerError) {
             // Log the error but don't block navigation
             console.error(`Error triggering initial coach message for thread ${threadId}:`, triggerError);
             // Optionally, display a non-critical error to the user
          } 
        }
        // --- End trigger --- 
      }

      // Navigate to the chat view
      router.push(`/coaching/${threadId}`);

    } catch (error) {
      console.error("Error starting or finding chat thread: ", error);
      setStartChatError("Could not start or find the chat thread. Please try again.");
      setIsStartingChat(false); 
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Start Coaching Chat
      </h2>
      {loadingConnections ? (
        <p className="text-gray-500 dark:text-gray-400">Loading connections...</p>
      ) : connections.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No connections found. Add connections first.</p>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {connections.map(conn => (
            <div 
              key={conn.id}
              onClick={() => setSelectedConnection(conn.id)}
              className={`p-3 border rounded-md cursor-pointer transition-colors 
                ${selectedConnection === conn.id 
                  ? 'bg-heartglow-pink/10 border-heartglow-pink ring-1 ring-heartglow-pink' 
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <p className="font-medium text-gray-900 dark:text-gray-100">{conn.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{conn.relationship}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 flex justify-end space-x-3">
        <button 
          onClick={onClose}
          className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={handleStartChat}
          disabled={!selectedConnection || loadingConnections || isStartingChat}
          className={`px-4 py-2 rounded-md border border-transparent shadow-sm font-medium text-white flex items-center justify-center
            ${!selectedConnection || loadingConnections || isStartingChat
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
              : 'bg-heartglow-pink hover:bg-heartglow-pink/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink'
            }`}
        >
          {isStartingChat ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          ) : null}
          {isStartingChat ? 'Starting...' : 'Start Chat'}
        </button>
      </div>
      {startChatError && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-right">{startChatError}</p>
      )}
    </div>
  );
};

export default StartCoachingChat; 