import React from 'react';
import { Moon, LayoutList } from 'lucide-react';

interface CompactMenuProps {
  isCompact: boolean;
  toggleCompact: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function CompactMenu({ isCompact, toggleCompact, darkMode, toggleDarkMode }: CompactMenuProps) {
  return (
    <div className=" p-2 flex  border-t ${isCompact ? 'p-1' : 'p-2'} items-center justify-between ${isCompact ? 'flex-col' : 'flex-row'}">
      {isCompact ? (
        <div className="flex flex-col items-center">
          <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg  justify-center flex items-center space-x-2 mb-1" onClick={toggleDarkMode}>
            <Moon className="w-6 h-6" />
          </button>
          <button
            onClick={toggleCompact}
            className={`p-2 text-gray-700 hover:bg-gray-100 rounded-lg  justify-center flex items-center space-x-2 ${isCompact ? 'bg-gray-100' : ''}`}
          >
            <LayoutList className="w-6 h-6" />
          </button>
        </div>
      ) : (
        <div className="flex items-center">
          <button
            onClick={toggleCompact}
            className={`p-2 text-gray-700 hover:bg-gray-100 rounded-lg  justify-center flex items-center space-x-2 ${isCompact ? 'bg-gray-100' : ''}`}
          >
            <LayoutList className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg  justify-center flex items-center space-x-2" onClick={toggleDarkMode}>
            <Moon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
