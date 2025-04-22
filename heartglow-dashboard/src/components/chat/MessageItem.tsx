import React from 'react';
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
    <Avatar className="h-7 w-7"> {/* Smaller avatar for chat */} 
      <AvatarFallback className="bg-blue-500 text-white"> {/* User color */} 
        <User className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );

  const AIAvatar = () => (
    <Avatar className="h-7 w-7">
      <AvatarFallback className="bg-pink-500 text-white"> {/* AI color */} 
        <Sparkles className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );

  return (
    <div className={cn(
      "flex items-end w-full", 
      isUser ? "justify-end pl-8 sm:pl-12" : "justify-start pr-8 sm:pr-12", // Add padding to opposite side
    )}>
      {!isUser && <div className="mr-2 flex-shrink-0"><AIAvatar /></div>} {/* AI Avatar on left */} 
      
      {/* Message Content Column */}
      <div className={cn("flex flex-col max-w-[75%]", isUser ? 'items-end' : 'items-start')}>
        {/* Message Bubble */}
        <div
          className={cn(
            "px-3.5 py-2 rounded-lg shadow-md max-w-full", // Adjusted padding
            isUser 
              ? 'bg-primary text-primary-foreground rounded-br-none' // Use theme colors
              : 'bg-muted text-muted-foreground rounded-bl-none' // Use theme colors
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
        </div>
        {/* Timestamp */}
        {formattedTimestamp && (
          <p className="text-[10px] mt-1 text-muted-foreground">
            {formattedTimestamp}
          </p>
        )}
      </div>

      {isUser && <div className="ml-2 flex-shrink-0"><UserAvatar /></div>} {/* User Avatar on right */} 
    </div>
  );
};

export default MessageItem; 