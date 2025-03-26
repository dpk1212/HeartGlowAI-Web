import React, { useState } from 'react';

interface AdditionalContextInputProps {
  onSubmit: (context: string) => void;
}

const AdditionalContextInput: React.FC<AdditionalContextInputProps> = ({ onSubmit }) => {
  const [additionalContext, setAdditionalContext] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(additionalContext);
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-white mb-4">Additional Context</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="additionalContext" className="text-white mb-2 block">
            Tell us anything else that is important to know when creating a reply:
          </label>
          <textarea
            id="additionalContext"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white resize-y"
            rows={4}
            placeholder="Add any additional context here..."
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Save Context
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdditionalContextInput; 