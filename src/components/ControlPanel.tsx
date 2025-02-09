import React, { useState } from 'react';
import { PanelRight } from 'lucide-react'; // Changed icon
import { motion } from 'framer-motion';

const ControlPanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Button to open/close the panel */}
      <button
        className="text-gray-600 p-2 rounded-md focus:outline-none hover:bg-gray-100 active:bg-gray-200" // Removed shadow
        onClick={togglePanel}
      >
        <PanelRight className="h-5 w-5" /> {/* Changed icon */}
      </button>

      {/* Sliding panel */}
      <motion.div
        className="bg-white shadow-xl rounded-md w-80 overflow-hidden absolute top-full right-0 mt-2"
        style={{ height: 'calc(100vh - 3rem)', zIndex: 50 }} // Increased height to full screen - header height
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: isOpen ? 0 : 200, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Top division */}
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Settings</h3>
          {/* Add your settings content here */}
        </div>

        {/* Bottom division */}
        <div className="p-4">
          <h3 className="text-lg font-semibold">Additional Options</h3>
          {/* Add more options here */}
        </div>
      </motion.div>
    </div>
  );
};

export default ControlPanel;
