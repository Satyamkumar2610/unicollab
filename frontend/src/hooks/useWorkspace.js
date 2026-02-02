import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import useWorkspaceStore from '../stores/workspaceStore';
import useSocket from './useSocket';
import { useCallback } from 'react';

export const useWorkspace = (projectId) => {
    const queryClient = useQueryClient();
    const { setTasks, addTask, updateTask, deleteTask, setActiveUsers, moveTask } = useWorkspaceStore();

    // Fetch workspace
    const { data: workspace, isLoading: workspaceLoading } = useQuery({
        queryKey: ['workspace', projectId],
        queryFn: async () => {
            const response = await api.get(`/workspaces/project/${projectId}`);
            return response.data;
        },
        enabled: !!projectId,
        staleTime: 1000 * 60 * 5 // 5 minutes
    });

    const workspaceId = workspace?._id;

    // Fetch tasks
    const { data: tasks, isLoading: tasksLoading, error: tasksError } = useQuery({
        queryKey: ['tasks', workspaceId],
        queryFn: async () => {
            const response = await api.get(`/workspaces/${workspaceId}/tasks`);
            return response.data;
        },
        enabled: !!workspaceId,
        onSuccess: (data) => {
            setTasks(data);
        }
    });

    // Fetch dashboard summary
    const { data: dashboard } = useQuery({
        queryKey: ['dashboard', workspaceId],
        queryFn: async () => {
            const response = await api.get(`/workspaces/${workspaceId}/dashboard`);
            return response.data;
        },
        enabled: !!workspaceId,
        refetchInterval: 30000 // Refetch every 30 seconds
    });

    // Fetch activities
    const { data: activities } = useQuery({
        queryKey: ['activities', workspaceId],
        queryFn: async () => {
            const response = await api.get(`/workspaces/${workspaceId}/activities`);
            return response.data;
        },
        enabled: !!workspaceId
    });

    // Socket.io callbacks
    const handleTaskCreated = useCallback((task) => {
        addTask(task);
        queryClient.invalidateQueries(['tasks', workspaceId]);
        queryClient.invalidateQueries(['dashboard', workspaceId]);
    }, [addTask, queryClient, workspaceId]);

    const handleTaskUpdated = useCallback((task) => {
        updateTask(task._id, task);
        queryClient.invalidateQueries(['tasks', workspaceId]);
        queryClient.invalidateQueries(['dashboard', workspaceId]);
    }, [updateTask, queryClient, workspaceId]);

    const handleTaskMoved = useCallback((task) => {
        moveTask(task._id, task.status, task.order);
        queryClient.invalidateQueries(['tasks', workspaceId]);
        queryClient.invalidateQueries(['dashboard', workspaceId]);
    }, [moveTask, queryClient, workspaceId]);

    const handleTaskDeleted = useCallback((taskId) => {
        deleteTask(taskId);
        queryClient.invalidateQueries(['tasks', workspaceId]);
        queryClient.invalidateQueries(['dashboard', workspaceId]);
    }, [deleteTask, queryClient, workspaceId]);

    const handlePresenceUpdate = useCallback((activeUsers) => {
        setActiveUsers(activeUsers);
    }, [setActiveUsers]);

    // Setup Socket.io
    useSocket(workspaceId, {
        onTaskCreated: handleTaskCreated,
        onTaskUpdated: handleTaskUpdated,
        onTaskMoved: handleTaskMoved,
        onTaskDeleted: handleTaskDeleted,
        onPresenceUpdate: handlePresenceUpdate
    });

    // Mutations
    const createTaskMutation = useMutation({
        mutationFn: async (taskData) => {
            const response = await api.post(`/workspaces/${workspaceId}/tasks`, taskData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks', workspaceId]);
            queryClient.invalidateQueries(['dashboard', workspaceId]);
            queryClient.invalidateQueries(['activities', workspaceId]);
        }
    });

    const updateTaskMutation = useMutation({
        mutationFn: async ({ taskId, updates }) => {
            const response = await api.put(`/workspaces/${workspaceId}/tasks/${taskId}`, updates);
            return response.data;
        },
        onMutate: async ({ taskId, updates }) => {
            await queryClient.cancelQueries(['tasks', workspaceId]);
            const previousTasks = queryClient.getQueryData(['tasks', workspaceId]);

            queryClient.setQueryData(['tasks', workspaceId], (old) =>
                old?.map(task => task._id === taskId ? { ...task, ...updates } : task)
            );

            return { previousTasks };
        },
        onError: (err, variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(['tasks', workspaceId], context.previousTasks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries(['tasks', workspaceId]);
            queryClient.invalidateQueries(['dashboard', workspaceId]);
            queryClient.invalidateQueries(['activities', workspaceId]);
        }
    });

    const moveTaskMutation = useMutation({
        mutationFn: async ({ taskId, status, order }) => {
            const response = await api.patch(`/workspaces/${workspaceId}/tasks/${taskId}/status`, {
                status,
                order
            });
            return response.data;
        },
        onMutate: async ({ taskId, status, order }) => {
            await queryClient.cancelQueries(['tasks', workspaceId]);
            const previousTasks = queryClient.getQueryData(['tasks', workspaceId]);

            queryClient.setQueryData(['tasks', workspaceId], (old) =>
                old?.map(task => task._id === taskId ? { ...task, status, order } : task)
            );

            return { previousTasks };
        },
        onError: (err, variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(['tasks', workspaceId], context.previousTasks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries(['tasks', workspaceId]);
            queryClient.invalidateQueries(['dashboard', workspaceId]);
        }
    });

    const deleteTaskMutation = useMutation({
        mutationFn: async (taskId) => {
            await api.delete(`/workspaces/${workspaceId}/tasks/${taskId}`);
            return taskId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks', workspaceId]);
            queryClient.invalidateQueries(['dashboard', workspaceId]);
            queryClient.invalidateQueries(['activities', workspaceId]);
        }
    });

    return {
        workspace,
        workspaceId,
        tasks,
        dashboard,
        activities,
        isLoading: workspaceLoading || tasksLoading,
        error: tasksError,
        createTask: createTaskMutation.mutate,
        updateTask: updateTaskMutation.mutate,
        moveTask: moveTaskMutation.mutate,
        deleteTask: deleteTaskMutation.mutate,
        isCreating: createTaskMutation.isPending,
        isUpdating: updateTaskMutation.isPending,
        isMoving: moveTaskMutation.isPending,
        isDeleting: deleteTaskMutation.isPending
    };
};

export default useWorkspace;
