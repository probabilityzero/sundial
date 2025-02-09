import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSessionStore } from '../store/useSessionStore';

interface DimensionPopoverProps {}

const DimensionPopover: React.FC<DimensionPopoverProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { dimension, setDimension } = useSessionStore();
  const dimensions = ['Working', 'Studying', 'Reading', 'Relaxing', 'Other'];

  const togglePopover = () => {
    setIsOpen(!isOpen);
  };

  const handleDimensionClick = (newDimension: string) => {
    setDimension(newDimension);
    setIsOpen(false);
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

  return (
    <div className="relative">
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

export default DimensionPopover;
