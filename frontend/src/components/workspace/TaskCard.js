import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const priorityColors = {
    low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    urgent: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
};

const TaskCard = ({ task, onClick }) => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

    return (
        <div
            onClick={() => onClick?.(task)}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow duration-200"
        >
            <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 flex-1">
                    {task.title}
                </h4>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ml-2 ${priorityColors[task.priority]}`}>
                    {task.priority}
                </span>
            </div>

            {task.description && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {task.description}
                </p>
            )}

            {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                    {task.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                            {tag}
                        </span>
                    ))}
                    {task.tags.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">+{task.tags.length - 3}</span>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                    {task.assignees?.slice(0, 3).map((assignee) => (
                        <div
                            key={assignee._id}
                            className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800"
                            title={assignee.name}
                        >
                            {assignee.name?.charAt(0).toUpperCase()}
                        </div>
                    ))}
                    {task.assignees?.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-bold border-2 border-white dark:border-gray-800">
                            +{task.assignees.length - 3}
                        </div>
                    )}
                </div>

                {task.dueDate && (
                    <div className={`text-xs ${isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                        {isOverdue && '⚠️ '}
                        {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
