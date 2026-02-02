import React from 'react';

const WorkspaceDashboard = ({ dashboard, onCreateTask }) => {
    if (!dashboard) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const metrics = [
        {
            label: 'Total Tasks',
            value: dashboard.totalTasks,
            color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
            icon: '📋'
        },
        {
            label: 'In Progress',
            value: dashboard.inProgress,
            color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
            icon: '🔄'
        },
        {
            label: 'Completed',
            value: dashboard.done,
            color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
            icon: '✅'
        },
        {
            label: 'Overdue',
            value: dashboard.overdue,
            color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
            icon: '⚠️'
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Workspace Overview</h2>
                {onCreateTask && (
                    <button
                        onClick={onCreateTask}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                    >
                        + New Task
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.map((metric, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-lg ${metric.color}`}
                    >
                        <div className="text-2xl mb-1">{metric.icon}</div>
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <div className="text-sm font-medium mt-1">{metric.label}</div>
                    </div>
                ))}
            </div>

            {dashboard.totalTasks > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Progress: {dashboard.completionPercentage}%
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {dashboard.done} of {dashboard.totalTasks} tasks
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${dashboard.completionPercentage}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkspaceDashboard;
