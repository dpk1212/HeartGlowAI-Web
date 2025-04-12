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
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            
            <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
              <QuickTemplateGrid />
            </div>

            <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
              <CoachingEntryCard />
            </div>
            
            <div className="md:col-span-2 lg:col-span-2 xl:col-span-3">
              <ConnectionsCarousel />
            </div>

            <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
              <ComingSoonCard />
            </div>

            <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 mt-4">
              <RecentMessagesList />
            </div>

          </div>
        </DashboardLayout>
      </AuthGuard>
    </>
  );
};

export default Dashboard; 