import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const actionIcons = {
    task_created: '➕',
    task_updated: '✏️',
    task_moved: '🔄',
    task_deleted: '🗑️',
    task_assigned: '👤',
    task_unassigned: '👋',
    member_joined: '🎉',
    member_left: '👋'
};

const actionMessages = {
    task_created: (activity) => `created task "${activity.metadata?.taskTitle}"`,
    task_updated: (activity) => `updated a task`,
    task_moved: (activity) => `moved task from ${activity.metadata?.from} to ${activity.metadata?.to}`,
    task_deleted: (activity) => `deleted task "${activity.metadata?.taskTitle}"`,
    task_assigned: (activity) => `assigned a task`,
    task_unassigned: (activity) => `unassigned from a task`,
    member_joined: (activity) => `joined the workspace`,
    member_left: (activity) => `left the workspace`
};

const ActivityFeed = ({ activities }) => {
    if (!activities || activities.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No activity yet. Start creating tasks!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {activities.activities?.map((activity, index) => (
                    <div
                        key={activity._id || index}
                        className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                    >
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                {activity.user?.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 dark:text-white">
                                <span className="font-semibold">{activity.user?.name || 'Someone'}</span>{' '}
                                <span className="text-gray-600 dark:text-gray-400">
                                    {actionMessages[activity.action]?.(activity) || activity.action}
                                </span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                        <div className="flex-shrink-0 text-xl">
                            {actionIcons[activity.action] || '📌'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityFeed;
