import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'created' | 'started' | 'completed' | 'pending' | 'migrated'; // Updated status type
  is_started: boolean; // No longer needed, remove later
  is_cancelled: boolean; // No longer needed, remove later
  is_finished: boolean; // No longer needed, remove later
  is_rescheduled: boolean; // No longer needed, remove later
  rescheduled_date?: string;
  session_block?: 'morning' | 'afternoon' | 'evening' | 'midnight' | 'full_day';
  reminder_time?: string;
  due_time?: string;
}

interface StudyState {
  tasks: Task[];
  addTask: (title: string) => Promise<void>;
  updateTaskStatus: (taskId: string, status: Task['status']) => Promise<void>; // Renamed and updated
  fetchTasks: () => Promise<void>;
}

const anonymousUserId = uuidv4();

export const useSessionStore = create<StudyState>((set, get) => ({
  tasks: [],

  fetchTasks: async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false }); // Order by created_at desc for newest tasks first

      if (error) {
        console.error("useSessionStore: Error fetching tasks:", error);
        throw error;
      }

      set({ tasks: data || [] });
    } catch (error) {
      console.error("useSessionStore: Error in fetchTasks:", error);
    }
  },

  addTask: async (title: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title,
          // user_id: anonymousUserId,
        })
        .select()
        .single();

      if (error) {
        console.error("useSessionStore: Error adding task to Supabase:", error);
        throw error;
      }

      set((state) => ({
        tasks: [...state.tasks, data],
      }));
    } catch (error) {
      console.error("useSessionStore: Error in addTask:", error);
      throw error;
    }
  },

  updateTaskStatus: async (taskId: string, status: Task['status']) => { // Updated function
    try {
      const { data, error } = await supabase // Log data as well
        .from('tasks')
        .update({ status }) // Update status column
        .eq('id', taskId)
        .select() // Selecting to get the updated data back

      if (error) {
        console.error(`useSessionStore: Error updating task status to ${status} in Supabase:`, error, error.message, error.details, error.hint); // More detailed error log
        throw error;
      }

      console.log("Task status updated successfully in Supabase:", taskId, status, data); // Log success and data

      set((state) => ({
        tasks: state.tasks.map(task =>
          task.id === taskId ? { ...task, status: data ? data[0].status : status } : task // Update status in local state from returned data
        ),
      }));
    } catch (error) {
      console.error("useSessionStore: Error in updateTaskStatus:", error);
      throw error;
    }
  },
}));
