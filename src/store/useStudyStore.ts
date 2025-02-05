import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid'; // Import UUID

interface Task {
  id: string;
  title: string;
  description?: string;
  is_started: boolean;
  is_cancelled: boolean;
  is_finished: boolean;
  is_rescheduled: boolean;
  rescheduled_date?: string;
  session_block?: 'morning' | 'afternoon' | 'evening' | 'midnight' | 'full_day';
  reminder_time?: string;
  due_time?: string;
}

interface StudySession {
  id: string;
  title: string;
  startTime: Date;
  endTime?: Date;
  totalDuration?: string;
  breakDuration: string;
  tasks: Task[];
  tags: string[];
}

interface StudyState {
  currentSession: StudySession | null;
  isStudying: boolean;
  isPaused: boolean;
  startStudying: (title: string) => Promise<void>;
  pauseStudying: () => void;
  resumeStudying: () => void;
  endStudying: () => Promise<void>;
  addTask: (title: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  addTag: (tag: string) => Promise<void>;
  fetchTasksForSession: (sessionId: string) => Promise<void>;
}

// Generate a consistent user ID for anonymous access (for now)
const anonymousUserId = uuidv4(); // Generate UUID here and outside the store

export const useStudyStore = create<StudyState>((set, get) => ({
  currentSession: null,
  isStudying: false,
  isPaused: false,

  startStudying: async (title) => {
    const { data, error } = await supabase
      .from('study_sessions')
      .insert({
        title,
        user_id: anonymousUserId, // Use consistent anonymous user ID
        start_time: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    set({
      currentSession: {
        id: data.id,
        title: data.title,
        startTime: new Date(data.start_time),
        breakDuration: '0',
        tasks: [],
        tags: [],
      },
      isStudying: true,
    });
  },

  pauseStudying: () => set({ isPaused: true }),

  resumeStudying: () => set({ isPaused: false }),

  endStudying: async () => {
    const { currentSession } = get();
    if (!currentSession) return;

    const endTime = new Date();

    await supabase
      .from('study_sessions')
      .update({
        end_time: endTime.toISOString(),
      })
      .eq('id', currentSession.id);

    set({
      currentSession: null,
      isStudying: false,
      isPaused: false,
    });
  },

  addTask: async (title) => {
    const { currentSession } = get();
    if (!currentSession) return;

    console.log("addTask called with title:", title, "and session:", currentSession); // Debugging log

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        session_id: currentSession.id,
        title,
        user_id: anonymousUserId, // Use consistent anonymous user ID
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding task to Supabase:", error); // Debugging log
    } else {
      console.log("Task added successfully:", data); // Debugging log
    }


    if (error) throw error;

    set((state) => ({
      currentSession: state.currentSession ? {
        ...state.currentSession,
        tasks: [...state.currentSession.tasks, {
          id: data.id,
          title: data.title,
          is_cancelled: false,
          is_finished: false,
          is_rescheduled: false,
          is_started: false,
        }],
      } : null,
    }));
  },

  completeTask: async (taskId) => {
    const { currentSession } = get();
    if (!currentSession) return;

    await supabase
      .from('tasks')
      .update({ is_finished: true })
      .eq('id', taskId);

    set((state) => ({
      currentSession: state.currentSession ? {
        ...state.currentSession,
        tasks: state.currentSession.tasks.map(task =>
          task.id === taskId ? { ...task, is_finished: true } : task
        ),
      } : null,
    }));
  },

  addTag: async (tag) => {
    const { currentSession } = get();
    if (!currentSession) return;

    set((state) => ({
      currentSession: state.currentSession ? {
        ...state.currentSession,
        tags: [...state.currentSession.tags, tag],
      } : null,
    }));
  },
  fetchTasksForSession: async (sessionId) => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('session_id', sessionId);

    if (error) {
      console.error("Error fetching tasks:", error);
      return;
    }

    set(state => ({
      currentSession: state.currentSession ? {
        ...state.currentSession,
        tasks: data.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          is_started: task.is_started,
          is_cancelled: task.is_cancelled,
          is_finished: task.is_finished,
          is_rescheduled: task.is_rescheduled,
          rescheduled_date: task.rescheduled_date,
          session_block: task.session_block,
          reminder_time: task.reminder_time,
          due_time: task.due_time,
        })) || [],
      } : state.currentSession,
    }));
  },

}));
