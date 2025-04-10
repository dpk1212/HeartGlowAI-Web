import React, { useState } from 'react';
import Link from 'next/link';

// Helper function to add basePath
const getRouteWithBasePath = (path: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`;
};

// Mock data for recent messages (would be fetched from Firebase in real implementation)
type MessageType = {
  id: string;
  recipientName: string;
  relationship?: string;
  subject: string;
  content: string;
  date: string;
  pinned?: boolean;
  useCount?: number;
};

// Empty array for now to show empty state
const recentMessages: MessageType[] = [];

// MessageCard component
const MessageCard: React.FC<{ message: MessageType }> = ({ message }) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  const isPinned = message.pinned || (message.useCount && message.useCount > 2);
  
  return (
    <div className="bg-white dark:bg-heartglow-deepgray rounded-lg shadow-md border border-gray-100 dark:border-gray-800 p-4 transition-all duration-300 hover:shadow-lg group">
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
              {message.useCount ? 'Frequent' : 'Pinned'}
            </span>
          )}
          <span className="text-xs text-gray-500">{message.date}</span>
        </div>
      </div>
      
      <div className="mb-2 font-medium text-sm text-heartglow-indigo dark:text-heartglow-pink">{message.subject}</div>
      
      <div className={`text-sm text-gray-600 dark:text-gray-400 mb-4 ${expanded ? '' : 'line-clamp-2'}`}>
        {message.content}
      </div>
      
      <div className="flex justify-between items-center">
        <button 
          onClick={toggleExpand}
          className="text-xs text-heartglow-indigo dark:text-heartglow-pink hover:underline focus:outline-none"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
        
        <div className="flex space-x-2">
          <Link 
            href={getRouteWithBasePath(`/create?edit=${message.id}`)}
            className="text-xs bg-heartglow-indigo/10 dark:bg-heartglow-pink/10 text-heartglow-indigo dark:text-heartglow-pink px-3 py-1.5 rounded-full hover:bg-heartglow-indigo/20 dark:hover:bg-heartglow-pink/20 transition-colors duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit & Resend
          </Link>
          
          <button className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {isPinned ? 'Unpin' : 'Pin'}
          </button>
        </div>
      </div>
    </div>
  );
};

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
          className="text-heartglow-indigo dark:text-heartglow-pink font-medium text-sm flex items-center hover:underline group"
          aria-label="Create a new message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Message
        </Link>
      </div>

      <div className="bg-white dark:bg-heartglow-deepgray p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-800">
        {recentMessages.length > 0 ? (
          <div className="space-y-4">
            {recentMessages.map((message) => (
              <MessageCard key={message.id} message={message} />
            ))}
            
            {recentMessages.length > 2 && (
              <div className="text-center mt-6">
                <Link 
                  href={getRouteWithBasePath("/messages")}
                  className="text-sm text-heartglow-indigo dark:text-heartglow-pink hover:underline"
                >
                  View all messages
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-heartglow-charcoal dark:text-heartglow-offwhite mb-2">
              Your message history awaits
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Every message you create will appear here, so you can easily reuse or adapt your favorites.
            </p>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentMessagesList; 