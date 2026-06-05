const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const {
	getMyProfile,
	updateProfile,
	uploadResume,
	toggleSaveJob,
	getSavedJobs,
} = require("../controllers/userController");

router.get("/me", protect, getMyProfile);
router.put("/update-profile", protect, updateProfile);
router.post("/upload-resume", protect, upload.single("resume"), uploadResume);
router.post("/save-job/:id", protect, toggleSaveJob);
router.get("/saved-jobs", protect, getSavedJobs);

module.exports = router;
