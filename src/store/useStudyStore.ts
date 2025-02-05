import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

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

interface StudyState {
  tasks: Task[]; // Tasks array in store
  addTask: (title: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  fetchTasks: () => Promise<void>; // Fetch all tasks
}

const anonymousUserId = uuidv4(); // Still using anonymous user ID for simplicity, remove if not needed

export const useStudyStore = create<StudyState>((set, get) => ({
  tasks: [], // Initialize tasks array in store

  fetchTasks: async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*'); // Fetch all tasks

      if (error) {
        console.error("useStudyStore: Error fetching tasks:", error);
        throw error;
      }

      set({ tasks: data || [] }); // Update tasks in store with fetched data
    } catch (error) {
      console.error("useStudyStore: Error in fetchTasks:", error);
    }
  },

  addTask: async (title: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title,
          // user_id: anonymousUserId, // If you re-add user_id to tasks table
        })
        .select()
        .single();

      if (error) {
        console.error("useStudyStore: Error adding task to Supabase:", error);
        throw error;
      }

      set((state) => ({
        tasks: [...state.tasks, data], // Add new task to the tasks array in store
      }));
    } catch (error) {
      console.error("useStudyStore: Error in addTask:", error);
      throw error; // Re-throw to be caught in component
    }
  },

  completeTask: async (taskId: string) => {
    try {
      const taskToUpdate = get().tasks.find(task => task.id === taskId);
      if (!taskToUpdate) {
        console.error(`Task with id ${taskId} not found in local state.`);
        return;
      }
      const updatedIsFinished = !taskToUpdate.is_finished;


      const { error } = await supabase
        .from('tasks')
        .update({ is_finished: updatedIsFinished }) // Toggle is_finished status
        .eq('id', taskId);

      if (error) {
        console.error("useStudyStore: Error completing task in Supabase:", error);
        throw error;
      }

      set((state) => ({
        tasks: state.tasks.map(task =>
          task.id === taskId ? { ...task, is_finished: updatedIsFinished } : task
        ),
      }));
    } catch (error) {
      console.error("useStudyStore: Error in completeTask:", error);
      throw error; // Re-throw to be caught in component
    }
  },
}));