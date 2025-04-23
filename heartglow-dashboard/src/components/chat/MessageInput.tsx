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
      className={`
        flex items-end space-x-3 relative transition-all duration-200
        ${isFocused ? 'transform scale-[1.01]' : ''}
      `}
    >
      {/* Subtle glow when focused */}
      {isFocused && (
        <div className="absolute inset-0 -m-1 rounded-xl bg-heartglow-pink/5 blur-md pointer-events-none"></div>
      )}
      
      <Textarea
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={disabled ? "Select a connection to chat..." : "Type your message..."}
        rows={1}
        className={`
          flex-1 resize-none overflow-y-auto z-10
          bg-[#1A1A2E]/80 border-[#2A2A40]/60 text-gray-100 placeholder-gray-400/80
          hover:border-[#3A3A5C]/80 focus:border-heartglow-pink/30 transition-all duration-200
          focus-visible:ring-1 focus-visible:ring-heartglow-pink/30 focus-visible:ring-offset-0
          min-h-[45px] max-h-[150px] rounded-xl shadow-inner backdrop-blur-sm
          ${disabled || isSending ? 'opacity-60 cursor-not-allowed' : ''}
        `}
        disabled={disabled || isSending}
      />
      
      {/* Send Button with enhanced styling */}
      <Button
        type="submit"
        size="icon"
        disabled={disabled || isSending || !inputText.trim()}
        className={`
          h-[45px] w-[45px] flex-shrink-0 rounded-full z-10
          ${isFocused || inputText.trim() 
            ? 'bg-gradient-to-br from-heartglow-pink to-heartglow-violet shadow-lg hover:opacity-90 hover:shadow-xl' 
            : 'bg-[#2A2A40]/80 hover:bg-[#2A2A40]'}
          disabled:bg-gray-700/40 disabled:text-gray-500
          transition-all duration-300 ease-out
          ${isFocused && inputText.trim() ? 'transform scale-[1.05]' : ''}
        `}
        aria-label={isSending ? "Sending..." : "Send message"}
      >
        {isSending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className={`h-5 w-5 transition-transform duration-200 ${inputText.trim() ? 'transform rotate-0' : 'rotate-[-45deg] opacity-70'}`} />
        )}
      </Button>
    </form>
  );
};

export default MessageInput; 