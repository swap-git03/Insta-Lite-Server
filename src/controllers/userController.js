const User = require("../models/User");

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
    console.error("Follow Error:", err);
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
    console.error("Unfollow Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET FOLLOWERS
exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("followers", "username dp");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ followers: user.followers });
  } catch (err) {
    console.error("Get Followers Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET FOLLOWING
exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("following", "username dp");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ following: user.following });
  } catch (err) {
    console.error("Get Following Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
