import React, { useState, useRef, useEffect } from 'react';
import { PanelRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ControlPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Button to open/close the panel */}
      <button
        className="text-gray-600 p-2 rounded-md focus:outline-none hover:bg-gray-100 active:bg-gray-200"
        onClick={togglePanel}
      >
        <PanelRight className="h-5 w-5" />
      </button>

      {/* Sliding panel */}
      <motion.div
        className="bg-white shadow-xl rounded-md w-80 overflow-hidden absolute top-full right-0 mt-2"
        style={{ height: 'calc(100vh - 3rem)', zIndex: 50 }}
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: isOpen ? 0 : 200, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        ref={panelRef}
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
