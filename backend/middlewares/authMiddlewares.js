const jwt = require("jsonwebtoken");
const User = require("../models/User");


const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({ message: "Unauthorized - No token Provided..!" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token..!" });
        }

        const user = await User.findById(decoded.userId).select("-password"); // we can get the user id from the payload token
        if(!user) {
            return res.status(401).json({ message: "Unauthorized - User Not Found..!" });
        }

        req.user = user;

        next();

    } catch (err) {
        console.log("Error in protectRoute Middleware..!", err);
        res.status(500).json({ message: "Internal Server Error..!" });
    }
}

module.exports = protectRoute;