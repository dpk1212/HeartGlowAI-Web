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
    <div className="min-h-screen bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600 flex flex-col items-center justify-center p-5 overflow-hidden">
      <motion.div
        className="w-full max-w-md z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* App Logo and Name */}
        <motion.div 
          className="mb-12 flex flex-col items-center"
          variants={itemVariants}
        >
          <motion.div
            className="w-32 h-32 mb-6 relative"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Heart outline logo */}
            <motion.div className="w-full h-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-full h-full">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>
            
            {/* Animated coins */}
            <motion.div 
              className="absolute w-6 h-6 bg-yellow-300 rounded-full"
              style={{ top: '15%', right: '15%' }}
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
            
            <motion.div 
              className="absolute w-4 h-4 bg-yellow-400 rounded-full"
              style={{ top: '35%', right: '10%' }}
              animate={{ 
                y: [0, -8, 0],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wider text-center">HEARTGLOW</h1>
        </motion.div>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.div 
            variants={itemVariants}
          >
            <Link to="/login">
              <motion.button 
                className="w-full py-4 px-4 bg-white text-blue-600 font-bold rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-200 flex items-center justify-center text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                LOG IN
              </motion.button>
            </Link>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="text-center mt-6"
          >
            <p className="text-white/90">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-white hover:underline">
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Version tag */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-4 text-white/70 text-xs"
      >
        v1.0.0
      </motion.div>
    </div>
  );
} 