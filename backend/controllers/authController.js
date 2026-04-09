const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
	try {
		const { name, email, password, role } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({
				message: "Please fill all required fields",
			});
		}

		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({
				message: "User already exists",
			});
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			role: role || "student",
			isApproved: role === "hr" ? false : true, // 🔥 FIX
		});

		res.status(201).json({
			message:
				role === "hr"
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

module.exports = { registerUser, loginUser, uploadResume };
