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
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex flex-col max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message Bubble */}
        <div
          className={`
            px-4 py-2.5 rounded-2xl shadow-md
            ${isUser 
              ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-br-lg'
              : 'bg-gray-700 text-gray-100 rounded-bl-lg'
            }
          `}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
        </div>
        {/* Timestamp */}
        {formattedTimestamp && (
          <p className={`text-[11px] mt-1.5 ${isUser ? 'text-gray-500 mr-1' : 'text-gray-500 ml-1'}`}>
            {formattedTimestamp}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageItem; 