const Notification = require('../models/notification');

class NotificationService {
  constructor(io) {
    this.io = io;
  }

  async create({ userId, type, title, message, link, metadata = {} }) {
    try {
      const notification = await Notification.create({
        user: userId,
        type,
        title,
        message,
        link,
        metadata
      });

      if (this.io) {
        this.io.to(`user:${userId}`).emit('notification', notification);
      }

      return notification;
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  }

  async notifyProjectInvite(userId, project, invitedBy) {
    return this.create({
      userId,
      type: 'project_invite',
      title: 'Project Invitation',
      message: `${invitedBy.name} invited you to join "${project.title}"`,
      link: `/projects/${project._id}`,
      metadata: { projectId: project._id, invitedById: invitedBy._id }
    });
  }

  async notifyProjectJoin(ownerId, project, newMember) {
    return this.create({
      userId: ownerId,
      type: 'project_join',
      title: 'New Team Member',
      message: `${newMember.name} joined your project "${project.title}"`,
      link: `/projects/${project._id}`,
      metadata: { projectId: project._id, memberId: newMember._id }
    });
  }

  async markAsRead(notificationIds, userId) {
    return Notification.updateMany(
      { _id: { $in: notificationIds }, user: userId },
      { read: true, readAt: new Date() }
    );
  }

  async getUnreadCount(userId) {
    return Notification.countDocuments({ user: userId, read: false });
  }
}

module.exports = NotificationService;
