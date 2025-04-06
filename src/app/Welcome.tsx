import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Welcome = () => {
  return (
    <div className="min-h-dvh bg-background text-text-primary flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 lg:px-16 py-12 gap-12 max-w-7xl mx-auto">
        {/* Left Content */}
        <motion.div 
          className="flex-1 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Focus on what <span className="text-primary">matters most</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-text-secondary mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Sol helps you manage your time effectively with structured focus sessions, 
            intuitive task management, and insightful analytics to maximize your productivity.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link to="/auth" className="inline-block">
              <motion.button 
                className="px-8 py-3 bg-primary text-primary-contrast rounded-lg font-medium text-base md:text-lg transition-transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            </Link>
            <a href="#features" className="inline-block">
              <motion.button 
                className="px-8 py-3 border border-border bg-transparent text-text-primary rounded-lg font-medium text-base md:text-lg transition-transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More
              </motion.button>
            </a>
          </motion.div>
        </motion.div>
        
        {/* Right Content - App Preview */}
        <motion.div 
          className="flex-1 max-w-xl w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="w-full aspect-[3/2] rounded-xl bg-surface shadow-xl overflow-hidden relative">
            {/* App preview image would go here */}
            <div className="absolute inset-0 flex items-center justify-center bg-surface">
              <div className="w-full h-full p-6 flex flex-col">
                {/* Mock timer circle */}
                <div className="mx-auto my-6 w-36 h-36 rounded-full border-8 border-focus flex items-center justify-center">
                  <div className="text-2xl font-mono font-semibold">25:00</div>
                </div>
                
                {/* Mock task list */}
                <div className="flex-1 bg-background rounded-lg p-4 mt-4">
                  <div className="flex items-center mb-3">
                    <div className="w-4 h-4 rounded-full border-2 border-completed mr-3"></div>
                    <div className="flex-1 h-6 bg-border opacity-20 rounded"></div>
                  </div>
                  <div className="flex items-center mb-3">
                    <div className="w-4 h-4 rounded-full border-2 border-active mr-3"></div>
                    <div className="flex-1 h-6 bg-primary opacity-30 rounded"></div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-pending mr-3"></div>
                    <div className="flex-1 h-6 bg-border opacity-20 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      
      {/* Features Section */}
      <section id="features" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Features designed for <span className="text-primary">deep work</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Focus Sessions",
                description: "Stay in flow with customizable time sessions inspired by proven productivity techniques.",
                icon: "⏱️"
              },
              {
                title: "Task Management",
                description: "Organize your work with intuitive task tracking, priorities, and deadlines.",
                icon: "📋"
              },
              {
                title: "Visual Analytics",
                description: "Gain insights into your productivity patterns with beautiful visual reports.",
                icon: "📊"
              },
              {
                title: "Calendar Integration",
                description: "Plan your day effectively by syncing tasks with your personal calendar.",
                icon: "📅"
              },
              {
                title: "Dark & Light Themes",
                description: "Work comfortably in any environment with automatic theme switching.",
                icon: "🌓"
              },
              {
                title: "Cross-Device Sync",
                description: "Access your tasks and sessions from any device, always stay in sync.",
                icon: "🔄"
              },
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-surface p-6 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-surface">
        <div className="max-w-3xl mx-auto text-center px-6">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Ready to maximize your productivity?
          </motion.h2>
          <motion.p 
            className="text-lg text-text-secondary mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Join thousands of users who have transformed their work habits with Sol.
          </motion.p>
          <Link to="/auth">
            <motion.button 
              className="px-8 py-3 bg-primary text-primary-contrast rounded-lg font-medium text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Your Journey
            </motion.button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 flex flex-col md:flex-row justify-between items-center">
          <div className="text-text-secondary mb-4 md:mb-0">
            © {new Date().getFullYear()} Sol by Epsilon. All rights reserved.
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