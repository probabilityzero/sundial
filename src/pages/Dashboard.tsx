import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { TaskItem } from '../components/shared/TaskItem';
import { useSessionStore } from '../store/useSessionStore'; // Import the store

function DashboardPage() {
  const [newTask, setNewTask] = useState('');
  const [taskError, setTaskError] = useState('');
  const [isLoadingTasks, setIsLoadingTasks] = useState(false); // Loading state for tasks
  const { tasks, addTask, completeTask, fetchTasks } = useSessionStore(); // Use store actions and state

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoadingTasks(true); // Start loading
      setTaskError(''); // Clear any previous errors
      try {
        await fetchTasks(); // Fetch tasks from database
      } catch (error) {
        console.error('DashboardPage: Error fetching tasks:', error);
        setTaskError('Failed to load tasks. Please try again later.'); // Set error message
      } finally {
        setIsLoadingTasks(false); // End loading, whether success or error
      }
    };

    loadTasks();
  }, [fetchTasks]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskError(''); // Clear previous error
    if (newTask.trim()) {
      try {
        await addTask(newTask); // Call addTask from store to add to database
        setNewTask(''); // Clear input field on success
      } catch (error) {
        console.error('DashboardPage: Failed to add task:', error);
        setTaskError('Failed to add task. Please try again.'); // Set error message
      }
    } else {
      setTaskError('Task description cannot be empty.');
    }
  };

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId); // Call completeTask from store to update database
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pb-24">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Goals</h2>
      </div>

      <div className="mt-8 w-full max-w-md">

        {isLoadingTasks ? (
          <div className="text-center">Loading tasks...</div>
        ) : (
          <ul className="space-y-1">
            {tasks.map((task) => (
              <li key={task.id}>
                <TaskItem
                  id={task.id}
                  title={task.title}
                  completed={task.is_finished}
                  onComplete={handleCompleteTask}
                />
              </li>
            ))}
          </ul>
        )}
                
          <form onSubmit={handleAddTask} className="relative flex items-center mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add something..."
            className="flex-grow px-4 py-2 border-b-2 border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Add task"
          >

            <Check className="w-4 h-4 text-white" />
            {taskError && <p className="text-red-500 text-sm mb-1">{taskError}</p>}

          </button>
        </form>
      </div>
    </div>
  );
}

export default DashboardPage;
