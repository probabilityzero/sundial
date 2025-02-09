import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSessionStore } from '../store/useSessionStore';

interface EmojiTagProps {}

const EmojiTag: React.FC<EmojiTagProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { dimension, setDimension, startSession, isSessionActive } = useSessionStore();
  const dimensions = ['Working', 'Studying', 'Reading', 'Relaxing', 'Other'];
  const dimensionEmojis: { [key: string]: string } = {
    'Working': '💼',
    'Studying': '📚',
    'Reading': '📖',
    'Relaxing': '☕',
    'Other': '⚙️',
  };
  const defaultEmoji = '⚙️';

  const togglePopover = () => {
    setIsOpen(!isOpen);
  };

  const handleDimensionClick = async (newDimension: string) => {
    setDimension(newDimension);
    setIsOpen(false);
    if (!isSessionActive) {
      await startSession('New Session'); // Start a new session with the default name
    }
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
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

  const getEmoji = () => {
    return dimension ? dimensionEmojis[dimension] : defaultEmoji;
  };

  return (
    <div className="relative">
      {/* Button to open/close the popover */}
      <button
        className="text-gray-600 p-2 rounded-md focus:outline-none hover:bg-gray-100 active:bg-gray-200"
        onClick={togglePopover}
      >
        <span style={{ fontSize: '1.5em' }}>{getEmoji()}</span>
      </button>

      {/* Popover */}
      <motion.div
        className="bg-white shadow-xl rounded-md w-48 overflow-hidden absolute top-full right-0 mt-2"
        style={{ zIndex: 50 }}
        initial={{ y: -10, opacity: 0, scale: 0.9 }}
        animate={{ y: isOpen ? 0 : -10, opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.9 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        ref={popoverRef}
      >
        {dimensions.map((d) => (
          <button
            key={d}
            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${dimension === d ? 'bg-gray-200' : ''}`}
            onClick={() => handleDimensionClick(d)}
          >
            {d}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default EmojiTag;
