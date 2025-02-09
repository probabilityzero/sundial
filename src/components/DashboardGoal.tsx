import React, { useState, useEffect, useRef } from 'react';
import { Check, Play, Loader2, Circle } from 'lucide-react';
import { ViewGoalToday } from './shared/ViewGoalToday';
import { useGoalsStore } from '../store/useGoalsStore'; // Import the store
import { motion } from 'framer-motion';
import { ViewGoals } from './shared/ViewGoals';
import { NewGoalFormBullet } from './shared/NewGoalFormBulltet';

export function DashboardGoal() {
  const [newTask, setNewTask] = useState('');
  const [taskError, setTaskError] = useState('');
  const taskItemRefs = useRef<HTMLElement[]>([]);
  const { tasks, addTask, updateTaskStatus, fetchTasks } = useGoalsStore(); // Use store actions and state
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [showTick, setShowTick] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setIsScrolled(scrollContainerRef.current.scrollTop > 0);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

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
    <div className="p-4 w-full max-w-full">
      <main
        className="mx-auto bg-gray-100 rounded-xl flex flex-col"
        style={{
          ...theme => theme('dashboard.goalBox'),
          padding: '0.5rem',
        }}
      >
        <div className={`flex justify-between border-b-2 p-2 sticky top-0 bg-gray-100 z-10 ${isScrolled ? 'shadow-sm' : ''}`}>
          <h2 className="text-xl text-left font-semibold text-gray-800">Goals</h2>
        </div>

        <div className="overflow-y-auto pt-2" style={{ maxHeight: 'calc(100vh - 12rem - 16rem - 3.25rem - 6rem)' }} ref={scrollContainerRef}>
          <ViewGoals
            isLoadingTasks={isLoadingTasks}
            tasks={tasks}
            handleCompleteTask={handleCompleteTask}
            handleStartTask={handleStartTask}
            taskItemRefs={taskItemRefs}
          />
        </div>
        <div className={`sticky bottom-0 bg-gray-100 p-2 z-10 ${isScrolled ? 'shadow-sm' : ''}`}>
          <NewGoalFormBullet />
        </div>
      </main>
    </div>
  );
}
