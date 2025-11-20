const express = require('express');
const Project = require('../models/project');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(query)
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({ projects, total, page: parseInt(page), limit: parseInt(limit), totalPages });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    console.log('Creating project with data:', req.body);
    console.log('User ID from auth:', req.user.userId);
    
    const projectData = {
      ...req.body,
      owner: req.user.userId,
      members: [req.user.userId]
    };
    
    const project = await Project.create(projectData);
    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members', 'name email');
    
    console.log('Project created:', populatedProject);
    res.status(201).json(populatedProject);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('owner members', 'name email');
    
    res.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/:id/join', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.members.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Already a member' });
    }
    
    if (project.maxMembers && project.members.length >= project.maxMembers) {
      return res.status(400).json({ message: 'Project is full' });
    }
    
    project.members.push(req.user.userId);
    await project.save();
    
    const updatedProject = await Project.findById(project._id)
      .populate('owner members', 'name email');
    
    res.json(updatedProject);
  } catch (error) {
    console.error('Join project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/:id/leave', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (!project.members.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Not a member of this project' });
    }
    
    if (project.owner.toString() === req.user.userId) {
      return res.status(400).json({ message: 'Owner cannot leave the project' });
    }
    
    project.members = project.members.filter(memberId => memberId.toString() !== req.user.userId);
    await project.save();
    
    const updatedProject = await Project.findById(project._id)
      .populate('owner members', 'name email');
    
    res.json(updatedProject);
  } catch (error) {
    console.error('Leave project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
