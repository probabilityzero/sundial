import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

// Define proper types for FeatureCard props
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

const Welcome = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => 
    document.body.classList.contains('dark') || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      document.body.classList.toggle('dark', newMode);
      return newMode;
    });
  };

  useEffect(() => {
    // Apply dark mode on first load
    document.body.classList.toggle('dark', darkMode);
  }, []);

  // Background animation components
  const BackgroundShapes = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
      
      {/* Animated shapes */}
      <motion.div 
        className="absolute top-32 right-[10%] w-64 h-64 rounded-full bg-primary/10 blur-3xl"
        animate={{ 
          x: [0, 30, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 20,
          ease: "easeInOut" 
        }}
      />
      
      <motion.div 
        className="absolute bottom-32 left-[10%] w-80 h-80 rounded-full bg-accent/10 blur-3xl"
        animate={{ 
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 25,
          ease: "easeInOut" 
        }}
      />
      
      <motion.div 
        className="absolute top-[20%] left-[30%] w-40 h-40 rounded-full bg-secondary/10 blur-3xl"
        animate={{ 
          x: [0, 50, 0],
          y: [0, 20, 0],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 15,
          ease: "easeInOut" 
        }}
      />
      
      {/* Fine grain texture overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
    </div>
  );

  // App visualization component
  const AppVisualization = () => (
    <motion.div 
      className="relative w-full max-w-2xl aspect-[3/2] rounded-2xl overflow-hidden bg-surface/60 backdrop-blur-md border border-border/30 shadow-xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
    >
      <div className="absolute top-0 left-0 right-0 h-12 bg-background/30 backdrop-blur-sm border-b border-border/20 flex items-center px-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-error/80"></div>
          <div className="w-3 h-3 rounded-full bg-warning/80"></div>
          <div className="w-3 h-3 rounded-full bg-success/80"></div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-3 py-1 rounded-full bg-background/30 text-xs font-medium">Sundial Focus Session</div>
        </div>
      </div>
      
      <div className="absolute inset-0 mt-12 p-6 flex">
        <div className="w-1/2 flex flex-col pr-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary mb-1">Today's Focus</h3>
            <p className="text-sm text-text-secondary">Complete project milestones</p>
          </div>
          
          <div className="flex-1 bg-background/40 backdrop-blur-sm rounded-lg p-4 border border-border/20">
            <h4 className="text-md font-medium mb-3 text-text-primary">Tasks</h4>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <motion.div 
                  className="w-5 h-5 rounded-md border-2 border-completed mr-3 flex items-center justify-center"
                  initial={{ background: "transparent" }}
                  animate={{ background: "var(--color-completed)" }}
                  transition={{ delay: 1, duration: 0.3 }}
                >
                  <motion.svg 
                    viewBox="0 0 24 24" 
                    className="w-3 h-3 text-white"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1, duration: 0.3 }}
                  >
                    <motion.path 
                      d="M5 13l4 4L19 7" 
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1.2, duration: 0.5 }}
                    />
                  </motion.svg>
                </motion.div>
                <div className="flex-1">
                  <div className="h-5 bg-text-tertiary/20 rounded w-full"></div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-md border-2 border-active mr-3 bg-active flex items-center justify-center">
                  <motion.div 
                    className="w-2 h-2 bg-surface rounded-sm"
                    animate={{ 
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="h-5 bg-primary/30 rounded w-full"></div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-md border-2 border-pending mr-3"></div>
                <div className="flex-1">
                  <div className="h-5 bg-text-tertiary/20 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-1/2 flex flex-col items-center justify-center">
          <motion.div 
            className="w-40 h-40 rounded-full border-8 border-focus flex items-center justify-center relative"
            initial={{ borderWidth: 2 }}
            animate={{ borderWidth: 8 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.div 
              className="absolute inset-0 rounded-full"
              initial={{ background: "conic-gradient(var(--color-focus) 0%, transparent 0%)" }}
              animate={{ background: "conic-gradient(var(--color-focus) 75%, transparent 0%)" }}
              transition={{ delay: 0.8, duration: 5 }}
              style={{ clipPath: "circle(50% at center)" }}
            />
            
            <div className="bg-surface/80 backdrop-blur-sm rounded-full w-[calc(100%-16px)] h-[calc(100%-16px)] flex items-center justify-center z-10">
              <motion.div
                className="text-2xl font-mono font-semibold text-text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                18:45
              </motion.div>
            </div>
          </motion.div>
          
          <div className="flex mt-8 space-x-3">
            <motion.button 
              className="px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Pause
            </motion.button>
            <motion.button 
              className="px-4 py-1.5 rounded-full bg-background/40 backdrop-blur-sm text-text-secondary text-sm font-medium border border-border/40"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Stop
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Features component with proper TypeScript props
  const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => (
    <motion.div 
      className="bg-surface/60 backdrop-blur-sm border border-border/20 p-8 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ translateY: -5 }}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full translate-x-20 -translate-y-20 group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="text-4xl mb-5 relative z-10">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 relative z-10">{title}</h3>
      <p className="text-text-secondary relative z-10">{description}</p>
    </motion.div>
  );

  return (
    <div className="min-h-dvh bg-background text-text-primary">
      {/* Theme toggle button (fixed position) */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 flex items-center p-0.5 rounded-full bg-surface/80 backdrop-blur-md border border-border/30 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.div 
          className="absolute w-6 h-6 rounded-full bg-primary z-0"
          initial={{ x: darkMode ? 24 : 0 }}
          animate={{ x: darkMode ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
        
        <button 
          className={`w-6 h-6 flex items-center justify-center rounded-full z-10 ${!darkMode ? 'text-primary-contrast' : 'text-text-secondary'}`}
          onClick={() => toggleDarkMode()}
          aria-label="Switch to light mode"
        >
          <Sun className="w-3.5 h-3.5" />
        </button>
        <button 
          className={`w-6 h-6 flex items-center justify-center rounded-full z-10 ${darkMode ? 'text-primary-contrast' : 'text-text-secondary'}`}
          onClick={() => toggleDarkMode()}
          aria-label="Switch to dark mode"
        >
          <Moon className="w-3.5 h-3.5" />
        </button>
      </motion.div>
      
      {/* Background elements */}
      <BackgroundShapes />
      
      {/* Hero Section - Full height */}
      <section className="min-h-screen relative flex flex-col">
        <header className="pt-6 md:pt-8 px-6 md:px-10 flex justify-between items-center">
          <motion.div 
            className="text-2xl font-bold flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary">Sundial</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/auth?mode=signin">
              <button className="px-5 py-2 rounded-lg text-text-secondary hover:text-text-primary transition-colors">
                Sign In
              </button>
            </Link>
          </motion.div>
        </header>
        
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-12 px-6 md:px-10 max-w-7xl mx-auto w-full">
          {/* Left Content */}
          <motion.div 
            className="flex-1 max-w-xl lg:max-w-2xl pt-8 lg:pt-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
            >
              Master your time, <br/>
              <span className="text-primary">elevate your focus</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-text-secondary mb-8 leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Sundial helps you achieve deep work through structured focus sessions, 
              intuitive task management, and insightful analytics.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Link to="/auth?mode=signup">
                <motion.button 
                  className="px-8 py-3.5 bg-primary text-primary-contrast border rounded-xl font-medium text-base md:text-lg shadow-lg shadow-primary/20 transition-all duration-300"
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 10px 25px -5px rgba(var(--color-primary-rgb), 0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Right Content - App Preview */}
          <div className="flex-1 w-full max-w-2xl lg:max-w-3xl flex justify-center items-center pt-8 lg:pt-0">
            <AppVisualization />
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <p className="text-text-secondary mb-2 text-sm">Discover Features</p>
          <motion.div 
            className="w-6 h-10 rounded-full border-2 border-text-secondary/30 flex justify-center p-1"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <motion.div className="w-1.5 h-1.5 bg-text-secondary rounded-full"/>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6 md:px-10 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Designed for <span className="text-primary">deep work</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Every feature is carefully crafted to help you achieve flow state and maximize your productivity.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon="⏱️"
              title="Focus Sessions"
              description="Stay in flow with customizable time sessions inspired by proven productivity techniques."
              delay={0.1}
            />
            <FeatureCard 
              icon="📋"
              title="Task Management"
              description="Organize your work with intuitive task tracking, priorities, and deadlines."
              delay={0.2}
            />
            <FeatureCard 
              icon="📊"
              title="Visual Analytics"
              description="Gain insights into your productivity patterns with beautiful visual reports."
              delay={0.3}
            />
            <FeatureCard 
              icon="📅"
              title="Calendar Integration"
              description="Plan your day effectively by syncing tasks with your personal calendar."
              delay={0.4}
            />
            <FeatureCard 
              icon=""
              title="Cross-Device Sync"
              description="Access your tasks and sessions from any device, always stay in sync."
              delay={0.6}
            />
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <motion.div 
          className="absolute -right-64 top-0 bottom-0 w-96 bg-primary/10 blur-3xl rounded-full"
          animate={{ 
            x: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15,
          }}
        />
        
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Ready to transform your productivity?
          </motion.h2>
          <motion.p 
            className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Start your journey to deeper focus and better time management today.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/auth?mode=signup">
              <motion.button 
                className="px-8 py-3.5 bg-primary text-primary-contrast rounded-xl border font-medium text-lg shadow-lg shadow-primary/20 border border-border/50 "
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 10px 25px -5px rgba(var(--color-primary-rgb), 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-4 text-xs border-t border-border/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center">
          <div className="text-text-secondary mb-4 md:mb-0">
            © {new Date().getFullYear()} Sundial. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-text-secondary hover:text-primary transition-colors">Terms</a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;