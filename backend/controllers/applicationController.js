const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const Notification = require("../models/Notification"); // 🔔 ADD

// ✅ STUDENT APPLY
const applyToJob = async (req, res) => {
	try {
		const { jobId } = req.body;

		const job = await Job.findById(jobId);

		if (!job) {
			return res.status(404).json({
				message: "Job not found",
			});
		}

		const alreadyApplied = await Application.findOne({
			job: jobId,
			student: req.user._id,
		});

		if (alreadyApplied) {
			return res.status(400).json({
				message: "Already applied to this job",
			});
		}

		const user = await User.findById(req.user._id);

		if (!user.resume) {
			return res.status(400).json({
				message: "Please upload resume first",
			});
		}

		// ✅ CREATE APPLICATION
		const application = await Application.create({
			job: jobId,
			student: req.user._id,
			resume: user.resume,
		});

		// 🔔 NOTIFY HR
		await Notification.create({
			user: job.postedBy,
			message: `New applicant applied for ${job.title}`,
		});

		res.status(201).json({
			message: "Applied successfully with resume 🚀",
			application,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

// ✅ HR - GET APPLICANTS
const getApplicantsForJob = async (req, res) => {
	try {
		const { jobId } = req.params;

		const job = await Job.findById(jobId);

		if (!job) {
			return res.status(404).json({
				message: "Job not found",
			});
		}

		if (job.postedBy.toString() !== req.user._id.toString()) {
			return res.status(403).json({
				message: "Not authorized to view applicants",
			});
		}

		const applications = await Application.find({ job: jobId })
			.populate("student", "name email resume")
			.populate("job", "title company");

		res.status(200).json({
			total: applications.length,
			applications,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

// ✅ HR - UPDATE STATUS
const updateApplicationStatus = async (req, res) => {
	try {
		const { status } = req.body;

		const application = await Application.findById(
			req.params.applicationId,
		);

		if (!application) {
			return res.status(404).json({
				message: "Application not found",
			});
		}

		const job = await Job.findById(application.job);

		if (!job) {
			return res.status(404).json({
				message: "Job not found",
			});
		}

		if (job.postedBy.toString() !== req.user._id.toString()) {
			return res.status(403).json({
				message: "Not authorized",
			});
		}

		const validStatus = ["pending", "selected", "rejected"];

		if (!validStatus.includes(status)) {
			return res.status(400).json({
				message: "Invalid status",
			});
		}

		application.status = status;
		await application.save();

		// 🔔 NOTIFY STUDENT
		await Notification.create({
			user: application.student,
			message: `Your application for ${job.title} has been ${status}`,
		});

		res.status(200).json({
			message: "Status updated successfully",
			application,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

// ✅ STUDENT - MY APPLICATIONS
const getMyApplications = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 6;
		const skip = (page - 1) * limit;

		// ✅ FIXED: student instead of user
		const applications = await Application.find({
			student: req.user._id,
		})
			.populate("job")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		const filteredApps = applications.filter((app) => app.job !== null);

		const total = filteredApps.length;

		res.json({
			applications: filteredApps,
			total,
			page,
			totalPages: Math.ceil(total / limit),
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	applyToJob,
	getApplicantsForJob,
	updateApplicationStatus,
	getMyApplications,
};
