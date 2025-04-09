import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, signInWithGoogle } from '../lib/auth';
import { getRouteWithBasePath } from './_app';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await signIn(email, password);
      router.push(getRouteWithBasePath('/dashboard'));
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setError('');
      await signInWithGoogle();
      router.push(getRouteWithBasePath('/dashboard'));
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-heartglow-offwhite dark:bg-heartglow-charcoal p-4">
      <Head>
        <title>Login - HeartGlow AI</title>
        <meta name="description" content="Login to HeartGlow AI to craft heartfelt messages" />
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
          <h2 className="text-2xl font-medium mb-6">Welcome back</h2>
          
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
            
            <div className="mb-6">
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
            
            <button
              type="submit"
              disabled={loading}
              className="heartglow-button w-full"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-heartglow-softgray dark:bg-heartglow-deepgray"></div>
              <span className="px-3 text-sm text-heartglow-midgray">or</span>
              <div className="flex-grow h-px bg-heartglow-softgray dark:bg-heartglow-deepgray"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full p-3 flex justify-center items-center border border-heartglow-softgray dark:border-heartglow-deepgray rounded-lg hover:bg-gray-50 dark:hover:bg-heartglow-deepgray/50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {googleLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>
            
            <p className="mt-4 text-center text-sm">
              Don't have an account?{' '}
              <Link href={getRouteWithBasePath('/signup')} className="text-heartglow-indigo hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
} 