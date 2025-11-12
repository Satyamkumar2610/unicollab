const express = require('express');
const Project = require('../models/project');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/stats', auth, async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments({ 
      $or: [{ owner: req.user._id }, { members: req.user._id }] 
    });
    
    const activeProjects = await Project.countDocuments({ 
      $or: [{ owner: req.user._id }, { members: req.user._id }],
      status: 'active'
    });
    
    const collaborations = await Project.countDocuments({ 
      members: req.user._id,
      owner: { $ne: req.user._id }
    });

    res.json({
      totalProjects,
      activeProjects,
      collaborations
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;