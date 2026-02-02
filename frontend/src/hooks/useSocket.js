import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

let socketInstance = null;

export const getSocket = (token) => {
    if (!socketInstance && token) {
        socketInstance = io(SOCKET_URL, {
            auth: { token },
            autoConnect: false
        });
    }
    return socketInstance;
};

export const useSocket = (workspaceId, callbacks = {}) => {
    const socketRef = useRef(null);
    const {
        onTaskCreated,
        onTaskUpdated,
        onTaskMoved,
        onTaskDeleted,
        onPresenceUpdate
    } = callbacks;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || !workspaceId) return;

        const socket = getSocket(token);
        socketRef.current = socket;

        socket.connect();

        socket.on('connect', () => {
            console.log('Socket connected');
            socket.emit('workspace:join', { workspaceId });
        });

        socket.on('task:created', (task) => {
            console.log('Task created event:', task);
            onTaskCreated?.(task);
        });

        socket.on('task:updated', (task) => {
            console.log('Task updated event:', task);
            onTaskUpdated?.(task);
        });

        socket.on('task:moved', (task) => {
            console.log('Task moved event:', task);
            onTaskMoved?.(task);
        });

        socket.on('task:deleted', ({ taskId }) => {
            console.log('Task deleted event:', taskId);
            onTaskDeleted?.(taskId);
        });

        socket.on('presence:update', ({ activeUsers }) => {
            console.log('Presence update:', activeUsers);
            onPresenceUpdate?.(activeUsers);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return () => {
            if (socket) {
                socket.emit('workspace:leave', { workspaceId });
                socket.off('connect');
                socket.off('task:created');
                socket.off('task:updated');
                socket.off('task:moved');
                socket.off('task:deleted');
                socket.off('presence:update');
                socket.off('disconnect');
                socket.off('connect_error');
            }
        };
    }, [workspaceId, onTaskCreated, onTaskUpdated, onTaskMoved, onTaskDeleted, onPresenceUpdate]);

    return socketRef.current;
};

export default useSocket;
