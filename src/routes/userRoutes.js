const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const userController = require("../controllers/userController");
// const { followUser, unfollowUser } = require("../controllers/userController");


// Follow/unfollow
router.put("/follow/:id", protect, userController.followUser);
router.put("/unfollow/:id", protect, userController.unfollowUser);

// Get followers/following
router.get("/followers/:id", protect, userController.getFollowers);
router.get("/following/:id", protect, userController.getFollowing);

module.exports = router;
