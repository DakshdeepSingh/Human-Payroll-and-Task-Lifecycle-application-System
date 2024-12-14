const mongoose = require('mongoose');

const supportRequestSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    issue: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SupportRequest', supportRequestSchema);