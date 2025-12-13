const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const upload = require("../middleware/multer");

// Register (optional DP upload)
router.post("/register", upload.single("dp"), register);

// Login
router.post("/login", login);

module.exports = router;
