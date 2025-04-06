import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn, signUp, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (isSignUp) {
        if (!name) {
          throw new Error('Please enter your name');
        }
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Link to="/" className="block text-center mb-8">
          <motion.div 
            className="inline-block"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-3xl font-bold text-primary">Sol</span>
          </motion.div>
        </Link>
        
        <motion.div 
          className="bg-surface rounded-xl shadow-lg p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary opacity-10"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-accent opacity-10"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            
            <AnimatePresence mode="wait">
              <motion.form 
                key={isSignUp ? 'signup' : 'signin'}
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isSignUp ? -20 : 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {isSignUp && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-input-border bg-input-background text-input-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Your name"
                    />
                  </div>
                )}
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email address</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-input-border bg-input-background text-input-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-input-border bg-input-background text-input-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder={isSignUp ? "Create a password" : "Enter your password"}
                    required
                  />
                </div>
                
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      className="text-sm text-error bg-error bg-opacity-10 p-3 rounded-md"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-base font-medium text-primary-contrast bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-70"
                  >
                    {loading ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      isSignUp ? 'Create Account' : 'Sign In'
                    )}
                  </button>
                </div>
              </motion.form>
            </AnimatePresence>
            
            <div className="mt-6 text-sm text-center">
              <span className="text-text-secondary">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </span>
              <button 
                onClick={toggleMode} 
                className="ml-1 text-primary hover:text-primary-dark focus:outline-none transition-colors"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </div>
          </div>
        </motion.div>
        
        <p className="mt-6 text-center text-sm text-text-tertiary">
          By using Sol, you agree to our
          <a href="#" className="ml-1 text-primary hover:text-primary-dark">Terms of Service</a>
          <span className="mx-1">and</span>
          <a href="#" className="text-primary hover:text-primary-dark">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Auth;
