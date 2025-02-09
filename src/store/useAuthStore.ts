import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email, password) => {
    console.log("useAuthStore: signIn called with email:", email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("useAuthStore: Error signing in:", error);
        throw error;
      }
      console.log("useAuthStore: signIn success:", data);
      set({ user: data.user, loading: false });
    } catch (error: any) {
      console.error("useAuthStore: Error in signIn:", error);
      throw error;
    }
  },
  signUp: async (email, password) => {
    console.log("useAuthStore: signUp called with email:", email);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        console.error("useAuthStore: Error signing up:", error);
        throw error;
      }
      console.log("useAuthStore: signUp success:", data);
      set({ user: data.user, loading: false });
    } catch (error: any) {
      console.error("useAuthStore: Error in signUp:", error);
      throw error;
    }
  },
  signOut: async () => {
    console.log("useAuthStore: signOut called");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("useAuthStore: Error signing out:", error);
        throw error;
      }
      console.log("useAuthStore: signOut success");
      set({ user: null, loading: false });
    } catch (error: any) {
      console.error("useAuthStore: Error in signOut:", error);
      throw error;
    }
  },
  setUser: (user) => {
     console.log("useAuthStore: setUser called with user:", user);
    set({ user, loading: false });
  },
}));
