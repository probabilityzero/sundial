import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion
import { EditableTitle } from './EditableTitle';

interface SessionCardProps {
  // Add any props if needed later
}

export function SessionCard({ }: SessionCardProps) {
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
      return "Night Session";
    }
  }

  const handleSaveSessionName = (newSessionName: string) => {
    setSessionName(newSessionName);
    // In a real app, you would save the session name to a database or state management
    console.log("Session name updated:", newSessionName);
  };

  return (
    <motion.div
      className="flex flex-col items-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-40 h-40 rounded-full bg-blue-400 mb-4 shadow-md flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Circle content or icon can go here */}
      </motion.div>
      <div className="text-center">
        <EditableTitle title={sessionName} onSave={handleSaveSessionName} />
      </div>
    </motion.div>
  );
}
