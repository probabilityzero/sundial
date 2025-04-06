import React, { useState, useEffect } from 'react';
import { ArrowLeft, Menu as MenuIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSideMenu } from '../store/useSideMenu';
import SessionTimer from '../components/ui/SessionTimer';
import { useSessionStore } from '../store/useSessionStore';
import { useAuthStore } from '../store/useAuthStore';
import SessionTag from './SessionTag';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from './ControlPanel';

interface HeaderProps {
  pageTitle: string;
  isCompact: boolean;
  toggleCompactMenu: () => void;
}

export function Header({ pageTitle, isCompact, toggleCompactMenu }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/';
  const { toggleMenu, openMenu } = useSideMenu(); // Make sure openMenu is available
  const { pauseSession, resumeSession, resetSession, isSessionActive, isPaused, startTime } = useSessionStore();
  const { user } = useAuthStore();
  const [isTransforming, setIsTransforming] = useState(false);

  const handleBackClick = () => {
    setIsTransforming(true);
    setTimeout(() => {
      navigate('/');
    }, 300);
  };

  const handleToggleCompact = () => {
    if (isCompact) {
      toggleCompactMenu(); // First switch to full menu
      setTimeout(() => {
        openMenu(); // Then open the menu
      }, 50);
    } else {
      toggleMenu(); // Toggle menu visibility
    }
  };

  const displayTitle = pageTitle;

  useEffect(() => {
    setIsTransforming(false);
  }, [location]);

  return (
    <header className="fixed top-0 left-0 w-full backdrop-blur-md bg-background bg-opacity-80 border-b border-border z-30">
      <div className="w-full h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {!isCompact ? (
            !isDashboard ? (
              <motion.button
                onClick={handleBackClick}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:bg-surface transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: isTransforming ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="relative w-5 h-5"
                >
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isTransforming ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowLeft className="w-5 h-5 absolute" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isTransforming ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MenuIcon className="w-5 h-5 absolute" />
                  </motion.div>
                </motion.div>
              </motion.button>
            ) : (
              <motion.button
                onClick={handleToggleCompact}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:bg-surface transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle menu"
              >
                <MenuIcon className="w-5 h-5" />
              </motion.button>
            )
          ) : (
            <motion.button
              onClick={handleToggleCompact}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:bg-surface transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              <MenuIcon className="w-5 h-5" />
            </motion.button>
          )}
          <h1 className="text-xl font-semibold text-text-primary">{displayTitle}</h1>
          <AnimatePresence>
            {isSessionActive && <SessionTag />}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {isSessionActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <SessionTimer
                  startTime={startTime}
                  onPause={pauseSession}
                  onResume={resumeSession}
                  onReset={resetSession}
                  isPaused={isPaused}
                  isSessionActive={isSessionActive}
                />
              </motion.div>
            )}
          </AnimatePresence>
          {user && <ControlPanel />}
        </div>
      </div>
    </header>
  );
}
