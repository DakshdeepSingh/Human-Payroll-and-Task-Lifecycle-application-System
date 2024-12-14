const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    passportNumber: {
        type: String,
        required: true,
    },
    nominee: {
        type: String,
        required: true,
    },
    userId: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    emailNotifications: {
        type: Boolean,
        default: true
    },
    smsNotifications: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('employee', employeeSchema);