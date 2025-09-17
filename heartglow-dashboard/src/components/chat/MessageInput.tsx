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
      className="relative max-w-4xl mx-auto w-full"
    >
      {/* Inspiring message above input */}
      {!value.trim() && !isFocused && (
        <div className="text-center mb-4 opacity-80">
          <p className="text-sm text-white/60 font-medium">
            ✨ Share what's on your mind — every conversation matters
          </p>
        </div>
      )}
      
      <div 
        className={`
          relative rounded-2xl shadow-2xl backdrop-blur-xl transition-all duration-300 transform
          bg-gradient-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50 border
          ${isFocused 
            ? 'ring-2 ring-violet-400/50 border-violet-400/30 shadow-violet-500/20 scale-[1.02]' 
            : 'ring-1 ring-white/10 border-white/10 hover:border-white/20'
          }
        `}
      >
        {/* Enhanced background elements */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent"></div>
          {isFocused && (
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/10 to-violet-500/5 animate-pulse"></div>
          )}
        </div>
        
        <div className="relative z-10 flex items-end space-x-3 p-4">
          {/* User avatar in input */}
          <div className="flex-shrink-0 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md ring-2 ring-violet-400/20">
              <div className="w-4 h-4 bg-white/90 rounded-full"></div>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <Textarea
              ref={inputRef}
              value={value}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isFocused ? "Type your message..." : placeholder}
              rows={1}
              className={`
                w-full resize-none overflow-y-auto bg-transparent border-none 
                text-white placeholder-white/50 text-base font-medium
                focus-visible:ring-0 focus-visible:ring-offset-0
                min-h-[40px] max-h-[120px] py-2 px-0 leading-relaxed
                ${disabled || isSending ? 'opacity-60 cursor-not-allowed' : ''}
              `}
              disabled={disabled || isSending}
            />
            
            {/* Character count for longer messages */}
            {value.length > 100 && (
              <div className="absolute -bottom-5 right-0 text-xs text-white/40">
                {value.length} characters
              </div>
            )}
          </div>
        
          {/* Enhanced send button */}
          <div className="flex-shrink-0 mb-1">
            <Button
              type="submit"
              size="icon"
              disabled={disabled || isSending || !value.trim()}
              className={`
                h-10 w-10 rounded-xl transition-all duration-300 transform
                ${value.trim() && !disabled && !isSending
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg hover:shadow-xl hover:scale-110 ring-2 ring-violet-400/30'
                  : 'bg-white/10 hover:bg-white/20 border border-white/20'
                }
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              `}
              aria-label={isSending ? "Sending..." : "Send message"}
            >
              {isSending ? (
                <div className="relative">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                  <div className="absolute inset-0 animate-ping">
                    <div className="w-5 h-5 rounded-full bg-violet-400/20"></div>
                  </div>
                </div>
              ) : (
                <Send className={`h-5 w-5 transition-all duration-200 ${
                  value.trim() ? 'text-white' : 'text-white/50'
                }`} />
              )}
            </Button>
          </div>
        </div>
        
        {/* Quick action suggestions */}
        {!value.trim() && isFocused && (
          <div className="px-4 pb-3">
            <div className="flex flex-wrap gap-2">
              {['Ask for advice', 'Share feelings', 'Need help with...'].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onChange({ target: { value: suggestion + ' ' } } as any)}
                  className="px-3 py-1.5 text-xs font-medium text-white/70 bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default MessageInput; 