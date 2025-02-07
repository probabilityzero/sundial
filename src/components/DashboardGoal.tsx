import React, { useState, useEffect, useRef } from 'react';
import { Check, Play, Loader2, Circle } from 'lucide-react';
import { ViewGoalToday } from './shared/ViewGoalToday';
import { useSessionStore } from '../store/useSessionStore'; // Import the store
import { motion } from 'framer-motion';
import { ViewGoals } from './shared/ViewGoals'; 
import { NewGoalFormBullet } from './shared/NewGoalFormBulltet'; 

export function DashboardGoal() {
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
    <div className="p-4">
      <main className="min-w-[320px] max-w-full w-full mx-auto bg-gray-100 rounded-xl p-2 flex flex-col">
        <div className="flex justify-between border-b-2 p-2">
          <h2 className="text-xl text-left font-semibold text-gray-800">Goals</h2>
        </div>

        <div className="overflow-y-auto pt-2"> 
          <ViewGoals
            isLoadingTasks={isLoadingTasks}
            tasks={tasks}
            handleCompleteTask={handleCompleteTask}
            handleStartTask={handleStartTask}
            taskItemRefs={taskItemRefs}
          />
        </div>
        <div className="overflow-y-auto"> 
          <NewGoalFormBullet />
        </div>
      </main>
    </div>
  );
}
