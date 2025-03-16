const express = require('express');
const router = express.Router();
const userController = require("../controller/userController");
const verifyToken = require("../middleware/auth");

// sign up route
router.post("/register", userController.register);

// get the current signed in user
router.get("/me", verifyToken, userController.getCurrentUser);

// get the current signed in user posts
router.get("/:userId/posts", verifyToken, userController.getCurrentUserPosts);

module.exports = router;