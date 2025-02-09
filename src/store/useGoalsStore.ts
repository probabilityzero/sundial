import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './useAuthStore';
import { useSessionStore } from './useSessionStore';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'created' | 'started' | 'completed' | 'unfinished' | 'migrated';
  created_at: string;
  user_id: string;
  tag?: string | null;
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
      const { tag } = useSessionStore.getState();

      console.log('addTask: user = ', user);
      console.log('addTask: title = ', title);
      console.log('addTask: tag = ', tag);

      if (!user) {
        console.warn("useGoalsStore: No user logged in, cannot add task.");
        alert('You must be logged in to add tasks.');
        set({ error: 'Not authenticated' });
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title,
          user_id: user.id,
          tag: tag,
        })
        .select()
        .single();

      console.log('addTask: insert result data = ', data);
      console.log('addTask: insert result error = ', error);

      if (error) {
        console.error("useGoalsStore: Error adding task to Supabase:", error);
        alert(`Failed to add task: ${error.message}`);
        set({ error: `Supabase error: ${error.message} - ${error.details}` });
        return;
      }

      set((state) => ({
        tasks: [...state.tasks, data],
        error: null,
      }));
    } catch (error: any) {
      console.error("useGoalsStore: Error in addTask:", error);
      alert(`Error adding task: ${error.message}`);
      set({ error: `Error adding task: ${error.message}` });
    }
  },

  updateTaskStatus: async (taskId: string, status: Task['status']) => {
    try {
      const { user } = useAuthStore.getState();
      if (!user) {
        console.warn("useGoalsStore: No user logged in, cannot update task status.");
        alert('You must be logged in to update tasks.');
        set({ error: 'Not authenticated' });
        return;
      }

      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId)
        .eq('user_id', user.id)
        .select()

      if (error) {
        console.error(`useGoalsStore: Error updating task status to ${status} in Supabase:`, error);
        alert(`Failed to update task status: ${error.message}`);
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
      alert(`Error updating task status: ${error.message}`);
      set({ error: error.message });
    }
  },
}));
