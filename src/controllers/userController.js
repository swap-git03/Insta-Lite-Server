const User = require("../models/User");
const Post = require("../models/Post");

// GET PROFILE (works)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET USER POSTS  (MISSING BEFORE)
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get ALL users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// FOLLOW USER
exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) return res.status(404).json({ error: "User not found" });
    if (userToFollow._id.equals(currentUser._id))
      return res.status(400).json({ error: "Cannot follow yourself" });

    if (userToFollow.followers.includes(currentUser._id))
      return res.status(400).json({ error: "Already following" });

    userToFollow.followers.push(currentUser._id);
    currentUser.following.push(userToFollow._id);

    await userToFollow.save();
    await currentUser.save();

    res.json({ msg: `You are now following ${userToFollow.username}` });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// UNFOLLOW USER
exports.unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) return res.status(404).json({ error: "User not found" });

    if (!userToUnfollow.followers.includes(currentUser._id))
      return res.status(400).json({ error: "Not following this user" });

    userToUnfollow.followers.pull(currentUser._id);
    currentUser.following.pull(userToUnfollow._id);

    await userToUnfollow.save();
    await currentUser.save();

    res.json({ msg: `You unfollowed ${userToUnfollow.username}` });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET FOLLOWERS
exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "username dp");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ followers: user.followers });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET FOLLOWING
exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("following", "username dp");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ following: user.following });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    // only allow user to update their own profile
    if (req.user.id !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updates = {};
    if (req.body.username) updates.username = req.body.username;
    if (req.body.bio) updates.bio = req.body.bio;

    // handle dp file
    if (req.file && req.file.path) {
      // store path relative to server root (same style you're using elsewhere)
      updates.dp = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select("-password");

    res.json({ msg: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const query = req.params.query;

    const users = await User.find({
      username: { $regex: query, $options: "i" }
    }).select("username dp _id");

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
