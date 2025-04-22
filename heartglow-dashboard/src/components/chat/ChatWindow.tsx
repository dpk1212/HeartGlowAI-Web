import React, { useEffect, useRef } from 'react';
// Import sub-components
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Bars3Icon } from '@heroicons/react/24/outline';
// Assuming types are defined in a central place, adjust path if needed
import type { Connection, Message } from '@/types';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp
// Import Card components
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Import ScrollArea

// Remove HeartGlow AI connection/message constants - welcome state is now a Card
// const heartglowAIConnection: Connection = { ... };
// const welcomeMessages: Message[] = [ ... ];

interface ChatWindowProps {
  connection: Connection | undefined; // The currently selected connection
  messages: Message[];
  onSendMessage: (messageText: string) => void;
  isLoadingMessages: boolean;
  onToggleMobileSidebar: () => void; // Receive the toggle function
  // TODO: Add isSending state
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  connection,
  messages,
  onSendMessage,
  isLoadingMessages,
  onToggleMobileSidebar,
  // isSending, // Add this when state is managed
}) => {

  const scrollContainerRef = useRef<HTMLDivElement>(null); // Ref for the viewport

  // Scroll to bottom when messages change or connection changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      // Use timeout to ensure DOM update before scrolling
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [messages, connection]); // Dependencies

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-900 overflow-hidden">
      {/* Chat Header - Integrated with burger for mobile */}
      {/* Ensure min height for header consistency */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-3 bg-gray-900 border-b border-gray-700 min-h-[60px]">
         {/* Mobile Burger Button */}
         <div className="md:hidden absolute top-0 left-0 p-3 z-10">
           <button
             onClick={onToggleMobileSidebar} // Use the passed function
             className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
             aria-label="Open sidebar"
           >
             <Bars3Icon className="h-6 w-6" aria-hidden="true" />
           </button>
         </div>
         {/* Connection Name / Header Title */}
         <div className="flex-1 text-center truncate px-12"> {/* Increased padding for burger */}
            <h3 className="text-base sm:text-lg font-semibold text-gray-100">
              {connection ? (connection.name || 'Chat') : 'HeartGlow AI'} 
            </h3>
            {/* Show relationship only if a specific connection is selected */}
            {connection?.relationship && (
              <p className="text-xs text-gray-400 hidden sm:block">({connection.relationship})</p>
            )}
         </div>
         {/* Right Spacer/Placeholder - keeps title centered */}
         {/* Needs same width as burger container for proper centering */} 
         <div className="w-10 h-10 md:hidden"></div> {/* Adjust width/height to match burger button size if needed */} 
         {/* Optional: Add desktop header controls here if needed */} 

      </div>

      {/* Chat interface always rendered */}
      {/* Message List Area */}
      <ScrollArea className="flex-1 p-4 sm:p-6" ref={scrollContainerRef}>
        <MessageList messages={messages} isLoading={isLoadingMessages} />
        <ScrollBar />
      </ScrollArea>

      {/* Message Input Area */}
      <div className="sticky bottom-0 z-10 p-3 sm:p-4 bg-gray-900 border-t border-gray-700">
         <MessageInput 
           onSend={onSendMessage} 
           disabled={isLoadingMessages} // Only disable if messages are loading
         />
      </div>
    </div>
  );
};

export default ChatWindow; 