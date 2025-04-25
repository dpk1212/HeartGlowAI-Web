import React, { useEffect, useRef, useState, useCallback, ChangeEvent } from 'react';
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
import MessageItem from './MessageItem'; // Assuming MessageItem is in the same directory
import { Button } from '@/components/ui/button'; // Import Button
import { Sparkles, SendHorizonal, Users, Users2, HeartHandshake, Brain } from 'lucide-react'; // Import icons

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

// --- Example Prompts (keep outside component) ---
const examplePrompts = [
  "Apologizing without making it worse…",
  "Telling someone I need space…",
  "Explaining how I feel about us…",
  "Reaching out after silence…",
  "Asking for clarity without starting a fight…",
];

// --- Quick Start Prompts (keep outside component) ---
const quickStartPrompts = {
  avoiding: "Help me say something I've been avoiding",
  tension: "Help me navigate tension or conflict",
  feeling: "Help me understand what I'm feeling",
  reconnect: "Help me reconnect with someone important",
};

interface ChatWindowProps {
  connection: Connection | undefined; // The currently selected connection
  messages: Message[];
  onSendMessage: (messageText: string) => void;
  isLoadingMessages: boolean;
  onToggleMobileSidebar: () => void; // Receive the toggle function
  isSendingMessage?: boolean; // Ensure this is passed down
  // TODO: Add isSending state
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  connection,
  messages,
  onSendMessage,
  isLoadingMessages,
  onToggleMobileSidebar,
  isSendingMessage, // Received from parent (ChatLayout)
  // isSending, // Add this when state is managed
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showPrompts, setShowPrompts] = useState(true); // Initial state assumption

  // --- State & Logic moved back to ChatWindow scope --- 
  const [currentExample, setCurrentExample] = useState(examplePrompts[0]);
  const [inputValue, setInputValue] = useState("");
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // --- Effect for rotating examples ---
  useEffect(() => {
    if (!showPrompts) return;
    let index = 0;
    const intervalId = setInterval(() => {
      index = (index + 1) % examplePrompts.length;
      setCurrentExample(examplePrompts[index]);
    }, 4000);
    return () => clearInterval(intervalId);
  }, [showPrompts]);

  // --- Effect for idle fallback prompt ---
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    if (showPrompts && inputValue === "") {
      idleTimerRef.current = setTimeout(() => {
        setInputValue("There's something I want to say, but I keep overthinking how to say it.");
        inputRef.current?.focus();
      }, 6000);
    }
  }, [showPrompts, inputValue]);

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [resetIdleTimer]);

  // --- Effect to scroll message list and manage prompt visibility ---
  useEffect(() => {
    const shouldShow = messages.length === 0 && !isLoadingMessages;
    if (shouldShow !== showPrompts) {
       setShowPrompts(shouldShow);
    }
    // Scroll message list only when prompts are NOT shown
    if (!shouldShow && scrollContainerRef.current) {
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
      });
    }
  }, [messages, isLoadingMessages, showPrompts]);

  // Handle clicking a prompt suggestion
  const handlePromptClick = (promptText: string) => {
    console.log(`[ChatWindow] handlePromptClick called with: "${promptText}"`);
    onSendMessage(promptText);
  };

  // --- Handle input change ---
  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
     setInputValue(event.target.value);
  };

  // --- Handle message send (calls prop) ---
  const handleSend = () => {
     if (inputValue.trim()) {
        onSendMessage(inputValue.trim());
        setInputValue("");
     }
  };

  // --- Handle quick start click (calls prop) ---
  const handleQuickStartClick = (promptKey: keyof typeof quickStartPrompts) => {
    const promptText = quickStartPrompts[promptKey];
    onSendMessage(promptText);
    setInputValue("");
  };

  // --- Handle context selection (Placeholder) ---
   const handleContextSelect = (context: string) => {
     console.log("Selected context:", context);
   };
  // --- End State & Logic section ---

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#161624]">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[url('/assets/subtle-pattern.png')] opacity-[0.02] pointer-events-none z-0"></div>
      
      {/* Subtle Corner Gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-heartglow-pink/5 blur-[100px] rounded-full opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-heartglow-violet/5 blur-[100px] rounded-full opacity-40 pointer-events-none"></div>
      
      {/* Chat Header */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-[#111120]/90 border-b border-[#2A2A40]/30 shadow-sm">
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
            <h3 className="text-base sm:text-lg font-semibold text-white/95">{connection ? (connection.name || 'Chat') : 'HeartGlow AI'}</h3>
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

      {/* --- Conditional Rendering: Empty State vs Message List --- */}
      {showPrompts ? (
        // --- NEW: Redesigned Empty State Layout --- 
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 text-center overflow-y-auto">
          <div className="w-full max-w-xl flex flex-col items-center">
            {/* Section 1: Header */}
            <div className="mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Feeling stuck in a tough relationship moment?
              </h1>
              <p className="text-lg text-gray-300/80 mb-4">
                HeartGlow helps you find clarity — and the words to say it.
              </p>
              <p className="text-xs text-gray-500">
                Private, encrypted, and secure — your conversations stay between you and HeartGlow.
              </p>
            </div>

            {/* Section 2: Context Buttons */}
            <div className="mb-8">
              <p className="text-sm text-gray-400 mb-3">Who is this about? (Optional)</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['Partner', 'Colleague', 'Family', 'Myself'].map((ctx) => (
                  <Button key={ctx} variant="outline" size="sm" className="text-xs bg-white/5 border-white/10 hover:bg-white/10 text-gray-300 hover:text-white px-3 py-1 h-auto" onClick={() => handleContextSelect(ctx)}>{ctx}</Button>
                ))}
              </div>
            </div>

            {/* Section 3 & Input & Section 8 (Hints) - Grouped around input */}
            <div className="w-full max-w-3xl mb-8 px-4">
                 <p className="text-xs text-gray-500/80 mb-2 italic h-4">
                   e.g., {currentExample}
                 </p>
                 {/* Input is rendered below this empty state section */}
                 {/* Trust Hints */}
                 <div className="text-[11px] text-gray-500/70 mt-14 space-y-1">
                    <p>Built for emotional privacy — all messages encrypted.</p>
                 </div>
            </div>
            
            {/* Section 5: Quick Start Buttons */}
            <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-3">
               <Button variant="outline" className="justify-start text-left h-auto py-3 px-4 bg-[#2A2A45]/80 border-[#3A3A5C]/50 hover:bg-[#2A2A45] text-gray-200 hover:text-white" onClick={() => handleQuickStartClick('avoiding')}><HeartHandshake className="w-4 h-4 mr-2.5 text-pink-400/70" /> Help me say something I've been avoiding</Button>
               <Button variant="outline" className="justify-start text-left h-auto py-3 px-4 bg-[#2A2A45]/80 border-[#3A3A5C]/50 hover:bg-[#2A2A45] text-gray-200 hover:text-white" onClick={() => handleQuickStartClick('tension')}><Sparkles className="w-4 h-4 mr-2.5 text-purple-400/70" /> Help me navigate tension or conflict</Button>
               <Button variant="outline" className="justify-start text-left h-auto py-3 px-4 bg-[#2A2A45]/80 border-[#3A3A5C]/50 hover:bg-[#2A2A45] text-gray-200 hover:text-white" onClick={() => handleQuickStartClick('feeling')}><Brain className="w-4 h-4 mr-2.5 text-blue-400/70" /> Help me understand what I'm feeling</Button>
               <Button variant="outline" className="justify-start text-left h-auto py-3 px-4 bg-[#2A2A45]/80 border-[#3A3A5C]/50 hover:bg-[#2A2A45] text-gray-200 hover:text-white" onClick={() => handleQuickStartClick('reconnect')}><Users2 className="w-4 h-4 mr-2.5 text-teal-400/70" /> Help me reconnect with someone important</Button>
             </div>
          </div>
           {/* Spacer to push input down */}
           <div className="flex-grow"></div> 
        </div>
      ) : (
        // --- Message List Area --- 
        <ScrollArea 
          className="flex-1 py-4 px-2 sm:px-4 md:px-8 relative z-10"
          ref={scrollContainerRef}
        >
          <div className="space-y-5 pb-4">
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
            {isSendingMessage && (
                 <div className="flex justify-start pr-8 sm:pr-16">
                      {/* AI thinking indicator */}
                      <div className="mr-3 flex-shrink-0 mb-1"><div className="h-8 w-8 rounded-full bg-gradient-to-br from-heartglow-pink to-heartglow-violet flex items-center justify-center text-white"><Sparkles className="w-4 h-4 animate-pulse" /></div></div>
                      <div className="flex flex-col max-w-[80%] items-start"><div className="px-4 py-2.5 rounded-2xl shadow-md bg-gradient-to-br from-[#2A2A45]/95 to-[#1F1F35]/95 text-gray-100 rounded-bl-sm border border-[#3A3A5C]/20"><p className="text-sm italic blinking-cursor">Thinking…</p></div></div>
                 </div>
            )}
          </div>
          <ScrollBar />
        </ScrollArea>
      )}

      {/* --- Message Input Area (Common for both states) --- */}
      <div className="sticky bottom-0 z-10 pb-3 pt-2 px-3 sm:px-4 bg-[#161624]">
        <MessageInput
          value={inputValue}            
          onChange={handleInputChange}   
          onSend={handleSend}          
          inputRef={inputRef}           
          placeholder={showPrompts ? "What's something you're struggling to say right now?" : (connection ? `Message ${connection.name}...` : "Message HeartGlow...")}
          disabled={isLoadingMessages}
          isSending={isSendingMessage}  
        />
      </div>
    </div>
  );
};

export default ChatWindow; 