import React from 'react';
import { ArrowLeft, Menu as MenuIcon, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSideMenu } from '../../store/useSideMenu';

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
                <button
                  onClick={handleBackClick}
                  className="p-2 hover:bg-gray-100 rounded-md flex items-center justify-center h-full w-full"
                  aria-label="Back"
                  style={{ marginLeft: '0px' }} // Ensure no margin
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <div className="w-14 h-14 flex items-center justify-center">
                <button
                  onClick={toggleMenu}
                  className="p-2 hover:bg-gray-100 rounded-md flex items-center justify-center h-full w-full"
                  aria-label="Menu"
                  style={{ marginLeft: '0px' }} // Ensure no margin
                >
                  <MenuIcon className="w-6 h-6" />
                </button>
              </div>
            )
          ) : (
            <div className="w-14 h-14 flex items-center justify-center">
              <button
                onClick={handleToggleCompact}
                className="p-2 hover:bg-gray-100 rounded-md flex items-center justify-center h-full w-full"
                aria-label="Menu"
                style={{ marginLeft: '0px' }} // Ensure no margin
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          )}
          <h1 className="text-xl font-semibold ml-2">{displayTitle}</h1>
        </div>
      </div>
    </header>
  );
}