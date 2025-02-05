import React from 'react';
import { Play, Tag, Check } from 'lucide-react';
import { useStudyStore } from '../store/useStudyStore';
import { TaskItem } from '../components/shared/TaskItem';

function DashboardPage() {
  const [newTask, setNewTask] = React.useState('');
  const [taskError, setTaskError] = React.useState(''); // State for task error message
  const {
    currentSession,
    isStudying,
    startStudying,
    addTask,
    completeTask,
    fetchTasksForSession, // Ensure fetchTasksForSession is available
  } = useStudyStore();

  React.useEffect(() => {
    if (currentSession?.id) {
      fetchTasksForSession(currentSession.id);
    }
  }, [currentSession?.id, fetchTasksForSession]);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  const sessionType = getTimeOfDay();

  const handleStartSession = () => {
    startStudying(`${sessionType} Session`);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskError(''); // Clear any previous error
    if (newTask.trim()) {
      try {
        await addTask(newTask);
        setNewTask('');
      } catch (error) {
        console.error('Failed to add task:', error);
        setTaskError('Failed to add task. Please try again.'); // Set error message
      }
    } else {
      setTaskError('Task description cannot be empty.'); // Set error for empty task
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pb-24">
      <div className="text-center">
        <button
          onClick={handleStartSession}
          className="group relative h-32 w-32 rounded-full bg-primary-500 hover:bg-primary-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <Play className="w-12 h-12 text-white mx-auto transition-transform transform group-hover:scale-110" />
        </button>
        <div className="mt-4 flex items-center justify-center space-x-2">
          <span className="text-lg font-medium">{sessionType} Session</span>
          <Tag className="w-4 h-4 text-gray-500" />
        </div>
      </div>

      <div className="mt-8 w-full max-w-md">
        <form onSubmit={handleAddTask} className="relative flex items-center mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow px-4 py-2 border-b-2 border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Add task"
          >
            <Check className="w-4 h-4 text-white" />
          </button>
        </form>
        {taskError && <p className="text-red-500 text-sm mb-2">{taskError}</p>}
        <ul className="space-y-2">
          {currentSession?.tasks.map((task) => (
            <li key={task.id}>
              <TaskItem
                id={task.id}
                title={task.title}
                completed={task.is_finished}
                onComplete={completeTask}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DashboardPage;
