import React from 'react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Message } from '@/types';
import { Timestamp } from 'firebase/firestore';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Timestamp formatting - using createdAt
  let formattedTimestamp = '';
  try {
    let date: Date | null = null; 
    // Check if createdAt exists and has the toDate method (indicating Firestore Timestamp)
    if (message.createdAt && typeof message.createdAt.toDate === 'function') {
      date = (message.createdAt as Timestamp).toDate(); // Cast to Timestamp and call toDate()
    }
    // Optionally handle if createdAt might already be a Date or a different format
    // else if (message.createdAt instanceof Date) { date = message.createdAt; }
    
    // Format only if we successfully got a valid Date object
    if (date instanceof Date && !isNaN(date.getTime())) {
      formattedTimestamp = format(date, 'p');
    }
  } catch (e) {
    console.error("Error formatting timestamp:", message.createdAt, e);
  }

  // Define Avatar components for user and AI
  const UserAvatar = () => (
    <Avatar className="h-10 w-10 shadow-lg ring-2 ring-violet-400/30 transition-all duration-300 group-hover:ring-violet-400/50 group-hover:scale-110">
      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold">
        <User className="h-5 w-5" />
      </AvatarFallback>
    </Avatar>
  );

  const AIAvatar = () => (
    <Avatar className="h-10 w-10 shadow-lg ring-2 ring-emerald-400/30 transition-all duration-300 group-hover:ring-emerald-400/50 group-hover:scale-110">
      <AvatarFallback className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white font-semibold relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
        <Sparkles className="h-5 w-5 relative z-10" />
      </AvatarFallback>
    </Avatar>
  );

  const MessageBubble = (
      <div 
        className={cn(
          "flex items-end w-full group transition-all duration-300 hover:scale-[1.01]", 
          isUser ? "justify-end pl-4 sm:pl-8" : "justify-start pr-4 sm:pr-8"
        )}
      >
        {!isUser && (
          <div className="mr-3 flex-shrink-0 mb-1">
            <div className="relative">
              <AIAvatar />
              {/* AI status indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
            </div>
          </div>
        )}
        
        {/* Message Content Column */}
        <div className={cn("flex flex-col max-w-[85%]", isUser ? 'items-end' : 'items-start')}>
          {/* Enhanced Message Bubble */}
          <div
            className={cn(
              "relative px-5 py-4 rounded-2xl shadow-lg max-w-full transition-all duration-300 group-hover:shadow-xl overflow-hidden",
              isUser 
                ? 'bg-gradient-to-br from-violet-600 via-violet-500 to-purple-600 text-white rounded-br-md border border-violet-400/30 shadow-violet-500/20' 
                : 'bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 text-white rounded-bl-md border border-white/10 backdrop-blur-xl shadow-black/20'
            )}
          >
            {/* Subtle shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            
            {/* Message content */}
            <div className="relative z-10">
              <p className="text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed font-medium">
                {message.text}
              </p>
            </div>

            {/* Message reactions area (for future enhancement) */}
            {!isUser && (
              <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex space-x-1">
                  <button className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-xs hover:bg-white/20 transition-all duration-200">
                    👍
                  </button>
                  <button className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-xs hover:bg-white/20 transition-all duration-200">
                    ❤️
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Enhanced Timestamp */}
          {formattedTimestamp && (
            <div className={cn(
              "flex items-center mt-2 opacity-60 transition-opacity duration-200 group-hover:opacity-100",
              isUser ? 'justify-end' : 'justify-start'
            )}>
              <div className="flex items-center space-x-1.5">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  isUser ? 'bg-violet-300' : 'bg-emerald-400'
                )}></div>
                <p className={cn(
                  "text-xs font-medium",
                  isUser ? 'text-violet-300/80' : 'text-white/60'
                )}>
                  {formattedTimestamp}
                </p>
                {isUser && (
                  <div className="flex items-center space-x-0.5">
                    <div className="w-1 h-1 bg-violet-300 rounded-full"></div>
                    <div className="w-1 h-1 bg-violet-300 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {isUser && (
          <div className="ml-3 flex-shrink-0 mb-1">
            <div className="relative">
              <UserAvatar />
              {/* User online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
            </div>
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