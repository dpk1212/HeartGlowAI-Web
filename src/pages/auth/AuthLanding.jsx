import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLanding() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-6" 
         style={{ 
           background: 'linear-gradient(to bottom, #FFC1CC, #B19CD9)',
           fontFamily: "'Poppins', sans-serif"
         }}>
      
      {/* Main content container */}
      <motion.div 
        className="w-full max-w-[350px] flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Heart Icon with glow */}
        <motion.div 
          className="relative w-32 h-32 mb-6"
          animate={{ 
            boxShadow: ['0px 0px 15px 5px rgba(255,193,204,0.5)', '0px 0px 25px 10px rgba(255,193,204,0.7)', '0px 0px 15px 5px rgba(255,193,204,0.5)']
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-lg">
            <defs>
              <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6bcb" />
                <stop offset="100%" stopColor="#B19CD9" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
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
        <h1 className="text-2xl font-bold tracking-widest text-white mb-3 uppercase">
          Heart Glow AI
        </h1>
        
        {/* Tagline */}
        <p className="text-white/80 text-center mb-10 max-w-xs">
          Express your feelings with beautifully crafted messages
        </p>

        {/* Login Button */}
        <motion.div
          className="w-full mb-4"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link 
            to="/login" 
            className="w-full bg-white text-[#B19CD9] font-bold py-3.5 px-4 rounded-lg shadow flex items-center justify-center transition-all duration-200 uppercase tracking-wide"
          >
            Sign In
          </Link>
        </motion.div>

        {/* Sign Up Button */}
        <motion.div
          className="w-full mb-8"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link 
            to="/signup" 
            className="w-full bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold py-3.5 px-4 rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 uppercase tracking-wide"
          >
            Sign Up
          </Link>
        </motion.div>

        {/* Continue as Guest */}
        <Link to="/dashboard" className="text-white/90 hover:text-white underline-offset-2 hover:underline transition-all duration-200">
          Continue as Guest
        </Link>
      </motion.div>

      {/* Animated background hearts */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 15 - 7.5, 0],
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          >
            <svg 
              width={30 + Math.random() * 40} 
              height={30 + Math.random() * 40} 
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