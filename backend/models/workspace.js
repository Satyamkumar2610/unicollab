const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        unique: true
    },
    settings: {
        allowGuestView: { type: Boolean, default: false },
        taskCategories: [{ type: String }],
        defaultAssignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
}, { timestamps: true });

workspaceSchema.index({ project: 1 });

module.exports = mongoose.model('Workspace', workspaceSchema);
