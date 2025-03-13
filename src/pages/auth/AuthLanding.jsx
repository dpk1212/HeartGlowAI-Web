import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLanding() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex flex-col items-center justify-center p-5 overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute w-40 h-40 rounded-full bg-white/10"
        style={{ top: '10%', right: '5%' }}
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />
      
      <motion.div 
        className="absolute w-60 h-60 rounded-full bg-white/10"
        style={{ bottom: '5%', left: '10%' }}
        animate={{ 
          y: [0, -30, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 7, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <motion.div
        className="w-full max-w-md z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="mb-16 flex flex-col items-center"
          variants={itemVariants}
        >
          <motion.div
            className="w-24 h-24 mb-6 relative"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="2" className="w-12 h-12">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">HeartGlowAI</h1>
          <p className="text-white/80 text-center max-w-xs">Express your feelings with the perfect words</p>
        </motion.div>
        
        <div className="space-y-4">
          <motion.div 
            variants={itemVariants}
          >
            <Link to="/login">
              <motion.button 
                className="w-full py-3.5 px-4 bg-white text-purple-600 font-bold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Log In
              </motion.button>
            </Link>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
          >
            <Link to="/signup">
              <motion.button 
                className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 border border-white/30 transition-all duration-200 flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign Up
              </motion.button>
            </Link>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-10 text-center"
          variants={itemVariants}
        >
          <p className="text-white/70 text-sm">
            By continuing, you agree to our <br />
            <Link to="/terms" className="text-white hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-white hover:underline">Privacy Policy</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
} 