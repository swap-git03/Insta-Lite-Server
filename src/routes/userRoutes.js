const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const upload = require("../middleware/multer");
const userController = require("../controllers/userController");

// Get profile
router.get("/profile/:id", protect, userController.getProfile);

// Update profile (username, bio, dp)
router.put(
  "/profile/:id",
  protect,
  upload.single("dp"),
  userController.updateProfile
);

// Get user posts
router.get("/posts/:id", userController.getUserPosts);

// Get all users
router.get("/all", protect, userController.getAllUsers);

// Follow / Unfollow
router.put("/follow/:id", protect, userController.followUser);
router.put("/unfollow/:id", protect, userController.unfollowUser);

// Followers & Following
router.get("/followers/:id", protect, userController.getFollowers);
router.get("/following/:id", protect, userController.getFollowing);

// Search users
router.get("/search/:query", protect, userController.searchUsers);

module.exports = router;


