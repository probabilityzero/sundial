import React from 'react';
import { ArrowLeft, Menu as MenuIcon, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSideMenu } from '../../store/useSideMenu';
import { IconButton } from './IconButton'; // Import IconButton

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

  const handleBackClick = () => {
    navigate('/');
  };
  const handleToggleCompact = () => {
    toggleCompactMenu();
  };
  const handleGoHome = () => {
    navigate('/');
  };

  const displayTitle = isDashboard ? 'Session' : pageTitle;

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 w-full z-30">
      <div className="w-full h-14 flex items-center"> {/* Container */}
        <div className="flex items-center h-full" style={{ minWidth: '3.5rem' }}> {/* Button container */}
          {!isCompact ? (
            !isDashboard ? (
              <div className="w-14 h-14 flex items-center justify-center">
                <IconButton
                  onClick={handleBackClick}
                  icon={<ArrowLeft className="w-6 h-6" />}
                />
              </div>
            ) : (
              <div className="w-14 h-14 flex items-center justify-center">
                <IconButton
                  onClick={toggleMenu}
                  icon={<MenuIcon className="w-6 h-6" />}
                />
              </div>
            )
          ) : (
            <div className="w-14 h-14 flex items-center justify-center">
              <IconButton
                onClick={handleToggleCompact}
                icon={<MenuIcon className="w-6 h-6" />}
              />
            </div>
          )}
          <h1 className="text-xl font-semibold ml-2">{displayTitle}</h1>
        </div>
      </div>
    </header>
  );
}

