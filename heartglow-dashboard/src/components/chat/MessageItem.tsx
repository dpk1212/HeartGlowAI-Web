import React, { useState, useEffect, useRef } from 'react';
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Ref for interval ID
  const indexRef = useRef<number>(0); // Ref for index

  // Typing effect for AI messages - Refactored with useRef
  useEffect(() => {
    // --- Clear any existing interval from previous renders/strict mode ---
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isUser) {
      setDisplayedText(message.text);
      indexRef.current = message.text.length; // Ensure index is correct for user messages
      return; // No typing effect for user messages
    }

    // --- Reset state for new AI message animation ---
    setDisplayedText('');
    indexRef.current = 0;

    intervalRef.current = setInterval(() => {
      // Check if we've reached the end inside the interval
      if (indexRef.current >= message.text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        return; // Stop the interval
      }

      // Append character and increment index using refs
      const charToAdd = message.text.charAt(indexRef.current);
      setDisplayedText((prev) => prev + charToAdd);
      indexRef.current++;

    }, 25); // Typing speed

    // --- Cleanup function --- 
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // Add message.id to dependencies for robustness if identical text messages appear rapidly
  }, [message.text, message.id, isUser]); 

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
            {!isUser && intervalRef.current !== null && (
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