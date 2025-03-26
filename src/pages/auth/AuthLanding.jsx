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
        {/* Enhanced Heart Icon with more realistic beat animation */}
        <motion.div 
          className="mb-6"
          style={{
            width: '80px',
            height: '80px',
            position: 'relative',
            filter: 'drop-shadow(0 0 8px rgba(255,193,204,0.7))',
            border: debug ? '1px solid red' : 'none'
          }}
          animate={{ 
            scale: [1, 1.08, 0.95, 1.15, 1], // More realistic heartbeat pattern
            filter: [
              'drop-shadow(0 0 8px rgba(255,193,204,0.4))',
              'drop-shadow(0 0 15px rgba(255,193,204,0.8))',
              'drop-shadow(0 0 10px rgba(255,193,204,0.6))',
              'drop-shadow(0 0 18px rgba(255,193,204,0.9))',
              'drop-shadow(0 0 8px rgba(255,193,204,0.4))'
            ]
          }}
          transition={{ 
            duration: 1.8,
            repeat: Infinity,
            ease: [0.17, 0.67, 0.83, 0.67], // Custom easing for heartbeat feel
            times: [0, 0.2, 0.35, 0.5, 1] // Timing for more realistic beat
          }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <defs>
              <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6bcb" />
                <stop offset="50%" stopColor="#fc8cc0" />
                <stop offset="100%" stopColor="#B19CD9" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="innerShadow">
                <feOffset dx="0" dy="1" />
                <feGaussianBlur stdDeviation="1" result="offset-blur" />
                <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                <feFlood flood-color="rgba(0,0,0,0.2)" flood-opacity="1" result="color" />
                <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                <feComposite operator="over" in="shadow" in2="SourceGraphic" /> 
              </filter>
            </defs>
            <path 
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
              fill="url(#heartGradient)"
              filter="url(#glow)"
            />
            {/* Add a subtle inner shape for depth */}
            <path 
              d="M12 19.35l-1.05-0.92C7.2 14.96 5 12.78 5 10.5 5 8.42 6.42 7 8.5 7c1.14 0 2.41.81 3.5 2.09C13.09 7.81 14.36 7 15.5 7 17.58 7 19 8.42 19 10.5c0 2.28-2.2 4.46-5.95 7.93L12 19.35z" 
              fill="rgba(255,255,255,0.2)"
              filter="url(#innerShadow)"
            />
          </svg>
          
          {/* Add light particles around the heart */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: 2 + Math.random() * 2 + 'px',
                height: 2 + Math.random() * 2 + 'px',
                top: 10 + Math.random() * 60 + '%',
                left: 10 + Math.random() * 60 + '%',
                opacity: 0
              }}
              animate={{
                opacity: [0, 0.7, 0],
                y: [0, -10 - Math.random() * 20],
                x: [0, Math.random() * 10 - 5]
              }}
              transition={{
                duration: 1.5 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
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
              onClick={() => console.log("Sign In button clicked")}
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
              onClick={() => console.log("Sign Up button clicked")}
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

      {/* Enhanced floating hearts background with more variety */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Small hearts with various animations */}
        {[...Array(18)].map((_, i) => {
          // Create more variety in the hearts
          const size = 10 + Math.random() * 20;
          const isLarger = Math.random() > 0.7;
          const hasGlow = Math.random() > 0.7;
          const baseOpacity = 0.1 + Math.random() * 0.15;
          
          return (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${10 + Math.random() * 80}%`, // Better distribution across screen
                top: `${10 + Math.random() * 80}%`,
                opacity: baseOpacity,
                filter: hasGlow ? 'drop-shadow(0 0 2px rgba(255,255,255,0.7))' : 'none',
              }}
              animate={{
                y: [0, -20 - Math.random() * 30, 0], // More varied movement
                x: [0, Math.random() * 15 - 7.5, 0],
                opacity: [baseOpacity, baseOpacity * 1.5, baseOpacity],
                rotate: Math.random() > 0.5 ? [0, 10, 0] : [0, -10, 0], // Some hearts rotate slightly
              }}
              transition={{
                duration: 4 + Math.random() * 6, // Varied durations
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5, // More staggered appearance
              }}
            >
              <svg 
                width={size} 
                height={size} 
                viewBox="0 0 24 24"
              >
                <path 
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                  fill={isLarger ? "rgba(255,107,203,0.3)" : "white"} // Add some pink hearts
                />
              </svg>
            </motion.div>
          );
        })}
        
        {/* Add a few larger, very faint hearts for depth */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`large-${i}`}
            className="absolute"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              opacity: 0.05,
              transform: 'scale(1.5)',
            }}
            animate={{
              y: [0, -5, 0],
              scale: [1.5, 1.65, 1.5],
              opacity: [0.05, 0.07, 0.05],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          >
            <svg 
              width={30 + Math.random() * 20} 
              height={30 + Math.random() * 20} 
              viewBox="0 0 24 24"
            >
              <path 
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                fill="rgba(255,107,203,0.4)"
              />
            </svg>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 