const express = require('express');
const Team = require('../models/team');
const auth = require('../middleware/auth');
const { buildListResponse } = require('../utils/listResponse');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const team = await Team.create({
      ...req.body,
      leader: req.user.userId,
      members: [req.user.userId]
    });

    const populated = await team.populate('leader members', 'name avatar email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', order = 'desc' } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (req.query.university) {
      query.university = req.query.university;
    }

    if (req.query.major) {
      query.major = req.query.major;
    }

    const sort = { [sortBy]: order === 'desc' ? -1 : 1 };
    const teams = await Team.find(query)
      .populate('leader members', 'name avatar email')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Team.countDocuments(query);
    res.json(buildListResponse(teams, total, page, limit));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leader members projects', 'name avatar email title');

    if (!team) return res.status(404).json({ message: 'Team not found' });

    let teamData = team.toObject();
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        teamData.isOwner = team.leader._id.toString() === decoded.userId;
        teamData.isMember = team.members.some(m => m._id.toString() === decoded.userId);
      } catch (err) {

      }
    }

    res.json(teamData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/:id/join', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (team.members.some(m => m.toString() === req.user.userId)) {
      return res.status(400).json({ message: 'Already a member of this team' });
    }

    team.members.push(req.user.userId);
    await team.save();

    const populated = await team.populate('leader members projects', 'name avatar email title');
    const teamData = populated.toObject();
    teamData.isOwner = team.leader.toString() === req.user.userId;
    teamData.isMember = true;

    res.json(teamData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/:id/leave', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (team.leader.toString() === req.user.userId) {
      return res.status(403).json({ message: 'Team leader cannot leave the team. Please transfer leadership or delete the team.' });
    }

    if (!team.members.some(m => m.toString() === req.user.userId)) {
      return res.status(400).json({ message: 'You are not a member of this team' });
    }

    team.members = team.members.filter(m => m.toString() !== req.user.userId);
    await team.save();

    res.json({ message: 'Successfully left the team' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (team.leader.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('leader members projects', 'name avatar email title');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/:id/members', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (team.leader.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!team.members.includes(userId)) {
      team.members.push(userId);
      await team.save();
    }

    const populated = await team.populate('leader members', 'name avatar email');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id/members/:userId', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (team.leader.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    team.members = team.members.filter(m => m.toString() !== req.params.userId);
    await team.save();

    const populated = await team.populate('leader members', 'name avatar email');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (team.leader.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
