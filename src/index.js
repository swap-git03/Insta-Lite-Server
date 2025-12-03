const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const path = require("path");
const fs = require("fs");

const app = express();

// Ensure uploads folder exists (safe fix)
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// CORS FIX — IMPORTANT FOR NETLIFY + RENDER
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Static folder for uploaded images
app.use("/uploads", express.static(uploadDir));

// Connect DB
connectDB();

// Import Routes
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
