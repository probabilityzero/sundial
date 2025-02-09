import React, { useState, useEffect } from 'react';
import { ArrowLeft, Menu as MenuIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSideMenu } from '../../store/useSideMenu';
import { MenuItemIcon } from '../ui/MenuItemIcon';
import ControlPanel from './ControlPanel';
import Timer from '../ui/Timer';
import { useSessionStore } from '../../store/useSessionStore';
import TagsPopover from '../TagsPopover';
import EmojiTag from '../EmojiTag';
import { useUserSettingsStore } from '../../store/useUserSettingsStore';

interface HeaderProps {
  pageTitle: string;
  isCompact: boolean;
  toggleCompactMenu: () => void;
}

export function Header({ pageTitle, isCompact, toggleCompactMenu }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/';
  const { toggleMenu } = useSideMenu();
  const { pauseSession, resumeSession, resetSession, isSessionActive, isPaused, startTime, dimension, setDimension, startSession } = useSessionStore();
  const { availableTags } = useUserSettingsStore();
  const [isTagsPopoverOpen, setIsTagsPopoverOpen] = useState(false);

  const handleBackClick = () => {
    navigate('/');
  };

  const handleToggleCompact = () => {
    if (isCompact) {
      toggleMenu();
      setTimeout(() => {
        toggleCompactMenu();
      }, 200);
    } else {
      toggleMenu();
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const displayTitle = isDashboard ? 'Session' : pageTitle;

  const handleTagClick = () => {
    setIsTagsPopoverOpen(!isTagsPopoverOpen);
  };

  const handleDimensionClick = async (newDimension: string) => {
    setDimension(newDimension);
    setIsTagsPopoverOpen(false);
    if (!isSessionActive) {
      await startSession('New Session'); // Start a new session with the default name
    }
  };

  const dimensionEmojis = {
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

  const getEmoji = () => {
    return dimension ? dimensionEmojis[dimension] : '⚪';
  };

  return (
    <header className="backdrop-filter backdrop-blur-md shadow-sm fixed top-0 left-0 w-full z-30">
      <div className="w-full h-12 flex items-center justify-between relative">
        {/* Container */}
        <div className="flex items-center h-full" style={{ minWidth: '3.5rem' }}>
          {/* Button container */}
          {!isCompact ? (
            !isDashboard ? (
              <div className="w-14 h-14 flex items-center justify-center">
                <MenuItemIcon onClick={handleBackClick} icon={<ArrowLeft className="w-6 h-6" />} />
              </div>
            ) : (
              <div className="w-14 h-14 flex items-center justify-center">
                <MenuItemIcon onClick={handleToggleCompact} icon={<MenuIcon className="w-6 h-6" />} />
              </div>
            )
          ) : (
            <div className="w-14 h-14 flex items-center justify-center">
              <MenuItemIcon onClick={handleToggleCompact} icon={<MenuIcon className="w-6 h-6" />} />
            </div>
          )}
          <h1 className="text-xl font-semibold">{displayTitle}</h1>
          <EmojiTag onClick={handleTagClick} emoji={getEmoji()} />
          <TagsPopover
            isOpen={isTagsPopoverOpen}
            onClose={() => setIsTagsPopoverOpen(false)}
            availableTags={availableTags}
            onTagClick={handleDimensionClick}
            dimensionEmojis={dimensionEmojis}
          />
        </div>
        {/* Timer */}
        {isSessionActive && startTime && (
          <div className="flex-grow flex justify-end items-center space-x-4">
            <Timer
              startTime={startTime}
              onPause={pauseSession}
              onResume={resumeSession}
              isPaused={isPaused}
              isSessionActive={isSessionActive}
            />
          </div>
        )}
        {/* Control Panel */}
        <ControlPanel />
      </div>
    </header>
  );
}
