import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, loginWithGoogle, currentUser } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError('Failed to sign in: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setIsLoading(true);
      await loginWithGoogle();
      router.push('/dashboard');
    } catch (err: any) {
      setError('Failed to sign in with Google: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to add basePath
  const getRouteWithBasePath = (path: string): string => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    return `${basePath}${path}`;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-heartglow-offwhite dark:bg-heartglow-charcoal">
      <Head>
        <title>Login | HeartGlow AI</title>
        <meta name="description" content="Log in to your HeartGlow AI account" />
      </Head>

      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link href={getRouteWithBasePath("/")} className="text-3xl font-bold text-heartglow-pink">
            HeartGlow
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-heartglow-charcoal dark:text-heartglow-offwhite">
            Welcome Back
          </h1>
        </div>

        <div className="bg-white dark:bg-heartglow-deepgray shadow-md rounded-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm 
                           bg-white dark:bg-heartglow-deepgray text-gray-900 dark:text-gray-100 focus:ring-heartglow-pink focus:border-heartglow-pink"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm 
                           bg-white dark:bg-heartglow-deepgray text-gray-900 dark:text-gray-100 focus:ring-heartglow-pink focus:border-heartglow-pink"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
                           text-white bg-gradient-to-r from-heartglow-pink to-heartglow-violet hover:from-heartglow-violet hover:to-heartglow-indigo
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-heartglow-deepgray text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm
                           bg-white dark:bg-heartglow-deepgray text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50
                           dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M21.35 11.1H12v3.8h5.3c-.13 1.5-1.4 4.4-5.3 4.4-3.2 0-5.8-2.6-5.8-5.8s2.6-5.8 5.8-5.8c1.8 0 3 .8 3.7 1.5l2.6-2.5C16.45 5.9 14.2 5 12 5 7 5 3 9 3 14s4 9 9 9c5.2 0 8.7-3.7 8.7-8.9 0-.7-.1-1.3-.3-2z"
                  />
                </svg>
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 