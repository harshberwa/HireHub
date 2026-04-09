const express = require("express");
const router = express.Router();

const {
	applyToJob,
	getApplicantsForJob,
	updateApplicationStatus,
	getMyApplications,
} = require("../controllers/applicationController");

const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

// STUDENT
router.post("/", protect, authorizeRoles("student"), applyToJob);
router.get("/my", protect, authorizeRoles("student"), getMyApplications);

// HR
router.get("/:jobId", protect, authorizeRoles("hr"), getApplicantsForJob);
router.put(
	"/status/:applicationId",
	protect,
	authorizeRoles("hr"),
	updateApplicationStatus,
);

module.exports = router;
