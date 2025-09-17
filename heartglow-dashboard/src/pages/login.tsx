import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, CheckCircle, Users, HeartPulse, LogIn, ExternalLink, ArrowRight, SparklesIcon } from 'lucide-react';
import { motion } from 'framer-motion';

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
      } else if (reason === 'usage_limit') {
        setInfoMessage('🎉 Ready to unlock unlimited access? Create your free account and continue your relationship journey!');
        setIsSigningUp(true);
      } else {
        setInfoMessage('');
      }
      if (mode === 'login') {
          setIsSigningUp(false);
      } else if (mode === 'signup') {
          setIsSigningUp(true);
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
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center w-full">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
            className="text-center md:text-left max-w-lg mx-auto md:mx-0 flex flex-col items-center md:items-start"
          >
            <div className="mb-8 md:mb-10 w-28 h-28 md:w-36 md:h-36 flex-shrink-0 mx-auto md:mx-0 flex items-center justify-center">
              <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                  <linearGradient id="heartglow-gradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#A78BFA" />
                    <stop offset="1" stop-color="#F472B6" />
                  </linearGradient>
                </defs>
                <path d="M60 102s-34-22.5-34-46.5C26 41.5 41.5 34 52 44.5c4.5 4.5 8 8.5 8 8.5s3.5-4 8-8.5C78.5 34 94 41.5 94 55.5c0 24-34 46.5-34 46.5z" fill="url(#heartglow-gradient)" stroke="#fff" stroke-width="3"/>
                <g>
                  <circle cx="30" cy="30" r="3" fill="#F472B6"/>
                  <circle cx="90" cy="32" r="2.5" fill="#A78BFA"/>
                  <rect x="60" y="18" width="2.5" height="8" rx="1.25" fill="#F472B6"/>
                  <rect x="60" y="18" width="8" height="2.5" rx="1.25" fill="#F472B6"/>
                  <rect x="25" y="60" width="2" height="6" rx="1" fill="#A78BFA"/>
                  <rect x="25" y="60" width="6" height="2" rx="1" fill="#A78BFA"/>
                </g>
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-white mb-3 leading-tight tracking-tight">
              Unlock Clarity. Free.
            </h1>
            <p className="text-lg text-purple-200/90 mb-6">
              Instant guidance for your hardest conversations.
            </p>
            {isSigningUp && (
              <div className="w-full max-w-md mx-auto md:mx-0 bg-white/10 border border-white/10 rounded-2xl shadow-lg p-6 space-y-3 mb-8">
                <p className="flex items-center gap-2.5 text-purple-100 text-base">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Free AI conversation guides</span>
                </p>
                <p className="flex items-center gap-2.5 text-purple-100 text-base">
                  <Lock className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                  <span>Private & encrypted</span>
                </p>
                <p className="flex items-center gap-2.5 text-purple-100 text-base">
                  <HeartPulse className="w-4 h-4 text-pink-400 flex-shrink-0" />
                  <span>Real-life coaching tools</span>
                </p>
                <p className="flex items-center gap-2.5 text-purple-100 text-base">
                  <SparklesIcon className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <span>No credit card needed</span>
                </p>
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: 0.1 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8 sm:p-10 max-w-md mx-auto w-full flex flex-col"
          >
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              {isSigningUp ? 'Create Free Account' : 'Log In to Your Account'}
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
                  disabled={isLoading || isLoadingGoogle}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-950 transition duration-150 ease-in-out disabled:opacity-60 text-lg mb-1"
                >
                  {isLoading && !isLoadingGoogle ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (isSigningUp ? 'Create Free Account' : 'Log In')}
                </button>
                {isSigningUp && (
                  <div className="text-xs text-purple-200/80 text-center mt-1 mb-2">No payment required</div>
                )}
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900/0 text-gray-400 backdrop-blur-sm">Or</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading || isLoadingGoogle}
                  className="w-full flex items-center justify-center py-2.5 px-4 border border-white/20 rounded-md shadow-sm bg-white/10 hover:bg-white/20 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-950 transition duration-150 ease-in-out disabled:opacity-60"
                >
                  {isLoadingGoogle ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span className="mr-3 flex items-center">
                        <svg width="20" height="20" viewBox="0 0 20 20">
                          <g>
                            <path fill="#4285F4" d="M19.6 10.23c0-.68-.06-1.36-.17-2H10v3.77h5.48a4.68 4.68 0 01-2.03 3.07v2.55h3.28c1.92-1.77 3.03-4.38 3.03-7.39z"/>
                            <path fill="#34A853" d="M10 20c2.7 0 4.96-.9 6.61-2.44l-3.28-2.55c-.91.61-2.07.97-3.33.97-2.56 0-4.73-1.73-5.5-4.07H1.1v2.56A9.99 9.99 0 0010 20z"/>
                            <path fill="#FBBC05" d="M4.5 12.91A5.99 5.99 0 014 10c0-.5.07-.99.18-1.46V5.98H1.1A9.99 9.99 0 000 10c0 1.64.39 3.19 1.1 4.56l3.4-2.65z"/>
                            <path fill="#EA4335" d="M10 4.04c1.47 0 2.78.51 3.81 1.51l2.86-2.86C14.96 1.09 12.7 0 10 0A9.99 9.99 0 001.1 5.98l3.4 2.56C5.27 5.77 7.44 4.04 10 4.04z"/>
                          </g>
                        </svg>
                      </span>
                      {isSigningUp ? "Sign Up Free with Google (Fastest Way)" : "Continue with Google"}
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">
                {isSigningUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button onClick={toggleMode} className="font-medium text-pink-400 hover:text-pink-300 focus:outline-none focus:underline transition ease-in-out duration-150">
                  {isSigningUp ? 'Log In' : 'Sign Up Free'}
                </button>
              </p>
            </div>

            <div className="mt-6 text-xs text-purple-200/70 text-center">
              Your data is encrypted.
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default Login; 