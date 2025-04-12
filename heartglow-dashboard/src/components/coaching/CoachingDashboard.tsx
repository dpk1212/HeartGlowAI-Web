import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button'; // Corrected path
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../../lib/firebase'; // Import db instance
import { CoachingThread } from '../../types/coaching'; // Import the type

const CoachingDashboard: React.FC = () => {
  const { currentUser } = useAuth(); // Get current user
  const [threads, setThreads] = useState<CoachingThread[]>([]); // State for threads
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchThreads = async () => {
      if (!currentUser) {
        setLoading(false);
        setError("Please log in to view coaching chats.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const threadsRef = collection(db, 'coachingThreads');
        const q = query(
          threadsRef,
          where('userId', '==', currentUser.uid),
          orderBy('lastActivity', 'desc') // Order by most recent activity
        );
        const querySnapshot = await getDocs(q);
        const fetchedThreads = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as CoachingThread[];
        
        // Ensure Timestamps are handled correctly if needed for display
        // (Often Firestore SDK handles this, but be mindful)
        setThreads(fetchedThreads);

      } catch (err) {
        console.error("Error fetching coaching threads: ", err);
        setError("Failed to load coaching chats. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [currentUser]); // Re-fetch if user changes

  // Helper to format Timestamp or Date
  const formatTimestamp = (timestamp: Timestamp | Date | undefined): string => {
    if (!timestamp) return 'N/A';
    // Firestore Timestamps have a toDate() method
    const date = (timestamp instanceof Timestamp) ? timestamp.toDate() : timestamp;
    return date.toLocaleString(undefined, { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: 'numeric', minute: '2-digit', hour12: true 
    });
  };


  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
          Your Coaching Chats
        </h1>
        <Link href="/coaching/start" passHref>
          <Button>Start New Chat</Button>
        </Link>
      </div>

      {loading && (
         <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-heartglow-pink"></div>
         </div>
      )}

      {error && (
        <p className="text-center text-red-600 dark:text-red-400 py-4">{error}</p>
      )}

      {!loading && !error && threads.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          You haven't started any coaching chats yet. Click "Start New Chat" to begin!
        </p>
      ) : null}
      
      {!loading && !error && threads.length > 0 && (
        <div className="space-y-4">
          {threads.map(thread => (
            <Link href={`/coaching/${thread.id}`} key={thread.id} passHref>
              <div className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors duration-150 ease-in-out">
                <p className="font-medium text-lg text-gray-800 dark:text-gray-100 truncate">{thread.threadTitle}</p>
                 {thread.connectionSnapshot?.name && (
                   <p className="text-sm text-gray-600 dark:text-gray-400">
                     Connection: {thread.connectionSnapshot.name} 
                     {thread.connectionSnapshot.relationship ? ` (${thread.connectionSnapshot.relationship})` : ''}
                   </p>
                 )}
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                   Last activity: {formatTimestamp(thread.lastActivity)}
                 </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoachingDashboard; 