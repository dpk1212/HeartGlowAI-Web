import React from 'react';
import HeartStepsDashboard from '../components/heartsteps/HeartStepsDashboard';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const HeartStepsPage = () => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  // Basic loading and auth check (similar to other pages)
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heartglow-pink"></div>
      </div>
    );
  }

  if (!currentUser) {
    router.push('/login');
    return null; // Render nothing while redirecting
  }

  return (
    // Basic page structure - can be enhanced with a layout later
    <div className=\"min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-heartglow-deepgray dark:to-gray-900 py-16 md:py-24">
       <HeartStepsDashboard />
    </div>
  );
};

export default HeartStepsPage; 