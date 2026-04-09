import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function SavedJobs() {
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();

	// ✅ FETCH SAVED JOBS
	useEffect(() => {
		const fetchSaved = async () => {
			try {
				const res = await API.get("/users/saved-jobs");
				setJobs(res.data.jobs);
			} catch (err) {
				console.log(err);
			} finally {
				setLoading(false);
			}
		};

		fetchSaved();
	}, []);

	// ✅ REMOVE FROM SAVED
	const handleRemove = async (jobId) => {
		try {
			await API.post(`/users/save-job/${jobId}`);

			// 🔥 UI instant update
			setJobs((prev) => prev.filter((job) => job._id !== jobId));
		} catch (err) {
			console.log(err);
		}
	};

	// ✅ LOADING
	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen text-xl text-gray-700 dark:text-gray-300">
				Loading saved jobs...
			</div>
		);
	}

	return (
		<div className="px-6 md:px-10 py-12 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950">
			<h2 className="text-4xl font-bold mb-8 text-center text-blue-600 dark:text-purple-400">
				Saved Jobs ❤️
			</h2>

			{jobs.length === 0 ? (
				<p className="text-center text-gray-500 dark:text-gray-400">
					No saved jobs yet
				</p>
			) : (
				<div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{jobs.map((job) => (
						<div
							key={job._id}
							onClick={() => navigate(`/jobs/${job._id}`)}
							className="cursor-pointer flex flex-col justify-between min-h-[300px] backdrop-blur-xl bg-white/60 dark:bg-white/5 border border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition"
						>
							<div>
								<h3 className="text-xl font-bold text-gray-800 dark:text-white">
									{job.title}
								</h3>

								<p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
									{job.description}
								</p>

								<p className="text-sm text-gray-500 dark:text-gray-400">
									<b>Company:</b> {job.company}
								</p>

								<p className="text-sm text-gray-500 dark:text-gray-400">
									<b>Location:</b> {job.location}
								</p>

								<p className="text-green-500 font-semibold mt-2">
									Salary:{" "}
									{job.salary
										? `₹${new Intl.NumberFormat("en-IN").format(job.salary)} ${
												job.salaryType === "monthly"
													? "/month"
													: "/year"
											}`
										: "Not Disclosed"}
								</p>
							</div>

							{/* 🔥 REMOVE BUTTON */}
							<button
								onClick={(e) => {
									e.stopPropagation();
									handleRemove(job._id);
								}}
								className="mt-5 py-2 rounded-lg border border-red-400 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition"
							>
								Remove from Saved
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default SavedJobs;
