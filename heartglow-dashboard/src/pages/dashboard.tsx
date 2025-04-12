import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';

import DashboardLayout from '../components/layout/DashboardLayout';
import AuthGuard from '../components/layout/AuthGuard';
import HeroSection from '../components/ui/HeroSection';
import QuickTemplateGrid from '../components/ui/QuickTemplateGrid';
import ConnectionsCarousel from '../components/ui/ConnectionsCarousel';
import RecentMessagesList from '../components/ui/RecentMessagesList';
import ComingSoonCard from '../components/ui/ComingSoonCard';
import CoachingEntryCard from '../components/ui/CoachingEntryCard';

const Dashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>HeartGlow AI | Dashboard</title>
        <meta name="description" content="HeartGlow AI Dashboard - Craft messages with emotional intelligence" />
      </Head>

      <AuthGuard>
        <DashboardLayout>
          <HeroSection />

          {/* Simplified Grid Layout for testing */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Place items simply, let grid wrap them */}
            <QuickTemplateGrid />
            <CoachingEntryCard />
            <ConnectionsCarousel />
            <ComingSoonCard />
            {/* Recent Messages might need col-span-2 if we want it full width */}
            <div className="md:col-span-2">
              <RecentMessagesList />
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    </>
  );
};

export default Dashboard; 