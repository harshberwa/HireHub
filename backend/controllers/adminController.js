const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

// ✅ CREATE HR (ADMIN ONLY)
const createHR = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// check existing
		const existing = await User.findOne({ email });
		if (existing) {
			return res.status(400).json({ message: "User already exists" });
		}

		// create HR
		const hr = await User.create({
			name,
			email,
			password,
			role: "hr",
		});

		res.status(201).json({
			message: "HR created successfully",
			hr,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// ✅ GET ALL USERS
const getAllUsers = async (req, res) => {
	try {
		const users = await User.find().select("-password");

		res.json({
			total: users.length,
			users,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// ✅ DELETE USER
const deleteUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		await user.deleteOne();

		res.json({ message: "User deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// ✅ GET ALL JOBS
const getAllJobsAdmin = async (req, res) => {
	try {
		const jobs = await Job.find().populate("postedBy", "name email");

		res.json({
			total: jobs.length,
			jobs,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// ✅ DELETE JOB
const deleteJob = async (req, res) => {
	try {
		const job = await Job.findById(req.params.id);

		if (!job) {
			return res.status(404).json({ message: "Job not found" });
		}

		await job.deleteOne();

		res.json({ message: "Job deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAdminStats = async (req, res) => {
	try {
		const totalUsers = await User.countDocuments();
		const totalJobs = await Job.countDocuments();
		const totalApplications = await Application.countDocuments();

		// ✅ FIXED COUNTS
		const totalHR = await User.countDocuments({
			role: "hr",
			isApproved: true,
		});

		const totalStudents = await User.countDocuments({
			role: "student",
		});

		// 🔥 MONTHLY USERS
		const usersByMonth = await User.aggregate([
			{
				$group: {
					_id: { $month: "$createdAt" },
					count: { $sum: 1 },
				},
			},
			{ $sort: { _id: 1 } },
		]);

		// 🔥 MONTHLY JOBS
		const jobsByMonth = await Job.aggregate([
			{
				$group: {
					_id: { $month: "$createdAt" },
					count: { $sum: 1 },
				},
			},
			{ $sort: { _id: 1 } },
		]);

		// 🔥 MONTHLY APPLICATIONS
		const appsByMonth = await Application.aggregate([
			{
				$group: {
					_id: { $month: "$createdAt" },
					count: { $sum: 1 },
				},
			},
			{ $sort: { _id: 1 } },
		]);

		res.json({
			totalUsers,
			totalJobs,
			totalApplications,
			totalHR,
			totalStudents,
			usersByMonth,
			jobsByMonth,
			appsByMonth,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// GET PENDING HR
const getPendingHR = async (req, res) => {
	const hrUsers = await User.find({ role: "hr", isApproved: false });
	res.json({ hrUsers });
};

// APPROVE
const approveHR = async (req, res) => {
	const user = await User.findById(req.params.id);

	if (!user) return res.status(404).json({ message: "User not found" });

	user.isApproved = true;
	await user.save();

	res.json({ message: "HR approved" });
};

// REJECT
const rejectHR = async (req, res) => {
	await User.findByIdAndDelete(req.params.id);
	res.json({ message: "HR rejected and deleted" });
};

module.exports = {
	createHR,
	getAllUsers,
	deleteUser,
	getAllJobsAdmin,
	deleteJob,
	getAdminStats,
	getPendingHR,
	approveHR,
	rejectHR,
};
