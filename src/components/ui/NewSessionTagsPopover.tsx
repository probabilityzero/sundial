import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NewSessionTagsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  availableTags: { name: string; }[];
  onTagClick: (tag: string) => void;
  dimensionEmojis: { [key: string]: string } | undefined; // Make dimensionEmojis optional
}

const NewSessionTagsPopover: React.FC<NewSessionTagsPopoverProps> = ({ isOpen, onClose, availableTags, onTagClick, dimensionEmojis }) => {
  const tagRef = useRef<HTMLDivElement>(null);

    // Close panel when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (tagRef.current && !tagRef.current.contains(event.target as Node)) {
          isOpen(false);
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
        className="backdrop-filter backdrop-blur-sm bg-opacity-75 bg-white shadow-md rounded-md w-48 overflow-hidden absolute top-full"
        style={{ zIndex: 50 }}
        initial={{ y: -10, opacity: 0, scale: 0.9 }}
        animate={{ y: isOpen ? 0 : -10, opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.9 }}
        transition={{ duration: 0.1, ease: "easeInOut" }}
        exit={{ opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {availableTags && availableTags.map((tag) => (
          <button
            key={tag.name}
            className={`flex items-center justify-start w-full text-left px-3 py-2 text-sm hover:bg-gray-300 hover:scale-105 transition duration-100rounded-none m-0 border-none`} 
            onClick={() => onTagClick(tag.name)}
          >
            <span className="mr-2">{dimensionEmojis && dimensionEmojis[tag.name]}</span>
            {tag.name}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default NewSessionTagsPopover;
