import React, { useState } from 'react';
import '../../index.css';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ text, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  const positions = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-1",
    bottom: "top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-1",
    left: "right-full top-1/2 transform -translate-x-2 -translate-y-1/2 mr-1",
    right: "left-full top-1/2 transform translate-x-2 -translate-y-1/2 ml-1"
  };
  
  return (
    <div className="relative inline-block" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {isVisible && (
        <div className={`absolute z-50 px-2 py-1 text-xs font-medium text-primary-contrast bg-gray-800/90 rounded pointer-events-none whitespace-nowrap ${positions[position]}`}>
          {text}
        </div>
      )}
      {children}
    </div>
  );
}

export default Tooltip;
