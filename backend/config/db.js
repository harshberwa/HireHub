const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);

		console.log("MongoDB Connected Successfully");
		console.log("Host:", conn.connection.host);
		console.log("Database Name:", "HireHub");
	} catch (error) {
		console.error("Error:", error.message);
		process.exit(1);
	}
};

module.exports = connectDB;
