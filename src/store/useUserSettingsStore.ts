import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './useAuthStore';

interface UserSettingsState {
  availableTags: { name: string; }[];
  fetchUserSettings: (userId: string) => Promise<void>;
  setAvailableTags: (tags: { name: string; }[]) => void;
}

const defaultTags = ['Studying', 'Working', 'Reading'].map(tag => ({ name: tag }));

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

      console.log("useUserSettingsStore: Supabase select data:", data);
      console.log("useUserSettingsStore: Supabase select error:", error);

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
          set({ availableTags: defaultTags }); // Update the state with default tags
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
  setAvailableTags: async (tags: { name: string; }[]) => {
    const { user } = useAuthStore.getState();
    if (!user) {
      console.warn("useUserSettingsStore: No user logged in, cannot update user settings.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .update({ available_tags: tags.map(tag => tag.name) })
        .eq('user_id', user.id)
        .select()

      if (error) {
        console.error("useUserSettingsStore: Error updating user settings:", error);
      }
    } catch (error) {
      console.error("useUserSettingsStore: Error updating user settings:", error);
    }
    set({ availableTags: tags });
  },
}));
