import React from 'react';
import { motion } from 'framer-motion';

interface TagsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  availableTags: { name: string; }[];
  onTagClick: (tag: string) => void;
  dimensionEmojis: { [key: string]: string } | undefined; // Make dimensionEmojis optional
}

const TagsPopover: React.FC<TagsPopoverProps> = ({ isOpen, onClose, availableTags, onTagClick, dimensionEmojis }) => {
  return (
    <div className="relative">
      {/* Popover */}
      <motion.div
        className="bg-white shadow-md rounded-md w-48 overflow-hidden absolute top-full right-0 mt-2"
        style={{ zIndex: 50 }}
        initial={{ y: -10, opacity: 0, scale: 0.9 }}
        animate={{ y: isOpen ? 0 : -10, opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.9 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        exit={{ opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {availableTags && availableTags.map((tag) => (
          <button
            key={tag.name}
            className={`flex items-center justify-start w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-none m-0 border-none`} // Removed blue background
            onClick={() => onTagClick(tag.name)}
          >
            <span className="mr-2">{dimensionEmojis && dimensionEmojis[tag.name] || '📌'}</span> {/* Check if dimensionEmojis exists */}
            {tag.name}
          </button>
        ))}
        {!availableTags || availableTags.length === 0 && (
          <div className="px-3 py-2 text-sm text-gray-500">No tags available.</div>
        )}
      </motion.div>
    </div>
  );
};

export default TagsPopover;
