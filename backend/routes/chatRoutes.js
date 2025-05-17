const protectRoute = require("../middlewares/authMiddlewares");
const getStreamToken = require("../controllers/chatControllers");

const router = require("express").Router();


router.get("/token", protectRoute, getStreamToken); // Get stream token for the user

module.exports = router;