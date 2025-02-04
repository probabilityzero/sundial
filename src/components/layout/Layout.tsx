import React from 'react';
import { Header } from './Header';
import { SideMenu } from './SideMenu';
import { useSideMenu } from '../../store/useSideMenu';
import { CompactSideMenu } from './CompactSideMenu';

interface LayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export function Layout({ children, pageTitle }: LayoutProps) {
  const { isMenuOpen, closeMenu } = useSideMenu();
  const [isCompactMenu, setIsCompactMenu]  = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleCompactMenu = () => {
    setIsCompactMenu(!isCompactMenu);
  }
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };


  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        isCompact={isCompactMenu}
        toggleCompact={toggleCompactMenu} // Pass toggleCompactMenu to SideMenu
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      {isCompactMenu && <CompactSideMenu isCompact={isCompactMenu} toggleCompact={toggleCompactMenu} darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> }
      <div className="flex-grow flex flex-col" style={{ marginLeft: isCompactMenu ? '56px' : '0px' }}>
          <Header pageTitle={pageTitle} isCompact={isCompactMenu} />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
      </div>
    </div>
  );
}
