import React, { useState, useEffect } from 'react';
import { Check, Circle } from 'lucide-react';
import { useSessionStore } from '../../store/useTaskStore'; // Import the store
import { motion } from 'framer-motion';

export function NewGoalFormBullet() {
  const [newTask, setNewTask] = useState('');
  const [taskError, setTaskError] = useState('');
  const { addTask, fetchTasks } = useSessionStore(); // Use store actions and state
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [showTick, setShowTick] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track editing state

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

  return (
    <main className='py-2 px-3 gap-2 min-w-full'>
      <form onSubmit={handleAddTask} className="flex items-start rounded-md relative">
        <button
          type="button"
          className="text-gray-500 focus:outline-none"
          disabled={!newTask}
        >
          <Circle className="h-6 w-6" />
        </button>

        <div className="relative w-full">
          <motion.input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add entry..."
            className="w-full text-gray-700 leading-tight focus:outline-none bg-transparent border-b-2 border-transparent ml-2 pr-6 pb-1"
            onFocus={() => setIsEditing(true)} // Set editing state on focus
            onBlur={() => setIsEditing(false)} // Reset editing state on blur
          />
          
          <motion.div
            className="absolute left-0 bottom-0 h-[2px] bg-blue-500 ml-1" // Add margin-left of 1 unit
            initial={{ width: '0%' }} // Start with width at 0%
            animate={{ width: isEditing ? '100%' : '0%' }} // Animate width from 0% to 100%
            transition={{ duration: 0.2, ease: "easeInOut" }}
          />
        </div>

        {newTask && (
          <motion.button
            type="submit"
            className="text-green-500 font-bold py-auto rounded-r-md focus:outline-none mr-0.5 focus:shadow-outline absolute right-0"
            initial={{ opacity: 0, x: 0, scale: 0.5 }}
            animate={{ opacity: 1, x: 0, scale: 1.1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Check className="h-4 w-4 inline-block" />
          </motion.button>
        )}
      </form>

      {taskError && <p className="text-red-500 text-sm">{taskError}</p>}
    </main>
  );
}
