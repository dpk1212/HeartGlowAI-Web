import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#9370DB] to-[#87CEFA] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-white/10"
        style={{ top: '10%', right: '-10%' }}
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-white/10"
        style={{ bottom: '-10%', left: '-10%' }}
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Logo and Title */}
      <motion.div
        className="flex flex-col items-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Heart Logo with Glow */}
        <motion.div
          className="w-32 h-32 relative mb-6"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            className="absolute inset-0 bg-white rounded-full opacity-20 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-20 h-20"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl font-bold text-white mb-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Heart Glow AI
        </motion.h1>
        <motion.p
          className="text-white/80 text-center text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Express your feelings with perfect words
        </motion.p>
      </motion.div>

      {/* Buttons */}
      <div className="w-full max-w-xs space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="/login"
            className="block w-full bg-white text-[#9370DB] font-semibold py-3.5 px-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Login
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            to="/signup"
            className="block w-full bg-white/10 border border-white/20 text-white font-semibold py-3.5 px-4 rounded-xl text-center hover:bg-white/20 transition-all duration-200"
          >
            Sign Up
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-6"
        >
          <Link
            to="/guest"
            className="text-white/80 hover:text-white transition-colors duration-200"
          >
            Continue as Guest
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 