import React from 'react';

interface EmojiTagProps {
  onClick: () => void;
  emoji: string;
  isOpen: boolean;
}

const EmojiTag: React.FC<EmojiTagProps> = ({ onClick, emoji, isOpen }) => {
  return (
    <div className="relative p-1">
      <button
        className="text-gray-600 p-2 rounded-md focus:outline-none hover:bg-gray-100 active:bg-gray-200"
        onClick={onClick}
      >
        <span style={{ fontSize: '1.5em' }}>{emoji}</span>
      </button>
    </div>
  );
};

export default EmojiTag;
