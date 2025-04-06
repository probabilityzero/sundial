import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { FaGoogle, FaGithub, FaDiscord, FaApple } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

interface AuthFormProps {
  onSubmit: (email: string, password?: string, name?: string) => Promise<void>;
}

function AuthForm({ onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      await onSubmit(email, password, name);
    } else {
      await onSubmit(email, password);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'discord' | 'apple') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
      });
      if (error) {
        alert(error.message);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl justify-center items-center font-extrabold text-text-primary">
          Sol
        </h2>
        <p className="mt-2 text-center text-sm text-text-secondary">
          {isSignUp ? 'Create a new account' : 'Sign in to track sessions and tasks'}
        </p>
      </div>

      <div className="flex justify-center space-x-1">
        <button
          type="button"
          className="rounded-full p-2 hover:bg-surface focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          onClick={() => handleOAuthSignIn('google')}
        >
          <FaGoogle className="h-6 w-6 text-text-primary" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="rounded-full p-2 hover:bg-surface focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          onClick={() => handleOAuthSignIn('github')}
        >
          <FaGithub className="h-6 w-6 text-text-primary" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="rounded-full p-2 hover:bg-surface focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          onClick={() => handleOAuthSignIn('discord')}
        >
          <FaDiscord className="h-6 w-6 text-text-primary" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="rounded-full p-2 hover:bg-surface focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          onClick={() => handleOAuthSignIn('apple')}
        >
          <FaApple className="h-6 w-6 text-text-primary" aria-hidden="true" />
        </button>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-text-tertiary" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-border placeholder-text-tertiary text-text-primary rounded-t-md bg-surface focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-text-tertiary" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-border placeholder-text-tertiary text-text-primary ${isSignUp ? '' : 'rounded-t-md'} bg-surface focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-text-tertiary" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-border placeholder-text-tertiary text-text-primary rounded-b-md bg-surface focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {!isSignUp && (
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-border rounded bg-surface"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                Remember me
              </label>
            </div>
          )}

          {!isSignUp && (
            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary-dark">
                Forgot your password?
              </a>
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-contrast bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            {isSignUp ? 'Create a new account' : 'Sign in'}
          </button>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="button"
            className="inline-block align-baseline font-medium text-sm text-primary hover:text-primary-dark transition-colors"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Already have an account? Sign in here' : "Create a new account"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthForm;
