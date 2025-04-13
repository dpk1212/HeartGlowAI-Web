import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { HeartPulse } from 'lucide-react'; // Example icon

// Simple Header for Landing Page
const LandingHeader = () => (
  <header className="bg-white dark:bg-gray-900 shadow-sm py-4">
    <nav className="container mx-auto px-6 flex justify-between items-center">
      <Link href="/landing" className="flex items-center gap-2 text-xl font-bold text-heartglow-pink">
        <HeartPulse className="h-6 w-6" />
        <span>HeartGlow AI</span>
      </Link>
      <div>
        <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-heartglow-pink dark:hover:text-heartglow-pink mr-4">
          Login
        </Link>
        {/* Assuming login handles both login and signup for now */}
        <Link href="/login" className="bg-heartglow-pink hover:bg-heartglow-pink/90 text-white font-medium py-2 px-4 rounded-md transition duration-300">
          Sign Up
        </Link>
      </div>
    </nav>
  </header>
);

// Simple Footer for Landing Page
const LandingFooter = () => (
  <footer className="bg-gray-100 dark:bg-gray-800 py-6 mt-16">
    <div className="container mx-auto px-6 text-center text-gray-600 dark:text-gray-400 text-sm">
      &copy; {new Date().getFullYear()} HeartGlow AI. All rights reserved.
      {/* Add links to privacy/terms if needed */}
    </div>
  </footer>
);


const LandingPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>HeartGlow AI - Communicate Better, Connect Deeper</title>
        <meta name="description" content="Craft heartfelt messages and improve your relationships with AI-powered communication coaching." />
        {/* Add Favicon links here later if needed */}
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <LandingHeader />

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="py-20 md:py-32 text-center bg-gradient-to-b from-white dark:from-gray-900 to-gray-100 dark:to-gray-800/30">
            <div className="container mx-auto px-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                Say What Matters. <span className="text-heartglow-pink">Gently.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Stop overthinking. Start connecting. HeartGlow AI helps you craft authentic messages and offers personalized coaching to strengthen your relationships.
              </p>
              <Link href="/login" className="bg-heartglow-pink hover:bg-heartglow-pink/90 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 shadow-md hover:shadow-lg">
                Get Started Free
              </Link>
            </div>
          </section>

          {/* Features/Benefits Section (Placeholder) */}
          <section className="py-16">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">Why HeartGlow?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 Placeholder */}
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-2 dark:text-white">AI Message Crafting</h3>
                  <p className="text-gray-600 dark:text-gray-400">Generate thoughtful messages tailored to your specific relationship and situation.</p>
                </div>
                {/* Feature 2 Placeholder */}
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                   <h3 className="text-xl font-semibold mb-2 dark:text-white">Personalized Coaching</h3>
                  <p className="text-gray-600 dark:text-gray-400">Receive AI-driven feedback and guidance to improve your communication skills.</p>
                </div>
                {/* Feature 3 Placeholder */}
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-2 dark:text-white">Relationship Context</h3>
                  <p className="text-gray-600 dark:text-gray-400">Keep track of connections and tailor communication based on relationship history.</p>
                </div>
              </div>
            </div>
          </section>

           {/* Final CTA Section */}
           <section className="py-16 bg-gray-100 dark:bg-gray-900/50">
             <div className="container mx-auto px-6 text-center">
               <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Ready to Connect Deeper?</h2>
               <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                 Start using HeartGlow AI today and build stronger, more meaningful relationships.
               </p>
               <Link href="/login" className="bg-heartglow-pink hover:bg-heartglow-pink/90 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 shadow-md hover:shadow-lg">
                 Sign Up - It's Free!
               </Link>
             </div>
           </section>
        </main>

        <LandingFooter />
      </div>
    </>
  );
};

export default LandingPage; 