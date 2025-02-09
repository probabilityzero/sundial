import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface TagDropdownProps {
  availableTags: { name: string; selected: boolean }[];
  defaultTag: string;
  onTagSelect: (index: number, tagName: string) => void;
  onDefaultTagChange: (tag: string) => void;
}

const TagDropdown: React.FC<TagDropdownProps> = ({ availableTags, defaultTag, onTagSelect, onDefaultTagChange }) => {
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
          <li key={index} className="relative">
            <label className="flex items-center px-4 py-2 hover:bg-gray-100">
              <input
                type="checkbox"
                checked={tag.selected}
                onChange={() => onTagSelect(index, tag.name)}
                className="mr-2"
              />
              {tag.name}
            </label>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onDefaultTagChange(tag.name);
              }}
            >
              <Star className="w-4 h-4 text-yellow-500" />
            </button>
          </li>
        ))}
      </motion.ul>
    </div>
  );
};

export default TagDropdown;
