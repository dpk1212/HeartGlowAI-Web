import React from 'react';

interface CoachingChatViewProps {
  // Props will likely include threadId or similar
}

const CoachingChatView: React.FC<CoachingChatViewProps> = (props) => {
  return (
    <div>
      <h2>Coaching Chat View</h2>
      {/* Chat messages and input area will go here */}
      <p>Placeholder for chat messages and input for thread: {JSON.stringify(props)}</p>
    </div>
  );
};

export default CoachingChatView; 