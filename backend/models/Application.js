const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
	{
		job: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Job",
			required: true,
		},

		student: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		// ✅ NEW (resume)
		resume: {
			type: String,
			required: true,
		},

		status: {
			type: String,
			enum: ["pending", "selected", "rejected"],
			default: "pending",
		},
	},
	{ timestamps: true },
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
