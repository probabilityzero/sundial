import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface UserSettingsState {
  availableTags: { name: string; }[];
  fetchUserSettings: (userId: string) => Promise<void>;
  setAvailableTags: (tags: { name: string; }[]) => void;
}

const defaultTags = ['Working', 'Studying', 'Reading', 'Meeting', 'Research', 'Meditation', 'Writing', 'Coding', 'Designing', 'Editing'].map(tag => ({ name: tag }));

export const useUserSettingsStore = create<UserSettingsState>((set) => ({
  availableTags: defaultTags,
  fetchUserSettings: async (userId: string) => {
    try {
      console.log("useUserSettingsStore: fetchUserSettings called with userId:", userId);
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error("useUserSettingsStore: Error fetching user settings:", error);
        // If no user settings exist, create default settings
        if (error.code === 'PGRST116') {
          console.log("useUserSettingsStore: No user settings found, creating default settings");
          await supabase
            .from('user_settings')
            .insert([{ user_id: userId, available_tags: defaultTags.map(tag => tag.name) }])
            .select()
            .single();
        } else {
          throw error;
        }
      }

      if (data) {
        set({
          availableTags: data.available_tags.map(tag => ({ name: tag })),
        });
      } else {
        set({ availableTags: defaultTags });
      }
    } catch (error) {
      console.error("useUserSettingsStore: Error in fetchUserSettings:", error);
      set({ availableTags: defaultTags });
    }
  },
  setAvailableTags: (tags: { name: string; }[]) => {
    set({ availableTags: tags });
  },
}));
