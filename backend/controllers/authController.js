const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const registerUser = async (req, res) => {
	try {
		const { name, email, password, role } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({
				message: "Please fill all required fields",
			});
		}

		const finalRole = role || "student";

		const userExists = await User.findOne({ email });

		if (userExists) {
			// ✅ BETTER MESSAGE FOR UNVERIFIED STUDENT
			if (userExists.role === "student" && !userExists.isVerified) {
				return res.status(400).json({
					message:
						"Email already registered but not verified. Please verify your email first.",
				});
			}

			return res.status(400).json({
				message: "User already exists",
			});
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		let verificationToken = "";
		let isVerified = true;

		// ✅ ONLY STUDENT NEEDS EMAIL VERIFICATION
		if (finalRole === "student") {
			verificationToken = crypto.randomBytes(32).toString("hex");
			isVerified = false;
		}

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			role: finalRole,
			isApproved: finalRole === "hr" ? false : true,
			verificationToken,
			isVerified,
		});

		// ✅ SEND VERIFICATION EMAIL ONLY TO STUDENT
		if (user.role === "student") {
			try {
				const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

				await sendEmail({
					email: user.email,
					subject: "Verify your HireHub account",
					html: `
						<h2>Welcome to HireHub 🚀</h2>
						<p>Click the button below to verify your email:</p>
						<a href="${verifyUrl}" style="display:inline-block;padding:10px 18px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:6px;">
							Verify Email
						</a>
						<p style="margin-top:16px;">If the button does not work, copy this link:</p>
						<p>${verifyUrl}</p>
					`,
				});
			} catch (mailError) {
				// ✅ IF MAIL FAILS, DELETE USER
				await User.findByIdAndDelete(user._id);

				return res.status(500).json({
					message:
						"Failed to send verification email. Please try again.",
				});
			}
		}

		res.status(201).json({
			message:
				user.role === "student"
					? "Student registered successfully. Please verify your email."
					: user.role === "hr"
						? "HR registered. Waiting for admin approval"
						: "User Registered Successfully",
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				message: "Please provide email and password",
			});
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({
				message: "Invalid Email or Password",
			});
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({
				message: "Invalid Email or Password",
			});
		}

		// ✅ ONLY STUDENT NEEDS VERIFIED EMAIL
		if (user.role === "student" && !user.isVerified) {
			return res.status(403).json({
				message: "Please verify your email first",
			});
		}

		// ✅ HR STILL NEEDS ADMIN APPROVAL
		if (user.role === "hr" && !user.isApproved) {
			return res.status(403).json({
				message: "HR not approved by admin yet",
			});
		}

		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" },
		);

		res.json({
			message: "Login Successful",
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

const verifyEmail = async (req, res) => {
	try {
		const { token } = req.params;

		const user = await User.findOne({ verificationToken: token });

		if (!user) {
			return res.status(400).json({
				message: "Invalid or expired verification link",
			});
		}

		user.isVerified = true;
		user.verificationToken = "";
		await user.save();

		const jwtToken = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" },
		);

		res.json({
			message: "Email verified successfully 🎉",
			token: jwtToken,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

const uploadResume = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({
				message: "No file uploaded",
			});
		}

		const user = await User.findById(req.user._id);

		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		user.resume = `/uploads/${req.file.filename}`;
		await user.save();

		res.json({
			message: "Resume uploaded successfully",
			resume: user.resume,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	registerUser,
	loginUser,
	verifyEmail,
	uploadResume,
};
