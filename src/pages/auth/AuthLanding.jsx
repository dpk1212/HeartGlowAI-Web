import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLanding() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-6 bg-heart-gradient"> 
      {/* Main content container - fixed width with better sizing */}
      <div className="w-full max-w-[320px] sm:max-w-[380px] mx-auto">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Heart Icon with controlled size */}
          <motion.div 
            className="relative w-20 h-20 mb-5"
            animate={{ 
              boxShadow: ['0px 0px 15px 5px rgba(255,193,204,0.3)', '0px 0px 20px 8px rgba(255,193,204,0.5)', '0px 0px 15px 5px rgba(255,193,204,0.3)']
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff6bcb" />
                  <stop offset="100%" stopColor="#B19CD9" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <path 
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                fill="url(#heartGradient)"
                filter="url(#glow)"
              />
            </svg>
          </motion.div>

          {/* Brand name */}
          <h1 className="text-2xl font-bold tracking-wider text-white mb-2 uppercase">
            Heart Glow AI
          </h1>
          
          {/* Tagline */}
          <p className="text-white/80 text-center mb-8 text-sm">
            Express your feelings with beautifully crafted messages
          </p>

          {/* Buttons Container - Tighter spacing */}
          <div className="w-full space-y-3">
            {/* Login Button */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                to="/login" 
                className="w-full bg-white text-[#B19CD9] font-bold py-3 px-4 rounded-lg shadow flex items-center justify-center transition-all duration-200 text-sm uppercase tracking-wide"
              >
                Sign In
              </Link>
            </motion.div>

            {/* Sign Up Button */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                to="/signup" 
                className="w-full bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold py-3 px-4 rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 text-sm uppercase tracking-wide"
              >
                Sign Up
              </Link>
            </motion.div>
          </div>

          {/* Continue as Guest - Better spacing */}
          <Link to="/dashboard" className="text-white/90 hover:text-white underline-offset-2 hover:underline transition-all duration-200 text-sm mt-7">
            Continue as Guest
          </Link>
        </motion.div>
      </div>

      {/* Simplified background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-20"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -15, 0],
              x: [0, Math.random() * 8 - 4, 0],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          >
            <svg 
              width={20 + Math.random() * 20} 
              height={20 + Math.random() * 20} 
              viewBox="0 0 24 24"
            >
              <path 
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                fill="white"
              />
            </svg>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 