const express = require('express');
const leaveSchema = require('../models/leaveRequestSchema');

const leaveRequest = async (req, res) => {
    try {
        const inputData = {
            userId: 101,
            leaveType: req.body.leaveType,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            reason: req.body.reason
        };
        
        console.log(req.body);

        if (!inputData.userId || !inputData.leaveType || !inputData.startDate || !inputData.endDate || !inputData.reason) {
            return res.status(400).send("Enter All Data");
        }
        
        // Create new leave request record
        const data = await leaveSchema.create(inputData);
        res.status(201).json({
            status: 201,
            message: 'Leave Request Added',
            data: data
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { leaveRequest };