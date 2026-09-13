const mongoose = require("mongoose");

const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MOngo DB connected");
    } catch (error) {
        console.log("mongo db connection error:", error.message);
    }
};

module.exports = connectDB;