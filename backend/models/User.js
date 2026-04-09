const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},

		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},

		password: {
			type: String,
			required: true,
			minlength: 6,
		},

		role: {
			type: String,
			enum: ["student", "hr", "admin"],
			default: "student",
		},

		resume: {
			type: String,
			default: "",
		},

		bio: {
			type: String,
			default: "",
		},

		skills: {
			type: [String],
			default: [],
		},

		isApproved: {
			type: Boolean,
			default: false,
		},

		isVerified: {
			type: Boolean,
			default: false,
		},

		verificationToken: {
			type: String,
			default: "",
		},

		savedJobs: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Job",
			},
		],
	},
	{ timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
