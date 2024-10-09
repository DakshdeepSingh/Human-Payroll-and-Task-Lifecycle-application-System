const mongoose = require('mongoose');
const id = require('../config/credentials');

const dBConnect = async () => {
    try {
        console.log("Attempting to connect to MongoDB Atlas...");
        await mongoose.connect(`mongodb+srv://${id.user1}:${id.pass1}@hrsuite.f0nxb.mongodb.net/?retryWrites=true&w=majority&appName=HRSuite`);

        console.log("Successfully connected to MongoDB Atlas");
    } catch (error) {
        console.error("MongoDB connection error occurred: ", error.message);
        throw error;
    }
}

module.exports = dBConnect;