import { create } from 'zustand';
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

  startSession: (sessionName: string) => Promise<void>;
  pauseSession: () => Promise<void>;
  resumeSession: () => Promise<void>;
  resetSession: () => Promise<void>;
  setDimension: (dimension: string) => Promise<void>;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  sessionId: null,
  sessionName: null,
  startTime: null,
  endTime: null,
  isPaused: false,
  isSessionActive: false,
  pauseTime: null,
  totalPausedTime: 0,
  dimension: null,

  startSession: async (sessionName: string) => {
    console.log("useTimerStore: startSession called with name:", sessionName);
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

    console.log("useTimerStore: State updated:", { sessionId, sessionName, startTime, isSessionActive: true });

    try {
      // Insert the new session into the database
      const { data, error } = await supabase
        .from('sessions')
        .insert([{ id: sessionId, title: sessionName, start_time: startTime.toISOString(), dimension: dimension }]) // Removed user_id
        .select();

      if (error) {
        console.error("useTimerStore: Error starting session:", error);
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
        console.log("useTimerStore: State reverted");
      } else {
        console.log("useTimerStore: Session inserted successfully:", data);
      }
    } catch (error) {
      console.error("useTimerStore: Error starting session:", error);
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
      console.log("useTimerStore: State reverted");
    }
  },

  pauseSession: async () => {
    const pauseTime = new Date();
    set({ isPaused: true, pauseTime });

    try {
      // Update the session status in the database
      const { error } = await supabase
        .from('sessions')
        .update({ status: 'paused' })
        .eq('id', get().sessionId);

      if (error) {
        console.error("Error pausing session:", error);
        // Revert the state on error
        set({ isPaused: false, pauseTime: null });
      }
    } catch (error) {
      console.error("Error pausing session:", error);
      // Revert the state on error
      set({ isPaused: false, pauseTime: null });
    }
  },

  resumeSession: async () => {
    const now = new Date();
    const pausedDuration = now.getTime() - (get().pauseTime?.getTime() || now.getTime());

    set((state) => ({
      isPaused: false,
      pauseTime: null,
      startTime: new Date(state.startTime?.getTime() + pausedDuration),
      totalPausedTime: state.totalPausedTime + pausedDuration,
    }));

    try {
      // Update the session status in the database
      const { error } = await supabase
        .from('sessions')
        .update({ status: 'active' })
        .eq('id', get().sessionId);

      if (error) {
        console.error("Error resuming session:", error);
        // Revert the state on error
        set({ isPaused: true, pauseTime: now });
      }
    } catch (error) {
      console.error("Error resuming session:", error);
      // Revert the state on error
      set({ isPaused: true, pauseTime: now });
    }
  },

  resetSession: async () => {
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

    try {
      // Update the session in the database
      const { error } = await supabase
        .from('sessions')
        .update({ end_time: endTime.toISOString(), total_duration: duration, status: 'completed' })
        .eq('id', get().sessionId);

      if (error) {
        console.error("Error ending session:", error);
        // Revert the state on error
        set({ isSessionActive: true, isPaused: false, endTime: null });
      }
    } catch (error) {
      console.error("Error ending session:", error);
      // Revert the state on error
      set({ isSessionActive: true, isPaused: false, endTime: null });
    }
  },
  setDimension: async (dimension: string) => {
    set({ dimension: dimension });
    if (get().sessionId) {
      try {
        const { error } = await supabase
          .from('sessions')
          .update({ dimension: dimension })
          .eq('id', get().sessionId);
        if (error) {
          console.error("Error updating dimension:", error);
        }
      } catch (error) {
        console.error("Error updating dimension:", error);
      }
    }
  },
}));
