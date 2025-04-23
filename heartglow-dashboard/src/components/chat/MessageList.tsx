import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem'; // Import the sub-component
// TODO: Define actual Message type (import from types file) -> Use the shared Message type
// type Message = { id: string; text: string; sender: 'user' | 'ai'; timestamp: any };
import { Message } from '@/types'; // Import the shared Message type

// Define a simple typing indicator component
const TypingIndicator: React.FC = () => (
  <div className="flex items-end justify-start pl-2 pr-10 py-2"> {/* Mimic MessageItem padding */}
    <div className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 shadow-md max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
      <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-0"></div>
      <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
      <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
    </div>
  </div>
);

interface MessageListProps {
  messages: Message[];
  isLoading: boolean; // To handle initial loading state
  isSendingMessage?: boolean; // Add prop for AI typing indicator
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, isSendingMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom of the message list
  const scrollToBottom = () => {
    // Use timeout to ensure DOM updates before scrolling, especially for the typing indicator
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50); // Small delay might help
  };

  // Scroll to bottom whenever messages change OR when the typing indicator appears/disappears
  useEffect(() => {
    scrollToBottom();
  }, [messages, isSendingMessage]); // Add isSendingMessage as a dependency

  // Handle Loading State
  if (isLoading && messages.length === 0) { // Only show full loader if messages haven't loaded yet
    return (
      <div className="flex items-center justify-center h-full">
        {/* TODO: Add a more visually appealing loading spinner */}
        <svg className="animate-spin h-8 w-8 text-pink-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="ml-3 text-gray-400">Loading messages...</p>
      </div>
    );
  }

  // Note: The empty state is now handled by ChatWindow.tsx
  // If messages are empty but not loading, ChatWindow shows prompts.
  // If messages are empty AND loading, the spinner above shows.
  // So, we don't need the explicit empty state check here anymore.
  /* Remove the previous empty state check
  // Handle Empty State
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 text-center px-4">
          No messages in this conversation yet. Send the first one!
        </p>
      </div>
    );
  }
  */

  // Render Message List
  return (
    // Remove flex-1 if ChatWindow's ScrollArea is handling the main scrolling
    <div className="space-y-5 pb-4"> 
      {messages.map((msg, index) => (
        <MessageItem
          key={msg.id || index} // Use index as fallback key if id isn't guaranteed yet
          message={msg}
        />
      ))}
      {/* Conditionally render the typing indicator */}
      {isSendingMessage && <TypingIndicator />}
      {/* Dummy div to target for scrolling */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList; 