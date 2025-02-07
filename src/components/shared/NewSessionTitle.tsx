import React, { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface NewSessionTitleProps {
  title: string;
  onSave: (newTitle: string) => void;
}

export function NewSessionTitle({ title, onSave }: NewSessionTitleProps) {
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
    <div className="flex items-center">
      <div className="relative">
        {isEditing ? (
          <div className="justify-between">
            <input
              type="text"
              ref={inputRef}
              value={newTitle}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="text-3xl font-semibold text-center focus:outline-none bg-transparent"
              onBlur={handleBlur} // Save when focus is lost
            />
            <motion.button
              onClick={handleSaveClick}
              className="text-green-600 hover:text-green-800 focus:outline-none right-0"
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
        <motion.div
          className="items-center bottom-0 h-[2px] bg-blue-500 origin-center"
          style={{ width: isEditing ? '100%' : '0%' }}
          initial={{ x: "-50%" }}
          animate={{ x: "-50%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
