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
    name: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
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