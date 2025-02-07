import React, { useState, useEffect, useRef } from 'react';
import { Check, Play, Loader2, Circle } from 'lucide-react';
import { useSessionStore } from '../store/useSessionStore'; // Import the store
import { DashboardSession } from '../components/DashboardSession';
import { DashboardGoal } from '../components/DashboardGoal';
import { motion } from 'framer-motion';

function HomePage() {
  const [newTask, setNewTask] = useState('');
  const [taskError, setTaskError] = useState('');
  const taskItemRefs = useRef<HTMLElement[]>([]);
  const { tasks, addTask, updateTaskStatus, fetchTasks } = useSessionStore(); // Use store actions and state
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [showTick, setShowTick] = useState(false);

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
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
        <DashboardSession />
        <DashboardGoal />
    </motion.div>
  );
}

export default HomePage;
