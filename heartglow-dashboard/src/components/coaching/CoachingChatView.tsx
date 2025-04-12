import React, { useState } from 'react';
import { Input } from './ui/input'; // Assuming shadcn input
// import { Button } from './ui/button'; // Removed unused shadcn button import
import { PaperPlaneIcon } from '@radix-ui/react-icons'; // Example icon

interface CoachingChatViewProps {
  threadId: string; // Passed in from the dynamic page
}

const CoachingChatView: React.FC<CoachingChatViewProps> = ({ threadId }) => {
  // TODO: Fetch thread metadata (title, connection details)
  // TODO: Fetch message history
  // TODO: Implement message sending logic

  const [newMessage, setNewMessage] = useState('');
  
  // Placeholder: Replace with actual fetched title
  const threadTitle = `Chat Thread ${threadId.substring(0, 6)}...`; 

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    console.log(`Sending message for thread ${threadId}:`, newMessage);
    // TODO: Implement actual send logic (save to Firestore, call CF)
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height)-var(--footer-height)-2rem)] md:h-[calc(100vh-var(--header-height)-var(--footer-height)-4rem)] bg-white dark:bg-heartglow-deepgray border border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
          {threadTitle} 
          {/* TODO: Display connection name/details */}
        </h2>
      </div>
      
      {/* Chat messages area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {/* Placeholder Messages - TODO: Replace with actual fetched messages */}
        <div className="flex justify-start">
          <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg max-w-xs lg:max-w-md shadow-sm">
            <p className="text-sm text-gray-800 dark:text-gray-100">Coach placeholder message...</p>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-heartglow-pink/80 text-white p-3 rounded-lg max-w-xs lg:max-w-md shadow-sm">
            <p className="text-sm">User placeholder message...</p>
          </div>
        </div>
         <div className="flex justify-start">
          <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg max-w-xs lg:max-w-md shadow-sm">
            <p className="text-sm text-gray-800 dark:text-gray-100">Another coach placeholder message that might be a bit longer to test wrapping.</p>
          </div>
        </div>
        {/* End Placeholder Messages */}
      </div>

      {/* Message input area */}
      <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <Input 
            type="text"
            placeholder="Talk to your coach..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-heartglow-pink focus:border-transparent dark:bg-gray-700 dark:text-heartglow-offwhite dark:border-gray-600 dark:placeholder-gray-400"
            aria-label="Message input"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()} 
            aria-label="Send message"
            className={`shrink-0 inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink ${!newMessage.trim() ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' : 'bg-heartglow-pink hover:bg-heartglow-pink/90'}`}
          >
            <PaperPlaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CoachingChatView; 