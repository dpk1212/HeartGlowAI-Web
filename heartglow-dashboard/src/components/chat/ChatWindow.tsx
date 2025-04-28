import React, { useEffect, useRef, useState, useCallback, ChangeEvent } from 'react';
// Import sub-components
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Bars3Icon } from '@heroicons/react/24/outline'; // Removed unused icons
// Assuming types are defined in a central place, adjust path if needed
import type { Connection, Message } from '@/types';
// Removed unused Timestamp import (likely used elsewhere, but not in visible scope)
// import { Timestamp } from 'firebase/firestore'; 
// Import Card components
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Import ScrollArea
import MessageItem from './MessageItem'; // Assuming MessageItem is in the same directory
// Removed unused Button import
// Removed unused Sparkles, SendHorizonal, Users, Users2, Brain imports
import { HeartHandshake, MessageCircleHeart, Flag, Waves, ScanLine, ShieldCheck, Sparkles } from 'lucide-react'; 
// --- ADDED IMPORTS ---
import { useAuth } from '@/context/AuthContext';
import UpgradePrompt from './UpgradePrompt';
// --- END ADDED IMPORTS ---

// Remove HeartGlow AI connection/message constants - welcome state is now a Card
// const heartglowAIConnection: Connection = { ... };
// const welcomeMessages: Message[] = [ ... ];

// Updated prompt suggestions for empty states - more action-oriented, removed shortText
// const promptSuggestions = [
//   {
//     text: "Analyze my current relationship dynamics", // Updated
//     icon: SparklesIcon
//   },
//   {
//     text: "Help me draft a message for a specific situation", // Updated
//     icon: LightBulbIcon
//   },
//   {
//     text: "Suggest ways to build deeper connection", // Updated
//     icon: SparklesIcon
//   },
//   {
//     text: "Help me think through a difficult situation", // Updated
//     icon: LightBulbIcon
//   }
// ];

// --- Example Prompts (keep outside component) ---
// const examplePrompts = [
//   "Apologizing without making it worse…",
//   "Telling someone I need space…",
//   "Explaining how I feel about us…",
//   "Reaching out after silence…",
//   "Asking for clarity without starting a fight…",
// ];

// --- Quick Start Prompts (keep outside component) ---
// const quickStartPrompts = {
//   avoiding: "Help me say something I've been avoiding",
//   tension: "Help me navigate tension or conflict",
//   feeling: "Help me understand what I'm feeling",
//   reconnect: "Help me reconnect with someone important",
// };

