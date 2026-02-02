const express = require('express');
const mongoose = require('mongoose');
const Project = require('../models/project');
const auth = require('../middleware/auth');
const { buildListResponse } = require('../utils/listResponse');
const { createLimiter } = require('../middleware/rateLimiter');
const { validate, schemas } = require('../middleware/validator');
const { cache, cacheKeys } = require('../utils/cache');
const router = express.Router();

router.get('/', cache.middleware(cacheKeys.projects, 300), async (req, res) => {
  try {
    const {
      status,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
      category,
      skills,
      member,
      excludeOwner
    } = req.query;

    let query = {};

    if (member) {
      query.members = member;
    }

    console.log('Projects API Query:', JSON.stringify(query, null, 2));

    if (excludeOwner) {
      query.owner = { $ne: excludeOwner };
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      query.requiredSkills = { $in: skillsArray };
    }

    const sort = { [sortBy]: order === 'desc' ? -1 : 1 };

    const projects = await Project.find(query)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(query);

    res.json(buildListResponse(projects, total, page, limit));
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', auth, createLimiter, validate(schemas.createProject), async (req, res) => {
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
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    console.log('Project created:', populatedProject);
    res.status(201).json(populatedProject);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', cache.middleware(cacheKeys.project, 180), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', auth, validate(schemas.updateProject), async (req, res) => {
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
    ).populate('owner members', 'name email avatar');

    // Invalidate cache
    cache.delete(cacheKeys.project({ params: { id: req.params.id } }));

    res.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id/members/:userId', auth, async (req, res) => {
  try {
    const { id, userId } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (project.owner.toString() === userId) {
      return res.status(400).json({ message: 'Cannot remove owner from project' });
    }

    project.members = project.members.filter(memberId => memberId.toString() !== userId);
    await project.save();

    const updatedProject = await Project.findById(id)
      .populate('owner members', 'name email avatar');

    res.json(updatedProject);
  } catch (error) {
    console.error('Remove member error:', error);
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
      .populate('owner members', 'name email avatar');

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
      .populate('owner members', 'name email avatar');

    res.json(updatedProject);
  } catch (error) {
    console.error('Leave project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
