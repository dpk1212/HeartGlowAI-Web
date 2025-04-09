/**
 * Animation variants for Framer Motion
 * These help maintain consistency across the application
 */

// Standard container variant for staggered children
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Standard item variant for vertical reveal
export const itemVariantsY = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

// Standard item variant for horizontal reveal (from left)
export const itemVariantsX = {
  hidden: { 
    opacity: 0, 
    x: -20 
  },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: "easeOut"
    }
  })
};

// Fade in variant
export const fadeIn = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Scale in variant (for buttons and interactive elements)
export const scaleIn = {
  hidden: { 
    opacity: 0,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

// Hover animation for interactive elements
export const hoverScale = {
  scale: 1.03,
  transition: {
    duration: 0.2
  }
}; 