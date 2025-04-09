import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signUp } from '../lib/auth';
import { getRouteWithBasePath } from './_app';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      setError('Please fill out all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await signUp(email, password);
      router.push(getRouteWithBasePath('/dashboard'));
    } catch (error: any) {
      setError(error.message || 'Failed to sign up');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-heartglow-offwhite dark:bg-heartglow-charcoal p-4">
      <Head>
        <title>Sign Up - HeartGlow AI</title>
        <meta name="description" content="Join HeartGlow AI to craft heartfelt messages" />
      </Head>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-heartglow-pink to-heartglow-violet">
            HeartGlow AI
          </h1>
          <p className="mt-2 text-heartglow-charcoal dark:text-heartglow-offwhite">
            Say what matters. Gently.
          </p>
        </div>

        <div className="card">
          <h2 className="text-2xl font-medium mb-6">Create your account</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-heartglow-error rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-heartglow-softgray dark:border-heartglow-deepgray rounded-lg focus:outline-none focus:ring-2 focus:ring-heartglow-indigo bg-white dark:bg-heartglow-deepgray"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-heartglow-softgray dark:border-heartglow-deepgray rounded-lg focus:outline-none focus:ring-2 focus:ring-heartglow-indigo bg-white dark:bg-heartglow-deepgray"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-heartglow-softgray dark:border-heartglow-deepgray rounded-lg focus:outline-none focus:ring-2 focus:ring-heartglow-indigo bg-white dark:bg-heartglow-deepgray"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="heartglow-button w-full"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
            
            <p className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href={getRouteWithBasePath('/login')} className="text-heartglow-indigo hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
} 