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
    // Simplified wrapper, relying on component focus styles
    <form onSubmit={handleSubmit} className="flex items-end space-x-2">
      <Textarea
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? "Select a connection to chat..." : "Type your message..."}
        rows={1}
        className={`
          flex-1 resize-none overflow-y-auto 
          bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400
          focus-visible:ring-1 focus-visible:ring-pink-500 focus-visible:ring-offset-0 
          min-h-[40px] max-h-[150px] {/* Set min/max height */} 
          ${disabled || isSending ? 'opacity-60 cursor-not-allowed' : ''}
        `}
        disabled={disabled || isSending}
      />
      <Button
        type="submit" // Use submit type with the form
        size="icon"
        disabled={disabled || isSending || !inputText.trim()}
        className="h-10 w-10 flex-shrink-0 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600/50"
        aria-label={isSending ? "Sending..." : "Send message"}
      >
        {isSending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
};

export default MessageInput; 