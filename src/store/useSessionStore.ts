import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from './useAuthStore';

interface TimerState {
  sessionId: string | null;
  sessionName: string | null;
  startTime: Date | null;
  endTime: Date | null;
  isPaused: boolean;
  isSessionActive: boolean;
  pauseTime: Date | null;
  totalPausedTime: number;
  tag: string | null;

  startSession: ( sessionName: string) => Promise<void>;
  pauseSession: () => Promise<void>;
  resumeSession: () => Promise<void>;
  resetSession: () => Promise<void>;
  setTag: (tag: string) => Promise<void>;
  setSessionName: (sessionName: string) => Promise<void>;
  fetchActiveSession: () => Promise<void>;
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
      tag: null,

      startSession: async ( sessionName: string) => {
        const sessionId = uuidv4();
        const startTime = new Date();
        const { user } = useAuthStore.getState();

        console.log("useSessionStore: startSession called with name:", sessionName);
        console.log("useSessionStore: user:", user);

        if (!user) {
          console.error("useSessionStore: No user ID found, cannot start session");
          return;
        }

        try {
          console.log("useSessionStore: Attempting to insert session into database");
          const { data, error } = await supabase
            .from('sessions')
            .insert({ id: sessionId, title: sessionName, start_time: startTime.toISOString(), tag: get().tag, user_id: user.id, status: 'active' })
            .select();

          console.log("useSessionStore: Supabase insert data:", data);
          console.log("useSessionStore: Supabase insert error:", error);

          if (error) {
            console.error("useSessionStore: Error starting session:", error);
          }
        } catch (error) {
          console.error("useSessionStore: Error starting session:", error);
        }

        set({
          sessionId,
          sessionName,
          startTime,
          isSessionActive: true,
          isPaused: false,
          endTime: null,
          pauseTime: null,
          totalPausedTime: 0,
          tag: get().tag,
        });
      },

      pauseSession: async () => {
        const sessionId = get().sessionId;
        const pauseTime = new Date();

        try {
          const { error } = await supabase
            .from('sessions')
            .update({ status: 'paused' })
            .eq('id', sessionId);

          if (error) {
            console.error("useSessionStore: Error pausing session:", error);
          }
        } catch (error) {
          console.error("useSessionStore: Error pausing session:", error);
        }

        set({
          isPaused: true,
          pauseTime: pauseTime,
        });
      },

      resumeSession: async () => {
        const now = new Date();
        const pausedDuration = now.getTime() - (get().pauseTime?.getTime() || now.getTime());
        const sessionId = get().sessionId;

        try {
          // Update the session status in the database
          const { error } = await supabase
            .from('sessions')
            .update({ status: 'active' })
            .eq('id', sessionId);

          if (error) {
            console.error("useSessionStore: Error resuming session:", error);
          }
        } catch (error) {
          console.error("useSessionStore: Error resuming session:", error);
        }

        set((state) => ({
          isPaused: false,
          pauseTime: null,
          startTime: new Date(state.startTime?.getTime() + pausedDuration),
          totalPausedTime: state.totalPausedTime + pausedDuration,
          isSessionActive: true,
        }));
      },

      resetSession: async () => {
        const sessionId = get().sessionId;
        const endTime = new Date();
        const duration = endTime.getTime() - (get().startTime?.getTime() || endTime.getTime());

        try {
          // Update the session in the database
          const { error } = await supabase
            .from('sessions')
            .update({ end_time: endTime.toISOString(), total_duration: duration, status: 'completed' })
            .eq('id', sessionId);

          if (error) {
            console.error("useSessionStore: Error ending session:", error);
          }
        } catch (error) {
          console.error("useSessionStore: Error ending session:", error);
        }

        set({
          sessionId: null,
          sessionName: null,
          startTime: null,
          endTime: null,
          isPaused: false,
          isSessionActive: false,
          pauseTime: null,
          totalPausedTime: 0,
          tag: null,
        });
      },
      setTag: async (tag: string) => {
        try {
          const { error } = await supabase
            .from('sessions')
            .update({ tag: tag })
            .eq('id', get().sessionId);
          if (error) {
            console.error("Error updating tag:", error);
          }
        } catch (error) {
          console.error("Error updating tag:", error);
        }
        set({ tag: tag });
      },
      setSessionName: async (sessionName: string) => {
        const sessionId = get().sessionId;
        try {
          const { error } = await supabase
            .from('sessions')
            .update({ title: sessionName })
            .eq('id', sessionId);
          if (error) {
            console.error("Error updating session name:", error);
          }
        } catch (error) {
          console.error("Error updating session name:", error);
        }
        set({ sessionName: sessionName });
      },
      fetchActiveSession: async () => {
        const { user } = useAuthStore.getState();
        if (!user) {
          console.warn("useSessionStore: No user logged in, cannot fetch active session.");
          return;
        }

        try {
          const { data, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('user_id', user.id)
            .in('status', ['active', 'paused'])
            .order('start_time', { ascending: false })
            .limit(1)
            .single();

          console.log("useSessionStore: fetchActiveSession data:", data);
          console.log("useSessionStore: fetchActiveSession error:", error);

          if (error && error.code !== 'PGRST116') {
            console.error("useSessionStore: Error fetching active session:", error);
            return;
          }

          if (data) {
            set({
              sessionId: data.id,
              sessionName: data.title,
              startTime: new Date(data.start_time),
              endTime: data.end_time ? new Date(data.end_time) : null,
              isPaused: data.status === 'paused',
              isSessionActive: true,
              pauseTime: null,
              totalPausedTime: data.total_duration || 0,
              tag: data.tag,
            });
          }
        } catch (error) {
          console.error("useSessionStore: Error in fetchActiveSession:", error);
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
      },
      onRehydrateStorage: (state) => {
        return (state) => {
          const { user } = useAuthStore.getState();
          if (user) {
            state.fetchActiveSession();
          }
        };
      },
    }
  )
);
