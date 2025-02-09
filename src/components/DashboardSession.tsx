import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NewSessionTitle } from './shared/NewSessionTitle';
import { useSessionStore } from '../store/useSessionStore';

interface SessionCardProps {}

export function DashboardSession({}: SessionCardProps) {
  const [sessionName, setSessionName] = useState(getDefaultSessionName());
  const { startSession, isSessionActive, resumeSession, isPaused } = useSessionStore();

  function getDefaultSessionName() {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return "Morning Session";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "Afternoon Session";
    } else if (currentHour >= 17 && currentHour < 22) {
      return "Evening Session";
    } else {
      return "Midnight Session";
    }
  }

  const handleSaveSessionName = async (newSessionName: string) => {
    setSessionName(newSessionName);
    console.log("Session name updated:", newSessionName);
  };

  const handleStartSessionClick = async () => {
    console.log("DashboardSession: handleStartSessionClick called");
    if (!isSessionActive && isPaused) {
      try {
        await resumeSession();
        console.log("DashboardSession: resumeSession completed successfully");
      } catch (error) {
        console.error("DashboardSession: Error resuming session:", error);
      }
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center p-8 pb-4"
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="h-64 w-64 rounded-full bg-blue-200 m-4 shadow-md flex items-center justify-center cursor-pointer"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={handleStartSessionClick}
      >
        {/* Circle content or icon can go here */}
      </motion.div>
      <motion.div
        className="text-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <NewSessionTitle title={sessionName} onSave={handleSaveSessionName} />
      </motion.div>
    </motion.div>
  );
}
