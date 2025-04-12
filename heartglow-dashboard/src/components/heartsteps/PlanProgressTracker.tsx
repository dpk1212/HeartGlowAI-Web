import React from 'react';

interface PlanProgressTrackerProps {
  planInstance: any; // TODO: Use HeartStepPlanInstance type
}

const PlanProgressTracker = ({ planInstance }: PlanProgressTrackerProps) => {
  // TODO: Implement progress display (bar, calendar, etc.)
  console.log('PlanProgressTracker rendered');

  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
        Plan Progress
      </h3>
      {/* Placeholder: Progress visualization */}
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-full">
        <div 
          className="h-full bg-heartglow-pink rounded-full"
          style={{ width: '25%' }} // Example: 25% progress
        ></div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-right">
        Day X of Y
      </p>
    </div>
  );
};

export default PlanProgressTracker; 