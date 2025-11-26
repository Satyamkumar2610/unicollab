import React, { useMemo } from 'react';
import { useList } from '../../hooks/useList';
import { api } from '../../services/api';
import { LoadingState } from '../ui/LoadingState';
import { ErrorState } from '../ui/ErrorState';

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const KanbanBoard = ({ projectId }) => {
  const { data: tasks, loading, error } = useList(() => api.get(`/projects/${projectId}/tasks`));

  const columns = useMemo(() => {
    const groupedTasks = {
      'todo': { title: 'To Do', tasks: [] },
      'in-progress': { title: 'In Progress', tasks: [] },
      'done': { title: 'Done', tasks: [] },
    };

    if (tasks) {
      tasks.forEach(task => {
        if (groupedTasks[task.status]) {
          groupedTasks[task.status].tasks.push(task);
        }
      });
    }

    return groupedTasks;
  }, [tasks]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-bold text-lg">Task Board</h3>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          <PlusIcon />
          New Task
        </button>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(columns).map(([columnId, column]) => (
          <div key={columnId} className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
            <h4 className="font-bold mb-4 text-center">{column.title}</h4>
            <div className="space-y-4">
              {column.tasks.map(task => (
                <div key={task.id} className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
                  <p>{task.content}</p>
                </div>
              ))}
              <button className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md">
                <PlusIcon />
                Add card
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
