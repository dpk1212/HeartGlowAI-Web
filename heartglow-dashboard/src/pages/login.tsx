import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, CheckCircle, Users, HeartPulse, LogIn, ExternalLink, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleIcon } from '../components/icons/GoogleIcon';

const Login = () => {
  const [isSigningUp, setIsSigningUp] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const router = useRouter();
  const { login, loginWithGoogle, signup, currentUser, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && currentUser && !currentUser.isAnonymous) {
      console.log('Login Page: Non-anonymous user already logged in, redirecting to /');
      router.replace('/');
    }
  }, [currentUser, authLoading, router]);

  useEffect(() => {
    if (router.isReady) {
      const { reason, mode } = router.query;
      if (reason === 'new_connection') {
        setInfoMessage('Please create a free account or log in to save connections.');
        setIsSigningUp(true);
      } else {
        setInfoMessage('');
      }
      if (mode === 'login') {
          setIsSigningUp(false);
      }
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setIsLoadingGoogle(false);

    if (isSigningUp && !fullName.trim()) {
      setError('Please enter your full name');
      setIsLoading(false);
      return;
    }
    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setIsLoading(false);
        return;
    }

    try {
      if (isSigningUp) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      router.replace('/');
    } catch (err: any) {
      console.error("Auth Error:", err);
      let friendlyMessage = `Failed to ${isSigningUp ? 'sign up' : 'log in'}.`;
      if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'This email is already registered. Try logging in.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyMessage = 'Incorrect email or password.';
      } else if (err.code) {
        friendlyMessage = `Error: ${err.code.replace('auth/', '').replace(/-/g, ' ')}`;
      } else if (err.message) {
          friendlyMessage += ` ${err.message}`;
      }
      setError(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(false);
    setIsLoadingGoogle(true);
    try {
      await loginWithGoogle();
      router.replace('/');
    } catch (err: any) { 
      console.error("Google Sign In Error:", err);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const toggleMode = () => {
    setIsSigningUp(!isSigningUp);
    setFullName('');
    setEmail('');
    setPassword('');
    setError('');
    setInfoMessage('');
  };

  if (authLoading || (currentUser && !currentUser.isAnonymous)) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
            <p className="text-white/70 animate-pulse">Loading...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black text-white font-sans">
      <Head>
        <title>{isSigningUp ? 'Sign Up' : 'Log In'} | HeartGlow AI</title>
        <meta name="description" content={`Access HeartGlow AI to improve your relationship communication with AI coaching and message crafting.`} />
      </Head>

      <header className="absolute top-0 left-0 p-4 sm:p-6 z-10">
           <Link href="/" legacyBehavior>
                <a className="flex items-center space-x-2 opacity-80 hover:opacity-100 transition-opacity">
                  <SparklesIcon className="h-6 w-6 text-purple-300" />
                  <span className="font-medium text-lg text-white">HeartGlow</span>
                </a>
            </Link>
       </header>

      <div className="container mx-auto px-4 py-16 md:py-20 min-h-screen flex items-center">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
            className="text-center md:text-left max-w-lg mx-auto md:mx-0"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-white mb-5 leading-tight tracking-tight">
              Unlock Healthier Communication
            </h1>
            <p className="text-lg text-purple-200/80 mb-8">
              Get AI-powered guidance to express yourself clearly and build stronger connections.
            </p>
            
            <div className="space-y-3 text-purple-200/70 text-sm">
              <p className="flex items-center justify-center md:justify-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>Free to Start & Use</span>
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2.5">
                <Lock className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                <span>Private & Secure Conversations</span>
              </p>
               <p className="flex items-center justify-center md:justify-start gap-2.5">
                 <Users className="w-4 h-4 text-pink-300 flex-shrink-0" />
                <span>For All Your Relationships</span>
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: 0.1 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-xl p-8 sm:p-10 max-w-md mx-auto w-full"
          >
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              {isSigningUp ? 'Create Your Free Account' : 'Welcome Back'}
            </h2>
            
            {infoMessage && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-blue-900/50 border border-blue-700/60 text-blue-200 rounded-md text-sm text-center">
                {infoMessage}
              </motion.div> 
            )}
            {error && ( 
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-red-900/50 border border-red-700/60 text-red-200 rounded-md text-sm text-center">
                {error}
              </motion.div> 
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSigningUp && (
                <div>
                  <label htmlFor="fullName" className="sr-only">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                      <User className="h-4 w-4" />
                    </span>
                    <input 
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Name"
                      required={isSigningUp}
                      className="appearance-none block w-full pl-10 pr-4 py-2.5 border border-white/10 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 bg-white/5 text-white transition duration-200"
                    />
                  </div>
                </div>
              )}
               
              <div>
                <label htmlFor="email" className="sr-only">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input 
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    autoComplete="email"
                    className="appearance-none block w-full pl-10 pr-4 py-2.5 border border-white/10 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 bg-white/5 text-white transition duration-200"
                  />
                </div>
              </div>
                
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input 
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (min. 6 characters)"
                    required
                    autoComplete={isSigningUp ? "new-password" : "current-password"}
                    className="appearance-none block w-full pl-10 pr-4 py-2.5 border border-white/10 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 bg-white/5 text-white transition duration-200"
                  />
                </div>
              </div>
               
              <div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-black transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <> 
                     {isSigningUp ? 'Create Account' : 'Log In'}
                     <ArrowRight className="w-4 h-4 ml-2" />
                    </> 
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white/5 backdrop-blur-lg text-gray-400">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoadingGoogle}
                className="w-full inline-flex items-center justify-center py-2.5 px-4 border border-white/10 rounded-md shadow-sm bg-white/10 hover:bg-white/20 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-black transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoadingGoogle ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <GoogleIcon className="h-5 w-5 mr-3" /> 
                    Continue with Google
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                {isSigningUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button onClick={toggleMode} className="font-medium text-purple-300 hover:text-pink-300 focus:outline-none focus:underline transition">
                  {isSigningUp ? 'Log In' : 'Sign Up Free'}
                </button>
              </p>
            </div>

            <div className="mt-8 text-center text-xs text-gray-500 space-y-1">
                <p className="flex items-center justify-center gap-1.5">
                  <Lock size={12} />
                  <span>Your information is secure & encrypted.</span>
                </p>
                <p className="flex items-center justify-center gap-1.5">
                  <CheckCircle size={12} />
                  <span>No credit card required for free tier.</span>
                </p>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default Login; 