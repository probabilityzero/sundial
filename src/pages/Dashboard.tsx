import React from 'react';
import { Play, Pause, Plus, Tag } from 'lucide-react';
import { useStudyStore } from '../store/useStudyStore';

function DashboardPage() {
  const [newTask, setNewTask] = React.useState('');
  const {
    currentSession,
    isStudying,
    isPaused,
    startStudying,
    pauseStudying,
    resumeStudying,
    endStudying,
    addTask,
    completeTask
  } = useStudyStore();

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      addTask(newTask);
      setNewTask('');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {currentSession?.title || `${getTimeOfDay()} Session`}
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => isStudying ? (isPaused ? resumeStudying() : pauseStudying()) : startStudying(`${getTimeOfDay()} Session`)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isStudying
                ? isPaused
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isStudying ? (
              isPaused ? (
                <>
                  <Play className="w-5 h-5" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              )
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start Session
              </>
            )}
          </button>
          {isStudying && (
            <button
              onClick={endStudying}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              End Session
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Tasks</h3>
          <button className="flex items-center gap-2 text-blue-500 hover:text-blue-600">
            <Tag className="w-4 h-4" />
            Add Tag
          </button>
        </div>

        <form onSubmit={handleAddTask} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {currentSession?.tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => completeTask(task.id)}
                className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
              />
              <span className={task.completed ? 'line-through text-gray-500' : ''}>
                {task.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
