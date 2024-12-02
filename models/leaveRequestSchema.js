const mongoose = require('mongoose');

const leaveRequest = new mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    leaveType: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'Pending', // Default to 'Pending' on submission
        enum: ['Pending', 'Approved', 'Rejected']
    }
});

module.exports = mongoose.model('leaveRequest', leaveRequest);