import React, { useState, useRef, useEffect } from 'react';
import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SendHorizonal, Loader2 } from 'lucide-react';

// Props definition for ChatPanel
interface ChatPanelProps {
  messages: Message[];
  isLoadingMessages: boolean;
  onSendMessage: (messageText: string) => Promise<void>;
  isSendingMessage?: boolean; // Prop to indicate sending state
}

// --- Empty State Panel (Updated Design) ---
const EmptyChatPanel = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 flex-1"> {/* Ensure it fills space */}
      {/* Apply card styling with glow, blur, and centered text */}
      <Card className="p-8 rounded-xl bg-muted/20 border border-muted/30 shadow-glow-panel backdrop-blur-sm text-center max-w-md">
        {/* Serif font for the main emotional message */}
        <p className="text-2xl font-serif text-foreground mb-4">
          ✨ Let's craft something meaningful.
        </p>
        {/* Sans font for the supporting text */}
        <p className="text-muted-foreground font-sans">
          Who's on your heart today? Select a connection or start a new one.
        </p>
      </Card>
    </div>
  );
};

// --- Typing Animation Component ---
const TypingAnimation = () => {
  return (
    <div className="flex items-end gap-2 mt-3 justify-start animate-fadeIn">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="bg-gradient-to-br from-heartglow-pink to-heartglow-violet text-white text-xs">
          AI
        </AvatarFallback>
      </Avatar>
      <div className="bg-card border border-border/50 rounded-lg rounded-bl-none px-4 py-3 max-w-[100px] shadow-sm">
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-gray-300 animate-typing-1"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300 animate-typing-2"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300 animate-typing-3"></div>
        </div>
      </div>
    </div>
  );
};

// --- Message List (Corrected Types) ---
const ChatMessageList: React.FC<{ messages: Message[]; isLoading: boolean; isSending?: boolean }> = ({ 
  messages, 
  isLoading,
  isSending 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change or loading finishes
    if (scrollRef.current) {
      setTimeout(() => {
         if (scrollRef.current) {
           scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
         }
      }, 50);
    }
  }, [messages, isLoading, isSending]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full flex-1 p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
      {messages.map((msg) => (
        <div
          key={msg.id} // Use message ID as key
          className={cn(
            "flex items-end gap-2",
            // Use msg.sender and check against 'user'
            msg.sender === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          {/* Use msg.sender and check against 'ai' */}
          {msg.sender === 'ai' && (
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-heartglow-pink to-heartglow-violet text-white text-xs">
                AI
              </AvatarFallback>
            </Avatar>
          )}
          <div
            className={cn(
              "max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 text-sm shadow-sm",
              // Use msg.sender and check against 'user'
              msg.sender === 'user'
                ? 'bg-primary text-primary-foreground rounded-br-none'
                : 'bg-card border border-border/50 rounded-bl-none'
            )}
          >
             {/* Use msg.text for content */}
             {msg.text}
          </div>
          {/* Use msg.sender and check against 'user' */}
          {msg.sender === 'user' && (
             <Avatar className="h-8 w-8 flex-shrink-0">
               <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                 ME
               </AvatarFallback>
             </Avatar>
          )}
        </div>
      ))}
      
      {/* Show typing animation if a message is being sent */}
      {isSending && <TypingAnimation />}
      
      <div className="h-2" />
    </div>
  );
};

// --- Input Area (Updated Design) ---
const ChatInput: React.FC<{ onSendMessage: (text: string) => Promise<void>; isSending?: boolean }> = ({ onSendMessage, isSending }) => {
  const [messageText, setMessageText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = messageText.trim(); // Trim whitespace
    if (!textToSend || isSending) return; // Check trimmed text

    try {
        await onSendMessage(textToSend); // Send trimmed text
        setMessageText(''); // Clear input on successful send
        // Reset height after sending
         if (textareaRef.current) {
           textareaRef.current.style.height = 'auto';
         }
    } catch (error) {
        console.error("Error sending message from input:", error);
        // TODO: Show user error (e.g., toast)
    } finally {
         // Refocus might be slightly delayed to ensure state updates render
         setTimeout(() => textareaRef.current?.focus(), 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (not Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

   // Auto-resize textarea height
   useEffect(() => {
     if (textareaRef.current) {
       textareaRef.current.style.height = 'auto'; // Reset height first
       const scrollHeight = textareaRef.current.scrollHeight;
       const maxHeight = 200; // Example max height: approx 8 lines
       // Only set height if scrollHeight is greater than default single line height
       if (scrollHeight > 40) { // Adjust '40' based on your base line height + padding
            textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
       } else {
            textareaRef.current.style.height = 'auto'; // Keep it auto for single line
       }
     }
   }, [messageText]); // Rerun when message text changes


  return (
    // Use form for accessibility and submission handling
    <form
        onSubmit={handleSubmit}
        className="flex items-end gap-3 p-5 border-t border-border/20 bg-background/30 backdrop-blur-sm shadow-inner" 
    >
      {/* Apply new styling to Textarea */}
      <Textarea
        ref={textareaRef}
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What do you want to express today?"
        // Apply specified classes + resize-none and rows={1} for initial size
        className={cn(
            "flex-1 rounded-2xl bg-background/30 backdrop-blur border border-muted/50 shadow-inner p-4 text-base", // Adjusted padding
            "placeholder:text-muted-foreground resize-none overflow-y-auto min-h-[56px]", // Increased min-height
            "focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0" // Standard focus outline
        )}
        rows={1} // Start with 1 row, auto-resizes
        disabled={isSending} // Disable while sending
        aria-label="Message input"
      />
      {/* Apply new styling to Button */}
      <Button
        type="submit"
        // Apply specified classes
        className={cn(
            "bg-primary text-primary-foreground shadow-glow hover:shadow-glow-md rounded-full px-5 h-12 transition-all", // Height matches textarea min-height
            "flex-shrink-0" // Prevent button from shrinking
        )}
        disabled={!messageText.trim() || isSending} // Disable if trimmed text is empty or sending
        aria-label="Send message"
      >
        {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
            // Using text for now
            <span className='text-lg'>✨ Send</span>
            // <SendHorizonal className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
};

// --- Main Chat Panel Component ---
const ChatPanel: React.FC<ChatPanelProps> = ({ messages, isLoadingMessages, onSendMessage, isSendingMessage }) => {
  // Determine if the chat is empty (no messages and not loading)
  // This assumes an empty state should be shown when there are literally no messages.
  // Adjust logic if empty state should show when connectionId is null.
  const isEmpty = !isLoadingMessages && messages.length === 0;

  return (
    // Main panel container
    <div className="flex flex-col h-full bg-background/50 backdrop-blur-lg rounded-lg overflow-hidden border border-border/10 shadow-xl"> {/* Added shadow-xl */}
      {isEmpty ? (
        // Show empty state when no messages and not loading
        <EmptyChatPanel />
      ) : (
        // Show message list otherwise (handles its own loading state internally)
        <ChatMessageList 
          messages={messages} 
          isLoading={isLoadingMessages} 
          isSending={isSendingMessage}
        />
      )}
      {/* Input area is always visible below message list or empty state */}
      <div className="sticky bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-background to-transparent pt-3">
        <ChatInput onSendMessage={onSendMessage} isSending={isSendingMessage} />
      </div>
    </div>
  );
};

export default ChatPanel;
