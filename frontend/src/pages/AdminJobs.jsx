import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function AdminJobs() {
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchJobs();
	}, []);

	const fetchJobs = async () => {
		try {
			const res = await API.get("/admin/jobs");
			setJobs(res.data.jobs);
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Delete this job?")) return;

		try {
			await API.delete(`/admin/jobs/${id}`);
			toast.success("Job deleted ✅");

			setJobs(jobs.filter((job) => job._id !== id));
		} catch (err) {
			toast.error("Delete failed");
		}
	};

	if (loading) {
		return <div className="text-center mt-20 text-lg">Loading jobs...</div>;
	}

	return (
		<div className="px-6 md:px-10 py-12 min-h-screen">
			<h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
				Admin Jobs Panel
			</h2>

			{jobs.length === 0 ? (
				<p className="text-center text-gray-500">No jobs available</p>
			) : (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
					{jobs.map((job) => (
						<div
							key={job._id}
							className="p-5 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-white/5 border border-white/20 shadow-md"
						>
							<h3 className="font-bold text-lg text-gray-900 dark:text-white">
								{job.title}
							</h3>

							<p className="text-gray-600 dark:text-gray-300">
								{job.company}
							</p>

							<p className="text-sm text-gray-500">
								📍 {job.location}
							</p>

							<p className="text-sm text-gray-500 mt-1">
								👤 {job.postedBy?.name || "Unknown"}
							</p>

							{/* DELETE BUTTON */}
							<button
								onClick={() => handleDelete(job._id)}
								className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
							>
								Delete Job
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default AdminJobs;
