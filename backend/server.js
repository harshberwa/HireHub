const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authroutes");
const adminRoutes = require("./routes/adminRoutes");
const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require("./routes/userRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const { protect, authorizeRoles } = require("./middlewares/authMiddleware");

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);

app.use("/api/applications", applicationRoutes);
app.use("/api/notifications", notificationRoutes);

// Protected Profile Route
app.get("/api/profile", protect, (req, res) => {
	res.json({
		message: "Protected route working",
		user: req.user,
	});
});

// Role Based Routes
app.get("/api/admin", protect, authorizeRoles("admin"), (req, res) => {
	res.json({ message: "Welcome Admin 👑" });
});

app.get("/api/hr", protect, authorizeRoles("hr"), (req, res) => {
	res.json({ message: "Welcome HR 👔" });
});

app.get("/api/student", protect, authorizeRoles("student"), (req, res) => {
	res.json({ message: "Welcome Student 🎓" });
});

// Health Check
app.get("/", (req, res) => {
	res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
