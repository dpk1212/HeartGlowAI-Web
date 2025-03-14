import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaComment, FaUser, FaCog } from "react-icons/fa";
import { signOutUser } from "../../services/auth";
import { useFirebase } from "../../contexts/FirebaseContext";

export default function WelcomeHome() {
  const [hearts, setHearts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useFirebase();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Generate random heart positions initially and every 10 seconds
  useEffect(() => {
    generateHearts();
    const interval = setInterval(generateHearts, 10000);
    return () => clearInterval(interval);
  }, []);

  // Function to generate random floating hearts
  const generateHearts = () => {
    const newHearts = Array.from({ length: 10 }, (_, i) => ({
      id: `heart-${Date.now()}-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 15 + 8,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.4 + 0.1,
    }));
    setHearts(newHearts);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate("/authlanding");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleStartChat = () => {
    navigate("/message");
  };

  const handleProfile = () => {
    // You would navigate to the profile page here
    setMenuOpen(false);
  };

  const handleSettings = () => {
    // You would navigate to the settings page here
    setMenuOpen(false);
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

      {/* Header with menu */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 50,
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <motion.div
            initial={{ scale: 1 }}
            animate={{ 
              scale: [1, 1.15, 1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 1
            }}
            style={{
              marginRight: "0.75rem",
              color: "#fff",
              filter: "drop-shadow(0 0 8px rgba(255, 100, 130, 0.6))",
            }}
          >
            <FaHeart size={28} />
          </motion.div>
          <h2
            style={{
              color: "#fff",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            HeartGlow
          </h2>
        </motion.div>
        
        {/* User menu */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: "relative" }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "none",
              cursor: "pointer",
            }}
          >
            <FaUser color="#fff" size={18} />
          </motion.button>
          
          {/* Dropdown menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute",
                  top: "50px",
                  right: 0,
                  width: "200px",
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
                  overflow: "hidden",
                  zIndex: 100,
                }}
              >
                <div style={{ padding: "0.5rem" }}>
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <p style={{ color: "#fff", fontWeight: "bold", marginBottom: "0.25rem" }}>
                      {user?.displayName || "User"}
                    </p>
                    <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.8rem" }}>
                      {user?.email || ""}
                    </p>
                  </div>
                  
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    onClick={handleProfile}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#fff",
                      textAlign: "left",
                    }}
                  >
                    <FaUser size={14} style={{ marginRight: "0.75rem" }} />
                    Profile
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    onClick={handleSettings}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#fff",
                      textAlign: "left",
                    }}
                  >
                    <FaCog size={14} style={{ marginRight: "0.75rem" }} />
                    Settings
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    onClick={handleSignOut}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#fff",
                      textAlign: "left",
                      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    Sign Out
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "90%",
          maxWidth: "800px",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
          padding: "2.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Welcome message */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "2rem",
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
            <FaHeart size={64} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: "2rem",
              color: "#fff",
              marginBottom: "0.5rem",
              textAlign: "center",
            }}
          >
            Welcome, {user?.displayName || "Friend"}!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: "1.1rem",
              color: "rgba(255, 255, 255, 0.9)",
              marginBottom: "1.5rem",
              textAlign: "center",
              maxWidth: "600px",
            }}
          >
            Express your emotions with the perfect words using MessageSpark, our advanced AI message generator. Create beautiful messages for your loved ones.
          </motion.p>
        </motion.div>

        {/* Main action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: "400px",
            gap: "1rem",
          }}
        >
          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleStartChat}
            style={{
              width: "100%",
              padding: "1.25rem",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              border: "none",
              color: "#fff",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              backdropFilter: "blur(5px)",
            }}
          >
            <FaHeart size={20} />
            Create AI Message with MessageSpark
          </motion.button>

          {/* Featured templates or suggested prompts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              marginTop: "2rem",
              width: "100%",
            }}
          >
            <h3 style={{ color: "#fff", fontSize: "1.2rem", marginBottom: "1rem", textAlign: "center" }}>
              Message Templates
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
              {["Love Letter", "Apology Note", "Anniversary Message", "Congratulations"].map((template, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  onClick={handleStartChat}
                  style={{
                    padding: "0.75rem 1.25rem",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "#fff",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  {template}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
} 