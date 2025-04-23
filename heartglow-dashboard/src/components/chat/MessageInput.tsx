import React, { useState, useCallback } from 'react';
// Import shadcn components and icons
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from 'lucide-react'; // Use Send icon

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

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative max-w-3xl mx-auto w-full mb-4"
    >
      {/* Prompt Starter Buttons Container */}
      <div className="flex items-center justify-center space-x-2 mb-2">
        <button 
          type="button" 
          className="bg-card/80 hover:bg-card text-muted-foreground px-3 py-1.5 rounded-full text-sm border border-border/50 transition-colors"
          // onClick={() => {/* Handle suggestion click */}} // Add functionality later
        >
          Help Generate a Message
        </button>
        {/* Add more buttons as needed */}
         <button 
          type="button" 
          className="bg-card/80 hover:bg-card text-muted-foreground px-3 py-1.5 rounded-full text-sm border border-border/50 transition-colors"
        >
          Analyze Dynamics
        </button>
         <button 
          type="button" 
          className="bg-card/80 hover:bg-card text-muted-foreground px-3 py-1.5 rounded-full text-sm border border-border/50 transition-colors hidden sm:inline-flex" // Hide on small screens
        >
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