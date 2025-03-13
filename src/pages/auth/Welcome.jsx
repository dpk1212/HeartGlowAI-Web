import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating hearts background */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${i % 3 === 0 ? 'bg-pink-400/20' : i % 3 === 1 ? 'bg-purple-400/15' : 'bg-indigo-400/10'}`}
            style={{
              width: `${Math.random() * 12 + 4}rem`,
              height: `${Math.random() * 12 + 4}rem`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -80 - 20, 0],
              scale: [1, Math.random() * 0.3 + 1, 1],
              opacity: [0.2, Math.random() * 0.3 + 0.4, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Title */}
        <motion.div
          className="flex flex-col items-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Heart Logo with Glow */}
          <motion.div
            className="w-36 h-36 relative mb-8"
            whileHover={{ scale: 1.05 }}
          >
            {/* Heart beat animation */}
            <motion.div
              className="absolute inset-0 bg-pink-500 rounded-full opacity-20 blur-xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Outer glow */}
            <motion.div
              className="absolute inset-0 rounded-full blur-xl"
              style={{
                background: "radial-gradient(circle, rgba(244,114,182,0.8) 0%, rgba(167,139,250,0.3) 70%, rgba(0,0,0,0) 100%)"
              }}
              animate={{
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Heart icon with gradient */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 relative overflow-visible">
                <svg
                  viewBox="0 0 24 24"
                  className="w-full h-full drop-shadow-lg"
                >
                  <defs>
                    <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff6bcb" />
                      <stop offset="50%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#d946ef" />
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <path 
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                    fill="url(#heartGradient)"
                    filter="url(#glow)"
                  />
                </svg>
                
                {/* Pulse effect */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 0.5
                  }}
                >
                  <div className="w-full h-full rounded-full border-4 border-pink-400/50" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
              Heart Glow AI
            </h1>
            <p className="text-white/90 text-lg">
              Find the perfect words for every emotion
            </p>
          </motion.div>
        </motion.div>

        {/* Buttons Container */}
        <motion.div 
          className="space-y-4 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/login"
              className="block w-full bg-white text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold py-4 px-6 rounded-xl text-center shadow-lg border border-white/20 backdrop-blur-sm bg-white/10 hover:shadow-pink-500/20 hover:shadow-2xl transition-all duration-300"
            >
              <span className="text-lg bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Login</span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/signup"
              className="block w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-6 rounded-xl text-center shadow-lg hover:shadow-pink-500/40 hover:shadow-xl transition-all duration-300"
            >
              <span className="text-lg">Sign Up</span>
            </Link>
          </motion.div>

          <motion.div
            className="text-center mt-8"
            whileHover={{ scale: 1.05 }}
          >
            <Link
              to="/guest"
              className="text-white/80 hover:text-white inline-flex items-center transition-colors duration-200 text-sm font-medium group"
            >
              <span>Continue as Guest</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 