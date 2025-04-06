import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaGithub, FaDiscord, FaApple } from 'react-icons/fa';
import { Mail, Lock, User, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Auth = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialMode = queryParams.get('mode') === 'signup' ? true : false;
  
  const [isSignUp, setIsSignUp] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn, signUp, user } = useAuthStore();
  const navigate = useNavigate();

  // Update URL when mode changes
  useEffect(() => {
    const newUrl = isSignUp ? '/auth?mode=signup' : '/auth?mode=signin';
    window.history.replaceState(null, '', newUrl);
  }, [isSignUp]);

  // Redirect if logged in
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

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'discord' | 'apple') => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
      });
      if (error) {
        setError(error.message);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
  };

  // Background animation shapes
  const BackgroundElements = () => (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/10 rounded-bl-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/10 rounded-tr-full blur-3xl"></div>
      
      <motion.div 
        className="absolute top-1/4 -left-20 w-60 h-60 bg-secondary/10 rounded-full blur-3xl"
        animate={{ 
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 20,
          ease: "easeInOut" 
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
        animate={{ 
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 25,
          ease: "easeInOut" 
        }}
      />
      
      {/* Fine grain texture overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.02]"></div>
    </div>
  );

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 relative">
      <BackgroundElements />
      
      <div className="max-w-md w-full relative z-10">
        <Link to="/" className="absolute top-0 left-0 flex items-center text-text-secondary hover:text-primary transition-colors -mt-12">
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span>Back to home</span>
        </Link>
        
        <div className="flex items-center justify-center mb-8">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
              <span className="text-primary font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold text-text-primary">Sundial</span>
          </motion.div>
        </div>
        
        <motion.div 
          className="bg-surface/80 backdrop-blur-md rounded-2xl shadow-xl p-8 relative overflow-hidden border border-border/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Decorative elements */}
          <div className="absolute -top-28 -right-28 w-56 h-56 rounded-full bg-primary/10"></div>
          <div className="absolute -bottom-28 -left-28 w-56 h-56 rounded-full bg-accent/10"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-lg bg-background/50 p-1 backdrop-blur-sm">
                <button
                  className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                    !isSignUp ? 'bg-primary text-primary-contrast shadow-sm' : 'text-text-secondary'
                  }`}
                  onClick={() => setIsSignUp(false)}
                >
                  Sign in
                </button>
                <button
                  className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                    isSignUp ? 'bg-primary text-primary-contrast shadow-sm' : 'text-text-secondary'
                  }`}
                  onClick={() => setIsSignUp(true)}
                >
                  Join
                </button>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            
            {/* Social sign-in buttons */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <motion.button
                className="flex justify-center items-center p-2.5 rounded-lg border border-border/50 hover:bg-background/50 transition-colors"
                onClick={() => handleOAuthSignIn('google')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
              >
                <FaGoogle className="h-5 w-5 text-text-primary" />
              </motion.button>
              
              <motion.button
                className="flex justify-center items-center p-2.5 rounded-lg border border-border/50 hover:bg-background/50 transition-colors"
                onClick={() => handleOAuthSignIn('github')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
              >
                <FaGithub className="h-5 w-5 text-text-primary" />
              </motion.button>
              
              <motion.button
                className="flex justify-center items-center p-2.5 rounded-lg border border-border/50 hover:bg-background/50 transition-colors"
                onClick={() => handleOAuthSignIn('discord')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
              >
                <FaDiscord className="h-5 w-5 text-text-primary" />
              </motion.button>
              
              <motion.button
                className="flex justify-center items-center p-2.5 rounded-lg border border-border/50 hover:bg-background/50 transition-colors"
                onClick={() => handleOAuthSignIn('apple')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
              >
                <FaApple className="h-5 w-5 text-text-primary" />
              </motion.button>
            </div>
            
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-surface text-text-tertiary">OR</span>
              </div>
            </div>
            
            {/* Form */}
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
                  <div className="space-y-1">
                    <label htmlFor="name" className="block text-sm font-medium text-text-secondary">
                      Name
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <User className="h-4 w-4 text-text-tertiary" />
                      </div>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-4 bg-background text-text-primary ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary sm:text-sm"
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
                    Email
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-4 w-4 text-text-tertiary" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-4 bg-background text-text-primary ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary sm:text-sm"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
                    Password
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-4 w-4 text-text-tertiary" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-10 bg-background text-text-primary ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary sm:text-sm"
                      placeholder={isSignUp ? "Create a password" : "Enter your password"}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-text-tertiary hover:text-text-secondary focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {!isSignUp && (
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
                
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      className="text-sm text-error bg-error/10 p-3 rounded-lg"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-base font-medium text-primary-contrast bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-70"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isSignUp ? 'Creating account...' : 'Signing in...'}
                      </>
                    ) : (
                      isSignUp ? 'Create Account' : 'Sign In'
                    )}
                  </motion.button>
                </div>
              </motion.form>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;