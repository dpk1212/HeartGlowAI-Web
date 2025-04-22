import React from 'react';
// Import sub-components
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Bars3Icon } from '@heroicons/react/24/outline';
// Assuming types are defined in a central place, adjust path if needed
import type { Connection, Message } from '@/types';

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
  if (!connection) {
    // Render placeholder or welcome message when no connection is selected
    return (
      <div className="relative flex-1 flex flex-col items-center justify-center h-full bg-gray-900 text-gray-500 p-4">
        {/* Mobile Header placeholder (only burger icon) */}
        {/* Use absolute positioning to place it relative to this container */}
        <div className="md:hidden absolute top-0 left-0 p-3 z-10">
           <button
             onClick={onToggleMobileSidebar} // Use the passed function
             className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
             aria-label="Open sidebar"
           >
             <Bars3Icon className="h-6 w-6" aria-hidden="true" />
           </button>
        </div>
         {/* Centered Content */}
         <div className="text-center">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-30 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
           </svg>
           <p className="text-lg">Select a connection to start chatting</p>
           <p className="text-sm text-gray-600 mt-2 hidden md:block">Your conversations will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-900 overflow-hidden">
      {/* Chat Header - Integrated with burger for mobile */}
      {/* Ensure min height for header consistency */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-3 bg-gray-900 border-b border-gray-700 min-h-[60px]">
         {/* Mobile Burger Button */}
         <div className="md:hidden"> {/* Container for button */} 
            <button
               onClick={onToggleMobileSidebar}
               className="p-2 -ml-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
               aria-label="Open sidebar"
             >
               <Bars3Icon className="h-6 w-6" aria-hidden="true" />
             </button>
         </div>

         {/* Connection Name - Centered more effectively */}
         {/* flex-1 allows it to take space, text-center, truncate for long names */}
         <div className="flex-1 text-center truncate px-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-100">
              {connection.name || 'Chat'}
            </h3>
            {/* Optional: Subtitle like relationship, hidden on smallest screens */}
            {connection.relationship && (
              <p className="text-xs text-gray-400 hidden sm:block">({connection.relationship})</p>
            )}
         </div>

         {/* Right Spacer/Placeholder - keeps title centered */}
         {/* Needs same width as burger container for proper centering */} 
         <div className="w-10 h-10 md:hidden"></div> {/* Adjust width/height to match burger button size if needed */} 
         {/* Optional: Add desktop header controls here if needed */} 

      </div>

      {/* Message List Area - flex-1 allows it to grow and shrink, overflow-y-auto enables scrolling */} 
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
         <MessageList messages={messages} isLoading={isLoadingMessages} />
      </div>

      {/* Message Input Area - sticky to bottom */} 
      {/* Adjusted padding to match header */} 
      <div className="sticky bottom-0 z-10 p-3 sm:p-4 bg-gray-900 border-t border-gray-700">
         <MessageInput 
           onSend={onSendMessage} 
          //  isSending={isSending} 
           disabled={!connection}
         />
      </div>
    </div>
  );
};

export default ChatWindow; 