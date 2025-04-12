import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';

import DashboardLayout from '../components/layout/DashboardLayout';
import AuthGuard from '../components/layout/AuthGuard';
import CoachingDashboard from '../components/coaching/CoachingDashboard';

const CoachingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>HeartGlow AI | Coaching</title>
        <meta name="description" content="AI Coaching for better communication - HeartGlow AI" />
      </Head>

      <AuthGuard>
        <DashboardLayout>
          <CoachingDashboard />
        </DashboardLayout>
      </AuthGuard>
    </>
  );
};

export default CoachingPage; 