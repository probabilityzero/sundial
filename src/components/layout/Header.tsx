import React from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSideMenu } from '../../store/useSideMenu';

interface HeaderProps {
  pageTitle: string;
  isCompact: boolean;
}

export function Header({ pageTitle, isCompact }: HeaderProps) {
  const location = useLocation();
  const isDashboard = location.pathname === '/';
  const { toggleMenu } = useSideMenu();

  const displayTitle = isDashboard ? 'Session' : pageTitle;


  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto sm:px-6 lg:px-8 h-14 flex items-center justify-start px-4">
        <div className="flex items-center">
          {!isCompact && isDashboard && (
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-gray-100 rounded-md mr-2"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-xl font-semibold">{displayTitle}</h1>
        </div>
        <div className="flex items-center">
        </div>
      </div>
    </header>
  );
}
