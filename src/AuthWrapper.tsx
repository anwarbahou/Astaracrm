
import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";

import Landing from '@/pages/Landing';
import MainApp from '@/MainApp';

export default function AuthWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  const handleSignIn = () => {
    console.log("Signing in...");
    setIsAuthenticated(true);
  };
  
  const handleSignOut = () => {
    console.log("Signing out...");
    setIsAuthenticated(false);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname}>
        <Routes location={location}>
            <Route 
                path="/landing" 
                element={
                    isAuthenticated ? <Navigate to="/" replace /> : <Landing onSignIn={handleSignIn} />
                } 
            />
            <Route 
                path="/*" 
                element={
                    isAuthenticated ? <MainApp onSignOut={handleSignOut} /> : <Navigate to="/landing" replace />
                }
            />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}
