const User = require("../models/User");

//* GET RECOMMANDED USERS
const getRecommendedUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const currentUser = await User.findById(currentUserId);

        //! recommandedUsers should excluded me(current user) and my friends...
        const recommandedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId }}, //* Exclude current user
                { $id: { $nin: currentUser.friends }}, //* Exclude current user's friends
                { isOnboarded: true }
            ]
        })
        res.status(200).json(recommandedUsers);
    } catch (err) {
        console.error("Error in getRecommendedUsers controller..!", err.message);
        res.status(500).json({ message: "Internal Server Error..!" });
    }
}

//* GET MY FRIENDS
const getMyFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
                                .select("friends")
                                
                                .populate("friends", "fullName profilePic nativeLanguage learningLanguage");
                                //* populate Method : replace a referenced document’s ID with the actual document data
        res.status(200).json(user.friends);
    } catch (err) {
        console.error("Error in getMyFriends controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    getRecommendedUsers,
    getMyFriends
}