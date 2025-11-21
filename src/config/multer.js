const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

/* ==== CLOUDINARY CONFIG ==== */
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

/* ==== CLOUDINARY STORAGE ==== */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "swapinsta",          // Cloud folder name
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1080, crop: "limit" }] // Optional resize
  }
});

/* ==== MULTER UPLOAD ==== */
const upload = multer({ storage });

module.exports = upload;
