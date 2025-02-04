import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Task {
  id: string;
  title: string;
  completed: boolean;
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
}

export const useStudyStore = create<StudyState>((set, get) => ({
  currentSession: null,
  isStudying: false,
  isPaused: false,

  startStudying: async (title) => {
    const { data, error } = await supabase
      .from('study_sessions')
      .insert({
        title,
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

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        session_id: currentSession.id,
        title,
      })
      .select()
      .single();

    if (error) throw error;

    set((state) => ({
      currentSession: state.currentSession ? {
        ...state.currentSession,
        tasks: [...state.currentSession.tasks, {
          id: data.id,
          title: data.title,
          completed: false,
        }],
      } : null,
    }));
  },

  completeTask: async (taskId) => {
    const { currentSession } = get();
    if (!currentSession) return;

    await supabase
      .from('tasks')
      .update({ completed: true })
      .eq('id', taskId);

    set((state) => ({
      currentSession: state.currentSession ? {
        ...state.currentSession,
        tasks: state.currentSession.tasks.map(task =>
          task.id === taskId ? { ...task, completed: true } : task
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
}));