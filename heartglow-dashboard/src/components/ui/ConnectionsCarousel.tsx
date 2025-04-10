import React from 'react';
import Link from 'next/link';

// Helper function to add basePath
const getRouteWithBasePath = (path: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`;
};

// Mock data for connections (would be fetched from Firebase in real implementation)
const connections: any[] = [];

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
          className="text-heartglow-indigo dark:text-heartglow-pink font-medium text-sm flex items-center hover:underline"
          aria-label="Add a new connection"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New
        </Link>
      </div>

      <div className="bg-white dark:bg-heartglow-deepgray p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-800">
        {connections.length > 0 ? (
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {/* Connection cards would go here */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Loading your connections...
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-heartglow-charcoal dark:text-heartglow-offwhite mb-2">
              No saved connections yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Add someone special to quickly create messages for the people who matter most to you.
            </p>
            <Link 
              href={getRouteWithBasePath("/connections/add")}
              className="inline-flex items-center justify-center bg-gradient-to-r from-heartglow-pink to-heartglow-violet text-white font-medium rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-all duration-300"
              aria-label="Add your first connection"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Your First Connection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionsCarousel; 