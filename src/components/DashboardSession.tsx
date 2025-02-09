import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion
import { NewSessionTitle } from './shared/NewSessionTitle';
import { useSessionStore } from '../store/useTaskStore'; // Import the store

interface SessionCardProps {
  // Add any props if needed later
}

export function DashboardSession({ }: SessionCardProps) {
  const [sessionName, setSessionName] = useState(getDefaultSessionName());

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

  const handleSaveSessionName = (newSessionName: string) => {
    setSessionName(newSessionName);
    // In a real app, you would save the session name to a database or state management
    console.log("Session name updated:", newSessionName);
  }; 

  return (
    <motion.div
      className="flex flex-col items-center p-8 pb-4"
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="h-64 w-64 rounded-full bg-blue-200 m-4 shadow-md flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Circle content or icon can go here */}
      </motion.div>
      <motion.div
        className="text-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <NewSessionTitle title={sessionName} onSave={handleSaveSessionName} />
      </motion.div>
    </motion.div>
  );
};
