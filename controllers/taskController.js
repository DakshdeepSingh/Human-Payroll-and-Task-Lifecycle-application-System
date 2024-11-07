const express = require('express');
const taskSchema = require('../models/taskSchema');

const taskAssignment = async (req, res) => {
    try {
        const inputData = {
            userId: 101,
            taskId: req.body.taskId,
            task: req.body.task,
            assignedDate: req.body.assignedDate,
            dueDate: req.body.dueDate,
            status: req.body.status
        };
        
        console.log(req.body);

        if (!inputData.userId || !inputData.taskId || !inputData.task || !inputData.assignedDate || !inputData.dueDate || !inputData.status) {
            return res.status(400).send("Enter All Data");
        }
        
        // Create new task record
        const data = await taskSchema.create(inputData);
        res.status(201).json({
            status: 201,
            message: 'Task Assigned Successfully',
            data: data
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

const taskToggleStatus = async (req, res) => {
    try {
        const { taskId } = req.body;

        // Validate input
        if (!taskId) {
            return res.status(400).send("Task ID is required");
        }

        // Find the task by taskId
        const task = await taskSchema.findOne({ taskId });

        // Check if the task exists
        if (!task) {
            return res.status(404).send("Task not found");
        }

        // Toggle the status
        task.status = !task.status;

        // Save the updated task
        const updatedTask = await task.save();

        res.status(200).json({
            status: 200,
            message: 'Task status toggled successfully',
            data: updatedTask
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
}

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