const User = require("../models/User");
const FriendRequest = require("../models/friendRequest");

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

//* SEND FRIEND REQUEST
const sendFriendRequest = async (req, res) => {
    try {
        const myId = req.user.id;
        const { id: recipientId } = req.params;

        // prevent sending req to yourself
        if(myId === recipientId) {
            return res.status(400).json({ message: "You can't send a friend request to yourself..!" });
        }
        const recipient = await User.findById(recipientId);
        if(!recipient) {
            return res.status(404).json({ message: "Recipient Not Found..!" });
        }

        // prevent sending req to already friends
        const currentUser = await User.findById(myId);
        if(currentUser.friends.includes(recipientId)) {
            return res.status(400).json({ message: "You are already friends with this user..!" });
        }

        // check if the friend request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        });
        if(existingRequest) {
            return res.status(400).json({ message: "Friend request already exists..!" });
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        });
        res.status(201).json({
            message: "Friend request sent successfully..!",
            friendRequest
        });

    } catch (err) {
        console.error("Error in sendFriendRequest controller..!", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    getRecommendedUsers,
    getMyFriends,
    sendFriendRequest
}