import React, { useState, useCallback } from 'react';

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
    <div className="flex items-center space-x-3">
      <textarea
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? "Select a connection first..." : "Type your message..."}
        rows={1} // Start with one row
        className={`
          flex-1 p-3 rounded-lg bg-gray-700 border border-gray-600 
          text-gray-100 resize-none overflow-y-auto 
          focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200
          placeholder-gray-500
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        style={{ maxHeight: '120px' }} // Limit max height to prevent excessive expansion
        disabled={disabled || isSending}
      />
      <button
        onClick={handleSend}
        disabled={disabled || isSending || !inputText.trim()}
        className={`
          p-3 rounded-lg transition duration-200 ease-in-out
          flex items-center justify-center
          w-11 h-11
          ${(!disabled && !isSending && inputText.trim())
            ? 'bg-pink-500 hover:bg-pink-600 text-white'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-500
        `}
      >
        {isSending ? (
          // Simple spinner for sending state
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          // Send Icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default MessageInput; 