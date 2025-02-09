import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface TimerState {
  sessionId: string | null;
  sessionName: string | null;
  startTime: Date | null;
  endTime: Date | null;
  isPaused: boolean;
  isSessionActive: boolean;
  pauseTime: Date | null;
  totalPausedTime: number;
  dimension: string | null;
  availableTags: { name: string; selected: boolean }[];

  startSession: (sessionName: string) => Promise<void>;
  pauseSession: () => Promise<void>;
  resumeSession: () => Promise<void>;
  resetSession: () => Promise<void>;
  setDimension: (dimension: string) => Promise<void>;
  fetchUserSettings: (userId: string) => Promise<void>;
}

export const useSessionStore = create<TimerState>()(
  persist(
    (set, get) => ({
      sessionId: null,
      sessionName: null,
      startTime: null,
      endTime: null,
      isPaused: false,
      isSessionActive: false,
      pauseTime: null,
      totalPausedTime: 0,
      dimension: 'Working',
      availableTags: [
        { name: 'Working', selected: true },
        { name: 'Studying', selected: false },
        { name: 'Reading', selected: false },
        { name: 'Meeting', selected: false },
        { name: 'Research', selected: false },
        { name: 'Meditation', selected: false },
        { name: 'Writing', selected: true },
        { name: 'Coding', selected: true },
        { name: 'Designing', selected: false },
        { name: 'Editing', selected: false },
      ],

      startSession: async (sessionName: string) => {
        console.log("useSessionStore: startSession called with name:", sessionName);
        const sessionId = uuidv4();
        const startTime = new Date();
        const dimension = get().dimension;

        // Optimistically update the state
        set({
          sessionId,
          sessionName,
          startTime,
          isSessionActive: true,
          isPaused: false,
          endTime: null,
          pauseTime: null,
          totalPausedTime: 0,
        });

        console.log("useSessionStore: State updated:", { sessionId, sessionName, startTime, isSessionActive: true, dimension });

        try {
          // Insert the new session into the database
          const { data, error } = await supabase
            .from('sessions')
            .insert([{ id: sessionId, title: sessionName, start_time: startTime.toISOString(), dimension: dimension }]) // Removed user_id
            .select();

          if (error) {
            console.error("useSessionStore: Error starting session:", error);
            // Revert the state on error
            set({
              sessionId: null,
              sessionName: null,
              startTime: null,
              endTime: null,
              isPaused: false,
              isSessionActive: false,
              pauseTime: null,
              totalPausedTime: 0,
              dimension: null,
            });
            console.log("useSessionStore: State reverted");
          } else {
            console.log("useSessionStore: Session inserted successfully:", data);
          }
        } catch (error) {
          console.error("useSessionStore: Error starting session:", error);
          // Revert the state on error
          set({
            sessionId: null,
            sessionName: null,
            startTime: null,
            endTime: null,
            isPaused: false,
            isSessionActive: false,
            pauseTime: null,
            totalPausedTime: 0,
            dimension: null,
          });
          console.log("useSessionStore: State reverted");
        }
      },

      pauseSession: async () => {
        console.log("useSessionStore: pauseSession called");
        const sessionId = get().sessionId;
        if (get().isPaused) {
          // If the session is already paused, end the session
          const endTime = new Date();
          const duration = endTime.getTime() - (get().startTime?.getTime() || endTime.getTime());

          set({
            sessionId: null,
            sessionName: null,
            startTime: null,
            endTime: null,
            isPaused: false,
            isSessionActive: false,
            pauseTime: null,
            totalPausedTime: 0,
            dimension: null,
          });
          console.log("useSessionStore: State updated: sessionID=null, startTime=null, endTime=null");

          try {
            // Update the session in the database
            const { error } = await supabase
              .from('sessions')
              .update({ end_time: endTime.toISOString(), total_duration: duration, status: 'completed' })
              .eq('id', sessionId);

            if (error) {
              console.error("useSessionStore: Error ending session:", error);
              // Revert the state on error
              set({ isSessionActive: true, isPaused: false, endTime: null });
              console.log("useSessionStore: State reverted");
            }
          } catch (error) {
            console.error("useSessionStore: Error ending session:", error);
            // Revert the state on error
            set({ isSessionActive: true, isPaused: false, endTime: null });
            console.log("useSessionStore: State reverted");
          }
        } else {
          // If the session is active, pause the session
          const pauseTime = new Date();
          set({ isPaused: true, pauseTime });
          console.log("useSessionStore: State updated: isPaused=", true, "pauseTime=", pauseTime);

          try {
            // Update the session status in the database
            const { error } = await supabase
              .from('sessions')
              .update({ status: 'paused' })
              .eq('id', get().sessionId);

            if (error) {
              console.error("useSessionStore: Error pausing session:", error);
              // Revert the state on error
              set({ isPaused: false, pauseTime: null });
              console.log("useSessionStore: State reverted");
            }
          } catch (error) {
            console.error("useSessionStore: Error pausing session:", error);
            // Revert the state on error
            set({ isPaused: false, pauseTime: null });
            console.log("useSessionStore: State reverted");
          }
        }
      },

      resumeSession: async () => {
        console.log("useSessionStore: resumeSession called");
        const now = new Date();
        const pausedDuration = now.getTime() - (get().pauseTime?.getTime() || now.getTime());

        set((state) => ({
          isPaused: false,
          pauseTime: null,
          startTime: new Date(state.startTime?.getTime() + pausedDuration),
          totalPausedTime: state.totalPausedTime + pausedDuration,
          isSessionActive: true,
        }));
        console.log("useSessionStore: State updated: isPaused=", false, "pauseTime=", null, "startTime=", new Date((get().startTime?.getTime() || now.getTime()) + pausedDuration));

        try {
          // Update the session status in the database
          const { error } = await supabase
            .from('sessions')
            .update({ status: 'active' })
            .eq('id', get().sessionId);

          if (error) {
            console.error("useSessionStore: Error resuming session:", error);
            // Revert the state on error
            set({ isPaused: true, pauseTime: now, isSessionActive: false });
            console.log("useSessionStore: State reverted");
          }
        } catch (error) {
          console.error("useSessionStore: Error resuming session:", error);
          // Revert the state on error
          set({ isPaused: true, pauseTime: now, isSessionActive: false });
          console.log("useSessionStore: State reverted");
        }
      },

      resetSession: async () => {
        console.log("useSessionStore: resetSession called");
        const endTime = new Date();
        const duration = endTime.getTime() - (get().startTime?.getTime() || endTime.getTime());

        set({
          sessionId: null,
          sessionName: null,
          startTime: null,
          endTime: null,
          isPaused: false,
          isSessionActive: false,
          pauseTime: null,
          totalPausedTime: 0,
          dimension: null,
        });
        console.log("useSessionStore: State updated: sessionID=null, startTime=null, endTime=null");

        try {
          // Update the session in the database
          const { error } = await supabase
            .from('sessions')
            .update({ end_time: endTime.toISOString(), total_duration: duration, status: 'completed' })
            .eq('id', get().sessionId);

          if (error) {
            console.error("useSessionStore: Error ending session:", error);
            // Revert the state on error
            set({ isSessionActive: true, isPaused: false, endTime: null });
            console.log("useSessionStore: State reverted");
          }
        } catch (error) {
          console.error("useSessionStore: Error ending session:", error);
          // Revert the state on error
          set({ isSessionActive: true, isPaused: false, endTime: null });
          console.log("useSessionStore: State reverted");
        }
      },
      setDimension: async (dimension: string) => {
        console.log("useSessionStore: setDimension called with dimension:", dimension);
        set({ dimension: dimension });
        console.log("useSessionStore: State updated: dimension=", dimension);
        if (get().sessionId) {
          try {
            const { error } = await supabase
              .from('sessions')
              .update({ dimension: dimension })
              .eq('id', get().sessionId);
          if (error) {
            console.error("useSessionStore: Error updating dimension:", error);
          }
        } catch (error) {
          console.error("useSessionStore: Error updating dimension:", error);
        }
      }
    },
      fetchUserSettings: async (userId: string) => {
        try {
          console.log("useSessionStore: fetchUserSettings called with userId:", userId);
          const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', userId)
            .single();

          if (error) {
            console.error("useSessionStore: Error fetching user settings:", error);
            // If no user settings exist, create default settings
            if (error.code === 'PGRST116') {
              console.log("useSessionStore: No user settings found, creating default settings");
              await supabase
                .from('user_settings')
                .insert([{ user_id: userId, available_tags: ['Working', 'Studying', 'Reading', 'Meeting', 'Research', 'Meditation', 'Writing', 'Coding', 'Designing', 'Editing'] }])
                .select()
                .single();
            } else {
              throw error;
            }
          }

          if (data) {
            set({
              availableTags: data.available_tags.map(tag => ({ name: tag, selected: true })), // Assuming all fetched tags are selected
            });
          }
        } catch (error) {
          console.error("useSessionStore: Error in fetchUserSettings:", error);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'session-storage',
      getStorage: () => localStorage,
      deserialize: (str) => {
        const parsed = JSON.parse(str);
        if (parsed.state && parsed.state.startTime) {
          parsed.state.startTime = new Date(parsed.state.startTime);
        }
        if (parsed.state && parsed.state.pauseTime) {
          parsed.state.pauseTime = new Date(parsed.state.pauseTime);
        }
        return parsed;
      }
    }
  )
);
