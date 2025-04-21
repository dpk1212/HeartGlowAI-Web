import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, getDocs, addDoc, serverTimestamp, Timestamp, increment } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useRouter } from 'next/router';
import { CoachingThread } from '../../types/coaching'; // Import the type
import { httpsCallable } from 'firebase/functions'; // Import httpsCallable
import { getFunctions } from 'firebase/functions'; // Import getFunctions
import { usePaywall } from '../../context/PaywallContext'; // Import usePaywall

interface StartCoachingChatProps {
  onClose: () => void;
}

// Define a simple Connection type for now (can import from elsewhere later)
interface Connection {
  id: string;
  name: string;
  relationship: string;
}

// Define possible chat purposes
const chatPurposes = [
  { id: 'improve_communication', label: 'Improve Communication' },
  { id: 'navigate_disagreement', label: 'Navigate Disagreement' },
  { id: 'express_appreciation', label: 'Express Appreciation' },
  { id: 'strengthen_connection', label: 'Strengthen Connection' },
  { id: 'open_chat', label: 'Open Chat / Other' },
];

// Initialize Firebase Functions instance
const functionsInstance = getFunctions(); 

// Define the free coaching limit
const FREE_COACHING_LIMIT = 1;

const StartCoachingChat = ({ onClose }: StartCoachingChatProps) => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const { openPaywall } = usePaywall();
  const router = useRouter(); // Add router hook
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null); // New state for purpose
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
    if (!selectedConnection || !selectedPurpose || !currentUser || isStartingChat) return;
    
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
      let isNewThread = false;

      if (!querySnapshot.empty) {
        // Existing thread found - Allow access (or implement paywall for resuming later)
        threadId = querySnapshot.docs[0].id;
        console.log(`Found existing thread: ${threadId}`);
      } else {
        // ----- PAYWALL CHECK FOR NEW THREAD ----- 
        const sessionsStarted = userProfile?.coachingSessionsStarted ?? 0;
        const isPremium = userProfile?.isPremium ?? false;
        
        if (!isPremium && sessionsStarted >= FREE_COACHING_LIMIT) {
            console.log(`Paywall triggered: Coaching session limit (${FREE_COACHING_LIMIT}) reached.`);
            setStartChatError('Upgrade to Premium to start more coaching sessions.');
            setIsStartingChat(false);
            openPaywall(); // Open the modal
            return; // Stop execution
        }
        // ----- END PAYWALL CHECK -----

        // No existing thread, create a new one
        isNewThread = true;
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
          initialPurpose: selectedPurpose,
        };

        const docRef = await addDoc(threadsRef, newThreadData);
        threadId = docRef.id;
        console.log(`Created new thread: ${threadId}`);

        // --- Increment Usage Counter --- 
        if (isNewThread) {
           try {
              await updateUserProfile({ coachingSessionsStarted: increment(1) });
              console.log(`Incremented coachingSessionsStarted for user ${currentUser.uid}`);
           } catch (updateError) {
              console.error(`Failed to increment coachingSessionsStarted for user ${currentUser.uid}`, updateError);
              // Decide if this is critical - maybe proceed anyway but log?
           }
        }
        // --- End Increment Usage Counter --- 
        
        // Trigger initial coach message, passing the purpose
        if (isNewThread) {
          console.log(`Triggering initial coach message for new thread: ${threadId} with purpose: ${selectedPurpose}`);
          try {
            const callCoachingAssistant = httpsCallable(functionsInstance, 'coachingAssistant');
            // Pass threadId AND initialPurpose
            await callCoachingAssistant({ threadId: threadId, initialPurpose: selectedPurpose }); 
            console.log(`Initial message trigger function called successfully for thread: ${threadId}`);
          } catch (triggerError) {
             console.error(`Error triggering initial coach message for thread ${threadId}:`, triggerError);
          } 
        }
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
      
      {/* Step 1: Select Connection */}
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">1. Select Connection</h3>
      {loadingConnections ? (
        <p>Loading connections...</p>
      ) : connections.length === 0 ? (
        <p>No connections found.</p>
      ) : (
        <div className="space-y-3 max-h-40 overflow-y-auto pr-2 mb-6 border rounded-md p-2 border-gray-300 dark:border-gray-600">
          {connections.map(conn => (
            <div 
              key={conn.id}
              onClick={() => setSelectedConnection(conn.id)}
              className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedConnection === conn.id ? 'bg-heartglow-pink/10 border-heartglow-pink ring-1 ring-heartglow-pink' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <p className="font-medium text-gray-900 dark:text-gray-100">{conn.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{conn.relationship}</p>
            </div>
          ))}
        </div>
      )}

      {/* Step 2: Select Initial Purpose */}
      <h3 className={`text-lg font-medium mb-2 ${!selectedConnection ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}`}>2. Select Initial Purpose</h3>
      <div className={`space-y-2 ${!selectedConnection ? 'opacity-50 pointer-events-none' : ''}`}> 
        {chatPurposes.map(purpose => (
            <div 
              key={purpose.id}
              onClick={() => setSelectedPurpose(purpose.id)}
              className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedPurpose === purpose.id ? 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-500 dark:border-indigo-600 ring-1 ring-indigo-500' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <p className="font-medium text-gray-900 dark:text-gray-100">{purpose.label}</p>
            </div>
          ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-3">
        <button 
          onClick={onClose}
          className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={handleStartChat}
          // Disable if connection or purpose not selected, or loading
          disabled={!selectedConnection || !selectedPurpose || loadingConnections || isStartingChat}
          className={`px-4 py-2 rounded-md border border-transparent shadow-sm font-medium text-white flex items-center justify-center ${!selectedConnection || !selectedPurpose || loadingConnections || isStartingChat ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-heartglow-pink hover:bg-heartglow-pink/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink'}`}
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