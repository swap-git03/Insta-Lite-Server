const Post = require("../models/Post");
const User = require("../models/User");

// CREATE POST
exports.createPost = async (req, res) => {
  try {
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Local image path (static served)
    const imagePath = `/uploads/${req.file.filename}`.replace(/\\/g, "/");

    const post = await Post.create({
      user: req.user.id,
      caption,
      image: imagePath,
    });

    res.status(201).json({
      msg: "Post created successfully",
      post,
    });

  } catch (err) {
    console.error("Create Post Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET ALL POSTS
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username dp")
      .populate("comments.user", "username dp")
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (err) {
    console.error("Get All Posts Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// LIKE / UNLIKE POST
exports.likePost = async (req, res) => {
  try {
    const { postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.user.id;

    // Already liked → unlike
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      await post.save();
      return res.json({ msg: "Post unliked", likes: post.likes });
    }

    // Like post
    post.likes.push(userId);
    await post.save();

    res.json({ msg: "Post liked", likes: post.likes });

  } catch (err) {
    console.error("Like Post Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// COMMENT POST
exports.commentPost = async (req, res) => {
  try {
    const { postId, text } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.comments.push({
      user: req.user.id,
      text,
    });

    await post.save();

    res.json({
      msg: "Comment added",
      comments: post.comments,
    });

  } catch (err) {
    console.error("Comment Post Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// EDIT POST (caption only)
exports.editPost = async (req, res) => {
  try {
    const { caption } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    post.caption = caption;
    await post.save();

    res.json({ msg: "Post updated", post });

  } catch (err) {
    console.error("Edit Post Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE POST
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await post.deleteOne();

    res.json({ msg: "Post deleted successfully" });

  } catch (err) {
    console.error("Delete Post Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET FEED (self + following)
exports.getFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("following");

    const ids = [req.user.id, ...user.following];

    const posts = await Post.find({ user: { $in: ids } })
      .populate("user", "username dp")
      .populate("comments.user", "username dp")
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (err) {
    console.error("Feed Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
