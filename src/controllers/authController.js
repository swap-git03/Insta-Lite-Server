const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // VALIDATION
    if (!username || !email || !password)
      return res.status(400).json({ error: "Username, email, and password are required" });

    // CHECK DUPLICATES
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingUser)
      return res.status(400).json({ error: "Username or Email already exists" });

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // DP (OPTIONAL)
    const dpPath = req.file ? req.file.path : "uploads/default_dp.png";

    // CREATE USER
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
    res.status(500).json({ error: err.message });
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
