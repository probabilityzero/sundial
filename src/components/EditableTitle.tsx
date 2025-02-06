import React, { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface EditableTitleProps {
  title: string;
  onSave: (newTitle: string) => void;
}

export function EditableTitle({ title, onSave }: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onSave(newTitle);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  // Handle pressing Enter key to save
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveClick();
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      handleSaveClick();
    }, 100); // Small delay
  };

  return (
    <div className="flex items-center relative">
      {isEditing ? (
        <div className="flex items-center">
          <input
            type="text"
            ref={inputRef}
            value={newTitle}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="text-3xl font-semibold mr-2 focus:outline-none border-b-2 border-gray-300 bg-transparent w-48" // Added w-48
            onBlur={handleBlur} // Save when focus is lost
          />
          <motion.button
            onClick={handleSaveClick}
            className="text-green-600 hover:text-green-800 focus:outline-none absolute right-0"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Check className="h-5 w-5" />
          </motion.button>
        </div>
      ) : (
        <h2
          className="text-3xl font-semibold mr-2 cursor-pointer"
          onClick={handleTitleClick}
        >
          {title}
        </h2>
      )}
    </div>
  );
}
