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
    console.log('useAuthStore: signIn called');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('useAuthStore: signIn error:', error);
        throw error;
      }
      console.log('useAuthStore: signIn success:', data);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      if (profileError) console.error("Error fetching profile:", profileError);
      set({ user: { ...data.user, ...profileData }, loading: false }); // Merge profile data
    } catch (error: any) {
      console.error('useAuthStore: signIn catch:', error);
      throw error;
    } finally {
      console.log('useAuthStore: signIn finally');
    }
  },
  signUp: async (email, password, name) => {
    console.log('useAuthStore: signUp called');
    try {
      const { user, session, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      if (error) {
        console.error('useAuthStore: signUp error:', error);
        throw error;
      }
      console.log('useAuthStore: signUp success:', user);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: user.id, name }])
        .select()
        .single();
      if (profileError) console.error("Error creating profile:", profileError);
      set({ user: { ...user, ...profileData }, loading: false }); // Merge profile data
    } catch (error: any) {
      console.error('useAuthStore: signUp catch:', error);
      throw error;
    } finally {
      console.log('useAuthStore: signUp finally');
    }
  },
  signOut: async () => {
    console.log('useAuthStore: signOut called');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('useAuthStore: signOut error:', error);
        throw error;
      }
      console.log('useAuthStore: signOut success');
      set({ user: null, loading: false });
    } catch (error: any) {
      console.error('useAuthStore: signOut catch:', error);
      throw error;
    } finally {
      console.log('useAuthStore: signOut finally');
    }
  },
  setUser: (user) => {
    console.log('useAuthStore: setUser called');
    set({ user, loading: false });
  },
}));
