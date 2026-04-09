const express = require("express");
const router = express.Router();

const {
	registerUser,
	loginUser,
	verifyEmail,
	uploadResume,
} = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ EMAIL VERIFY
router.get("/verify-email/:token", verifyEmail);

// ✅ RESUME UPLOAD
router.post("/upload-resume", protect, upload.single("resume"), uploadResume);

module.exports = router;
