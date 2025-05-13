const router = require('express').Router();
const { signup, login, logout, onboard } = require("../controllers/authControllers");
const protectRoute = require("../middlewares/authMiddlewares");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout); //* POST METHOD --> For Updating something (jwt in this example) in server side

router.post("/onboarding", protectRoute, onboard);

//* Check if user is logged in
router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({ success: true, user: req.user })
})

module.exports = router;

