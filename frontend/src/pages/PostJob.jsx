import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function PostJob() {
	const [title, setTitle] = useState("");
	const [company, setCompany] = useState("");
	const [location, setLocation] = useState("");
	const [salary, setSalary] = useState("");
	const [salaryType, setSalaryType] = useState("yearly");
	const [description, setDescription] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!title || !company || !location || !description) {
			toast.error("Please fill all required fields");
			return;
		}

		try {
			setLoading(true);

			await API.post("/jobs", {
				title,
				company,
				location,
				salary: Number(salary) || 0,
				salaryType,
				description,
			});

			toast.success("Job posted successfully 🚀");

			setTitle("");
			setCompany("");
			setLocation("");
			setSalary("");
			setSalaryType("yearly");
			setDescription("");
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Something went wrong",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="px-6 md:px-10 py-12 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
			{/* SAME STYLE CARD */}
			<div className="w-full max-w-2xl backdrop-blur-xl bg-white/60 dark:bg-white/5 border border-white/20 p-8 rounded-2xl shadow-lg">
				<h2 className="text-4xl font-bold mb-8 text-center text-blue-600 dark:text-purple-400">
					Post a New Job
				</h2>

				<form onSubmit={handleSubmit} className="space-y-5">
					{/* TITLE */}
					<input
						type="text"
						placeholder="Job Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full px-4 py-3 rounded-lg border bg-white/70 dark:bg-gray-800/60 dark:text-white"
					/>

					{/* COMPANY */}
					<input
						type="text"
						placeholder="Company"
						value={company}
						onChange={(e) => setCompany(e.target.value)}
						className="w-full px-4 py-3 rounded-lg border bg-white/70 dark:bg-gray-800/60 dark:text-white"
					/>

					{/* LOCATION */}
					<input
						type="text"
						placeholder="Location"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						className="w-full px-4 py-3 rounded-lg border bg-white/70 dark:bg-gray-800/60 dark:text-white"
					/>

					{/* SALARY */}
					<div className="grid grid-cols-2 gap-4">
						<input
							type="number"
							placeholder="Salary"
							value={salary}
							onChange={(e) => setSalary(e.target.value)}
							className="w-full px-4 py-3 rounded-lg border bg-white/70 dark:bg-gray-800/60 dark:text-white"
						/>

						<select
							value={salaryType}
							onChange={(e) => setSalaryType(e.target.value)}
							className="w-full px-4 py-3 rounded-lg border bg-white/70 dark:bg-gray-800/60 dark:text-white"
						>
							<option value="yearly">Yearly</option>
							<option value="monthly">Monthly</option>
						</select>
					</div>

					{/* DESCRIPTION */}
					<textarea
						placeholder="Job Description..."
						rows="5"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="w-full px-4 py-3 rounded-lg border bg-white/70 dark:bg-gray-800/60 dark:text-white"
					/>

					{/* BUTTON */}
					<button
						type="submit"
						disabled={loading}
						className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] transition"
					>
						{loading ? "Posting..." : "Post Job"}
					</button>
				</form>
			</div>
		</div>
	);
}

export default PostJob;
