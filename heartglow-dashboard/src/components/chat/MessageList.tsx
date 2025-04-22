import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem'; // Import the sub-component

// TODO: Define actual Message type (import from types file)
type Message = { id: string; text: string; sender: 'user' | 'ai'; timestamp: any };

interface MessageListProps {
  messages: Message[];
  isLoading: boolean; // To handle initial loading state
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom of the message list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Loading State
  if (isLoading) {
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

  // Render Message List
  return (
    <div className="flex-1 space-y-4 pb-4">
      {messages.map((msg, index) => (
        <MessageItem
          key={msg.id || index} // Use index as fallback key if id isn't guaranteed yet
          message={msg}
        />
      ))}
      {/* Dummy div to target for scrolling */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList; 