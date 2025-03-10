import React, { useState, useEffect } from 'react';
import { ArrowLeft, Menu as MenuIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSideMenu } from '../../store/useSideMenu';
import { MenuItemIcon } from '../ui/MenuItemIcon';
import ControlPanel from './ControlPanel';
import SessionTimer from '../ui/SessionTimer';
import { useSessionStore } from '../../store/useSessionStore';
import { useAuthStore } from '../../store/useAuthStore';
import SessionTag from './SessionTag';
import { motion } from 'framer-motion';

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
  const { pauseSession, resumeSession, resetSession, isSessionActive, isPaused, startTime, resetSession: onReset } = useSessionStore();
  const { user } = useAuthStore(); // Get user from AuthStore
  const cornericon = 'w-14 h-12 flex items-center justify-center px-2';

  const [isTransforming, setIsTransforming] = useState(false); // Track transformation state

  const handleBackClick = () => {
    setIsTransforming(true); // Start the transformation
    setTimeout(() => {
      navigate('/'); // After rotation, navigate to the home page
    }, 300); // Wait for the transformation to complete before navigation
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

  const displayTitle = isDashboard ? 'Sundial' : pageTitle;

  useEffect(() => {
    // Reset transformation on page change
    setIsTransforming(false); // Reset transformation state
  }, [location]);

  return (
    <header className="backdrop-filter backdrop-blur-md shadow-sm fixed top-0 left-0 w-full z-30">
      <div className="w-full h-12 flex items-center justify-between relative">
        <div className="flex items-center h-full" style={{ minWidth: '3.5rem' }}>
          {!isCompact ? (
            !isDashboard ? (
              <div className={cornericon}>
                <MenuItemIcon onClick={handleBackClick} icon={
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{
                      rotate: isTransforming ? 180 : 0, // Rotate the arrow to 180 degrees when transforming
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }} // Quick rotation transition
                    className="relative w-6 h-6"
                  >
                    {/* ArrowLeft icon */}
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      initial={{ opacity: 1 }}
                      animate={{
                        opacity: isTransforming ? 0 : 1, // Fade out ArrowLeft when transforming
                        rotate: isTransforming ? 180 : 0, // Rotate it to 180 degrees
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowLeft />
                    </motion.svg>

                    {/* MenuIcon, initially hidden */}
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute top-0 left-0 w-6 h-6"
                      initial={{ opacity: 0, rotate: -180 }} // Start MenuIcon hidden and rotated
                      animate={{
                        opacity: isTransforming ? 1 : 0, // Fade in MenuIcon after rotation
                        rotate: isTransforming ? 0 : -180, // Rotate it to 0 when visible
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <MenuIcon />
                    </motion.svg>
                  </motion.div>
                } />
              </div>
            ) : (
              <div className={cornericon}>
                <MenuItemIcon onClick={handleToggleCompact} icon={<MenuIcon className="w-6 h-6" />} />
              </div>
            )
          ) : (
            <div className={cornericon}>
              <MenuItemIcon onClick={handleToggleCompact} icon={<MenuIcon className="w-6 h-6" />} />
            </div>
          )}
          <h1 className="text-xl font-medium">{displayTitle}</h1>
          <SessionTag />
        </div>
        <div className="flex items-center h-full">
          {isSessionActive && (
            <div className="flex-grow flex justify-end items-center space-x-2">
              <SessionTimer
                startTime={startTime}
                onPause={pauseSession}
                onResume={resumeSession}
                onReset={onReset}
                isPaused={isPaused}
                isSessionActive={isSessionActive}
              />
            </div>
          )}
          {user && <ControlPanel />}
        </div>
      </div>
    </header>
  );
}
