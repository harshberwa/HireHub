const express = require("express");
const router = express.Router();

const {
	registerUser,
	loginUser,
	uploadResume,
} = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddleware");

// ✅ ADD THIS LINE (IMPORTANT)
const upload = require("../middlewares/uploadMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ RESUME UPLOAD
router.post("/upload-resume", protect, upload.single("resume"), uploadResume);

module.exports = router;
