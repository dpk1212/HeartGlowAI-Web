import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function AuthLanding() {
  // Add debug mode to see container boundaries
  const [debug, setDebug] = useState(false);
  
  // Toggle debug mode with D key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'd' || e.key === 'D') {
        setDebug(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    // Main container - full screen with flex centering
    <div 
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to bottom, #ec4899, #a855f7, #6366f1)',
        overflow: 'hidden',
        position: 'relative',
        padding: '0'
      }}
    > 
      {/* Content container with fixed width and debug border */}
      <div
        style={{
          width: '100%',
          maxWidth: '270px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          border: debug ? '1px solid yellow' : 'none'
        }}
      >
        {/* Heart Icon */}
        <motion.div 
          className="w-20 h-20 mb-6"
          animate={{ 
            scale: [1, 1.05, 1],
            boxShadow: ['0px 0px 15px 5px rgba(255,193,204,0.2)', '0px 0px 20px 8px rgba(255,193,204,0.4)', '0px 0px 15px 5px rgba(255,193,204,0.2)']
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            border: debug ? '1px solid red' : 'none'
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
        <h1 
          style={{
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            letterSpacing: '0.05em', 
            color: 'white', 
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            textAlign: 'center',
            width: '100%',
            border: debug ? '1px solid green' : 'none'
          }}
        >
          Heart Glow AI
        </h1>
        
        {/* Tagline */}
        <p 
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: '0.875rem',
            width: '100%',
            border: debug ? '1px solid blue' : 'none'
          }}
        >
          Express your feelings with beautifully crafted messages
        </p>

        {/* Buttons container with strict width control */}
        <div 
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            border: debug ? '1px solid purple' : 'none'
          }}
        >
          {/* Sign In Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              border: debug ? '1px solid cyan' : 'none'
            }}
          >
            <Link 
              to="/login" 
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'center',
                padding: '0.75rem 1.5rem',
                borderRadius: '1rem',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                fontWeight: '600',
                fontSize: '1rem',
                letterSpacing: '0.025em',
                transition: 'all 200ms',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
            >
              Sign In
            </Link>
          </motion.div>

          {/* Sign Up Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              border: debug ? '1px solid orange' : 'none'
            }}
          >
            <Link 
              to="/signup" 
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'center',
                padding: '0.75rem 1.5rem',
                borderRadius: '1rem',
                background: 'linear-gradient(to right, #ff6bcb, #B19CD9)',
                color: 'white',
                fontWeight: '700',
                fontSize: '1rem',
                letterSpacing: '0.025em',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                transition: 'all 200ms',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
              }}
            >
              Sign Up
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Background floating hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-20"
            style={{
              left: `${30 + Math.random() * 40}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -15, 0],
              x: [0, Math.random() * 10 - 5, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          >
            <svg 
              width={15 + Math.random() * 15} 
              height={15 + Math.random() * 15} 
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