import React from 'react';
import NewSessionTagsPopover from '../ui/NewSessionTagsPopover';

interface SessionTagProps {
  onClick: () => void;
  emoji: string;
  isOpen: boolean;
}

const SessionTag: React.FC<SessionTagProps> = ({ onClick, emoji, isOpen }) => {
  return (
    <div className="relative p-1">
      <button
        className="text-gray-600 p-1 rounded-full focus:outline-none hover:bg-gray-100 active:bg-gray-100"
        onClick={onClick}
      >
        <span style={{ fontSize: '1.5em' }}>{emoji}</span>
      </button>
    </div>
  );
};

export default SessionTag;
