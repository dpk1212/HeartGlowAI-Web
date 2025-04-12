import React from 'react';

const HeartStepsDashboard = () => {
  // TODO: Fetch user's active plan instances or show plan selection
  console.log('HeartStepsDashboard rendered');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Your HeartSteps
      </h1>
      {/* Placeholder: List active plans or show PlanSelection component */}
      <div className="bg-white dark:bg-heartglow-deepgray p-6 rounded-lg shadow-md text-center dark:text-gray-300">
        <p>HeartSteps Dashboard Placeholder</p>
        <p>Active plans will be shown here, or an option to start a new plan.</p>
        {/* <PlanSelection /> */}
      </div>
    </div>
  );
};

export default HeartStepsDashboard; 