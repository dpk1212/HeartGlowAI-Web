import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { fetchUserMessages, Message as DbMessage, formatRelativeTime } from '../../firebase/db';

// Helper function to add basePath
const getRouteWithBasePath = (path: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`;
};

// Animation variants for container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Animation variants for items
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  },
  hover: {
    y: -4,
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  }
};

// Get a preview of the message content
const getMessagePreview = (content: string, maxLength = 150): string => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
};

// MessageCard component
const MessageCard: React.FC<{ message: DbMessage }> = ({ message }) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  // In a real app, we'd have logic to determine if this should be pinned
  const isPinned = false;
  
  // Get a reference to the message content, either truncated or full
  const messageContent = expanded 
    ? message.content
    : getMessagePreview(message.content);
    
  // Format the date for display
  const formattedDate = formatRelativeTime(message.createdAt);
  
  return (
    <motion.div 
      className="bg-white dark:bg-heartglow-deepgray rounded-lg shadow-md border border-gray-100 dark:border-gray-800 p-4 transition-all duration-300 hover:shadow-lg group"
      variants={itemVariants}
      whileHover="hover"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-heartglow-charcoal dark:text-heartglow-offwhite">
          To: {message.recipientName} 
          {message.relationship && (
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">({message.relationship})</span>
          )}
        </h3>
        <div className="flex items-center">
          {isPinned && (
            <span className="text-xs bg-heartglow-pink/10 text-heartglow-pink px-2 py-1 rounded-full flex items-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Pinned
            </span>
          )}
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
      </div>
      
      <div className="mb-2 font-medium text-sm text-heartglow-indigo dark:text-heartglow-pink">
        {message.intent || message.messageIntention || 'Message'}
      </div>
      
      <div className={`text-sm text-gray-600 dark:text-gray-400 mb-4 ${expanded ? '' : 'line-clamp-2'}`}>
        {messageContent}
      </div>
      
      <div className="flex justify-between items-center">
        <button 
          onClick={toggleExpand}
          className="text-xs text-heartglow-indigo dark:text-heartglow-pink hover:underline focus:outline-none"
          aria-label={expanded ? 'Show less of this message' : 'Read more of this message'}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
        
        <div className="flex space-x-2">
          <Link 
            href={getRouteWithBasePath(`/create?edit=${message.id}`)}
            className="text-xs bg-heartglow-indigo/10 dark:bg-heartglow-pink/10 text-heartglow-indigo dark:text-heartglow-pink px-3 py-1.5 rounded-full hover:bg-heartglow-indigo/20 dark:hover:bg-heartglow-pink/20 transition-colors duration-200 flex items-center"
            aria-label={`Edit and resend message to ${message.recipientName}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit & Resend
          </Link>
          
          <button 
            className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center"
            aria-label={isPinned ? 'Unpin this message' : 'Pin this message for quick access'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {isPinned ? 'Unpin' : 'Pin'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const RecentMessagesList: React.FC = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<DbMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  // Demo toggle for development purposes
  const toggleDemo = () => {
    setShowDemo(!showDemo);
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadMessages = async () => {
      if (!currentUser) {
        console.log('No current user, skipping message fetch');
        if (isMounted) setLoading(false);
        return;
      }
      
      try {
        if (isMounted) setLoading(true);
        if (isMounted) setError(null);
        
        // Fetch real data from Firestore
        console.log('Attempting to fetch messages for user:', currentUser?.uid);
        const userMessages = await fetchUserMessages(currentUser);
        console.log('Fetched messages:', userMessages);
        
        if (isMounted) setMessages(userMessages);
      } catch (err) {
        console.error('Error loading messages:', err);
        if (isMounted) setError('Failed to load messages');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadMessages();
    
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-heartglow-charcoal dark:text-heartglow-offwhite flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-heartglow-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Recent Messages
        </h2>
        
        <div className="flex items-center gap-3">
          {/* Demo toggle button - only for development purposes */}
          <button 
            onClick={toggleDemo} 
            className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded"
            aria-label="Toggle demo mode for development"
          >
            Toggle Demo
          </button>
          
          <Link 
            href={getRouteWithBasePath("/create")}
            className="text-heartglow-indigo dark:text-heartglow-pink font-medium text-sm flex items-center hover:underline group"
            aria-label="Create a new message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Message
          </Link>
        </div>
      </div>

      <motion.div 
        className="bg-white dark:bg-heartglow-deepgray p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {loading ? (
          // Loading state
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heartglow-pink"></div>
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
              {error}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              There was a problem loading your messages. Please try again later.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-full px-6 py-2"
            >
              Refresh
            </button>
          </div>
        ) : (showDemo || messages.length === 0) && !showDemo ? (
          // Empty state
          <div className="text-center py-8">
            <motion.div 
              className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </motion.div>
            <motion.h3 
              className="text-lg font-medium text-heartglow-charcoal dark:text-heartglow-offwhite mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Your message history awaits
            </motion.h3>
            <motion.p 
              className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Every message you create will appear here, so you can easily reuse or adapt your favorites.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link 
                href={getRouteWithBasePath("/create")}
                className="inline-flex items-center justify-center bg-gradient-to-r from-heartglow-pink to-heartglow-violet text-white font-medium rounded-full px-6 py-3 shadow-md hover:shadow-lg hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Create your first message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Your First Message
              </Link>
            </motion.div>
          </div>
        ) : (
          // Data loaded state
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {messages.map((message) => (
              <MessageCard key={message.id} message={message} />
            ))}
            
            {messages.length > 2 && (
              <div className="text-center mt-6">
                <Link 
                  href={getRouteWithBasePath("/messages")}
                  className="text-sm text-heartglow-indigo dark:text-heartglow-pink hover:underline"
                  aria-label="View all your messages"
                >
                  View all messages
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default RecentMessagesList; 