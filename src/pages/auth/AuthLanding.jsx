import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";

export default function AuthLanding() {
  const [hearts, setHearts] = useState([]);
  const navigate = useNavigate();

  // Generate random heart positions initially and every 10 seconds
  useEffect(() => {
    generateHearts();
    const interval = setInterval(generateHearts, 10000);
    return () => clearInterval(interval);
  }, []);

  // Function to generate random floating hearts
  const generateHearts = () => {
    const newHearts = Array.from({ length: 15 }, (_, i) => ({
      id: `heart-${Date.now()}-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.6 + 0.1,
    }));
    setHearts(newHearts);
  };

  const handleSignIn = () => {
    console.log("Sign In button clicked");
    navigate("/login");
  };

  const handleSignUp = () => {
    console.log("Sign Up button clicked");
    navigate("/signup");
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #8a2387, #e94057, #f27121)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating hearts background animation */}
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          style={{
            position: "absolute",
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            opacity: heart.opacity,
            zIndex: 1,
          }}
          initial={{ y: 0 }}
          animate={{ y: -100 }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
          }}
        >
          <FaHeart
            size={heart.size}
            color="#fff"
            style={{ filter: "blur(1px)" }}
          />
        </motion.div>
      ))}

      {/* Main container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "90%",
          maxWidth: "420px",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Heart Icon with heartbeat animation */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ 
            scale: [1, 1.2, 1, 1.15, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatDelay: 1
          }}
          style={{
            marginBottom: "1.5rem",
            color: "#fff",
            filter: "drop-shadow(0 0 8px rgba(255, 100, 130, 0.6))",
          }}
        >
          <FaHeart size={48} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: "1.8rem",
            color: "#fff",
            marginBottom: "0.5rem",
            textAlign: "center",
          }}
        >
          Heart Glow AI
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: "1rem",
            color: "rgba(255, 255, 255, 0.9)",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Express your feelings with beautifully crafted messages
        </motion.p>

        {/* Button container */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {/* Sign In Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSignIn}
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Sign In
          </motion.button>

          {/* Sign Up Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSignUp}
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #ff6bcb, #B19CD9)",
              border: "none",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            Sign Up
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
