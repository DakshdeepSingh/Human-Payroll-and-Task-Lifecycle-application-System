const express = require('express');
const employee = require('../models/employeeSchema');
const bcrypt = require('bcrypt');

const addEmployee = async (req, res) => {
    try {
        const inputData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            email: req.body.email,
            age: req.body.age,
            salary: req.body.salary,
            designation: req.body.designation,
            passportNumber: req.body.passportNumber,
            nominee: req.body.nominee,
            userId: req.body.userId,
            password: await bcrypt.hash(req.body.password, 10),
            photo: req.file.filename // Store the uploaded photo's filename
        };
        
        console.log(inputData);
        if (!inputData.firstName || !inputData.lastName || !inputData.email || !inputData.userId || !inputData.password || !req.file) {
            return res.status(400).send("Enter All Data, including a photo");
        }

        // Check for existing employee by userId or email
        const checkId = await employee.findOne({ userId: inputData.userId });
        if (checkId) {
            return res.status(409).send({
                status: 409,
                message: 'Employee already exists'
            });
        }
        const checkEmail = await employee.findOne({ email: inputData.email });
        if (checkEmail) {
            return res.status(409).send({
                status: 409,
                message: 'An employee with this email already exists'
            });
        }

        // Add photo path to inputData
        inputData.photo = req.file.filename;  // Save the photo filename
        
        // Create new employee record
        const data = await employee.create(inputData);
        res.status(201).json({
            status: 201,
            message: 'Employee Added',
            data: data
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { addEmployee };