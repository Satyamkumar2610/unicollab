const express = require('express');
const CollaborationRequest = require('../models/collaborationRequest');
const Notification = require('../models/notification');
const Project = require('../models/project');
const auth = require('../middleware/auth');
const { buildListResponse } = require('../utils/listResponse');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { projectId, message } = req.body;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.members.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Already a member' });
    }

    const existing = await CollaborationRequest.findOne({
      project: projectId,
      requester: req.user.userId,
      status: 'pending'
    });

    if (existing) {
      return res.status(400).json({ message: 'Request already pending' });
    }

    const request = await CollaborationRequest.create({
      project: projectId,
      requester: req.user.userId,
      message
    });

    await Notification.create({
      recipient: project.owner,
      sender: req.user.userId,
      type: 'collaboration_request',
      title: 'New Collaboration Request',
      message: `Someone requested to join your project`,
      relatedProject: projectId,
      relatedRequest: request._id
    });

    await request.populate('requester', 'name avatar');
    await request.populate('project', 'title');
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const userProjects = await Project.find({ owner: req.user.userId }).select('_id');
    let query = { project: { $in: userProjects.map(p => p._id) } };

    if (status) {
      query.status = status;
    }

    const requests = await CollaborationRequest.find(query)
      .populate('requester', 'name avatar email')
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await CollaborationRequest.countDocuments(query);
    res.json(buildListResponse(requests, total, page, limit));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/accept', auth, async (req, res) => {
  try {
    const request = await CollaborationRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const project = await Project.findById(request.project);
    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = 'accepted';
    request.respondedAt = new Date();
    request.respondedBy = req.user.userId;
    await request.save();

    project.members.push(request.requester);
    await project.save();

    await Notification.create({
      recipient: request.requester,
      sender: req.user.userId,
      type: 'collaboration_request',
      title: 'Request Accepted',
      message: `Your request to join ${project.title} was accepted`,
      relatedProject: project._id
    });

    await request.populate('requester', 'name avatar');
    await request.populate('project', 'title');
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/reject', auth, async (req, res) => {
  try {
    const request = await CollaborationRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const project = await Project.findById(request.project);
    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = 'rejected';
    request.respondedAt = new Date();
    request.respondedBy = req.user.userId;
    await request.save();

    await request.populate('requester', 'name avatar');
    await request.populate('project', 'title');
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
