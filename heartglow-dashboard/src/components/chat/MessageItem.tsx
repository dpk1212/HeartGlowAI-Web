import React, { useState, useEffect } from 'react';
import { format } from 'date-fns'; // Using date-fns for timestamp formatting
import { cn } from "@/lib/utils"; // Import cn
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Import Avatar
import { User, Sparkles } from 'lucide-react'; // Import icons

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
  const [displayedText, setDisplayedText] = useState('');

  // Typing effect for AI messages
  useEffect(() => {
    // --- DEBUG: Log the raw message text received by the component ---
    console.log(`[MessageItem Effect] Received message text for ID ${message.id}:`, JSON.stringify(message.text));
    // --- END DEBUG ---

    if (isUser) {
      setDisplayedText(message.text);
      return; // No typing effect for user messages
    }

    // Reset displayed text when message changes
    setDisplayedText('');
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + message.text.charAt(index));
      index++;
      if (index === message.text.length) {
        clearInterval(intervalId);
      }
    }, 25); // Adjust typing speed (milliseconds per character)

    // Cleanup function to clear interval if component unmounts or message changes
    return () => clearInterval(intervalId);

  }, [message.text, isUser]); // Depend on message text and sender type

  // Basic timestamp formatting (adjust format string as needed)
  let formattedTimestamp = '';
  try {
    // Check if timestamp is a Firestore Timestamp and convert, otherwise try direct formatting
    const date = message.timestamp?.toDate ? message.timestamp.toDate() : new Date(message.timestamp);
    if (date instanceof Date && !isNaN(date.getTime())) {
      formattedTimestamp = format(date, 'p'); // Use shorter time format 'p' (e.g., 1:30 PM)
    }
  } catch (e) {
    console.error("Error formatting timestamp:", e);
    // Keep timestamp empty on error
  }

  // Define Avatar components for user and AI
  const UserAvatar = () => (
    <Avatar className="h-8 w-8 shadow-md border border-[#2A2A40]/40">
      <AvatarFallback className="bg-gradient-to-br from-[#4A75D9] to-[#2C4EA0] text-white">
        <User className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );

  const AIAvatar = () => (
    <Avatar className="h-8 w-8 shadow-md border border-[#2A2A40]/40">
      <AvatarFallback className="bg-gradient-to-br from-heartglow-pink to-heartglow-violet text-white">
        <Sparkles className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );

  return (
    <div 
      className={cn(
        "flex items-end w-full group transition-opacity duration-200", 
        isUser ? "justify-end pl-8 sm:pl-16" : "justify-start pr-8 sm:pr-16"
      )}
    >
      {!isUser && (
        <div className="mr-3 flex-shrink-0 mb-1">
          <AIAvatar />
        </div>
      )}
      
      {/* Message Content Column */}
      <div className={cn("flex flex-col max-w-[80%]", isUser ? 'items-end' : 'items-start')}>
        {/* Message Bubble */}
        <div
          className={cn(
            "px-4 py-2.5 rounded-2xl shadow-md max-w-full transition-all duration-200",
            isUser 
              ? 'bg-gradient-to-br from-[#1C3694]/90 to-[#162970]/90 text-white rounded-br-sm border border-[#3D5BCC]/20' 
              : 'bg-gradient-to-br from-[#2A2A45]/95 to-[#1F1F35]/95 text-gray-100 rounded-bl-sm border border-[#3A3A5C]/20'
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {displayedText}
            {!isUser && displayedText.length < message.text.length && (
              <span className="blinking-cursor">▋</span>
            )}
          </p>
        </div>
        
        {/* Timestamp */}
        {formattedTimestamp && (
          <p className={cn(
            "text-[10px] mt-1.5 opacity-70 transition-opacity duration-200 group-hover:opacity-100",
            isUser ? 'text-blue-300/70' : 'text-pink-300/70'
          )}>
            {formattedTimestamp}
          </p>
        )}
      </div>

      {isUser && (
        <div className="ml-3 flex-shrink-0 mb-1">
          <UserAvatar />
        </div>
      )}
    </div>
  );
};

export default MessageItem; 