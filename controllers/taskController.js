const express = require('express');
const taskSchema = require('../models/taskSchema');

const taskAssignment = async (req, res) => {
    try {
        const { name, userId, designation, title, description, assignedDate, dueDate, status } = req.body;

        if (!name || !userId || !designation || !title || !description || !assignedDate || !dueDate) {
            return res.status(400).send("All fields are required");
        }

        const lastTask = await taskSchema.findOne().sort({ taskId: -1 });
        const newTaskId = lastTask ? lastTask.taskId + 1 : 1;

        const inputData = {
            name,
            userId,
            taskId: newTaskId,
            designation,
            title,
            description,
            assignedDate,
            dueDate,
            status: status || false // Default to false if status is not provided
        };

        const data = await taskSchema.create(inputData);
        res.status(201).json({
            status: 201,
            message: 'Task Assigned Successfully',
            data: data
        });
    } catch (err) {
        console.error("Error assigning task:", err);
        res.status(500).send("Internal Server Error");
    }
};

const taskToggleStatus = async (req, res) => {
    try {
        const { taskId } = req.body;

        if (!taskId) {
            return res.status(400).send("Task ID is required");
        }

        const task = await taskSchema.findOne({ taskId });

        if (!task) {
            return res.status(404).send("Task not found");
        }

        task.status = !task.status;
        const updatedTask = await task.save();

        res.status(200).json({
            status: 200,
            message: 'Task status toggled successfully',
            data: updatedTask
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

const taskDelete = async (req, res) => {
    try {
        const { taskId } = req.body;

        // Validate input
        if (!taskId) {
            return res.status(400).send("Task ID is required");
        }

        // Delete the task by taskId
        const result = await taskSchema.findOneAndDelete({ taskId });

        // Check if the task was found and deleted
        if (!result) {
            return res.status(404).send("Task not found");
        }

        res.status(200).json({
            status: 200,
            message: 'Task deleted successfully',
            data: result
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { taskAssignment, taskToggleStatus, taskDelete };