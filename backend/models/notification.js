const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['collaboration_request', 'project_update', 'member_joined', 'member_left'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  relatedRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'CollaborationRequest' },
  read: { type: Boolean, default: false },
  actionUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
