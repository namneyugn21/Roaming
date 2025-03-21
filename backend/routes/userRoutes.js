const express = require('express');
const router = express.Router();
const userController = require("../controller/userController");
const verifyToken = require("../middleware/auth");

// sign up route
router.post("/register", userController.register);

// get the current signed in user
router.get("/me", verifyToken, userController.getCurrentUser);

// update the current signed in user
router.put("/me", verifyToken, userController.updateCurrentUser);

// get the current signed in user posts
router.get("/:userId/posts", verifyToken, userController.getCurrentUserPosts);

// update the current user posts avatar
router.put("/:userId/posts", verifyToken, userController.updateCurrentUserPosts);

module.exports = router;