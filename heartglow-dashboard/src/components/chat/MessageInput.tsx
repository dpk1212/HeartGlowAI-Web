import React, { useState, useCallback } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/solid'; // Using solid icon

interface MessageInputProps {
  onSend: (messageText: string) => void;
  disabled?: boolean; // Optional prop to disable input
  isSending?: boolean; // Optional prop to show sending state
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled = false, isSending = false }) => {
  const [inputText, setInputText] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const handleSend = useCallback(() => {
    const textToSend = inputText.trim();
    if (textToSend && !disabled && !isSending) {
      onSend(textToSend);
      setInputText(''); // Clear input after sending
    }
  }, [inputText, onSend, disabled, isSending]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter press (but not Shift+Enter)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default newline behavior
      handleSend();
    }
  };

  return (
    // Group input and button with padding and background
    <div className="flex items-end space-x-2 p-1.5 rounded-xl bg-gray-700 border border-gray-600 focus-within:ring-2 focus-within:ring-pink-500 focus-within:border-transparent transition-all duration-200">
      <textarea
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? "Select a connection first..." : "Type your message..."}
        rows={1}
        className={`
          flex-1 p-2.5 rounded-lg bg-transparent border-none {/* Make textarea transparent, rely on parent bg */}
          text-gray-100 resize-none overflow-y-auto 
          focus:outline-none focus:ring-0 {/* Remove default ring, parent handles it */}
          placeholder-gray-400
          ${disabled || isSending ? 'opacity-60 cursor-not-allowed' : ''} {/* Adjusted disabled style */}
        `}
        style={{ maxHeight: '120px' }} // Limit max height
        disabled={disabled || isSending}
      />
      <button
        onClick={handleSend}
        disabled={disabled || isSending || !inputText.trim()}
        className={`
          p-2.5 rounded-lg transition duration-200 ease-in-out
          flex items-center justify-center
          self-end {/* Align button to bottom when textarea grows */}
          h-10 w-10 {/* Consistent size */}
          ${(!disabled && !isSending && inputText.trim())
            ? 'bg-pink-500 hover:bg-pink-600 text-white'
            : 'bg-gray-600/50 text-gray-400 cursor-not-allowed' // Softer disabled bg
          }
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-700 focus:ring-pink-500 {/* Adjusted offset color */}
        `}
        aria-label={isSending ? "Sending..." : "Send message"}
      >
        {isSending ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          // Using Heroicon
          <PaperAirplaneIcon className="h-5 w-5 transform rotate-[90deg]" />
        )}
      </button>
    </div>
  );
};

export default MessageInput; 