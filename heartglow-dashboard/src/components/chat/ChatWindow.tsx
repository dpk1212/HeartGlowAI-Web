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
import { HeartHandshake, MessageCircleHeart, Flag, Waves, ScanLine, ShieldCheck, MailQuestion, LockKeyhole, MessagesSquare, Gem, Sparkles, Star } from 'lucide-react'; 
// REMOVED Tooltip imports - Component not found
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; 
// --- ADDED IMPORTS ---
import { useAuth } from '@/context/AuthContext';
import UpgradePrompt from './UpgradePrompt';
import { useRouter } from 'next/router'; // ADDED: For redirection
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

// --- Updated Guide Button Data with Tags and Reordered ---
const guideButtons = [
  // --- Top Choice Guide ---
  {
    headline: "5 Things Emotionally Intelligent People Say After an Argument",
    subtext: "Repair faster. Reconnect deeper. Stay proud of how you handled it.",
    icon: MessagesSquare,
    firstLine: "Arguments happen. Repairing well is what matters. Let\'s find the words for true reconnection.",
    tag: 'top-choice',
    isPremium: false,
    categories: ["Argument", "Apologies"]
  },
  // --- New Guides ---
  {
    headline: "How to Tell Someone You Miss Them Without Sounding Needy",
    subtext: "Bridge the distance — with honesty, softness, and strength.",
    icon: MailQuestion,
    firstLine: "Missing someone is human. Let\'s find a way to express it that feels authentic and strong.",
    tag: 'new',
    isPremium: false,
    categories: ["Attachment Style"]
  },
  {
    headline: "How to Tell If Someone Actually Values You",
    subtext: "Look past the words — spot the real signals that matter.",
    icon: Gem,
    firstLine: "Your value isn\'t up for debate. Let\'s look for the signs that show others truly see it too.",
    tag: 'new',
    isPremium: true,
    categories: ["Get Them Back"]
  },
  // --- Regular Guides ---
  {
    headline: "4 Messages to Rebuild a Relationship Before It's Too Late",
    subtext: "Before the distance becomes permanent, try these simple, powerful words.",
    icon: HeartHandshake,
    firstLine: "It\'s never too late to reach for connection. Let\'s find your opening line together.",
    isPremium: false,
    categories: ["Get Them Back"]
  },
  {
    headline: "5 Things to Say When You Feel Unseen or Misunderstood",
    subtext: "Be heard — without shouting, overexplaining, or begging.",
    icon: MessageCircleHeart,
    firstLine: "You deserve to be understood, not just tolerated. Let\'s find the words that open hearts, not walls.",
    isPremium: false,
    categories: ["Argument"]
  },
  {
    headline: "How to End a Conversation Without Guilt or Regret",
    subtext: "Say your truth — and leave with peace, not pieces.",
    icon: Flag,
    firstLine: "There\'s strength in choosing clarity over chaos. I\'ll help you end this with calm dignity.",
    isPremium: true,
    categories: ["Apologies"]
  },
  {
    headline: "3 Steps to Defuse Tension and Reset the Relationship",
    subtext: "Calm the storm without losing yourself — or the connection.",
    icon: Waves,
    firstLine: "Even the strongest storms can pass with the right words. Let\'s bring calm where there\'s heat.",
    isPremium: false,
    categories: ["Argument"]
  },
  {
    headline: "Signs It's Not About You — And How to Respond With Grace",
    subtext: "Release the weight of things that were never yours to carry.",
    icon: ScanLine,
    firstLine: "Sometimes we hurt because we care too much. Let\'s shift that burden off your shoulders.",
    isPremium: false,
    categories: ["Attachment Style"]
  },
];

// Removed filter options since we simplified the layout

