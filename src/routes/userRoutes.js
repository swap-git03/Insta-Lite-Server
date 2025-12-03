const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const upload = require("../middleware/multer");
const userController = require("../controllers/userController");

// Profile route
router.get("/profile/:id", protect, userController.getProfile);

// Update profile (with DP)
router.put(
  "/profile/:id",
  protect,
  upload.single("dp"),
  userController.updateProfile
);

// User posts
router.get("/posts/:id", userController.getUserPosts);

// All users
router.get("/all", protect, userController.getAllUsers);

// Follow / Unfollow
router.put("/follow/:id", protect, userController.followUser);
router.put("/unfollow/:id", protect, userController.unfollowUser);

// Followers / Following
router.get("/followers/:id", protect, userController.getFollowers);
router.get("/following/:id", protect, userController.getFollowing);

// Search users
router.get("/search/:query", protect, userController.searchUsers);

module.exports = router;
