import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from './_app';
import { getRouteWithBasePath } from './_app';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push(getRouteWithBasePath('/dashboard'));
      } else {
        router.push(getRouteWithBasePath('/login'));
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Head>
        <title>HeartGlow AI</title>
        <meta name="description" content="Say what matters. Gently." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-center">
        <div className="animate-pulse">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-heartglow-pink to-heartglow-violet">
            HeartGlow AI
          </h1>
          <p className="mt-2 text-heartglow-charcoal dark:text-heartglow-offwhite">
            Loading your emotional dashboard...
          </p>
        </div>
      </main>
    </div>
  );
} 