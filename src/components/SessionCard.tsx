import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { motion } from 'framer-motion'; // Import Framer Motion

interface SessionCardProps {
  // Add any props if needed later
}

export function SessionCard({ }: SessionCardProps) {
  const [sessionName, setSessionName] = useState(getDefaultSessionName());
  const [isEditing, setIsEditing] = useState(false);

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

  const handleSessionNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSessionName(e.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveName = () => {
    setIsEditing(false);
    // In a real app, you would save the session name to a database or state management
    console.log("Session name updated:", sessionName);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSessionName(getDefaultSessionName()); // Revert to default name
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
        {isEditing ? (
          <div className="flex flex-col items-center">
            <input
              type="text"
              value={sessionName}
              onChange={handleSessionNameChange}
              className="text-2xl font-semibold text-center border border-gray-300 rounded-md py-1 px-2 mb-2 outline-none"
            />
            <div className="flex gap-2">
              <button onClick={handleSaveName} className="bg-green-500 text-white rounded-md py-1 px-3 hover:bg-green-600">Save</button>
              <button onClick={handleCancelEdit} className="bg-gray-200 text-gray-700 rounded-md py-1 px-3 hover:bg-gray-300">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <h2 className="text-3xl font-semibold mr-2">{sessionName}</h2>
            <button onClick={handleEditClick} className="text-gray-600 hover:text-gray-800">
              <Edit className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
