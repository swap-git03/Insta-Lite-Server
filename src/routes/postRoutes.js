const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const upload = require("../middleware/multer");

const {
  createPost,
  getAllPosts,
  likePost,
  commentPost,
  editPost,
  deletePost,
  getFeed,
} = require("../controllers/postController");

// Create a post with image
router.post("/", protect, upload.single("image"), createPost);

// Get all posts
router.get("/", getAllPosts);

// Feed (following + self)
router.get("/feed", protect, getFeed);

// Edit caption only
router.put("/:id", protect, editPost);

// Delete post
router.delete("/:id", protect, deletePost);

// Like/unlike post
router.post("/like", protect, likePost);

// Comment on post
router.post("/comment", protect, commentPost);

module.exports = router;
