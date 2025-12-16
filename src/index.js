const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const path = require("path");
const fs = require("fs");

const app = express();

// ✅ CORRECT uploads folder (server/uploads)
const uploadDir = path.join(__dirname, "..", "uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// CORS
app.use(cors({ origin: "*", credentials: true }));

// Body parser
app.use(express.json());

// ✅ Serve uploaded images
app.use("/uploads", express.static(uploadDir));

// DB
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Health check
app.get("/", (req, res) => {
  res.send("Backend Running Locally");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Local server running on port ${PORT}`)
);
