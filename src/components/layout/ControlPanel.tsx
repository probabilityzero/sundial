import React, { useState, useRef, useEffect } from 'react';
import { PanelsTopLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import CircleColorSettings from '../ui/ControlPanelBackground';
import ControlPanelTags from '../ui/ControlPanelTags';
import CalendarComponent from '../ui/ControlPanelCalendar';
import ControlPanelNavbar from '../ui/ControlPanelNavbar';
import { useUserSettingsStore } from '../../store/useUserSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';

interface ControlPanelProps {
  onBackClick?: () => void; // Add onBackClick prop
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onBackClick }) => {
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('circleColor');
  const panelRef = useRef<HTMLDivElement>(null);
  const { fetchUserSettings, availableTags } = useUserSettingsStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    // Check if the panel is already open
    if (isControlPanelOpen) {
      // Close it if it is open
      setIsControlPanelOpen(false);
    } else {
      // Open it if it's closed
      setIsControlPanelOpen(true);
      if (user) {
        setIsLoading(true);
        await fetchUserSettings(user.id);
        setIsLoading(false);
      }
    }
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

  return (
    <div className="relative p-1">
      {/* Button to open/close the panel */}
      <button
        className="text-gray-600 p-2 rounded-md focus:outline-none hover:bg-gray-100 active:bg-gray-200"
        onClick={handleClick}
      >
        <PanelsTopLeft className="h-6 w-6" />
      </button>

      {/* Sliding panel */}
      <motion.div
        className="backdrop-filter backdrop-blur-xl bg-opacity-95 bg-white p-0 shadow-xl rounded-md w-80 overflow-hidden absolute top-full right-0 flex flex-col"
        style={{ height: 'calc(100vh - 3rem)', zIndex: 50 }}
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: isControlPanelOpen ? 0 : 200, opacity: isControlPanelOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        ref={panelRef}
      >
        <div className="p-3 border-b flex-grow flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-bold">Control Panel</h3>
          </div>
          <ControlPanelNavbar activeSection={activeSection} setActiveSection={setActiveSection} />
          {activeSection === 'circleColor' && <CircleColorSettings />}
          {activeSection === 'emojiTag' && <ControlPanelTags />}
        </div>

        <div className="p-4 border-t">
          <CalendarComponent />
        </div>
      </motion.div>
    </div>
  );
};

export default ControlPanel;
