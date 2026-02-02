import React, { useEffect, useState } from 'react';
import useWorkspaceStore from '../../stores/workspaceStore';

const TeamPresence = ({ projectMembers = [] }) => {
    const { activeUsers } = useWorkspaceStore();
    const [onlineMembers, setOnlineMembers] = useState([]);

    useEffect(() => {
        if (projectMembers && activeUsers) {
            const online = projectMembers.filter(member => activeUsers.includes(member._id));
            setOnlineMembers(online);
        }
    }, [activeUsers, projectMembers]);

    const displayCount = 10;
    const displayMembers = onlineMembers.slice(0, displayCount);
    const remainingCount = Math.max(0, onlineMembers.length - displayCount);

    if (projectMembers.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Team
            </span>
            <div className="flex items-center -space-x-2">
                {displayMembers.map((member) => (
                    <div
                        key={member._id}
                        className="relative group"
                        title={`${member.name} - Active now`}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800 relative">
                            {member.name?.charAt(0).toUpperCase()}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                        </div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {member.name}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                    </div>
                ))}
                {remainingCount > 0 && (
                    <div
                        className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-bold border-2 border-white dark:border-gray-800"
                        title={`${remainingCount} more online`}
                    >
                        +{remainingCount}
                    </div>
                )}
            </div>
            {onlineMembers.length > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {onlineMembers.length} online
                </span>
            )}
        </div>
    );
};

export default TeamPresence;
