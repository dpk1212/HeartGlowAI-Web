import React, { useState, useCallback } from 'react';
// Import shadcn components and icons
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Sparkles, BarChart2, CornerDownLeft } from 'lucide-react'; // Use Send icon

interface MessageInputProps {
  onSend: (messageText: string) => void;
  disabled?: boolean;
  isSending?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled = false, isSending = false }) => {
  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
    // Auto-resize logic might be needed if default shadcn textarea doesn't suffice
  };

  const handleSend = useCallback(() => {
    const textToSend = inputText.trim();
    if (textToSend && !disabled && !isSending) {
      onSend(textToSend);
      setInputText('');
    }
  }, [inputText, onSend, disabled, isSending]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  // Use a form for better accessibility and potential submit handling
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSend();
  };

  // Handler for suggestion button clicks
  const handleSuggestionClick = useCallback((prompt: string) => {
    if (!disabled && !isSending) {
      onSend(prompt);
      // Optionally clear input text if needed, but usually prompts don't fill the box
      // setInputText(''); 
    }
  }, [onSend, disabled, isSending]);

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative max-w-3xl mx-auto w-full mb-4"
    >
      {/* Prompt Starter Buttons Container - Enhanced Styling */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-3 px-2"> {/* Added flex-wrap and gap */}
        <button 
          type="button" 
          onClick={() => handleSuggestionClick("Help Generate a Message")} // Added onClick
          disabled={disabled || isSending} // Disable button if input is disabled
          className="inline-flex items-center bg-background/60 hover:bg-muted/80 border border-border/50 text-foreground/80 px-3 py-1.5 rounded-full text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:pointer-events-none" // Adjusted styles
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5 text-heartglow-pink/80" /> {/* Added icon */}
          Help Generate a Message
        </button>
        <button 
          type="button" 
          onClick={() => handleSuggestionClick("Analyze Dynamics")} // Added onClick
          disabled={disabled || isSending}
          className="inline-flex items-center bg-background/60 hover:bg-muted/80 border border-border/50 text-foreground/80 px-3 py-1.5 rounded-full text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          <BarChart2 className="h-3.5 w-3.5 mr-1.5 text-heartglow-pink/80" /> {/* Added icon */}
          Analyze Dynamics
        </button>
         <button 
          type="button" 
          onClick={() => handleSuggestionClick("Suggest a Reply")} // Added onClick
          disabled={disabled || isSending}
          className="inline-flex items-center bg-background/60 hover:bg-muted/80 border border-border/50 text-foreground/80 px-3 py-1.5 rounded-full text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:pointer-events-none hidden sm:inline-flex" // Kept hidden on small screens for now
        >
          <CornerDownLeft className="h-3.5 w-3.5 mr-1.5 text-heartglow-pink/80" /> {/* Added icon */}
          Suggest a Reply
        </button>
      </div>

      {/* ChatGPT-inspired message box with more compact design */}
      <div 
        className={`
          relative rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.1)]
          p-0.5 bg-[#1A1A2E]/90 transition-all duration-200
          ${isFocused ? 'ring-1 ring-heartglow-pink/30' : 'ring-1 ring-[#2A2A40]/50'}
        `}
      >
        <Textarea
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={disabled ? "Select a connection to chat..." : "Message HeartGlow..."}
          rows={1}
          className={`
            w-full resize-none overflow-y-auto z-10
            bg-transparent border-none text-gray-100 placeholder-gray-400/80
            focus-visible:ring-0 focus-visible:ring-offset-0
            min-h-[80px] max-h-[200px] py-2.5 px-3 pr-11
            ${disabled || isSending ? 'opacity-60 cursor-not-allowed' : ''}
          `}
          disabled={disabled || isSending}
        />
        
        {/* Send Button inside the input */}
        <Button
          type="submit"
          size="icon"
          disabled={disabled || isSending || !inputText.trim()}
          className={`
            absolute right-1.5 bottom-1 h-7 w-7 
            rounded-lg z-10 bg-transparent hover:bg-[#252538]
            disabled:bg-transparent
            transition-all duration-200
          `}
          aria-label={isSending ? "Sending..." : "Send message"}
        >
          {isSending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />
          ) : (
            <Send className={`h-3.5 w-3.5 transition-all duration-200 ${inputText.trim() ? 'text-heartglow-pink' : 'text-gray-500'}`} />
          )}
        </Button>
      </div>
    </form>
  );
};

export default MessageInput; 