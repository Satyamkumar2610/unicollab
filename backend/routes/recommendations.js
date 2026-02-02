const express = require('express');
const auth = require('../middleware/auth');
const recommendationEngine = require('../utils/recommendationEngine');
const router = express.Router();

// Get personalized recommendations for user
router.get('/for-you', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const recommendations = await recommendationEngine.getRecommendations(
      req.user.userId,
      parseInt(limit)
    );
    res.json(recommendations);
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get trending projects
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const trending = await recommendationEngine.getTrendingProjects(parseInt(limit));
    res.json(trending);
  } catch (error) {
    console.error('Get trending error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get similar projects
router.get('/similar/:projectId', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const similar = await recommendationEngine.getSimilarProjects(
      req.params.projectId,
      parseInt(limit)
    );
    res.json(similar);
  } catch (error) {
    console.error('Get similar projects error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
