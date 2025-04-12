import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { fetchUserConnections, Connection as DbConnection, getConnectionFrequency, formatRelativeTime } from '../../firebase/db';

// Helper function to get initials from name
const getInitials = (name: string): string => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Helper function to get color based on frequency
const getFrequencyColor = (frequency: 'frequent' | 'recent' | 'new'): string => {
  switch (frequency) {
    case 'frequent':
      return 'bg-purple-500';
    case 'recent':
      return 'bg-blue-500';
    case 'new':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
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
    y: -8,
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  }
};

// Connection card component
const ConnectionCard: React.FC<{ connection: DbConnection }> = ({ connection }) => {
  const frequency = getConnectionFrequency(connection);
  const lastMessageTime = connection.lastMessageDate 
    ? formatRelativeTime(connection.lastMessageDate)
    : 'No messages yet';

  return (
    <motion.div
      className="flex-shrink-0 w-36 rounded-lg bg-white dark:bg-heartglow-deepgray border border-gray-100 dark:border-gray-800 p-4 flex flex-col items-center"
      variants={itemVariants}
      whileHover="hover"
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-heartglow-pink to-heartglow-violet flex items-center justify-center text-white text-xl font-semibold shadow-md group-hover:shadow-glow transition-all duration-300">
          {getInitials(connection.name)}
        </div>
        <div className={`absolute -right-1 -bottom-1 w-4 h-4 rounded-full border-2 border-white dark:border-heartglow-deepgray ${getFrequencyColor(frequency)}`}></div>
      </div>
      <div className="mt-3 text-center">
        <h3 className="font-medium text-heartglow-charcoal dark:text-heartglow-offwhite text-sm truncate max-w-full">
          {connection.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-full">
          {connection.relationship || 'Connection'}
        </p>
        <p className="text-xs text-heartglow-pink mt-1 truncate max-w-full">
          {lastMessageTime}
        </p>
      </div>
    </motion.div>
  );
};

const ConnectionsCarousel: React.FC = () => {
  const { currentUser } = useAuth();
  const [connections, setConnections] = useState<DbConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  // Demo toggle for development purposes
  const toggleDemo = () => {
    setShowDemo(!showDemo);
  };

  useEffect(() => {
    const loadConnections = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch real data from Firestore
        console.log('Attempting to fetch connections for user:', currentUser?.uid);
        const userConnections = await fetchUserConnections(currentUser);
        console.log('Fetched connections:', userConnections);
        setConnections(userConnections);
      } catch (err) {
        console.error('Error loading connections:', err);
        setError('Failed to load connections');
      } finally {
        setLoading(false);
      }
    };

    loadConnections();
  }, [currentUser]);

  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-heartglow-charcoal dark:text-heartglow-offwhite flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-heartglow-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Your Connections
        </h2>
        
        <div className="flex items-center gap-3">
          {/* REMOVED: Demo toggle button */}
          
          {/* REMOVED: Add New link */}

          <Link 
            href="/connections"
            className="text-heartglow-indigo dark:text-heartglow-pink font-medium text-sm flex items-center hover:underline group"
            aria-label="View all connections"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            View all
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
              There was a problem loading your connections. Please try again later.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-full px-6 py-2"
            >
              Refresh
            </button>
          </div>
        ) : (showDemo || connections.length === 0) && !showDemo ? (
          // Empty state
          <div className="text-center py-8">
            <motion.div 
              className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-all duration-300"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </motion.div>
            <motion.h3 
              className="text-lg font-medium text-heartglow-charcoal dark:text-heartglow-offwhite mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Your people matter
            </motion.h3>
            <motion.p 
              className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Keep track of the people who mean the most to you, and easily create personalized messages just for them.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link 
                href="/connections/add"
                className="inline-flex items-center justify-center bg-gradient-to-r from-heartglow-pink to-heartglow-violet text-white font-medium rounded-full px-6 py-3 shadow-md hover:shadow-lg hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Save your first important connection"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Save Someone Special
              </Link>
            </motion.div>
          </div>
        ) : (
          // Data loaded state
          <div>
            <motion.div 
              className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide hide-scrollbar"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {connections.map((connection) => (
                <ConnectionCard key={connection.id} connection={connection} />
              ))}
            </motion.div>
            <div className="mt-3 flex justify-between">
              <div className="flex gap-4">
                <span className="text-xs flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-1"></span>
                  Frequent
                </span>
                <span className="text-xs flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                  Recent
                </span>
                <span className="text-xs flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  New
                </span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ConnectionsCarousel; 