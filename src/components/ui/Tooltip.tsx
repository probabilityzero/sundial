import React, { useState, useRef, useEffect } from 'react';
import '../../index.css';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ children, text, position = 'top' }) => {
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    if (containerRef.current && tooltipRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      const spaceAbove = containerRect.top;
      const spaceBelow = window.innerHeight - containerRect.bottom;
      const spaceLeft = containerRect.left;
      const spaceRight = window.innerWidth - containerRect.right;

      if (position === 'top' && spaceAbove < tooltipRect.height) {
        return spaceBelow > tooltipRect.height ? 'bottom' : (spaceRight > spaceLeft ? 'right' : 'left');
      } else if (position === 'bottom' && spaceBelow < tooltipRect.height) {
        return spaceAbove > tooltipRect.height ? 'top' : (spaceRight > spaceLeft ? 'right' : 'left');
      } else if (position === 'left' && spaceLeft < tooltipRect.width) {
        return spaceRight > tooltipRect.width ? 'right' : (spaceAbove > spaceBelow ? 'top' : 'bottom');
      } else if (position === 'right' && spaceRight < tooltipRect.width) {
        return spaceLeft > tooltipRect.width ? 'left' : (spaceAbove > spaceBelow ? 'top' : 'bottom');
      }

      return position;
    }
    return position;
  };

  const arrowPosition = calculatePosition();

  useEffect(() => {
    // Recalculating tooltip position whenever `visible` or `position` changes
  }, [visible, position]);

  return (
    <div
      className="tooltip-container"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      ref={containerRef}
    >
      {children}
      {visible && (
        <span className={`tooltip tooltip-${arrowPosition}`} ref={tooltipRef}>
          {text}
        </span>
      )}
    </div>
  );
};

export default Tooltip;
