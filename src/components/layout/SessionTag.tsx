import React, { useState, useRef } from 'react';
import NewSessionTagPopover from '../ui/NewSessionTagPopover';
import { useUserSettingsStore } from '../../store/useUserSettingsStore';
import { useSessionStore } from '../../store/useSessionStore';

interface SessionTagProps {}

const SessionTag: React.FC<SessionTagProps> = ({}) => {
  const [isTagsPopoverOpen, setIsTagsPopoverOpen] = useState(false);
  const { availableTags } = useUserSettingsStore();
  const { setTag, startSession, isSessionActive, tag } = useSessionStore();

  const popoverRef = useRef<HTMLDivElement>(null); // Ref for the popover content

  const handleTagClick = () => {
    setIsTagsPopoverOpen((prev) => !prev);
  };

  const handleTagValueClick = async (newTag: string) => {
    setTag(newTag);
    setIsTagsPopoverOpen(false);
    if (!isSessionActive) {
      await startSession(newTag);
    }
  };

  const tagEmojis = {
    'Working': '💼',
    'Studying': '📚',
    'Reading': '📖',
    'Meeting': '🤝',
    'Research': '🔬',
    'Meditation': '🧘',
    'Writing': '✍️',
    'Coding': '💻',
    'Designing': '🎨',
    'Editing': '✏️',
  };


  type Tag = keyof typeof tagEmojis; 

  const getEmoji = () => {
    return tag ? tagEmojis[tag as Tag] : '⚪'; 
  };

  // Close the popover if the cursor moves away from the popover or the button
  const handleMouseLeave = (e: React.MouseEvent) => {
    if (popoverRef.current && !popoverRef.current.contains(e.relatedTarget as Node)) {
      setIsTagsPopoverOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        className="p-3 pl-2 pr-4"
        onClick={handleTagClick}
        onMouseEnter={() => setIsTagsPopoverOpen(true)} // Open on hover
        onMouseLeave={handleMouseLeave} // Close when the mouse leaves
      >
        <span className='text-gray-600 text-lg rounded-full focus:outline-none hover:bg-gray-100 active:bg-gray-100'>{getEmoji()}</span>
      </button>

      {/* Conditionally render the popover only when it's open */}
      {isTagsPopoverOpen && (
        <div
          ref={popoverRef}
          onMouseLeave={handleMouseLeave} // Handle when mouse leaves the popover content
        >
          <NewSessionTagPopover
            isOpen={isTagsPopoverOpen}
            onClose={() => setIsTagsPopoverOpen(false)}
            availableTags={availableTags}
            onTagClick={handleTagValueClick}
            tagEmojis={tagEmojis}
          />
        </div>
      )}
    </div>
  );
};

export default SessionTag;
