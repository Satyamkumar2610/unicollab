const express = require('express');
const router = express.Router();
const Workspace = require('../models/workspace');
const Task = require('../models/task');
const ActivityLog = require('../models/activityLog');
const Project = require('../models/project');
const auth = require('../middleware/auth');

// Get or create workspace for a project
router.get('/project/:projectId', auth, async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (!project.members.includes(req.user.userId) && project.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to access this workspace' });
        }

        let workspace = await Workspace.findOne({ project: projectId });

        if (!workspace) {
            workspace = await Workspace.create({ project: projectId });
            await Project.findByIdAndUpdate(projectId, { workspace: workspace._id });
        }

        res.json(workspace);
    } catch (error) {
        console.error('Get workspace error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all tasks for a workspace
router.get('/:workspaceId/tasks', auth, async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { status, assignee, priority, search } = req.query;

        const workspace = await Workspace.findById(workspaceId).populate('project');
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        const project = workspace.project;
        if (!project.members.includes(req.user.userId) && project.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        let query = { workspace: workspaceId };

        if (status && status !== 'all') query.status = status;
        if (assignee && assignee !== 'all') query.assignees = assignee;
        if (priority && priority !== 'all') query.priority = priority;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const tasks = await Task.find(query)
            .populate('assignees', 'name email avatar')
            .populate('createdBy', 'name email avatar')
            .sort({ order: 1, createdAt: -1 });

        res.json(tasks);
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create a new task
router.post('/:workspaceId/tasks', auth, async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { title, description, assignees, status, priority, tags, dueDate } = req.body;

        const workspace = await Workspace.findById(workspaceId).populate('project');
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        const project = workspace.project;
        if (!project.members.includes(req.user.userId) && project.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const maxOrder = await Task.findOne({ workspace: workspaceId, status: status || 'backlog' })
            .sort({ order: -1 })
            .select('order');

        const task = await Task.create({
            title,
            description,
            workspace: workspaceId,
            project: workspace.project._id,
            assignees: assignees || [],
            status: status || 'backlog',
            priority: priority || 'medium',
            tags: tags || [],
            dueDate,
            order: maxOrder ? maxOrder.order + 1 : 0,
            createdBy: req.user.userId
        });

        const populatedTask = await Task.findById(task._id)
            .populate('assignees', 'name email avatar')
            .populate('createdBy', 'name email avatar');

        await ActivityLog.create({
            workspace: workspaceId,
            project: workspace.project._id,
            user: req.user.userId,
            action: 'task_created',
            targetType: 'task',
            targetId: task._id,
            metadata: { taskTitle: title }
        });

        const io = req.app.get('io');
        if (io) {
            io.to(`workspace:${workspaceId}`).emit('task:created', populatedTask);
        }

        res.status(201).json(populatedTask);
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update a task
router.put('/:workspaceId/tasks/:taskId', auth, async (req, res) => {
    try {
        const { workspaceId, taskId } = req.params;
        const updates = req.body;

        const workspace = await Workspace.findById(workspaceId).populate('project');
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        const project = workspace.project;
        if (!project.members.includes(req.user.userId) && project.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { ...updates, updatedAt: Date.now() },
            { new: true }
        )
            .populate('assignees', 'name email avatar')
            .populate('createdBy', 'name email avatar');

        await ActivityLog.create({
            workspace: workspaceId,
            project: workspace.project._id,
            user: req.user.userId,
            action: 'task_updated',
            targetType: 'task',
            targetId: taskId,
            metadata: { updates }
        });

        const io = req.app.get('io');
        if (io) {
            io.to(`workspace:${workspaceId}`).emit('task:updated', updatedTask);
        }

        res.json(updatedTask);
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update task status (for drag-and-drop)
router.patch('/:workspaceId/tasks/:taskId/status', auth, async (req, res) => {
    try {
        const { workspaceId, taskId } = req.params;
        const { status, order } = req.body;

        const workspace = await Workspace.findById(workspaceId).populate('project');
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        const project = workspace.project;
        if (!project.members.includes(req.user.userId) && project.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const oldStatus = task.status;
        task.status = status;
        if (order !== undefined) task.order = order;
        await task.save();

        const updatedTask = await Task.findById(taskId)
            .populate('assignees', 'name email avatar')
            .populate('createdBy', 'name email avatar');

        await ActivityLog.create({
            workspace: workspaceId,
            project: workspace.project._id,
            user: req.user.userId,
            action: 'task_moved',
            targetType: 'task',
            targetId: taskId,
            metadata: { from: oldStatus, to: status }
        });

        const io = req.app.get('io');
        if (io) {
            io.to(`workspace:${workspaceId}`).emit('task:moved', updatedTask);
        }

        res.json(updatedTask);
    } catch (error) {
        console.error('Update task status error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete a task
router.delete('/:workspaceId/tasks/:taskId', auth, async (req, res) => {
    try {
        const { workspaceId, taskId } = req.params;

        const workspace = await Workspace.findById(workspaceId).populate('project');
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        const project = workspace.project;
        if (!project.members.includes(req.user.userId) && project.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await Task.findByIdAndDelete(taskId);

        await ActivityLog.create({
            workspace: workspaceId,
            project: workspace.project._id,
            user: req.user.userId,
            action: 'task_deleted',
            targetType: 'task',
            targetId: taskId,
            metadata: { taskTitle: task.title }
        });

        const io = req.app.get('io');
        if (io) {
            io.to(`workspace:${workspaceId}`).emit('task:deleted', { taskId });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get activity log for workspace
router.get('/:workspaceId/activities', auth, async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const workspace = await Workspace.findById(workspaceId).populate('project');
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        const project = workspace.project;
        if (!project.members.includes(req.user.userId) && project.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const activities = await ActivityLog.find({ workspace: workspaceId })
            .populate('user', 'name email avatar')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await ActivityLog.countDocuments({ workspace: workspaceId });

        res.json({
            activities,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get activities error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get dashboard summary
router.get('/:workspaceId/dashboard', auth, async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const workspace = await Workspace.findById(workspaceId).populate('project');
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        const project = workspace.project;
        if (!project.members.includes(req.user.userId) && project.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const tasks = await Task.find({ workspace: workspaceId });

        const summary = {
            totalTasks: tasks.length,
            backlog: tasks.filter(t => t.status === 'backlog').length,
            inProgress: tasks.filter(t => t.status === 'in-progress').length,
            review: tasks.filter(t => t.status === 'review').length,
            done: tasks.filter(t => t.status === 'done').length,
            overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length,
            completionPercentage: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0
        };

        res.json(summary);
    } catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
