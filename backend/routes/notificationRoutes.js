const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { protect } = require("../middlewares/authMiddleware");

// GET
router.get("/", protect, async (req, res) => {
	const notifications = await Notification.find({
		user: req.user._id,
	}).sort({ createdAt: -1 });

	res.json({ notifications });
});

// MARK AS READ
router.put("/:id/read", protect, async (req, res) => {
	const notif = await Notification.findById(req.params.id);

	notif.read = true;
	await notif.save();

	res.json({ message: "Marked as read" });
});

module.exports = router;
