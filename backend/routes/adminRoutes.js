const express = require("express");
const router = express.Router();

const {
	createHR,
	getAllUsers,
	deleteUser,
	getAllJobsAdmin,
	deleteJob,
	getAdminStats,
	getPendingHR,
	approveHR,
	rejectHR,
} = require("../controllers/adminController");

const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

// ✅ ADMIN DASHBOARD STATS
router.get("/stats", protect, authorizeRoles("admin"), getAdminStats);

// HR create
router.post("/create-hr", protect, authorizeRoles("admin"), createHR);

// USERS
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUser);

// JOBS
router.get("/jobs", protect, authorizeRoles("admin"), getAllJobsAdmin);
router.delete("/jobs/:id", protect, authorizeRoles("admin"), deleteJob);

// HR APPROVAL
router.get("/pending-hr", protect, authorizeRoles("admin"), getPendingHR);
router.put("/approve-hr/:id", protect, authorizeRoles("admin"), approveHR);
router.delete("/reject-hr/:id", protect, authorizeRoles("admin"), rejectHR);

module.exports = router;
