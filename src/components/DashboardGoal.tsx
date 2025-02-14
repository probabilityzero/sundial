import React, { useState, useEffect, useRef } from 'react';
import { Target } from 'lucide-react';
import { ViewGoalToday } from './ui/ViewGoalToday';
import { useGoalsStore } from '../store/useGoalsStore';
import { motion } from 'framer-motion';
import { ViewGoals } from './ui/ViewGoals';
import { NewGoalFormBullet } from './ui/GoalFormPlaceholder';

export function DashboardGoal() {
  const [newTask, setNewTask] = useState('');
  const [taskError, setTaskError] = useState('');
  const taskItemRefs = useRef<HTMLElement[]>([]);
  const { tasks, addTask, updateTaskStatus, fetchTasks } = useGoalsStore();
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [showTick, setShowTick] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollTop = scrollContainerRef.current.scrollTop;
        const scrollHeight = scrollContainerRef.current.scrollHeight;
        const clientHeight = scrollContainerRef.current.clientHeight;

        setIsScrolled(scrollTop > 0);
        setIsAtEnd(scrollTop + clientHeight >= scrollHeight);
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
    loadTasks();
  }, []);

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

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskError('');
    if (newTask.trim()) {
      try {
        await addTask(newTask);
        setNewTask('');
        setShowTick(true);
        setTimeout(() => {
          setShowTick(false);
        }, 700);
        await loadTasks();
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
    <div className="p-4 max-w-full  md:px-20 lg:px-60 xl:px-72 2xl:px-80">
      <main
        className="bg-gray-100 p-2 rounded-xl flex flex-col sm:max-w-full md:max-w-9/10 lg:max-w-8/10 xl:max-w-7/10 2xl:max-w-6/10">

        <div className={`flex justify-between p-1 sticky top-0 bg-gray-100 z-10`}>
          <h2 className="text-2xl text-left font-semibold text-gray-800">Goals</h2>
        </div>
        <div className="bg-gray-300 z-11 sticky h-0.5 w-full" 
              style={{ boxShadow: isScrolled ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none' }} />

        
        <div className="overflow-y-auto pt-2" style={{ maxHeight: 'calc(100vh - 12rem - 16rem - 3.25rem - 6rem)' }} ref={scrollContainerRef}>
          <ViewGoals
            isLoadingTasks={isLoadingTasks}
            tasks={tasks}
            handleCompleteTask={handleCompleteTask}
            handleStartTask={handleStartTask}
            taskItemRefs={taskItemRefs}
          />
        </div>

        <div className="bg-gray-50 sticky top-0 z-11 h-0.5 w-full" 
              style={{ boxShadow: isAtEnd ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.1)' }} />
        <div
          className={`sticky bottom-0 bg-gray-100 pt-1 px-3 z-10`}
        >
          <NewGoalFormBullet handleAddTask={handleAddTask} />
        </div>
      </main>
    </div>
  );
}
