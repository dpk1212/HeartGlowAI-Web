import { useState, useEffect } from 'react';

interface AdvancedData {
  intensity: number;
  customInstructions?: string | null;
}

interface AdvancedStepProps {
  onNext: (data: { advanced: AdvancedData }) => void;
  onBack: () => void;
  initialData?: AdvancedData | null;
}

export default function AdvancedStep({ onNext, onBack, initialData }: AdvancedStepProps) {
  const [intensity, setIntensity] = useState(initialData?.intensity || 3);
  const [customInstructions, setCustomInstructions] = useState(initialData?.customInstructions || '');

  useEffect(() => {
    if (initialData) {
      setIntensity(initialData.intensity || 3);
      setCustomInstructions(initialData.customInstructions || '');
    } else {
      setIntensity(3);
      setCustomInstructions('');
    }
  }, [initialData]);

  const handleNext = () => {
    onNext({
      advanced: {
        intensity,
        customInstructions: customInstructions.trim() || null
      }
    });
  };

  return (
    <div className="space-y-8 dark:text-heartglow-offwhite">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
        Advanced Options
      </h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="intensity-slider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Message Intensity (1-5)
          </label>
          <input
            id="intensity-slider"
            type="range"
            min="1"
            max="5"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-heartglow-pink"
          />
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
            <span>Subtle</span>
            <span>Balanced</span>
            <span>Intense</span>
          </div>
        </div>

        <div>
          <label htmlFor="custom-instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Custom Instructions (Optional)
          </label>
          <textarea
            id="custom-instructions"
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-heartglow-pink focus:border-transparent resize-none dark:bg-heartglow-deepgray dark:text-heartglow-offwhite dark:border-gray-600 dark:placeholder-gray-400"
            rows={4}
            placeholder="e.g., Mention our upcoming trip, Keep it under 50 words..."
          />
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-heartglow-pink hover:bg-heartglow-pink/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink"
        >
          Next
        </button>
      </div>
    </div>
  );
} 