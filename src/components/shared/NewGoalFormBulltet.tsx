import React, { useState, useEffect, useRef } from 'react';
import { Check, Play, Loader2, Circle } from 'lucide-react';
import { useSessionStore } from '../../store/useSessionStore'; // Import the store
import { motion } from 'framer-motion';

export function NewGoalFormBullet() {
  const [newTask, setNewTask] = useState('');
  const [taskError, setTaskError] = useState('');
  const taskItemRefs = useRef<HTMLElement[]>([]);
  const { tasks, addTask, updateTaskStatus, fetchTasks } = useSessionStore(); // Use store actions and state
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [showTick, setShowTick] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoadingTasks(true);
      setTaskError('');
      try {
        await fetchTasks();
      } catch (error) {
        console.error('DashboardPage: Error fetching tasks:', error);
        setTaskError('Failed to load tasks. Please try again later.');
      } finally {
        setIsLoadingTasks(false);
      }
    };

    loadTasks();
  }, [fetchTasks]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskError('');
    if (newTask.trim()) {
      try {
        await addTask(newTask);
        setNewTask('');
        setShowTick(true); // Show the tick
        setTimeout(() => {
          setShowTick(false); // Hide the tick after a delay
        }, 700); // Adjust the delay as needed
      } catch (error) {
        console.error('DashboardPage: Failed to add task:', error);
        setTaskError('Failed to add task. Please try again later.');
      }
    } else {
      setTaskError('This cannot be empty.');
    }
  };

  const handleStartTask = async (taskId: string, index: number) => {
    try {
      await updateTaskStatus(taskId, 'started');
    } catch (error) {
      console.error('DashboardPage: Failed to start task:', error);
      setTaskError('Failed to start task. Please try again later.');
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await updateTaskStatus(taskId, 'completed');
    } catch (error) {
      console.error('DashboardPage: Failed to complete task:', error);
    }
  };

  return (
    <main className=''>
 
      <form onSubmit={handleAddTask} className="flex items-center rounded-md relative">
        <button
          type="button"
          className="text-gray-500 focus:outline-none pl-3 mr-2"
          disabled={!newTask}
        >
          <Circle className="h-6 w-6" />
        </button>

        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add entry..."
          className="w-full py-2 text-gray-700 leading-tight focus:outline-none bg-transparent"
        />
        {newTask && (
          <motion.button
            type="submit"
            className="text-green-500 font-bold py-2 px-4 rounded-r-md focus:outline-none focus:shadow-outline absolute right-0"
            style={{ paddingRight: '10px' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Check className="h-4 w-4 inline-block mr-1" />
          </motion.button>
        )}
      </form>

      {taskError && <p className="text-red-500 text-sm">{taskError}</p>}
    </main>
  );
}
