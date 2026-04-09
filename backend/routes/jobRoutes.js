const express = require("express");
const router = express.Router();

const {
	createJob,
	getAllJobs,
	getSingleJob,
	deleteJob,
	updateJob,
	getMyJobs,
} = require("../controllers/jobController");

const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

router.post("/", protect, authorizeRoles("hr"), createJob);

// ✅ IMPORTANT: specific route first
router.get("/my-jobs", protect, authorizeRoles("hr"), getMyJobs);

// ✅ PROTECT KAR DIYA
router.get("/", getAllJobs);

router.get("/:id", protect, getSingleJob);

router.delete("/:id", protect, authorizeRoles("hr"), deleteJob);
router.put("/:id", protect, authorizeRoles("hr"), updateJob);

module.exports = router;
