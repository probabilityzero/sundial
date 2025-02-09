import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useUserSettingsStore } from './useUserSettingsStore';

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
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      if (profileError) console.error("Error fetching profile:", profileError);
      set({ user: { ...data.user, ...profileData }, loading: false });
      useUserSettingsStore.getState().fetchUserSettings(data.user.id); // Fetch user settings after sign-in
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
            full_name: name,
          },
        },
      });
      if (error) throw error;
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, full_name: name }])
        .select()
        .single();
      if (profileError) console.error("Error creating profile:", profileError);
      set({ user: { ...data.user, ...profileData }, loading: false });
      useUserSettingsStore.getState().fetchUserSettings(data.user.id); // Fetch user settings after sign-up
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
