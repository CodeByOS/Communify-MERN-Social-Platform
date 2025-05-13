const User = require("../models/User");
const jwt = require("jsonwebtoken");


const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {

        if(!email || !password || !fullName) {
            return res.status(400).json({ message: "All fields are required..!" });
        }

        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters..!" });
        }

        const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailFormat.test(email)) {
            return res.status(400).json({ message: "Invalid Email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists, Please use different Email..!" });
        }

        //* Generate Avatar for users
        const imageIndex = Math.floor(Math.random() * 100) + 1; //generate a number between 1 and 100

        const randomAvatar = `https://avatar.iran.liara.run/public/${imageIndex}.png`

        //* Create User
        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
        });

        //TODO: CREATE THE USER IN STREAM

        if(!newUser) {
            return res.status(400).json({ message: "Failed to Create User..!" });
        }

        //* GENERATE JWT TOKEN
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn : "7d" });

        //* Add token to the cookie
        res.cookies("jwt", token, { 
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, //prevent XSS attacks
            sameSite: "strict", //prevent CSRF attacks
            secure: process.env.NODE_ENV === "production", //prevent HTTP requests
        })

        res.status(201).json({ success: true, user: newUser });

    } catch (err) {
        console.log("Error in SignUp Controller..!", err);
        res.status(500).json({ message: "Internal Server Error..!" });
    }
}


const login = async (req, res) => {
    try {
        
    } catch (err) {
        
    }
}


const logout = async (req, res) => {
    try {
        
    } catch (err) {
        
    }
}


module.exports = {
    signup,
    login,
    logout
}