import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, User, Bell, Shield, Palette, Globe, Smartphone, Zap, HelpCircle } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import ToggleSwitch from '../ui/ToggleSwitch';

interface SettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onClick?: (e: React.MouseEvent) => void;
}

// Define settings sections
const settingsSections = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'language', label: 'Language & Region', icon: Globe },
  { id: 'mobile', label: 'Mobile App', icon: Smartphone },
  { id: 'performance', label: 'Performance', icon: Zap },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

export function SettingsPopup({ isOpen, onClose, onClick }: SettingsPopupProps) {
  const [activeSection, setActiveSection] = useState('account');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(document.body.classList.contains('dark'));
  
  // Clean up event listeners on unmount
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling on body when popup is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
  
  // Handle mobile navigation
  useEffect(() => {
    if (isMobile && isOpen) {
      navigate('/settings');
      onClose();
    }
  }, [isMobile, isOpen, navigate, onClose]);

  // Toggle theme
  const toggleTheme = () => {
    document.body.classList.toggle('dark');
    setIsDark(document.body.classList.contains('dark'));
  };

  if (isMobile) return null; // Don't render on mobile - we use the Settings page instead

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      
      {/* Settings Modal */}
      <div 
        className="relative z-10 bg-surface rounded-xl shadow-xl w-11/12 max-w-4xl h-4/5 max-h-[700px] overflow-hidden flex"
        onClick={onClick || ((e) => e.stopPropagation())}
      >
        {/* Close button */}
        <button 
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-md text-text-secondary hover:bg-background transition-all duration-200 z-20"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Left Sidebar */}
        <div className="w-64 border-r border-border h-full overflow-y-auto p-4 bg-surface">
          <h2 className="text-xl font-semibold mb-6 text-text-primary pl-2">Settings</h2>
          <nav className="space-y-1">
            {settingsSections.map((section) => {
              const SectionIcon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left
                    ${isActive 
                      ? 'bg-primary/20 text-primary' 
                      : 'text-text-secondary hover:bg-background hover:text-text-primary'}
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSection(section.id);
                  }}
                >
                  <SectionIcon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 h-full overflow-y-auto p-6 bg-background">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {/* Render settings based on activeSection */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-text-primary">
                  {settingsSections.find(s => s.id === activeSection)?.label}
                </h2>
                <p className="text-text-secondary mt-1">
                  Manage your {settingsSections.find(s => s.id === activeSection)?.label.toLowerCase()} settings
                </p>
              </div>
              
              {/* Example settings for Appearance section */}
              {activeSection === 'appearance' && (
                <div className="space-y-6">
                  <div className="bg-surface rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-text-primary">Theme</h3>
                        <p className="text-sm text-text-secondary mt-1">Choose between light and dark theme</p>
                      </div>
                      <ToggleSwitch 
                        isChecked={isDark} 
                        onChange={toggleTheme}
                        size="md"
                        label={isDark ? "Dark" : "Light"}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-surface rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-text-primary">Font Size</h3>
                        <p className="text-sm text-text-secondary mt-1">Adjust the text size</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 rounded border border-border text-sm">A-</button>
                        <button className="px-3 py-1 rounded border border-border text-sm">A+</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-surface rounded-lg p-4">
                    <div>
                      <h3 className="font-medium text-text-primary">Color Accent</h3>
                      <p className="text-sm text-text-secondary mt-1">Select a custom accent color</p>
                      <div className="flex gap-3 mt-3">
                        {['#94a3b8', '#a7c080', '#e0c097', '#c17c7c', '#c49a6c'].map((color) => (
                          <button 
                            key={color}
                            className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Account section */}
              {activeSection === 'account' && (
                <div className="space-y-6">
                  <div className="bg-surface rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                        <span className="text-primary text-2xl font-bold">JD</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-text-primary">John Doe</h3>
                        <p className="text-sm text-text-secondary mt-1">john.doe@example.com</p>
                        <button className="mt-2 px-3 py-1 text-sm rounded border border-border text-text-primary hover:bg-background transition-colors">
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-surface rounded-lg p-4">
                    <h3 className="font-medium text-text-primary mb-3">Account Information</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-text-secondary">Email</span>
                        <span className="text-text-primary">john.doe@example.com</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-text-secondary">Password</span>
                        <button className="text-primary text-sm">Change</button>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-text-secondary">Two-factor authentication</span>
                        <ToggleSwitch isChecked={false} onChange={() => {}} size="sm" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Placeholder for other sections */}
              {activeSection !== 'appearance' && activeSection !== 'account' && (
                <div className="h-full flex flex-col items-center justify-center text-text-secondary bg-surface rounded-lg p-8">
                  <p className="text-lg">{settingsSections.find(s => s.id === activeSection)?.label} settings coming soon</p>
                  <p className="mt-2">This section is currently under development</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}