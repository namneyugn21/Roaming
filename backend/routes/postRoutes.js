const express = require('express');
const router = express.Router();
const postController = require("../controller/postController");
const verifyToken = require('../middleware/auth');

router.get("/", postController.getAllPosts);
router.post("/", verifyToken, postController.createPost);

module.exports = router;