import React from 'react';

interface GlowCoachChatViewProps {
  planInstanceId: string; // Passed in when navigating to this view
}

const GlowCoachChatView = ({ planInstanceId }: GlowCoachChatViewProps) => {
  // TODO: Fetch plan instance, template, thread messages
  // TODO: Implement chat UI, message display, input, action buttons
  console.log(`GlowCoachChatView rendered for instance: ${planInstanceId}`);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
        GlowCoach Chat
      </h2>
      <div className="bg-white dark:bg-heartglow-deepgray p-6 rounded-lg shadow-md min-h-[60vh] flex flex-col dark:text-gray-300">
        {/* Placeholder: Chat messages area */}
        <div className="flex-grow border border-dashed border-gray-400 dark:border-gray-600 p-4 mb-4 rounded-md text-center">
          Chat messages will appear here.
        </div>
        {/* Placeholder: Action buttons */}
        <div className="flex space-x-2 justify-center">
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded">Send</button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded">Edit</button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded">Retry</button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded">Skip</button>
        </div>
      </div>
    </div>
  );
};

export default GlowCoachChatView; 