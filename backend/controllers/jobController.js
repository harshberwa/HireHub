const Job = require("../models/Job");
const Application = require("../models/Application");

// Create Job
const createJob = async (req, res) => {
	try {
		const { title, company, location, salary, salaryType, description } =
			req.body;

		if (!title || !company || !location || !salaryType || !description) {
			return res.status(400).json({
				message: "Please fill all required fields",
			});
		}

		const job = await Job.create({
			title,
			company,
			location,
			salary: Number(salary) || 0,
			salaryType: salaryType || "yearly",
			description,
			postedBy: req.user._id,
		});

		res.status(201).json({
			message: "Job Created Successfully",
			job,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// GET ALL JOBS
const getAllJobs = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 6;
		const skip = (page - 1) * limit;

		const { keyword, location, minSalary, sort } = req.query;

		let query = {};

		if (keyword) {
			query.$or = [
				{ title: { $regex: keyword, $options: "i" } },
				{ company: { $regex: keyword, $options: "i" } },
			];
		}

		if (location) {
			query.location = { $regex: location, $options: "i" };
		}

		if (minSalary) {
			query.salary = { $gte: Number(minSalary) };
		}

		let sortOption = {};

		if (sort === "salary_high") sortOption = { salary: -1 };
		else if (sort === "salary_low") sortOption = { salary: 1 };
		else sortOption = { createdAt: -1 };

		const jobs = await Job.find(query)
			.populate("postedBy", "name email")
			.sort(sortOption)
			.skip(skip)
			.limit(limit);

		const total = await Job.countDocuments(query);

		res.status(200).json({
			jobs,
			total,
			page,
			totalPages: Math.ceil(total / limit),
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get My Jobs (HR)
const getMyJobs = async (req, res) => {
	try {
		const jobs = await Job.find({
			postedBy: req.user._id,
		}).sort({ createdAt: -1 });

		res.status(200).json({
			total: jobs.length,
			jobs,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// GET SINGLE JOB
const getSingleJob = async (req, res) => {
	try {
		const job = await Job.findById(req.params.id).populate(
			"postedBy",
			"name email",
		);

		if (!job) {
			return res.status(404).json({ message: "Job not found" });
		}

		res.json({ job });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// DELETE JOB
const deleteJob = async (req, res) => {
	try {
		const jobId = req.params.id;

		const job = await Job.findById(jobId);

		if (!job) {
			return res.status(404).json({ message: "Job not found" });
		}

		if (job.postedBy.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: "Not authorized" });
		}

		await Application.deleteMany({ job: jobId });
		await Job.findByIdAndDelete(jobId);

		res.json({
			message: "Job and related applications deleted successfully",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// UPDATE JOB
const updateJob = async (req, res) => {
	try {
		const job = await Job.findById(req.params.id);

		if (!job) {
			return res.status(404).json({ message: "Job not found" });
		}

		if (job.postedBy.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: "Not authorized" });
		}

		const { title, company, location, salary, salaryType, description } =
			req.body;

		if (!title || !company || !location || !salaryType || !description) {
			return res.status(400).json({
				message: "All fields required",
			});
		}

		job.title = title;
		job.company = company;
		job.location = location;
		job.salary = Number(salary) || 0;
		job.salaryType = salaryType;
		job.description = description;

		await job.save();

		res.json({
			message: "Job updated successfully",
			job,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	createJob,
	getAllJobs,
	getMyJobs,
	getSingleJob,
	deleteJob,
	updateJob,
};
