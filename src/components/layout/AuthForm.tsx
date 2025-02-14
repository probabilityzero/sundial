import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { FaGoogle, FaGithub, FaDiscord, FaApple } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';

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
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sessions
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isSignUp ? 'Create an account' : 'Sign in to track your sessions'}
        </p>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          type="button"
          className="rounded-full p-2 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => handleOAuthSignIn('google')}
        >
          <FaGoogle className="h-6 w-6 text-gray-900" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="rounded-full p-2 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => handleOAuthSignIn('github')}
        >
          <FaGithub className="h-6 w-6 text-gray-900" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="rounded-full p-2 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => handleOAuthSignIn('discord')}
        >
          <FaDiscord className="h-6 w-6 text-gray-900" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="rounded-full p-2 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => handleOAuthSignIn('apple')}
        >
          <FaApple className="h-6 w-6 text-gray-900" aria-hidden="true" />
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
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Your Name"
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
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
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
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isSignUp ? 'Create a new account' : 'Sign in'}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
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
