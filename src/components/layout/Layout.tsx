import React from 'react';
import { Header } from './Header';
import { SideMenu } from './SideMenu';
import { useSideMenu } from '../../store/useSideMenu';
import { CompactSideMenu } from './SideMenuCompact';

interface LayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export function Layout({ children, pageTitle }: LayoutProps) {
  const { isMenuOpen, closeMenu } = useSideMenu();
  const [isCompactMenu, setIsCompactMenu]  = React.useState(false); // default to normal menu
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleCompactMenu = () => {
    setIsCompactMenu(!isCompactMenu);
  }
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {!isCompactMenu && <SideMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        isCompact={isCompactMenu}
        toggleCompact={toggleCompactMenu}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />}
      {isCompactMenu && <CompactSideMenu isCompact={isCompactMenu} toggleCompact={toggleCompactMenu} darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> }
      <div className="flex-grow flex flex-col" style={{ marginLeft: !isCompactMenu ? '256px' : '56px' }}>
          <Header pageTitle={pageTitle} isCompact={isCompactMenu} toggleCompactMenu={toggleCompactMenu} />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
      </div>
    </div>
  );
}