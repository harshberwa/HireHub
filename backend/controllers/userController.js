const User = require("../models/User");

// ✅ GET MY PROFILE
const getMyProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");

		res.json(user);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

// ✅ UPDATE PROFILE
const updateProfile = async (req, res) => {
	try {
		const { name, bio, skills } = req.body;

		const user = await User.findById(req.user._id);

		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		user.name = name || user.name;
		user.bio = bio || user.bio;

		// skills string → array
		if (skills) {
			user.skills = skills.split(",").map((s) => s.trim());
		}

		await user.save();

		res.json({
			message: "Profile updated successfully",
			user,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// 🔥 SAVE / UNSAVE JOB
const toggleSaveJob = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		const jobId = req.params.id;

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const alreadySaved = user.savedJobs.includes(jobId);

		if (alreadySaved) {
			// ❌ REMOVE
			user.savedJobs = user.savedJobs.filter(
				(id) => id.toString() !== jobId,
			);
		} else {
			// ✅ ADD
			user.savedJobs.push(jobId);
		}

		await user.save();

		res.json({
			success: true,
			savedJobs: user.savedJobs,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// 🔥 GET SAVED JOBS
const getSavedJobs = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).populate("savedJobs");

		res.json({
			success: true,
			jobs: user.savedJobs,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getMyProfile,
	updateProfile,
	toggleSaveJob,
	getSavedJobs,
};
