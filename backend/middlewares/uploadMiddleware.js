const multer = require("multer");
const path = require("path");

// storage config
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "_"));
	},
});

// file filter (only pdf)
const fileFilter = (req, file, cb) => {
	if (file.mimetype === "application/pdf") {
		cb(null, true);
	} else {
		cb(new Error("Only PDF files allowed"), false);
	}
};

const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

module.exports = upload;
