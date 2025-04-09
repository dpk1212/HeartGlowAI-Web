import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    // Check if we're hitting 404 due to path duplication
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('/dashboard/dashboard')) {
        // Redirect to the correct path
        const correctPath = '/dashboard';
        router.replace(correctPath);
        return;
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Head>
        <title>Page Not Found - HeartGlow AI</title>
      </Head>
      
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Not Found</h1>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
} 