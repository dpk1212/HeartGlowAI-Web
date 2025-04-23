import React, { useEffect, useRef, useState } from 'react';
// Import sub-components
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Bars3Icon, LightBulbIcon, SparklesIcon } from '@heroicons/react/24/outline';
// Assuming types are defined in a central place, adjust path if needed
import type { Connection, Message } from '@/types';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp
// Import Card components
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Import ScrollArea

// Remove HeartGlow AI connection/message constants - welcome state is now a Card
// const heartglowAIConnection: Connection = { ... };
// const welcomeMessages: Message[] = [ ... ];

// Updated prompt suggestions for empty states - more action-oriented, removed shortText
const promptSuggestions = [
  {
    text: "Analyze my current relationship dynamics", // Updated
    icon: SparklesIcon
  },
  {
    text: "Help me draft a message for a specific situation", // Updated
    icon: LightBulbIcon
  },
  {
    text: "Suggest ways to build deeper connection", // Updated
    icon: SparklesIcon
  },
  {
    text: "Help me think through a difficult situation", // Updated
    icon: LightBulbIcon
  }
];

interface ChatWindowProps {
  connection: Connection | undefined; // The currently selected connection
  messages: Message[];
  onSendMessage: (messageText: string) => void;
  isLoadingMessages: boolean;
  onToggleMobileSidebar: () => void; // Receive the toggle function
  // isSendingMessage?: boolean; // Remove prop
  // TODO: Add isSending state
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  connection,
  messages,
  onSendMessage,
  isLoadingMessages,
  onToggleMobileSidebar,
  // isSendingMessage, // Remove from destructuring
  // isSending, // Add this when state is managed
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null); // Ref for the viewport
  const [showPrompts, setShowPrompts] = useState(messages.length === 0);

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
    
    // Update prompt visibility based on message count
    setShowPrompts(messages.length === 0);
  }, [messages, connection]); // Dependencies

  // Handle clicking a prompt suggestion
  const handlePromptClick = (promptText: string) => {
    // console.log(`[ChatWindow] handlePromptClick called with: "${promptText}"`); // Remove log
    onSendMessage(promptText);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[url('/assets/subtle-pattern.png')] opacity-[0.02] pointer-events-none z-0"></div>
      
      {/* Subtle Corner Gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-heartglow-pink/5 blur-[100px] rounded-full opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-heartglow-violet/5 blur-[100px] rounded-full opacity-40 pointer-events-none"></div>
      
      {/* Chat Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-[#111120]/90 border-b border-[#2A2A40]/30 shadow-sm">
        <div className="flex items-center justify-between p-4 relative">
          {/* Mobile Burger Button */}
          <div className="md:hidden">
            <button
              onClick={onToggleMobileSidebar}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#1A1A2E]/70 focus:outline-none focus:ring-2 focus:ring-heartglow-pink/40 transition-all duration-200"
              aria-label="Open sidebar"
            >
              <Bars3Icon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          
          {/* Connection Name */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-white to-white/90 bg-clip-text">
              {connection ? (connection.name || 'Chat') : 'HeartGlow AI'}
            </h3>
            {connection?.relationship && (
              <p className="text-xs text-gray-400/90 hidden sm:block mt-0.5">
                {connection.relationship}
              </p>
            )}
          </div>
          
          {/* Right Spacer */}
          <div className="w-8 h-8 md:hidden"></div>
        </div>
      </div>

      {/* Message List Area */}
      <ScrollArea 
        className="flex-1 py-4 px-2 sm:px-4 md:px-8 relative z-10" 
        ref={scrollContainerRef}
      >
        {/* Empty State with Prompt Suggestions */}
        {showPrompts && !isLoadingMessages && (
          <div className="h-full flex flex-col items-center justify-center py-10 px-4"> 
            <div className="w-full max-w-xl text-center"> 
              {/* Static Welcome Message Area */}
              <div className="mb-8 p-5 rounded-lg bg-[#1E1E2E]/40 border border-[#3A3A5C]/30 text-left shadow-sm">
                <h3 className="font-semibold text-white mb-2">Welcome to HeartGlow AI! ✨</h3>
                <p className="text-sm text-gray-300/90 leading-relaxed space-y-2">
                  <span>I'm here to be your guide in navigating communication challenges and deepening your relationships. Think of me as your personal communication co-pilot.</span>
                  <span>You can ask me anything about relationships, get help drafting tricky messages, or explore ways to express yourself more authentically.</span>
                  <span>Chat with me here for general guidance, or create specific **Connections** using the '+' button to get tailored insights.</span>
                  <span>So, what's on your mind today?</span>
                </p>
              </div>

              {/* Prompt Suggestions Area */}
              <p className="mb-4 text-base text-gray-400/90">Choose a starting point:</p>
              
              <div className="space-y-3.5"> 
                {promptSuggestions.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt.text)}
                    className="w-full text-left p-4 rounded-xl bg-[#1E1E2E]/50 hover:bg-[#28283A]/80 border border-[#3A3A5C]/40 hover:border-[#5A5A8C]/60 transition-all duration-200 relative group shadow-sm hover:shadow-md"
                  >
                    <div className="absolute top-4 left-4 text-indigo-400/80 group-hover:text-heartglow-pink/90 transition-colors duration-200"> 
                      <prompt.icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm sm:text-base text-gray-200/90 ml-9">{prompt.text}</p> 
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Regular Message List - No longer passing isSendingMessage */}
        <MessageList 
            messages={messages} 
            isLoading={isLoadingMessages} 
            // isSendingMessage={isSendingMessage} // Remove prop
        />
        <ScrollBar />
      </ScrollArea>

      {/* Message Input Area - ChatGPT-inspired shorter input */}
      <div className="sticky bottom-0 z-10 pb-3 pt-2 px-3 sm:px-4">
        <MessageInput 
          onSend={onSendMessage} 
          disabled={isLoadingMessages}
        />
      </div>
    </div>
  );
};

export default ChatWindow; 