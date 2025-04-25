import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
// Import sub-components
import ConnectionList from './ConnectionList';
import ChatWindow from './ChatWindow';
import NewConnectionModal from '../modals/NewConnectionModal';
// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
// Assuming types are defined in a central place, adjust path if needed
import type { Connection, Message } from '@/types';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp
// Import useAuth and useRouter
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

// Define the static HeartGlow AI connection
const heartglowAIConnection: Connection = {
  id: 'heartglow-ai', // Use a reserved ID
  name: 'HeartGlow AI',
  relationship: 'assistant', // Or 'general', 'reflection', etc.
  createdAt: Timestamp.now(), // Use Firestore Timestamp
};

interface ChatLayoutProps {
  connections: Connection[];
  messages: Message[];
  selectedConnectionId: string | null;
  onSelectConnection: (connectionId: string) => void;
  onSendMessage: (messageText: string) => void;
  onSaveConnection: (name: string, relationship: string, specificRelationship?: string, goal?: string, notes?: string) => Promise<void>; // Updated to match new fields
  isLoadingConnections: boolean;
  isLoadingMessages: boolean;
  isSendingMessage?: boolean; // Add isSendingMessage prop
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
  isSendingMessage, // Destructure the new prop
}) => {
  // Combine the static AI connection with the dynamic ones
  const allConnections = [heartglowAIConnection, ...connections];

  // Find selected connection from the combined list
  const selectedConnection = allConnections.find(c => c.id === selectedConnectionId);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Import useAuth and useRouter
  const { currentUser } = useAuth();
  const router = useRouter();
  const isAnonymousUser = currentUser?.isAnonymous ?? true; // Default to true if no user

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  // Add new handler
  const handleRedirectToLogin = () => {
    router.push('/login?reason=new_connection');
  };

  return (
    <Dialog>
      <div className="relative flex h-full overflow-hidden bg-gradient-to-b from-[#0E0E1A] to-[#14141F] text-white font-sans">
        {/* --- Mobile Sidebar (Fixed, Sliding) --- */}
        <div
          className={`
            fixed inset-y-0 left-0 z-40
            flex flex-col w-72 max-w-[85%] flex-shrink-0
            bg-gradient-to-b from-[#1A1A2E]/95 to-[#12121E]/95 backdrop-blur-md
            rounded-r-xl shadow-2xl border-r border-[#2A2A40]/30
            transition-all duration-300 ease-out transform
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:hidden p-5
          `}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-sidebar-title"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 id="mobile-sidebar-title" className="text-2xl font-bold bg-gradient-to-r from-heartglow-pink to-heartglow-violet bg-clip-text text-transparent">HeartGlow</h1>
            <button
              onClick={closeMobileSidebar}
              className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-heartglow-pink/40 transition-all duration-200"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <h2 className="text-base font-medium mb-4 text-gray-200 flex-shrink-0 px-1">Your Connections</h2>
          {isLoadingConnections ? (
            <div className="flex-grow flex items-center justify-center">
              <div className="animate-spin h-6 w-6 border-2 border-heartglow-pink border-t-transparent rounded-full"></div>
              <p className="ml-3 text-gray-400 text-sm">Loading connections...</p>
            </div>
          ) : (
            <ScrollArea className="flex-grow overflow-y-auto pr-2">
              <ConnectionList
                connections={allConnections}
                selectedConnectionId={selectedConnectionId}
                onSelect={(id) => {
                  onSelectConnection(id);
                  closeMobileSidebar();
                }}
              />
            </ScrollArea>
          )}
          {/* --- MODIFIED: Conditional New Connection Button - Mobile --- */}
          {isAnonymousUser ? (
             <Button 
              variant="default"
              className="mt-5 w-full flex-shrink-0 bg-gradient-to-r from-heartglow-pink to-heartglow-violet hover:opacity-90 shadow-md hover:shadow-lg transition-all duration-200 border border-white/5"
              onClick={() => {
                 handleRedirectToLogin();
                 closeMobileSidebar(); // Close sidebar on redirect
              }}
            >
              <PlusIcon className="h-4 w-4 mr-2" /> New Connection
            </Button>
          ) : (
            <DialogTrigger asChild>
              <Button 
                variant="default"
                className="mt-5 w-full flex-shrink-0 bg-gradient-to-r from-heartglow-pink to-heartglow-violet hover:opacity-90 shadow-md hover:shadow-lg transition-all duration-200 border border-white/5"
                onClick={closeMobileSidebar} // Close sidebar when opening modal
              >
                <PlusIcon className="h-4 w-4 mr-2" /> New Connection
              </Button>
            </DialogTrigger>
          )}
          {/* --- END MODIFICATION --- */}
        </div>

        {/* Mobile Overlay - closes sidebar on click */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
            onClick={closeMobileSidebar}
            aria-hidden="true"
          />
        )}

        {/* --- Desktop Sidebar (Static/Relative) --- */}
        <div className="hidden md:flex md:flex-col md:w-80 md:flex-shrink-0 bg-[#13131D]/80 backdrop-blur-md p-4 border-r border-[#2A2A40]/30">
          {/* --- MODIFIED: Conditional New Connection Button - Desktop --- */}
          {isAnonymousUser ? (
            <Button 
              variant="outline"
              className="mb-5 w-full font-medium border-[#2A2A40] bg-[#1A1A2E]/70 hover:bg-[#1A1A2E] hover:border-heartglow-pink/30 text-gray-200 transition-all duration-200"
              onClick={handleRedirectToLogin}
            >
              <PlusIcon className="h-4 w-4 mr-2" /> New Connection
            </Button>
          ) : (
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="mb-5 w-full font-medium border-[#2A2A40] bg-[#1A1A2E]/70 hover:bg-[#1A1A2E] hover:border-heartglow-pink/30 text-gray-200 transition-all duration-200"
              >
                <PlusIcon className="h-4 w-4 mr-2" /> New Connection
              </Button>
            </DialogTrigger>
          )}
           {/* --- END MODIFICATION --- */}
          
          <h2 className="text-sm uppercase font-medium tracking-wider text-gray-400 mb-3 px-2">Your Connections</h2>
          
          {/* Connections List takes the rest of the space */}
          <ScrollArea className="flex-grow overflow-y-auto pr-1">
            {isLoadingConnections ? (
              <div className="flex h-full items-center justify-center py-8">
                <div className="animate-spin h-5 w-5 border-2 border-heartglow-pink border-t-transparent rounded-full"></div>
                <p className="ml-3 text-gray-400 text-sm">Loading connections...</p>
              </div>
            ) : (
              <ConnectionList
                connections={allConnections}
                selectedConnectionId={selectedConnectionId}
                onSelect={onSelectConnection}
              />
            )}
          </ScrollArea>
        </div>

        {/* --- Main Content Area (ChatWindow) --- */}
        <div className="flex-1 flex flex-col min-w-0 h-full bg-gradient-to-br from-[#111120] to-[#181828]">
          <ChatWindow
            connection={selectedConnection}
            messages={messages}
            onSendMessage={onSendMessage}
            isLoadingMessages={isLoadingMessages}
            onToggleMobileSidebar={toggleMobileSidebar}
            isSendingMessage={isSendingMessage} // Pass down isSendingMessage
          />
        </div>

        {/* --- Render New Connection Modal Content --- */}
        {/* Modal content is only relevant if Dialog is triggered (i.e., user is NOT anonymous) */}
        {!isAnonymousUser && <NewConnectionModal onSave={onSaveConnection} />}
      </div>
    </Dialog>
  );
};

export default ChatLayout; 