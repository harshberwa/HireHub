import { useEffect, useState } from "react";
import API from "../services/api";
import EditJobModal from "../components/EditJobModal";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";

function MyJobs() {
	const [jobs, setJobs] = useState([]);
	const [selectedJob, setSelectedJob] = useState(null);
	const [deleteId, setDeleteId] = useState(null); // ✅ NEW

	const fetchMyJobs = async () => {
		try {
			const res = await API.get("/jobs/my-jobs");
			setJobs(res.data.jobs || []);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchMyJobs();
	}, []);

	// ✅ DELETE WITH MODAL
	const handleDelete = async () => {
		try {
			await API.delete(`/jobs/${deleteId}`);

			setJobs((prev) => prev.filter((job) => job._id !== deleteId));

			toast.success("Job deleted 🗑️");
		} catch (err) {
			toast.error("Delete failed");
		} finally {
			setDeleteId(null);
		}
	};

	// ✅ UPDATE UI WITHOUT REFRESH
	const handleUpdateJob = (updatedJob) => {
		setJobs((prev) =>
			prev.map((job) => (job._id === updatedJob._id ? updatedJob : job)),
		);
	};

	return (
		<div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950">
			<h1 className="text-4xl font-bold text-center mb-10 text-blue-600 dark:text-purple-400">
				My Jobs
			</h1>

			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
				{jobs.map((job) => (
					<div
						key={job._id}
						className="flex flex-col justify-between min-h-[280px] backdrop-blur-xl bg-white/60 dark:bg-white/5 border border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
					>
						<div>
							<h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
								{job.title}
							</h2>

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
								Salary: {job.salary || "Not Disclosed"}
							</p>
						</div>

						{/* ACTIONS */}
						<div className="flex gap-3 mt-5">
							{/* EDIT */}
							<button
								onClick={() => setSelectedJob(job)}
								className="w-full py-2 rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition"
							>
								Edit
							</button>

							{/* DELETE (OPEN MODAL) */}
							<button
								onClick={() => setDeleteId(job._id)}
								className="w-full py-2 rounded-lg text-white font-medium bg-red-500 hover:bg-red-600 transition"
							>
								Delete
							</button>
						</div>
					</div>
				))}

				{jobs.length === 0 && (
					<p className="text-center col-span-full text-gray-500 dark:text-gray-400">
						No jobs posted yet.
					</p>
				)}
			</div>

			{/* ✅ EDIT MODAL */}
			{selectedJob && (
				<EditJobModal
					job={selectedJob}
					onClose={() => setSelectedJob(null)}
					onUpdate={handleUpdateJob}
				/>
			)}

			{/* ✅ CONFIRM MODAL */}
			{deleteId && (
				<ConfirmModal
					message="Are you sure you want to delete this job?"
					onConfirm={handleDelete}
					onCancel={() => setDeleteId(null)}
				/>
			)}
		</div>
	);
}

export default MyJobs;
