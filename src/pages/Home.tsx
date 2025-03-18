import React, { useState, useEffect, useRef } from 'react';
import { Check, Play, Loader2, Circle } from 'lucide-react';
import { useSessionStore } from '../store/useSessionStore'; // Import the store
import { DashboardSession } from '../components/DashboardSession';
import { DashboardGoal } from '../components/DashboardGoal';
import { motion } from 'framer-motion';

function HomePage() {

  return (
    <motion.div
      className="flex flex-col overflow-hidden w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
        <div className="w-full max-w-7xl mx-auto px-4 flex justify-center">
        <DashboardSession />
        </div>
        <div className="w-full max-w-7xl mx-auto px-4">
        <DashboardGoal />
        </div>
    </motion.div>
  );
}

export default HomePage;
