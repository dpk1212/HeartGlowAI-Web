import React, { useState } from 'react';
// import { MenuIcon, XIcon } from '@heroicons/react/outline'; // v1 import
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // v2 import
import { useRouter } from 'next/router'; // Import useRouter
// Import sub-components
import ConnectionList from './ConnectionList';
import ChatWindow from './ChatWindow';
// Assuming types are defined in a central place, adjust path if needed
import type { Connection, Message } from '@/types';

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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const router = useRouter(); // Get router instance

  // Helper function to pass down
  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  const handleNewConnectionClick = () => {
    router.push('/create'); // Navigate to the create page
    closeMobileSidebar(); // Close sidebar if open on mobile after clicking
  };

  return (
    // Outer container needed for relative positioning context if sidebar uses absolute
    // However, with fixed sidebar, it might not be strictly necessary unless other elements need it.
    // h-full ensures it tries to take parent height, overflow-hidden prevents weird scrollbars from transforms
    <div className="relative flex h-full bg-gray-900 text-white font-sans overflow-hidden">

      {/* --- Mobile Sidebar (Fixed, Sliding) --- */}
      {/* Uses fixed positioning to overlay content, high z-index */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40
          flex flex-col w-72 max-w-[85%] flex-shrink-0 {/* Added max-width */}
          bg-gray-800 p-4 border-r border-gray-700
          transition-transform duration-300 ease-in-out transform
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:hidden {/* Hidden on medium screens and up */}
        `}
        role="dialog" // Role for accessibility
        aria-modal="true" // Since it traps focus (via overlay)
        aria-labelledby="mobile-sidebar-title"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 id="mobile-sidebar-title" className="text-2xl font-bold text-pink-400">HeartGlow</h1>
          <button
             onClick={closeMobileSidebar}
             className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
             aria-label="Close sidebar"
           >
             {/* <XIcon className="h-5 w-5" aria-hidden="true" /> // v1 usage */}
             <XMarkIcon className="h-5 w-5" aria-hidden="true" /> // v2 usage
           </button>
        </div>
        <h2 className="text-lg font-semibold mb-4 text-gray-300">Your Connections</h2>
        {isLoadingConnections ? (
           <div className="flex-grow flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>
         ) : (
           // Make the list scrollable within the sidebar
           <div className="overflow-y-auto flex-grow">
             <ConnectionList
               connections={connections}
               selectedConnectionId={selectedConnectionId}
               onSelect={(id) => {
                 onSelectConnection(id);
                 closeMobileSidebar(); // Close sidebar after selection
               }}
             />
           </div>
         )
        }
         {/* Consider styling/positioning this button better within scrollable area */}
         <button 
           onClick={handleNewConnectionClick}
           type="button"
           className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex-shrink-0">
           + New Connection
         </button>
      </div>

      {/* Mobile Overlay - closes sidebar on click */}
      {isMobileSidebarOpen && (
         <div
           className="fixed inset-0 bg-black/60 z-30 md:hidden"
           onClick={closeMobileSidebar}
           aria-hidden="true"
         />
       )}

      {/* --- Desktop Sidebar (Static/Relative) --- */}
      {/* Styling similar to ChatGPT sidebar: slightly darker bg? */}
      <div className="hidden md:flex md:flex-col md:w-72 md:flex-shrink-0 bg-gray-850 p-3 border-r border-gray-700"> {/* Adjusted bg, padding */}
         {/* Maybe add a 'New Chat/Connection' button at the top like ChatGPT */}
         <button 
           onClick={handleNewConnectionClick}
           type="button"
           className="mb-4 w-full border border-gray-600 hover:border-gray-500 text-gray-200 font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-between">
           <span>+ New Connection</span>
           {/* Add edit/pen icon maybe? */}
         </button>
         {/* Connections List takes the rest of the space */}
         <div className="overflow-y-auto flex-grow space-y-1 pr-1"> {/* Add scroll & spacing */}
           {isLoadingConnections ? (
             <div className="flex-grow flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>
           ) : (
             <ConnectionList
               connections={connections}
               selectedConnectionId={selectedConnectionId}
               onSelect={onSelectConnection}
               // Pass a prop to ConnectionList for different styling if needed (e.g., less padding for desktop list items)
             />
           )
           }
         </div>
         {/* Optional: User settings/logout at the bottom */}
      </div>

      {/* --- Main Content Area (ChatWindow) --- */}
      {/* Pass the mobile sidebar toggle function down */}
      <div className="flex-1 flex flex-col min-w-0 h-full bg-gray-900"> {/* Main chat area background */}
         <ChatWindow
           connection={selectedConnection}
           messages={messages}
           onSendMessage={onSendMessage}
           isLoadingMessages={isLoadingMessages}
           onToggleMobileSidebar={toggleMobileSidebar} // Pass the toggle function
         />
      </div>
    </div>
  );
};

export default ChatLayout; 