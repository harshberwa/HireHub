const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🔐 PROTECT ROUTES
const protect = async (req, res, next) => {
	try {
		if (!req.headers.authorization?.startsWith("Bearer")) {
			return res.status(401).json({
				message: "Not authorized, no token",
			});
		}

		const token = req.headers.authorization.split(" ")[1];

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findById(decoded.id).select("-password");

		if (!user) {
			return res.status(401).json({
				message: "User not found",
			});
		}

		req.user = user;

		next();
	} catch (error) {
		console.error("Auth Error:", error.message);

		return res.status(401).json({
			message: "Not authorized, token failed",
		});
	}
};

// 🔒 ROLE BASED ACCESS
const authorizeRoles = (...roles) => {
	return (req, res, next) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({
				message: `Access denied. Required role: ${roles.join(", ")}`,
			});
		}

		next();
	};
};

module.exports = { protect, authorizeRoles };
