import React from 'react';
import { Check, Play, Loader2, Circle, CheckCircle, PauseCircle } from 'lucide-react';
import { TaskItem } from './shared/TaskItem';
import { motion } from 'framer-motion';

interface TaskListProps {
  isLoadingTasks: boolean;
  tasks: any[]; // Replace 'any' with the actual type of your tasks
  handleCompleteTask: (taskId: string) => Promise<void>;
  handleStartTask: (taskId: string, index: number) => Promise<void>;
  taskItemRefs: React.MutableRefObject<HTMLElement[]>;
}

export function TaskList({
  isLoadingTasks,
  tasks,
  handleCompleteTask,
  handleStartTask,
  taskItemRefs,
}: TaskListProps) {
  return (
    <>
      {isLoadingTasks ? (
        <div className="text-gray-600 flex items-center justify-center">
          <Loader2 className="mr-2 animate-spin" />
          Loading tasks...
        </div>
      ) : (
        <ul className="space-y-1 w-full">
          {tasks.map((task, index) => (
            <li
              key={task.id}
              ref={(el) => (taskItemRefs.current[index] = el)}
              className="flex items-center justify-start px-3 py-2 gap-2 w-full"
            >
              <button
                onClick={() => handleTaskClick(task.id, index, task.status)}
                className="text-gray-500 focus:outline-none"
              >
                {task.status === 'completed' ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : task.status === 'started' ? (
                  <PauseCircle className="h-6 w-6 text-blue-500" />
                ) : (
                  <Circle className="h-6 w-6" />
                )}
              </button>
              <TaskItem
                id={task.id}
                title={task.title}
                completed={task.status === 'completed'}
                onComplete={handleCompleteTask}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );

  async function handleTaskClick(taskId: string, index: number, currentStatus: string) {
    if (currentStatus === 'created' || currentStatus === 'pending') {
      await handleStartTask(taskId, index);
    } else if (currentStatus === 'started') {
      await handleCompleteTask(taskId);
    }
  }
}
