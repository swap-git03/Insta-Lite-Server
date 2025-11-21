const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const upload = require("../middleware/multer");   // ✅ ADD THIS
const userController = require("../controllers/userController");

// Profile route
router.get("/profile/:id", protect, userController.getProfile);

// update profile (edit profile)
router.put("/profile/:id", protect, upload.single("dp"), userController.updateProfile);

// User posts
router.get("/posts/:id", userController.getUserPosts);

// All users
router.get("/all", protect, userController.getAllUsers);

// Follow/unfollow
router.put("/follow/:id", protect, userController.followUser);
router.put("/unfollow/:id", protect, userController.unfollowUser);

// Followers / following
router.get("/followers/:id", protect, userController.getFollowers);
router.get("/following/:id", protect, userController.getFollowing);


router.get("/search/:query", protect, userController.searchUsers);

module.exports = router;
