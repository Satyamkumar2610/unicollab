const express = require('express');
const Project = require('../models/project');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('owner members', 'name email university major');
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      owner: req.user._id,
      members: [req.user._id]
    });
    await project.save();
    await project.populate('owner members', 'name email university major');
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner members', 'name email university major');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/join', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already a member' });
    }
    
    project.members.push(req.user._id);
    await project.save();
    res.json({ message: 'Joined project successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;