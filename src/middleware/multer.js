const multer = require("multer");
const path = require("path");

// Storage engine for saving files locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // local uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Allow only image files
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG/PNG images allowed"));
  }
};

module.exports = multer({ storage, fileFilter });
