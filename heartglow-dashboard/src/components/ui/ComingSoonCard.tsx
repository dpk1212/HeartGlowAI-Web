import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Gradient animation keyframes
const gradientVariants = {
  initial: {
    backgroundPosition: '0% 50%',
  },
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 15,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

// Pulse animation variants
const pulseVariants = {
  initial: { scale: 1, opacity: 0.5 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 3,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

// Text highlight animation
const highlightVariants = {
  initial: { color: '#FFFFFF' },
  animate: {
    color: ['#FFFFFF', '#FF4F81', '#FFFFFF'],
    transition: {
      duration: 5,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 5,
    },
  },
};

const ComingSoonCard: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="bg-gradient-to-br from-heartglow-charcoal to-heartglow-deepgray text-white p-8 rounded-xl shadow-lg mb-12 relative overflow-hidden border border-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
        y: -5,
        transition: { duration: 0.3 }
      }}
    >
      {/* Animated background gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-heartglow-pink/5 via-heartglow-violet/5 to-heartglow-indigo/5"
        initial="initial"
        animate="animate"
        variants={gradientVariants}
      />
      
      {/* Decorative elements with animation */}
      <motion.div 
        className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-heartglow-pink/10 to-heartglow-violet/10 rounded-full -mr-32 -mt-32"
        variants={pulseVariants}
        initial="initial"
        animate="animate"
      />
      <motion.div 
        className="absolute -bottom-16 -left-16 w-64 h-64 bg-gradient-to-tr from-heartglow-indigo/10 to-heartglow-violet/10 rounded-full"
        variants={pulseVariants}
        initial="initial"
        animate="animate"
        style={{ animationDelay: '1s' }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center mb-6">
          <motion.div 
            className="w-12 h-12 bg-gradient-to-br from-heartglow-pink/20 to-heartglow-violet/20 rounded-lg flex items-center justify-center mr-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-heartglow-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-heartglow-offwhite to-heartglow-pink bg-clip-text text-transparent">
            Coming Soon: "<motion.span 
              variants={highlightVariants}
              initial="initial"
              animate="animate"
              className="font-extrabold"
            >Feel This For Me</motion.span>"
          </h2>
        </div>
        
        <motion.p 
          className="text-gray-300 mb-8 ml-16 leading-relaxed"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          Send anonymous emotional requests to your connections, letting them respond with heartfelt messages when you need them most.
        </motion.p>
        
        <div className="ml-16 flex flex-wrap gap-3">
          <motion.div 
            className="text-sm font-medium bg-heartglow-indigo/20 border border-heartglow-indigo/30 px-4 py-2 rounded-full flex items-center"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(99, 102, 241, 0.3)' }}
          >
            <motion.span 
              className="w-2 h-2 bg-heartglow-pink rounded-full mr-2"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            In Development
          </motion.div>
          
          <motion.div 
            className="text-sm font-medium bg-heartglow-deepgray/40 px-4 py-2 rounded-full border border-gray-700"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(46, 46, 50, 0.6)' }}
          >
            Available in Premium Plan
          </motion.div>
        </div>
        
        {/* Call to action that appears on hover */}
        <motion.div
          className="ml-16 mt-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            height: isHovered ? 'auto' : 0,
            marginTop: isHovered ? 24 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <button className="text-sm font-medium bg-gradient-to-r from-heartglow-pink to-heartglow-violet px-4 py-2 rounded-full text-white shadow-lg hover:shadow-glow transition-all duration-300">
            Get notified when available
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ComingSoonCard; 