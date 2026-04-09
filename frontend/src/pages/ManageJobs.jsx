import { useEffect, useState } from "react";

const ManageJobs = () => {
	const [jobs, setJobs] = useState([]);
	const [editingJob, setEditingJob] = useState(null);

	const token = localStorage.getItem("token");

	const fetchJobs = async () => {
		try {
			const res = await fetch("http://localhost:5000/api/jobs");
			const data = await res.json();
			setJobs(data.jobs || []);
		} catch (err) {
			console.log(err);
		}
	};

	const deleteJob = async (id) => {
		if (!window.confirm("Delete this job?")) return;

		try {
			await fetch(`http://localhost:5000/api/jobs/${id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setJobs((prev) => prev.filter((job) => job._id !== id));
		} catch (err) {
			console.log(err);
		}
	};

	const updateJob = async () => {
		try {
			await fetch(`http://localhost:5000/api/jobs/${editingJob._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(editingJob),
			});

			setEditingJob(null);
			fetchJobs();
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchJobs();
	}, []);

	return (
		<div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950">
			<h1 className="text-3xl font-bold mb-8 text-centerbg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
				Manage Jobs
			</h1>

			<div className="grid md:grid-cols-2 gap-6">
				{jobs.map((job) => (
					<div
						key={job._id}
						className="backdrop-blur-xl bg-white/40 dark:bg-white/5 border border-white/20 p-6 rounded-xl shadow"
					>
						<h2 className="text-xl font-bold">{job.title}</h2>

						<p className="text-gray-600 dark:text-gray-300">
							{job.company}
						</p>

						<p className="text-sm mt-2">{job.location}</p>

						<div className="flex gap-3 mt-4">
							<button
								onClick={() => setEditingJob(job)}
								className="px-4 py-1 bg-blue-500 text-white rounded"
							>
								Edit
							</button>

							<button
								onClick={() => deleteJob(job._id)}
								className="px-4 py-1 bg-red-500 text-white rounded"
							>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>

			{/* EDIT MODAL */}
			{editingJob && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/50">
					<div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
						<h2 className="text-xl mb-4">Edit Job</h2>

						<input
							value={editingJob.title}
							onChange={(e) =>
								setEditingJob({
									...editingJob,
									title: e.target.value,
								})
							}
							className="w-full mb-3 p-2 border rounded"
						/>

						<input
							value={editingJob.company}
							onChange={(e) =>
								setEditingJob({
									...editingJob,
									company: e.target.value,
								})
							}
							className="w-full mb-3 p-2 border rounded"
						/>

						<div className="flex justify-between">
							<button
								onClick={updateJob}
								className="bg-green-500 text-white px-4 py-1 rounded"
							>
								Save
							</button>

							<button
								onClick={() => setEditingJob(null)}
								className="bg-gray-500 text-white px-4 py-1 rounded"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ManageJobs;
