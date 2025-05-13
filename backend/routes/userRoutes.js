const protectRoute = require("../middlewares/authMiddlewares");
const { getRecommendedUsers, getMyFriends } = require("../controllers/userControllers");
const router = require("express").Router();

//* Apply Auth MDW to all routes..
router.use(protectRoute)

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);




module.exports = router;