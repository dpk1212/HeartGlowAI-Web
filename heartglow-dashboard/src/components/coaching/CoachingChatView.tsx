import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router'; // Import useRouter
// import { Button } from './ui/button'; // Removed unused shadcn button import
import { PaperPlaneIcon, TrashIcon } from '@radix-ui/react-icons'; // Added TrashIcon
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import { db } from '../../lib/firebase'; // Import only db
import { doc, getDoc, collection, query, orderBy, onSnapshot, Timestamp, addDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions
import { getFunctions, httpsCallable } from 'firebase/functions'; // Import functions SDK methods
import { CoachingThread, ThreadMessage } from '../../types/coaching'; // Import types

// Initialize Firebase Functions instance (Re-added)
const functionsInstance = getFunctions();

interface CoachingChatViewProps {
  threadId: string; // Passed in from the dynamic page
}

const CoachingChatView: React.FC<CoachingChatViewProps> = ({ threadId }) => {
  const { currentUser } = useAuth(); // Get current user
  const [threadData, setThreadData] = useState<CoachingThread | null>(null);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [loadingThread, setLoadingThread] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null); // Ref for scrolling
  const router = useRouter(); // Initialize router
  const [isDeleting, setIsDeleting] = useState(false); // State for delete operation
  
  // Fetch thread metadata
  useEffect(() => {
    if (!threadId) return;
    setLoadingThread(true);
    setError(null);
    const threadRef = doc(db, 'coachingThreads', threadId);

    getDoc(threadRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          // Basic validation: Ensure the user owns this thread
          const data = { id: docSnap.id, ...docSnap.data() } as CoachingThread;
          if (data.userId === currentUser?.uid) {
             setThreadData(data);
          } else {
             setError("You don't have permission to view this chat.");
             console.error("User mismatch for thread access");
          }
        } else {
          setError("Chat thread not found.");
        }
      })
      .catch((err) => {
        console.error("Error fetching thread data: ", err);
        setError("Failed to load chat details.");
      })
      .finally(() => {
        setLoadingThread(false);
      });
  }, [threadId, currentUser]); // Rerun if threadId or user changes

  // Subscribe to message updates
  useEffect(() => {
    if (!threadId) return;
    
    setLoadingMessages(true);
    setError(null);
    const messagesRef = collection(db, 'coachingThreads', threadId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc')); // Get messages oldest first

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const fetchedMessages = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as ThreadMessage[];
        setMessages(fetchedMessages);
        setLoadingMessages(false);
      },
      (err) => {
        console.error("Error fetching messages: ", err);
        setError("Failed to load messages.");
        setLoadingMessages(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [threadId]); // Rerun if threadId changes

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !threadId) return;
    
    const messageContent = newMessage.trim();
    setNewMessage(''); // Clear input immediately

    // Construct the user message object
    const userMessageData: Omit<ThreadMessage, 'id' | 'timestamp'> = {
      threadId: threadId,
      sender: 'user',
      content: messageContent,
    };

    try {
      // 1. Save user message to Firestore
      const messagesRef = collection(db, 'coachingThreads', threadId, 'messages');
      const userMessageDocRef = await addDoc(messagesRef, {
        ...userMessageData,
        timestamp: serverTimestamp(), // Use server timestamp
      });
      console.log("User message saved with ID: ", userMessageDocRef.id);

      // 2. Call the coachingAssistant Cloud Function
      console.log("Calling coachingAssistant function...");
      // Use the initialized functionsInstance
      const callCoachingAssistant = httpsCallable(functionsInstance, 'coachingAssistant'); 
      await callCoachingAssistant({ 
        threadId: threadId,
        userMessage: messageContent, // Send the original content
       });
      console.log("coachingAssistant function called successfully.");

      // AI response will be added by the function and picked up by the onSnapshot listener

    } catch (error) {
      console.error("Error sending message or calling function: ", error);
      // TODO: Display user-facing error (e.g., could not send message)
      // Optionally, revert the optimistic UI update or add an error state to the message
      // For now, just log the error
    }
  };
  
  // Helper to format timestamp
  const formatTimestamp = (timestamp: Timestamp | Date | undefined): string => {
    if (!timestamp) return '';
    const date = (timestamp instanceof Timestamp) ? timestamp.toDate() : timestamp;
    return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const handleDeleteChat = async () => {
    if (isDeleting) return;
    
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this entire chat thread? This action cannot be undone."
    );

    if (confirmDelete) {
      setIsDeleting(true);
      console.log(`Attempting to delete thread: ${threadId}`);
      try {
        const callDeleteFunction = httpsCallable(functionsInstance, 'deleteCoachingThread');
        const result = await callDeleteFunction({ threadId: threadId });
        console.log("Delete function result:", result);
        // On success, navigate back to the coaching dashboard
        router.push('/coaching'); 
      } catch (error) {
         console.error(`Error deleting thread ${threadId}:`, error);
         // TODO: Show user-facing error message
         alert(`Failed to delete chat: ${error.message || 'Unknown error'}`);
         setIsDeleting(false);
      } 
      // No need to set isDeleting false on success, as we navigate away
    }
  };

  if (loadingThread) {
    return (
      <div className="flex justify-center items-center h-full p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-heartglow-pink"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-600 dark:text-red-400">Error: {error}</div>;
  }
  
  if (!threadData) {
     return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Chat not found or access denied.</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height)-var(--footer-height)-2rem)] md:h-[calc(100vh-var(--header-height)-var(--footer-height)-4rem)] bg-white dark:bg-heartglow-deepgray border border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden">
      {/* Header - Added delete button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
          {threadData.threadTitle}
          {threadData.connectionSnapshot?.name && (
             <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
               (Regarding: {threadData.connectionSnapshot.name})
             </span>
           )}
        </h2>
        <button 
          onClick={handleDeleteChat}
          disabled={isDeleting}
          className={`p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Delete chat thread"
        >
           {isDeleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
           ) : (
              <TrashIcon className="h-5 w-5" />
           )}
        </button>
      </div>
      
      {/* Chat messages area - Added scroll-smooth */}
      <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 bg-white dark:bg-heartglow-deepgray scroll-smooth">
        {loadingMessages ? (
           <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-heartglow-pink"></div>
           </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 pt-8">Send a message to start the conversation.</p>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`py-2 px-4 rounded-2xl max-w-sm md:max-w-md lg:max-w-lg shadow-sm ${msg.sender === 'user' 
                  ? 'bg-gradient-to-br from-heartglow-pink to-heartglow-violet text-white rounded-br-none' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                 <p className={`text-xs mt-1 text-right ${msg.sender === 'user' ? 'text-pink-100/80' : 'text-gray-500 dark:text-gray-400'}`}>
                   {formatTimestamp(msg.timestamp)}
                 </p>
              </div>
            </div>
          ))
        )}
        {/* Div to target for scrolling */}
        <div ref={messagesEndRef} /> 
      </div>

      {/* Message input area - Improved styling */}
      <div className="p-3 md:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input 
            type="text"
            placeholder="Talk to your coach..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow bg-white dark:bg-gray-700 text-gray-900 dark:text-heartglow-offwhite border border-gray-300 dark:border-gray-600 rounded-lg p-3 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-heartglow-pink focus:border-transparent text-sm"
            aria-label="Message input"
            disabled={loadingThread || loadingMessages}
          />
          <button 
            type="submit"
            disabled={!newMessage.trim() || loadingThread || loadingMessages}
            aria-label="Send message"
            className={`shrink-0 inline-flex items-center justify-center px-4 h-12 w-12 rounded-full text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink dark:focus:ring-offset-gray-800 ${!newMessage.trim() || loadingThread || loadingMessages 
              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
              : 'bg-gradient-to-br from-heartglow-pink to-heartglow-violet hover:from-heartglow-violet hover:to-heartglow-indigo shadow-md hover:shadow-lg'
            }`}
          >
            <PaperPlaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CoachingChatView; 