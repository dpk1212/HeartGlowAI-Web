import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
// import { useEffect } from 'react'; // Removed
// import { useAuth } from '../context/AuthContext'; // Removed

import DashboardLayout from '../components/layout/DashboardLayout';
import AuthGuard from '../components/layout/AuthGuard';
import HeroSection from '../components/ui/HeroSection';
import QuickTemplateGrid from '../components/ui/QuickTemplateGrid';
import ConnectionsCarousel from '../components/ui/ConnectionsCarousel';
import RecentMessagesList from '../components/ui/RecentMessagesList';
import ComingSoonCard from '../components/ui/ComingSoonCard';
import CoachingEntryCard from '../components/ui/CoachingEntryCard';

// Renamed back to Dashboard or keep IndexPage if preferred
const IndexPage: NextPage = () => {
  const router = useRouter(); // Keep router if needed elsewhere, otherwise remove
  // Removed useAuth hook call and useEffect for redirect

  // Render the Dashboard content directly behind AuthGuard
  return (
    <>
      <Head>
        <title>HeartGlow AI | Dashboard</title>
        <meta name="description" content="HeartGlow AI Dashboard - Craft messages with emotional intelligence" />
      </Head>

      <AuthGuard>
        <DashboardLayout>
          <HeroSection />
          {/* Removed the separate div for CoachingEntryCard */}
          {/* 
          <div className="mt-8 mb-8">
             <CoachingEntryCard />
          </div> 
          */}
          
          {/* Reverted Grid Layout - Coaching Card moved inside and made full width */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"> 
             {/* Coaching Card spans full width on medium screens */}
             <div className="md:col-span-2">
               <CoachingEntryCard />
             </div>

             <QuickTemplateGrid /> 
             {/* CoachingEntryCard removed from here */}
             <ConnectionsCarousel />
             <ComingSoonCard />
             <div className="md:col-span-2">
               <RecentMessagesList />
             </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    </>
  );
};

export default IndexPage; 