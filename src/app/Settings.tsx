import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, User, Bell, Shield, Palette, Globe, Smartphone, Zap, HelpCircle } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';
import ToggleSwitch from '../components/ui/ToggleSwitch';

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

const Settings = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleBack = () => {
    if (activeSection) {
      setActiveSection(null);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      {/* Mobile Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={handleBack}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary bg-surface"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold">
          {activeSection 
            ? settingsSections.find(s => s.id === activeSection)?.label 
            : 'Settings'}
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {/* Settings List View */}
        {!activeSection ? (
          <motion.div
            key="settings-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-2"
          >
            {settingsSections.map((section) => {
              const SectionIcon = section.icon;
              
              return (
                <button
                  key={section.id}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-surface text-left"
                  onClick={() => setActiveSection(section.id)}
                >
                  <div className="flex items-center gap-3">
                    <SectionIcon className="w-5 h-5 text-text-secondary" />
                    <span className="font-medium text-text-primary">{section.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-secondary" />
                </button>
              );
            })}
          </motion.div>
        ) : (
          // Settings Section Detail View
          <motion.div
            key={`section-${activeSection}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Appearance Section */}
            {activeSection === 'appearance' && (
              <div className="space-y-4">
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
                      {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map((color) => (
                        <button 
                          key={color}
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-surface rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-text-primary">Animations</h3>
                      <p className="text-sm text-text-secondary mt-1">Enable or disable UI animations</p>
                    </div>
                    <ToggleSwitch 
                      isChecked={true} 
                      onChange={() => {}}
                      size="md"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Account Section */}
            {activeSection === 'account' && (
              <div className="space-y-4">
                <div className="bg-surface rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                      <span className="text-primary text-xl font-bold">JD</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-text-primary">John Doe</h3>
                      <p className="text-sm text-text-secondary">john.doe@example.com</p>
                    </div>
                  </div>
                  <button className="mt-3 w-full py-2 rounded-lg border border-border text-text-primary">
                    Edit Profile
                  </button>
                </div>
                
                <div className="bg-surface rounded-lg divide-y divide-border">
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-text-primary">Email</span>
                      <span className="text-text-secondary text-sm">john.doe@example.com</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-text-primary">Password</span>
                      <button className="text-primary text-sm">Change</button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-text-primary">Two-factor authentication</span>
                      <ToggleSwitch isChecked={false} onChange={() => {}} size="sm" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-surface rounded-lg p-4">
                  <h3 className="font-medium text-text-primary mb-3">Danger Zone</h3>
                  <button className="w-full py-2 rounded-lg border border-error text-error">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
            
            {/* Placeholder for other sections */}
            {activeSection !== 'appearance' && activeSection !== 'account' && (
              <div className="bg-surface rounded-lg p-8 flex flex-col items-center justify-center text-text-secondary">
                <p className="text-lg text-center">
                  {settingsSections.find(s => s.id === activeSection)?.label} settings are coming soon
                </p>
                <p className="mt-2 text-center">This is a placeholder for future implementation</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
