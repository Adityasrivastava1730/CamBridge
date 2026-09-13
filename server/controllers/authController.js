const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// Register API
const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        user.password = undefined;

        res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Login API
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }
const token = jwt.sign(
   { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d"}
);
console.log(token);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



const getProfile = async (req,res) =>{
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json({
            user
        });
    
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};


module.exports = {
    registerUser,
    loginUser,
    getProfile
};
    