const router = require('express').Router();
const { signup, login, logout, onboard } = require("../controllers/authControllers");
const protectRoute = require("../middlewares/authMiddlewares");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/onboarding", protectRoute, onboard);

module.exports = router;

