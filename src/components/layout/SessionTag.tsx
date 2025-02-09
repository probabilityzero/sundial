import React, { useState, useRef, useEffect } from 'react';
import NewSessionTagsPopover from '../ui/NewSessionTagsPopover';
import { useUserSettingsStore } from '../../store/useUserSettingsStore';
import { useSessionStore } from '../../store/useSessionStore';

interface SessionTagProps {
  emoji: string;
}

const SessionTag: React.FC<SessionTagProps> = ({ emoji }) => {
  const [isTagsPopoverOpen, setIsTagsPopoverOpen] = useState(false);
  const { availableTags } = useUserSettingsStore();
  const { setTag, startSession, isSessionActive } = useSessionStore();

  const handleTagClick = () => {
    setIsTagsPopoverOpen(prev => !prev);
  };

  const handleTagValueClick = async (newTag: string) => {
    setTag(newTag);
    setIsTagsPopoverOpen(false);
    if (!isSessionActive) {
      await startSession('New Session');
    }
  };

  return (
    <div className="relative p-1">
      <button
        className="text-gray-600 p-1 rounded-full focus:outline-none hover:bg-gray-100 active:bg-gray-100"
        onClick={handleTagClick}
      >
        <span style={{ fontSize: '1.5em' }}>{emoji}</span>
      </button>
      <NewSessionTagsPopover
        isOpen={isTagsPopoverOpen}
        onClose={() => setIsTagsPopoverOpen(false)}
        availableTags={availableTags}
        onTagClick={handleTagValueClick}
      />
    </div>
  );
};

export default SessionTag;
