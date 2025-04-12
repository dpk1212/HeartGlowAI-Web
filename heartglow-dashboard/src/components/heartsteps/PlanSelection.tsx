import React from 'react';

const PlanSelection = () => {
  // TODO: Fetch and display HeartStepPlanTemplates
  console.log('PlanSelection rendered');

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Choose a HeartStep Plan
      </h2>
      {/* Placeholder: List of plans */}
      <div className="border border-dashed border-gray-400 dark:border-gray-600 p-4 rounded-md text-center text-gray-500 dark:text-gray-400">
        Plan templates will be listed here.
      </div>
    </div>
  );
};

export default PlanSelection; 