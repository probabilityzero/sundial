import React from 'react';
import { Image, ListChecks } from 'lucide-react';

interface ControlPanelNavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ControlPanelNavbar: React.FC<ControlPanelNavbarProps> = ({ activeSection, setActiveSection }) => {
  return (
    <nav className="flex pb-0 p-1 border-b">
      <button
        className={`p-1 ${activeSection === 'circleColor' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        onClick={() => setActiveSection('circleColor')}
      >
        <Image className="w-5 h-5" />
      </button>
      <button
        className={`p-1 ${activeSection === 'emojiTag' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        onClick={() => setActiveSection('emojiTag')}
      >
        <ListChecks className="w-5 h-5" />
      </button>
    </nav>
  );
};

export default ControlPanelNavbar;
