const jwt = require('jsonwebtoken');

const onlineUsers = new Map();

const setupSocketHandlers = (io) => {
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.userId;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.userId}`);

        socket.on('workspace:join', ({ workspaceId }) => {
            socket.join(`workspace:${workspaceId}`);

            if (!onlineUsers.has(workspaceId)) {
                onlineUsers.set(workspaceId, new Set());
            }
            onlineUsers.get(workspaceId).add(socket.userId);

            const activeUsers = Array.from(onlineUsers.get(workspaceId));
            io.to(`workspace:${workspaceId}`).emit('presence:update', { activeUsers });

            console.log(`User ${socket.userId} joined workspace ${workspaceId}`);
        });

        socket.on('workspace:leave', ({ workspaceId }) => {
            socket.leave(`workspace:${workspaceId}`);

            if (onlineUsers.has(workspaceId)) {
                onlineUsers.get(workspaceId).delete(socket.userId);
                const activeUsers = Array.from(onlineUsers.get(workspaceId));
                io.to(`workspace:${workspaceId}`).emit('presence:update', { activeUsers });
            }

            console.log(`User ${socket.userId} left workspace ${workspaceId}`);
        });

        socket.on('task:typing', ({ workspaceId, taskId, isTyping }) => {
            socket.to(`workspace:${workspaceId}`).emit('task:typing', {
                userId: socket.userId,
                taskId,
                isTyping
            });
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.userId}`);

            onlineUsers.forEach((users, workspaceId) => {
                if (users.has(socket.userId)) {
                    users.delete(socket.userId);
                    const activeUsers = Array.from(users);
                    io.to(`workspace:${workspaceId}`).emit('presence:update', { activeUsers });
                }
            });
        });
    });
};

module.exports = { setupSocketHandlers };
