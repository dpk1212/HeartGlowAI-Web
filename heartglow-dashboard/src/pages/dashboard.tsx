import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './_app';
import { getRouteWithBasePath } from './_app';
import AuthGuard from '../components/AuthGuard';
import Layout from '../components/Layout';
import ConnectionsCarousel from '../components/ConnectionsCarousel';
import RecentMessagesList from '../components/RecentMessagesList';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Path normalization - fixes redirect loops
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('/dashboard/dashboard')) {
        router.replace('/dashboard');
        return;
      }
    }

    // Auth protection
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-heartglow-pink to-heartglow-violet">
            HeartGlow AI
          </h1>
          <p className="mt-2 text-center">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const handleStartNewMessage = () => {
    router.push(getRouteWithBasePath('/create'));
  };
  
  return (
    <AuthGuard>
      <Layout title="Dashboard | HeartGlow AI">
        {/* HeroSection */}
        <section className="mb-12">
          <div className="card p-8 text-center">
            <h2 className="text-3xl font-medium mb-4">Say what matters. Gently.</h2>
            <p className="text-heartglow-deepgray dark:text-heartglow-softgray mb-6 max-w-2xl mx-auto">
              Craft AI-powered messages for tough conversations. Reconnect, apologize, or open up — without overthinking it.
            </p>
            <button 
              className="heartglow-button animate-pulse-subtle"
              onClick={handleStartNewMessage}
            >
              Start a New Message
            </button>
          </div>
        </section>
        
        {/* QuickTemplateGrid */}
        <section className="mb-12">
          <h2 className="text-2xl font-medium mb-4">Quick Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Reconnect', 'Thank You', 'Apologize', 'Support', 'Celebrate', 'Request'].map((template) => (
              <div 
                key={template} 
                className="card hover:shadow-glow transition-shadow duration-300 cursor-pointer"
                onClick={() => router.push(getRouteWithBasePath(`/create?template=${template.toLowerCase()}`))}
              >
                <h3 className="text-lg font-medium mb-2">{template}</h3>
                <p className="text-sm text-heartglow-deepgray dark:text-heartglow-softgray">
                  Ready-made template to help you {template.toLowerCase()} with care.
                </p>
              </div>
            ))}
          </div>
        </section>
        
        {/* ConnectionsCarousel */}
        <ConnectionsCarousel />
        
        {/* RecentMessagesList */}
        <RecentMessagesList />
        
        {/* ComingSoonCard */}
        <section className="mb-12">
          <div className="card p-8 bg-gradient-to-r from-heartglow-charcoal to-heartglow-deepgray text-heartglow-offwhite">
            <h2 className="text-2xl font-medium mb-4">Coming Soon: "Feel This For Me"</h2>
            <p className="mb-6">
              Send anonymous emotional requests to your connections, letting them respond with heartfelt messages when you need them most.
            </p>
            <div className="bg-heartglow-deepgray/30 p-4 rounded-lg inline-block">
              <span className="text-sm">Available in Premium Plan</span>
            </div>
          </div>
        </section>
      </Layout>
    </AuthGuard>
  );
} 