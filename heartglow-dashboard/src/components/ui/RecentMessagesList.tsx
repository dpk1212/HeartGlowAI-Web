import React from 'react';
import Link from 'next/link';

// Helper function to add basePath
const getRouteWithBasePath = (path: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`;
};

// Mock data for recent messages (would be fetched from Firebase in real implementation)
const recentMessages: any[] = [];

const RecentMessagesList: React.FC = () => {
  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-heartglow-charcoal dark:text-heartglow-offwhite flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-heartglow-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Recent Messages
        </h2>
        
        <Link 
          href={getRouteWithBasePath("/create")}
          className="text-heartglow-indigo dark:text-heartglow-pink font-medium text-sm flex items-center hover:underline"
          aria-label="Create a new message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Message
        </Link>
      </div>

      <div className="bg-white dark:bg-heartglow-deepgray p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-800">
        {recentMessages.length > 0 ? (
          <div className="space-y-4">
            {/* Message cards would go here */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Loading your recent messages...
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-heartglow-charcoal dark:text-heartglow-offwhite mb-2">
              You haven't sent any messages yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Now's a great time to start crafting messages that matter. Your history will show here.
            </p>
            <Link 
              href={getRouteWithBasePath("/create")}
              className="inline-flex items-center justify-center bg-gradient-to-r from-heartglow-pink to-heartglow-violet text-white font-medium rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-all duration-300"
              aria-label="Create your first message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Your First Message
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentMessagesList; 