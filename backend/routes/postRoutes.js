const express = require('express');
const router = express.Router();
const postController = require("../controller/postController");
const verifyToken = require('../middleware/auth');

router.get("/", postController.getAllPosts);
router.post("/", verifyToken, postController.createPost);
router.delete("/:postId", verifyToken, postController.deletePost);
router.delete("/images/:imageId", verifyToken, postController.deleteImage); // delete an image (post image and avatar) on cloudinary

module.exports = router;