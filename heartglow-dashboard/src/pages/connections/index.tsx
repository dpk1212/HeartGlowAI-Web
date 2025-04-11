import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

import DashboardLayout from '../../components/layout/DashboardLayout';
import AuthGuard from '../../components/layout/AuthGuard';
import { useAuth } from '../../context/AuthContext';
import { fetchUserConnections, Connection, formatRelativeTime, getConnectionFrequency } from '../../firebase/db';

// Helper function to add basePath
const getRouteWithBasePath = (path: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`;
};

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

// Helper function to get frequency badge color
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

// Helper function to get frequency label
const getFrequencyLabel = (frequency: 'frequent' | 'recent' | 'new'): string => {
  switch (frequency) {
    case 'frequent':
      return 'Frequent';
    case 'recent':
      return 'Recent';
    case 'new':
      return 'New';
    default:
      return '';
  }
};

const ConnectionsPage = () => {
  const { currentUser } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'frequent' | 'recent' | 'new'>('all');

  useEffect(() => {
    const loadConnections = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all connections (no limit)
        const userConnections = await fetchUserConnections(currentUser, 100);
        setConnections(userConnections);
        setFilteredConnections(userConnections);
      } catch (err) {
        console.error('Error loading connections:', err);
        setError('Failed to load connections');
      } finally {
        setLoading(false);
      }
    };

    loadConnections();
  }, [currentUser]);

  // Filter connections when search or filter changes
  useEffect(() => {
    let result = [...connections];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(conn => 
        conn.name.toLowerCase().includes(query) || 
        conn.relationship?.toLowerCase().includes(query) ||
        conn.specificRelationship?.toLowerCase().includes(query)
      );
    }
    
    // Apply frequency filter
    if (filterBy !== 'all') {
      result = result.filter(conn => getConnectionFrequency(conn) === filterBy);
    }
    
    setFilteredConnections(result);
  }, [searchQuery, filterBy, connections]);

  return (
    <>
      <Head>
        <title>Your Connections | HeartGlow AI</title>
        <meta name="description" content="Manage your important connections with HeartGlow AI" />
      </Head>

      <AuthGuard>
        <DashboardLayout>
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <Link
                    href={getRouteWithBasePath('/')}
                    className="text-heartglow-indigo dark:text-heartglow-pink hover:underline flex items-center mr-3"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </Link>
                  <h1 className="text-3xl font-bold text-heartglow-charcoal dark:text-white">
                    Your Connections
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage and view all your important connections in one place.
                </p>
              </div>

              <div className="mt-4 md:mt-0">
                <Link
                  href={getRouteWithBasePath('/connections/add')}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-heartglow-pink to-heartglow-violet text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Connection
                </Link>
              </div>
            </div>

            {/* Filters and Search */}
            <motion.div
              className="bg-white dark:bg-heartglow-deepgray rounded-xl shadow-md border border-gray-100 dark:border-gray-800 p-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-grow">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search connections..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-heartglow-pink focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Filter:</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setFilterBy('all')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filterBy === 'all'
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterBy('frequent')}
                      className={`px-3 py-1 rounded-full text-sm flex items-center ${
                        filterBy === 'frequent'
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-1.5"></span>
                      Frequent
                    </button>
                    <button
                      onClick={() => setFilterBy('recent')}
                      className={`px-3 py-1 rounded-full text-sm flex items-center ${
                        filterBy === 'recent'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-1.5"></span>
                      Recent
                    </button>
                    <button
                      onClick={() => setFilterBy('new')}
                      className={`px-3 py-1 rounded-full text-sm flex items-center ${
                        filterBy === 'new'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                      New
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Connections List */}
            <motion.div
              className="bg-white dark:bg-heartglow-deepgray rounded-xl shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heartglow-pink"></div>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">{error}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">There was a problem loading your connections.</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              ) : filteredConnections.length === 0 ? (
                <div className="text-center py-16">
                  {searchQuery || filterBy !== 'all' ? (
                    <>
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-heartglow-charcoal dark:text-heartglow-offwhite mb-2">No matching connections</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search or filters</p>
                      <button
                        onClick={() => { setSearchQuery(''); setFilterBy('all'); }}
                        className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        Clear Filters
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-heartglow-charcoal dark:text-heartglow-offwhite mb-2">No connections yet</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">Add your first connection to get started</p>
                      <Link
                        href={getRouteWithBasePath('/connections/add')}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-heartglow-pink to-heartglow-violet text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Connection
                      </Link>
                    </>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredConnections.map((connection) => {
                    const frequency = getConnectionFrequency(connection);
                    const lastMessageTime = connection.lastMessageDate
                      ? formatRelativeTime(connection.lastMessageDate)
                      : 'No messages yet';
                    
                    return (
                      <motion.div
                        key={connection.id}
                        className="group p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center">
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-heartglow-pink to-heartglow-violet flex items-center justify-center text-white font-semibold shadow-md group-hover:shadow-glow transition-all duration-300">
                              {getInitials(connection.name)}
                            </div>
                            <div className={`absolute -right-1 -bottom-1 w-3 h-3 rounded-full border-2 border-white dark:border-heartglow-deepgray ${getFrequencyColor(frequency)}`}></div>
                          </div>
                          
                          <div className="ml-4 flex-grow">
                            <div className="flex items-center">
                              <h3 className="font-medium text-heartglow-charcoal dark:text-heartglow-offwhite">
                                {connection.name}
                              </h3>
                              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                frequency === 'frequent' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                                frequency === 'recent' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                                'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              }`}>
                                {getFrequencyLabel(frequency)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                              <span className="mr-4">{connection.relationship}</span>
                              <span className="text-heartglow-pink text-xs">{lastMessageTime}</span>
                            </div>
                          </div>
                          
                          <div>
                            <Link
                              href={getRouteWithBasePath(`/connections/${connection.id}`)}
                              className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-heartglow-indigo dark:text-heartglow-pink hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    </>
  );
};

export default ConnectionsPage; 