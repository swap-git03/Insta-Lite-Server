const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// Middlewares
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-netlify-url.netlify.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// DB Connection
connectDB();

// Routes
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
