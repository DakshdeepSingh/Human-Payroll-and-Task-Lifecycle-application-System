const express = require('express');
const leaveSchema = require('../models/leaveRequestSchema');

const leaveRequest = async (req, res) => {
    try {
        const inputData = {
            userId: req.user?.id || 101,
            leaveType: req.body.leaveType,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            reason: req.body.reason
        };
        
        const existingLeave = await leaveSchema.findOne({
            userId: inputData.userId,
            $or: [
                { startDate: { $lte: inputData.endDate }, endDate: { $gte: inputData.startDate } }
            ]
        });
        
        if (existingLeave) {
            return res.status(400).json({ error: 'Overlapping leave request exists.' });
        }
        
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

// const updateLeaveRequestStatus = async (req, res) => {
//     try {
//         const { id, status } = req.body;

//         if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
//             return res.status(400).json({ error: 'Invalid status.' });
//         }

//         const leaveRequest = await leaveSchema.findByIdAndUpdate(id, { status }, { new: true });

//         if (!leaveRequest) {
//             return res.status(404).json({ error: 'Leave request not found.' });
//         }

//         res.status(200).json({ message: 'Leave request updated.', leaveRequest });
//     } catch (err) {
//         console.error('Error updating leave request:', err);
//         res.status(500).json({ error: 'Internal server error.' });
//     }
// };

const updateLeaveRequestStatus = async (req, res) => {
    try {
        const { id, status } = req.body;

        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status.' });
        }

        const leaveRequest = await leaveSchema.findByIdAndUpdate(id, { status }, { new: true });

        if (!leaveRequest) {
            return res.status(404).json({ error: 'Leave request not found.' });
        }

        res.status(200).json({ message: 'Leave request updated.', leaveRequest });
    } catch (err) {
        console.error('Error updating leave request:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = { leaveRequest, updateLeaveRequestStatus };