const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");

const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();


router.post("/register", registerUser);

router.post("/login", loginUser);


router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: "Profile accessed",
        user: req.user
    });
});


module.exports = router;