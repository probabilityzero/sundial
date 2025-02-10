import React, { useState } from 'react';
import { Check, Circle } from 'lucide-react';
import { useGoalsStore } from '../../store/useGoalsStore';
import { motion } from 'framer-motion';

interface NewGoalFormBulletProps {
  handleAddTask: (e: React.FormEvent) => Promise<void>;
}

export function NewGoalFormBullet({ handleAddTask }: NewGoalFormBulletProps) {
  const [newTask, setNewTask] = useState('');
  const [taskError, setTaskError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { addTask } = useGoalsStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskError('');
    if (newTask.trim()) {
      try {
        await addTask(newTask);
        setNewTask('');
      } catch (error: any) {
        setTaskError(`Failed to add task: ${error.message}`);
      }
    } else {
      setTaskError('This cannot be empty.');
    }
  };

  return (
    <main className='px-1 gap-2 min-w-full'>
      <form onSubmit={handleSubmit} className="flex items-start rounded-md relative">
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
            id="newTaskInput"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New entry..."
            className="w-full text-gray-700 leading-tight focus:outline-none bg-transparent border-b-2 border-transparent ml-2 pr-6 pb-0.5"
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
          />

          <motion.div
            className="absolute left-0 bottom-0 h-[2px] bg-blue-500 ml-1"
            initial={{ width: '0%' }}
            animate={{ width: isEditing ? '100%' : '0%' }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ originX: 0.5 }}
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
