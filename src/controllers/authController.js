const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
// REGISTER (Cloudinary Ready)
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ error: "Username, email, and password are required" });

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser)
      return res.status(400).json({ error: "Username or Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // If DP uploaded, Cloudinary gives URL in req.file.path
    let dpPath = req.file?.path || null;

    // Default DP if none uploaded
    if (!dpPath) dpPath = "https://res.cloudinary.com/demo/image/upload/v1690000000/default_dp.png";

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      dp: dpPath,
    });

    res.status(201).json({
      msg: "Account created successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        dp: user.dp,
      },
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ error: "Username and password are required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "swaplegends",
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        dp: user.dp,
      },
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: err.message });
  }
};
