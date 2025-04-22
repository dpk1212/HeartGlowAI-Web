import React from 'react';
// Import sub-components
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Bars3Icon } from '@heroicons/react/24/outline';
// Assuming types are defined in a central place, adjust path if needed
import type { Connection, Message } from '@/types';

// --- Default Welcome Data ---
const heartglowAIConnection: Connection = {
  id: 'heartglow-ai-welcome',
  name: 'HeartGlow AI',
  relationship: null, // Provide null for relationship
  createdAt: new Date(), // Provide a default Date for createdAt
  // Add other required fields here if the error persists, e.g.:
  // userId: 'system', 
  // lastMessageTimestamp: null,
};

const welcomeMessages: Message[] = [
  {
    id: 'welcome-msg-1',
    sender: 'ai',
    text: "Welcome to HeartGlow! I'm here to help you navigate your relationships. Select a connection from the sidebar or create a new one to get started.",
    timestamp: new Date(), // Use current time for welcome message
  },
];
// --- End Default Welcome Data ---

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

  // Determine which connection and messages to display
  const displayConnection = connection || heartglowAIConnection;
  // Show welcome messages if no real connection is selected, otherwise show the prop messages
  const displayMessages = connection ? messages : welcomeMessages;
  // Check if we are showing the welcome state (no real connection selected)
  const isWelcomeState = !connection;

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
         {/* Connection Name - Centered more effectively */}
         {/* flex-1 allows it to take space, text-center, truncate for long names */}
         <div className="flex-1 text-center truncate px-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-100">
              {displayConnection.name || 'Chat'}
            </h3>
            {/* Optional: Subtitle like relationship, hidden on smallest screens */}
            {displayConnection.relationship && (
              <p className="text-xs text-gray-400 hidden sm:block">({displayConnection.relationship})</p>
            )}
         </div>

         {/* Right Spacer/Placeholder - keeps title centered */}
         {/* Needs same width as burger container for proper centering */} 
         <div className="w-10 h-10 md:hidden"></div> {/* Adjust width/height to match burger button size if needed */} 
         {/* Optional: Add desktop header controls here if needed */} 

      </div>

      {/* Message List Area - flex-1 allows it to grow and shrink, overflow-y-auto enables scrolling */} 
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
         <MessageList messages={displayMessages} isLoading={connection ? isLoadingMessages : false} />
      </div>

      {/* Message Input Area - Disable if in welcome state */} 
      <div className="sticky bottom-0 z-10 p-3 sm:p-4 bg-gray-900 border-t border-gray-700">
         <MessageInput 
           onSend={onSendMessage} 
           disabled={isWelcomeState || isLoadingMessages} // Disable if welcome OR loading real messages
           placeholder={isWelcomeState ? "Select or create a connection..." : "Type your message..."} // Custom placeholder for welcome state
         />
      </div>
    </div>
  );
};

export default ChatWindow; 