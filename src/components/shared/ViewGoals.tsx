import React from 'react';
import { Check, Play, Loader2, Circle, CheckCircle, PauseCircle } from 'lucide-react';
import { ViewGoalToday } from './ViewGoalToday';
import { motion } from 'framer-motion';

interface NewGoalBulletProps {
  isLoadingTasks: boolean;
  tasks: any[]; // Replace 'any' with the actual type of your tasks
  handleCompleteTask: (taskId: string) => Promise<void>;
  handleStartTask: (taskId: string, index: number) => Promise<void>;
  taskItemRefs: React.MutableRefObject<HTMLElement[]>;
}
export function ViewGoals({
  isLoadingTasks,
  tasks,
  handleCompleteTask,
  handleStartTask,
  taskItemRefs,
}: NewGoalBulletProps) {

  return (
    <>
      {isLoadingTasks ? (
        <div className="text-gray-600 w-full flex items-center justify-between">
          <button
            type="button"
            className="text-gray-500 focus:outline-none pl-3 mr-2"
          >
            <Circle className="h-6 w-6" />
          </button>

          <div className="w-full h-8 bg-gray-200 rounded-md overflow-hidden">
            <div className="flex top-0 left-0 w-full h-full shimmer"></div>
          </div>
        </div>
      ) : (
        <ul className="w-full">
          {tasks.map((task, index) => (
            <li
              key={task.id}
              ref={(el) => (taskItemRefs.current[index] = el)}
              className="flex items-start justify-start px-3 py-1.5 gap-2 w-full"
            >
              <button
                onClick={() => handleTaskClick(task.id, index, task.status)}
                className="text-gray-500 focus:outline-none flex-shrink-0"
              >
                  {task.status === 'completed' ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : task.status === 'started' ? (
                    <PauseCircle className="h-6 w-6 text-blue-500" />
                  ) : task.status === 'unfinished' ? (
                    <Circle className="h-6 w-6 text-red-500" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
              </button>

              <ViewGoalToday
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
    if (currentStatus === 'created' || currentStatus === 'unfinished') {
      await handleStartTask(taskId, index);
    } else if (currentStatus === 'started') {
      await handleCompleteTask(taskId);
    }
  }
}
