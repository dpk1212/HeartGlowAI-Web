import React, { useState } from 'react';
// import { MenuIcon, XIcon } from '@heroicons/react/outline'; // v1 import
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // v2 import
// Import sub-components
import ConnectionList from './ConnectionList';
import ChatWindow from './ChatWindow';
import NewConnectionModal from '../modals/NewConnectionModal'; // Import the modal content
// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
// Assuming types are defined in a central place, adjust path if needed
import type { Connection, Message } from '@/types';

// Define the static HeartGlow AI connection
const heartglowAIConnection: Connection = {
  id: 'heartglow-ai', // Use a reserved ID
  name: 'HeartGlow AI',
  relationship: 'assistant', // Or 'general', 'reflection', etc.
  createdAt: new Date(), // Or null/undefined if not needed
  // Add other required Connection fields if necessary, potentially with default/null values
  userId: '', // Assuming userId might be part of the type, add it if needed
  imageUrl: '/assets/heartglow-logo.png', // Optional: Add a specific icon/logo
};

interface ChatLayoutProps {
  connections: Connection[];
  messages: Message[];
  selectedConnectionId: string | null;
  onSelectConnection: (connectionId: string) => void;
  onSendMessage: (messageText: string) => void;
  onSaveConnection: (name: string, relationship: string) => Promise<void>; // Keep this for the modal
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
  onSaveConnection, // Pass this to the modal
  isLoadingConnections,
  isLoadingMessages,
}) => {
  // Combine the static AI connection with the dynamic ones
  const allConnections = [heartglowAIConnection, ...connections];

  // Find selected connection from the combined list
  const selectedConnection = allConnections.find(c => c.id === selectedConnectionId);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  // Remove state and handlers for old modal
  // const [isNewConnectionModalOpen, setIsNewConnectionModalOpen] = useState(false); 
  // const openNewConnectionModal = () => { ... };
  // const closeNewConnectionModal = () => { ... };

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  // Dialog state is now controlled internally by shadcn Dialog/DialogTrigger

  return (
    <Dialog> {/* Wrap relevant part of the layout with Dialog */}
      <div className="relative flex h-full bg-gray-900 text-white font-sans overflow-hidden">
        {/* --- Mobile Sidebar (Fixed, Sliding) --- */}
        <div
          className={`
            fixed inset-y-0 left-0 z-40
            flex flex-col w-72 max-w-[85%] flex-shrink-0
            bg-gray-800 p-4 border-r border-gray-700
            transition-transform duration-300 ease-in-out transform
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:hidden
          `}
          role="dialog"
          aria-modal="true"
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
          <h2 className="text-lg font-semibold mb-4 text-gray-300 flex-shrink-0">Your Connections</h2>
          {isLoadingConnections ? (
            <div className="flex-grow flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>
          ) : (
            // Use ScrollArea for the list
            <ScrollArea className="flex-grow overflow-y-auto pr-2"> {/* Added padding-right for scrollbar */}
              <ConnectionList
                connections={allConnections} // Pass the combined list
                selectedConnectionId={selectedConnectionId}
                onSelect={(id) => {
                  onSelectConnection(id);
                  closeMobileSidebar();
                }}
              />
            </ScrollArea>
          )
          }
          {/* New Connection Button - Mobile */}
          <DialogTrigger asChild>
            <Button 
              variant="default" // Use shadcn Button
              className="mt-4 w-full flex-shrink-0 bg-pink-600 hover:bg-pink-700" // Adjust styling as needed
              onClick={closeMobileSidebar} // Close sidebar when opening dialog
            >
              + New Connection
            </Button>
          </DialogTrigger>
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
           {/* New Connection Button - Desktop */}
           <DialogTrigger asChild>
             <Button 
               variant="outline" // Use shadcn Button, maybe outline style?
               className="mb-4 w-full justify-start border-gray-600 hover:border-gray-500 text-gray-200"
             >
               {/* Add icon maybe? <PlusIcon className="mr-2 h-4 w-4" /> */}
               + New Connection
             </Button>
           </DialogTrigger>
           {/* Connections List takes the rest of the space */}
           <ScrollArea className="flex-grow overflow-y-auto pr-1"> {/* Wrap list with ScrollArea */}
             {isLoadingConnections ? (
               <div className="flex h-full items-center justify-center"><p className="text-gray-400">Loading...</p></div>
             ) : (
               <ConnectionList
                 connections={allConnections} // Pass the combined list
                 selectedConnectionId={selectedConnectionId}
                 onSelect={onSelectConnection}
               />
             )
             }
           </ScrollArea>
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

        {/* --- Render New Connection Modal Content --- */}
        {/* No longer need isOpen or onClose props */}
        <NewConnectionModal onSave={onSaveConnection} />

      </div>
    </Dialog> /* End Dialog wrapper */
  );
};

export default ChatLayout; 