import React from 'react';
import { motion } from 'framer-motion';

interface ToggleSwitchProps {
  isChecked: boolean;
  onChange: () => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  isChecked, 
  onChange, 
  label,
  size = 'md'
}) => {
  const sizes = {
    sm: {
      switch: 'w-8 h-4',
      circle: 'w-3 h-3',
      translate: 'translate-x-4',
    },
    md: {
      switch: 'w-11 h-6',
      circle: 'w-5 h-5',
      translate: 'translate-x-5',
    },
    lg: {
      switch: 'w-14 h-7',
      circle: 'w-6 h-6',
      translate: 'translate-x-7',
    },
  };

  return (
    <div className="flex items-center">
      {label && (
        <span className="mr-2 text-text-secondary font-medium text-sm">
          {label}
        </span>
      )}
      <button
        type="button"
        className={`
          relative inline-flex flex-shrink-0 ${sizes[size].switch} 
          border-2 border-transparent rounded-full cursor-pointer 
          transition-colors ease-in-out duration-200 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-opacity-25
          ${isChecked ? 'bg-primary' : 'bg-surface'}
        `}
        role="switch"
        aria-checked={isChecked}
        onClick={onChange}
      >
        <span className="sr-only">Toggle theme</span>
        <motion.span
          className={`
            ${sizes[size].circle}
            bg-white rounded-full flex items-center justify-center
            shadow-sm
          `}
          initial={false}
          animate={{
            translateX: isChecked ? sizes[size].translate.split('-x-')[1].split('translate-x-')[0] : 0,
            backgroundColor: isChecked ? '#ffffff' : '#ffffff',
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        >
          {size === 'lg' && (
            isChecked ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            )
          )}
        </motion.span>
      </button>
    </div>
  );
};

export default ToggleSwitch;