interface ChatWindowProps {
  connection: Connection | undefined; // The currently selected connection
  messages: Message[];
  onSendMessage: (messageText: string) => void;
  isLoadingMessages: boolean;
  onToggleMobileSidebar: () => void; // Receive the toggle function
  isSendingMessage?: boolean; // Ensure this is passed down
  onSelectConnection: (connectionId: string) => void; // Add prop
  onStartGuide: (guideFirstLine: string) => void; // NEW: Trigger guide start
  // TODO: Add isSending state
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  connection,
  messages,
  onSendMessage,
  isLoadingMessages,
  onToggleMobileSidebar,
  isSendingMessage, // Received from parent (ChatLayout)
  onSelectConnection, // Destructure prop
  onStartGuide, // NEW: Destructure prop
  // isSending, // Add this when state is managed
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showPrompts, setShowPrompts] = useState(true); // Initial state assumption

  // --- State & Logic moved back to ChatWindow scope --- 
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // --- ADDED HOOKS/STATE ---
  const { userProfile, currentUser, loading: authLoading } = useAuth();
  const router = useRouter(); // ADDED: Initialize router
  const [ctaShown, setCtaShown] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const messageCountRef = useRef(messages.length); // Track previous message count
  // Track previous value of showPrompts to detect transition
  const prevShowPromptsRef = useRef(showPrompts);
  // Removed toggle state variables since we removed the filter buttons
  // Track if a guide was just clicked
  const guideClickedRef = useRef(false);
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

    /* --- COMMENTED OUT: 4-message prompt logic (replaced by guide-based paywall) ---
    const currentMessageCount = messages.length;
    const shouldShowUpgrade = 
      !userProfile?.isPremium && 
      !ctaShown && 
      currentMessageCount >= 4; 

    if (shouldShowUpgrade) {
      console.log("Triggering upgrade prompt.");
      setShowUpgradePrompt(true);
      setCtaShown(true); 
    }
    --- END COMMENTED OUT --- */

  }, [messages, isLoadingMessages, showPrompts, userProfile, ctaShown]); // Note: ctaShown might be removable if only using guide prompt

  // Track previous value of showPrompts to detect transition
  useEffect(() => {
    // If showPrompts just transitioned from true to false, scroll to bottom
    if (prevShowPromptsRef.current && !showPrompts && scrollContainerRef.current) {
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
      });
    }
    prevShowPromptsRef.current = showPrompts;
  }, [showPrompts]);

  // --- REVISED: Handle clicking a guide button with IMMEDIATE Paywall Logic ---
  const handleGuideClick = (promptText: string) => {
    // Only trigger AI guide, never send a user message!
    if (!userProfile || authLoading) { 
      console.warn("[ChatWindow] User profile not loaded yet or auth still loading.");
      return; 
    }
    // Removed anonymous user redirect - allow all users to click guides
    onSelectConnection('heartglow-ai');
    onStartGuide(promptText); // Only trigger AI response
    guideClickedRef.current = true;
  };
  // --- END REVISED handleGuideClick ---

  // Scroll to bottom after guide click and new message
  const prevMessagesLength = useRef(messages.length);
  useEffect(() => {
    if (guideClickedRef.current && messages.length > prevMessagesLength.current) {
      // New message after guide click
      if (scrollContainerRef.current) {
        requestAnimationFrame(() => {
          scrollContainerRef.current!.scrollTop = scrollContainerRef.current!.scrollHeight;
        });
      }
      guideClickedRef.current = false; // Reset
    }
    prevMessagesLength.current = messages.length;
  }, [messages.length]);

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

  // Show all guides since we removed filters

  // --- Scroll anchor for robust scroll-to-bottom ---
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#161624]">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[url('/assets/subtle-pattern.png')] opacity-[0.02] pointer-events-none z-0"></div>
      
      {/* Subtle Corner Gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-heartglow-pink/5 blur-[100px] rounded-full opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-heartglow-violet/5 blur-[100px] rounded-full opacity-50 pointer-events-none"></div>
      
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
        // --- Futuristic Liquid Metal UI ---
        <ScrollArea className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 text-center overflow-y-auto w-full relative">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-l from-blue-500/10 via-indigo-500/10 to-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>

          <div className="w-full mx-auto flex flex-col items-center sm:px-0 relative z-10">
            
            {/* Sophisticated Guide Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 mb-20 w-full max-w-7xl">
              {guideButtons.map((guide, index) => {
                const IconComponent = guide.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleGuideClick(guide.firstLine)}
                    className={`group relative flex flex-col items-start text-left p-6 sm:p-7 rounded-3xl 
                      bg-gradient-to-br from-slate-800/40 via-slate-700/30 to-slate-900/50 
                      backdrop-blur-xl border border-slate-600/30 
                      hover:border-cyan-400/50 hover:from-slate-700/50 hover:via-slate-600/40 hover:to-slate-800/60
                      transition-all duration-500 ease-out cursor-pointer 
                      hover:shadow-[0_20px_50px_rgba(6,182,212,0.15),0_0_0_1px_rgba(6,182,212,0.1)] 
                      hover:scale-[1.02] active:scale-[0.98]
                      focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-slate-900
                      transform-gpu will-change-transform
                      ${guide.tag === 'top-choice' ? 'shadow-[0_0_30px_rgba(251,191,36,0.2)] border-amber-400/40' : ''}
                      w-full overflow-hidden`}
                  >
                    {/* Liquid Metal Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    
                    {/* Floating Orb Background */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* --- Modern Badge System --- */}
                    <div className="w-full flex justify-between items-start mb-4 relative z-10">
                      <div>
                        {guide.tag === 'new' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-sm">
                            ✨ New
                          </span>
                        )}
                      </div>
                      <div>
                        {guide.tag === 'top-choice' && (
                           <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-400/30 backdrop-blur-sm space-x-1.5"> 
                             <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" /> 
                             <span className="text-[10px] font-semibold">Top Choice</span>
                           </div>
                        )}
                      </div>
                    </div>
                    
                    {/* --- Floating Icon with Glow --- */}
                    <div className="relative mb-4 group-hover:scale-110 transition-transform duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-purple-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 backdrop-blur-sm">
                        <IconComponent className="w-6 h-6 text-cyan-300 group-hover:text-cyan-200 transition-colors duration-300" strokeWidth={1.5} />
                      </div>
                    </div>
                    
                    {/* --- Typography with Enhanced Hierarchy --- */}
                    <span className="w-full text-sm sm:text-base font-bold text-slate-100 leading-tight mb-3 break-words min-w-0 group-hover:text-white transition-colors duration-300">
                      {guide.headline}
                    </span>
                    <span className="w-full text-xs sm:text-sm text-slate-400 break-words min-w-0 group-hover:text-slate-300 transition-colors duration-300 leading-relaxed">
                      {guide.subtext}
                    </span>
                    
                    {/* Subtle Bottom Accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </button>
                );
              })}
            </div>

            {/* Elegant Footer */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-500/20 to-transparent blur-sm"></div>
              <p className="relative text-sm text-slate-400 px-6 py-3 rounded-full bg-slate-800/30 backdrop-blur-sm border border-slate-600/20">
                Begin typing below or select a guide to start your journey
              </p>
            </div>
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
            {/* Scroll anchor for auto-scroll */}
            <div ref={el => { if (el) scrollAnchorRef.current = el; }} />
          </div>
          <ScrollBar />
        </ScrollArea>
      )}

      {/* --- ADDED: Upgrade Prompt (Rendered conditionally, outside main content flow) --- */}
      {showUpgradePrompt && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <UpgradePrompt onUpgradeClick={handleUpgradeClick} />
        </div>
      )}
      {/* --- END ADDED --- */}

      {/* --- Message Input Area (Always Visible) --- */}
      <div className="sticky bottom-0 z-10 pb-3 pt-2 px-3 sm:px-4 bg-gradient-to-t from-[#101018] to-[#161624] border-t border-[#2A2A40]/50">
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