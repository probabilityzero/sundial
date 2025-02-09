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

  startSession: (sessionName: string, tag: string) => Promise<void>;
  pauseSession: () => Promise<void>;
  resumeSession: () => Promise<void>;
  resetSession: () => Promise<void>;
  setTag: (tag: string) => Promise<void>;
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

      startSession: async (sessionName: string, tag: string) => {
        console.log("useSessionStore: startSession called with name:", sessionName, "tag:", tag);
        const sessionId = uuidv4();
        const startTime = new Date();
        const { user } = useAuthStore.getState();

        if (!user) {
          console.error("useSessionStore: No user ID found, cannot start session");
          return;
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
          tag,
        });

        try {
          const { error } = await supabase
            .from('sessions')
            .insert([{ id: sessionId, title: sessionName, start_time: startTime.toISOString(), tag, user_id: user.id }])
            .select();

          if (error) {
            console.error("useSessionStore: Error starting session:", error);
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
            console.log("useSessionStore: State reverted");
          } else {
            console.log("useSessionStore: Session inserted successfully");
          }
        } catch (error) {
          console.error("useSessionStore: Error starting session:", error);
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
          console.log("useSessionStore: State reverted");
        }
      },

      pauseSession: async () => {
        console.log("useSessionStore: pauseSession called");
        const sessionId = get().sessionId;
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
          tag: null,
        });
        console.log("useSessionStore: State updated: sessionID=null, startTime=null, endTime=null");

        try {
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
          }
        } catch (error) {
          console.error("useSessionStore: Error resuming session:", error);
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
          tag: null,
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
          }
        } catch (error) {
          console.error("useSessionStore: Error ending session:", error);
        }
      },
      setTag: async (tag: string) => {
        set({ tag: tag });
        if (get().sessionId) {
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
