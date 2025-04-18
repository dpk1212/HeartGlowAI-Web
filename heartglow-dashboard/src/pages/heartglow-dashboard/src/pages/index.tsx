import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../../../../context/AuthContext';

const RootIndex = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login, loginWithGoogle, currentUser, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        router.replace('/dashboard');
      }
    }
  }, [currentUser, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);
      await login(email, password);
    } catch (err: any) {
      setError('Failed to sign in: ' + (err.message || 'Unknown error'));
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setIsSubmitting(true);
      await loginWithGoogle();
    } catch (err: any) {
      setError('Failed to sign in with Google: ' + (err.message || 'Unknown error'));
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-heartglow-offwhite dark:bg-heartglow-charcoal">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heartglow-pink"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col justify-center bg-heartglow-offwhite dark:bg-heartglow-charcoal">
        <Head>
          <title>HeartGlow AI | Log In</title>
          <meta name="description" content="HeartGlow AI - Craft messages with emotional intelligence" />
        </Head>

        <div className="w-full max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-heartglow-pink">
              HeartGlow AI
            </h1>
            <p className="mt-2 text-lg text-heartglow-charcoal dark:text-heartglow-offwhite">
              Craft messages with emotional intelligence
            </p>
          </div>

          <div className="login-form bg-white dark:bg-heartglow-deepgray shadow-md rounded-lg p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 
                           bg-white dark:bg-heartglow-deepgray text-gray-900 dark:text-gray-100"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 
                           bg-white dark:bg-heartglow-deepgray text-gray-900 dark:text-gray-100"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="mb-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm 
                           text-white btn-gradient"
                  style={{ background: 'linear-gradient(135deg, #FF4F81, #8C30F5)' }}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            <div>
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-heartglow-deepgray text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm
                           bg-white dark:bg-heartglow-deepgray text-heartglow-charcoal dark:text-heartglow-offwhite hover:bg-gray-50
                           dark:hover:bg-gray-800"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M21.35 11.1H12v3.8h5.3c-.13 1.5-1.4 4.4-5.3 4.4-3.2 0-5.8-2.6-5.8-5.8s2.6-5.8 5.8-5.8c1.8 0 3 .8 3.7 1.5l2.6-2.5C16.45 5.9 14.2 5 12 5 7 5 3 9 3 14s4 9 9 9c5.2 0 8.7-3.7 8.7-8.9 0-.7-.1-1.3-.3-2z"
                      />
                    </svg>
                    <span>Google</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                HeartGlow AI helps you craft meaningful messages for your important relationships.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return null; 
};

export default RootIndex; 