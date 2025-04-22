import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AuthGuard from '../../components/layout/AuthGuard';
// Import the chat view component (we'll adapt CoachingChatView next)
import CoachingChatView from '../../components/coaching/CoachingChatView'; 
// TODO: Rename CoachingChatView import path after adapting the component

const ConnectionChatPage: React.FC = () => {
  const router = useRouter();
  const { connectionId } = router.query;

  // Basic validation/loading for connectionId
  if (router.isFallback || !connectionId || typeof connectionId !== 'string') {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">Loading chat...</div>
      </DashboardLayout>
    );
  }

  // TODO: Add logic here to verify if the connectionId is valid for the current user
  // (e.g., fetch connection data and check ownership, redirect if invalid)
  // For now, we proceed assuming the ID is valid.

  return (
    <>
      <Head>
        {/* TODO: Fetch connection name and set a dynamic title */}
        <title>Chat | HeartGlow AI</title>
        <meta name="description" content="Engage in a coaching conversation or draft messages." />
      </Head>
      <AuthGuard>
        <DashboardLayout>
          {/* Render the chat view, passing the connectionId */}
          {/* We will adapt CoachingChatView in the next step */}
          <CoachingChatView threadId={connectionId} /> 
          {/* TODO: Change prop name from threadId to connectionId in CoachingChatView */}
        </DashboardLayout>
      </AuthGuard>
    </>
  );
};

export default ConnectionChatPage; 