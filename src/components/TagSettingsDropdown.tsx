import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TagSettingsDropdownProps {
  availableTags: { name: string; selected: boolean }[];
  onTagSelect: (index: number, tagName: string) => void;
}

const TagSettingsDropdown: React.FC<TagSettingsDropdownProps> = ({ availableTags, onTagSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
      {/* Dropdown button */}
      <button
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center"
        onClick={toggleDropdown}
      >
        <span>Select Tags</span>
        <svg className="fill-current h-4 w-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </button>

      {/* Dropdown list */}
      <motion.ul
        className="bg-white shadow-xl rounded-md w-64 overflow-hidden absolute top-full right-0 mt-2"
        style={{ zIndex: 50 }}
        initial={{ y: -10, opacity: 0, scale: 0.9 }}
        animate={{ y: isOpen ? 0 : -10, opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.9 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        ref={dropdownRef}
      >
        {availableTags.map((tag, index) => (
          <li key={index} className="relative group">
            <label className="flex items-center px-4 py-2 hover:bg-gray-100">
              <input
                type="checkbox"
                checked={tag.selected}
                onChange={() => onTagSelect(index, tag.name)}
                className="mr-2"
              />
              {tag.name}
            </label>
          </li>
        ))}
      </motion.ul>
    </div>
  );
};

export default TagSettingsDropdown;
