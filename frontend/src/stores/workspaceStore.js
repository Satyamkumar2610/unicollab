import { create } from 'zustand';

const useWorkspaceStore = create((set, get) => ({
    tasks: [],
    activeUsers: [],
    selectedTask: null,
    filters: {
        status: 'all',
        assignee: 'all',
        priority: 'all',
        search: ''
    },

    // Actions
    setTasks: (tasks) => set({ tasks }),

    addTask: (task) => set((state) => ({
        tasks: [...state.tasks, task]
    })),

    updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map(task =>
            task._id === taskId ? { ...task, ...updates } : task
        )
    })),

    moveTask: (taskId, newStatus, newOrder) => set((state) => ({
        tasks: state.tasks.map(task =>
            task._id === taskId
                ? { ...task, status: newStatus, order: newOrder }
                : task
        )
    })),

    deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter(task => task._id !== taskId)
    })),

    setActiveUsers: (users) => set({ activeUsers: users }),

    setSelectedTask: (task) => set({ selectedTask: task }),

    setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
    })),

    clearFilters: () => set({
        filters: {
            status: 'all',
            assignee: 'all',
            priority: 'all',
            search: ''
        }
    }),

    // Computed/derived state
    getFilteredTasks: () => {
        const { tasks, filters } = get();

        return tasks.filter(task => {
            const matchesStatus = filters.status === 'all' || task.status === filters.status;
            const matchesAssignee = filters.assignee === 'all' ||
                task.assignees.some(a => a._id === filters.assignee);
            const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
            const matchesSearch = !filters.search ||
                task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                task.description.toLowerCase().includes(filters.search.toLowerCase());

            return matchesStatus && matchesAssignee && matchesPriority && matchesSearch;
        });
    },

    getTasksByStatus: (status) => {
        const filteredTasks = get().getFilteredTasks();
        return filteredTasks.filter(task => task.status === status)
            .sort((a, b) => a.order - b.order);
    }
}));

export default useWorkspaceStore;
