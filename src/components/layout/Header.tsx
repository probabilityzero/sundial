import React from 'react';
import { ArrowLeft, Menu as MenuIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSideMenu } from '../../store/useSideMenu';

interface HeaderProps {
  pageTitle: string;
  isCompact: boolean;
}

export function Header({ pageTitle, isCompact }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/';
  const { toggleMenu } = useSideMenu();

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {!isDashboard ? (
          <button
            onClick={handleBackClick}
            className="p-2 hover:bg-gray-100 rounded-md border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (!isCompact ?
          <button
            onClick={toggleMenu}
            className="p-2 hover:bg-gray-100 rounded-md border border-gray-200"
          >
            <MenuIcon className="w-5 h-5" />
          </button> : <div className="w-9"></div>
        )}
        <h1 className="text-xl font-semibold">{pageTitle}</h1>
        <div className="flex items-center">
        </div>
      </div>
    </header>
  );
}
