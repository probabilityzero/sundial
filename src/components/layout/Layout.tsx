import React from 'react';
import { Header } from './Header';
import { Menu } from './Menu';
import { useSideMenu } from '../../store/useSideMenu';
import { MenuCompact } from './MenuCompact';
import { motion } from 'framer-motion';
import ControlPanel from './ControlPanel';

interface LayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export function Layout({ children, pageTitle }: LayoutProps) {
  const { isMenuOpen, closeMenu } = useSideMenu();
  const [isCompactMenu, setIsCompactMenu] = React.useState(false); // default to normal menu
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleCompactMenu = () => {
    setIsCompactMenu(!isCompactMenu);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex">
      {!isCompactMenu && (
        <Menu
          isOpen={isMenuOpen}
          onClose={closeMenu}
          isCompact={isCompactMenu}
          toggleCompact={toggleCompactMenu}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}
      {isCompactMenu && (
        <MenuCompact
          isCompact={isCompactMenu}
          toggleCompact={toggleCompactMenu}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}

      
      <div
        className="flex-grow flex flex-col"
        style={{
          marginLeft: isCompactMenu ? '4%' : '0%',
          transition: 'margin-left 0.3s ease'
        }}
      >
        <Header pageTitle={pageTitle} isCompact={isCompactMenu} toggleCompactMenu={toggleCompactMenu} />
        <main className="mx-auto">
          <div className='mt-12'>
          {children}
          </div>
        </main>
      </div>
      {isMenuOpen && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-25 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={closeMenu} // Use closeMenu to close the menu
        />
      )}
    </main>
  );
}
