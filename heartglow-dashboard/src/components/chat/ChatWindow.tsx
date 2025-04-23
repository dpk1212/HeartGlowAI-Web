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

// Sample prompt suggestions for empty states
const promptSuggestions = [
  {
    text: "Help craft a message to reconnect with an old friend",
    shortText: "Reconnect with a friend",
    icon: LightBulbIcon
  },
  {
    text: "How do I have a difficult conversation with my partner?",
    shortText: "Difficult partner conversation",
    icon: SparklesIcon
  },
  {
    text: "Write a thoughtful response to criticism I received",
    shortText: "Respond to criticism",
    icon: LightBulbIcon
  },
  {
    text: "Express gratitude to someone who helped me recently",
    shortText: "Express gratitude",
    icon: SparklesIcon
  }
];

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
          <div className="h-full flex flex-col items-center justify-center py-8">
            <div className="mb-6 text-gray-400/80 text-center">
              <p className="mb-6 text-sm sm:text-base font-medium">How can HeartGlow help you today?</p>
              
              {/* Enhanced Chat Bubble Suggestions - ChatGPT Inspired */}
              <div className="space-y-3 max-w-xl">
                {promptSuggestions.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt.text)}
                    className="w-full text-left p-3.5 rounded-xl bg-[#1E1E2E]/40 hover:bg-[#252538]/70 border border-[#3A3A5C]/30 hover:border-[#4A4A7C]/50 transition-all duration-200 relative group"
                  >
                    <div className="absolute top-3.5 left-3.5 text-[#9161FC]/70 group-hover:text-heartglow-pink/90 transition-colors duration-200">
                      <prompt.icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-gray-300/90 ml-8 line-clamp-2">{prompt.text}</p>
                  </button>
                ))}
              </div>
              
              {/* Additional floating bubble suggestions */}
              <div className="mt-12 flex flex-wrap justify-center gap-2">
                {promptSuggestions.map((prompt, index) => (
                  <button
                    key={`bubble-${index}`}
                    onClick={() => handlePromptClick(prompt.text)}
                    className="px-4 py-2 text-xs bg-[#1E1E2E]/60 text-gray-300/90 rounded-full border border-[#3A3A5C]/30 hover:bg-[#252538] hover:border-heartglow-pink/40 transition-all duration-200 whitespace-nowrap m-1 shadow-sm hover:shadow"
                  >
                    {prompt.shortText}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Regular Message List */}
        <MessageList messages={messages} isLoading={isLoadingMessages} />
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