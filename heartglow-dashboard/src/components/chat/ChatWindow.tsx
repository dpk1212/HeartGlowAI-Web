import React from 'react';
// Import sub-components
import MessageList from './MessageList';
import MessageInput from './MessageInput';

// TODO: Define actual types (import from types file)
type Message = { id: string; text: string; sender: 'user' | 'ai'; timestamp: any };
type Connection = { id: string; name: string; relationship?: string };

interface ChatWindowProps {
  connection: Connection | undefined; // The currently selected connection
  messages: Message[];
  onSendMessage: (messageText: string) => void;
  isLoadingMessages: boolean;
  // TODO: Add isSending state
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  connection,
  messages,
  onSendMessage,
  isLoadingMessages,
  // isSending, // Add this when state is managed
}) => {
  if (!connection) {
    // Render placeholder or welcome message when no connection is selected
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-gray-850 text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <p className="text-lg">Select a connection to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-gray-850 to-gray-900">
      {/* Chat Header */}
      <div className="px-4 sm:px-6 py-3 border-b border-gray-700 bg-gray-800 shadow-sm sticky top-0 z-10">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-100 truncate">
          Chat with {connection.name || '...'}
        </h3>
         {connection.relationship && (
           <p className="text-xs sm:text-sm text-gray-400">({connection.relationship})</p>
         )}
      </div>

      {/* Message List Area - Use MessageList component */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
         <MessageList messages={messages} isLoading={isLoadingMessages} />
      </div>

      {/* Message Input Area - Use MessageInput component */}
      <div className="px-4 sm:px-6 py-3 border-t border-gray-700 bg-gray-800 sticky bottom-0 z-10">
         <MessageInput 
           onSend={onSendMessage} 
          //  isSending={isSending} // Pass sending state here 
           disabled={!connection} // Disable if no connection selected
         />
      </div>
    </div>
  );
};

export default ChatWindow; 