import React from 'react';
import { format } from 'date-fns'; // Using date-fns for timestamp formatting

// TODO: Define actual Message type (import from types file)
type Message = { 
  id: string; 
  text: string; 
  sender: 'user' | 'ai'; 
  timestamp: any; // Should ideally be Firebase Timestamp or Date object
};

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  // Basic timestamp formatting (adjust format string as needed)
  let formattedTimestamp = '';
  try {
    // Check if timestamp is a Firestore Timestamp and convert, otherwise try direct formatting
    const date = message.timestamp?.toDate ? message.timestamp.toDate() : new Date(message.timestamp);
    if (date instanceof Date && !isNaN(date.getTime())) {
      formattedTimestamp = format(date, 'Pp'); // e.g., "07/10/2024, 1:30 PM"
    }
  } catch (e) {
    console.error("Error formatting timestamp:", e);
    // Keep timestamp empty on error
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col max-w-xs md:max-w-md lg:max-w-lg ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message Bubble */}
        <div
          className={`
            px-4 py-2 rounded-lg shadow-md 
            ${isUser 
              ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-br-none' // User message style
              : 'bg-gray-700 text-gray-100 rounded-bl-none' // AI message style
            }
          `}
        >
          {/* TODO: Potentially render markdown or handle line breaks */}
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        </div>
        {/* Timestamp (optional, shown below the bubble) */}
        {formattedTimestamp && (
          <p className={`text-xs mt-1 ${isUser ? 'text-gray-500 mr-1' : 'text-gray-500 ml-1'}`}>
            {formattedTimestamp}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageItem; 