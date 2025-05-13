const protectRoute = require("../middlewares/authMiddlewares");
const { getRecommendedUsers, getMyFriends, sendFriendRequest } = require("../controllers/userControllers");
const router = require("express").Router();

//* Apply Auth MDW to all routes..
router.use(protectRoute)

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);




module.exports = router;