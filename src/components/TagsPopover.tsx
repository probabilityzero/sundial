import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TagsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  availableTags: { name: string; selected: boolean }[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
}

const TagsPopover: React.FC<TagsPopoverProps> = ({ isOpen, onClose, availableTags, selectedTags, onTagClick }) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

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
        {availableTags && availableTags.map((tag) => (
          <button
            key={tag.name}
            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-full m-1 ${selectedTags.includes(tag.name) ? 'bg-blue-200' : ''}`}
            onClick={() => onTagClick(tag.name)}
          >
            {tag.name}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default TagsPopover;
