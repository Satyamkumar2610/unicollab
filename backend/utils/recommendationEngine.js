const Project = require('../models/project');
const User = require('../models/user');

class RecommendationEngine {
  // Calculate similarity score between user skills and project requirements
  calculateSkillMatch(userSkills, projectSkills) {
    if (!userSkills?.length || !projectSkills?.length) return 0;
    
    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    const projectSkillsLower = projectSkills.map(s => s.toLowerCase());
    
    const matches = userSkillsLower.filter(skill => 
      projectSkillsLower.some(ps => ps.includes(skill) || skill.includes(ps))
    );
    
    return matches.length / projectSkillsLower.length;
  }

  // Get personalized project recommendations
  async getRecommendations(userId, limit = 10) {
    try {
      const user = await User.findById(userId);
      if (!user) return [];

      // Get projects user is not part of
      const projects = await Project.find({
        members: { $ne: userId },
        owner: { $ne: userId },
        status: { $in: ['planning', 'active'] }
      })
      .populate('owner', 'name university')
      .populate('members', 'name')
      .limit(50); // Get more to score and filter

      // Score each project
      const scoredProjects = projects.map(project => {
        let score = 0;

        // Skill match (40% weight)
        const skillMatch = this.calculateSkillMatch(user.skills, project.requiredSkills);
        score += skillMatch * 40;

        // Same university (30% weight)
        if (user.university === project.owner?.university) {
          score += 30;
        }

        // Project activity (20% weight)
        const daysSinceCreation = (Date.now() - project.createdAt) / (1000 * 60 * 60 * 24);
        if (daysSinceCreation < 7) score += 20;
        else if (daysSinceCreation < 30) score += 10;

        // Available spots (10% weight)
        if (!project.maxMembers || project.members.length < project.maxMembers) {
          score += 10;
        }

        return { project, score };
      });

      // Sort by score and return top recommendations
      return scoredProjects
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => ({
          ...item.project.toObject(),
          matchScore: Math.round(item.score)
        }));
    } catch (error) {
      console.error('Recommendation error:', error);
      return [];
    }
  }

  // Get trending projects
  async getTrendingProjects(limit = 10) {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      return await Project.find({
        status: { $in: ['planning', 'active'] },
        createdAt: { $gte: sevenDaysAgo }
      })
      .populate('owner', 'name university')
      .populate('members', 'name')
      .sort({ 'members.length': -1, createdAt: -1 })
      .limit(limit);
    } catch (error) {
      console.error('Trending projects error:', error);
      return [];
    }
  }

  // Get similar projects
  async getSimilarProjects(projectId, limit = 5) {
    try {
      const project = await Project.findById(projectId);
      if (!project) return [];

      const similarProjects = await Project.find({
        _id: { $ne: projectId },
        $or: [
          { category: project.category },
          { requiredSkills: { $in: project.requiredSkills } }
        ],
        status: { $in: ['planning', 'active'] }
      })
      .populate('owner', 'name')
      .populate('members', 'name')
      .limit(limit * 2);

      // Score by similarity
      const scored = similarProjects.map(p => {
        let score = 0;
        if (p.category === project.category) score += 50;
        
        const skillOverlap = p.requiredSkills.filter(s => 
          project.requiredSkills.includes(s)
        ).length;
        score += (skillOverlap / Math.max(p.requiredSkills.length, 1)) * 50;

        return { project: p, score };
      });

      return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.project);
    } catch (error) {
      console.error('Similar projects error:', error);
      return [];
    }
  }
}

module.exports = new RecommendationEngine();
