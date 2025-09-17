import React, { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
// Import sub-components
import ConnectionList from './ConnectionList';
import ChatWindow from './ChatWindow';
import NewConnectionModal from '../modals/NewConnectionModal';
// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
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
  onStartGuide?: (guideFirstLine: string) => void; // NEW: Optional prop for guide start
}

const ChatLayout: React.FC<ChatLayoutProps> = ({
  connections,
  messages,
  selectedConnectionId,
  onSelectConnection,
  onSendMessage,
  onSaveConnection,
  isLoadingConnections,
  isLoadingMessages,
  isSendingMessage,
  onStartGuide, // NEW
}) => {
  const allConnections = [heartglowAIConnection, ...connections];
  const selectedConnection = allConnections.find(c => c.id === selectedConnectionId);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNewConnectionModalOpen, setIsNewConnectionModalOpen] = useState(false);

  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  const handleRedirectToLogin = () => {
    console.log('[ChatLayout] Redirecting anonymous user to login for new connection...');
    router.push('/login?reason=new_connection');
  };

  const handleNewConnectionClick = () => {
    console.log('[ChatLayout] New Connection clicked. currentUser:', currentUser);
    if (currentUser?.isAnonymous) {
        handleRedirectToLogin();
    } else if (currentUser) {
        console.log('[ChatLayout] Opening New Connection modal.');
        setIsNewConnectionModalOpen(true);
    } else {
        console.warn('[ChatLayout] currentUser is null/undefined when New Connection clicked. Redirecting to login.');
        handleRedirectToLogin(); 
    }
  };

  // Handler for starting a guide (calls parent if provided, else fallback)
  const handleStartGuide = (guideFirstLine: string) => {
    if (onStartGuide) {
      onStartGuide(guideFirstLine);
    } else {
      // Fallback: just send as a message (legacy behavior)
      onSendMessage(guideFirstLine);
    }
  };

  return (
    <div className="relative flex h-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white font-sans">
        {/* --- Premium Mobile Sidebar (Fixed, Sliding) --- */}
        <div
          className={`
            fixed inset-y-0 left-0 z-40
            flex flex-col w-80 max-w-[85%] flex-shrink-0
            bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl
            border-r border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]
            transition-all duration-300 ease-out transform
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:hidden
          `}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-sidebar-title"
        >
          {/* Premium Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 id="mobile-sidebar-title" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">HeartGlow</h1>
                <p className="text-xs text-white/60">Relationship Intelligence</p>
              </div>
            </div>
            <button
              onClick={closeMobileSidebar}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          {/* Connections Section */}
          <div className="p-6 pb-4">
            <h2 className="text-sm font-semibold text-white/90 mb-6 tracking-wide flex items-center">
              <div className="w-2 h-2 bg-violet-400 rounded-full mr-3"></div>
              Your Connections
            </h2>
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
          </div>
          )}
          <div className="p-6 pt-0">
            <Button 
              variant="default"
              className="w-full flex-shrink-0 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0 h-12 rounded-xl font-medium"
              onClick={() => {
                handleNewConnectionClick(); 
                closeMobileSidebar();
              }}
            >
              <PlusIcon className="h-5 w-5 mr-2" /> New Connection
            </Button>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
            onClick={closeMobileSidebar}
            aria-hidden="true"
          />
        )}

        {/* --- Premium Desktop Sidebar --- */}
        <div className="hidden md:flex md:flex-col md:w-80 md:flex-shrink-0 bg-gradient-to-b from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border-r border-white/10 relative">
          {/* Sophisticated Background Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.05),transparent_50%)] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_0%,transparent_50%)] pointer-events-none"></div>
          
          {/* Premium Header */}
          <div className="relative z-10 p-6 border-b border-white/10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">HeartGlow</h1>
                <p className="text-xs text-white/60">Relationship Intelligence</p>
              </div>
            </div>
            
            <Button 
              variant="default"
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0 h-12 rounded-xl font-medium"
              onClick={handleNewConnectionClick}
            >
              <PlusIcon className="h-5 w-5 mr-2" /> New Connection
            </Button>
          </div>
          
          {/* Connections Section */}
          <div className="relative z-10 flex-1 p-6">
            <h2 className="text-sm font-semibold text-white/90 mb-6 tracking-wide flex items-center">
              <div className="w-2 h-2 bg-violet-400 rounded-full mr-3"></div>
              Your Connections
            </h2>
            
            <ScrollArea className="flex-grow overflow-y-auto pr-1">
              {isLoadingConnections ? (
                <div className="flex h-full items-center justify-center py-8">
                  <div className="animate-spin h-5 w-5 border-2 border-violet-400 border-t-transparent rounded-full"></div>
                  <p className="ml-3 text-white/60 text-sm">Loading connections...</p>
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
        </div>

        {/* --- Main Content Area (ChatWindow) --- */}
        <div className="flex-1 flex flex-col min-w-0 h-full bg-gradient-to-br from-[#111120] to-[#181828]">
          <ChatWindow
            connection={selectedConnection}
            messages={messages}
            onSendMessage={onSendMessage}
            isLoadingMessages={isLoadingMessages}
            onToggleMobileSidebar={toggleMobileSidebar}
            isSendingMessage={isSendingMessage}
            onSelectConnection={onSelectConnection}
            onStartGuide={handleStartGuide}
          />
        </div>

        <NewConnectionModal 
            isOpen={isNewConnectionModalOpen} 
            onClose={() => setIsNewConnectionModalOpen(false)} 
            onSave={async (...args) => {
                await onSaveConnection(...args);
                setIsNewConnectionModalOpen(false);
            }}
        />
    </div>
  );
};

export default ChatLayout; 