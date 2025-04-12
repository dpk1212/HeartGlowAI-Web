import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import DashboardLayout from '../../components/layout/DashboardLayout';
import AuthGuard from '../../components/layout/AuthGuard';
import StartCoachingChat from '../../components/coaching/StartCoachingChat';

const StartCoachingPage: NextPage = () => {
  const router = useRouter();

  // Function to handle closing/cancelling the start chat process
  const handleClose = () => {
    router.push('/coaching'); // Navigate back to the main coaching dashboard
  };

  return (
    <>
      <Head>
        <title>HeartGlow AI | Start Coaching Chat</title>
        <meta name="description" content="Select a connection to start an AI coaching chat." />
      </Head>

      <AuthGuard>
        <DashboardLayout>
          <div className="max-w-2xl mx-auto py-8">
            {/* Render the component responsible for selection and starting */}
            <StartCoachingChat onClose={handleClose} />
          </div>
        </DashboardLayout>
      </AuthGuard>
    </>
  );
};

export default StartCoachingPage; 