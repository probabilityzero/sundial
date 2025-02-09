import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './useAuthStore';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'created' | 'started' | 'completed' | 'unfinished' | 'migrated';
  created_at: string;
  user_id: string; // Ensure user_id is present in the Task interface
}

interface GoalsState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (title: string) => Promise<void>;
  updateTaskStatus: (taskId: string, status: Task['status']) => Promise<void>;
}

export const useGoalsStore = create<GoalsState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      if (!user) {
        console.warn("useGoalsStore: No user logged in, not fetching tasks.");
        set({ tasks: [], isLoading: false, error: 'Not authenticated' });
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("useGoalsStore: Error fetching tasks:", error);
        set({ error: error.message, isLoading: false });
        return;
      }

      set({ tasks: data || [], isLoading: false, error: null });
    } catch (error: any) {
      console.error("useGoalsStore: Error in fetchTasks:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  addTask: async (title: string) => {
    try {
      const { user } = useAuthStore.getState();
      if (!user) {
        console.warn("useGoalsStore: No user logged in, cannot add task.");
        set({ error: 'Not authenticated' });
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("useGoalsStore: Error adding task to Supabase:", error);
        set({ error: `Supabase error: ${error.message} - ${error.details}` });
        return;
      }

      set((state) => ({
        tasks: [...state.tasks, data],
        error: null,
      }));
    } catch (error: any) {
      console.error("useGoalsStore: Error in addTask:", error);
      set({ error: `Error adding task: ${error.message}` });
    }
  },

  updateTaskStatus: async (taskId: string, status: Task['status']) => {
    try {
      const { user } = useAuthStore.getState();
      if (!user) {
        console.warn("useGoalsStore: No user logged in, cannot update task status.");
        set({ error: 'Not authenticated' });
        return;
      }

      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId)
        .eq('user_id', user.id) // Ensure user owns the task
        .select()

      if (error) {
        console.error(`useGoalsStore: Error updating task status to ${status} in Supabase:`, error);
        set({ error: error.message });
        return;
      }

      set((state) => ({
        tasks: state.tasks.map(task =>
          task.id === taskId ? { ...task, status: status } : task
        ),
        error: null,
      }));
    } catch (error: any) {
      console.error("useGoalsStore: Error in updateTaskStatus:", error);
      set({ error: error.message });
    }
  },
}));
