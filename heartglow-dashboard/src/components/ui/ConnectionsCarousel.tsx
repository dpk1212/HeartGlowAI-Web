import React from 'react';
import Link from 'next/link';

// Helper function to add basePath
const getRouteWithBasePath = (path: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`;
};

// Mock data for connections (would be fetched from Firebase in real implementation)
// In a real implementation, this would come from a database or API
type Connection = {
  id: string;
  name: string;
  email?: string;
  relationship?: string;
  frequency: 'frequent' | 'recent' | 'new';
};

// This is just mock data - in a real app, this would come from user's data
const connections: Connection[] = [
  // Empty for now to show the empty state first
];

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
const getFrequencyColor = (frequency: Connection['frequency']): string => {
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

// Connection card component
const ConnectionCard: React.FC<{ connection: Connection }> = ({ connection }) => {
  return (
    <div className="flex-shrink-0 w-36 rounded-lg bg-white dark:bg-heartglow-deepgray border border-gray-100 dark:border-gray-800 p-4 flex flex-col items-center shadow-md hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-heartglow-pink to-heartglow-violet flex items-center justify-center text-white text-xl font-semibold shadow-md group-hover:shadow-glow transition-all duration-300">
          {getInitials(connection.name)}
        </div>
        <div className={`absolute -right-1 -bottom-1 w-4 h-4 rounded-full border-2 border-white dark:border-heartglow-deepgray ${getFrequencyColor(connection.frequency)}`}></div>
      </div>
      <div className="mt-3 text-center">
        <h3 className="font-medium text-heartglow-charcoal dark:text-heartglow-offwhite text-sm truncate max-w-full">
          {connection.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-full">
          {connection.relationship || 'Connection'}
        </p>
      </div>
    </div>
  );
};

const ConnectionsCarousel: React.FC = () => {
  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-heartglow-charcoal dark:text-heartglow-offwhite flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-heartglow-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Your Connections
        </h2>
        
        <Link 
          href={getRouteWithBasePath("/connections/add")}
          className="text-heartglow-indigo dark:text-heartglow-pink font-medium text-sm flex items-center hover:underline group"
          aria-label="Add a new connection"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New
        </Link>
      </div>

      <div className="bg-white dark:bg-heartglow-deepgray p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-800">
        {connections.length > 0 ? (
          <div>
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide hide-scrollbar">
              {connections.map((connection) => (
                <ConnectionCard key={connection.id} connection={connection} />
              ))}
            </div>
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
              <Link 
                href={getRouteWithBasePath("/connections")}
                className="text-xs text-heartglow-indigo dark:text-heartglow-pink hover:underline"
              >
                View all
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-heartglow-charcoal dark:text-heartglow-offwhite mb-2">
              Your people matter
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Keep track of the people who mean the most to you, and easily create personalized messages just for them.
            </p>
            <Link 
              href={getRouteWithBasePath("/connections/add")}
              className="inline-flex items-center justify-center bg-gradient-to-r from-heartglow-pink to-heartglow-violet text-white font-medium rounded-full px-6 py-3 shadow-md hover:shadow-lg hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1"
              aria-label="Save your first important connection"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Save Someone Special
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionsCarousel; 