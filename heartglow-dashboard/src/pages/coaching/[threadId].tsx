import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import DashboardLayout from '../../components/layout/DashboardLayout';
import AuthGuard from '../../components/layout/AuthGuard';
import CoachingChatView from '../../components/coaching/CoachingChatView';

const CoachingThreadPage: NextPage = () => {
  const router = useRouter();
  const { threadId } = router.query; // Extract threadId from the URL query

  // Handle cases where threadId is not yet available or is invalid
  if (!threadId || typeof threadId !== 'string') {
    // Optionally show a loading state or redirect
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="p-6 text-center">
            Loading chat or invalid thread ID...
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <>
      <Head>
        {/* TODO: Fetch thread title and update dynamically */}
        <title>HeartGlow AI | Coaching Chat</title> 
        <meta name="description" content={`AI coaching chat for thread ${threadId}`} />
      </Head>

      <AuthGuard>
        <DashboardLayout>
          {/* Pass the threadId to the Chat View component */}
          {/* Ensure CoachingChatViewProps expects threadId */}
          <CoachingChatView threadId={threadId} /> 
        </DashboardLayout>
      </AuthGuard>
    </>
  );
};

export default CoachingThreadPage; 