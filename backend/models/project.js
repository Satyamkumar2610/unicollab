const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  requiredSkills: [String],
  maxMembers: Number,
  deadline: Date,
  category: String,
  status: { type: String, enum: ['planning', 'active', 'completed'], default: 'planning' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);