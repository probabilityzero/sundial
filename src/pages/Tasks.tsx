import React from 'react';
import { Plus } from 'lucide-react';
import { TaskItem } from '../components/shared/TaskItem';

function Tasks() {
  const [tasks] = React.useState([
    { id: '1', title: 'Complete Math Assignment', completed: false },
    { id: '2', title: 'Review Physics Notes', completed: true },
    { id: '3', title: 'Prepare for Chemistry Test', completed: false },
  ]);

  const handleComplete = (id: string) => {
    // This will be implemented with the store later
    console.log('Complete task:', id);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              completed={task.completed}
              onComplete={handleComplete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tasks;
