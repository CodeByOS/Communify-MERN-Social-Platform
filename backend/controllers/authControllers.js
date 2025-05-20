const { upsertStreamUser } = require("../config/stream");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const sendEmail = require("../config/sendEmail");


//! Signup Controller
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
        })

        try {
            // Attempt to create or update a Stream user with provided user details
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
            })

            console.log(`Stream User created for ${newUser.fullName}`);
        } catch (err) {
            console.log("Error creating Stream User..!", err);
        }
        

        if(!newUser) {
            return res.status(400).json({ message: "Failed to Create User..!" });
        }

        //* Send Verification Email
        // ✅ Send Welcome Email
        await sendEmail({
            to: newUser.email,
            subject: "Welcome to Communify!",
            text: `Hi ${newUser.fullName}, Welcome to Communify!`,
            html:`
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <a href='https://postimg.cc/0ztD7f6Z' target='_blank'><img src='https://i.postimg.cc/0ztD7f6Z/Communify-logo.png' border='0' alt='Communify-logo'/></a>
                <h2>Hi ${newUser.fullName},</h2>
                <h3>Welcome to <strong>Communify</strong> — we're excited to have you on board!</h3>
                <h3>Start chatting and connecting with others right now 🚀</h3>
                <h4>– The Communify Team</h4>
                </div>
            `,
        });


        //* GENERATE JWT TOKEN
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn : "7d" });

        //* Add token to the cookie
        res.cookie("jwt", token, { 
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, //prevent XSS attacks
            sameSite: "strict", //prevent CSRF attacks
            secure: process.env.NODE_ENV === "production", //prevent HTTP requests
        })

        res.status(201).json({ success: true, user: newUser });

    } catch (err) {
        console.log("Error in SignUp Controller..!", err.message);
        res.status(500).json({ message: "Internal Server Error..!" });
    }
}

//! Login Controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: "All fields are required..!" });
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(401).json({ message: "Invalid Credentials..!" });
        }

        const isPasswordCorrect = await user.matchPassword(password);
        if(!isPasswordCorrect) return res.status(401).json({ message: "Invalid Credentials..!" });

        //* GENERATE JWT TOKEN
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn : "7d" });

        //* Add token to the cookie
        res.cookie("jwt", token, { 
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, //prevent XSS attacks
            sameSite: "strict", //prevent CSRF attacks
            secure: process.env.NODE_ENV === "production", //prevent HTTP requests
        })

        res.status(200).json({ success: true, user });

    } catch (err) {
        console.log("Error in Login Controller..!", err.message);
        res.status(500).json({ message: "Internal Server Error..!" });
    }
}

//! Logout Controller
const logout = async (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "Logout Successful" });
}


//! Onboard Controller
const onboard = async (req, res) => {
    // console.log(req.user); //* req.user from the protected route
    try {
        const userId = req.user._id;
        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({ 
                message: "All fields are required..!",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean), //* Returns only true values
            })
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,
        }, { new: true }) //* Returns updated User..

        if(!updatedUser) {
            return res.status(404).json({ message: "User Not Found..!" })
        }

        //*UPDATE THE USER INFO IN STREAM
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic,
            })

        console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
        } catch (err) {
            console.log("Error updating Stream user during onboarding..!", streamError.message);
        }

        res.status(200).json({ success: true, user: updatedUser });
    } catch (err) {
        console.log("Onboarding Error..!", err);
        res.status(500).json({ message: "Internal Server Error..!" });
    }
}

module.exports = {
    signup,
    login,
    logout,
    onboard
}