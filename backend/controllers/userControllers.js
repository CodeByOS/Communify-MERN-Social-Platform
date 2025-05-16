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
                { _id: { $nin: currentUser.friends }}, //* Exclude current user's friends
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
        console.error("Error in getMyFriends controller", err.message);
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
        res.status(201).json({ friendRequest });
    } catch (err) {
        console.error("Error in sendFriendRequest controller..!", err.message);
        return res.status(500).json({ message: "Internal Server Error..!" });
    }
}

//* ACCEPT FRIEND REQUEST
const acceptFriendRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        // Verify the current user is the recipient
        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this request" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        // add each user to the other's friends array
        // $addToSet: adds elements to an array only if they do not already exist.
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        });

        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        console.log("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//* GET FRIEND REQUESTS
const getFriendRequests = async (req, res) => {
    try {
        const incomingReqs = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending",
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        const acceptedReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",
        }).populate("recipient", "fullName profilePic");

        res.status(200).json({ incomingReqs, acceptedReqs });
    } catch (error) {
        console.log("Error in getPendingFriendRequests controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//* GET OUTGOING FRIEND REQUESTS
const getOutgoingFriendRequests = async (req, res) => {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        })
        .populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);
    } catch (err) {
        console.error("Error in getOutgoingFriendRequests controller..!", err.message);
        res.status(500).json({ message: "Internal Server Error..!" });
    }
}


module.exports = {
    getRecommendedUsers,
    getMyFriends,
    sendFriendRequest,
    acceptFriendRequest,
    getFriendRequests,
    getOutgoingFriendRequests
}