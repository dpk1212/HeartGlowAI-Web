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
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Premium Base Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.05),transparent)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,rgba(147,51,234,0.03),transparent)] pointer-events-none"></div>
      
      {/* Premium Header */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-slate-900/90 border-b border-white/10 relative">
        {/* Subtle header glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
        
        <div className="flex items-center justify-between p-4 relative z-10">
          {/* Mobile Burger Button */}
          <div className="md:hidden">
            <button
              onClick={onToggleMobileSidebar}
              className="group p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-violet-400/30 transition-all duration-200 border border-white/5 hover:border-white/20"
              aria-label="Open sidebar"
            >
              <Bars3Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
            </button>
          </div>
          
          {/* Enhanced Connection Info */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="flex items-center justify-center space-x-3">
              {/* Connection Avatar/Icon */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
                <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white/95 tracking-tight">
                  {connection ? (connection.name || 'Chat') : 'HeartGlow AI'}
                </h3>
                {connection?.relationship && (
                  <p className="text-xs text-white/60 hidden sm:block mt-0.5 font-medium">
                    {connection.relationship}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Status Indicator / Right Content */}
          <div className="flex items-center space-x-2">
            {/* Online status indicator */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-white/70 font-medium">Online</span>
            </div>
            
            {/* Mobile spacer for visual balance */}
            <div className="w-8 h-8 md:hidden"></div>
          </div>
        </div>
      </div>

      {/* --- Conditional Rendering: Empty State vs Message List --- */}
      {showPrompts ? (
        // --- World-Class Hero Interface ---
        <ScrollArea className="flex-1 flex flex-col overflow-y-auto w-full relative">
          {/* Stunning Background Composition */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Premium gradient mesh */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/20 via-slate-900 to-purple-900/20"></div>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-violet-500/10 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-tr from-blue-500/8 via-transparent to-transparent"></div>
            
            {/* Sophisticated light rays */}
            <div className="absolute top-1/4 left-1/2 w-[800px] h-[400px] bg-gradient-conic from-violet-500/5 via-purple-500/8 to-pink-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-1/3 right-1/3 w-[600px] h-[300px] bg-gradient-radial from-indigo-500/10 via-blue-500/5 to-transparent rounded-full blur-2xl"></div>
            
            {/* Elegant geometric grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)]"></div>
            
            {/* Floating elements */}
            <div className="absolute top-1/6 right-1/4 w-2 h-2 bg-violet-400/40 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 left-1/5 w-1 h-1 bg-blue-400/30 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/4 right-1/5 w-1.5 h-1.5 bg-purple-400/35 rounded-full animate-pulse delay-500"></div>
          </div>

          {/* Hero Section */}
          <div className="relative z-10 pt-16 sm:pt-24 lg:pt-32 pb-12 px-6 sm:px-12 lg:px-16">
            <div className="max-w-6xl mx-auto">
              {/* Premium Badge */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-400/30 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-violet-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium text-violet-200">AI-Powered Relationship Intelligence</span>
                </div>
              </div>

              {/* Hero Headlines */}
              <div className="text-center mb-12">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.9] mb-8 tracking-tight">
                  Find the
                  <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Perfect Words
                  </span>
                  <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal text-white/80 mt-4">
                    for Any Moment
                  </span>
                </h1>
                
                <p className="text-xl sm:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed font-light mb-8">
                  Transform difficult conversations into meaningful connections. Get personalized guidance for every relationship challenge.
                </p>

                {/* Social Proof */}
                <div className="flex items-center justify-center space-x-6 text-white/50 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full border-2 border-slate-900"></div>
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full border-2 border-slate-900"></div>
                      <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full border-2 border-slate-900"></div>
                    </div>
                    <span>Trusted by thousands</span>
                  </div>
                  <div className="w-px h-4 bg-white/20"></div>
                  <div>⭐ 4.9/5 rating</div>
                  <div className="w-px h-4 bg-white/20"></div>
                  <div>🔒 Private & secure</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 px-6 sm:px-12 lg:px-16 pb-24">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16">
                <h2 className="text-2xl sm:text-3xl font-semibold text-white/95 mb-4">
                  Choose Your Conversation Guide
                </h2>
                <p className="text-lg text-white/60 max-w-2xl mx-auto">
                  Select a personalized guide below, or start a conversation to get instant help.
                </p>
            </div>

            {/* Premium Guide Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-24">
              {guideButtons.map((guide, index) => {
                const IconComponent = guide.icon;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleGuideClick(guide.firstLine)}
                    className="group relative flex flex-col text-left p-8 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 ease-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform-gpu will-change-transform overflow-hidden"
                  >
                    {/* Subtle shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    
                    {/* Badge System */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                    {guide.tag === 'new' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        New
                      </span>
                    )}
                      </div>
                      <div>
                    {guide.tag === 'top-choice' && (
                           <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 space-x-1.5"> 
                             <Star className="w-3 h-3 text-amber-300 fill-amber-300" /> 
                             <span className="text-xs font-medium">Popular</span>
                       </div>
                    )}
                      </div>
                    </div>
                    
                    {/* Icon */}
                    <div className="relative mb-6">
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm group-hover:bg-white/15 group-hover:scale-105 transition-all duration-300">
                        <IconComponent className="w-6 h-6 text-white/80 group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-lg font-semibold text-white/95 leading-tight mb-3 group-hover:text-white transition-colors duration-300">
                      {guide.headline}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                      {guide.subtext}
                    </p>
                  </button>
                );
              })}
            </div>

              {/* Sophisticated Call-to-Action */}
              <div className="text-center pt-8">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 blur-xl rounded-full"></div>
                  <div className="relative px-8 py-4 rounded-full bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-xl border border-white/10">
                    <p className="text-lg text-white/80 font-medium">
                      Ready to transform your conversations?
                    </p>
                    <p className="text-sm text-white/50 mt-1">
                      Choose a guide above or start typing below
                    </p>
                  </div>
                </div>
              </div>
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

      {/* --- Premium Message Input Area --- */}
      <div className="sticky bottom-0 z-10 p-6 bg-gradient-to-t from-slate-900/95 to-slate-900/80 backdrop-blur-xl border-t border-white/10">
        <MessageInput
          value={inputValue}            
          onChange={handleInputChange}   
          onSend={handleSend}          
          inputRef={inputRef}           
          placeholder={showPrompts ? "Ask me anything or choose a guide above..." : (connection ? `Message ${connection.name}...` : "Message HeartGlow...")}
          disabled={isLoadingMessages}
          isSending={isSendingMessage}  
        />
      </div>
    </div>
  );
};

export default ChatWindow; 