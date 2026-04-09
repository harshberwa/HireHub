const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");

const {
	getMyProfile,
	updateProfile,
	uploadResume,
	toggleSaveJob,
	getSavedJobs,
} = require("../controllers/userController");

router.get("/me", protect, getMyProfile);
router.put("/update-profile", protect, updateProfile);

router.post("/save-job/:id", protect, toggleSaveJob);
router.get("/saved-jobs", protect, getSavedJobs);

module.exports = router;
