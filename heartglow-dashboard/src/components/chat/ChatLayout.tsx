import React, { useState } from 'react';
// import { MenuIcon, XIcon } from '@heroicons/react/outline'; // v1 import
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // v2 import
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-full bg-gray-900 text-white font-sans overflow-hidden">
      <div className="md:hidden absolute top-3 left-3 z-40">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          aria-label="Open sidebar"
        >
          {isSidebarOpen ? (
            // <XIcon className="h-6 w-6" aria-hidden="true" /> // v1 usage
            <XMarkIcon className="h-6 w-6" aria-hidden="true" /> // v2 usage
          ) : (
            // <MenuIcon className="h-6 w-6" aria-hidden="true" /> // v1 usage
            <Bars3Icon className="h-6 w-6" aria-hidden="true" /> // v2 usage
          )}
        </button>
      </div>

      <div
        className={`
          flex flex-col w-72 flex-shrink-0 bg-gray-800 p-4 border-r border-gray-700 transition-transform duration-300 ease-in-out z-30
          absolute inset-y-0 left-0 transform md:relative md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-pink-400">HeartGlow</h1>
          <button
             onClick={() => setIsSidebarOpen(false)}
             className="md:hidden p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
             aria-label="Close sidebar"
           >
             {/* <XIcon className="h-5 w-5" aria-hidden="true" /> // v1 usage */}
             <XMarkIcon className="h-5 w-5" aria-hidden="true" /> // v2 usage
           </button>
        </div>
        <h2 className="text-lg font-semibold mb-4 text-gray-300">Your Connections</h2>
        {
          isLoadingConnections ? (
            <div className="flex-grow flex items-center justify-center">
               {/* TODO: Add spinner */}
              <p className="text-gray-400">Loading connections...</p>
            </div>
          ) : (
             <ConnectionList
               connections={connections}
               selectedConnectionId={selectedConnectionId}
               onSelect={(id) => {
                 onSelectConnection(id);
                 setIsSidebarOpen(false);
               }}
             />
          )
        }
        <button className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
           + New Connection
         </button>
      </div>

      {isSidebarOpen && (
         <div
           className="fixed inset-0 bg-black/60 z-20 md:hidden"
           onClick={() => setIsSidebarOpen(false)}
           aria-hidden="true"
         />
       )}

      <div className="flex-1 flex flex-col min-w-0">
         <ChatWindow
           connection={selectedConnection}
           messages={messages}
           onSendMessage={onSendMessage}
           isLoadingMessages={isLoadingMessages}
         />
      </div>
    </div>
  );
};

export default ChatLayout; 