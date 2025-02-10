import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NewSessionTagPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  availableTags: { name: string; }[];
  onTagClick: (tag: string) => void;
  tagEmojis: { [key: string]: string } | undefined;
}

const NewSessionTagPopover: React.FC<NewSessionTagPopoverProps> = ({ isOpen, onClose, availableTags, onTagClick, tagEmojis }) => {
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagRef.current && !tagRef.current.contains(event.target as Node)) {
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
      <motion.div
        className="backdrop-filter backdrop-blur-sm bg-opacity-75 bg-white shadow-md rounded-md w-48 overflow-hidden absolute top-full"
        style={{ zIndex: 50 }}
        initial={{ y: -10, opacity: 0, scale: 0.9 }}
        animate={{ 
          y: isOpen ? 0 : -10, 
          opacity: isOpen ? 1 : 0, 
          scale: isOpen ? 1 : 0.9 
        }}
        exit={{ opacity: 0 }}
        onClick={e => e.stopPropagation()}
        ref={tagRef}
      >
        {availableTags && availableTags.map((tag) => (
          <motion.button
            key={tag.name}
            className="flex items-center justify-start w-full text-left px-3 py-2 text-sm transition duration-100 rounded-none m-0 border-none hover:text-blue-500" // Tailwind hover class
            onClick={() => onTagClick(tag.name)}
            whileHover={{
              scale: 0.95,  // Slightly scale up when hovering
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <span className="mr-2">{tagEmojis && tagEmojis[tag.name]}</span>
            {tag.name}
          </motion.button>

        ))}
      </motion.div>
    </div>
  );
};

export default NewSessionTagPopover;
