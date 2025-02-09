import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }

      // Merge user and profile data
      set({ user: { ...data.user, ...profileData }, loading: false });
    } catch (error: any) {
      console.error("Error in signIn:", error);
      throw error;
    }
  },
  signUp: async (email, password, name) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name, // Store name as full_name in user_metadata
          },
        },
      });
      if (error) throw error;

      // Create profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, full_name: name }]) // Store name as full_name in profiles table
        .select()
        .single();

      if (profileError) {
        console.error("Error creating profile:", profileError);
      }

      // Merge user and profile data
      set({ user: { ...data.user, ...profileData }, loading: false });
    } catch (error: any) {
      console.error("Error in signUp:", error);
      throw error;
    }
  },
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, loading: false });
    } catch (error: any) {
      console.error("Error in signOut:", error);
      throw error;
    }
  },
  setUser: (user) => {
    set({ user, loading: false });
  },
}));
