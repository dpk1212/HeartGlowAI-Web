import React from 'react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Message } from '@/types';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Timestamp formatting - using createdAt
  let formattedTimestamp = '';
  try {
    const date = message.createdAt?.toDate ? message.createdAt.toDate() : new Date(message.createdAt);
    if (date instanceof Date && !isNaN(date.getTime())) {
      formattedTimestamp = format(date, 'p');
    }
  } catch (e) {
    console.error("Error formatting timestamp:", e);
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

  const MessageBubble = (
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
            {/* Render full text directly, remove blinking cursor */}
            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
              {message.text}
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

  // Conditionally wrap AI messages with motion.div for animation
  return isUser ? (
    MessageBubble
  ) : (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {MessageBubble}
    </motion.div>
  );
};

export default MessageItem; 