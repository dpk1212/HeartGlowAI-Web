import React from 'react';
import { MessageGeneration, MessageInsight } from '../services/advancedMessageGeneration';

interface StructuredMessageDisplayProps {
  messageData: MessageGeneration;
  onSelectMessage: (message: string) => void;
  onRateMessage: (message: string, rating: number) => void;
  onModifyMessage: (message: string, modification: string) => void;
}

const StructuredMessageDisplay: React.FC<StructuredMessageDisplayProps> = ({
  messageData,
  onSelectMessage,
  onRateMessage,
  onModifyMessage
}) => {
  const [selectedMessageIndex, setSelectedMessageIndex] = React.useState<number | null>(null);
  const [userModification, setUserModification] = React.useState<string>('');
  const [showVariations, setShowVariations] = React.useState<boolean>(false);

  // Handler for message selection
  const handleSelectMessage = (index: number) => {
    setSelectedMessageIndex(index);
    onSelectMessage(messageData.messages[index]);
  };

  // Handler for rating a message
  const handleRateMessage = (rating: number) => {
    if (selectedMessageIndex !== null) {
      onRateMessage(messageData.messages[selectedMessageIndex], rating);
    }
  };

  // Handler for submitting user modification
  const handleSubmitModification = () => {
    if (selectedMessageIndex !== null && userModification.trim()) {
      onModifyMessage(messageData.messages[selectedMessageIndex], userModification);
      setUserModification('');
    }
  };

  return (
    <div className="structured-message-display">
      <h2 className="text-xl font-semibold text-white mb-4">Generated Messages</h2>
      
      {/* Message Options */}
      <div className="space-y-4 mb-6">
        {messageData.messages.map((message, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
              selectedMessageIndex === index 
                ? 'border-white bg-white/20' 
                : 'border-white/30 bg-white/10 hover:bg-white/15'
            }`}
            onClick={() => handleSelectMessage(index)}
          >
            <p className="text-white whitespace-pre-wrap">{message}</p>
            
            {selectedMessageIndex === index && (
              <div className="mt-3 pt-3 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleRateMessage(1)}
                      className="p-2 rounded-full hover:bg-red-500/20"
                      title="Not helpful"
                    >
                      👎
                    </button>
                    <button 
                      onClick={() => handleRateMessage(3)}
                      className="p-2 rounded-full hover:bg-yellow-500/20"
                      title="Somewhat helpful"
                    >
                      😐
                    </button>
                    <button 
                      onClick={() => handleRateMessage(5)}
                      className="p-2 rounded-full hover:bg-green-500/20"
                      title="Very helpful"
                    >
                      👍
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setShowVariations(!showVariations)}
                    className="text-sm text-white/80 hover:text-white underline"
                  >
                    {showVariations ? 'Hide Variations' : 'Show Variations'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Message Variations */}
      {selectedMessageIndex !== null && showVariations && messageData.previous_variations && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">Alternative Versions</h3>
          <div className="space-y-2">
            {messageData.previous_variations.map((variation, index) => (
              <div key={index} className="p-3 rounded bg-white/10 border border-white/20">
                <p className="text-white/90 text-sm">{variation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Insights */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Communication Insights</h3>
        {selectedMessageIndex !== null ? (
          <div className="p-4 rounded-lg bg-white/10 border border-white/20">
            <InsightDisplay insight={messageData.insights[selectedMessageIndex]} />
          </div>
        ) : (
          <p className="text-white/70 italic">Select a message to see insights</p>
        )}
      </div>
      
      {/* Message Modification */}
      {selectedMessageIndex !== null && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">Customize Message</h3>
          <textarea
            className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white resize-y"
            rows={4}
            placeholder="Edit this message to better fit your needs..."
            value={userModification || messageData.messages[selectedMessageIndex]}
            onChange={(e) => setUserModification(e.target.value)}
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleSubmitModification}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
              disabled={!userModification.trim()}
            >
              Apply Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for displaying a single insight
const InsightDisplay: React.FC<{ insight: MessageInsight }> = ({ insight }) => (
  <div className="space-y-2 text-white">
    <div className="flex items-center justify-between">
      <span className="font-medium">Communication Strategy:</span>
      <span>{insight.communication_strategy}</span>
    </div>
    
    <div className="flex items-center justify-between">
      <span className="font-medium">Emotional Intelligence:</span>
      <div className="flex items-center">
        <div className="w-32 h-2 bg-white/20 rounded-full mr-2">
          <div 
            className="h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
            style={{ width: `${insight.emotional_intelligence_score * 10}%` }}
          />
        </div>
        <span>{insight.emotional_intelligence_score.toFixed(1)}/10</span>
      </div>
    </div>
    
    <div>
      <span className="font-medium">Potential Impact:</span>
      <p className="mt-1 text-white/90">{insight.potential_impact}</p>
    </div>
  </div>
);

export default StructuredMessageDisplay; 