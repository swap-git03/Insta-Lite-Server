const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check duplicate username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Check duplicate email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let dp = null;
    if (req.file) {
      dp = `/uploads/${req.file.filename}`.replace(/\\/g, "/");
    }

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      dp,
    });

    res.status(201).json({
      msg: "User registered successfully",
      user: {
        id: user._id,
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



// LOGIN (USERNAME ONLY)
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Validate password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        _id: user._id,
        username: user.username,
        email: user.email,
        dp: user.dp,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
