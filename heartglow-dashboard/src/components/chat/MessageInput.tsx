import React, { useState, useCallback, ChangeEvent, KeyboardEvent, FormEvent, RefObject } from 'react';
// Import shadcn components and icons
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Sparkles, BarChart2, CornerDownLeft } from 'lucide-react'; // Use Send icon

interface MessageInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  inputRef: RefObject<HTMLTextAreaElement>;
  placeholder: string;
  disabled?: boolean;
  isSending?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  value, 
  onChange, 
  onSend, 
  inputRef, 
  placeholder,
  disabled = false, 
  isSending = false 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSend = useCallback(() => {
    if (value.trim() && !disabled && !isSending) {
      onSend();
    }
  }, [value, onSend, disabled, isSending]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleSend();
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative max-w-3xl mx-auto w-full mb-4"
    >
      <div 
        className={`
          relative rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.1)]
          p-0.5 bg-[#1A1A2E]/90 transition-all duration-200
          ${isFocused ? 'ring-1 ring-heartglow-pink/30' : 'ring-1 ring-[#2A2A40]/50'}
        `}
      >
        <Textarea
          ref={inputRef}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
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
        
        <Button
          type="submit"
          size="icon"
          disabled={disabled || isSending || !value.trim()}
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
            <Send className={`h-3.5 w-3.5 transition-all duration-200 ${value.trim() ? 'text-heartglow-pink' : 'text-gray-500'}`} />
          )}
        </Button>
      </div>
    </form>
  );
};

export default MessageInput; 