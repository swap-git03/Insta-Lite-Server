const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // No token sent
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Not authorized, no token" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user (excluding password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user; // Attach user to req
    next();

  } catch (err) {
    console.error("Auth middleware error:", err.message);

    return res.status(401).json({
      error: "Not authorized, invalid or expired token",
    });
  }
};

module.exports = protect;
