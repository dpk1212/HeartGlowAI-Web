import React from 'react';
// Import sub-components
import ConnectionList from './ConnectionList';
import ChatWindow from './ChatWindow';

// Define placeholder types for props (replace with actual types later)
// TODO: Centralize these types
type Connection = { id: string; name: string; relationship?: string };
type Message = { id: string; text: string; sender: 'user' | 'ai'; timestamp: any };

interface ChatLayoutProps {
  connections: Connection[];
  messages: Message[];
  selectedConnectionId: string | null;
  onSelectConnection: (connectionId: string) => void;
  onSendMessage: (messageText: string) => void;
  isLoadingConnections: boolean;
  isLoadingMessages: boolean;
  // TODO: Add isSending state for message input
}

const ChatLayout: React.FC<ChatLayoutProps> = ({
  connections,
  messages,
  selectedConnectionId,
  onSelectConnection,
  onSendMessage,
  isLoadingConnections,
  isLoadingMessages,
}) => {
  const selectedConnection = connections.find(c => c.id === selectedConnectionId);

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      {/* Sidebar - Connection List */}
      <div className="w-64 md:w-72 flex-shrink-0 bg-gray-800 p-4 border-r border-gray-700 flex flex-col">
        <h1 className="text-2xl font-bold mb-6 text-pink-400">HeartGlow</h1>
        <h2 className="text-lg font-semibold mb-4 text-gray-300">Your Connections</h2>
        {
          isLoadingConnections ? (
            <div className="flex-grow flex items-center justify-center">
               {/* TODO: Add spinner */}
              <p className="text-gray-400">Loading connections...</p>
            </div>
          ) : (
             // Render ConnectionList when not loading
             <ConnectionList
               connections={connections}
               selectedConnectionId={selectedConnectionId}
               onSelect={onSelectConnection}
             />
          )
        }
        {/* Optional: Add New Connection Button */}
         <button className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
           + New Connection
         </button>
      </div>

      {/* Main Chat Area - Use ChatWindow component */}
      <ChatWindow
        connection={selectedConnection} // Pass the found connection object or undefined
        messages={messages}
        onSendMessage={onSendMessage}
        isLoadingMessages={isLoadingMessages}
      />
    </div>
  );
};

export default ChatLayout; 