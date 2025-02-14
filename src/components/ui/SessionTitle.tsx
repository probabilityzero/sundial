import React, { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface NewSessionTitleProps {
  title: string;
  onSave: (newTitle: string) => void;
}

export function SessionTitle({ title, onSave }: NewSessionTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [titleWidth, setTitleWidth] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      setTitleWidth(titleRef.current.offsetWidth);
    }
  }, [title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.style.width = `${titleWidth}px`;
    }
  }, [isEditing, titleWidth]);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (newTitle.trim().length > 0 && newTitle.length <= 26) {
      onSave(newTitle);
    } else {
      setNewTitle(title);
    }
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 26) {
      setNewTitle(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveClick();
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      handleSaveClick();
    }, 100);
  };

  return (
    <div className="flex flex-col items-center relative transform-none">
      <div className="relative">
        {isEditing ? (
          <>
            <input
              type="text"
              ref={inputRef}
              value={newTitle}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="text-3xl font-semibold text-center bottom-0 focus:outline-none bg-transparent transform-none"
              style={{ lineHeight: 'tight' }} // Adjust line-height for better text spacing
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                left: `calc(100% + 8px)`,
                top: 'calc(50% - 4px)' // Move the check icon 4px up
              }}
            >
              <Check className="h-4 w-4 text-green-600" />
            </motion.div>

          </>
        ) : (
          <h2
            ref={titleRef}
            className="text-3xl font-semibold cursor-pointer transform-none"
            onClick={handleTitleClick}
            style={{ lineHeight: 'tight' }} // Adjust line-height for better text spacing
          >
            {title}
          </h2>
        )}
      </div>
      <motion.div
        className="h-0.5 bg-blue-500 mt-0.5 transform-none"
        initial={{ width: 0 }}
        animate={{
          width: isEditing ? `${titleWidth + 40}px` : 0,
        }}
        style={{
          transformOrigin: 'center',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
    </div>
  );
}
