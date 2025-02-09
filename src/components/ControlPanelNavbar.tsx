import React from 'react';
import { Circle, ListChecks } from 'lucide-react';

interface ControlPanelNavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ControlPanelNavbar: React.FC<ControlPanelNavbarProps> = ({ activeSection, setActiveSection }) => {
  return (
    <nav className="flex space-x-4">
      <button
        className={`p-2 rounded-md ${activeSection === 'circleColor' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        onClick={() => setActiveSection('circleColor')}
      >
        <Circle className="w-5 h-5" />
      </button>
      <button
        className={`p-2 rounded-md ${activeSection === 'emojiTag' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        onClick={() => setActiveSection('emojiTag')}
      >
        <ListChecks className="w-5 h-5" />
      </button>
    </nav>
  );
};

export default ControlPanelNavbar;
