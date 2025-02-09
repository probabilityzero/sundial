import React, { useState, useRef, useEffect } from 'react';
import { PanelRight } from 'lucide-react';
import { motion } from 'framer-motion';
import CircleColorSettings from '../ui/ControlPanelBackground';
import EmojiTagSettings from '../ui/EmojiTagSettings';
import CalendarComponent from '../ui/ControlPanelCalendar';
import ControlPanelNavbar from '../ui/ControlPanelNavbar';
import { MenuItemIcon } from '../ui/MenuItemIcon';

interface ControlPanelProps {
  onBackClick?: () => void; // Add onBackClick prop
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onBackClick }) => {
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('circleColor');
  const panelRef = useRef<HTMLDivElement>(null);

  const handleClick = () => { // Define handleClick function
    setIsControlPanelOpen(!isControlPanelOpen);
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsControlPanelOpen(false);
      }
    };

    if (isControlPanelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isControlPanelOpen]);

  const handleBackClick = () => {
    setIsControlPanelOpen(false); // Close the panel when back button is clicked
  };

  return (
    <div className="relative">
      {/* Button to open/close the panel */}
      <button
        className="text-gray-600 p-2 rounded-md focus:outline-none hover:bg-gray-100 active:bg-gray-200"
        onClick={handleClick}
      >
        <PanelRight className="h-6 w-6" />
      </button>

      {/* Sliding panel */}
      <motion.div
        className="bg-white shadow-xl rounded-md w-80 overflow-hidden absolute top-full right-0 mt-2 flex flex-col"
        style={{ height: 'calc(100vh - 3rem)', zIndex: 50 }}
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: isControlPanelOpen ? 0 : 200, opacity: isControlPanelOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        ref={panelRef}
      >
        <div className="p-4 border-b flex-grow flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold mb-4">Control Panel</h3>
            {onBackClick && ( // Conditionally render the button
              <button onClick={onBackClick} className="text-gray-600 p-2 rounded-md focus:outline-none hover:bg-gray-100 active:bg-gray-200">
                <span>Back</span>
              </button>
            )}
          </div>
          <ControlPanelNavbar activeSection={activeSection} setActiveSection={setActiveSection} />
          {activeSection === 'circleColor' && <CircleColorSettings />}
          {activeSection === 'emojiTag' && <EmojiTagSettings />}
        </div>

        <div className="p-4 border-t">
          <CalendarComponent />
        </div>
      </motion.div>
    </div>
  );
};

export default ControlPanel;
