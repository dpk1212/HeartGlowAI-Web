import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, MessageSquareText, BrainCircuit, Users, ArrowRight, CheckCircle, Lock, Mail, User, Quote, MessagesSquare, Edit3, Zap, TrendingUp, Award, RotateCcw, Pencil, Sparkles, CheckCheck, Activity, ShieldCheck, MailWarning, Server, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [isSigningUp, setIsSigningUp] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, loginWithGoogle, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSigningUp && !fullName) {
      setError('Please enter your full name');
      return;
    }
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      if (isSigningUp) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      router.replace('/');
    } catch (err: any) {
      setError(`Failed to ${isSigningUp ? 'sign up' : 'sign in'}: ${err.message || 'Unknown error'}`);
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

  const toggleMode = () => {
    setIsSigningUp(!isSigningUp);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-heartglow-charcoal dark:to-indigo-900/50 font-sans">
      <Head>
        <title>HeartGlow AI | AI Assistant for Thoughtful Communication</title>
        <meta name="description" content="Craft meaningful messages with HeartGlow AI's communication assistant. Connect authentically, navigate tough talks & build stronger relationships." />
        <meta name="keywords" content="AI message generator, communication assistant, emotional intelligence AI, relationship communication, personalized messages, heartfelt messages, thoughtful communication, authentic communication" />
        <meta property="og:title" content="HeartGlow AI: AI Assistant for Thoughtful Communication" />
        <meta property="og:description" content="Craft meaningful messages with HeartGlow AI's communication assistant. Connect authentically, navigate tough talks & build stronger relationships." />
        <meta property="og:image" content="https://heartglowai.com/assets/og-image.png" />
        <meta property="og:url" content="https://heartglowai.com/dashboard/login" />
        <meta property="og:type" content="website" />
      </Head>

      <section className="relative min-h-screen flex items-center justify-center px-4 py-16 md:py-24">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
              Better relationships start with better <span className="text-heartglow-pink">messages.</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto md:mx-0">
              HeartGlow helps you express what matters most — with heartfelt AI-crafted messages, emotional coaching, and connection-building tools.
            </p>
            
            <div className="space-y-3 text-gray-700 dark:text-gray-400 mb-10 text-sm">
              <p className="flex items-center justify-center md:justify-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Free to use. No credit card required.</span>
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2">
                <Lock className="w-4 h-4 text-indigo-400" />
                <span>Data is private and never shared.</span>
              </p>
               <p className="flex items-center justify-center md:justify-start gap-2">
                 <Users className="w-4 h-4 text-purple-400" />
                <span>Works for friends, family, partners, coworkers.</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button 
                onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-gradient-to-r from-heartglow-pink to-heartglow-violet hover:from-heartglow-pink/90 hover:to-heartglow-violet/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink dark:focus:ring-offset-gray-900 transition duration-300 transform hover:scale-105"
              >
                <HeartPulse className="w-5 h-5 mr-2" />
                Get Started Free
              </button>
            </div>
          </motion.div>

          <motion.div 
            id="signup-form"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="bg-white dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-10 lg:p-12 max-w-md mx-auto w-full"
          >
            <h2 className="text-2xl font-bold text-heartglow-charcoal dark:text-heartglow-offwhite mb-6 text-center">
              {isSigningUp ? 'Create your account' : 'Log in to HeartGlow'}
            </h2>
            
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
              {isSigningUp && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <User className="h-4 w-4" />
                    </span>
                    <input 
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Name"
                      required={isSigningUp}
                      className="appearance-none block w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-heartglow-pink/50 focus:border-heartglow-pink dark:bg-gray-800 dark:text-white transition duration-200"
                    />
                  </div>
                </div>
              )}
               
               <div>
                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input 
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="appearance-none block w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-heartglow-pink/50 focus:border-heartglow-pink dark:bg-gray-800 dark:text-white transition duration-200"
                    />
                  </div>
               </div>
                
                <div>
                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input 
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="appearance-none block w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-heartglow-pink/50 focus:border-heartglow-pink dark:bg-gray-800 dark:text-white transition duration-200"
                    />
                 </div>
               </div>
               
               <div>
                 <button 
                   type="submit" 
                   disabled={isLoading} 
                   className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-heartglow-pink hover:bg-heartglow-pink/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink dark:focus:ring-offset-gray-900 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                 >
                   {isLoading ? ( <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> ) : ( isSigningUp ? 'Sign Up Free' : 'Log In' )}
                 </button>
               </div>
             </form>
             
             <div className="mt-5 text-center">
               <button 
                 onClick={toggleMode}
                 className="text-sm font-medium text-heartglow-indigo dark:text-heartglow-pink hover:underline focus:outline-none"
               >
                 {isSigningUp ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
               </button>
             </div>

            <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700/50 text-center space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <p>⚡ No credit card required</p>
              <p>🔐 Your information is secure & encrypted</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Why People Use HeartGlow */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">Why people use HeartGlow</h2>
           <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* Column 1 */} 
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30">
                   <MessageSquareText className="w-8 h-8 text-heartglow-pink" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">When you don't know what to say</h3>
                <p className="text-gray-600 dark:text-gray-400">Say what's on your heart — without overthinking it.</p>
              </motion.div>
              {/* Column 2 */} 
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }} className="text-center">
                 <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30">
                   <Users className="w-8 h-8 text-indigo-500" />
                 </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">When you want to reconnect or repair</h3>
                <p className="text-gray-600 dark:text-gray-400">Craft gentle, thoughtful messages — even after time apart.</p>
              </motion.div>
              {/* Column 3 */} 
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }} className="text-center">
                 <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/30 dark:to-green-900/30">
                   <BrainCircuit className="w-8 h-8 text-teal-500" /> 
                 </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">When you want to grow emotionally</h3>
                <p className="text-gray-600 dark:text-gray-400">Use guided coaching, weekly habits, and emotional reflections.</p>
              </motion.div>
           </div>
        </div>
      </section>

      {/* Section 3: Testimonials */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-heartglow-deepgray">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">What people might say after using HeartGlow:</h2>
           <div className="max-w-3xl mx-auto space-y-10">
              {/* Quote 1 */} 
              <motion.blockquote 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="relative p-6 bg-white dark:bg-gray-800/50 rounded-lg shadow-md border-l-4 border-heartglow-pink"
              >
                <Quote className="absolute top-0 left-0 w-10 h-10 text-heartglow-pink/20 dark:text-heartglow-pink/30 transform -translate-x-4 -translate-y-4" aria-hidden="true" />
                <p className="text-lg italic text-gray-700 dark:text-gray-200 mb-3">
                   "I didn't just send one message — I started showing up better, over time."
                </p>
                <footer className="text-sm text-gray-500 dark:text-gray-400">
                  — From a user reconnecting with their mom
                </footer>
              </motion.blockquote>

              {/* Quote 2 */} 
              <motion.blockquote 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative p-6 bg-white dark:bg-gray-800/50 rounded-lg shadow-md border-l-4 border-indigo-400"
              >
                 <MessagesSquare className="absolute top-0 left-0 w-10 h-10 text-indigo-400/20 dark:text-indigo-400/30 transform -translate-x-4 -translate-y-4" aria-hidden="true" />
                <p className="text-lg italic text-gray-700 dark:text-gray-200 mb-3">
                  "I stopped ghosting when things got hard. Now I actually respond with care."
                </p>
                <footer className="text-sm text-gray-500 dark:text-gray-400">
                  — After using the coaching feature
                </footer>
              </motion.blockquote>
              
              {/* Quote 3 */} 
              <motion.blockquote 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="relative p-6 bg-white dark:bg-gray-800/50 rounded-lg shadow-md border-l-4 border-teal-400"
              >
                 <HeartPulse className="absolute top-0 left-0 w-10 h-10 text-teal-400/20 dark:text-teal-400/30 transform -translate-x-4 -translate-y-4" aria-hidden="true" />
                <p className="text-lg italic text-gray-700 dark:text-gray-200 mb-3">
                  "The apology it helped me write probably saved my relationship."
                </p>
                <footer className="text-sm text-gray-500 dark:text-gray-400">
                  — A dad messaging his adult kids
                </footer>
              </motion.blockquote>
           </div>

            {/* Privacy Note */} 
            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/30 p-4 rounded-lg max-w-2xl mx-auto flex items-center justify-center gap-2"
            >
               <Lock size={16} className="flex-shrink-0 text-indigo-400" />
               <span><strong>Note:</strong> These are real emotional use cases. Messages stored securely in your private account and never shared.</span>
            </motion.div>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
         <div className="container mx-auto px-4">
           <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">How HeartGlow Works</h2>
           <div className="max-w-3xl mx-auto space-y-10 relative">
             {/* Connecting Line (optional decorative element) */} 
             <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-heartglow-pink via-purple-400 to-indigo-400 hidden md:block" aria-hidden="true"></div>

             {/* Step 1 */} 
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.5, delay: 0.1 }}
               viewport={{ once: true }}
               className="relative pl-16 md:pl-20"
             >
               <div className="absolute left-0 top-0 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/40 dark:to-purple-900/40 text-heartglow-pink shadow-lg ring-4 ring-white dark:ring-gray-900">
                 <span className="absolute text-xs font-bold -top-2 -right-2 bg-heartglow-pink text-white rounded-full w-5 h-5 flex items-center justify-center">1</span>
                 <Edit3 className="w-7 h-7" />
               </div>
               <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Start a message</h3>
               <p className="text-gray-600 dark:text-gray-400">Choose your intent: reconnect, thank, apologize, support, or reflect.</p>
             </motion.div>

             {/* Step 2 */} 
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.5, delay: 0.2 }}
               viewport={{ once: true }}
               className="relative pl-16 md:pl-20"
             >
                <div className="absolute left-0 top-0 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 text-indigo-500 shadow-lg ring-4 ring-white dark:ring-gray-900">
                 <span className="absolute text-xs font-bold -top-2 -right-2 bg-indigo-500 text-white rounded-full w-5 h-5 flex items-center justify-center">2</span>
                 <Zap className="w-7 h-7" />
               </div>
               <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Get AI-crafted words</h3>
               <p className="text-gray-600 dark:text-gray-400">Receive a beautiful message, tailored to your tone and relationship.</p>
             </motion.div>

             {/* Step 3 */} 
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.5, delay: 0.3 }}
               viewport={{ once: true }}
               className="relative pl-16 md:pl-20"
             >
                <div className="absolute left-0 top-0 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/40 dark:to-green-900/40 text-teal-500 shadow-lg ring-4 ring-white dark:ring-gray-900">
                  <span className="absolute text-xs font-bold -top-2 -right-2 bg-teal-500 text-white rounded-full w-5 h-5 flex items-center justify-center">3</span>
                 <Award className="w-7 h-7" />
               </div>
               <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Build connection habits</h3>
               <p className="text-gray-600 dark:text-gray-400">Join weekly challenges, earn XP, and stay emotionally consistent.</p>
             </motion.div>

             {/* Step 4 */} 
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.5, delay: 0.4 }}
               viewport={{ once: true }}
               className="relative pl-16 md:pl-20"
             >
                <div className="absolute left-0 top-0 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40 text-yellow-500 shadow-lg ring-4 ring-white dark:ring-gray-900">
                 <span className="absolute text-xs font-bold -top-2 -right-2 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center">4</span>
                 <TrendingUp className="w-7 h-7" />
               </div>
               <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Track your emotional growth</h3>
               <p className="text-gray-600 dark:text-gray-400">Use GlowScore to see your connection progress over time.</p>
             </motion.div>
           </div>
        </div>
      </section>

      {/* Section 5: HeartGlow Is For... */}
       <section className="py-16 md:py-24 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-950 dark:via-heartglow-charcoal dark:to-indigo-900/50">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">HeartGlow is for you if you want to...</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
              {/* Card 1 */} 
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800/60 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/40 dark:to-purple-900/40">
                  <RotateCcw className="w-7 h-7 text-heartglow-pink" />
                </div>
                <p className="font-medium text-gray-700 dark:text-gray-200">Reconnect after silence</p>
              </motion.div>
              {/* Card 2 */} 
              <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.4, delay: 0.15 }}
                 viewport={{ once: true }}
                 className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800/60 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40">
                  <Pencil className="w-7 h-7 text-indigo-500" />
                </div>
                <p className="font-medium text-gray-700 dark:text-gray-200">Say something you've been holding back</p>
              </motion.div>
              {/* Card 3 */} 
              <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.4, delay: 0.2 }}
                 viewport={{ once: true }}
                 className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800/60 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/40 dark:to-green-900/40">
                  <Sparkles className="w-7 h-7 text-teal-500" />
                </div>
                <p className="font-medium text-gray-700 dark:text-gray-200">Improve how you express care</p>
              </motion.div>
              {/* Card 4 */} 
              <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.4, delay: 0.25 }}
                 viewport={{ once: true }}
                 className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800/60 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40">
                  <CheckCheck className="w-7 h-7 text-yellow-500" />
                </div>
                <p className="font-medium text-gray-700 dark:text-gray-200">Check in without feeling awkward</p>
              </motion.div>
              {/* Card 5 */} 
              <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.4, delay: 0.3 }}
                 viewport={{ once: true }}
                 className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800/60 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/40 dark:to-pink-900/40">
                   <Activity className="w-7 h-7 text-red-500" />
                </div>
                <p className="font-medium text-gray-700 dark:text-gray-200">Leave a legacy of love and words</p>
              </motion.div>
           </div>
        </div>
      </section>

      {/* Section 6: Trust & Privacy */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-heartglow-deepgray">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">Built for privacy. Designed for care.</h2>
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {/* Trust Point 1 */} 
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800/50 rounded-lg shadow"
              >
                <ShieldCheck className="w-8 h-8 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">No credit card required to start</span>
              </motion.div>
              {/* Trust Point 2 */} 
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800/50 rounded-lg shadow"
              >
                 <MailWarning className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                 <span className="text-gray-700 dark:text-gray-300">No spam or marketing emails</span>
              </motion.div>
              {/* Trust Point 3 */} 
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800/50 rounded-lg shadow"
              >
                 <Lock className="w-8 h-8 text-indigo-500 flex-shrink-0" />
                 <span className="text-gray-700 dark:text-gray-300">Your messages are stored securely in your private account.</span>
              </motion.div>
              {/* Trust Point 4 */} 
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800/50 rounded-lg shadow"
              >
                 <Server className="w-8 h-8 text-blue-500 flex-shrink-0" />
                 <span className="text-gray-700 dark:text-gray-300">Fully encrypted + secure cloud infrastructure</span>
              </motion.div>
           </div>
        </div>
      </section>

      {/* Section 7: Footer CTA */}
       <section className="py-16 md:py-24 bg-gradient-to-r from-heartglow-pink to-heartglow-violet text-white">
        <div className="container mx-auto text-center px-4">
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
             viewport={{ once: true }}
             className="text-3xl md:text-4xl font-bold mb-8 max-w-2xl mx-auto"
            >
              Start building better relationships — one message at a time.
            </motion.h2>
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.1 }}
             viewport={{ once: true }} 
             className="flex flex-col items-center gap-4"
            >
              <button 
                onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-medium rounded-lg shadow-lg text-heartglow-pink bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white dark:focus:ring-offset-gray-900 transition duration-300 transform hover:scale-105"
              >
                <HeartPulse className="w-6 h-6 mr-2" />
                Start for Free
              </button>
              <p className="text-sm text-pink-100/80 flex items-center gap-1.5">
                <Rocket className="w-4 h-4" />
                 🚀 It takes 60 seconds. No pressure. All heart.
              </p>
           </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Login; 