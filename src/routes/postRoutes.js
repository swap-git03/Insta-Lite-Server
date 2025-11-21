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
  getFeed
} = require("../controllers/postController");

// Create post
router.post("/", protect, upload.single("image"), createPost);

// All posts
router.get("/", getAllPosts);

// Feed (FIXED)
router.get("/feed", protect, getFeed);

// Edit caption
router.put("/:id", protect, editPost);

// Delete post
router.delete("/:id", protect, deletePost);

// Like
router.post("/like", protect, likePost);

// Comment
router.post("/comment", protect, commentPost);

module.exports = router;
