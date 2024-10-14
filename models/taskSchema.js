const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    taskId: {
        type: Number,
        required: true,
        unique: true
    },
    task: {
        type: String,
        required: true
    },
    assignedDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('task', taskSchema);