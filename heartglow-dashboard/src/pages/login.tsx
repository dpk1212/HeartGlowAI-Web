import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, MessageSquareText, BrainCircuit, Users } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();

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
      router.replace('/dashboard');
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
      router.replace('/dashboard');
    } catch (err: any) {
      setError('Failed to sign in with Google: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-900/30 p-4 md:p-8">
      <Head>
        <title>Login or Sign Up | HeartGlow AI</title>
        <meta name="description" content="Log in or sign up for HeartGlow AI to improve your communication and relationships." />
      </Head>

      <div className="container mx-auto max-w-6xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden md:grid md:grid-cols-2">
        
        <div className="p-8 md:p-12 lg:p-16 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900/50 order-last md:order-first">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-heartglow-pink mb-8">
             <HeartPulse className="h-6 w-6" />
             <span>HeartGlow AI</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            Say What Matters. <span className="text-heartglow-pink">Gently.</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Stop overthinking. Start connecting. HeartGlow helps you craft authentic messages and offers personalized coaching.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MessageSquareText className="h-5 w-5 text-heartglow-pink mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold dark:text-white">AI Message Crafting</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Generate thoughtful messages tailored to your relationships.</p>
              </div>
            </div>
             <div className="flex items-start gap-3">
              <BrainCircuit className="h-5 w-5 text-heartglow-pink mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold dark:text-white">Personalized Coaching</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Improve communication with AI-driven feedback.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-heartglow-pink mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold dark:text-white">Relationship Context</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage connections and tailor communication effectively.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
           <h2 className="text-2xl font-bold text-heartglow-charcoal dark:text-heartglow-offwhite mb-6 text-center">
            Log In or Sign Up
          </h2>
          <div className="login-form">
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
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
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-heartglow-pink focus:border-heartglow-pink"
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
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-heartglow-pink focus:border-heartglow-pink"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="mb-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-heartglow-pink hover:bg-heartglow-pink/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink transition duration-300 disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Continue with Email'}
                </button>
              </div>
            </form>

            <div>
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                    Or
                  </span>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-heartglow-charcoal dark:text-heartglow-offwhite hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 disabled:opacity-50"
                >
                   <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"> <path fill="currentColor" d="M21.35 11.1H12v3.8h5.3c-.13 1.5-1.4 4.4-5.3 4.4-3.2 0-5.8-2.6-5.8-5.8s2.6-5.8 5.8-5.8c1.8 0 3 .8 3.7 1.5l2.6-2.5C16.45 5.9 14.2 5 12 5 7 5 3 9 3 14s4 9 9 9c5.2 0 8.7-3.7 8.7-8.9 0-.7-.1-1.3-.3-2z" /> </svg>
                  <span>Continue with Google</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login; 