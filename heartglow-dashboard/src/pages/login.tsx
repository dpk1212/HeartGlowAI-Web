import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, MessageSquareText, BrainCircuit, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
      router.replace('/');
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
      router.replace('/');
    } catch (err: any) {
      setError('Failed to sign in with Google: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-heartglow-charcoal dark:to-indigo-900/50 p-4 md:p-8 font-sans">
      <Head>
        <title>Connect Deeper | HeartGlow AI</title>
        <meta name="description" content="Log in or sign up for HeartGlow AI - Communicate better, connect deeper with AI-powered messaging and coaching." />
      </Head>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-6xl bg-white dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden md:grid md:grid-cols-5"
      >
        
        <div className="md:col-span-3 p-8 md:p-12 lg:p-16 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-800/50 dark:to-gray-900/70 order-last md:order-first flex flex-col justify-center">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-heartglow-pink mb-10">
             <HeartPulse className="h-7 w-7" />
             <span className="text-2xl">HeartGlow AI</span>
          </Link>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-5 leading-tight tracking-tight"
          >
            Stop Overthinking, <br /> Start <span className="text-heartglow-pink">Connecting.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-lg"
          >
            Tired of awkward silences or missed connections? HeartGlow uses AI to help you express yourself authentically and build stronger relationships, one message at a time.
          </motion.p>
          
          <div className="space-y-5">
            <motion.div className="flex items-start gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <div className="flex-shrink-0 bg-pink-100 dark:bg-pink-900/30 p-2 rounded-full">
                 <MessageSquareText className="h-5 w-5 text-heartglow-pink" />
              </div>
              <div>
                <h3 className="font-semibold dark:text-white text-gray-800">Craft with Confidence</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">AI generates thoughtful messages tailored to your specific relationship and intent.</p>
              </div>
            </motion.div>
             <motion.div className="flex items-start gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                 <BrainCircuit className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold dark:text-white text-gray-800">Communicate Clearly</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive personalized AI coaching to navigate difficult conversations and improve your skills.</p>
              </div>
            </motion.div>
            <motion.div className="flex items-start gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
               <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full">
                 <Users className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
               </div>
              <div>
                <h3 className="font-semibold dark:text-white text-gray-800">Build Stronger Bonds</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your connections and communicate effectively based on context and history.</p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="md:col-span-2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white dark:bg-gray-900/90 backdrop-blur-sm"
        >
           <h2 className="text-2xl md:text-3xl font-bold text-heartglow-charcoal dark:text-heartglow-offwhite mb-8 text-center">
            Get Started
          </h2>
            
            <div className="w-full max-w-sm mx-auto">
             {error && ( 
               <motion.div 
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="mb-4 p-3 bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700/50 text-red-700 dark:text-red-300 rounded-lg text-sm text-center shadow-sm"
               >
                 {error}
               </motion.div> 
             )}
             <form onSubmit={handleSubmit} className="space-y-5">
               
               <div>
                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                 <input 
                   type="email"
                   id="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="your@email.com"
                   required
                   className="appearance-none block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-heartglow-pink/50 focus:border-heartglow-pink dark:bg-gray-800 dark:text-white transition duration-200"
                 />
               </div>
                
                <div>
                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                 <input 
                   type="password"
                   id="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="••••••••"
                   required
                   className="appearance-none block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-heartglow-pink/50 focus:border-heartglow-pink dark:bg-gray-800 dark:text-white transition duration-200"
                 />
               </div>
               
               <div>
                 <button 
                   type="submit" 
                   disabled={isLoading} 
                   className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-heartglow-pink hover:bg-heartglow-pink/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink dark:focus:ring-offset-gray-900 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                 >
                   {isLoading ? (
                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                   ) : (
                     'Continue with Email'
                   )}
                 </button>
               </div>
             </form>
             
             <div className="mt-6">
               <div className="relative">
                 <div className="absolute inset-0 flex items-center" aria-hidden="true">
                   <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                 </div>
                 <div className="relative flex justify-center text-sm">
                   <span className="px-3 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                     Or
                   </span>
                 </div>
               </div>
               
               <div className="mt-6">
                 <button 
                   type="button" 
                   onClick={handleGoogleSignIn} 
                   disabled={isLoading} 
                   className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-base font-medium text-heartglow-charcoal dark:text-heartglow-offwhite hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                 >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24"> 
                      <path fill="currentColor" d="M21.35 11.1H12v3.8h5.3c-.13 1.5-1.4 4.4-5.3 4.4-3.2 0-5.8-2.6-5.8-5.8s2.6-5.8 5.8-5.8c1.8 0 3 .8 3.7 1.5l2.6-2.5C16.45 5.9 14.2 5 12 5 7 5 3 9 3 14s4 9 9 9c5.2 0 8.7-3.7 8.7-8.9 0-.7-.1-1.3-.3-2z" /> 
                    </svg>
                   <span>Continue with Google</span>
                 </button>
               </div>
             </div>
           </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Login; 