// --- New Guide Button Data ---
const guideButtons = [
  {
    headline: "4 Messages to Rebuild a Relationship Before It's Too Late",
    subtext: "Before the distance becomes permanent.",
    icon: HeartHandshake,
    firstLine: "It's never too late to reach for connection. Let's find your opening line together."
  },
  {
    headline: "5 Things to Say When You Feel Unseen or Misunderstood",
    subtext: "Be heard without needing to shout.",
    icon: MessageCircleHeart, // Approximation
    firstLine: "You deserve to be understood, not just tolerated. Let's find the words that open hearts, not walls."
  },
  {
    headline: "How to End a Conversation Without Guilt or Regret",
    subtext: "Say your truth — leave with peace.",
    icon: Flag,
    firstLine: "There's strength in choosing clarity over chaos. I'll help you end this with calm dignity."
  },
  {
    headline: "3 Steps to Defuse Tension and Reset the Relationship",
    subtext: "Calm the storm without losing yourself.",
    icon: Waves,
    firstLine: "Even the strongest storms can pass with the right words. Let's bring calm where there's heat."
  },
  {
    headline: "Signs It's Not About You — And How to Respond With Grace",
    subtext: "Stop carrying weight that isn't yours.",
    icon: ScanLine,
    firstLine: "Sometimes we hurt because we care too much. Let's shift that burden off your shoulders."
  },
  {
    headline: "4 Boundaries That Protect Your Peace Without Pushing People Away",
    subtext: "Keep your heart open, but guarded.",
    icon: ShieldCheck,
    firstLine: "Boundaries aren't barriers—they're bridges that save your peace. Let's build yours together."
  },
];

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
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // --- ADDED HOOKS/STATE ---
  const { userProfile, currentUser, loading: authLoading } = useAuth();
  const [ctaShown, setCtaShown] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const messageCountRef = useRef(messages.length); // Track previous message count
  // --- END ADDED HOOKS/STATE ---

  // --- Effect to scroll message list and manage prompt visibility ---
  useEffect(() => {
    const shouldShowEmptyState = messages.length === 0 && !isLoadingMessages;
    if (shouldShowEmptyState !== showPrompts) {
      setShowPrompts(shouldShowEmptyState);
    }
    
    // Scroll logic remains the same
    if (!shouldShowEmptyState && scrollContainerRef.current) {
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
      });
    }

    // --- ADDED LOGIC: Determine when to show upgrade prompt --- 
    const currentMessageCount = messages.length;
    // Trigger exactly once when message count *reaches* 3 (or maybe 4 is better? Let's use 4)
    const shouldShowUpgrade = 
      !userProfile?.isPremium && 
      !ctaShown && 
      currentMessageCount >= 4; // Trigger at 4 messages

    if (shouldShowUpgrade) {
      console.log("Triggering upgrade prompt.");
      setShowUpgradePrompt(true);
      setCtaShown(true); // Mark as shown so it doesn't reappear
    }
    // --- END ADDED LOGIC ---

  }, [messages, isLoadingMessages, showPrompts, userProfile, ctaShown]);

  // Handle clicking a guide button (renamed from handlePromptClick)
  const handleGuideClick = (promptText: string) => {
    console.log(`[ChatWindow] handleGuideClick called with: \"${promptText}\"`);
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

  // --- MODIFIED: Handle upgrade button click (Direct Stripe Redirect) ---
  const handleUpgradeClick = () => {
    if (currentUser?.uid) {
      // Use the same payment link as settings.tsx
      const paymentLink = "https://buy.stripe.com/4gw03z8Tf1cW2sw8ww"; 
      const urlWithRef = `${paymentLink}?client_reference_id=${currentUser.uid}`;
      console.log('[ChatWindow] Redirecting to Stripe:', urlWithRef);
      window.location.href = urlWithRef;
    } else {
      console.error('[ChatWindow] User not logged in, cannot upgrade.');
      // Optionally show an error message to the user here
    }
  };
  // --- END MODIFIED ---

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
        // --- NEW Empty State UI ---
        <ScrollArea className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 text-center overflow-y-auto">
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white/95 leading-tight max-w-2xl">
              When your emotions feel tangled, we help you find the words—and the way forward.
            </h1>
            {/* Subheadline */}
            <p className="mt-4 text-base sm:text-lg text-gray-400/90 max-w-xl">
              Private, encrypted, and emotionally intelligent — HeartGlow turns emotional confusion into clear, confident action.
            </p>

            {/* New Button Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 mb-10 w-full">
              {guideButtons.map((guide, index) => {
                const IconComponent = guide.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleGuideClick(guide.firstLine)}
                    className="flex flex-col items-center text-center p-5 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer border border-transparent hover:border-heartglow-pink/20 shadow-sm hover:shadow-[0_0_20px_rgba(238,104,150,0.15)] focus:outline-none focus:ring-2 focus:ring-heartglow-pink/40 focus:ring-offset-2 focus:ring-offset-[#161624]"
                  >
                    <IconComponent className="w-6 h-6 mb-3 text-heartglow-pink/80" strokeWidth={1.5} />
                    <span className="text-sm font-medium text-white/95 leading-snug">{guide.headline}</span>
                    <span className="text-xs text-gray-400/80 mt-1.5">{guide.subtext}</span>
                  </button>
                );
              })}
            </div>

            {/* Footer Line */}
            <p className="text-xs text-gray-500 mt-6">
              Not sure where to start? Just begin typing. HeartGlow will guide you step-by-step.
            </p>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
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
            {/* --- ADDED: Conditional Upgrade Prompt --- */}
            {showUpgradePrompt && (
              <UpgradePrompt onUpgradeClick={handleUpgradeClick} />
            )}
            {/* --- END ADDED --- */}
          </div>
          <ScrollBar />
        </ScrollArea>
      )}

      {/* --- Message Input Area (Always Visible) --- */}
      <div className="sticky bottom-0 z-10 pb-3 pt-2 px-3 sm:px-4 bg-[#161624]">
        <MessageInput
          value={inputValue}            
          onChange={handleInputChange}   
          onSend={handleSend}          
          inputRef={inputRef}           
          // Placeholder now uses a generic message when prompts are shown
          placeholder={showPrompts ? "Start typing here, or choose a guide above..." : (connection ? `Message ${connection.name}...` : "Message HeartGlow...")}
          disabled={isLoadingMessages}
          isSending={isSendingMessage}  
        />
      </div>
    </div>
  );
};

export default ChatWindow; 