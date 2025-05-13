const router = require('express').Router();

router.get("/signup", async (req, res) => {
    res.send("Signup Route");
})

router.get("/login", async (req, res) => {
    res.send("Login Route");
})

router.get("/logout", async (req, res) => {
    res.send("Logout Route");
})

module.exports = router;

