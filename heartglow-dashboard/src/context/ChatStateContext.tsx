import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

interface ChatStateContextProps {
  isSendingMessage: boolean;
  setIsSendingMessage: Dispatch<SetStateAction<boolean>>;
}

// Create context with a default value (can be undefined or a default object)
const ChatStateContext = createContext<ChatStateContextProps | undefined>(undefined);

interface ChatStateProviderProps {
  children: ReactNode;
}

// Create the provider component
export const ChatStateProvider: React.FC<ChatStateProviderProps> = ({ children }) => {
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);

  return (
    <ChatStateContext.Provider value={{ isSendingMessage, setIsSendingMessage }}>
      {children}
    </ChatStateContext.Provider>
  );
};

// Custom hook to use the chat state context
export const useChatState = () => {
  const context = useContext(ChatStateContext);
  if (context === undefined) {
    throw new Error('useChatState must be used within a ChatStateProvider');
  }
  return context;
}; 