import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

import DashboardLayout from '../components/layout/DashboardLayout';
import AuthGuard from '../components/layout/AuthGuard';
import HeroSection from '../components/ui/HeroSection';
import QuickTemplateGrid from '../components/ui/QuickTemplateGrid';
import ConnectionsCarousel from '../components/ui/ConnectionsCarousel';
import RecentMessagesList from '../components/ui/RecentMessagesList';
import ComingSoonCard from '../components/ui/ComingSoonCard';

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    // Only redirect to dashboard if we're on the root path AND user is authenticated
    if (router.pathname === '/' && !loading && currentUser) {
      router.push('/dashboard');
    }
  }, [router, currentUser, loading]);

  return (
    <>
      <Head>
        <title>HeartGlow AI | Dashboard</title>
        <meta name="description" content="HeartGlow AI Dashboard - Craft messages with emotional intelligence" />
      </Head>

      <AuthGuard>
        <DashboardLayout>
          <HeroSection />
          <QuickTemplateGrid />
          <ConnectionsCarousel />
          <RecentMessagesList />
          <ComingSoonCard />
        </DashboardLayout>
      </AuthGuard>
    </>
  );
};

export default Dashboard; 