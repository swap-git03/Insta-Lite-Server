const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const upload = require("../middleware/multer");

router.post("/register", upload.single("dp"), register); // optional dp
router.post("/login", login);

module.exports = router;
